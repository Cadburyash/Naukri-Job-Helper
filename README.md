# Naukri Job Helper — v1.3.0

Version 1.3.0 improves the popup's clarity and status presentation, while keeping configurable job and experience filters.

> Independent community project; not affiliated with or endorsed by Naukri. This README describes the intended behavior and known limitations of this version. Test the exact release you download before relying on it.

## Features in this version

- Adds a direct link to the Naukri Recommended Jobs page: https://www.naukri.com/mnjuser/recommendedjobs.
- Removes the long experience-filter explanation from the popup.
- Shows the Running status in bold sky blue and the Stopped status in bold black.
- Renames the successful-application counter to `Successfully Applied`.
- Displays a numbered disclaimer: question forms and external application sites remain open; tabs close only after a clear success message; users should review applications and stop if a page behaves unexpectedly.
- Adds a report-issue and feedback link: https://form.typeform.com/to/UaokdTEa.
- Retains configurable experience range, optional job categories, maximum jobs, delay, Assist mode, and Review-only mode.

## Installation

1. Download the ZIP asset for this version from the GitHub release, then extract it.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted `naukri_helper` folder—the folder containing `manifest.json`.
6. Sign in to Naukri and open a job-listing page.

## How to use

1. Open Naukri job listings. For versions that support it, the recommended starting page is <https://www.naukri.com/mnjuser/recommendedjobs>.
2. Wait for the job cards to finish loading.
3. Click the Naukri Job Helper icon.
4. Configure the settings available in this version.
5. Start with one or two jobs and verify that the correct job pages open.
6. Review any tabs left open for screening questions, external applications, or uncertain outcomes.

## Settings and behavior

Recommended starting page: https://www.naukri.com/mnjuser/recommendedjobs. Set experience range, optional categories, batch size, delay, and mode in the popup. Test with one or two jobs after updating.

## Known limitations

- Selectors and success detection depend on Naukri's current markup and may need maintenance.
- Duplicate-application prevention should not be assumed to be perfect; check application status before applying.
- Only currently loaded job cards are processed; the extension does not automatically paginate through all search results.


## Responsible use and limitations

- This is an independent browser helper, not an official Naukri product.
- Naukri can change its page layout and application flow; features may need updates.
- Review every application. Stop the run if a page behaves unexpectedly.
- Screening-question forms and external company application flows may require manual work.
- A detected success message is not a substitute for checking your Naukri application status.
- The extension processes jobs loaded on the current page; it does not necessarily traverse every page of results.
- Never share your Naukri password, session cookies, or other account secrets.


## Version history

- **v1.0.0:** Initial prototype.
- **v1.1.0:** Job-card detection based on `article.jobTuple` and `data-job-id`.
- **v1.2.0:** Configurable experience range, job-title keywords, batch limit, delay, and review-only mode.
- **v1.2.1:** Experience-range overlap matching.
- **v1.3.0:** Popup, status display, recommended-jobs link, disclaimer, and feedback-link improvements.

Only changes up to **v1.3.0** are intended to be represented by this version-specific README. For a release, publish the README alongside the matching extension source and ZIP so users can see the correct historical documentation.

## Feedback

Report issues or send feedback: <https://form.typeform.com/to/UaokdTEa>

When reporting a problem, include the extension version, Naukri page type, steps to reproduce, and any relevant console errors. Remove personal information before sharing.
