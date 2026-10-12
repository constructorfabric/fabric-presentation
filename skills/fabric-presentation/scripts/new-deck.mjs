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
 *   slides.md                 headmatter, a v4 cover, one content slide, one
 *                             slide per requested case
 *   style.css                 examples/fabric-deck/style.css sections 1-4 and
 *                             6: the canvas, the frames, the four layouts and
 *                             every template v4 shape - read from the example
 *                             deck at scaffold time, so the two cannot drift
 *   fabric-tokens.css         assets/fabric-tokens.css, beside style.css
 *                             because that is where style.css imports it from
 *   layouts/fabric.vue        the light slide of template v4: title frame at
 *                             y=52.8, content box from y=163.2, the footer
 *                             with the wordmark and the unpadded page number,
 *                             no rule
 *   layouts/fabric-cover.vue  the cover (v4-01): eyebrow, 64pt title, subtitle
 *                             and author line from the slide's frontmatter, on
 *                             the vertical navy ground; no page number
 *   layouts/fabric-section.vue the section divider (v4-02), page number on
 *   layouts/fabric-dark.vue   quote and closing on the same ground
 *   sections.ts               the deck's sections, empty as the template ships;
 *                             declare some and the light pages' footers grow a
 *                             nav
 *   components/SectionNav.vue that nav, mounted by the light layout only
 *     (all four layouts, sections.ts and SectionNav.vue are copied from
 *     examples/fabric-deck, the deck that is checked frame for frame against
 *     template v4 by its v4-reference.md)
 *   components/*.vue          the requested template cases that carry a
 *                             component, unchanged
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
 *  - The default content slide carries the template's anatomy before a word is
 *    typed into it: a navy title, a row of three tint cards with accent-blue
 *    kickers, and the footer wordmark - the Three Columns layout (v4-07).
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
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
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
 * Discovered rather than listed: a case is a .md slide block in templates/, and
 * when it mounts a component, the component is the .vue file it names. A block
 * that mounts none - the section divider is a layout plus frontmatter - is a
 * case all the same. Adding a case to templates/ makes it available here with
 * no edit.
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
    const component = tag ? `${tag[1]}.vue` : null;
    if (component && !existsSync(join(templates, component))) continue;
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
    process.stdout.write(`  ${name.padEnd(18)}  ${entry.component ?? '(layout only)'}\n`);
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

/* The headmatter block IS the first slide's frontmatter, which is why the cover
 * layout is named there and every later slide falls through to `defaults`. The
 * cover's eyebrow, subtitle and author line are frontmatter too: the layout
 * places them at the template's own coordinates.
 *
 * `fonts: provider: none` is load-bearing. `--fx-font` is Aptos, then Helvetica
 * Neue - the faces template v4 renders in - and loads no web font. Without the
 * line Slidev pulls its own theme default family from Google, which nothing in
 * the deck uses and which the single-file export would then inline. */
const head = `---
title: ${deckTitle}
layout: fabric-cover
transition: none
mdc: true
fonts:
  provider: none
eyebrow: Presentation
subtitle: One line saying what this deck is for.
author: Author Name · ${deckDate}
defaults:
  layout: fabric
---

# ${deckTitle}

---

::header::

# The claim of this slide, as a sentence

::default::

<div class="deck-cols deck-cols_3">
  <div class="fx-card">
    <div class="fx-kicker">First kind</div>
    <p class="deck-card-body">What this one is, in one line.</p>
  </div>
  <div class="fx-card">
    <div class="fx-kicker">Second kind</div>
    <p class="deck-card-body">A different KIND of thing, which the kicker says and no fill has to.</p>
  </div>
  <div class="fx-card">
    <div class="fx-kicker">Third kind</div>
    <p class="deck-card-body">Replace all three, or take a case from the skill instead.</p>
  </div>
</div>

<!--
Claim: the one sentence this slide asserts. Two sentences means two slides.

What to say: what the presenter adds out loud and the slide does not show.

Not on the slide (answer if asked): what was deliberately left off, and why.
-->
`;

const slides = [head];

for (const name of requested) {
  if (name === 'cover') continue; // the headmatter above is the cover
  const block = adaptBlock(readFileSync(join(templates, CASES.get(name).block), 'utf8'));
  /* A case block opens with its own frontmatter, and in Slidev the slide
     separator and the opening line of that frontmatter are the SAME `---`.
     Adding a separator in front of one would start an empty slide. */
  slides.push(block.startsWith('---') ? `\n${block}\n` : `\n---\n\n${block}\n`);
}

write('slides.md', slides.join(''));

/* ---- styles, layouts and sections ----------------------------------------
 * Copied from examples/fabric-deck rather than written out here: that deck is
 * the one checked frame for frame against template v4 (its v4-reference.md), so
 * a fix proved there reaches every scaffolded deck with no second edit.
 *
 * style.css takes the example's sections 1-4 (canvas, frames, layouts, template
 * shapes) and 6 (play-view chrome). Section 5 is that deck's own compositions;
 * a template case carries whatever it needs beyond 1-4 in its own scoped style.
 */

