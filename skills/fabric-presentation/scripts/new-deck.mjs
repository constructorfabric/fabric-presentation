#!/usr/bin/env node
/*
 * new-deck.mjs - scaffold a Constructor Fabric Slidev deck out of this skill's
 * material.
 *
 * Usage:
 *   node scripts/new-deck.mjs <target-dir> [--name "Deck title"]
 *                             [--cases a,b,c] [--date "Month Year"] [--force]
 *   node scripts/new-deck.mjs --list
 *
 * What it writes into <target-dir>:
 *
 *   slides.md                 headmatter, a cover, one content slide, one slide
 *                             per requested case
 *   style.css                 templates/deck-style.css plus the rules the
 *                             scaffolded layouts need
 *   fabric-tokens.css         assets/fabric-tokens.css, beside style.css
 *                             because that is where style.css imports it from
 *   layouts/fabric.vue        the donors' three zones: 32pt navy title, content
 *                             box ending at 89%, the hairline footer with the
 *                             wordmark "Constructor Fabric" and a page number
 *   layouts/fabric-cover.vue  the cover: the navy gradient ground with its
 *                             corner glow, a sky-blue eyebrow and a 64pt white
 *                             title
 *   layouts/fabric-dark.vue   the other dark pages the law requires - quote and
 *                             closing: the same ground, a 46pt title, an
 *                             eyebrow from the slide's own frontmatter, and the
 *                             full footer with its page number. Copied from
 *                             examples/fabric-deck so the two cannot drift
 *   sections.ts               the deck's sections, empty by default; declare
 *                             some and the light pages' footers grow a nav
 *   components/SectionNav.vue that nav, mounted by the light layout only
 *   components/*.vue          the requested template cases, unchanged
 *   vite.config.ts            the single-file HTML export's build settings plus
 *                             the dev-server endpoint its nav button calls,
 *                             copied verbatim from examples/fabric-deck so the
 *                             two can never drift; the build half is inert
 *                             unless the export script sets FABRIC_SINGLE_FILE
 *   custom-nav-controls.vue   that button, in Slidev's own nav bar, likewise
 *                             copied. Dev only, so no build carries it
 *   package.json .npmrc .gitignore README.md
 *
 * The deck is standalone: it carries its own layouts, stylesheet and tokens,
 * and depends on no shared theme package.
 *
 * Two things it does deliberately:
 *
 *  - It copies fabric-tokens.css and style.css TOGETHER. Take one and not the
 *    other and every var() resolves to nothing, which invalidates the whole
 *    declaration it sits in: no error anywhere, and a deck of empty boxes.
 *  - The default content slide carries the Fabric anatomy before a word is
 *    typed into it: a navy title, the blue takeaway line under it, a row of
 *    rounded tint cards with accent-blue kickers, and the footer wordmark. The
 *    system is monochrome blue, so what a scaffold has to land is the SHAPE -
 *    there is no saturated fill to reach for and none is wanted.
 *
 * It refuses to write into a non-empty directory without --force.
 */

import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const skill = resolve(here, '..');
const templates = join(skill, 'templates');
const assets = join(skill, 'assets');

/* Versions this skill pins, read once from this file so a bump is one edit.
 * Keep them in step with what examples/fabric-deck installs - its package.json
 * and the versions its pnpm-lock.yaml resolves. */
const VERSIONS = {
  slidev: '52.11.3',
  vue: '3.5.26',
  playwright: '1.62.1',
  /* The theme Slidev falls back to for anything the deck's own layouts do not
     draw. Pinned to the version examples/fabric-deck resolves. */
  theme: '0.25.0',
  /* The one dependency the single-file HTML export needs, and the deck's own
     vite.config.ts is the only thing that loads it. */
  singlefile: '2.3.3',
};

/* ---- the cases this skill ships -----------------------------------------
 * Discovered rather than listed: a case is a .md slide block in templates/ that
 * mounts a component, and the component is the .vue file it names. Adding a case
 * to templates/ makes it available here with no edit.
 */

