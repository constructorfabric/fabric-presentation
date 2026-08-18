# Constructor Fabric Slidev decks

Fabric decks are standalone Slidev projects scaffolded by this skill's `scripts/new-deck.mjs` - there is no shared workspace theme; each deck carries its own `layouts/`, `style.css` and tokens copy. [slidev.md](./slidev.md) carries Slidev itself - its commands, the export, and the sizing traps; this file carries only what Fabric decks agree on. The style law they render is [fabric-style.md](./fabric-style.md).

## Stack and layout

- `slides.md` holds every slide, separated by `---`; diagrams are per-deck Vue components in `components/`.
- `style.css` is seeded from [../templates/deck-style.css](../templates/deck-style.css) **with `fabric-tokens.css` beside it** - they are a pair; take one without the other and every `var()` resolves to nothing and the deck renders as white boxes.
- The scaffolded `layouts/` draw the donor zones: `fabric` for a light content slide (navy title, blue takeaway subtitle, hairline footer), `fabric-cover` for the cover, and `fabric-dark` for the other pages on the gradient ground - the quote and the closing. A section divider is the template case rather than a layout: it draws its own zones on `layout: none`.

## Slide pattern

```md
---
layout: fabric
---

::header::

# Slide headline

<p class="deck-takeaway">The conclusion the slide supports, stated first.</p>

::default::
<OneComponentPerSlide />

<!--
Claim: the one sentence the slide asserts.
What to say: the presenter's spoken line.
Not on the slide: limits, context, what deliberately stays off.
-->
```

- One Vue component per slide body; notes in the Claim / What to say / Not on the slide format.
- **The takeaway line has two legal places, and the slide picks one.** Under the title (`deck-takeaway`, the donors' own shape, EXM sets one on nearly every light slide) where the sentence states the conclusion the slide will support; or under the picture (`deck-takeaway-line`) where the sentence is a conclusion drawn FROM what is above it. The example deck uses the second on every slide that carries one, which is why its headers hold the title alone.
- Notes are what the block above shows: Claim, What to say, Not on the slide. The example deck's slides 01, 03 and 20 carry them written out.
- **No eyebrow above a content title.** The header holds the title, and under it the optional blue takeaway line. The caps eyebrow belongs to the dark pages (cover, section divider) and to card heads; over a title it repeats the claim the title already states, and it is what the donors do - no tpl content page has one.
- Notes are optional per slide. A slide without them is not a defect, and a review pass must not count one as a miss; what is fixed is the format when they are there.
- A deck under construction may carry stub slides for content not written yet. While it is being built that is working state, not a placeholder violation - the rule against placeholders applies to the deck as presented.
- Colour language in diagrams comes from the palette's roles in [fabric-style.md](./fabric-style.md) §1, not from a per-deck convention: navy for structure, titles, table headers and markers; `--fx-blue` for the accented thing on a light ground; `--fx-blue-sky` for the accented thing on a dark one; tints and hairlines for grounds and separation. **Status is words, weight and position - never hue.** Red, green, yellow, purple, magenta and orange are not in the scheme and are not available for any category: one warm pixel reads as another company's deck.
- Text rules: no em dashes (plain "-"), no exclamation marks, "FrontX" spelled exactly. Product slides sell the product's global value, never demo-artifact features, and never another block's/product's content.

## Footer conventions

- Every content slide closes with the hairline rule, the 10pt bold wordmark "Constructor Fabric" left and the page number right (`.fx-footer`); the cover and the section dividers carry the wordmark without a number.
- **One footer geometry on every page.** The same band, baseline and padding on light and dark alike: a dark page turns `border-block-start-color` transparent rather than dropping the footer element, and the cover omits only the number. Drop the box on one page and the wordmark shifts when the deck advances - a fault nobody names and everybody feels. The section-divider case draws its own zones, so its wordmark gets the same 7.7% band explicitly.
- Page numbers are two-digit (01..99) on every page that carries one, with stable width: `font-variant-numeric: tabular-nums; min-inline-size: 20px; text-align: end;` on the number, and the padding happens at the source, in the layout that draws the footer - `String($page.value).padStart(2, '0')`. A Fabric deck owns its footer, so there is nothing to observe and rewrite afterwards.

## Sections, and the nav in the footer

A deck of several parts - often a part per presenter - opens each part with a dark section-divider slide, so the dark ground recurs through the middle of the deck rather than only bookending it.

Where a deck has sections, its **light** pages carry the section names in the footer between the wordmark and the page number, the current one in the accent blue and the rest in the footer grey. A filled or dark page never carries it: cover, divider, quote and closing keep a wordmark-only footer. This is our own convention and not a donor shape - no tpl or exm page has such a nav - so say so if a reviewer asks where it came from.

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

It writes a runnable Fabric deck out of this skill's own material: `slides.md` with a dark cover and one content slide, `style.css` seeded from the templates with `fabric-tokens.css` beside it, the three `layouts/`, an empty `sections.ts` with `components/SectionNav.vue`, the requested template cases in `components/`, the `vite.config.ts` the single-file HTML export needs, and a `package.json` pinning the exact Slidev, Vue, theme and Playwright versions this skill pins. No logo file travels: the footer wordmark is the deck's only brand mark. It refuses a non-empty directory without `--force`, and it runs `check-style.mjs` over what it wrote before it reports.

**The fastest start is a copy.** [../examples/fabric-deck/](../examples/fabric-deck/) is a complete, runnable Fabric deck whose every slide is a different composition - cover, agenda, contrast pair, four-column flow, section dividers, big stats, command panel, prompt and stepper, two diagrams, two tables on one slide, timeline, comparison, team grid, image frame, card row, quote and closing - with placeholder content throughout and its own README mapping each slide to the case or donor layout it demonstrates. Copy the directory, run it, and delete the slides the deck does not need; the scaffolder is the better route only when you want the minimum rather than the menu.

## Running the dev server

- If `pnpm` is not on the PATH, `npx -y pnpm@10.12.1 ...` works without an install - handy in an agent shell, where Node 25 ships no corepack.
- Slidev treats stdin EOF as quit - a backgrounded server dies right after the banner. Hold stdin open: `tail -f /dev/null | pnpm exec slidev --port 3030`.

## Handing the deck over as one file

```
node scripts/export-single-html.mjs <deck-dir> --output <file>.html
```

One `.html` that opens by double-click over `file://` with no network and nothing beside it - the live deck, not pictures of slides. Every Fabric deck can do this because `new-deck.mjs` writes the `vite.config.ts` and the `vite-plugin-singlefile` devDependency it needs, and both are inert until the export script sets `FABRIC_SINGLE_FILE`. A deck assembled by hand from an older copy has neither, and the script says so rather than producing a blank page. The traps, the size and what the file cannot carry are in [slidev.md](./slidev.md).

## Verification sweep for these decks

Screenshot every touched slide at 1440x900 in a real browser (agent-browser via npx), check: no content overflow on either axis, untouched slides and the agenda unaffected, footer wordmark present, and a two-digit page number on every page but the cover and the section dividers, no warm hue anywhere on the rendered page, `node scripts/check-style.mjs <deck-dir>` clean.