const example = join(skill, 'examples', 'fabric-deck');
const exampleStyle = readFileSync(join(example, 'style.css'), 'utf8');
const ownStart = exampleStyle.indexOf("/* ---- 5. This deck's own");
const chromeStart = exampleStyle.indexOf('/* ---- 6. ');
if (ownStart === -1 || chromeStart === -1) {
  process.stderr.write(
    'new-deck: examples/fabric-deck/style.css no longer carries its section 5 / 6\n' +
      '          markers, so its template base cannot be cut out. That is a bug in the skill.\n',
  );
  process.exit(1);
}
const banner = exampleStyle.indexOf('*/') + 2;

write(
  'style.css',
  `/*
 * ${deckTitle} - deck stylesheet, scaffolded from the fabric-presentation skill.
 *
 * Template v4 (ppt.constructor.rocks, 9 October 2026) on Slidev's canvas: every
 * coordinate is the template XML's own, in --fx-u (one pixel of the 1280 x 720
 * slide), and every frame is placed absolutely, the way PowerPoint places it.
 * Every value is a token from ./fabric-tokens.css - keep the two files together.
 *
 *   1. Canvas            --fx-scale for Slidev's 980px canvas
 *   2. Frames            the absolute text frame every layout places
 *   3. The layouts       light slide, tint slide, dark slide, footer
 *   4. Template shapes   cover, section, agenda, list, cards, stats, image,
 *                        team, process, quote, closing, status table
 *   6. Play-view chrome  one piece of Slidev's own UI, suppressed
 *
 * Section 5 of the example deck - its own compositions - is not part of the
 * base. Add the deck's own furniture after section 4.
 */
` +
    exampleStyle.slice(banner, ownStart).replace(/^\n+/, '\n') +
    exampleStyle.slice(chromeStart),
);
copy(join(assets, 'fabric-tokens.css'), 'fabric-tokens.css');

for (const name of [
  'layouts/fabric.vue',
  'layouts/fabric-cover.vue',
  'layouts/fabric-section.vue',
  'layouts/fabric-dark.vue',
  'sections.ts',
  'components/SectionNav.vue',
]) {
  if (existsSync(join(example, name))) {
    copy(join(example, name), name);
  } else {
    process.stderr.write(`new-deck: examples/fabric-deck/${name} is missing. That is a bug in the skill.\n`);
    process.exit(1);
  }
}

/* ---- components and assets ---------------------------------------------- */

for (const name of requested) {
  const { component } = CASES.get(name);
  if (component) copy(join(templates, component), join('components', component));
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
      /* Relative, so the deck's package.json carries no machine-specific
         path - a collaborator's checkout resolves it from the deck root. */
      ...(insideSkill ? {} : { fabricSkill: relative(target, skill) || '.' }),
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
\`references/fabric-style.md\`: the designer's template v4 - blue and navy
lead, Aptos (Helvetica Neue where Aptos is not installed), rounded cards and
square tables, no shadows, a footer of wordmark and page number with no rule,
and green, amber and red only as small status signals beside the word.

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
the styles and every \`public/\` asset base64'd inside. It opens over
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

- \`slides.md\` - the deck. \`layout: fabric\` for a content slide (add
  \`ground: tint\` for an agenda), \`layout: fabric-cover\` for the cover,
  \`layout: fabric-section\` for a section divider, \`layout: fabric-dark\` for a
  quote or the closing. Its one content slide is deliberately sparse.
- \`style.css\` + \`fabric-tokens.css\` - the palette, the type ladder and every
  template v4 shape at the template's own coordinates. They are a pair: drop
  either and every \`var()\` in the deck resolves to nothing, which silently
  empties the slides of colour.
- \`layouts/\` - the deck's four layouts. Every page's footer is the 10pt
  wordmark and the unpadded page number, no rule; the cover alone has no number.
- \`sections.ts\` - empty, as the template ships: its footer carries no section
  nav. Declare sections to opt in, and each light page's footer carries the
  names with the current one in the accent blue.
- \`vite.config.ts\` - the single-file HTML export, and nothing else: the build
  settings for the weld (inert unless the export script asks for it) and, in
  dev, the endpoint the nav button calls.
- \`custom-nav-controls.vue\` - that button, in Slidev's own nav bar. Dev only,
  so no build carries it.
- \`components/\` - \`SectionNav.vue\` plus the template cases copied in${requested.length > 0 ? `: ${requested.join(', ')}` : ' (none yet)'}.
  Take more with \`node ${join(skill, 'scripts', 'new-deck.mjs')} --list\`.
- A content slide's header holds the title alone. The caps eyebrow belongs to
  the dark pages, and content starts at the top of the content box.
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
