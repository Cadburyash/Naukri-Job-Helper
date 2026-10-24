function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
function visible(el) { return !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'; }
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function experienceMatches(text, minExperience = 0, maxExperience = 4) {
  const t = (text || '').replace(/[–—]/g, '-');
  const matches = [...t.matchAll(/\b(\d+)\s*(?:-|to)\s*(\d+)\s*(?:years?|yrs?)\b/ig)];
  for (const m of matches) {
    const min = Number(m[1]), max = Number(m[2]);
    // Include jobs whose advertised range overlaps the selected range.
    // Example: selected 0–4 includes advertised 3–6 and 3–7 because those jobs
    // can consider candidates with 3–4 years of experience.
    if (min <= max && min <= maxExperience && max >= minExperience) return true;
  }
  if (/\b(fresher|freshers|entry[- ]level)\b/i.test(t)) return minExperience <= 0 && maxExperience >= 0;
  return false;
}

function slugify(s) {
  return (s || '').toLowerCase()
    .replace(/&amp;/g, 'and').replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140)
    .replace(/-+$/g, '');
}

function getCardTitle(card) {
  return norm(card.querySelector('p.title, .title[title], h2, h3')?.getAttribute('title') ||
              card.querySelector('p.title, .title, h2, h3')?.innerText || 'Job listing');
}

function getCardExperience(card) {
  const expEl = card.querySelector('li.experience, .experience, [class*="experience"]');
  return norm(expEl?.innerText || '');
}

function collectJobs(categories, maxJobs, minExperience = 0, maxExperience = 4) {
  const cards = [...document.querySelectorAll('article.jobTuple[data-job-id], article.jobTuple')];
  const seen = new Set();
  const jobs = [];
  for (const card of cards) {
    const id = norm(card.getAttribute('data-job-id'));
    if (!id || seen.has(id)) continue;

    const title = getCardTitle(card);
    const text = norm(card.innerText || '');
    const expText = getCardExperience(card) || text;
    if (!experienceMatches(expText, minExperience, maxExperience)) continue;
    if (categories.length && !categories.some(c => title.toLowerCase().includes(c.toLowerCase()))) continue;

    // Naukri's current search cards expose data-job-id instead of a job-title anchor.
    // Construct the standard job-listing route from the card metadata.
    const company = norm(card.querySelector('.comp-name, .companyInfo .subTitle, .subTitle')?.innerText || '');
    const location = norm(card.querySelector('li.location, .location')?.innerText || '');
    const exp = norm(expText).replace(/\s+/g, '-').toLowerCase();
    const slug = slugify([title, company, location, exp].filter(Boolean).join('-'));
    const url = `https://www.naukri.com/job-listings-${slug}-${id}`;
    seen.add(id);
    jobs.push({ title, url, jobId: id, experience: expText });
    if (jobs.length >= maxJobs) break;
  }
  return jobs;
}

function findApplyControl() {
  const els = [...document.querySelectorAll('button, a, [role="button"]')].filter(visible);
  return els.find(el => /^apply(?: now)?$/i.test(norm(el.innerText || el.getAttribute('aria-label')))) ||
         els.find(el => /^apply$/i.test(norm(el.getAttribute('aria-label'))));
}
function pageText() { return norm(document.body?.innerText || ''); }
function hasSuccessMessage() {
  const t = pageText();
  return /Applied to\s*["“][^"”]+["”]/i.test(t) || /application (?:submitted|successful|successfully submitted)/i.test(t) || /you have successfully applied/i.test(t);
}
function questionFormVisible() {
  const t = pageText().toLowerCase();
  const visibleInputs = [...document.querySelectorAll('input, textarea, select')].filter(visible);
  const asks = /additional questions|screening questions|answer the following|questions from employer|please answer|questionnaire/i.test(t);
  return asks && visibleInputs.length > 0;
}
function hasExternalApplicationLink() {
  return [...document.querySelectorAll('a[href]')].some(a => {
    try {
      const u = new URL(a.href);
      return visible(a) && !u.hostname.endsWith('naukri.com') && /apply|career|candidate|application/i.test((a.innerText || '') + ' ' + a.href);
    } catch (_) { return false; }
  });
}

let processing = false;
let processStartedAt = 0;
async function processJob(opts = {}) {
  if (processing) return;
  processing = true;
  processStartedAt = Date.now();
  const title = opts.title || document.title || 'Job';
  const mode = opts.mode || 'assist';
  const waitMs = Math.max(1000, Number(opts.delayMs) || 10000);
  try {
    // Give job detail content time to hydrate.
    await delay(waitMs);
    if (hasSuccessMessage()) {
      chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'success', title });
      return;
    }
    if (questionFormVisible()) {
      chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'manual', title });
      return;
    }
    if (mode === 'review') {
      chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'uncertain', title });
      return;
    }
    const apply = findApplyControl();
    if (!apply) {
      if (hasExternalApplicationLink()) {
        chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'external', title });
      } else {
        chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'uncertain', title });
      }
      return;
    }
    apply.click();
    // Observe page changes after clicking Apply. Never close unless explicit success is detected.
    const end = Date.now() + 12000;
    while (Date.now() < end) {
      await delay(500);
      if (hasSuccessMessage()) {
        chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'success', title });
        return;
      }
      if (questionFormVisible()) {
        chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'manual', title });
        return;
      }
      if (hasExternalApplicationLink()) {
        chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'external', title });
        return;
      }
    }
    chrome.runtime.sendMessage({ type: 'JOB_RESULT', result: 'uncertain', title });
  } finally {
    processing = false;
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'COLLECT_JOBS') {
    sendResponse({ jobs: collectJobs(msg.categories || [], msg.maxJobs || 25, Number(msg.minExperience ?? 0), Number(msg.maxExperience ?? 4)) });
  } else if (msg.type === 'PROCESS_JOB') {
    processJob(msg);
    sendResponse({ ok: true });
  }
  return true;
});

// If the background message arrived before this script was ready, recover the active run state.
(async () => {
  try {
    const { naukriRunState } = await chrome.storage.local.get(['naukriRunState']);
    if (naukriRunState?.running && naukriRunState.activeJobTabId != null) {
      const tab = await chrome.runtime.sendMessage({ type: 'PING' }).catch(() => null);
      // The background normally sends PROCESS_JOB on tab load; this is intentionally a no-op fallback.
    }
  } catch (_) {}
})();
