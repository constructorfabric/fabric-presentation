# Constructor Fabric style - the law

The style a deck must follow to pass as Constructor Fabric's own. Every rule here is tied to a page of a **rendering** of the two official donor files, or - for web-only values a PPT file cannot carry - to the live constructorfabric.org CSS. Where this file and [fabric-style-spec.md](./fabric-style-spec.md) (the OOXML derivation) disagree about how a colour is used, this file wins: the spec reads XML, this file reads pictures.

Contents: §0 evidence and the render recipe - §1 the palette (dark ground, working blues, tints and ink, what does not exist) - §2 type and the pt ladder - §3 composition (zones, footer, cards and bands, the ribbon motif, slide anatomy) - §4 anti-patterns and the checker rules behind them - §5 web-only vocabulary for Slidev decks.

## 0. Evidence

Two files, rendered at 110 dpi and read page by page:

- **TPL** - `1 - Constructor Fabric Template.potx`, 22 layout pages, cited as `tpl-NN`.
- **EXM** - `2 - Constructor-Fabric-Template-Examples.pptx`, 15 example slides, cited as `exm-NN`.

Third source, for values a PPT cannot show (font family on the web, gradient recipes, the BrandMark): the live **constructorfabric.org** CSS, verified August 2026. Cited as `web`.

Render recipe, reproducible:

```
soffice --headless --convert-to pdf --outdir out/ deck.pptx     # /opt/homebrew/bin/soffice
python3 -c "import fitz; d=fitz.open('out/deck.pdf'); [p.get_pixmap(dpi=110).save(f'out/page-{i+1:02d}.png') for i,p in enumerate(d)]"
```

A caveat the recipe carries: LibreOffice substitutes fonts it does not have, so a rendering is evidence for colour, geometry and composition - never for the letterforms. Font facts come from the XML and the web.

The two donor files are Constructor-internal and do not ship with this skill, so the recipe above is for the people who have them. For everyone else [../examples/fabric-deck/](../examples/fabric-deck/) is the reference rendering: a runnable deck whose slides carry these rules, and whose README says which donor page each one comes from.

## 1. The palette is one colour

Fabric is a **monochrome blue system**. Everything on a slide is a blue, a navy, a blue-grey or white - there is no red, no yellow, no green, no warm hue anywhere in either donor (all 37 pages). The absence is the rule, not an accident of the sample: a Fabric deck with a warm accent in it is off-brand, full stop.

### 1.1 The dark ground (navy family)

Three navies, and they are literally the theme's gradient stops (`dk2 #00204D`, `accent4 #0A2D63`, `accent5 #001838` in TPL):

| Hex | Job | Where you see it |
|---|---|---|
| `#0A2D63` | light end of the dark ground | glow corner of covers (tpl-01, exm-01) |
| `#00204D` | the navy: dark ground mid-stop; **content title ink**; table header band; step circles and pill badges; team names | titles on every light TPL page (tpl-04..22); table header (tpl-21); process circles (tpl-17); timeline pills (tpl-18) |
| `#001838` | dark end of the ground; EXM's title ink variant | closing (exm-15), image panel ground (exm-09/10) |

The dark ground is a **gradient** of these three with a soft lighter glow drifting in from a corner (tpl-01/02/15/20/22, exm-01/03/10/15). Gradients are legal in exactly two places: this ground, and the illustration motif (§3.4). Light slides are flat.

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

### 1.4 What does not exist

No red, yellow, green, purple, orange - **no status colours at all**. Status on a Fabric slide is carried by words, weight and position, not hue. No black `#000` text (ink is navy-family). No greys outside the two listed. `scripts/check-style.mjs` enforces the closed palette and reports a warm hex as `PALETTE`. It reads hexes and tokens, so a colour written as `rgb()`, `hsl()`, `oklch()` or `color-mix()` is reported as `NOTATION` rather than judged: write the scheme hexes or the `--fx` tokens. The one legal exception is a pure white or black alpha veil, which is how a hairline is drawn on a dark ground.

## 2. Type

**One family, weight carries hierarchy.** On the web and in Slidev decks the family is **Geist** (web; Google Fonts `Geist` + `Geist Mono`). The PPT donors could not carry it and declare office-safe stand-ins - Aptos in TPL (783 runs), Arial in EXM - so a rendering shows a neutral grotesque, which is the intent. In a Slidev deck load Geist and fall back through the same neutrals: `'Geist', 'Aptos', -apple-system, 'Segoe UI', Arial, sans-serif`. Geist Mono is for terminal/code content only - never body prose (web).

