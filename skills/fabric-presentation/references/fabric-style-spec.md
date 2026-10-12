# Constructor Fabric style - the OOXML derivation

> **Provenance and precedence.** This file is what is IN the two donor files, path by path: theme values, placeholder geometry, explicit run properties. It is authority for geometry, the type ladder, and which XML element carries what. It is NOT authority for how a colour is used on a slide - XML can say a fill exists, not what it means or how much of a page it covers. Where this file's interpretation and [fabric-style.md](./fabric-style.md) disagree, the law wins, because the law was read off 110-dpi renderings of the same two files (its §0 carries the recipe).

Donors:

- **TPL** - `1 - Constructor Fabric Template.potx` (22 layouts, 1 master, 5 media jpegs)
- **EXM** - `2 - Constructor-Fabric-Template-Examples.pptx` (15 slides; its own theme)

## 0. Template v4 (9 October 2026) - supersedes the sections below where they differ

Source: `Constructor-Fabric-Extended-2026-v4.pptx` / `.potx` from ppt.constructor.rocks (`latest.json`: 11 slides, 23 layouts, 16:9; built from `cf-talks/branding/source/CF-template.pptx`). Read from the unzipped XML; every coordinate in 1280 x 720 px (EMU / 9525).

- **Theme**: dk1 `000000`, lt1 `FFFFFF`, dk2 `00204D`, lt2 `F2F6FC`; accents reordered to `0065E3` blue, `087582` teal, `8545D6` lilac, `15803D` green, `F4B544` amber, `C92E47` red; hlink `0065E3`, folHlink `2668C5`. Major and minor font **Aptos**; 331 runs name Aptos explicitly.
- **Master**: text styles only - `bodyStyle` lvl1 carries `spcBef 20%` and a `•` bullet in Arial, which every body placeholder inherits; no layout overrides it. `titleStyle` `spcBef 0`. No line, no logo, no rule shape on the master or any layout; the only line in the package is the Process rail.
- **Dark ground**: `media/image1.jpeg`, 1600 x 900, byte-identical to the older donors' grounds and to `assets/reference/fabric-dark-ground.jpeg`; a vertical ramp `0A2D63` -> `00204D` -> `001838`, constant across each row, no glow. On layouts 2, 3, 16, 21, 23.
- **Footer**: a text frame at x=48 y=664.3, 384 x 28.8, anchor ctr, "Constructor Fabric" 10pt bold (`6E7B8C` light / `A9BEDD` dark); `sldNum` at x=1174.4, 57.6 x 28.8, right-aligned. Every layout but the Cover (2) carries the number.
- **Text frames** use PowerPoint's default insets 9.6 / 4.8 (`bodyPr` sets none).
- **Geometry by layout** (title frames on the example slides sit at y=52.8; the layout placeholders say 62.4 on 4, 12-14, 17-22):

| Layout | Frames |
|---|---|
| 2 Cover | eyebrow 48,163.2 w768 13pt B spc200 `6BA5F0`; title 48,201.6 w1084.8 h201.6 64pt B spc-100 white; subtitle 48,436.8 w844.8 18pt `E6EFFA`; author 48,585.6 12pt `A9BEDD` |
| 3 Section | eyebrow 48,230.4; title 48,273.6 w1056 42pt B spc-100; summary 48,412.8 w825.6 15pt `E6EFFA` |
| 4 Agenda | ground `F2F6FC`; list 48,163.2 w883.2 17pt `243143` lnSpc 170% |
| 5 / 6 / 7 Image | card 48,153.6 1184 x 417.6 + caption 48,585.6 12pt muted / card 48,144 1184 x 505.9 / card 48,144 577.6 x 505.9 + text 654.4,153.6 577.6 x 486.7 16pt lnSpc 140% anchor ctr |
| 8 List | 48,192 w912, 16pt lnSpc 160%, bullet marL 29.3 indent -29.3 |
| 10 / 11 / 12 Columns | cards from y=163.2, 297.6 high, gutter 28.8, widths 577.6 / 375.5 / 274.4; kicker 12pt B spc100 `0065E3` lnSpc 130% spcAft 8pt; body 15 / 14 / 13pt lnSpc 130% |
| 13 Comparison | two 577.6 x 297.6 cards, body 15pt lnSpc 150% |
| 14 Big Stats | three 375.5 x 249.6 cards at y=249.6, 40pt B navy centred |
| 15 Image + Text | card 48,163.2 615.7 x 297.6; text 692.5,172.8 539.5 x 278.4 16pt lnSpc 140% |
| 16 Image Divider | eyebrow 230.4, title 273.6 42pt, caption 48,625.9 10pt `A9BEDD` |
| 17 Team | photo circles 96 (`E6EFFA`, 1pt `DCE3EE`) at x=137.2/440.4/743.6/1046.8, y=163.2/395.5; name frames 274.4 wide 115.2 below, 14pt B navy centred |
| 18 Process | rail 196..1084 at y=275, 1.5pt `DCE3EE`; circles 52.8 navy at x=169.6/465.6/761.6/1057.6 y=249.6, 16pt B white; name y=331.2 14pt B navy; note y=374.4 11pt `6E7B8C` lnSpc 130%, frames 267.2 wide |
| 20 Logos | six 177.3 x 96 cards at y=345.6 |
| 21 Quote | 105.6,182.4 w1065.6 32pt regular white spc-50; attribution 105.6,470.4 15pt B `6BA5F0` |
| 22 Table or Chart | content 48,163.2 1184 x 465.6 |
| 23 Closing | title 48,201.6 w960 46pt B spc-100; contacts 48,360 w768 15pt `E6EFFA` lnSpc 150% |

