# AZURE — approved design implementation

React + TypeScript + Vite. `npm ci`, `npm run dev` (http://127.0.0.1:4173), `npm run build`.

The active interface is `src/App.tsx`, visual styles are `src/premium.css`, and the ten phones plus
four accessories are defined in `src/data/collection.ts`. Product details, phone filters, comparison,
and browser-local saved selections are implemented. The previous shortlist key is preserved.

The design follows the approved navy-and-ivory mockup: an image-led hero, five-column phone grid
(two columns on phones), scroll-linked text and camera detail, four accessories, comparison and closing band.
Native scrolling is retained; one requestAnimationFrame updates the story, and reduced-motion preferences
show the final text without transforms. Product images load lazily below the hero.

Concept imagery was generated specifically for the approved design. It is disclosed as concept artwork;
no real specifications, compatibility, inventory or checkout are claimed. See `docs/approved-design-assets.md`.

Focused tests: `node --test --test-concurrency=1 tests/unit/concept-collection.test.mjs tests/unit/bag-resilience.test.mjs`.
Older tests cover a legacy implementation and are not the active storefront suite.

The existing private Site identity is preserved in `.openai/hosting.json`. The previous redesign report
in `docs/redesign-verification.md` describes the superseded six-phone version, not this approved design.
