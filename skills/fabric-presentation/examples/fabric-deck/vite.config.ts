/*
 * Vite config for this deck. It serves the single-file HTML export
 * (`scripts/export-single-html.mjs` in the fabric-presentation skill) in TWO
 * roles, and does nothing else:
 *
 *  1. THE WELD, at build time. Behind `FABRIC_SINGLE_FILE`, which only the
 *     export script sets. A plain `slidev build` must keep Slidev's own
 *     chunking - the SPA in `dist/` loads faster split than welded - so with
 *     the variable unset this half adds nothing at all, which is why the file
 *     can sit in every deck.
 *  2. THE BUTTON'S ENDPOINT, at dev time. `custom-nav-controls.vue` puts an
 *     export icon in the dev server's nav bar; the export itself is a Node
 *     process that cannot run in a browser, so the button calls
 *     `GET /__fabric/export-html` and this config runs the script server-side
 *     and hands the produced file back as a download. `apply: 'serve'` keeps
 *     the endpoint out of every build, the single-file export included.
 *
 * ---- 1. the weld -----------------------------------------------------------
 *
 * The three settings that make one file possible, and why each is needed:
 *
 *  - `viteSingleFile()` welds the emitted .js and .css back into index.html.
 *  - `inlineDynamicImports` stops Rollup splitting the bundle: a dynamic import
 *    would emit a sibling chunk the welded HTML could never fetch over file://.
 *  - `manualChunks` must then be REMOVED. Slidev sets one (shiki, monaco,
 *    ~icons), and Rollup refuses to accept manualChunks together with
 *    inlineDynamicImports - the build fails outright with INVALID_OPTION rather
 *    than silently splitting. vite-plugin-singlefile does not clear it, so the
 *    small `enforce: post` plugin below does.
 *
 * ---- 2. where the export script is ----------------------------------------
 *
 * A deck is often COPIED OUT of the skill, so the script cannot be reached by a
 * fixed `../../scripts/`. This file is byte-identical in every deck - the
 * scaffolder copies it verbatim so the two can never drift - and finds the
 * skill at request time, in this order:
 *
 *   1. `FABRIC_SKILL_DIR` in the dev server's environment. The override: works
 *      anywhere, including a deck whose skill moved this morning.
 *   2. `"fabricSkill"` in the deck's own package.json. The persistent answer
 *      for a copied-out deck; `new-deck.mjs` writes it when it scaffolds one
 *      outside the skill.
 *   3. An ancestor of this file that carries both `SKILL.md` and
 *      `scripts/export-single-html.mjs`. This is how the skill's own
 *      `examples/fabric-deck` finds it with nothing declared anywhere.
 *
 * With none of the three, the endpoint answers 500 with the sentence that says
 * which of them to set. It never guesses.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const singleFile = process.env.FABRIC_SINGLE_FILE === '1';

/* This file sits in the deck root, which is what the export script takes. */
const deckRoot = dirname(fileURLToPath(import.meta.url));

/* Runs after vite-plugin-singlefile has set inlineDynamicImports, and takes
   Slidev's manualChunks back off. Mutating the config object is how a Vite
   `config` hook edits in place; returning a partial would merge rather than
   delete. */
const dropManualChunks = {
  name: 'fabric:drop-manual-chunks',
  enforce: 'post' as const,
  config(config: Record<string, any>) {
    const output = config.build?.rollupOptions?.output;
    for (const o of Array.isArray(output) ? output : [output]) {
      if (o) delete o.manualChunks;
    }
  },
};

/* ---- finding the skill --------------------------------------------------- */

const EXPORTER = join('scripts', 'export-single-html.mjs');

const isSkillDir = (dir: string) =>
  existsSync(join(dir, 'SKILL.md')) && existsSync(join(dir, EXPORTER));

const declaredInPackageJson = () => {
  const path = join(deckRoot, 'package.json');
  if (!existsSync(path)) return null;
  try {
    const declared = JSON.parse(readFileSync(path, 'utf8')).fabricSkill;
    return typeof declared === 'string' && declared ? resolve(deckRoot, declared) : null;
  } catch {
    return null;
  }
};

const findSkill = () => {
  const declared = process.env.FABRIC_SKILL_DIR || declaredInPackageJson();
  if (declared) return isSkillDir(declared) ? declared : null;
  for (let dir = deckRoot; ; dir = dirname(dir)) {
    if (isSkillDir(dir)) return dir;
    if (dirname(dir) === dir) return null;
  }
};

const NO_SKILL =
  'The fabric-presentation skill is not reachable from this deck, so the\n' +
  'single-file export cannot run. Point the deck at it in one of two ways:\n\n' +
  '  - add "fabricSkill": "/absolute/path/to/fabric-presentation" to the\n' +
  "    deck's package.json, or\n" +
  '  - start the dev server with FABRIC_SKILL_DIR=/absolute/path/... set.\n\n' +
  'A deck sitting inside the skill needs neither: the config walks up to it.\n';