- **Cards**: `roundRect` adj 3000 (corner = 3% of the shorter side), fill `F2F6FC`, `ln w=12700` (1pt) `DCE3EE`, insets 36.5 / 28.8.
- **Table** (slide 8): graphic frame 48,163.2, 1184 wide, four 296 columns; header row 57.6, body rows 52.8; every cell `lnL/R/T/B` 9525 EMU (0.75pt) `DCE3EE`; header fill `00204D`, 13pt B white; body 13pt `243143`, fills `FFFFFF` / `F2F6FC` alternating; default cell margins, top anchor; figures `algn="r"`. No corner.
- **Guide tables** (slides 10/11): 0.6pt grid, margins 14 / 12 / 14 / 10, anchor ctr, body 16pt, header 14pt; swatch cells filled with the colour and white bold text, hex cells with the colour's tint; status cells `EAF6EE` / `FFF3D6` / `FDECF0` with the word in `15803D` / `995600` / `C92E47` bold.

Contents: §1 theme colour slots - §2 fonts - §3 canvas and master - §4 the 23-layout inventory with pt sizes - §5 placeholder geometry as canvas fractions - §6 media - §7 EXM deviations.

## 1. Colour scheme (`ppt/theme/theme1.xml` clrScheme)

| Slot | TPL | EXM | Reading |
|---|---|---|---|
| dk1 | `000000` | `0E1A2C` | EXM moves the working ink into dk1; TPL leaves Office black there and inks runs explicitly |
| lt1 | `FFFFFF` | `FFFFFF` | the light ground |
| dk2 | `00204D` | `001838` | the navy; EXM prefers the deeper stop for titles |
| lt2 | `F2F6FC` | `F2F6FC` | the tint ground/fill |
| accent1 | `0065E3` | `0065E3` | the accent blue |
| accent2 | `2668C5` | `2668C5` | secondary blue (EXM subtitles) |
| accent3 | `6BA5F0` | `6BA5F0` | sky blue (dark-ground accent) |
| accent4 | `0A2D63` | `0A2D63` | navy gradient stop (light end) |
| accent5 | `001838` | `DCE3EE` | TPL: gradient stop (dark end); EXM repurposes the slot for the hairline |
| accent6 | `E6EFFA` | `243143` | TPL: band tint; EXM: body ink |
| hlink / folHlink | `0065E3` / `2668C5` | same | links stay in the two working blues |

The two themes cover one palette of twelve values: `001838 00204D 0A2D63 0065E3 2668C5 6BA5F0 A9BEDD 6E7B8C DCE3EE E6EFFA F2F6FC FFFFFF` plus inks `0E1A2C 243143`. `A9BEDD` and `6E7B8C` appear only as explicit run colours (muted-on-dark / muted-on-light), not scheme slots.

## 2. Fonts

- TPL `fontScheme`: major and minor both **Aptos**; 783 explicit `typeface="Aptos"` runs across layouts/master; 9 `Arial` (bullet glyph fonts).
- EXM: major/minor **Arial**, 552 explicit Arial runs.
- Neither donor embeds a font. Neither carries Geist - the web family (constructorfabric.org, Aug 2026: `Geist`, `Geist Mono`); the donors' Aptos/Arial are the office-safe stand-ins for the same neutral grotesque. Template v4 settles it: Slidev decks set Aptos with a Helvetica Neue fallback and load no web font; the Geist web family is superseded for decks (law §2, §0 above).

## 3. Canvas and master

- `p:sldSz`: TPL `cx=12191695 cy=6858000`, EXM `cx=12192000 cy=6858000` - both 16:9, treated as **1280x720 px** (9525 EMU/px).
- Master (TPL `slideMaster1.xml`): slide-number placeholder at x 91.7% y 92.3%, 10pt, run colour `A9BEDD` (the master styles the dark variant; light layouts override to `6E7B8C`).

## 4. Layout inventory (TPL, `ppt/slideLayouts/`)

23 layouts. Name -> the sizes (pt) its runs declare, largest first:

