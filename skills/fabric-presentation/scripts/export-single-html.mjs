#!/usr/bin/env node
/*
 * export-single-html.mjs - a Slidev deck as ONE self-contained .html file.
 *
 * Usage:
 *   node scripts/export-single-html.mjs <deck-dir> [--output <file.html>]
 *                                       [--subsets latin,latin-ext | all]
 *                                       [--keep-build] [--allow-network] [--quiet]
 *
 * Requires Node 18 or newer.
 *
 * What it produces: a single file that opens by double-click over file://, with
 * the network switched off and nothing beside it. Not a PDF and not a folder -
 * the live deck, with its real navigation, selectable text and working links.
 *
 * Why this is not `slidev build`. That command emits an SPA into `dist/`: an
 * index.html plus a dozen hashed .js/.css chunks plus whatever `public/` held.
 * Open its index.html over file:// and you get a blank page, because the module
 * chunks are fetched by absolute path. Slidev's own `export` goes the other way
 * and flattens the deck to PDF, PNG or PPTX - pictures of slides, not the deck.
 * This script is the missing third thing, and it is a BUILD, not a rendering:
 * what lands in the file is the same Vue app the dev server runs.
 *
 * ---- the five things that have to be defeated ------------------------------
 *
 *  1. CODE SPLITTING. Rollup emits sibling chunks that a welded HTML can never
 *     fetch. Handled in the deck's own `vite.config.ts` (which this script
 *     requires and checks for): vite-plugin-singlefile welds the .js and .css
 *     back into the HTML, `inlineDynamicImports` stops the split, and Slidev's
 *     `manualChunks` has to be deleted or Rollup refuses the combination.
 *
 *  2. PUBLIC ASSETS. `public/foo.svg` is copied to the output root and
 *     referenced as `/foo.svg` - an absolute path, which over file:// means the
 *     root of the disk. Vite does not rewrite those, because in an SPA they are
 *     correct. Every file the build left beside index.html is base64'd into the
 *     HTML here and its path replaced.
 *
 *  3. THE WEBFONT. `fonts.provider: google` in the deck's headmatter puts a
 *     `<link rel=stylesheet href=fonts.googleapis.com>` in the head. That is a
 *     network request on open, and with the network gone the deck falls back to
 *     a system grotesque and every measured line length shifts. The stylesheet
 *     and each .woff2 it names are fetched HERE, at build time, and inlined as
 *     data URIs - so the export needs network even though the result does not.
 *
 *  4. THE ROUTER. Slidev routes in history mode, so slide 3 is the path `/3`.
 *     Over file:// the path is the file's own place on disk, the router matches
 *     no route, and the deck renders Slidev's 404 page - fonts loaded, styles
 *     applied, nothing else. It looks like a broken build and is not one. The
 *     single-file deck therefore routes in HASH mode (`file://...html#/3`),
 *     which is a headmatter setting rather than a CLI flag, so this script
 *     builds from a throwaway entry file beside slides.md rather than editing
 *     slides.md - an interrupted run must not be able to leave the deck's own
 *     source rewritten.
 *
 *  5. THE FAVICON. Slidev's default favicon is a jsdelivr URL, and it appears
 *     twice: the `<link rel=icon>` and a string in the bundled config. Both are
 *     replaced by the same data URI, so a browser with no network shows no
 *     pending request in the network list. A stray favicon request is not a
 *     rendering bug, but it is the difference between "no requests go out" and
 *     "one does, and it is only the favicon".
 *
 * ---- what the file cannot carry --------------------------------------------
 *
 *  - Anything the deck fetches AT RUNTIME. Slidev's Monaco editor
 *    (`{monaco}` code blocks), remote assets pulled by a component, a PlantUML
 *    diagram (rendered by plantuml.com), an <iframe src> to a live page. The
 *    audit pass at the end of this script names every remote URL still sitting
 *    in a loading position and fails rather than shipping a file that needs the
 *    network. Runtime fetches it cannot see are listed in the skill's
 *    `references/slidev.md`.
 *  - The presenter view and the speaker notes UI. Those are routes of the dev
 *    server, not of a built deck.
 *  - Any saving. Drawings and the click state live in memory only.
 *
 * ---- the failure mode this script exists to prevent ------------------------
 *
 * A single-file export that silently still needs the network is worse than no
 * export, because it works on the machine that built it and fails in the room
 * it was mailed to. So the last thing this script does is read its own output
 * back and refuse to call it self-contained if any `src=`, `href=` on a <link>
 * or <script>, or `url()` in CSS still points at http(s). `--allow-network`
 * downgrades that to a warning, and says so in the report.
 *
 * Exit code: 0 clean, 1 the file is not self-contained, 2 bad invocation or a
 * failed build.
 */

