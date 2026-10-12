# Fabric example deck

The `fabric-presentation` skill's own demonstration deck: a complete, runnable Constructor Fabric Slidev deck in which **every slide is a different composition**. It exists to be looked at and to be copied - it is the fastest start for a new deck, faster than `scripts/new-deck.mjs`, which gives you the minimum rather than the menu.

**The content is Constructor Fabric's own story, told with placeholder figures.** The example of a product's skill speaks about that product: the terminology and the mechanics are the real ecosystem - templates and the local inventory, the `frontx` CLI, the shell and screens as micro frontends, schema-validated declarations, upgrades arriving as a reviewable diff - and only the *numbers* are placeholders. Team counts read "N teams", versions read "1.x", quarters read Q1..Q4, every name reads "Placeholder Name", and no figure on any slide is a measurement anyone took. Replace the figures with yours before this reaches an audience; keep the mechanics, they are true. An invented product name is what this deck must not carry: a placeholder figure reads as a placeholder, but a made-up product name reads as a real one.

## Running it

```sh
pnpm install
tail -f /dev/null | pnpm exec slidev --port 3030
```

The deck opens on `http://localhost:3030` - any free port will do; slide *n* is at `/n`. The `tail -f /dev/null |` prefix is not decoration: Slidev treats stdin EOF as quit, so a backgrounded server dies right after printing its banner.

If `pnpm` is not on the PATH, `npx -y pnpm@10.12.1 ...` works without an install. The install ends with pnpm's "Ignored build scripts: esbuild, playwright-chromium" - expected, and nothing in a deck needs those build scripts to have run.

Slidev's hover toolbar works as normal in the bottom-left corner. The one piece of tool chrome the stylesheet suppresses (§6) is the stray "go to slide" list, which Slidev leaves hanging over the top-right corner while the dialog is closed.

## Exporting

```sh
pnpm exec slidev export --format png --scale 2 --output <dir>   # one PNG per slide
pnpm exec slidev export --format pdf --output deck.pdf
```

The export drives Playwright, a dev dependency of this deck; run `pnpm exec playwright install chromium` once if the browser is missing. Nothing here animates or builds, so a PPTX export - which flattens each slide to an image - loses nothing.

## One self-contained HTML file

For an audience that needs a file to double-click and mail on, rather than a PDF or a folder:

```sh
node <skill>/scripts/export-single-html.mjs . --output /tmp/fabric-deck.html
```

`<skill>` is your installed `fabric-presentation` directory - the one holding `SKILL.md`. While this deck still sits inside the skill that is `../..`; once you have copied the deck somewhere of your own, it is wherever the skill lives.

That produces one `.html` of about **1.06 MB** for these twenty-two slides: the whole Vue app, the styles, both `public/` diagrams and the favicon, all base64'd into it. No web font is embedded - the deck sets Aptos and falls back to Helvetica Neue, both system faces. It is the live deck - real navigation, selectable text, working links - not pictures of slides, and it opens over `file://` with the network switched off. The script re-reads its own output and refuses to write a file that would still reach a network on open.

With the dev server up there is a second route to the same file: the **HTML icon at the end of the nav control bar**, beside Slidev's own browser-exporter entry. Click it, watch it spin for the length of the build, and the `.html` downloads. The exported file itself carries no export control of any kind - the button is `custom-nav-controls.vue`, which renders in dev only, and Slidev's two are dev-only by default.

Three things here make it possible: `vite.config.ts` (the build settings, inert until the export script asks for them, plus the dev-only endpoint the button calls), `custom-nav-controls.vue` and the `vite-plugin-singlefile` devDependency. The exported file routes on the hash - `fabric-deck.html#/12` is slide 12 - because a history route over `file://` matches nothing and renders Slidev's 404 page.

What it cannot carry, and the whole trap list, is in the skill's `references/slidev.md`.

## The slides

Every slide is template v4 (ppt.constructor.rocks, 9 October 2026) at the template's own coordinates. Where v4 has a layout for the shape, the slide IS that layout; the four compositions v4 has no layout for (04, 05, 11, 12) are built from its parts - its card, navy, step circle and type ladder.

