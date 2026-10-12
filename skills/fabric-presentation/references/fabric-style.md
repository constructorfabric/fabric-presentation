# Constructor Fabric style - the law

The style a deck must follow to pass as Constructor Fabric's own. Every rule here is tied to a page of a **rendering** of the two official donor files, or - for web-only values a PPT file cannot carry - to the live constructorfabric.org CSS. Where this file and [fabric-style-spec.md](./fabric-style-spec.md) (the OOXML derivation) disagree about how a colour is used, this file wins: the spec reads XML, this file reads pictures.

Contents: §0 evidence and the render recipe - §1 the palette (dark ground, working blues, tints and ink, secondary accents and status colours, what does not exist) - §2 type and the pt ladder - §3 composition (zones, footer, cards and bands, the ribbon motif, slide anatomy) - §4 anti-patterns and the checker rules behind them - §5 web-only vocabulary for Slidev decks.

## 0. Evidence

Two files, rendered at 110 dpi and read page by page:

- **TPL** - `1 - Constructor Fabric Template.potx`, 22 layout pages, cited as `tpl-NN`.
- **EXM** - `2 - Constructor-Fabric-Template-Examples.pptx`, 15 example slides, cited as `exm-NN`.

- **V4** - `Constructor-Fabric-Extended-2026-v4.pptx`, the designer's v4 release of 9 October 2026 (published at ppt.constructor.rocks with its `.potx`), 11 slides, cited as `v4-NN`. It keeps the original nine slides and 23 layouts and adds two colour-guide pages (v4-10 colour hierarchy, v4-11 status colours). **Where V4 and the older donors disagree about colour, V4 wins**: it is the designer's latest ruling.

Third source, for values a PPT cannot show (font family on the web, gradient recipes, the BrandMark): the live **constructorfabric.org** CSS, verified August 2026. Cited as `web`.

Render recipe, reproducible:

```
soffice --headless --convert-to pdf --outdir out/ deck.pptx     # /opt/homebrew/bin/soffice
python3 -c "import fitz; d=fitz.open('out/deck.pdf'); [p.get_pixmap(dpi=110).save(f'out/page-{i+1:02d}.png') for i,p in enumerate(d)]"
```

A caveat the recipe carries: LibreOffice substitutes fonts it does not have, so a rendering is evidence for colour, geometry and composition - never for the letterforms. Font facts come from the XML and the web.

The two donor files are Constructor-internal and do not ship with this skill, so the recipe above is for the people who have them. For everyone else [../examples/fabric-deck/](../examples/fabric-deck/) is the reference rendering: a runnable deck whose slides carry these rules, and whose README says which donor page each one comes from.

## 1. The palette: blue and navy lead

Fabric is a **blue-and-navy system** with a strict colour hierarchy (v4-10). Fabric blue `#0065E3` and navy `#00204D` are the primary colours and carry the whole visual structure: titles, headings, grounds, brand emphasis. Everything else on a slide is a blue-grey, a tint or white. Two **secondary accents**, teal and lilac, support the blues selectively, and three **status colours**, green, amber and red, exist only as small signals (§1.4). A slide where a secondary or status colour outweighs the blues is off-brand: blue and navy remain dominant.

### 1.1 The dark ground (navy family)

Three navies, and they are literally the theme's gradient stops (`dk2 #00204D`, `accent4 #0A2D63`, `accent5 #001838` in TPL):

| Hex | Job | Where you see it |
|---|---|---|
| `#0A2D63` | light end of the dark ground: the TOP of it | top edge of every dark page (v4-01/02/09) |
| `#00204D` | the navy: dark ground mid-stop; **content title ink**; table header band; step circles and pill badges; team names | titles on every light TPL page (tpl-04..22); table header (tpl-21); process circles (tpl-17); timeline pills (tpl-18) |
| `#001838` | dark end of the ground: the BOTTOM of it; EXM's title ink variant | bottom edge of every dark page (v4-01/02/09) |

The dark ground is a **vertical gradient** of these three - `#0A2D63` at the top, `#00204D` at mid-height, `#001838` at the bottom, every row one colour - with **no glow**. V4 ships it as one 1600x900 jpeg (byte-identical to [../assets/reference/fabric-dark-ground.jpeg](../assets/reference/fabric-dark-ground.jpeg)) on Cover, Section Divider, Image Divider, Quote and Closing; sampled across its height it is exactly that three-stop ramp, which is `--fx-grad-ground`. Gradients are legal in exactly two places: this ground, and the illustration motif (§3.4). Light slides are flat - white, or `#F2F6FC` on the Agenda layout.

