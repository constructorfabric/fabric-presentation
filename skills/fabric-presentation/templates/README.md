# Template cases

Worked slides, reduced to their structure. Most cases are a pair: a `.md` file holding the Slidev slide block, and a `.vue` file holding the component that block renders. Two are a block alone - `cover` and `section-divider` are a layout plus frontmatter, and mount no component. The copy is placeholder text and is meant to be thrown away. The structure is what carries over.

Every case comes from a slide that was actually presented: either a layout or example page of the designer's template v4 (cited as `v4-NN` for its eleven example slides, or by layout name) or a slide from a deck this team gave and a reviewer signed off. A case invented at a desk does not belong in this directory.

| Case | The claim it is built for | Built from | Pair |
|---|---|---|---|
| cover | What the deck is and who is behind it | v4-01, layout Cover | [cover.md](cover.md) |
| section-divider | Nothing - it names the part that follows | v4-02, layout Section Divider | [section-divider.md](section-divider.md) |
| category-cards | A set of different KINDS, told apart by their words | v4-06, v4-07, layout Four Columns | [category-cards.md](category-cards.md) + [CategoryCards.vue](CategoryCards.vue) |
| contrast-pair | What holds against what does not | layout Comparison | [contrast-pair.md](contrast-pair.md) + [ContrastPair.vue](ContrastPair.vue) |
| quarter-table | A plan, period by period, with a claim per period | v4-08, layout Table or Chart | [quarter-table.md](quarter-table.md) + [QuarterTable.vue](QuarterTable.vue) |
| status-matrix | A complete comparison, cell by cell | v4-08 | [status-matrix.md](status-matrix.md) + [StatusMatrix.vue](StatusMatrix.vue) |
| status-tiles | A named set, each member in a state, moving in one direction | a presented and reviewed deck slide, on v4-07; the lead line in v4-11's subtitle slot | [status-tiles.md](status-tiles.md) + [StatusTiles.vue](StatusTiles.vue) |
| candidate-tiles | The same set read the other way: proposals, none of them agreed, none of them in trouble | a presented and reviewed deck slide, on v4-07 | [candidate-tiles.md](candidate-tiles.md) + [CandidateTiles.vue](CandidateTiles.vue) |
| terminal-flow | One input producing one result, through three steps | a presented and reviewed deck slide; the dark ground from v4-01, the cards from v4-07. The same parts rendered: example deck slides 11 and 12 | [terminal-flow.md](terminal-flow.md) + [TerminalFlow.vue](TerminalFlow.vue) |

The template is the designer's v4 release (ppt.constructor.rocks, 9 October 2026); [../references/fabric-style.md §0](../references/fabric-style.md) says what it is authority for. [../examples/fabric-deck/](../examples/fabric-deck/) renders every v4 layout these cases sit on, and its `v4-reference.md` rebuilds the template's eleven example slides with the same layouts, checked frame for frame against the template's own pages - for anyone who cannot open the `.potx`.

The cases are not the deck's stylesheet. They use the classes and tokens of a Fabric deck's base: [../assets/fabric-tokens.css](../assets/fabric-tokens.css) and the template-shape sections (1-4) of [../examples/fabric-deck/style.css](../examples/fabric-deck/style.css), with the four layouts in that deck's `layouts/`. `node scripts/new-deck.mjs` copies exactly that base into a new deck, and is the safe route. Anything a case needs beyond it is in the case's own scoped style.

## Taking a case

