## 2026-08-14 10:12 — Codex GPT-5

Creating a draft PR through the GitHub app connector → the connector returned `403 Resource not accessible by integration` even though the repository was reachable. Use the authenticated `gh pr create` fallback when connector permissions do not allow PR creation.

## 2026-08-14 10:12 — Codex GPT-5

Checking whether `PAPERCUTS.md` existed with `rtk test -f` → RTK forwarded the command incorrectly and printed shell usage. Use `rtk rg --files -g 'PAPERCUTS.md'` for this existence check.

## 2026-08-14 10:13 — Codex GPT-5

Staging the required `PAPERCUTS.md` log → a global gitignore rule ignored the file even though the repository `.gitignore` did not. Stage this repository-required file explicitly with `git add -f PAPERCUTS.md`.
