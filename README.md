# AZURE mobile showcase

A responsive, frontend-only premium brand and shopping concept. Run `npm run dev` and open http://127.0.0.1:4173. Run `npm run check` for JavaScript syntax validation. The deployable static website is in `dist/`.

The page includes three distinct concept phones, a photographic inspiration gallery with full-size viewing, product design and performance stories, four filterable accessory concepts, configurable phone storage, a dynamic two-phone comparison, a browser-local preview bag, FAQs, and native accessible dialogs. The mobile phone shelf supports horizontal swiping. Reduced-motion preferences are respected. Videos are intentionally deferred.

`dist/storefront.css` is the active stylesheet. `dist/app.js` contains the concept catalog, comparison, gallery, filters and preview bag behavior. The older stylesheets are retained but are no longer loaded.

Products, specifications and prices are illustrative and identified as concepts. The collection includes One Pro, One Air, One, a charger/cable Power Kit, Buds, a charging Stand and a Soft Case. Final charging standards, device compatibility, case fit and market-specific plug types are not verified. No payments, orders, accounts, analytics or subscriptions are connected. The preview bag uses localStorage when available and remains usable in memory when storage is unavailable.

## Image sources

The One Pro hero is derived from the user-provided AZURE image. Other product images are generated AZURE concept artwork, encoded as optimized JPEGs for delivery; the transparent hero remains PNG.

The gallery uses downloaded Unsplash photography, with visible credit links. These photographs are visual inspiration and are explicitly not presented as images captured on an AZURE device:

- Priscilla Du Preez — https://unsplash.com/photos/XY9tbPYhR34
- Saad Chaudhry — https://unsplash.com/photos/G25LeMV7fAw
- Jakob Rosen — https://unsplash.com/photos/Ohzg_QsDpIo

Before enabling real commerce, replace the illustrative catalog and pricing with approved product data, confirm availability, compatibility, shipping, returns and warranty, and implement payment and order-management integrations.
