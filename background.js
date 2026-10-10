const DEFAULT_STATE = {
  running: false, opened: 0, success: 0, leftOpen: 0, skipped: 0, maxJobs: 25,
  delayMs: 10000, categories: [], mode: 'assist', queue: [], sourceTabId: null,
  activeJobTabId: null, activeJobId: null, message: 'Ready.'
};
let state = { ...DEFAULT_STATE };
let pumpRunning = false;
const resultWaiters = new Map();
const processedTabs = new Set();
const tabJobs = new Map();
const APPLIED_IDS_KEY = 'naukriKnownAppliedIds';

async function saveState() { await chrome.storage.local.set({ naukriRunState: state }); }
async function loadState() {
  const stored = await chrome.storage.local.get(['naukriRunState']);
  if (stored.naukriRunState) state = { ...DEFAULT_STATE, ...stored.naukriRunState };
}
async function getAppliedIds() {
  const stored = await chrome.storage.local.get([APPLIED_IDS_KEY]);
  return new Set(Array.isArray(stored[APPLIED_IDS_KEY]) ? stored[APPLIED_IDS_KEY].map(String) : []);
}
async function rememberApplied(id) {
  if (id == null || String(id) === '') return;
  const ids = await getAppliedIds();
  ids.add(String(id));
  await chrome.storage.local.set({ [APPLIED_IDS_KEY]: [...ids] });
}
function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

chrome.runtime.onInstalled.addListener(async () => { await loadState(); await saveState(); });
chrome.runtime.onStartup.addListener(loadState);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === 'START_RUN') {
      state = {
        ...DEFAULT_STATE, running: true, opened: 0, success: 0, leftOpen: 0, skipped: 0,
        maxJobs: Math.max(1, Math.min(25, Number(msg.maxJobs) || 25)),
        delayMs: Math.max(1000, Math.min(120000, Number(msg.delayMs) || 10000)),
        categories: Array.isArray(msg.categories) ? msg.categories : [],
        mode: msg.mode === 'review' ? 'review' : 'assist',
        sourceTabId: msg.sourceTabId, message: 'Collecting matching job cards…'
      };
      processedTabs.clear();
      tabJobs.clear();
      await saveState();
      try {
        const knownApplied = await getAppliedIds();
        const result = await chrome.tabs.sendMessage(msg.sourceTabId, {
          type: 'COLLECT_JOBS', categories: state.categories
        });
        const allJobs = result?.jobs || [];
        // Cards already marked Applied and jobs successfully applied in prior runs do not consume the quota.
        for (const job of allJobs) {
          if (job.alreadyApplied || knownApplied.has(String(job.jobId))) {
            await rememberApplied(job.jobId);
            state.skipped++;
          } else {
            state.queue.push(job);
          }
        }
        state.message = state.queue.length
          ? `Found ${state.queue.length} not-yet-applied matching job(s); already-applied jobs will be skipped.`
          : 'No new matching jobs found. Try another listing page or adjust categories/experience filters.';
        await saveState();
        if (state.queue.length) pumpQueue(); else { state.running = false; await saveState(); }
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
      const jobId = String(msg.jobId || tabJobs.get(tabId)?.jobId || '');
      if (msg.result === 'success' || msg.result === 'alreadyApplied') {
        await rememberApplied(jobId);
        if (msg.result === 'alreadyApplied') {
          state.opened = Math.max(0, state.opened - 1); // Does not consume the new-application quota.
          state.skipped++;
          state.message = `${msg.title || 'Job'} already shows Applied; closing its tab and continuing to find a replacement.`;
        } else {
          state.success++;
          state.message = `Confirmed application success for: ${msg.title || 'job'}. Closing Naukri success tab.`;
        }
        await saveState();
        if (tabId != null) { try { await chrome.tabs.remove(tabId); } catch (_) {} }
      } else if (['manual', 'external', 'uncertain'].includes(msg.result)) {
        state.leftOpen++;
        state.message = `${msg.title || 'Job'} left open for manual review (${msg.result}).`;
        await saveState();
      }
      if (state.activeJobTabId === tabId) { state.activeJobTabId = null; state.activeJobId = null; }
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
      const knownApplied = await getAppliedIds();
      if (job.alreadyApplied || knownApplied.has(String(job.jobId))) {
        await rememberApplied(job.jobId);
        state.skipped++;
        state.message = `Skipping previously applied job: ${job.title}`;
        await saveState();
        continue;
      }
      state.message = `Opening candidate ${state.opened + 1}/${state.maxJobs}: ${job.title}`;
      await saveState();
      let tab;
      try {
        tab = await chrome.tabs.create({ url: job.url, active: true });
        state.activeJobTabId = tab.id;
        state.activeJobId = String(job.jobId);
        tabJobs.set(tab.id, job);
        state.opened++;
        const resultPromise = new Promise(resolve => {
          resultWaiters.set(tab.id, resolve);
          setTimeout(() => {
            if (resultWaiters.has(tab.id)) {
              resultWaiters.delete(tab.id);
              resolve('timeout');
            }
          }, 60000);
        });
        await saveState();
        const outcome = await resultPromise;
        if (outcome === 'timeout') {
          state.leftOpen++;
          state.message = `${job.title} timed out; left open for manual review.`;
          if (state.activeJobTabId === tab.id) { state.activeJobTabId = null; state.activeJobId = null; }
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
      state.message = state.opened >= state.maxJobs
        ? 'Reached the configured number of new job attempts.'
        : 'Finished the collected matching jobs; no more unprocessed matches were available on this page.';
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
  const job = tabJobs.get(tabId) || {};
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: 'PROCESS_JOB', title: job.title || '', jobId: job.jobId || state.activeJobId,
      mode: state.mode, delayMs: state.delayMs
    });
  } catch (_) {
    await wait(700);
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: 'PROCESS_JOB', title: job.title || '', jobId: job.jobId || state.activeJobId,
        mode: state.mode, delayMs: state.delayMs
      });
    } catch (_) {}
  }
});
