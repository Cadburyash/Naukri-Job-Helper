# Naukri-Job-Helper
A Chrome extension that streamlines job applications on Naukri with customizable experience filters, job categories, application limits, and processing delays, while supporting manual review of complex applications.


# Naukri Job Helper — v1.0.0

The initial prototype of Naukri Job Helper. This version explores a sequential workflow for collecting jobs, opening job details in separate tabs, and assisting with applications.

> Independent community project; not affiliated with or endorsed by Naukri. This README describes the intended behavior and known limitations of this version. Test the exact release you download before relying on it.

## Features in this version

- Initial Chrome extension popup and job-processing workflow.
- Initial job limit and delay controls for processing jobs sequentially.
- Basic attempt to locate and click the Apply control on a job-detail page.
- Basic handling intended to leave application flows requiring manual attention open.

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

Settings and behavior were prototype-level and may differ from later versions.

## Known limitations

- The first version relied on assumptions about ordinary job-detail links.
- On the Naukri Recommended Jobs layout tested later, it could find zero jobs because job cards did not expose a normal job-title anchor.
- Job URL detection, experience filtering, and application-state detection were prototypes and require careful testing.


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

## Feedback

Report issues or send feedback: <https://form.typeform.com/to/UaokdTEa>

When reporting a problem, include the extension version, Naukri page type, steps to reproduce, and any relevant console errors. Remove personal information before sharing.