| # | Name | Sizes |
|---|---|---|
| 1 | DEFAULT | - |
| 2 | Cover | 64, 18, 13, 12, 10 |
| 3 | Section Divider | 42, 15, 13, 10 |
| 4 | Agenda | 32, 17, 10 |
| 5 | Image | 32, 14, 12, 10 |
| 6 | Image Full | 32, 14, 10 |
| 7 | Image Half | 32, 16, 13, 10 |
| 8 | List | 32, 16, 10 |
| 9 | One Column | 32, 16, 10 |
| 10 | Two Columns | 32, 15, 10 |
| 11 | Three Columns | 32, 14, 10 |
| 12 | Four Columns | 32, 13, 10 |
| 13 | Comparison | 32, 15, 10 |
| 14 | Big Stats | 40, 32, 10 |
| 15 | Image + Text | 32, 16, 13, 10 |
| 16 | Image Divider | 42, 13, 10 |
| 17 | Team | 32, 14, 10, 9 |
| 18 | Timeline | 32, 16, 14, 11, 10 |
| 19 | Title Only | 32, 10 |
| 20 | Logos | 32, 11, 10 |
| 21 | Quote | 32, 15, 10 |
| 22 | Table or Chart | 32, 14, 10 |
| 23 | Closing | 46, 15, 10 |

EXM adds the louder stat: 54pt number + 30pt sentence (slide 12), and 30pt content titles with a 16pt `2668C5` subtitle.

## 5. Key placeholder geometry (fractions of canvas)

**Cover (layout 2)** - background is a `blip` (jpeg `Cover-image-1.jpeg`, the navy gradient; v4 shows it is a plain vertical ramp, no glow):

| Element | x, y | w, h | Run |
|---|---|---|---|
| Eyebrow | 3.8%, 22.7% | 60%, 5.3% | 13pt bold `6BA5F0` spc 200 |
| Title | 3.8%, 28.0% | 84.8%, 28% | 64pt bold `FFFFFF` spc -100 |
| Subtitle | 3.8%, 60.7% | 66%, 9.3% | 18pt `E6EFFA` |
| Author | 3.8%, 81.3% | 60%, 5.3% | 12pt `A9BEDD` |
| Wordmark | 3.8%, 92.3% | 30%, 4% | 10pt bold `A9BEDD` |

**Section Divider (layout 3)** - blip ground; eyebrow y 32%, title 42pt y 38%, sub 15pt `E6EFFA` y 57.3%.

**Content (layouts 8-14, 19-22)** - flat `FFFFFF` bg:

| Element | x, y | w, h | Run |
|---|---|---|---|
| Title | 3.8%, 8.7% | 79.5%, 11.3% | 32pt bold `00204D` spc -50 |
| Content zone | 3.8%, 22.7% | 92.5%, ~66% | - |
| Wordmark | 3.8%, 92.3% | 30%, 4% | 10pt bold `6E7B8C` |
| Page number | 91.7%, 92.3% | 4.5%, 4% | 10pt `6E7B8C` |

**RoundCard** (the recurring container, layouts 9-14): `prstGeom prst="roundRect"` with `adj val 3000` (3% of the lesser side - ~10px on a half-height card at 720p); fill `F2F6FC`; line `DCE3EE` at `w=12700` (1pt); body 15-16pt `243143`; Big Stats variant: 40pt bold `00204D` number.

**Timeline (18)**: rail shape `DCE3EE`; `PillBadge` shapes fill `00204D` with 16pt bold `FFFFFF`; step titles 14pt bold `00204D`; descriptions 11pt `6E7B8C`.

**Table (22)**: header cells solid `00204D`, 14pt bold white; kicker above table 14pt bold `6E7B8C` spc 150; zebra `F2F6FC`.

**Closing (23)**: blip ground; 46pt title; 15pt contacts; EXM slide 15 adds a short `0065E3` rule shape above the contact line.

## 6. Media

TPL ships five jpeg grounds - `Cover/Section-Divider/Image-Divider/Quote/Closing-image-1.jpeg` - all the same file: the vertical navy ramp, no glow (§0). No logo file exists in either donor; the footer brand is a text run "Constructor Fabric". EXM ships the ribbon illustrations as png+svg pairs (`image-8/9/10/13/1002/1004`), drawn from `0065E3` / `6BA5F0` curves over tint circles.

## 7. EXM deviations worth knowing

1. Content titles 30pt on `001838` (vs TPL's 32pt `00204D`) - same voice, one step deeper and smaller. The law unifies on TPL's 32/`00204D`; either ink is legal.
2. A `2668C5` 16pt subtitle under nearly every content title, sometimes with a hairline rule - the law adopts it (§3.5) as the house pattern.
3. Footer wordmark run colour on light pages is `001838` in EXM vs `6E7B8C` in TPL; renderings read both as quiet. Tokens carry the TPL value; EXM's is legal.
4. The band-header pattern (tint band + navy bold text) exists only in EXM - the layouts' equivalent is the full card.
