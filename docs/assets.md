# Assets and provenance

Original Japan photographs retain their source paths and source metadata in `src/data/places.ts`. Original winter photos are referenced in `src/atlas/winter.json`; the full source is archived in `docs/archive/winter26.html`. External photographs fall back to a local region cover when unavailable.

Locally stored additional source images:

- `atlas/cenang.jpg`: https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/dd/d0/62/photo0jpg.jpg — retained winter26 asset.
- `atlas/singapore.jpg`: https://images.unsplash.com/photo-1525625293386-3f8f99389edd — country cover.
- `atlas/indonesia.jpg`: https://images.unsplash.com/photo-1537996194471-e657df975ab4 — country cover.
- `atlas/kuala-lumpur.jpg`: https://images.unsplash.com/photo-1596422846543-75c6fc197f07 — city cover.
- `atlas/penang.jpg`: https://upload.wikimedia.org/wikipedia/commons/d/d5/Armenian_street-penang-095749145.jpg — retained winter26 asset.

Wikimedia photographs have source page, author and license in `src/atlas/credits/singapore-*-credit.json`. Attribution is displayed in each place detail and links to its source page. Images are cropped responsively when displayed; source files remain unaltered.

The Malaysia hero, blended banner, Sky Bridge and Kilim images are generated editorial illustrations. Generated place images are labeled in the detail sheet. The selected design reference in `docs/design/reference.png` is an AI-generated design concept.

Icons: @phosphor-icons/react (MIT). Fonts: Golos Text and Noto Serif from Fontsource packages; license files are retained in the installed packages. Fonts are bundled locally for offline use.
