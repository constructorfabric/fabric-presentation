# Template cases

Worked slides, reduced to their structure. Each case is a pair: a `.md` file holding the Slidev slide block, and a `.vue` file holding the component that block renders. The copy in both is placeholder text and is meant to be thrown away. The structure is what carries over.

Every case here comes from a slide that was actually presented: either a page of the official Fabric donors (named per case below, by the render page it was built from) or a slide from a deck this team gave and a reviewer signed off. A case invented at a desk does not belong in this directory.

| Case | The claim it is built for | Built from | Pair |
|---|---|---|---|
| section-divider | Nothing - it names the part that follows | TPL Section Divider (tpl-02, tpl-15); exm-03 | [section-divider.md](section-divider.md) + [SectionDivider.vue](SectionDivider.vue) |
| category-cards | A set of different KINDS, told apart by their words | tpl-08..12; exm-11 (the tint-ground flip) | [category-cards.md](category-cards.md) + [CategoryCards.vue](CategoryCards.vue) |
| contrast-pair | What holds against what does not | exm-05, exm-11 | [contrast-pair.md](contrast-pair.md) + [ContrastPair.vue](ContrastPair.vue) |
| quarter-table | A plan, period by period, with a claim per period | tpl-21; exm-13 (the takeaway band) | [quarter-table.md](quarter-table.md) + [QuarterTable.vue](QuarterTable.vue) |
| status-matrix | A complete comparison, cell by cell | tpl-21; exm-13 | [status-matrix.md](status-matrix.md) + [StatusMatrix.vue](StatusMatrix.vue) |
| status-tiles | A named set, each member in a state, moving in one direction | a presented and reviewed deck slide; card anatomy from tpl-08..12, the navy badge from tpl-18. The same shape rendered: example deck slide 18 | [status-tiles.md](status-tiles.md) + [StatusTiles.vue](StatusTiles.vue) |
| candidate-tiles | The same set read the other way: proposals, none of them agreed, none of them in trouble | a presented and reviewed deck slide. The same shape rendered: example deck slide 18 | [candidate-tiles.md](candidate-tiles.md) + [CandidateTiles.vue](CandidateTiles.vue) |
| terminal-flow | One input producing one result, through three steps | a presented and reviewed deck slide; the dark ground from tpl-01. The same shape rendered: example deck slides 10 and 11 | [terminal-flow.md](terminal-flow.md) + [TerminalFlow.vue](TerminalFlow.vue) |
| cover | What the deck is and who is behind it | tpl-01, exm-01; example deck slide 01 | [cover.md](cover.md) + [CoverMeta.vue](CoverMeta.vue) |

The page references are render pages of the two donor files; [../references/fabric-style.md §0](../references/fabric-style.md) says how to re-make those renderings and what each file is authority for - and that the donor files themselves are Constructor-internal and do not ship with this skill. The example deck slides named beside them are in [../examples/fabric-deck/](../examples/fabric-deck/), whose README maps each slide number to what it demonstrates; they are the shape as rendered, for anyone who cannot open the donors.

One case has no pair, because it is the deck rather than a slide: [deck-style.css](deck-style.css) is the deck-level stylesheet that puts the donors' zones on the canvas - the three zones of a content slide, the footer band and the dark ground - for the layouts a Fabric deck carries in its own `layouts/`. There is no shared theme to re-point: the deck owns its layouts. Copy it to the deck root first, as `style.css`, **together with [../assets/fabric-tokens.css](../assets/fabric-tokens.css)**, which its first line imports from beside it and which every case reads its colours from. The slide cases assume the tokens and the geometry the pair sets up. `node scripts/new-deck.mjs` does this copy for you and is the safer route for a new deck.

## Taking a case

1. **Copy the pair** into the deck: the `.vue` into `components/`, and paste the `.md`'s body into `slides.md` between two `---` separators. The cover case is the deck's first slide and carries the headmatter, so it replaces the top of `slides.md` rather than joining it.
2. **Rename the component** in both places at once - the file in `components/` and the tag in the slide block. Slidev auto-imports by file name, so a rename in one place alone renders nothing and reports no error.
3. **Fill the copy.** Replace every placeholder, including the ones in the `<script setup>` block and the speaker notes. A leftover "First item" reaches the export.
4. **Check the frontmatter the case ships with.** Most cases sit on `layout: fabric`, the content layout `node scripts/new-deck.mjs` scaffolds (the cover on `layout: fabric-cover`); a scaffolded deck matches out of the box. In a deck of your own, point the line at whatever that deck's content layout is called. The `section-divider` case is the exception: it draws its own zones on the dark ground, so its block carries `layout: none` + `class: fx-section-slide`, and the deck needs the matching rule from [deck-style.css](deck-style.css) §4. Without it the absolute boxes resolve against the window.
5. **Check the additions the case assumes.** A content slide's header holds the **title alone**, with the optional blue takeaway line under it - the caps eyebrow does not go above a content title, it belongs to dark pages and to card heads. The styles read `--fx-*` from [../assets/fabric-tokens.css](../assets/fabric-tokens.css), which the deck must import, with `--fx-scale: 0.7656` set once for Slidev's 980px canvas against the donors' 1280px slide.
6. **Render the slide and look at it**, zoomed in, before deciding it works - and put it beside the donor page in the table above that it was built from. If yours reads lighter, something has dropped: check the deck defines every `--fx-*` the case reads, because one unresolved `var()` invalidates its whole declaration and a fill or a border disappears silently. Then run the conformance check from the skill root:

   ```sh
   node scripts/check-style.mjs <deck-dir>
   ```

   The cases leave it clean. Anything it names after your edit is your edit.