import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';

/* Google serves woff2 only to a UA it believes supports it. Ask as a plain old
   browser and the reply is woff2; ask as node and it is ttf, four times the
   size and no better looking. */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const MIME = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

/* The build leaves these beside index.html and they are not deck content: the
   404 page is a byte-for-byte copy of index.html (doubling the temp dir for
   nothing) and _redirects is Netlify's. */
const NOT_DECK_CONTENT = new Set(['index.html', '404.html', '_redirects']);

/* ---- invocation ---------------------------------------------------------- */

const argv = process.argv.slice(2);
const value = (name, fallback = null) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1] ?? fallback;
};
const quiet = argv.includes('--quiet');
const keepBuild = argv.includes('--keep-build');
const allowNetwork = argv.includes('--allow-network');

const FLAGS_WITH_VALUES = new Set(['--output', '--subsets']);
const positional = argv.filter(
  (a, i) => !a.startsWith('--') && !FLAGS_WITH_VALUES.has(argv[i - 1]),
);

const usage = () => {
  process.stderr.write(
    'usage: node scripts/export-single-html.mjs <deck-dir> [--output <file.html>]\n' +
      '                                          [--subsets latin,latin-ext | all]\n' +
      '                                          [--keep-build] [--allow-network] [--quiet]\n',
  );
};

if (positional.length === 0) {
  usage();
  process.exit(2);
}

const deck = resolve(positional[0]);
const say = (line) => {
  if (!quiet) process.stdout.write(line);
};
const die = (message, code = 2) => {
  process.stderr.write(`export-single-html: ${message}\n`);
  process.exit(code);
};

/* ---- 1. the deck has to be one, and has to be ready ---------------------- */

if (!existsSync(deck) || !statSync(deck).isDirectory()) {
  die(`no such directory: ${deck}`);
}
if (!existsSync(join(deck, 'slides.md'))) {
  die(`${deck} has no slides.md - point this at a Slidev deck directory`);
}

const viteConfig = join(deck, 'vite.config.ts');
if (!existsSync(viteConfig) || !readFileSync(viteConfig, 'utf8').includes('FABRIC_SINGLE_FILE')) {
  die(
    `${deck} carries no single-file vite.config.ts.\n` +
      "  The weld happens in the deck's own Vite config, not here: without it Rollup\n" +
      '  splits the bundle into sibling chunks and the one file is a blank page.\n' +
      '  Copy vite.config.ts from the skill\'s examples/fabric-deck/, and add\n' +
      '  vite-plugin-singlefile to the deck\'s devDependencies.',
  );
}

const slidevBin = join(deck, 'node_modules', '.bin', 'slidev');
if (!existsSync(slidevBin)) {
  die(
    `${deck} has no node_modules/.bin/slidev - install the deck's dependencies first:\n` +
      `    cd ${deck} && pnpm install`,
  );
}
if (!existsSync(join(deck, 'node_modules', 'vite-plugin-singlefile'))) {
  die(
    `${deck} has no vite-plugin-singlefile - the weld cannot happen. Add it to the\n` +
      `  deck's devDependencies, e.g.:\n` +
      `    cd ${deck} && pnpm add -D vite-plugin-singlefile`,
  );
}

const slug = basename(deck)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

/* The default lands in dist/, which every deck this skill scaffolds already
   gitignores. A single file is still build output. */
const output = resolve(value('--output') ?? join(deck, 'dist', `${slug}.html`));

const subsetsArg = (value('--subsets') ?? 'all').trim();
const subsets =
  subsetsArg === 'all'
    ? null
    : new Set(subsetsArg.split(',').map((s) => s.trim()).filter(Boolean));

/* ---- 2. the hash-router entry -------------------------------------------
 * `routerMode` is headmatter, not a CLI flag, so the only way to build one
 * deck two ways is two entry files. This one is a copy of slides.md with the
 * router setting forced, written beside it (Slidev takes the deck root from
 * the entry's directory, so components/, style.css and public/ all still
 * resolve) and removed in the `finally` below. slides.md is never touched: a
 * run killed halfway must not be able to leave the deck rewritten.
 */

const slidesPath = join(deck, 'slides.md');
const entryPath = join(deck, '.slidev-single-file.md');
const source = readFileSync(slidesPath, 'utf8');

const headmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
const entrySource = headmatter
  ? source.replace(
      headmatter[0],
      `---\n${headmatter[1].replace(/^routerMode:.*$\n?/m, '')}\nrouterMode: hash\n---\n`,
    )
  : `---\nrouterMode: hash\n---\n\n${source}`;

writeFileSync(entryPath, entrySource, 'utf8');

/* ---- 3. build the SPA into a temp dir ------------------------------------
 * Not into the deck's own dist/: the intermediate is ~1.8 MB of duplicated
 * HTML and the deck directory is shipped inside a skill that must stay small.
 */

const buildDir = mkdtempSync(join(tmpdir(), 'fabric-single-'));

say(`\nSingle-file export - ${deck}\n\n`);
say(`  building  ${buildDir}\n`);

let build;
try {
  build = spawnSync(
    slidevBin,
    ['build', '.slidev-single-file.md', '--base', './', '--out', buildDir],
    {
      cwd: deck,
      encoding: 'utf8',
      env: { ...process.env, FABRIC_SINGLE_FILE: '1' },
    },
  );
} finally {
  rmSync(entryPath, { force: true });
}

if (build.status !== 0) {
  process.stderr.write(build.stdout ?? '');
  process.stderr.write(build.stderr ?? '');
  if (build.error) die(`could not run ${slidevBin}: ${build.error.message}`);
  die(`slidev build failed (exit ${build.status})`);
}

const indexPath = join(buildDir, 'index.html');
if (!existsSync(indexPath)) {
  die(`the build wrote no index.html into ${buildDir}`);
}

let html = readFileSync(indexPath, 'utf8');

/* A chunk left beside index.html means the weld did not take, and the file we
   are about to write would be a blank page. Say it here rather than let the
   audit report it as a mystery. */
const strayChunks = readdirSync(buildDir).filter((f) => /\.(m?js|css)$/.test(f));
if (strayChunks.length > 0) {
  die(
    `the build emitted ${strayChunks.length} stray chunk(s) - the weld did not take: ` +
      `${strayChunks.join(', ')}\n` +
      "  check that the deck's vite.config.ts deletes Slidev's manualChunks.",
  );
}

/* ---- 4. inline what the page loads --------------------------------------- */

const dataUri = (mime, buffer) => `data:${mime};base64,${buffer.toString('base64')}`;

const fetched = new Map();
const fetchBuffer = async (url) => {
  if (fetched.has(url)) return fetched.get(url);
  let response;
  try {
    response = await fetch(url, { headers: { 'user-agent': BROWSER_UA } });
  } catch (error) {
    die(
      `could not fetch ${url}: ${error.message}\n` +
        '  the EXPORT needs the network even though the file it produces does not.',
    );
  }
  if (!response.ok) die(`${url} answered ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fetched.set(url, buffer);
  return buffer;
};

const report = [];

/* (a) the webfont. The stylesheet names one @font-face per subset per weight,
   and each block is preceded by a CSS comment naming the subset - which is the
   only handle on which script a block covers. --subsets drops the ones a deck
   will never use; the latin pair alone is about a fifth of the whole family. */

const FONT_LINK = /<link\s+rel="stylesheet"\s+href="(https:\/\/fonts\.googleapis\.com\/[^"]+)"[^>]*>/g;
const fontLinks = [...html.matchAll(FONT_LINK)];

for (const link of fontLinks) {
  const [tag, url] = link;
  let css = (await fetchBuffer(url)).toString('utf8');

  if (subsets) {
    const blocks = css.split(/(?=\/\*)/).filter(Boolean);
    const kept = blocks.filter((block) => {
      const name = /^\/\*\s*([\w-]+)\s*\*\//.exec(block);
      return !name || subsets.has(name[1]);
    });
    if (kept.length === 0) {
      die(`--subsets ${subsetsArg} matched no block in ${url}`);
    }
    css = kept.join('');
  }

  const faceUrls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)];
  let bytes = 0;
  for (const [, faceUrl] of faceUrls) {
    const buffer = await fetchBuffer(faceUrl);
    bytes += buffer.length;
    const extension = faceUrl.slice(faceUrl.lastIndexOf('.')).toLowerCase();
    css = css.split(faceUrl).join(dataUri(MIME[extension] ?? 'font/woff2', buffer));
  }

  html = html.replace(tag, `<style>\n${css}\n</style>`);
  report.push(
    `webfont  ${faceUrls.length} face file(s), ${(bytes / 1024).toFixed(0)} kB` +
      (subsets ? ` (subsets: ${subsetsArg})` : ''),
  );
}

/* (b) every file the build left beside index.html. Longest path first: a deck
   with both /a.svg and /a.svg.map must not have the shorter one eat the
   longer. Each path is replaced in all three shapes a bundle can hold it in -
   `/x`, `./x` and `x` - because a markdown <img src> keeps the absolute form
   while Vite's own emitted references carry the base. */

const siblings = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    const path = relative(buildDir, full).split(sep).join('/');
    if (NOT_DECK_CONTENT.has(path)) continue;
    siblings.push({ full, path });
  }
};
walk(buildDir);
siblings.sort((a, b) => b.path.length - a.path.length);

let inlinedAssets = 0;
let inlinedBytes = 0;
const unknownTypes = [];

for (const { full, path } of siblings) {
  const extension = path.slice(path.lastIndexOf('.')).toLowerCase();
  const mime = MIME[extension];
  if (!mime) unknownTypes.push(path);
  const buffer = readFileSync(full);
  const uri = dataUri(mime ?? 'application/octet-stream', buffer);
  const before = html;
  for (const form of [`/${path}`, `./${path}`, path]) {
    for (const quote of ['"', "'", '`', '(']) {
      const close = quote === '(' ? ')' : quote;
      html = html.split(`${quote}${form}${close}`).join(`${quote}${uri}${close}`);
    }
  }
  if (html !== before) {
    inlinedAssets += 1;
    inlinedBytes += buffer.length;
  }
}