| # | Title | Shape | Source |
|---|---|---|---|
| 1 | Constructor Fabric | dark cover: eyebrow, 64pt title, subtitle, author line | layout Cover, v4-01 |
| 2 | Five things to settle today | agenda rows on the tint ground | layout Agenda |
| 3 | Every team writes the same project again | bulleted key points | layout List, v4-03 |
| 4 | Materialization over generation | tint card against a navy panel | `contrast-pair` case, on v4 cards |
| 5 | From libraries to a project | four columns joined by arrows, the last one navy | own composition, on v4 cards |
| 6 | What it buys | dark section divider | layout Section Divider, v4-02 |
| 7 | What a new project starts with | three stat cards | layout Big Stats |
| 8 | The template inventory | square table, full grid, navy header | layout Table, v4-08 |
| 9 | The console as it arrives | image card and a centred caption beside it | layout Image Half, v4-05 |
| 10 | How it assembles | dark section divider | layout Section Divider |
| 11 | Seven commands | command list on the dark gradient panel, mono on the command only | `terminal-flow` case |
| 12 | A build from a single prompt | dark panel quoting the prompt, numbered navy circles on a rail under it | `terminal-flow` case + layout Process parts |
| 13 | Runtime: shell and screens | full-width SVG diagram in the Image Full frame | layout Image Full |
| 14 | A narrow typed contract | full-width SVG sequence diagram | layout Image Full |
| 15 | What comes next | dark section divider | layout Section Divider |
| 16 | What lands, and in what order | rail through four navy circles, name and note under each | layout Process |
| 17 | Two of five workstreams need a decision | status table: status cells tinted, the word in status ink | v4-11 |
| 18 | Two ways to start | two option cards of equal weight, neither marked | layout Comparison |
| 19 | The team behind the platform | eight photo circles with name and role | layout Team |
| 20 | Four consequences of one decision | four equal cards, kicker and body | layout Four Columns |
| 21 | (quote) | dark quote page: one sentence and its attribution | layout Quote |
| 22 | Thank you | dark closing: title and contact lines | layout Closing, v4-09 |

The two SVG diagrams carry the runtime as it actually works - a screen's declaration, the schema check before runtime, the shell's domains and menu, and the six-message contract between shell, bridge and screen - with product-generic labels: every marker is drawn in the navy outline and band tint the rest of the drawing uses, and the sequence diagram's lifelines run navy - sky - tint so no white text sits on the accent blue.

## The reference slides

`v4-reference.md` rebuilds the template's own eleven example slides - cover, section, key points, the two image layouts, two and three columns, table, closing and the two colour-guide pages - with this deck's layouts and classes and the template's own words. It is how the style itself is checked: render it and lay each page over the designer's render of the same slide.

```sh
tail -f /dev/null | pnpm exec slidev v4-reference.md --port 3040
```

Measured on 12 October 2026 against the v4 release's published renders, 1280 x 720: slides 1-9 differ in 0.3-1.8% of their pixels, all of it glyph antialiasing and 1-2px of text placement; every frame, card, table line and colour lands on the template's. Slides 10 and 11 differ in 4-6%: the colour-guide title is a plain text box the designer sets a little narrower, and v4-11's title uses a long dash this repository does not write.

## What the deck demonstrates besides the compositions

- **Sections.** The deck is three sections, each opened by a dark divider (06, 10, 15) - dark pages are not only bookends. The template's footer carries no section nav, so `sections.ts` ships empty; filling it turns on `components/SectionNav.vue` between the wordmark and the number, our own convention rather than a template shape.
- **One footer frame on every page.** The wordmark and an unpadded page number, no rule above them, at the same coordinates light and dark; the cover omits only its number.
- **Content from the top.** Every content slide starts at the template's y=163.2; nothing floats in the middle of the zone.
- **No eyebrow above a content title, no takeaway line under the picture.** The header holds the title alone; what a slide concludes is its title, and the rest is in the notes.
- **The notes format, on the slides that owe a note.** Slides with a claim to defend carry Claim / What to say / Not on the slide; the rest assert nothing beyond the picture they show, and an empty note is not a gap to be filled.

## Conformance

```sh
node <skill>/scripts/check-style.mjs .
```

The deck passes clean. The checker skips `public/`, so it does not read the two diagrams; their palettes were checked by hand and carry no status or other warm hex.

The law this deck renders is the skill's `references/fabric-style.md`, and its `references/fabric-slidev-decks.md` carries what the Fabric Slidev deck family shares.