## The Fabric moves the cases carry

Each case is built from the patterns in §3 of the law, and each one lands the system's own weight on the slide before you type a word into it:

- `category-cards` - a row of **rounded --fx-tint cards** with 1pt --fx-line hairlines, each headed by an **accent-blue kicker in caps** (tpl-08..12).
- `contrast-pair` - the **navy panel** against the **tint card**: the two halves differ by ground and by heading, never by hue. Each panel's heading is a **kicker over a hairline rule**, and the one filled band on the case stands on the bare ground under the pair.
- `quarter-table` - a **navy header band** with the **--fx-tint-band takeaway band** under it, zebra rows and rounded outer corners (tpl-21, exm-13).
- `status-matrix` - the same navy header over a grid whose states run dark to light: **navy present, band-tint deferred, card-tint partial, hairline-outlined absent** - each one carrying its own word.
- `section-divider` - the **navy gradient ground** with its corner glow, a sky-blue eyebrow and a 42pt white title (tpl-02).
- `terminal-flow` - the **dark gradient panel** for the transcript, the only place the mono face is legal, and a navy result card closing the strip.
- `status-tiles` / `candidate-tiles` - the tile's name as an **accent-blue kicker over a hairline rule** inside a tint card, and one filled navy chip per slide.
- Every container is **rounded**, and the footer of every page is a hairline rule with the wordmark "Constructor Fabric" at the left margin.

**A heading inside a card or a panel is never a filled band**: a band narrower than its container inverts the hierarchy, so an in-card heading is the plain kicker set off by a hairline rule - `.fx-card-head`, or `.fx-card-head_on-dark` on a navy panel. The tint band keeps its one legal shape, standing on the bare ground and heading the block below it (exm-05/06/07/13). The footer's hairline is the other side of the same rule: it spans the full slide width on every page, so the 3.8% margin goes on each zone and never on the slide root.

If a case ever renders as empty boxes, it has been broken: check that the deck imports `../assets/fabric-tokens.css`, because every colour in these cases comes from it.

## What the cases hold to

- **Monochrome blue.** There is no red, no yellow, no green and no warm hue anywhere in the system. Status is carried by **words, weight and position**: the word is always in the cell, the chip or the heading, and the fill is the second reading rather than the only one. The checker reports a warm hex as `PALETTE` and says why.
- **Rounded corners.** Every container is a rounded rectangle built from `--fx-radius`, `--fx-radius-lg` or the 999px pill. A square-cornered card reads as another company's deck, and the checker reports a zero radius as `RADIUS`.
- **Every colour keeps its role**, and the roles are in §1 of the law. Navy `--fx-navy` is structure and title ink - bands, circles, pills, table headers, filled cells - and never body text. `--fx-blue` is the accent on light grounds and `--fx-blue-sky` the accent on dark; they do not swap. `--fx-blue-mid` is the takeaway line under a title. `--fx-ink` is body ink.
- **White text on navy, never on the accent blue.** A filled element is navy; the blues set text, rules and marks.
- **Depth marks the one thing that matters.** A filled navy chip, a navy result card, a dark panel: one per slide, on the element the eye should find first. Two marks send the viewer hunting for the difference between them.
- **Grounds alternate.** Tint cards sit on white; on a tint slide the cards flip white with the same hairline (`fx-card_on-tint`). The system never stacks tint on tint, and the checker reports it as `TINTFILL`.
- **No gradients and no shadows on a light slide.** The navy gradient belongs to the dark bookends and the ribbon illustration; nothing in the system casts a shadow.
- **Colours come from tokens, never from hex.** No case contains a hex literal in its CSS, which is why the palette check has nothing to catch. Where a case's header comment names a colour, it names one that is in the palette.
- **One family.** The cases set `--fx-font` (Geist, falling back through Aptos and Arial) and use weight and size for hierarchy. Monospace is not a second face: `--fx-font-mono` is for literal code only, so a terminal transcript takes it and a kicker, a chip or a table figure does not - and the line that takes it carries the `fx-terminal` marker the checker looks for.
- **Nothing below 11px.** The footer token carries the screen floor, and the checker reports any literal size under it.
- **The notes format.** Claim / What to say / Not on the slide, in a comment after the slide's content. The claim is one sentence; the third block is where everything the slide cannot defend goes.
