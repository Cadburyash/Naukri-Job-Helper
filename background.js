const DEFAULT_STATE = {
  running: false, opened: 0, success: 0, leftOpen: 0, maxJobs: 25,
  delayMs: 10000, categories: [], mode: 'assist', queue: [], sourceTabId: null,
  activeJobTabId: null, message: 'Ready.'
};
let state = { ...DEFAULT_STATE };
let pumpRunning = false;
const resultWaiters = new Map();
const processedTabs = new Set();

async function saveState() { await chrome.storage.local.set({ naukriRunState: state }); }
async function loadState() {
  const stored = await chrome.storage.local.get(['naukriRunState']);
  if (stored.naukriRunState) state = { ...DEFAULT_STATE, ...stored.naukriRunState };
}
function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

chrome.runtime.onInstalled.addListener(async () => { await loadState(); await saveState(); });
chrome.runtime.onStartup.addListener(loadState);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === 'START_RUN') {
      state = {
        ...DEFAULT_STATE, running: true, opened: 0, success: 0, leftOpen: 0,
        maxJobs: Math.max(1, Math.min(25, Number(msg.maxJobs) || 25)),
        delayMs: Math.max(10000, Number(msg.delayMs) || 10000),
        categories: Array.isArray(msg.categories) ? msg.categories : [],
        mode: msg.mode === 'review' ? 'review' : 'assist',
        sourceTabId: msg.sourceTabId, message: 'Collecting matching job cards…'
      };
      processedTabs.clear();
      await saveState();
      try {
        const result = await chrome.tabs.sendMessage(msg.sourceTabId, {
          type: 'COLLECT_JOBS', categories: state.categories, maxJobs: state.maxJobs
        });
        state.queue = (result?.jobs || []).slice(0, state.maxJobs);
        state.message = state.queue.length
          ? `Found ${state.queue.length} matching job(s).`
          : 'Found 0 matching jobs. Check that job cards show experience ranges entirely within 0–4 years, or leave category filters blank.';
        await saveState();
        if (state.queue.length) pumpQueue(); else state.running = false, await saveState();
      } catch (e) {
        state.running = false;
        state.message = `Could not read this page: ${String(e).slice(0, 130)}. Refresh Naukri and try again.`;
        await saveState();
      }
      sendResponse({ ok: true });
    } else if (msg.type === 'STOP_RUN') {
      state.running = false;
      state.message = 'Stop requested. The current job may finish its current step.';
      await saveState();
      sendResponse({ ok: true });
    } else if (msg.type === 'JOB_RESULT') {
      const tabId = sender.tab?.id;
      if (tabId != null && processedTabs.has(tabId)) { sendResponse({ ok: true }); return; }
      if (tabId != null) processedTabs.add(tabId);
      if (msg.result === 'success') {
        state.success++;
        state.message = `Confirmed application success for: ${msg.title || 'job'}. Closing Naukri success tab.`;
        await saveState();
        if (tabId != null) { try { await chrome.tabs.remove(tabId); } catch (_) {} }
      } else if (['manual', 'external', 'uncertain'].includes(msg.result)) {
        state.leftOpen++;
        state.message = `${msg.title || 'Job'} left open for manual review (${msg.result}).`;
        await saveState();
      }
      if (state.activeJobTabId === tabId) state.activeJobTabId = null;
      const resolveResult = resultWaiters.get(tabId);
      if (resolveResult) { resultWaiters.delete(tabId); resolveResult(msg.result || 'uncertain'); }
      sendResponse({ ok: true });
    }
  })();
  return true;
});

async function pumpQueue() {
  if (pumpRunning) return;
  pumpRunning = true;
  try {
    while (state.running && state.queue.length && state.opened < state.maxJobs) {
      const job = state.queue.shift();
      state.message = `Opening ${state.opened + 1}/${state.maxJobs}: ${job.title}`;
      await saveState();
      let tab;
      try {
        tab = await chrome.tabs.create({ url: job.url, active: true });
        state.activeJobTabId = tab.id;
        state.opened++;
        // Register the waiter before navigation completes to avoid losing a fast result.
        const resultPromise = new Promise(resolve => {
          resultWaiters.set(tab.id, resolve);
          setTimeout(() => {
            if (resultWaiters.has(tab.id)) {
              resultWaiters.delete(tab.id);
              resolve('timeout');
            }
          }, 45000);
        });
        await saveState();
        const outcome = await resultPromise;
        if (outcome === 'timeout') {
          state.leftOpen++;
          state.message = `${job.title} timed out; left open for manual review.`;
          if (state.activeJobTabId === tab.id) state.activeJobTabId = null;
          await saveState();
        }
        if (state.running && state.queue.length && state.opened < state.maxJobs) await wait(state.delayMs);
      } catch (e) {
        state.message = `Could not open ${job.title}: ${String(e).slice(0, 100)}`;
        await saveState();
      }
    }
    if (state.running) {
      state.running = false;
      state.message = state.queue.length ? 'Reached the configured job limit.' : 'Finished the collected matching jobs.';
      await saveState();
    }
  } finally {
    pumpRunning = false;
    await saveState();
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !state.running || tabId !== state.activeJobTabId) return;
  if (!tab.url?.includes('naukri.com')) return;
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: 'PROCESS_JOB', title: '', mode: state.mode, delayMs: state.delayMs
    });
  } catch (_) {
    // Content script may still be initializing; retry once shortly after load.
    await wait(700);
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: 'PROCESS_JOB', title: '', mode: state.mode, delayMs: state.delayMs
      });
    } catch (_) {}
  }
});
