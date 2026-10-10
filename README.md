# Naukri Job Helper — v1.2.0

Version 1.2.0 adds configurable experience targeting and processing settings, so users are not restricted to a fixed experience range.

> Independent community project; not affiliated with or endorsed by Naukri. This README describes the intended behavior and known limitations of this version. Test the exact release you download before relying on it.

## Features in this version

- Configurable minimum and maximum experience settings.
- Optional comma-separated job-title keywords, such as `Java Developer, Backend Developer, Spring Boot Developer`.
- Configurable maximum jobs per run, up to 25.
- Configurable delay in seconds between processing steps.
- Assist mode to open job pages and attempt to click Apply.
- Review-only mode to open matching job pages without clicking Apply.
- Question forms, external application flows, and uncertain outcomes are intended to remain open for manual review.

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

Set the minimum and maximum experience, optional job-title keywords, maximum jobs, delay, and mode in the extension popup.

## Known limitations

- At this stage, experience matching was described as requiring the advertised range to fit within the selected range; overlap matching was introduced later.
- Application and success detection are best-effort and should be supervised.
- Only currently loaded listings are processed.


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

## Feedback

Report issues or send feedback: <https://form.typeform.com/to/UaokdTEa>

When reporting a problem, include the extension version, Naukri page type, steps to reproduce, and any relevant console errors. Remove personal information before sharing.