The ladder (pt at 1280x720, from the donors' XML):

| pt | Job | Seen |
|---|---|---|
| 64 | cover title | tpl-01 |
| 54 | the big stat number (EXM's louder variant) | exm-12 |
| 46 | closing title | tpl-22 |
| 42 | section / image-divider title | tpl-02/15 |
| 40 | stat number in tiles | tpl-13 |
| 32 | content slide title | tpl-04..22 |
| 30 | EXM content title variant | exm-02..14 |
| 17-19 | body, agenda rows | tpl-03, exm-04 |
| 16 | card body, subtitle-under-title, badge text | tpl-08, exm-04 |
| 14-15 | comparison body, team name, table kicker | tpl-12/16 |
| 13 | cover/section eyebrow caps | tpl-01/02 |
| 12 | cover author line | tpl-01 |
| 11 | timeline step description | tpl-18 |
| 10 | footer brand, page number | every page |

Tracking: titles are tight, `-0.5%` on content titles, `-1%` on cover/section (XML `spc="-50"/"-100"`); eyebrow and kicker caps are spread `+1.5..2%` (`spc="150"/"200"`). Titles and kickers bold; body regular. Screen floor for a Slidev deck: nothing under 11px rendered.

## 3. Composition

### 3.1 Canvas and zones

Canvas 12192000x6858000 EMU = **1280x720 px** (16:9). The zone map, as fractions of the canvas (spec §geometry):

- margins **3.8%** left and right (49px at 1280); content width 92.5%
- content title top **8.7%**, one line, bold navy
- the EXM subtitle sits directly under it, `#2668C5`, with a hairline rule below on some pages (exm-02)
- content zone top **22.7%**, bottom ~**89%**
- footer baseline zone at **92.3%**: brand wordmark left, page number right at 91.7%

### 3.2 The footer

Every page carries the plain-text wordmark **"Constructor Fabric"**, 10pt bold, bottom-left - `#6E7B8C` on light, `#A9BEDD` on dark - and a page number bottom-right in the same colour, regular weight (every tpl/exm page; the cover carries the wordmark but no number). There is **no logo image** anywhere in either donor: the wordmark IS the brand mark of a deck. On light EXM pages a full-width hairline rule sits just above the footer (exm-02/04..14).

**The footer never moves between pages.** One geometry on every page: the same 7.7% band at the foot of the slide, the same baseline, the same 3.8% padding on its text, the wordmark in the same spot - tpl-01's wordmark sits on the same 92.3% baseline as every content page. Two differences are legal and no others: a **dark page draws no visible hairline** (make the border transparent, keep the box - drop the box and the wordmark shifts), and the **cover carries no page number**. A footer that jumps a few pixels as the deck advances is the kind of fault nobody names and everybody feels.

Where a deck has sections, the footer of its **light content pages** also carries the section names between the wordmark and the page number, the current one in navy bold or the accent blue and the rest in the footer grey. This is our own convention, not something the donor templates show - no tpl or exm page carries one - so say so if a reviewer asks where it came from. It never appears on a filled or dark page: cover, section divider, quote and closing keep a wordmark-only footer. **The web BrandMark (four rounded squares, §5) does NOT go on slides.** The wordmark is the only brand mark a deck carries.

### 3.3 Cards and structure

- **Rounded corners.** Every container is a rounded rectangle - `roundRect adj 3000` in the donors, ~10-12px at 720p. Square-cornered panels are not Fabric's geometry.
- **The card**: `#F2F6FC` fill, 1pt `#DCE3EE` border, kicker in `#0065E3` bold caps, body `#243143`. One to four per row (tpl-08..12). On a tint ground the card flips white (exm-11).
- **The band header**: a `#E6EFFA` rounded band with navy bold text, body text below on the bare ground - EXM's lighter-weight alternative to the card (exm-05/06/07/13). The band is legal ONLY in that observed shape: standing alone on the bare ground, heading the column below it. **A heading inside a card or panel is never a filled band** - a band narrower than the container it heads inverts the visual hierarchy, and the outer thing must read wider than what it contains. In-card headings are the plain kicker (blue caps) set off from the body by a hairline `#DCE3EE` rule.
- **Structure markers are navy**: numbered circles with white digits on a `#DCE3EE` rail (tpl-17), navy pills with white bold text (tpl-18). White-on-navy, never white-on-blue.
- **Tables**: header row is a solid `#00204D` band with white bold text; body rows white / `#F2F6FC` zebra; hairline `#DCE3EE` rules; no vertical outer border walls (tpl-21).
- **No shadows** on any donor page. The web uses a faint navy-tinted shadow on interactive cards; decks do without.

### 3.4 The illustration motif

Fabric's signature imagery is a **flowing ribbon pair** - a thick `#0065E3` curve shadowed by a thinner `#6BA5F0` curve - drifting diagonally over soft tint circles (`#E6EFFA`-family on light, navy-family on dark). Seen framed on light slides (exm-08/13), on a dark panel (exm-09), and full-bleed with one white sentence (exm-10). Use it for interstitials and image placeholders, not behind body text. This and the dark ground are the only legal gradients/organic shapes.

### 3.5 Slide anatomy and rhythm

- **Dark bookends**: cover and closing are dark; section dividers and the quote slide are dark; content is light (both donors, every page). The dark pages are not only bookends: in a deck built of several parts - often with a different presenter per part - **every section opens with a dark section-divider slide**, so the dark ground recurs through the middle of the deck and is what tells the room a part has ended.
- Cover: eyebrow caps -> 64pt title -> subtitle -> author line -> wordmark (tpl-01); EXM's variant puts the wordmark top-left and the date under the presenter (exm-01).
- Content: title -> blue subtitle stating the takeaway -> one structure (cards, bands, table, image+text) -> footer. **No eyebrow above a content title**: the caps line belongs to the dark pages, where the donors put it (tpl-01/02), and no tpl content page carries one. A pre-heading over a title that already states the claim says nothing the title does not. The kicker inside a card is a different element and stays.
- Closing: "Thank you", contact lines, and EXM adds a short `#0065E3` rule above the contact line (exm-15).

## 4. Anti-patterns

Each of these breaks the look; the checker names the greppable ones.

| Anti-pattern | Why it fails | Check |
|---|---|---|
| A warm hex (red/yellow/green/orange) anywhere | the system is monochrome blue - one warm pixel reads as another company's deck | `PALETTE` |
| Square-cornered cards/panels | every Fabric container is a rounded rectangle | `RADIUS` |
| Navy `#00204D` as body-text colour on large runs | navy is title/structure ink; body is `#243143`/`#0E1A2C` | - (a grep cannot tell a heading from a body run; check by eye in the render pass) |
| Gradient on a light slide, or under body text | gradients belong to the dark ground and the ribbon motif only | `GRADIENT` |
| A logo image in the footer | the donors' brand mark is the 10pt wordmark | - (eyes only - the checker does not parse markup structure) |
| Tint card on tint ground | grounds and fills must alternate white/`#F2F6FC` | `TINTFILL` |
| A filled band heading INSIDE a card/panel | a band narrower than its container inverts the hierarchy; in-card headings are kicker + hairline rule | - (composition; caught in the render pass) |
| A footer hairline that stops short of the slide edges | the rule spans the full slide width on every page; padding belongs to the footer's text, never to the slide root | - (render pass; the dark layouts are where padding on the slide root would cut it short) |
| A footer whose box differs between pages | the footer jumps as the deck advances; one geometry everywhere, the hairline going transparent on dark rather than the box going away | - (render pass; flip between consecutive pages and watch the wordmark) |
| An eyebrow above a content title | the pre-heading repeats the claim the title already states; caps lines belong to dark pages and to card heads | - (composition; caught in the render pass) |
| Serif or slab anywhere, mono in body prose | one grotesque family; mono is for terminal content | `FONT` |
| A shadow on any element | no donor page casts one | `SHADOW` |
| Text below 11px rendered | unreadable in a room | `TYPEFLOOR` |
| Off-scheme blues (near-misses of the scheme's blues) | the fourteen hexes of §1 are the whole palette | `NEARMISS` |
| Black `#000` ink | Fabric ink is navy-family | `INK` |

## 5. Web-only vocabulary (Slidev decks)

Values the donors cannot carry but the live site defines (`web`, constructorfabric.org, Aug 2026) - use them where a deck needs interactive-grade polish:

- **BrandMark** (a web mark, not part of the deck system - described here only so it is recognised if met): four 13x13 squares (`rx 2.5`) in a 2x2 grid, viewBox 32: top-left `#00204D` (`currentColor`), top-right `#0065E3`, bottom-left `#6BA5F0`, bottom-right = top-left at `fillOpacity .18` with a 1.5 stroke. It goes on no slide (§3.2).
- **Dark-ground gradient recipe**: `linear-gradient(160deg, #0A2D63 0%, #00204D 50%, #001838 100%)` plus a soft radial glow - the CSS equivalent of the donors' jpeg grounds.
- **Radii**: cards 16px, hero frames 22px, buttons 10px, pills 999px (decks: 10-16px is the family).
- **Graph-paper grid**: two repeating 1px gradients at 56px cells, faded by a radial mask, dark bookends only, screen-only.

Build from [../assets/fabric-tokens.css](../assets/fabric-tokens.css), which carries all of the above as custom properties, and check with `node scripts/check-style.mjs <deck-dir>`.
