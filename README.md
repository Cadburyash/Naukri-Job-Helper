# Naukri Job Helper — v1.2.1

Version 1.2.1 changes experience filtering to use range overlap. This is useful when a job advertises a wider range but someone within the user's target range may still qualify.

> Independent community project; not affiliated with or endorsed by Naukri. This README describes the intended behavior and known limitations of this version. Test the exact release you download before relying on it.

## Features in this version

- Includes a job when its advertised experience range overlaps the selected range.
- Example: selecting 0–4 years includes listings advertised as 3–6 or 3–7 years.
- Includes ranges such as 2–4 for a selected 0–4 range.
- Excludes ranges with no overlap, such as 5–8 when selecting 0–4.
- Recognizes common Fresher/Freshers/Entry-level labels as zero-experience listings when the selected range includes zero, where those labels are detected.

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

Configure the minimum and maximum experience in the popup. A listing is eligible when `advertised_minimum <= selected_maximum` and `advertised_maximum >= selected_minimum`.

## Known limitations

- Experience text must be recognizable by the extension; unusual formats may be skipped.
- Range overlap does not guarantee that an employer will accept every applicant in the overlap.
- All application flows still require user supervision.


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


## Feedback

Report issues or send feedback: <https://form.typeform.com/to/UaokdTEa>

When reporting a problem, include the extension version, Naukri page type, steps to reproduce, and any relevant console errors. Remove personal information before sharing.
