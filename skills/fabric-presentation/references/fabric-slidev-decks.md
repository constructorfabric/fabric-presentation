# Constructor Fabric Slidev decks

Fabric decks are standalone Slidev projects scaffolded by this skill's `scripts/new-deck.mjs` - there is no shared workspace theme; each deck carries its own `layouts/`, `style.css` and tokens copy. [slidev.md](./slidev.md) carries Slidev itself - its commands, the export, and the sizing traps; this file carries only what Fabric decks agree on. The style law they render is [fabric-style.md](./fabric-style.md).

## Stack and layout

- `slides.md` holds every slide, separated by `---`; diagrams are per-deck Vue components in `components/`.
- `style.css` carries the template v4 base - frames, layouts and template shapes, every coordinate in `--fx-u` - **with `fabric-tokens.css` beside it**: they are a pair; take one without the other and every `var()` resolves to nothing and the deck renders as white boxes.
- The `layouts/` place v4's frames absolutely, at the template's own coordinates: `fabric` for a light content slide (title frame at y=52.8, content box from y=163.2, footer frame; `ground: tint` for the Agenda's tint ground), `fabric-cover` (eyebrow, title, subtitle and author from the frontmatter), `fabric-section` (eyebrow and summary from the frontmatter, the `# heading` is the title) and `fabric-dark` for the quote and the closing.
- [../examples/fabric-deck/v4-reference.md](../examples/fabric-deck/v4-reference.md) rebuilds the template's eleven example slides with these layouts and classes. It is the fixture the style is checked against: render it next to the designer's pages of the same release and the two match within a few pixels.

## Slide pattern

```md
---
layout: fabric
---

::header::

# Slide headline

::default::
<OneComponentPerSlide />

<!--
Claim: the one sentence the slide asserts.
What to say: the presenter's spoken line.
Not on the slide: limits, context, what deliberately stays off.
-->
```

- One Vue component per slide body; notes in the Claim / What to say / Not on the slide format.
- **The header holds the title alone.** V4 sets no subtitle under a content title and no takeaway line under the picture; a conclusion the slide supports goes in the title, and anything more in the notes.
- Notes are what the block above shows: Claim, What to say, Not on the slide.
- **No eyebrow above a content title.** The caps eyebrow belongs to the dark pages (cover, section divider) and the kicker to card heads.
- Notes are optional per slide. A slide without them is not a defect, and a review pass must not count one as a miss; what is fixed is the format when they are there.
- A deck under construction may carry stub slides for content not written yet. While it is being built that is working state, not a placeholder violation - the rule against placeholders applies to the deck as presented.
- Colour language in diagrams comes from the palette's roles in [fabric-style.md](./fabric-style.md) §1, not from a per-deck convention: navy for structure, titles, table headers and markers; `--fx-blue` for the accented thing on a light ground; `--fx-blue-sky` for the accented thing on a dark one; tints and hairlines for grounds and separation; teal and lilac for a second series or a category, sparingly. **Status is carried by the word**; green, amber and red only repeat it, as a status cell, tag or dot (§1.4). Orange, pink, magenta and any other hue are not in the scheme.
- Text rules: no em dashes (plain "-"), no exclamation marks, "FrontX" spelled exactly. Product slides sell the product's global value, never demo-artifact features, and never another block's/product's content.

## Footer conventions

- Every page closes with the 10pt bold wordmark "Constructor Fabric" (text at x=57.6) and the page number right-aligned to x=1222.4, both centred in the frame at y=664.3 - **no rule above them**. The cover carries the wordmark without a number; every other page, dark ones included, carries both.
- **One footer frame on every page**, light and dark alike, so the wordmark holds still as the deck advances.
- Page numbers are **unpadded** ("7", not "07"), as v4 prints them: the layout writes `{{ $page }}` as it is.

## Sections, and the nav in the footer

A deck of several parts - often a part per presenter - opens each part with a dark section-divider slide, so the dark ground recurs through the middle of the deck rather than only bookending it.

Where a deck has sections it MAY carry the section names in the footer of its light pages, between the wordmark and the page number, the current one in the accent blue. This is our own convention and **not a template shape** - v4's footer is the wordmark and the number only - so the example deck ships `sections.ts` empty, which renders nothing. Fill it only when the audience needs the map, and say so if a reviewer asks where it came from.

One declaration feeds both readings, because two lists of section names drift apart:

```ts
// sections.ts
export const sections: DeckSection[] = [
  { name: 'Where we are', from: 3 },
  { name: 'What it costs', from: 9 },
];
```

`from` is the page number of the section's divider slide, and `sectionAt(page)` returns the last section that has started. The page number is the mechanism because `$page` is the one positional fact that is the same in the dev server and in an export - `nav.currentPage` prints the same number on every exported page. Nothing checks the list against the slides, so the check is the render pass: advance through the deck and watch the marked name change exactly on the divider. `scripts/new-deck.mjs` writes `sections.ts` empty and `components/SectionNav.vue` beside it; an empty list renders nothing, which is what a single-section deck wants.

## Starting a new deck

```
node scripts/new-deck.mjs <target-dir> [--name "Deck title"] [--cases a,b] [--date "Month Year"] [--force]
node scripts/new-deck.mjs --list
```

It writes a runnable Fabric deck out of this skill's own material: `slides.md` with a dark cover and one content slide, `style.css` seeded from the templates with `fabric-tokens.css` beside it, the three `layouts/`, an empty `sections.ts` with `components/SectionNav.vue`, the requested template cases in `components/`, the `vite.config.ts` and `custom-nav-controls.vue` the single-file HTML export needs, and a `package.json` pinning the exact Slidev, Vue, theme and Playwright versions this skill pins. No logo file travels: the footer wordmark is the deck's only brand mark. It refuses a non-empty directory without `--force`, and it runs `check-style.mjs` over what it wrote before it reports.

**The fastest start is a copy.** [../examples/fabric-deck/](../examples/fabric-deck/) is a complete, runnable Fabric deck whose every slide is a different composition - cover, agenda, contrast pair, four-column flow, section dividers, big stats, command panel, prompt and stepper, two diagrams, two tables on one slide, timeline, comparison, team grid, image frame, card row, quote and closing - with placeholder content throughout and its own README mapping each slide to the case or donor layout it demonstrates. Copy the directory, run it, and delete the slides the deck does not need; the scaffolder is the better route only when you want the minimum rather than the menu.

## Running the dev server

- If `pnpm` is not on the PATH, `npx -y pnpm@10.12.1 ...` works without an install - handy in an agent shell, where Node 25 ships no corepack.
- Slidev treats stdin EOF as quit - a backgrounded server dies right after the banner. Hold stdin open: `tail -f /dev/null | pnpm exec slidev --port 3030`.

## Handing the deck over as one file

```
node scripts/export-single-html.mjs <deck-dir> --output <file>.html
```

One `.html` that opens by double-click over `file://` with no network and nothing beside it - the live deck, not pictures of slides. That command is the scriptable route; with the dev server up, the **HTML icon at the end of the nav control bar** is the same export by hand, and the file downloads when the build finishes. Nothing of either route appears inside the exported file - the button renders in dev only, and Slidev's own two export affordances are dev-only by default.

Every Fabric deck can do this because `new-deck.mjs` writes `vite.config.ts` (the build settings, and in dev the endpoint the button calls), `custom-nav-controls.vue` (the button) and the `vite-plugin-singlefile` devDependency. A deck assembled by hand from an older copy has none of them, and the script says so rather than producing a blank page.

A deck scaffolded OUTSIDE the skill also carries `"fabricSkill"` in its `package.json`, naming where the export script lives - a copied-out deck has no way of walking up to it. `FABRIC_SKILL_DIR` in the dev server's environment overrides that if the skill moves. A deck inside the skill needs neither. The traps, the size and what the file cannot carry are in [slidev.md](./slidev.md).

## Verification sweep for these decks

Screenshot every touched slide at 1440x900 in a real browser (agent-browser via npx), check: no content overflow on either axis, untouched slides and the agenda unaffected, footer wordmark present with no rule above it, an unpadded page number on every page but the cover (section dividers included), no warm hue except a status colour inside a status cell, tag or dot, `node scripts/check-style.mjs <deck-dir>` clean.
