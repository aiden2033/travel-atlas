# Design QA — Атлас

## Reference and evidence

- Selected visual truth: `docs/design/reference.png`, option 1 selected by the user.
- State: Malaysia / Langkawi / all categories, no favorites or visited marks.
- Desktop browser CSS viewport: 1487 × 1058, sidebar 236 CSS px; the photo grid starts at y=527 CSS px, matching the reference. Reference: 1487 × 1058 px.
- Screenshot: `docs/design/desktop.png`; normalized: `docs/design/desktop-normalized.png`.
- Initial captures used a tab with devicePixelRatio 1.2 and needed density normalization. Final production capture uses a fresh tab at devicePixelRatio 1. Raw full-page capture is 1472 × 3978 px (scrollbar excluded); its top 1058px is retained as desktop.png and normalized horizontally to 1487 × 1058 for comparison. No vertical stretching is applied to the final screenshot. Full-page capture avoids the browser viewport screenshot transport cropping at the host panel height.
- Combined comparison: `docs/design/comparison.png`.
- Focused card comparison: `docs/design/comparison-cards.png`.
- Mobile: 390 × 844 CSS px, screenshot `docs/design/mobile.png` and density-normalized `mobile-normalized.png`.
- Mobile constructor form: `docs/design/mobile-editor-normalized.png`.

## Comparison history

1. Initial capture (`desktop-initial.png`) had a hard edge on the hero photo, the wrong third featured card, and smaller card copy. P2: the visual balance and readability differed from the selected design. Fixed with a generated blended banner, Kilim in the third position, 14px card copy, 12px location labels and 11px tags.
2. The original extra controls pushed the photo grid down. P2: excessive vertical gap. Reduced toolbar and result-strip spacing while retaining functional search, map and status controls.
3. Mobile initially wrapped categories into several rows and hid the accessible name of the add button. P1/P2: the main action needed a name and filter density was poor. Added an explicit accessible name, horizontally scrollable filters, a smaller mobile hero and a single-column card layout.
4. Updated full-view and focused comparisons show the corrected content order, blended hero, typography, grid position and accessible controls. No actionable P0/P1/P2 differences remain.

## Required fidelity surfaces

- Typography: self-hosted Noto Serif for headings and Golos Text for UI; dominant country heading and serif card titles follow the chosen hierarchy. Body copy uses 14–16px with readable line heights. Long country names wrap instead of clipping.
- Layout: persistent country sidebar on desktop, shared country/city/category hierarchy, three-column photo grid; mobile has country/city strips and a single-column catalog. No page-wide horizontal overflow at 390px (document and client width both 377px excluding scrollbar).
- Colors: ivory #faf9f5, forest #123c2d, subtle neutral dividers, green/sand/blue/rose tag surfaces. No code-drawn illustrations or gradient replacements.
- Images: actual imported Cenang photograph retained; generated hero/bridge/Kilim illustrations match the concept's editorial treatment. Japan uses existing local photos; Singapore's main places use real attributed Wikimedia images. Subject/crop variations from the mock are intentional source-asset choices.
- Copy: all four countries use the same Russian interface; original historical trip facts are kept under dated source notes. Map/search/status controls, country-wide view and visited state are deliberate functional additions beyond the visual mock.

## Interaction verification

Verified in the in-app browser: category filtering, English search, favorite and visited marks, persistence after reload, country switching, creation of a temporary country/city/place, a custom tag, custom country section, coordinates, map view, JSON export, valid import, invalid import rejection, deletion and undo. Temporary content was removed by restoring the clean four-country backup. Mobile add-place dialog opens, scrolls and closes; primary controls have accessible names.

Production build and 8 migration/backup validation tests passed. npm audit reports zero vulnerabilities. Cold-load production preview at port 4177 was verified in a fresh browser tab after removing the inherited service worker activation handler that forcibly navigated clients. Country switching across Singapore, Indonesia and Japan, the Japanese notes page and booking page work. Browser console error log was empty. Singapore's first three cards use the expected distinct local photographs.

## Remaining follow-up polish

P3: the selected mock uses different thumbnail crops and scenic photographs; these do not block the shared guide experience. Additional real photographs can be added incrementally for places currently using their region cover.

## Deployment verification

GitHub Pages deployed successfully: https://aiden2033.github.io/travel-atlas/ . The deployed guide was opened in the in-app browser; the Malaysia catalog and project-subpath assets render, country and constructor links resolve under /travel-atlas/, and the browser console error log is empty.

final result: passed