if (inlinedAssets > 0) {
  report.push(`assets   ${inlinedAssets} public file(s), ${(inlinedBytes / 1024).toFixed(0)} kB`);
}

/* (c) whatever is still loaded from a remote host: Slidev's own favicon, and
   anything a deck put in a <link>, a <script src> or a CSS url(). A <a href>
   is left alone - a link the reader may click is not a load, and turning it
   into a data URI would break it. The favicon URL also appears as a string in
   the bundled config, so the replacement is over the whole file. */

const LOADERS = [
  /<link\b[^>]*\bhref="(https?:\/\/[^"]+)"/g,
  /<script\b[^>]*\bsrc="(https?:\/\/[^"]+)"/g,
  /<img\b[^>]*\bsrc="(https?:\/\/[^"]+)"/g,
  /url\((https?:\/\/[^)'"]+)\)/g,
];

const remoteLoads = new Set();
for (const pattern of LOADERS) {
  for (const match of html.matchAll(pattern)) remoteLoads.add(match[1]);
}

for (const url of remoteLoads) {
  const buffer = await fetchBuffer(url);
  const extension = url.slice(url.lastIndexOf('.')).toLowerCase().replace(/[?#].*$/, '');
  const uri = dataUri(MIME[extension] ?? 'application/octet-stream', buffer);
  html = html.split(url).join(uri);
  report.push(`remote   ${url} -> data: (${(buffer.length / 1024).toFixed(0)} kB)`);
}

/* ---- 5. the audit -------------------------------------------------------- */

const leftovers = new Set();
for (const pattern of LOADERS) {
  for (const match of html.matchAll(pattern)) leftovers.add(match[1]);
}

/* ---- 6. write it out ----------------------------------------------------- */

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, html, 'utf8');

if (!keepBuild) rmSync(buildDir, { recursive: true, force: true });
else report.push(`kept     ${buildDir}`);

const size = statSync(output).size;

say('\n');
for (const line of report) say(`  ${line}\n`);
say(`\n  ${output}\n`);
say(`  ${(size / 1024 / 1024).toFixed(2)} MB (${size.toLocaleString('en-GB')} bytes)\n\n`);

if (unknownTypes.length > 0) {
  say(
    `  note: inlined with an unknown media type: ${unknownTypes.join(', ')}\n` +
      '        add the extension to MIME in this script if the browser refuses it\n\n',
  );
}

if (leftovers.size === 0) {
  say('  self-contained - nothing in it points at a network\n\n');
  process.exit(0);
}

const lines = [...leftovers].map((url) => `  still remote: ${url}`).join('\n');
if (allowNetwork) {
  process.stdout.write(
    `  NOT self-contained, and --allow-network said that is acceptable:\n${lines}\n\n`,
  );
  process.exit(0);
}
process.stderr.write(
  `export-single-html: the file is NOT self-contained - it would reach the network on open:\n${lines}\n` +
    '  pass --allow-network to keep it anyway, and say so to whoever receives it.\n',
);
process.exit(1);