const discoverCases = () => {
  const found = new Map();
  for (const entry of readdirSync(templates)) {
    if (!entry.endsWith('.md') || entry === 'README.md') continue;
    const block = readFileSync(join(templates, entry), 'utf8');
    /* The component the block mounts: the first self-closing tag with a
       capitalised name, attributes or not, on one line or spread over several
       - a case that passes props writes the tag the second way. */
    const tag = /<([A-Z][A-Za-z0-9]*)(?:\s[^>]*?)?\/>/s.exec(block);
    if (!tag) continue;
    const component = `${tag[1]}.vue`;
    if (!existsSync(join(templates, component))) continue;
    found.set(entry.replace(/\.md$/, ''), { block: entry, component });
  }
  return found;
};

const CASES = discoverCases();

/* ---- invocation ---------------------------------------------------------- */

const argv = process.argv.slice(2);
const value = (name, fallback = null) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1] ?? fallback;
};

if (argv.includes('--list') || argv.length === 0) {
  process.stdout.write('\nTemplate cases available to --cases:\n\n');
  for (const [name, entry] of [...CASES].sort()) {
    process.stdout.write(`  ${name.padEnd(18)}  ${entry.component}\n`);
  }
  process.stdout.write(
    '\nusage: node scripts/new-deck.mjs <target-dir> [--name "Deck title"]' +
      ' [--cases a,b] [--date "Month Year"] [--force]\n\n',
  );
  process.exit(argv.includes('--list') ? 0 : 2);
}

const force = argv.includes('--force');
const targetArg = argv.find(
  (a, i) => !a.startsWith('--') && !['--name', '--cases', '--date'].includes(argv[i - 1]),
);
if (!targetArg) {
  process.stderr.write(
    'new-deck: no target directory given\n' +
      'usage: node scripts/new-deck.mjs <target-dir> [--name "Deck title"] [--cases a,b] [--date "Month Year"] [--force]\n',
  );
  process.exit(2);
}
const target = resolve(targetArg);
const deckTitle = value('--name', basename(target).replace(/[-_]+/g, ' '));
const slug = basename(target)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const deckDate =
  value('--date') ??
  new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });

const requested = (value('--cases') ?? '')
  .split(',')
  .map((c) => c.trim())
  .filter(Boolean);

const unknown = requested.filter((c) => !CASES.has(c));
if (unknown.length > 0) {
  process.stderr.write(`new-deck: unknown case(s): ${unknown.join(', ')}\n`);
  process.stderr.write(`available: ${[...CASES.keys()].sort().join(', ')}\n`);
  process.exit(2);
}

if (existsSync(target) && readdirSync(target).length > 0 && !force) {
  process.stderr.write(`new-deck: ${target} is not empty - pass --force to write into it\n`);
  process.exit(2);
}

/* ---- helpers ------------------------------------------------------------- */

const write = (relative, contents) => {
  const full = join(target, relative);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, contents, 'utf8');
  written.push(relative);
};
const copy = (from, relative) => {
  const full = join(target, relative);
  mkdirSync(dirname(full), { recursive: true });
  copyFileSync(from, full);
  written.push(relative);
};
const written = [];

/* A case's slide block, adapted to a standalone deck. The cases already carry
 * the fabric layout names, so the layout/theme rewrites are a safety net for a
 * block pasted in from a deck that names its layouts differently. The eyebrow
 * above a content title goes for a different reason: it is not legal over a
 * content title, so a block that still carries one arrives without it. */
