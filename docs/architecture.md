# Project architecture

AZURE is a static website using native browser JavaScript modules, HTML and CSS. There is no application framework, backend, bundler or runtime package dependency. Prettier is a development-only dependency.

## Source and output

`src/` owns the editable page, styles and browser code. `public/` owns static assets. Development serves these directories directly. `npm run build` copies both into `dist/`, preserving their relative paths; it recreates only the generated `dist/` directory. `dist/` is ignored by Git and must never be edited by hand.

The generated site can be served by any static HTTP host. Native module imports require HTTP; opening `index.html` through `file://` is unsupported.

## Browser code

| File under `src/scripts/` | Responsibility                                                          |
| ------------------------- | ----------------------------------------------------------------------- |
| `app.js`                  | Initialize page features after HTML parsing.                            |
| `data/products.js`        | Product content, prices, image paths and phone/accessory ordering.      |
| `data/gallery.js`         | Gallery photos, captions, alt text and credits.                         |
| `features/catalog.js`     | Render phone/accessory cards and apply accessory filters.               |
| `features/shopping.js`    | Product configuration, price updates, bag storage and bag rendering.    |
| `features/gallery.js`     | Gallery selection, arrows and full-size photo dialog.                   |
| `features/comparison.js`  | Phone comparison table and duplicate-choice prevention.                 |
| `features/navigation.js`  | Mobile navigation and active-section observation.                       |
| `shared/ui.js`            | DOM helpers, currency formatting, dialogs, focus restoration and toast. |

Catalog rendering happens before shopping behavior is initialized. Shopping uses delegated `data-product` clicks, including comparison buttons created later. HTML IDs are the interface between the page and feature modules; update both when renaming one.

The bag retains its existing `azure-preview-bag` localStorage key. Stored selections are validated against the current catalog and capped at 20 items. When browser storage is unavailable, the bag works in memory. No payments, orders, accounts, analytics or subscriptions are connected.

Catalog text is trusted project-authored content; card templates use `innerHTML`. Do not feed external or user-supplied content into those templates without adding appropriate escaping. Bag values are validated and rendered with DOM text APIs.

## CSS

`styles/main.css` is the stylesheet entry point. It imports Google Fonts and these files in order:

1. `base.css` — theme tokens, reset, basic typography and focus styles.
2. `page.css` — page sections and shared page controls in visual order.
3. `dialogs.css` — dialogs, product configuration, bag and toast.
4. `responsive.css` — large-screen, tablet, mobile and reduced-motion overrides.

Keep this order to preserve the cascade. The original unused `styles.css` and `premium.css` are no longer included in the project; their history remains in Git.

## Development tooling

- `scripts/paths.mjs` defines directories relative to the repository, independent of the shell's working directory.
- `scripts/serve.mjs` serves source by default and `dist/` with `--preview`. It binds to loopback and supports `--port` or `PORT`.
- `scripts/build.mjs` creates the deployable directory.
- `scripts/check.mjs` checks JavaScript syntax, local module imports, product/gallery assets, HTML references/anchors and the hosting output configuration.
- `tests/site.test.mjs` verifies build completeness, byte-for-byte copies, every file served in dev/preview, module/CSS MIME types and missing/invalid request handling.

The formatter uses `.prettierrc.json`; editor whitespace conventions live in `.editorconfig`. Tests do not replace browser checks of interactive behavior or responsive layout.

## Hosting

`.openai/hosting.json` identifies the existing Site and declares `dist` as its static output. Keep its project identity unchanged. Run `npm run check`, `npm test`, `npm run format:check` and `npm run build` before publication. The Sites source workflow must push the matching source commit and package that generated output together with the hosting manifest. A generic static host needs only the contents of `dist/`.

Deployment archives belong in the local `artifacts/deployments/` workspace folder, outside the source repository. They are not a backup of uncommitted source.