/* ---- the dev-only endpoint the nav button calls --------------------------- */

/* One export at a time. Each build is tens of seconds of CPU, and two clicks
   in a row must not stack two `slidev build` processes over one deck - they
   would both write `.slidev-single-file.md` beside slides.md and the first to
   finish would delete it under the second. Everyone who arrives while a build
   is running waits on the same promise and gets the same file. */
let inFlight: Promise<{ ok: boolean; body: Buffer | string; name: string }> | null = null;

const runExport = async () => {
  const skill = findSkill();
  if (!skill) return { ok: false, body: NO_SKILL, name: '' };

  const name = `${basename(deckRoot).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'deck'}.html`;
  /* Into the OS temp dir, never into the deck: the deck is source, and a
     scaffolded one gitignores dist/ but not a stray .html in its root. */
  const scratch = mkdtempSync(join(tmpdir(), 'fabric-nav-export-'));
  const output = join(scratch, name);

  /* NODE_ENV HAS TO GO. Vite sets it to `development` in the dev server's own
     process, the child would inherit it, and Vite reads it back as the answer
     to "is this a production build" - so the export would come out a DEVELOPMENT
     bundle: Vue's dev runtime with its warnings, ~200 kB more file, and
     `import.meta.env.DEV` TRUE inside a built deck, which is exactly the flag
     the nav button hides itself behind. The same export run from a terminal has
     no NODE_ENV and is correct, which is what makes this one worth a paragraph.
     FABRIC_SINGLE_FILE goes for the same reason in reverse: the export script
     sets it for its own child, and a stale one inherited from here would weld a
     build nobody asked to weld. */
  const env = { ...process.env };
  delete env.NODE_ENV;
  delete env.FABRIC_SINGLE_FILE;

  try {
    const log: string[] = [];
    const status = await new Promise<number>((done) => {
      const child = spawn(
        process.execPath,
        [join(skill, EXPORTER), deckRoot, '--output', output],
        { cwd: deckRoot, env },
      );
      child.stdout.on('data', (d) => log.push(String(d)));
      child.stderr.on('data', (d) => log.push(String(d)));
      child.on('error', (error) => {
        log.push(`could not start ${process.execPath}: ${error.message}\n`);
        done(-1);
      });
      child.on('close', (code) => done(code ?? -1));
    });

    if (status !== 0 || !existsSync(output)) {
      return {
        ok: false,
        body: `export-single-html exited ${status}\n\n${log.join('')}`,
        name: '',
      };
    }
    return { ok: true, body: readFileSync(output), name };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
};

const exportEndpoint = {
  name: 'fabric:export-single-html-endpoint',
  apply: 'serve' as const,
  configureServer(server: any) {
    server.middlewares.use('/__fabric/export-html', async (_request: any, response: any) => {
      /* The export is tens of seconds. Node would otherwise close the socket
         from under it on the default request timeout. */
      response.setTimeout?.(0);
      inFlight ??= runExport().finally(() => {
        inFlight = null;
      });
      let result;
      try {
        result = await inFlight;
      } catch (error: any) {
        result = { ok: false, body: `export failed: ${error?.message ?? error}\n`, name: '' };
      }
      if (!result.ok) {
        response.statusCode = 500;
        response.setHeader('content-type', 'text/plain; charset=utf-8');
        response.end(result.body);
        return;
      }
      response.statusCode = 200;
      response.setHeader('content-type', 'text/html; charset=utf-8');
      response.setHeader('content-disposition', `attachment; filename="${result.name}"`);
      response.setHeader('cache-control', 'no-store');
      response.end(result.body);
    });
  },
};

export default defineConfig({
  /* WITHOUT THIS THE BUTTON CANNOT WORK, and the reason is not obvious.
     The export runs a `slidev build` over the same directory the dev server is
     serving, and a build puts two files in the deck root and takes them away
     again: `.slidev-single-file.md`, the hash-router entry (see the export
     script's header), and `index.html`, which Slidev writes as Vite's build
     entry. Each appearance and each removal is a change in a watched directory,
     and Vite answers `index.html` with a FULL PAGE RELOAD. The deck reloads
     twice mid-export, the button's fetch dies with the page that made it, and
     no download ever arrives - while the build behind it runs to completion and
     reports success, which is what makes the symptom so hard to read.

     Neither file is deck source. `index.html` in particular is Slidev's, and a
     Slidev deck never has one of its own. */
  server: {
    watch: {
      ignored: [join(deckRoot, '.slidev-single-file.md'), join(deckRoot, 'index.html')],
    },
  },
  plugins: singleFile
    ? [viteSingleFile(), dropManualChunks, exportEndpoint]
    : [exportEndpoint],
});