### 1.2 The working blues

| Hex | Job | Where you see it |
|---|---|---|
| `#0065E3` | **the accent**: card kickers in caps, the big stat number, the short rule on the closing slide, hyperlinks, the illustration's primary ribbon | HEADING ONE/TWO... (tpl-08..12); 83% at 54pt (exm-12); rule above contacts (exm-15); ribbons (exm-08/09/10/13) |
| `#2668C5` | secondary accent: **the subtitle line under a content title** - EXM puts one on nearly every light slide | "State the conclusion first..." (exm-04, also exm-02/05..14) |
| `#6BA5F0` | the accent for **dark grounds**: eyebrow caps on covers and sections, closing subtitle, quote attribution, the illustration's secondary ribbon | PRESENTATION / SECTION 01 (tpl-01/02/15); "Questions, decisions..." (exm-15); Name, Title, Company (tpl-20) |

One accent per element: a kicker is `#0065E3`, an eyebrow on dark is `#6BA5F0` - they do not swap, and they do not appear together carrying the same job.

### 1.3 Tints, greys-of-blue, ink

| Hex | Job | Where you see it |
|---|---|---|
| `#F2F6FC` | card fill on white; alternate slide ground; table zebra row | every RoundCard (tpl-08..14); agenda ground (tpl-03); ground of exm-11 |
| `#E6EFFA` | band-header fill (navy bold text on it); subtitle ink on dark covers/sections | column bands (exm-05/06/07, "Main takeaway" exm-13); cover subtitle (tpl-01) |
| `#DCE3EE` | the hairline: card border (1pt), timeline rail, row rules | card borders everywhere; rail (tpl-17) |
| `#A9BEDD` | muted ink **on dark**: author line, footer, page number | tpl-01 author; dark footers |
| `#6E7B8C` | muted ink **on light**: footer, captions, team roles, step descriptions, table kicker caps | light footers; "Image caption or source" (tpl-04); roles (tpl-16) |
| `#243143` | body ink | card bodies, agenda rows, bullets (tpl-07, exm-04) |
| `#0E1A2C` | deepest ink (EXM's dk1); use for body where `#243143` is too light | EXM body runs |
| `#FFFFFF` | light ground; card fill when the ground is `#F2F6FC`; text on dark | exm-11 cards; every dark slide |

On a `#F2F6FC` ground, cards flip to white with the same `#DCE3EE` border (exm-11). Never stack tint on tint.

### 1.4 Secondary accents and status colours (v4)

V4's theme reorders the accents to blue, teal, lilac, green, amber, red; navy stays Dark 2 (v4 `theme1.xml`).

| Hex | Token | Job | Where you see it |
|---|---|---|---|
| `#087582` | `--fx-teal` | secondary accent: supporting emphasis, a selected data series | v4-10 |
| `#8545D6` | `--fx-lilac` | secondary accent: occasional emphasis, telling categories apart | v4-10 |
| `#15803D` | `--fx-green` | status **On track** - good, complete or healthy | v4-11 |
| `#F4B544` | `--fx-amber` | status **At risk** - attention or action needed; dot and light only, too pale for text | v4-11 |
| `#995600` | `--fx-amber-ink` | the At-risk tag's word, on its tint | v4-11 |
| `#C92E47` | `--fx-red` | status **Blocked** - failed, critical or unable to continue | v4-11 |

Each has a pale tint for the swatch or tag behind it (`--fx-teal-tint #E7F5F6`, `--fx-lilac-tint #F3ECFB`, `--fx-green-tint #EAF6EE`, `--fx-amber-tint #FFF3D6`, `--fx-red-tint #FDECF0`).

**Secondary accents are used selectively.** A second series in a chart, a category mark that has to be told from blue - never a title, a ground, a band or the element carrying the slide's point. One secondary accent per slide is the default; if both appear, they mark two categories, not decoration.

**Status colours are small signals only** (v4-11: "Keep these colours visually minor"). Legal forms: a compact tag (tinted pill, status word in the status colour - `.fx-status_on-track` / `_at-risk` / `_blocked`), a small dot before the word (`.fx-status-dot_*`), a traffic light. The **status word is always there**: colour repeats it, never replaces it, so a slide still reads in greyscale. Never a large background, a card or band fill, a heading, a title, or a decorative chart in status colours. `scripts/check-style.mjs` reports a status colour outside a rule naming a tag, dot, chip, pill, badge, light or status as `STATUS`.

### 1.5 What does not exist

No orange, pink, yellow other than the amber above, no other green, red or purple - the warm and secondary hues are exactly the six listed in §1.4. No black `#000` text (ink is navy-family). No greys outside the two listed. `scripts/check-style.mjs` enforces the closed palette and reports a warm hex as `PALETTE`. It reads hexes and tokens, so a colour written as `rgb()`, `hsl()`, `oklch()` or `color-mix()` is reported as `NOTATION` rather than judged: write the scheme hexes or the `--fx` tokens. The one legal exception is a pure white or black alpha veil, which is how a hairline is drawn on a dark ground.

## 2. Type

**One family, weight carries hierarchy.** V4 sets every run in **Aptos** (331 explicit runs, both theme font slots). Where Aptos is not installed it falls back to **Helvetica Neue** - that is what the designer's published renders of v4 show, measured glyph for glyph against a browser render of each face - so a deck's stack is `'Aptos', 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, sans-serif` (`--fx-font`) and loads no web font. Mono is for terminal/code content only, never body prose. (Earlier decks set Geist from the website; v4 supersedes it - the checker reports another family as the primary face as `FONT`.)

The ladder (pt at 1280x720, from the v4 XML):

| pt | Job | Seen |
|---|---|---|
| 64 | cover title | v4-01 |
| 54 | the big stat number (EXM's louder variant) | exm-12 |
| 46 | closing title | v4-09 |
| 42 | section / image-divider title | v4-02, layout 16 |
| 40 | Big Stats number | layout 14 |
| 32 | content slide title; quote text (regular) | v4-03..11, layout 21 |
| 20 | sub-heading on a content slide | v4-10/11 |
| 18 | cover subtitle; guide lead lines | v4-01/10/11 |
| 17 | agenda rows | layout 4 |
| 16 | bullets, image caption, image + text body | v4-03/05 |
| 15 | two-column card body, comparison body, section summary, quote attribution, closing contacts | v4-02/06, layouts 13/21/23 |
| 14 | three-column card body, team name, step name | v4-07, layouts 17/18 |
| 13 | eyebrow caps on dark; every table cell, header included; four-column card body | v4-01/02/08, layout 12 |
| 12 | card kicker caps; cover author line; image caption | v4-01/06/07 |
| 11 | process step note | layout 18 |
| 10 | footer wordmark, page number | every page |

**Tracking is `spc` in hundredths of a point**, so it is an absolute amount, not a percentage: content titles and the quote `-0.5pt` (`spc -50`), cover/section/closing titles `-1pt` (`spc -100`), dark eyebrow caps `+2pt` (`spc 200`), card kicker caps `+1pt` (`spc 100`), placeholder labels `+1.5pt`. Titles, kickers, eyebrows, table headers, team and step names bold; body regular. Screen floor for a Slidev deck: nothing under 11px rendered.

**Line spacing follows PowerPoint, not CSS.** PowerPoint's single line is 1.19 x the size and an `lnSpc` percentage multiplies it (130% cards, 140% image text, 150% comparison and contacts, 160% bullets, 170% agenda). It also sets a frame's first line lower than CSS would - 0.12em plus 0.44 x (P - 1) em in a body placeholder, 0.055em in a title - and gives every later paragraph its 20% space-before. `--fx-leading-*`, `--fx-lead-*` and `--fx-space-before` carry those numbers; fitted against the v4 renders they land text within 1-2px of the template.

## 3. Composition

### 3.1 Canvas and zones

Canvas 12192000x6858000 EMU = **1280x720 px** (16:9). Every frame is placed absolutely, the way PowerPoint places it; the numbers below are v4's own, in 1280-canvas pixels (`--fx-u` in CSS):

- **Boxes start at x=48** and the full-width ones are 1184 wide (to x=1232). **Text starts at x=57.6**: a text frame insets its text 9.6 left and right and 4.8 top and bottom (PowerPoint's default). A card or a table edge sits at 48 and the title's first letter at 57.6 - the step is visible and deliberate.
- **Content title frame at y=52.8**, one line, 32pt bold navy.
- **Content starts at y=163.2** - every card row, table and column set - and sits at the TOP of the zone; nothing is centred vertically. The Big Stats row starts at 249.6, the Image card at 144 (to 649.9).
- **Cards are 297.6 high** in every column layout, on a **28.8 gutter** (two 577.6, three 375.5, four 274.4 wide).
- **Footer frame at y=664.3**, 28.8 high, text centred in it.
- Dark pages: cover eyebrow 163.2, title 201.6 (1084.8 wide), subtitle 436.8, author 585.6; section eyebrow 230.4, title 273.6, summary 412.8; closing title 201.6, contacts 360; quote 182.4 at x=105.6, attribution 470.4.

### 3.2 The footer

Every page carries the plain-text wordmark **"Constructor Fabric"**, 10pt bold, text at x=57.6 - `#6E7B8C` on light, `#A9BEDD` on dark - and a page number in the same colour, regular weight, right-aligned to x=1222.4, both centred in the frame y=664.3..693.1. **There is no rule above the footer** in v4 - not on light pages, not on dark ones - and **no logo image**: the wordmark IS the brand mark of a deck. The number is **unpadded** ("7", not "07"). The cover carries the wordmark and no number; every other page, dark ones included, carries both.

**The footer never moves between pages.** One frame on every page, the same coordinates on light and dark.

The footer carries nothing else. A section nav between the wordmark and the number is **not a template shape**: the example deck keeps it as an opt-in (`sections.ts` ships empty and the nav renders nothing), and a deck that fills it is departing from v4 and should say so. **The web BrandMark (four rounded squares, §5) does NOT go on slides.**

### 3.3 Cards and structure

- **Cards are rounded, tables are square.** A card is `roundRect` with adj 3000 - the corner is 3% of the card's shorter side, 8.9px on the 297.6 card, so `--fx-radius` is 9px of the 1280 canvas. A table is a graphic frame with **no corner at all**.
- **The card** (v4-06/07, layouts 10-14/20): `#F2F6FC` fill, **1pt** `#DCE3EE` border, text inset 36.5 left/right and 28.8 top/bottom; the kicker in `#0065E3` 12pt bold caps, spc 100, 8pt after it; the body `#243143` at lnSpc 130% - 15pt in two columns, 14pt in three, 13pt in four. One to four per row; no card is filled - the template marks none. On a tint ground the card flips white (exm-11).
- **The table** (v4-08): a navy `#00204D` header row in **13pt bold white sentence case** (no caps, no tracking); body rows in 13pt ink, white and `#F2F6FC` alternating from the first body row; a **0.75pt `#DCE3EE` line on every side of every cell**, header included, so the navy header shows pale column lines; text at the top of each cell with 9.6 / 4.8 margins; header row 57.6 high, body rows 52.8; figures right-aligned. `.fx-table` is this shape.
- **Status in a table** (v4-11): the status cell filled with the status tint and the status word in bold status ink (`.fx-status-cell_*`); the other cells plain white. The guide tables set 16pt body / 14pt header, cell margins 14 / 12 / 14 / 10, text centred, a 0.6pt grid.
- **The band header**: a `#E6EFFA` rounded band with navy bold text, body text below on the bare ground - EXM's lighter-weight alternative to the card (exm-05/06/07/13), not in v4. The band is legal ONLY standing alone on the bare ground. **A heading inside a card or panel is never a filled band** - in-card headings are the plain kicker set off from the body by a hairline `#DCE3EE` rule.
- **Process** (layout 18): a 1.5pt `#DCE3EE` rail at y=275 through four 52.8 navy circles with 16pt bold white numbers; under each the step name (14pt bold navy) and its note (11pt `#6E7B8C`, lnSpc 130%), both centred. White-on-navy, never white-on-blue.
- **Team** (layout 17): 96px photo circles, `#E6EFFA` fill and 1pt hairline, four to a row; name and role under each, 14pt bold navy, centred.
- **No shadows** on any donor page.

### 3.4 The illustration motif

Fabric's signature imagery is a **flowing ribbon pair** - a thick `#0065E3` curve shadowed by a thinner `#6BA5F0` curve - drifting diagonally over soft tint circles (`#E6EFFA`-family on light, navy-family on dark). Seen framed on light slides (exm-08/13), on a dark panel (exm-09), and full-bleed with one white sentence (exm-10). Use it for interstitials and image placeholders, not behind body text. This and the dark ground are the only legal gradients/organic shapes.

### 3.5 Slide anatomy and rhythm

- **Dark bookends**: cover and closing are dark; section dividers and the quote slide are dark; content is light (both donors, every page). The dark pages are not only bookends: in a deck built of several parts - often with a different presenter per part - **every section opens with a dark section-divider slide**, so the dark ground recurs through the middle of the deck and is what tells the room a part has ended.
- Cover: eyebrow caps -> 64pt title -> subtitle -> author line -> wordmark (v4-01).
- Content: title -> one structure (cards, table, list, image+text) -> footer. V4 sets no subtitle line under the title and no takeaway line under the picture; EXM's blue subtitle (`#2668C5`) is legal but not part of the template's look. **No eyebrow above a content title**: the caps line belongs to the dark pages, where the donors put it (tpl-01/02), and no tpl content page carries one. A pre-heading over a title that already states the claim says nothing the title does not. The kicker inside a card is a different element and stays.
- Closing: "Thank you" (46pt) and the contact lines (15pt `#E6EFFA`, lnSpc 150%) (v4-09, layout 23). EXM adds a short `#0065E3` rule above the contact line (exm-15); v4 does not.

## 4. Anti-patterns

Each of these breaks the look; the checker names the greppable ones.

| Anti-pattern | Why it fails | Check |
|---|---|---|
| A warm hex other than the three status tokens | the system is blue and navy; its only warm hues are green, amber and red for status - any other reads as another company's deck | `PALETTE` |
| A status colour as a fill, band, heading or decoration | status colours are small signals beside the status word (v4-11); a large one outweighs the blues | `STATUS` |
| Teal or lilac leading the slide (title, ground, the point's element) | secondary accents support blue and navy, they never lead (v4-10) | - (render pass) |
| Square-cornered cards/panels, or a rounded table | cards are roundRect, tables are square (v4-06/08) | `RADIUS` |
| A table without vertical lines, or with a caps header | v4 draws a full 0.75pt grid and a sentence-case 13pt header (v4-08) | - (render pass) |
| Content centred vertically in the zone | every v4 layout starts its content at y=163.2 | - (render pass) |
| Navy `#00204D` as body-text colour on large runs | navy is title/structure ink; body is `#243143`/`#0E1A2C` | - (a grep cannot tell a heading from a body run; check by eye in the render pass) |
| Gradient on a light slide, or under body text | gradients belong to the dark ground and the ribbon motif only | `GRADIENT` |
| A logo image in the footer | the donors' brand mark is the 10pt wordmark | - (eyes only - the checker does not parse markup structure) |
| Tint card on tint ground | grounds and fills must alternate white/`#F2F6FC` | `TINTFILL` |
| A filled band heading INSIDE a card/panel | a band narrower than its container inverts the hierarchy; in-card headings are kicker + hairline rule | - (composition; caught in the render pass) |
| A rule above the footer, or a padded page number ("07") | v4's footer is two runs of text and nothing else | - (render pass) |
| A footer whose frame differs between pages | the footer jumps as the deck advances; one frame everywhere | - (render pass; flip between consecutive pages and watch the wordmark) |
| A glow on the dark ground | v4's ground is a plain vertical ramp | `GRADIENT` / skill-doctor (the glow token is gone) |
| An eyebrow above a content title | the pre-heading repeats the claim the title already states; caps lines belong to dark pages and to card heads | - (composition; caught in the render pass) |
| Serif or slab anywhere, a primary face other than Aptos, mono in body prose | one grotesque family (Aptos, Helvetica Neue fallback); mono is for terminal content | `FONT` |
| A shadow on any element | no donor page casts one | `SHADOW` |
| Text below 11px rendered | unreadable in a room | `TYPEFLOOR` |
| Off-scheme blues (near-misses of the scheme's blues) | the fourteen hexes of §1 are the whole palette | `NEARMISS` |
| Black `#000` ink | Fabric ink is navy-family | `INK` |

## 5. Web-only vocabulary (Slidev decks)

Values the donors cannot carry but the live site defines (`web`, constructorfabric.org, Aug 2026) - use them where a deck needs interactive-grade polish:

- **BrandMark** (a web mark, not part of the deck system - described here only so it is recognised if met): four 13x13 squares (`rx 2.5`) in a 2x2 grid, viewBox 32: top-left `#00204D` (`currentColor`), top-right `#0065E3`, bottom-left `#6BA5F0`, bottom-right = top-left at `fillOpacity .18` with a 1.5 stroke. It goes on no slide (§3.2).
- **Dark-ground gradient recipe** (the website's): `linear-gradient(160deg, ...)` plus a radial glow. Decks do NOT use it - v4's ground is the vertical ramp of §1.1.
- **Radii** (the website's): cards 16px, hero frames 22px, buttons 10px. Decks use v4's: 9px cards, square tables, 50% circles.
- **Graph-paper grid**: two repeating 1px gradients at 56px cells, faded by a radial mask, dark bookends only, screen-only.

Build from [../assets/fabric-tokens.css](../assets/fabric-tokens.css), which carries all of the above as custom properties, and check with `node scripts/check-style.mjs <deck-dir>`.
