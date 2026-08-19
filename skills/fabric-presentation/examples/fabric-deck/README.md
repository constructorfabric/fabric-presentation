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

That produces **1.45 MB** for these twenty slides: the whole Vue app, the styles, 22 Geist woff2 face files (286 kB), both `public/` diagrams (48 kB) and the favicon, all base64'd into one `.html`. It is the live deck - real navigation, selectable text, working links - not pictures of slides, and it opens over `file://` with the network switched off. The script re-reads its own output and refuses to write a file that would still reach a network on open.

With the dev server up there is a second route to the same file: the **HTML icon at the end of the nav control bar**, beside Slidev's own browser-exporter entry. Click it, watch it spin for the length of the build, and the `.html` downloads. The exported file itself carries no export control of any kind - the button is `custom-nav-controls.vue`, which renders in dev only, and Slidev's two are dev-only by default.

Three things here make it possible: `vite.config.ts` (the build settings, inert until the export script asks for them, plus the dev-only endpoint the button calls), `custom-nav-controls.vue` and the `vite-plugin-singlefile` devDependency. The exported file routes on the hash - `fabric-deck.html#/12` is slide 12 - because a history route over `file://` matches nothing and renders Slidev's 404 page.

What it cannot carry, and the whole trap list, is in the skill's `references/slidev.md`.

## The slides, and what each one demonstrates

| # | Slide | Composition | Where it comes from |
| --- | --- | --- | --- |
| 01 | Constructor Fabric | dark cover: eyebrow, 64pt title, tagline with one accented run, date | `cover` case; tpl-01, exm-01 |
| 02 | Five things to settle today | agenda: numbered rows on hairlines, number in its own column | donor layout Agenda, tpl-03 |
| 03 | Materialization over generation | contrast pair: tint card against navy panel, figures ruled off at the foot of each | `contrast-pair` case; exm-05, exm-11 |
| 04 | From libraries to a project | four columns read as a scheme, connectors in their own grid columns, result column filled | donor layout Four Columns, tpl-11 |
| 05 | What it buys | dark section divider | `section-divider` case; tpl-02, exm-03 |
| 06 | What a new project starts with | big stats: three 40pt tiles over one 54pt figure ruled off below | donor layouts Big Stats tpl-13 and exm-12 |
| 07 | The template inventory | two tables on one slide: the wide one with a navy header band and zebra rows, a compact one under its own label | `quarter-table` case; tpl-21 |
| 08 | The console as it arrives | image half: tint frame with an INSERT IMAGE label beside a text column | donor layouts Image Half tpl-06 and Image tpl-04 |
| 09 | How it assembles | dark section divider | `section-divider` case |
| 10 | Seven commands | command list on the dark gradient panel, mono on the command only | `terminal-flow` case |
| 11 | A build from a single prompt | dark panel quoting the prompt, numbered navy circles on a hairline rail under it | `terminal-flow` case + tpl-17 |
| 12 | Runtime: shell and screens | full-width SVG diagram, header collapsed by `class: fx-diagram-slide` | drawing, on the palette's roles |
| 13 | A narrow typed contract | full-width SVG sequence diagram | drawing, on the palette's roles |
| 14 | What comes next | dark section divider | `section-divider` case |
| 15 | What lands, and in what order | timeline: navy pill badges on a rail, one segment per gap | donor layout Timeline, tpl-18 |
| 16 | Two ways to start | comparison: two option cards of equal weight, neither marked | donor layout Comparison, tpl-12 |
| 17 | The team behind the platform | team grid: eight circles of one size with name and role | donor layout Team, tpl-16 |
| 18 | Five consequences | five-card row, one card filled navy | `category-cards` case; tpl-08..12 |
| 19 | (quote) | dark quote page: one sentence and its attribution, nothing else | donor layout Quote, tpl-19 |
| 20 | Constructor Fabric | dark closing: the phrase, the caps label and the four steps | tpl-22, exm-15 |

The two SVG diagrams carry the runtime as it actually works - a screen's declaration, the schema check before runtime, the shell's domains and menu, and the six-message contract between shell, bridge and screen - with product-generic labels: every marker is drawn in the navy outline and band tint the rest of the drawing uses, and the sequence diagram's lifelines run navy - sky - tint so no white text sits on the accent blue.

## What the deck demonstrates besides the compositions

- **Sections.** The deck is three sections, each opened by a dark divider (05, 09, 14) - dark pages are not only bookends. `sections.ts` declares the names and the page each starts on; `components/SectionNav.vue` renders them in the footer of the **light** pages with the current one in the accent blue. A dark page never carries the nav. That footer nav is our own convention and not a donor shape.
- **One footer geometry on every page.** Same band, same baseline, same padding, light and dark alike. A dark page turns its hairline transparent rather than dropping the footer box, and the cover omits only its page number - so the wordmark does not move as the deck advances. Flip between exported pages and watch it hold still.
- **No eyebrow above a content title.** The header holds the title, with the optional blue takeaway line below it. Caps lines belong to the dark pages and to card heads.
- **No filled band inside a card or a panel.** Every in-card heading is the kicker over a hairline rule; the one filled band shape left is the table header, which spans its whole table.
- **The notes format, on the slides that owe a note.** Slides 01, 03 and 20 carry Claim / What to say / Not on the slide written out; the rest assert nothing beyond the picture they show, and an empty note is not a gap to be filled.
- **The takeaway line under the picture.** In this deck each of those sentences is a conclusion drawn from what is above it, so it closes the slide (`deck-takeaway-line`) rather than sitting under the title. Under the title is the donors' own placement and equally legal - the slide picks one.

## Conformance

```sh
node <skill>/scripts/check-style.mjs .
```

The deck passes clean. The checker skips `public/`, so it does not read the two diagrams; their palettes were checked by hand and carry no warm hex.

The law this deck renders is the skill's `references/fabric-style.md`, and its `references/fabric-slidev-decks.md` carries what the Fabric Slidev deck family shares.