const adaptBlock = (source) =>
  source
    .replace(/^theme:.*\n/m, '')
    .replace(/^layout: Constructor$/m, 'layout: fabric')
    .replace(/^layout: ConstructorCover$/m, 'layout: fabric-cover')
    .replace(/^\s*<div class="(?:deck-eyebrow|fx-kicker)">[^<]*<\/div>\s*\n\n?(?=#)/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/* ---- slides.md ----------------------------------------------------------- */

const coverExtra = requested.includes('cover') ? '\n\n<CoverMeta />' : '';

/* The headmatter block IS the first slide's frontmatter, which is why the cover
 * layout is named there and every later slide falls through to `defaults`.
 *
 * The `fonts:` block is load-bearing. `--fx-font`
 * names "Geist" first and then falls back, so a deck without this block renders
 * in Aptos or the system grotesque and looks almost right - while Slidev, given
 * no font declaration, pulls its own theme default family that nothing in the
 * deck ever uses. Declaring it here is what makes Geist arrive, and it is also
 * what the single-file export inlines. */
const head = `---
title: ${deckTitle}
date: '${deckDate}'
layout: fabric-cover
transition: none
mdc: true
fonts:
  sans: Geist
  mono: Geist Mono
  weights: '400,700'
  provider: google
defaults:
  layout: fabric
---

# ${deckTitle}

<p class="deck-cover-sub">One line saying what this deck is for.</p>

<p class="deck-cover-author">Author Name &middot; ${deckDate}</p>${coverExtra}

---

::header::

# The claim of this slide, as a sentence

<p class="deck-takeaway">The conclusion the slide supports, stated first.</p>

::default::

<div class="fx-cols-3">
  <article class="fx-card">
    <div class="fx-kicker">First kind</div>
    <div>What this one is, in one line.</div>
  </article>
  <article class="fx-card">
    <div class="fx-kicker">Second kind</div>
    <div>A different KIND of thing, which the kicker says and no fill has to.</div>
  </article>
  <article class="fx-card">
    <div class="fx-kicker">Third kind</div>
    <div>Replace all three, or take a case from the skill instead.</div>
  </article>
</div>

<!--
Claim: the one sentence this slide asserts. Two sentences means two slides.

What to say: what the presenter adds out loud and the slide does not show.

Not on the slide (answer if asked): what was deliberately left off, and why.
-->
`;

const slides = [head];

for (const name of requested) {
  if (name === 'cover') continue; // its component rides on the cover slide above
  const block = adaptBlock(readFileSync(join(templates, CASES.get(name).block), 'utf8'));
  /* A case block opens with its own frontmatter, and in Slidev the slide
     separator and the opening line of that frontmatter are the SAME `---`.
     Adding a separator in front of one would start an empty slide. */
  slides.push(block.startsWith('---') ? `\n${block}\n` : `\n---\n\n${block}\n`);
}

write('slides.md', slides.join(''));

/* ---- styles -------------------------------------------------------------- */

const layoutRules = `
/* ---- 5. What the scaffolded layouts add ------------------------------------
 * layouts/fabric.vue, layouts/fabric-cover.vue and layouts/fabric-dark.vue are
 * this deck's own, so their rules live here rather than in a theme. Section 2
 * above already draws the three zones they share - title top 8.7%, content from
 * 22.7% down to 89%, the footer band under the 92.3% line, all of it read from
 * the zone tokens. What follows is what those layouts add on top: the page
 * number and the section nav in the footer, and the dark pages.
 */

.deck-slide-footer {
  gap: calc(20 * var(--fx-pt));
}

.deck-slide-footer .deck-footer-brand {
  flex: none;
}

.deck-slide-footer .deck-page-number {
  flex: none;
  font-variant-numeric: tabular-nums;
  min-inline-size: 20px;
  text-align: end;
}

/* The section names, between the wordmark and the number, on LIGHT pages only:
   a filled or dark page keeps a wordmark-only footer. This is our own
   convention, not a donor shape - no tpl or exm page carries one. It renders
   nothing until sections.ts declares some. */

.deck-footer-nav {
  display: flex;
  flex: 1;
  justify-content: center;
  gap: calc(18 * var(--fx-pt));
  min-inline-size: 0;
}

.deck-footer-nav-item {
  overflow: hidden;
  color: var(--fx-text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* The section the deck is in: the accent blue, bold. One marked item, and the
   rest stay the footer grey - two marks send the eye hunting. */

.deck-footer-nav-item_current {
  color: var(--fx-text-accent);
  font-weight: var(--fx-weight-bold);
}

/* The cover is a DARK slide: the navy gradient with the corner glow the donors
   ship as a jpeg, a sky-blue eyebrow, a 64pt white title, the subtitle in the
   pale tint and the author line in the muted blue.

   The ROOT carries no inline padding. The 3.8% margin belongs to the content
   wrapper below it, because a padded root insets everything the slide contains
   - including a footer - and the footer's hairline then stops short of both
   slide edges. The rule spans the full slide width on every page. */

.deck-cover {
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background: var(--fx-grad-glow), var(--fx-grad-ground);
  block-size: 100%;
  color: var(--fx-text-inverted);
  font-family: var(--fx-font);
}

/* Everything the cover says sits in this wrapper, and the wrapper is what
   carries the margin. Add a footer to a dark layout as a SIBLING of it and the
   footer's rule runs edge to edge while its own text keeps the same margin. */

.deck-cover-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-block-size: 0;
  padding-inline: var(--fx-margin-inline);
}

.deck-cover-eyebrow {
  margin: 0 0 calc(10 * var(--fx-pt));
  color: var(--fx-text-accent-dark);
  font-size: var(--fx-size-eyebrow);
  font-weight: var(--fx-weight-bold);
  letter-spacing: var(--fx-track-caps);
  line-height: 1.2;
  text-transform: uppercase;
}

/* The title sits tight, so the space under it is padding rather than the
   line's own leading - without it the subtitle sits on the descenders. */

.deck-cover h1 {
  margin: 0;
  font-size: var(--fx-size-cover);
  font-weight: var(--fx-weight-bold);
  letter-spacing: var(--fx-track-title);
  line-height: var(--fx-leading-title);
  max-inline-size: 84.8%;
  padding-block-end: calc(14 * var(--fx-pt));
}

.deck-cover-sub {
  margin: 0;
  color: var(--fx-tint-band);
  font-size: var(--fx-size-body-lg);
  line-height: var(--fx-leading-body);
  max-inline-size: 66%;
}

.deck-cover-author {
  margin-block: calc(24 * var(--fx-pt)) 0;
  color: var(--fx-text-muted-dark);
  font-size: var(--fx-size-caption);
  line-height: 1.2;
}

/* A dark page carries the SAME footer box as a light one and differs in two
   legal ways only: the hairline goes transparent (the box stays, so the
   wordmark does not move) and the ink follows the dark ground. The cover adds
   the third: no page number - the one page in the donors that carries the
   wordmark alone. */

.deck-cover .deck-slide-footer {
  border-block-start-color: transparent;
  color: var(--fx-text-muted-dark);
}

/* The other dark pages - quote and closing - sit on the same ground and share
   the cover's structure: an unpadded root, a padded body wrapper, and a footer
   beside that wrapper rather than inside it. They differ from the cover in one
   thing: they carry the page number. */

.deck-dark-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-block-size: 0;
  padding-inline: var(--fx-margin-inline);
}

/* The closing title is the donors' 46pt, one step under the cover's 64pt: the
   two dark pages are a pair, not a repeat. */

.deck-dark h1 {
  font-size: var(--fx-size-closing);
}
`;

write(
  'style.css',
  readFileSync(join(templates, 'deck-style.css'), 'utf8').trimEnd() + '\n' + layoutRules,
);
copy(join(assets, 'fabric-tokens.css'), 'fabric-tokens.css');

/* ---- layouts ------------------------------------------------------------- */

write(
  'layouts/fabric.vue',
  `<!-- The root carries NO .slidev-layout class: that class is the theme's own,
     and its padding insets the slide box, which pulls the navy footer band off
     the left and right edges. The band is full bleed. -->
<template>
  <div class="deck-slide">
    <header class="deck-slide-header">
      <slot name="header" />
    </header>

    <main class="deck-slide-content">
      <slot />
    </main>

    <!-- The footer is mandatory on every content slide: a hairline rule, the
         10pt bold wordmark at the left margin and a two-digit page number at
         the right. There is no logo image anywhere in the system. Between them
         sits the section nav, which renders nothing until sections.ts declares
         sections - and which never appears on a dark page. -->
    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
      <SectionNav />
      <span class="deck-page-number">{{ pageNumber }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useSlideContext } from '@slidev/client';
  import SectionNav from '../components/SectionNav.vue';

  /* \`$page\` is THIS slide's number. The deck's navigation state is a different
     thing: \`nav.currentPage\` is where the viewer is, which in an export renders
     the same number on every page, and \`$slidev\` is a template global that is
     not on globalThis in a script block, so reading it here yields nothing at
     all. Two digits, so the number's width does not jitter between 9 and 10 -
     the donor decks pad theirs the same way. */
  const { $page } = useSlideContext();

  const pageNumber = computed(() => String($page.value).padStart(2, '0'));
</script>
`,
);

write(
  'layouts/fabric-cover.vue',
  `<!-- The root draws the dark ground and nothing else: the 3.8% margin lives on
     .deck-cover-body, so the footer beside that wrapper spans the slide edge to
     edge. -->
<template>
  <div class="deck-cover">
    <div class="deck-cover-body">
      <!-- The eyebrow the donors' own Cover layout carries, in caps above the
           title. It belongs to the DARK pages - a content slide's title stands
           alone. Replace the word if the deck is not a presentation. -->
      <p class="deck-cover-eyebrow">Presentation</p>

      <slot />
    </div>

    <!-- The same footer box every page carries, so the wordmark does not move
         when the deck leaves the cover. Two differences and no others: the
         hairline is transparent on the dark ground, and the cover is the one
         page in the donors that carries no number. -->
    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
    </footer>
  </div>
</template>
`,
);

/* The dark page that is NOT the cover - the quote and the closing the law's
 * §3.5 requires, and a section divider where the deck wants a layout rather
 * than the template case. Copied rather than written out here, the same way
 * vite.config.ts is: the canonical copy is the one the example deck renders,
 * so a fix proved there reaches every scaffolded deck with no second edit. */

const darkLayout = join(skill, 'examples', 'fabric-deck', 'layouts', 'fabric-dark.vue');
if (existsSync(darkLayout)) {
  copy(darkLayout, join('layouts', 'fabric-dark.vue'));
} else {
  process.stderr.write(
    'new-deck: examples/fabric-deck/layouts/fabric-dark.vue is missing - the deck is\n' +
      '          scaffolded without its dark closing layout. That is a bug in the skill.\n',
  );
}

/* ---- sections ------------------------------------------------------------
 * A deck built of several parts opens each part with a dark section divider,
 * and its LIGHT pages carry the part names in the footer. Both readings come
 * from one declaration, because two lists of section names drift.
 */

write(
  'sections.ts',
  `/*
 * The deck's sections, in order, and the page each one starts on.
 *
 * Leave the array empty and the footer nav renders nothing - a single-section
 * deck carries a wordmark-and-number footer and no nav at all.
 *
 * \`from\` is the page number of the section's dark divider slide, which is
 * also the first page the name is shown as current on. The page number is what
 * the layout has to work with: it is the one fact about position that is the
 * same in the dev server and in an export.
 *
 * Adding a divider slide means adding its line here. Nothing checks the two
 * against each other, so the check is the render pass: advance through the deck
 * and watch the marked name change on the page the divider sits on.
 */

export type DeckSection = {
  /* Shown in the footer. Two or three words - the footer band is 10pt. */
  name: string;
  /* The page its divider slide is on. */
  from: number;
};

export const sections: DeckSection[] = [];

/* The section a page belongs to: the last one that has started. A page before
 * the first divider - the cover, an agenda - belongs to no section, and the
 * nav then marks nothing rather than guessing. */
export const sectionAt = (page: number): DeckSection | undefined =>
  sections.filter((section) => section.from <= page).at(-1);
`,
);

write(
  'components/SectionNav.vue',
  `<!-- The section names in the footer of a LIGHT content page, current one in the
     accent blue. Our own convention - the donors carry no such nav -
     and it never goes on a filled or dark page: cover, section divider, quote
     and closing keep a wordmark-only footer, which is why the dark layouts do
     not mount this component at all. -->
<template>
  <nav v-if="sections.length > 0" class="deck-footer-nav">
    <span
      v-for="section of sections"
      :key="section.name"
      class="deck-footer-nav-item"
      :class="{ 'deck-footer-nav-item_current': section.name === current?.name }"
    >
      {{ section.name }}
    </span>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useSlideContext } from '@slidev/client';
  import { sectionAt, sections } from '../sections';

  /* \`$page\` is THIS slide's number, which is what an export needs: the deck's
     navigation state prints the same number on every exported page. */
  const { $page } = useSlideContext();

  const current = computed(() => sectionAt($page.value));
</script>
`,
);

/* ---- components and assets ---------------------------------------------- */

for (const name of requested) {
  const { component } = CASES.get(name);
  copy(join(templates, component), join('components', component));
}

/* The donors ship no logo file, and the deck gets none: the footer wordmark is
   the brand mark. The web's four-square BrandMark is not part of the deck
   system and goes on no slide, so nothing of it travels here. */

/* ---- the single-file export: build settings, and its button ---------------
 * Both copied rather than written out here: the canonical copies are the ones
 * the example deck is actually exported from, so a fix proved there reaches
 * every scaffolded deck with no second edit.
 *
 * vite.config.ts does two jobs, and the deck is missing half the export
 * without it: the weld at build time (Rollup would otherwise split the bundle
 * into sibling chunks and the "one file" would open as a blank page) and the
 * dev-server endpoint the nav button calls.
 *
 * custom-nav-controls.vue is that button. Slidev mounts a file of this name
 * from the deck root into its nav bar. It renders in dev only, so no build -
 * the single-file export included - carries an export control.
 */

for (const name of ['vite.config.ts', 'custom-nav-controls.vue']) {
  const canonical = join(skill, 'examples', 'fabric-deck', name);
  if (existsSync(canonical)) {
    copy(canonical, name);
  } else {
    process.stderr.write(
      `new-deck: examples/fabric-deck/${name} is missing - the deck is scaffolded\n` +
        '          without the single-file HTML export. That is a bug in the skill.\n',
    );
  }
}

/* ---- project files ------------------------------------------------------- */

/* Where the nav button's endpoint looks for the export script. A deck inside
 * the skill needs no declaration - vite.config.ts walks up to it - and writing
 * one there would only be a machine-local absolute path in a committed file. A
 * deck scaffolded ANYWHERE ELSE has no way up, so it gets told, once, here.
 * `FABRIC_SKILL_DIR` in the environment overrides this if the skill moves. */
const insideSkill = `${target}${sep}`.startsWith(`${skill}${sep}`);

write(
  'package.json',
  `${JSON.stringify(
    {
      name: `@constructor/${slug}`,
      type: 'module',
      private: true,
      ...(insideSkill ? {} : { fabricSkill: skill }),
      scripts: {
        dev: 'slidev --open',
        build: 'slidev build',
        export: 'slidev export',
      },
      dependencies: {
        '@slidev/cli': VERSIONS.slidev,
        '@slidev/theme-default': VERSIONS.theme,
        vue: VERSIONS.vue,
      },
      devDependencies: {
        'playwright-chromium': VERSIONS.playwright,
        'vite-plugin-singlefile': VERSIONS.singlefile,
      },
    },
    null,
    2,
  )}\n`,
);

write('.npmrc', '# for pnpm\nshamefully-hoist=true\nauto-install-peers=true\n');
/* `.slidev-single-file.md` is the throwaway hash-router entry the single-file
   export writes beside slides.md and removes again. It is listed here so that
   an export killed mid-build cannot leave a file staged into a commit. */
write(
  '.gitignore',
  'node_modules\n.DS_Store\ndist\n*.local\n.vite-inspect\n.remote-assets\ncomponents.d.ts\n.slidev-single-file.md\n',
);

write(
  'README.md',
  `# ${deckTitle}

A Constructor Fabric Slidev deck, scaffolded from the \`fabric-presentation\` skill
(\`${skill}\`). The style law it must obey is that skill's
\`references/fabric-style.md\`: a monochrome blue system, rounded
containers, no shadows, and status carried by words rather than by hue.

## Run it

\`\`\`sh
pnpm install
pnpm exec slidev --port 3030      # slide n is at /n
\`\`\`

If \`pnpm\` is not on the PATH, \`npx -y pnpm@10.12.1 ...\` works without an install.

Slidev treats stdin EOF as quit, so a backgrounded server dies right after its
banner. Hold stdin open: \`tail -f /dev/null | pnpm exec slidev --port 3030\`.

pnpm 10 ends the install with "Ignored build scripts: esbuild,
playwright-chromium". That is expected and nothing in a deck needs those build
scripts to have run.

Export needs a browser, and it is worth exercising before the deck has content:

\`\`\`sh
pnpm exec playwright install chromium
pnpm exec slidev export --format pdf
\`\`\`

## One file to mail

For an audience that needs a file they can double-click, with no server and no
folder of assets beside it. Two routes to the same file:

- **The nav button.** With the dev server up, the HTML icon in the control bar
  at the bottom right. It spins for the length of the build and then the file
  downloads. This is the route to reach for while presenting the deck at
  someone.
- **The command**, for a script or a release step:

\`\`\`sh
node ${join(skill, 'scripts', 'export-single-html.mjs')} . --output ${slug}.html
\`\`\`

Either writes ONE \`.html\` - the live deck, not pictures of it - with the script,
the styles, the webfont and every \`public/\` asset base64'd inside. It opens over
\`file://\` with the network off; the script refuses to write a file that would
still reach for a network on open. Reckon on 1.5 MB for a twenty-slide deck.

The exported file carries NO export controls, its own button included: that
button renders in dev only, and Slidev's two (the browser exporter and
download-as-PDF) are dev-only by default.

Three things it needs, all already here: \`vite.config.ts\` (inert during a
normal \`slidev build\`, and the host of the button's endpoint during \`slidev\`),
\`custom-nav-controls.vue\` (the button), and the \`vite-plugin-singlefile\`
devDependency.${insideSkill ? '' : ` \`package.json\` also names where the skill is,
in \`"fabricSkill"\` - update it if the skill moves, or start the dev server with
\`FABRIC_SKILL_DIR\` set to override it.`} What the file cannot carry is in the
skill's \`references/slidev.md\`.

## Before finishing a round

\`\`\`sh
node ${join(skill, 'scripts', 'check-style.mjs')} .
\`\`\`

Exit 0, or fix what it names. Then look at every touched slide rendered, zoomed
in, beside the example page its shape came from.

## What is here

- \`slides.md\` - the deck. \`layout: fabric\` for a content slide,
  \`layout: fabric-cover\` for the cover, \`layout: fabric-dark\` for a quote or the
  closing. Its one content slide is deliberately sparse - grow the content into
  the zone before presenting it.
- \`style.css\` + \`fabric-tokens.css\` - the palette, the type ladder and the
  donors' zones. They are a pair: drop either and every \`var()\` in the deck
  resolves to nothing, which silently empties the slides of colour.
- \`layouts/\` - this deck's own three layouts: \`fabric\` for a content slide,
  \`fabric-cover\` for the cover, and \`fabric-dark\` for the other dark pages the
  style law asks for - the quote and the closing. Their footers share one
  geometry with every other page: a dark page turns the hairline transparent and
  the cover drops its number, and neither drops the box, so the wordmark does
  not move as the deck advances.
- \`sections.ts\` - the deck's sections, empty until the deck has some. Declare
  them and each light page's footer carries the names with the current one in
  the accent blue; a dark page never carries the nav.
- \`vite.config.ts\` - the single-file HTML export, and nothing else: the build
  settings for the weld (inert unless the export script asks for it) and, in
  dev, the endpoint the nav button calls.
- \`custom-nav-controls.vue\` - that button, in Slidev's own nav bar. Dev only,
  so no build carries it.
- \`components/\` - \`SectionNav.vue\` plus the template cases copied in${requested.length > 0 ? `: ${requested.join(', ')}` : ' (none yet)'}.
  Take more with \`node ${join(skill, 'scripts', 'new-deck.mjs')} --list\`.
- A content slide's header holds the title alone, with the optional blue
  takeaway line under it. The caps eyebrow belongs to the dark pages.
- The deck's brand mark is the footer wordmark "Constructor Fabric": there is
  no logo image in the system, and the four-square BrandMark goes on no slide.
`,
);

/* ---- report -------------------------------------------------------------- */

process.stdout.write(`\nScaffolded ${deckTitle} into ${target}\n\n`);
for (const file of written) process.stdout.write(`  ${file}\n`);
process.stdout.write(
  `\n  ${written.length} file(s), ${requested.length} case(s): ${requested.join(', ') || 'none'}\n`,
);

const checker = join(skill, 'scripts', 'check-style.mjs');
if (existsSync(checker)) {
  const run = spawnSync(process.execPath, [checker, target, '--quiet'], { encoding: 'utf8' });
  process.stdout.write(run.stdout ?? '');
  if (run.status !== 0) {
    process.stdout.write('  the scaffold is NOT clean - that is a bug in the skill, not in your deck\n\n');
    process.exit(1);
  }
}

process.stdout.write(`  next: cd ${target} && pnpm install\n\n`);
