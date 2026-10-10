const $ = (id) => document.getElementById(id);

async function refreshStatus() {
  const state = await chrome.storage.local.get(['naukriRunState']);
  const s = state.naukriRunState;
  if (s) {
    $('status').textContent = `${s.running ? 'Running' : 'Stopped'}\nNew jobs processed: ${s.opened || 0} / ${s.maxJobs || 25}\nAlready-applied jobs skipped: ${s.skipped || 0}\nApplied-success pages closed: ${s.success || 0}\nLeft open for review: ${s.leftOpen || 0}\n${s.message || ''}`;
  }
}

$('start').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.includes('naukri.com')) {
    $('status').textContent = 'Open your Naukri job-listing page first, then click Start.';
    return;
  }
  const maxJobs = Math.max(1, Math.min(25, Number($('maxJobs').value) || 25));
  const delaySeconds = Math.max(1, Math.min(120, Number($('delay').value) || 10));
  const categories = $('categories').value.split(',').map(x => x.trim()).filter(Boolean);
  const mode = $('mode').value;
  await chrome.runtime.sendMessage({ type: 'START_RUN', sourceTabId: tab.id, maxJobs, delayMs: delaySeconds * 1000, categories, mode });
  $('status').textContent = 'Starting… keep this Naukri window open.';
  setTimeout(refreshStatus, 500);
});

$('stop').addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'STOP_RUN' });
  $('status').textContent = 'Stop requested. The current job will be allowed to finish its current step.';
  setTimeout(refreshStatus, 500);
});

refreshStatus();
