# Slidev

A Slidev deck is markdown plus Vue components, rendered in a browser - so a slide can draw anything CSS can draw, and a slide's layout is only ever as good as the last render someone looked at.

When you need an idiom to copy, read a working deck in the repo rather than its starter template. Template slides are short by design, so they never reach the height at which real slides hit the frame trap below.

Contents: commands - the export browser - the single-file HTML export - what the PPTX export does to a slide - where things go - layout traps - out-specified properties - drawing on a grid - fitting a slide to its frame.

## Commands

Run these from the deck directory, through its package runner - `npx slidev …`, or whichever script its `package.json` wraps them in.

| Command | What it does |
|---|---|
| `slidev` | Dev server on `localhost:3030`; slide *n* is at `/n` |
| `slidev build` | Static site into `dist/` |
| `slidev export --format pptx --output <path>` | The whole deck as PowerPoint |
| `slidev export --format png --range <n> --output <dir>` | One PNG per slide in the range, named `<n>.png` |

A green `build` proves the components compile. It says nothing about whether the content fits.

One more command is this skill's own rather than Slidev's: `node scripts/export-single-html.mjs <deck-dir>` writes the whole deck as one self-contained `.html`. See [the deck as one self-contained HTML file](#the-deck-as-one-self-contained-html-file) below.

Every `node scripts/...` line in this skill runs from the skill directory; from a deck of your own, give the path to your installed copy of the skill instead.

`--format` takes `pdf` (the default), `pptx`, `png`, and `md`. `--range` accepts `3` or `1,4-5,7`, numbering from 1 over every slide including the cover - so a range is not the same as counting content slides. `--scale` raises image resolution.

`--with-clicks` exports one page per click step, turning a single slide with a reveal into several pages. Leave it off unless those extra pages are what you want.

## The export needs a browser

`slidev export` drives Playwright, which is not installed with Slidev. The first run fails with a message naming it. Install it into the deck:

```
npm i -D playwright-chromium     # or the repo's package manager
npx playwright install chromium
```

Do this before the deck has content: it is the one dependency the whole delivery rests on, and it costs nothing to exercise early.

## The deck as one self-contained HTML file

Slidev has no such export. `slidev build` emits an SPA - an `index.html` plus hashed chunks plus `public/` - which is a blank page over `file://`, and `slidev export` flattens the deck to PDF, PNG or PPTX, which is pictures of slides. Where the audience needs a file to double-click and mail on, this skill builds the third thing:

```
node scripts/export-single-html.mjs <deck-dir> --output <file>.html
```

It is a BUILD, not a rendering: the live Vue app, with real navigation, selectable text and working links, welded into one file with its styles, its webfont and its `public/` assets base64'd inside. `examples/fabric-deck` came to **1.45 MB** for twenty slides. The script re-reads its own output and refuses to write a file that would still reach a network on open, so a false pass is not one of the outcomes.

`--subsets` decides how much of the webfont travels. The default is `all`; `--subsets latin,latin-ext` keeps only the Latin blocks, which is roughly a fifth of the font payload and enough for a deck written in a Latin script.

Five things have to be defeated, and four of them fail silently:

- **Code splitting.** Rollup's sibling chunks can never be fetched from a welded HTML. `vite-plugin-singlefile` welds; `inlineDynamicImports` stops the split; and Slidev's own `manualChunks` must then be *deleted*, because Rollup refuses the two together. All three live in the deck's `vite.config.ts`, behind `FABRIC_SINGLE_FILE`, so a normal build is untouched.
- **The router.** Slidev routes in history mode, so slide 3 is the path `/3`. Over `file://` the path is the file's place on disk, nothing matches, and the deck renders Slidev's own 404 page with the fonts loaded and the styles applied - it looks exactly like a broken build and is not one. The single file routes on the hash instead (`deck.html#/3`). `routerMode` is headmatter and not a CLI flag, so the export builds from a throwaway entry beside `slides.md` rather than editing it.
- **`public/` assets.** A `public/x.svg` is referenced as `/x.svg`, which over `file://` is the root of the disk. Vite does not rewrite those, because in an SPA they are right.
- **The webfont.** `fonts.provider: google` puts a `fonts.googleapis.com` stylesheet in the head. Left there, the deck silently falls back to a system grotesque and every line length shifts. The stylesheet and its woff2 files are fetched at BUILD time and inlined - so the export needs the network even though the file it produces does not.
- **The favicon.** Slidev's default is a jsdelivr URL, and it sits in two places: the `<link rel=icon>` and a string in the bundled config.

What the file cannot carry: anything fetched at runtime - Monaco (`{monaco}` code blocks), a PlantUML diagram, an `<iframe src>` to a live page; the presenter view and the speaker-notes UI, which are dev-server routes; and any persistence - drawings and click state live in memory. Speaker notes travel in the bundle as slide data but there is no UI in a built deck that shows them.

## What the PPTX export does to a slide

Each slide becomes one flat image, so nothing on it animates, builds, or reveals.

A slide's speaker notes land in PowerPoint's own notes field, and travel with the file to everyone who opens it.

## Where things go

- **`slides.md`** - headmatter, then slides separated by `---`. Per-slide options go in frontmatter directly after that slide's `---`.
- **A slide's notes** are an HTML comment placed after the slide's content.
- **`components/*.vue`** are auto-imported. Use `<MyComponent />` in the markdown with no import line.
- **`style.css`** at the deck root is loaded globally - the place for deck-wide sizing.
- **`layouts/*.vue`** are the deck's own layouts, named by file: `layouts/fabric.vue` is `layout: fabric` in a slide's frontmatter, and a deck-level layout shadows a theme layout of the same name. A layout renders the slide body through `<slot />` and a named block through `<slot name="header" />`, which is what a `::header::` section in the markdown fills.
- **The canvas** is 980×552 logical pixels at 16:9, so pixel sizes in a component are pixels against that.

## Two traps in a hand-written layout

- **The page number is `$page`, not the navigation's.** `const { $page } = useSlideContext()` gives the number of the slide being rendered. `nav.currentPage` is where the *viewer* is, so an export prints the same number on every page, and `$slidev` is a template global that does not exist on `globalThis`, so reading it in a `<script>` block yields nothing and the footer silently prints a placeholder. All three compile, and only the first is right.
- **`.slidev-layout` is the theme's class, and it carries padding.** Putting it on a hand-written layout's root insets the whole slide box, which pulls a full-bleed band off the left and right edges. A layout that draws its own furniture leaves the class off and sets its own geometry.

## A property nothing may out-specify

Where a slide's honesty rests on one visual property - the tone that separates two categories, the mark that says "not done" - set it where nothing downstream can quietly win: a value the parent supplies, not a rule a descendant can override. A two-class selector added for something unrelated silently deletes a one-class guard, and lint and build both pass while the slide now says the opposite.

The same mechanism handles a deck-wide value overriding something the theme sets: have the theme read a CSS variable and set that variable in `style.css`. Overriding the theme's own selectors from outside usually loses - scoped styles out-specify a plain selector, and the result depends on load order.

## Drawing on a grid

A slide whose parts must line up is one CSS grid. These placements are what make the alignment structural rather than lucky.

- **Name every child's row and column.** An unplaced child is auto-placed, which shifts everything after it - connectors land on the wrong rows and a slide can end up asserting the opposite of what it means, while dev server, lint and build all stay green and the exported slide still looks deliberate. Auto-placement here is a correctness hazard, not a cosmetic one.
- **One grid, not two that agree.** Two sibling grids each sizing its own rows pair up only for as long as their content keeps them the same height. Put both halves in one grid so that a row is one row.
- **Gutters are rows, not `row-gap`.** With a row gap, the line between two boxes sits half a gap off every box's true centre, and every connector aimed at it misses by exactly that. An explicit gutter row makes the space addressable.
- **Let a box span a pair of rows** when something has to meet its centre: the line between those two rows *is* the box's centre, so a connector placed on that line lands with no magic numbers.

## Fitting a slide to its frame

The layout hands the slide body a bounded box, and a body given `block-size: 100%` still grows past that box when its content is taller - it overflows, and the export silently clips whatever crosses the footer. Where the layout is a flex column, `flex: 1` with `min-block-size: 0` binds the growing box to the frame instead.

After any sizing change, export the slide and look at the image. Neither the dev server nor the build warns about a slide that no longer fits.

The image tells you *what* overflows; measuring the boxes tells you *why*. Read the layout's own box height against the canvas before shrinking anything - otherwise you cut content to fit a frame that was itself the wrong size.
