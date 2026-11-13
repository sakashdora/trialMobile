# Redesign verification — 13 November 2026

- TypeScript and Vite production build: passed.
- Focused concept collection and saved-selection tests: 7 passed.
- Desktop 1440px and mobile 390px screenshots inspected.
- Published output excludes the previous generated product and video folders.
- No payment, ordering or delivery service is represented as connected.
- User click flows were not separately automated; tests cover rendered structure and storage boundaries.

## Design gate limits

The design gate completed three rounds and remains OPEN with 35 findings and 26 warnings. No waivers were applied. Final checks reported no contrast, focus visibility, collision or viewport-spill failure. The gate is not claimed as passed.

Concept cards avoid depicting third-party phones as AZURE products. Full-bleed editorial photography, a compact footer and content-led catalog height diverge from the strict layout recipes. The closing lines-rise animation falls outside the current dealt-moment catalog.

## Asset limits

The two active Unsplash photographs are disclosed visual references. Actual AZURE prototype photography is still needed for model-specific images. Generated assets were archived outside the deployable public directory.

## Open findings
- **flush** — section#home > div.hero-photo: its last line sits 0px above the lower edge of section#home, where the ground changes to section#design
- **flush** — section#details > div.detail-photo > img "img: Real smartphone display photographe": its first line sits 0px under the top edge of section#details, where the ground changes
- **nav** — div#root > div.premium-site > header.site-header > a.brand "AZURE Mobile collection": nav link wraps to a second line
- **no-visual** — section#collection "The AZURE collection.": no picture, effect or mock in this section; a feature section needs a visual
- **no-visual** — section#compare "Find your phone.": no picture, effect or mock in this section; a feature section needs a visual
- **effect-kind** — section#support: 1 moment not dealt to a tech page (lines-rise): retired, unknown, or dealt to other kinds only (assets/moments/index.json)
- **hero-screen** — section#home > div.hero-photo > img "Close-up study of a smartphone camera an": "Close-up study of a smartphone c" ends at 900px, below the hero's content line at 876px (the 900px screen less 24px) (SR-1)
- **section-height** — div#root > div.premium-site > footer.site-footer "AZUREBack to top ↑AZURE is a concept col": the section is 211px tall (0.2 screens), 689px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- **section-height** — section#collection "02 / The collectionThe AZURE collection.": the section is 1130px tall (1.3 screens), 230px over one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- **section-height** — section#support "Your personal collectionYour phone.At yo": the scene's section is 675px tall (0.8 screens), 225px short of one screen (900px): every section after the hero is one screen or two, 2px either way; a pinned scene is (hold + 1) screens tall, so write data-big-scene-opts='{"hold": 1}' (two screens) and keep --h on the section (SR-2)
- **section-height** — section#details "03 / A closer lookThe phone detailsyou l": the section starts at 2930px, 230px below the screen grid (3 x 900px): sections start on whole screens (SR-2)
- **section-height** — section#compare "04 / Find your fitFind your phone.Compar": the section starts at 3830px, 230px below the screen grid (4 x 900px): sections start on whole screens (SR-2)
- **section-air** — section#design > div.wrap > div.statement-bottom "Considered shapes. Natural tones.Find yo": a top border across 100% of the container, between the section's content: sections and their parts are told apart by air and ground, not lines (SR-3)
- **section-air** — section#collection > div.wrap > div.filter-row "All phones06EverydayProCompact6 concepts": a bottom border across 100% of the container, between the section's content: sections and their parts are told apart by air and ground, not lines (SR-3)
- **one-section** — section#collection "02 / The collectionThe AZURE collection.": the screen at scroll 2700px (stride 3) shows 230px of section 3 and the content of 2 sections, over 24px each beside section 4: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- **one-section** — section#details "03 / A closer lookThe phone detailsyou l": the screen at scroll 3600px (stride 4) shows 230px of section 4 and the content of 2 sections, over 24px each beside section 5: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- **one-section** — section#compare "04 / Find your fitFind your phone.Compar": the screen at scroll 4500px (stride 5) shows 230px of section 5 and the content of 2 sections, over 24px each beside section 6: a screen shows one section (another may peek 8px, 24px WARN) (and 2 more like it: scroll 4716px, scroll 84px) (SR-4)
- **one-heading** — div.wrap > div.collection-heading > div > h2 "The AZURE collection.": headings of two sections show whole on one screen at 7 of 95 scroll positions (7.4%; at scroll 1100, 1150, 1200, 1250px), here with "A": at most 3% on a desktop (SR-5)
- **container-edges** — section#home "AZURE / Concept collection 01—06Phones f": the content of section 1 runs 0px from the left and 0px from the right (read from its outermost blocks: no .wrap): the page's container starts at 56px; the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)
- **container-edges** — section#details "03 / A closer lookThe phone detailsyou l": the content of section 4 runs 0px from the left and 0px from the right (read from its outermost blocks: no .wrap): the page's container starts at 56px; the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (and 6 more like it: "AZUREMobile collectionTh", "01 / The approachPhones,", "02 / The collectionThe A") (SR-6)
- **container-edges** — div#root "Skip to contentAZUREMobile collectionThe": a <div> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
- **container-edges** — section#details > div.detail-copy > h2 "The phone detailsyou live with.": the h2 starts 776px right of the container's left: every h1 and h2 starts on it, 2px either way (SR-6)
- **container-edges** — section#home > div.hero-copy > p.eyebrow "AZURE / Concept collection 01—06": 4 text blocks start on a left line at x 112, 56px from the container's left: text starts on the container's left, or on one split line (x 619, 732, 845) (also "Phones foryour everyday.", "Six ways to make a phone your ow", "A study in everyday design") (and 5 more like it: "Phones foryour everyday.", "Phones, with you in mind", x 547) (SR-6)
- **edge-left** — #design h2 "Phones, with you in mind.": starts at x 748; the lines are 56 and the column starts
- **edge-left** — #collection p "Original favourites. New directi": starts at x 748; the lines are 56 and the column starts
- **edge-left** — #details p.eyebrow "03 / A closer look": starts at x 776; the lines are 56 and the column starts
- **edge-left** — #details h2 "The phone detailsyou live with.": starts at x 776; the lines are 56 and the column starts
- **edge-left** — #details p "A comfortable edge. A finish you": starts at x 776; the lines are 56 and the column starts
- **edge-left** — #details p "Shape & proportion": starts at x 821; the lines are 56 and the column starts
- **edge-left** — #details p "Texture & tone": starts at x 821; the lines are 56 and the column starts
- **edge-left** — #details p "Space & simplicity": starts at x 821; the lines are 56 and the column starts
- **lines** — page: headings and leads start on 3 lines (x 56, 748, 776); the page has 56 and one split line
- **screen-short** — #home section.hero.editorial-hero "AZURE / Concept collection 01—06": 816px tall; one screen under the nav is 900px
- **sparse** — #support section.closing-section "Your personal collectionYour pho": its content fills 48% of its screen; merge it or give it its visual (0.55 is the aim)
- **hero-fold** — #home section.hero.editorial-hero "AZURE / Concept collection 01—06": starts at y 84, not under the nav
