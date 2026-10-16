# Assets and provenance

## Verified place photographs

`src/atlas/photo-manifest.json` records every verified selection, its exact catalog key, source page, original URL, photographer, license and original dimensions. Only CC0, Public Domain, CC BY and CC BY-SA photographs are selected. The scope and outstanding gaps are recorded in `docs/photos.md`.

The local derivatives in `public/photos/licensed/` are cropped to 3:2, resized to a maximum width of 1200 pixels without upscaling, and JPEG-encoded. Each derivative retains the original license. Photographer, source, license link and cropping disclosure appear in the place detail. JPEG EXIF also contains photographer, license and source. Constructor-supplied photographs are preserved when their URL differs from the bundled photograph.

## Earlier assets

Original Japan photographs retain their source paths and source metadata in `src/data/places.ts`. Original winter photos are referenced in `src/atlas/winter.json`; the full source is archived in `docs/archive/winter26.html`. These historical references do not establish a verified license. Old files are kept for source preservation and are replaced in the active catalog as verified selections become available.

Locally stored earlier source images:

- `atlas/cenang.jpg`: https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/dd/d0/62/photo0jpg.jpg — retained winter26 asset, superseded by the licensed place photograph.
- `atlas/singapore.jpg`: https://images.unsplash.com/photo-1525625293386-3f8f99389edd — country cover.
- `atlas/indonesia.jpg`: https://images.unsplash.com/photo-1537996194471-e657df975ab4 — country cover.
- `atlas/kuala-lumpur.jpg`: https://images.unsplash.com/photo-1596422846543-75c6fc197f07 — city cover.
- `atlas/penang.jpg`: https://upload.wikimedia.org/wikipedia/commons/d/d5/Armenian_street-penang-095749145.jpg — retained winter26 asset.

The earlier Singapore photo metadata remains in `src/atlas/credits/singapore-*-credit.json`. The verified manifest takes precedence for matching bundled images.

The Malaysia hero and blended banner are generated editorial illustrations. Earlier generated Sky Bridge and Kilim images remain as archived assets, superseded by real licensed photographs. The selected design reference in `docs/design/reference.png` is an AI-generated design concept.

Icons: @phosphor-icons/react (MIT). Fonts: Golos Text and Noto Serif from Fontsource packages; license files are retained in the installed packages. Fonts are bundled locally for offline use.
