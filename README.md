# AZURE — approved design implementation

React + TypeScript + Vite. `npm ci`, `npm run dev` (http://127.0.0.1:4173), `npm run build`.

The active interface is `src/App.tsx`, visual styles are `src/premium.css`, and the ten phones plus
four accessories are defined in `src/data/collection.ts`. Product details, phone filters, comparison,
and browser-local saved selections are implemented. The previous shortlist key is preserved.

The interface is a deep-navy, titanium and ivory design in Bricolage Grotesque: a GSAP loader curtain,
an image-led hero, a word-by-word statement, a pinned "craft" chapter that travels across one macro
photograph, a five-column phone grid (two columns on phones), four accessories, comparison and a closing band.

Motion lives in `src/hooks/useAzureMotion.ts` (GSAP: ScrollSmoother, ScrollTrigger, SplitText, Flip; plugins
are registered in `src/lib/gsap.ts`). Everything is skipped under `prefers-reduced-motion`: no loader, native
scrolling, and every section renders in its final state. Touch devices keep native scrolling. Product images
load lazily below the hero. The page uses its own small CSS reset (the project has no PostCSS config, so the
Tailwind directives in `src/index.css` do not generate anything).

Concept imagery was generated specifically for the approved design. It is disclosed as concept artwork;
no real specifications, compatibility, inventory or checkout are claimed. See `docs/approved-design-assets.md`.

Focused tests: `node --test --test-concurrency=1 tests/unit/concept-collection.test.mjs tests/unit/bag-resilience.test.mjs`.
Older tests cover a legacy implementation and are not the active storefront suite.

The existing private Site identity is preserved in `.openai/hosting.json`. The previous redesign report
in `docs/redesign-verification.md` describes the superseded six-phone version, not this approved design.
