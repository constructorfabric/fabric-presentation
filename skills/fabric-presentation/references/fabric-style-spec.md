# Constructor Fabric style - the OOXML derivation

> **Provenance and precedence.** This file is what is IN the two donor files, path by path: theme values, placeholder geometry, explicit run properties. It is authority for geometry, the type ladder, and which XML element carries what. It is NOT authority for how a colour is used on a slide - XML can say a fill exists, not what it means or how much of a page it covers. Where this file's interpretation and [fabric-style.md](./fabric-style.md) disagree, the law wins, because the law was read off 110-dpi renderings of the same two files (its §0 carries the recipe).

Donors:

- **TPL** - `1 - Constructor Fabric Template.potx` (22 layouts, 1 master, 5 media jpegs)
- **EXM** - `2 - Constructor-Fabric-Template-Examples.pptx` (15 slides; its own theme)

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
- Neither donor embeds a font. Neither carries Geist - the web family (constructorfabric.org, Aug 2026: `Geist`, `Geist Mono`); the donors' Aptos/Arial are the office-safe stand-ins for the same neutral grotesque. Slidev decks load Geist (law §2).

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

**Cover (layout 2)** - background is a `blip` (jpeg `Cover-image-1.jpeg`, the navy gradient with glow):

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

TPL ships five jpeg grounds - `Cover/Section-Divider/Image-Divider/Quote/Closing-image-1.jpeg` - all the same navy-gradient-with-glow family. No logo file exists in either donor; the footer brand is a text run "Constructor Fabric". EXM ships the ribbon illustrations as png+svg pairs (`image-8/9/10/13/1002/1004`), drawn from `0065E3` / `6BA5F0` curves over tint circles.

## 7. EXM deviations worth knowing

1. Content titles 30pt on `001838` (vs TPL's 32pt `00204D`) - same voice, one step deeper and smaller. The law unifies on TPL's 32/`00204D`; either ink is legal.
2. A `2668C5` 16pt subtitle under nearly every content title, sometimes with a hairline rule - the law adopts it (§3.5) as the house pattern.
3. Footer wordmark run colour on light pages is `001838` in EXM vs `6E7B8C` in TPL; renderings read both as quiet. Tokens carry the TPL value; EXM's is legal.
4. The band-header pattern (tint band + navy bold text) exists only in EXM - the layouts' equivalent is the full card.
