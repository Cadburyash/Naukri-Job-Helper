# Naukri Job Helper — v1.1.0

Version 1.1.0 improves job discovery for the Naukri listing layout used during testing.

> Independent community project; not affiliated with or endorsed by Naukri. This README describes the intended behavior and known limitations of this version. Test the exact release you download before relying on it.

## Features in this version

- Finds job cards using the `article.jobTuple` structure.
- Reads the job ID from the card's `data-job-id` attribute.
- Reads the job title and experience information from the card text.
- Builds a job-detail URL using card metadata and the job ID, since the title was not an ordinary anchor in the tested layout.
- Retains the sequential tab-processing concept from the initial prototype.

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

Use a small job limit while verifying that the extension opens the correct job detail page.

## Known limitations

- Constructed URLs must be verified against the selected job before running a batch.
- Experience filtering and page detection depend on Naukri's rendered text and markup.
- Only jobs loaded on the current page are considered.


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

## Feedback

Report issues or send feedback: <https://form.typeform.com/to/UaokdTEa>

When reporting a problem, include the extension version, Naukri page type, steps to reproduce, and any relevant console errors. Remove personal information before sharing.
