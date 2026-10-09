Naukri Job Helper — Chrome Extension (Manifest V3)

VERSION 1.1.0 — FIXED JOB-CARD COLLECTION

WHAT IT DOES
- Reads Naukri search cards using article.jobTuple and data-job-id, which are present on the current Recommended Jobs/search layout.
- Builds a standard Naukri job-listing URL from the card title, company, location, experience, and job ID.
- Includes fresher/entry-level jobs and numeric experience ranges where both the minimum and maximum are 4 years or less. Jobs such as 3-5, 3-7, or 4-8 years are excluded because their upper bound exceeds 4.
- Optional title keywords can limit categories. Leave blank to include all categories on the page that meet the experience filter.
- Opens jobs sequentially, waits at least 10 seconds between attempts, and caps a run at 25 jobs.
- In Assist mode, waits for the job page, then clicks a visible Apply button.
- Leaves question forms, external application flows, and uncertain results open.
- Closes a Naukri tab only after a clear application-success message is detected.

INSTALL / UPDATE
1. Extract this ZIP to a permanent folder.
2. Open chrome://extensions in Chrome and enable Developer mode.
3. If an older Naukri Job Helper is installed, click its Reload button after replacing the files, or remove it and Load unpacked the extracted naukri_helper folder.
4. Open a Naukri search/Recommended Jobs page and let the cards load.
5. Click the extension icon, optionally enter comma-separated title keywords, set the limit and delay, then Start on this page.

IMPORTANT
- This version fixes the prior issue where it searched only for ordinary job links. Current Naukri cards expose data-job-id instead.
- The job detail route is constructed from the card metadata and ID. Naukri may change URL formats, so test with 1–2 jobs first and confirm the first tab opens the intended job before running a larger batch.
- Only jobs already loaded on the current page are collected. This extension does not paginate or infinite-scroll to load more jobs.
- Experience filtering uses the card's dedicated experience text where available and rejects ranges whose upper bound is greater than 4.
- Screening dialogs and some external flows can vary; monitor the first few attempts. It does not fill screening answers.
- Use on your own account and review each application. Stop the run if any job URL or application flow behaves unexpectedly.
