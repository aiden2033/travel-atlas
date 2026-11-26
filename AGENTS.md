# Repository Guidelines

## Project Structure

- `src/main.tsx` boots the React app, and `src/App.tsx` defines the atlas routes. `src/atlas/` contains the catalog, guide, builder, and billing UI. `src/lib/sync/` handles authentication and sync with `atlas-api`.
- `src/data/`, `src/pages/`, and `src/components/` hold the original Japan itinerary and shared UI. `scripts/` contains catalog, photo, and import utilities. `docs/` holds source notes and catalog templates.
- `public/atlas/` holds covers and `public/photos/` holds place photos. Keep credits for licensed place photos in `src/atlas/photo-manifest.json`.

## Build and Development

Use Node.js 22.12+ and npm. Keep `package-lock.json` in version control.

- `npm ci` installs the locked dependencies.
- `npm run dev` starts the Vite development server.
- `npm test` runs the Vitest suite once.
- `npm run build` type-checks the project and builds the site into `dist/`.
- `npm run preview` serves the production build locally. GitHub Actions builds and tests `main` before publishing to GitHub Pages.

## Coding Style and Catalog Data

Use strict TypeScript, two-space indentation, PascalCase for React components and their files, and camelCase for functions and variables. Match nearby formatting. `npm run format` runs Prettier on `src/atlas/` and `src/App.tsx`.

Use `src/atlas/model.ts` and `seed.ts` when extending the catalog. Preserve existing IDs and slugs so links and saved marks still work. Use `migrations.ts` to update saved catalogs. Preserve hash routing and relative asset paths for GitHub Pages. Set `VITE_SYNC_API_URL` in `.env.local` when developing API features. Keep secrets and personal backup data out of commits.

## Testing

Place Vitest tests next to the module as `*.test.ts`. Use descriptive `describe` and `it` names, as in `model.test.ts` and `photos.test.ts`. Cover changes to catalog validation, saved-data migrations, and photo attribution in the corresponding suite. Run one suite with `npm test -- src/atlas/model.test.ts`. CI requires a passing suite.

## Commits and Pull Requests

Use short, imperative subjects such as `Add lodging markers to city maps`. In the PR, summarize the change, link the relevant issue when available, and report build and test results. For UI changes, include screenshots at the affected viewport sizes.
