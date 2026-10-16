## 2026-08-14 10:12 — Codex GPT-5

Creating a draft PR through the GitHub app connector → the connector returned `403 Resource not accessible by integration` even though the repository was reachable. Use the authenticated `gh pr create` fallback when connector permissions do not allow PR creation.

## 2026-08-14 10:12 — Codex GPT-5

Checking whether `PAPERCUTS.md` existed with `rtk test -f` → RTK forwarded the command incorrectly and printed shell usage. Use `rtk rg --files -g 'PAPERCUTS.md'` for this existence check.

## 2026-08-14 10:13 — Codex GPT-5

Staging the required `PAPERCUTS.md` log → a global gitignore rule ignored the file even though the repository `.gitignore` did not. Stage this repository-required file explicitly with `git add -f PAPERCUTS.md`.

## 2026-08-14 10:18 — Codex GPT-5

Resolving exact lodging coordinates → direct Nominatim URLs were rejected by the web opener as unsafe and the source site's Google static-map image returned `403`, even though its URL exposed the coordinates. Fall back to the source page/PDF map links and inspect redirect or static-map URL parameters.

## 2026-08-14 13:13 — Codex GPT-5

Fast-forwarding the finished feature branch into the updated default branch → pull request #2 had already merged the branch up to its previous tip, so the new marker commit diverged from the merge commit and `--ff-only` correctly stopped. Cherry-pick only the unmerged commit onto the current `main`.

## 2026-08-28 12:45 — Codex GPT-5

Reloading a previously delivered in-app-browser tab after restoring its SSH tunnel → the saved tab handle returned `Unknown tab` while both current and user tab lists were empty. Treat delivered browser handles as potentially stale across sessions and create a fresh tab when discovery returns no matching tab.

## 2026-08-29 15:02 — Codex GPT-5

Searching the codebase knowledge graph with the repository name `japan-trip` → the graph required the generated identifier `Users-dmitrijbyckov-repos-japan-trip`. Use the exact identifier from the tool's available-projects response.

## 2026-08-29 15:02 — Codex GPT-5

Restoring a generated file with one patch containing both delete and add operations → `apply_patch` rejected multiple operations for the same path. Use a single update hunk with the current and desired content instead.

## 2026-08-31 22:35 — Codex GPT-5

Running the required production build after a calendar-only edit → TypeScript rewrote the tracked but ignored `tsconfig.tsbuildinfo` because its cached root list was stale. Keep generated build metadata out of the feature commit or stop tracking the file so routine verification leaves the worktree clean.

## 2026-10-16 12:37 — GPT-6

Formatting the new atlas changes with the package format script → no Prettier configuration exists, so its defaults rewrote the established single-quote style. Use --single-quote for targeted formatting or add a matching configuration.

## 2026-10-16 12:40 — GPT-6

Bulk Commons photo research → three concurrent 50-result metadata searches triggered HTTP 429. Retry sequentially with fewer results, a request delay, and explicit error status instead of treating failed searches as missing photos. Openverse public image API returned HTTP 403 in this environment.

## 2026-10-16 12:43 — GPT-6

Applying a combined photo-metadata patch → formatting had already split the target line, so the patch failed atomically. Read the current lines and apply smaller patches after formatting.

## 2026-10-16 12:49 — GPT-6

Photo research coverage → Commons returned a structured search-busy error with HTTP200, so the first cache implementation treated the response as successful. Retry API-level errors and keep them separate from no-match results.

## 2026-10-16 12:53 — GPT-6

Commons image downloads → some original and 1920px thumbnail URLs returned HTTP429 robot-policy responses while official 1280px thumbnails worked. Use the available 1280px derivative without UTM parameters and download sequentially; retain original dimensions separately in the license manifest.

## 2026-10-16 12:57 — GPT-6

Orchestrating a Python query through exec → mixed property-key quoting caused a JavaScript parse error before the shell ran. Keep orchestration object keys unquoted and use raw strings only for command arguments.

## 2026-10-16 12:57 — GPT-6

Locating the legacy place detail → an assumed components/PlaceDetail.tsx path did not exist; the graph identifies src/pages/PlaceDetail.tsx. Use the returned path directly.

## 2026-10-16 13:03 — GPT-6

Normalizing Commons thumbnails → a wide panorama loses much of its width in a 3:2 crop. Check actual cropped pixel dimensions, request a larger thumbnail or original for very wide images, and avoid rejecting a clear 789px crop solely because of an arbitrary 800px threshold.