1. **Copy the pair** into the deck: the `.vue` into `components/`, and paste the `.md`'s body into `slides.md` between two `---` separators. The cover case is the deck's first slide and carries the headmatter, so it replaces the top of `slides.md` rather than joining it.
2. **Rename the component** in both places at once - the file in `components/` and the tag in the slide block. Slidev auto-imports by file name, so a rename in one place alone renders nothing and reports no error.
3. **Fill the copy.** Replace every placeholder, including the ones in the `<script setup>` block, the frontmatter and the speaker notes. A leftover "First item" reaches the export.
4. **Check the frontmatter the case ships with.** Content cases sit on `layout: fabric`; the cover on `layout: fabric-cover` and the divider on `layout: fabric-section`, both of which take their eyebrow, subtitle, author or summary from the frontmatter and place them at the template's coordinates. A scaffolded deck has all four layouts.
5. **Check the base the case assumes.** The tokens and sections 1-4 of the example deck's stylesheet, imported once, with `--fx-scale: 0.7656` for Slidev's 980px canvas against the template's 1280px slide. Content starts at the top of the content box, the way every template layout fills it.
6. **Render the slide and look at it**, zoomed in, beside the template page in the table above. If yours reads lighter, something has dropped: check the deck defines every `--fx-*` the case reads, because one unresolved `var()` invalidates its whole declaration and a fill or a border disappears silently. Then run the conformance check from the skill root:

   ```sh
   node scripts/check-style.mjs <deck-dir>
   ```

   The cases leave it clean. Anything it names after your edit is your edit.

## The template moves the cases carry

- `cover` / `section-divider` - the vertical navy ground (no glow), the 13pt sky-blue caps eyebrow, the 64pt or 42pt white title and the pale subtitle, each at the template's own coordinates; the cover alone has no page number.
- `category-cards`, `contrast-pair`, `status-tiles`, `candidate-tiles` - the template's column card: 297.6 high from the content top on a 28.8 gutter, a 9px corner, a 1pt `--fx-line` border on `--fx-tint`, the 12pt accent-blue caps kicker (spc 100) and the body under it at lnSpc 130% (150% in the Comparison).
- `quarter-table` / `status-matrix` - the template's table, `.fx-table`: **square** corners, a 0.75pt grid on every cell, a navy header in 13pt bold white sentence case, 13pt body, text at the top of the cell.
- `terminal-flow` - the dark ground as a panel, the only place the mono face is legal, over a row of column cards.
- Every page's footer is the wordmark "Constructor Fabric" and the page number, with no rule.

## What the cases hold to

- **Blue and navy lead (template v4).** Teal and lilac are selective secondary accents; green, amber and red exist only as small status signals - a status cell in a table (`.fx-status-cell_*`), a compact tag (`.fx-status_*`) or a dot (`.fx-status-dot_*`), always beside the status word, never a row, a band or a heading. A state that is not the status trio (on track, at risk, blocked) is a word in bold, not a colour. The checker reports a status colour outside a tag or dot as `STATUS`, and any other warm hex as `PALETTE`.
- **Cards are rounded, tables are square.** A card's corner is `--fx-radius`; a table has none.
- **Every colour keeps its role**, and the roles are in §1 of the law. Navy `--fx-navy` is structure and title ink - table headers, step circles, the marked word - and never running body text. `--fx-blue` is the accent on light grounds and `--fx-blue-sky` the accent on dark; they do not swap. `--fx-ink` is body ink.
- **White text on navy, never on the accent blue.**
- **One mark per slide.** The current tile's state word, the marked figure: one per slide, on the thing the eye should find first.
- **Grounds alternate.** Tint cards sit on white; on a tint slide (`ground: tint`) the cards flip white with the same border (`fx-card_on-tint`). The checker reports tint on tint as `TINTFILL`.
- **No gradients on a light slide and no shadows anywhere.** The navy ground belongs to the dark pages and the terminal panel.
- **Colours come from tokens, never from hex.** No case contains a hex literal in its CSS.
- **One family.** `--fx-font` is Aptos, then Helvetica Neue - the faces the template renders in - with no web font. Monospace is for literal code only, and the line that takes it carries the `fx-terminal` marker the checker looks for.
- **Nothing below 11px.** The footer token carries the screen floor, and the checker reports any literal size under it.
- **The notes format.** Claim / What to say / Not on the slide, in a comment after the slide's content. The claim is one sentence; the third block is where everything the slide cannot defend goes.
