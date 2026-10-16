## 2026-10-16 11:42 — GPT-6

Loading Product Design saved context → the skill documents `scripts/user_context_preflight.py` relative to the plugin root, but the installed helper lives under `skills/user-context/scripts/`. Using that path succeeds.

## 2026-10-16 11:56 — GPT-6

Updating the build toolchain → npm could not resolve plugin-react 6's optional Babel 8 peers against the inherited Babel 7 tree. Use the maintained plugin-react 5 release with Vite 8 support rather than bypassing peer dependency checks.

## 2026-10-16 11:57 — GPT-6

Replacing App.tsx with apply_patch → deleting and adding the same path in one patch is rejected. Use a separate delete patch followed by the add patch.

## 2026-10-16 11:58 — GPT-6

Extracting winter HTML → BeautifulSoup is not installed in the default Python runtime. The migration uses Python's standard HTMLParser and requires no extra dependencies.

## 2026-10-16 12:05 — GPT-6

Converting generated assets → the default Python runtime has no Pillow. macOS sips handles JPEG conversion without adding a dependency.

## 2026-10-16 12:06 — GPT-6

Inspecting a source file with `rtk proxy cat ... | head` → RTK reports a broken pipe when head closes early. Read the required range directly with sed instead.

## 2026-10-16 12:10 — GPT-6

Testing after the Tailwind 3→4 upgrade → the existing Vite dev process retained the old PostCSS plugin and showed an obsolete CSS overlay even though a fresh production build passed. Restarting Vite loads the new plugin and resolves the overlay.

## 2026-10-16 12:22 — GPT-6

Capturing QA evidence in the in-app browser → viewport overrides use physical pixels while DOM dimensions reflect a 1.2 device scale factor; screenshot canvases include unpainted right/bottom margins. Record DOM size and density, crop the unpainted margins and normalize before comparison.

## 2026-10-16 12:23 — GPT-6

Switching from development to production preview → an in-app browser DOMSnapshot timed out and the following screenshot call stalled the REPL. Recover with a fresh tab/session before finishing production verification.

## 2026-10-16 12:24 — GPT-6

Reviewing the development server log → importing photo credit JSON from public/ produces Vite dev warnings although production bundling succeeds. Keep imported metadata under src/atlas/credits/ and leave image assets in public/.
