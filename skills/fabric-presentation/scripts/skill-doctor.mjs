#!/usr/bin/env node
/*
 * skill-doctor.mjs - integrity check for the presentation skill itself.
 *
 * Usage:  node scripts/skill-doctor.mjs [skill-dir] [--quiet] [--twin <dir>]
 *                                       [--vue <dir>]
 *
 * Requires Node 18 or newer.
 *
 * check-style.mjs checks a deck. This checks the skill: the parts of it that
 * are not prose and can therefore rot without anyone noticing. Everything it
 * reports has actually happened in this skill or in a deck built from it, which
 * is why each check is a real resolution rather than a grep for a shape:
 *
 *   VUE       every templates/*.vue parses and compiles
 *   VARS      every custom property referenced in templates/ is defined in
 *             assets/fabric-tokens.css (or in the file that reads it)
 *   IMPORT    every @import in templates/ and assets/ resolves
 *   STYLE     check-style.mjs is clean over templates/ and assets/
 *   POINTER   every file SKILL.md and the references point at exists
 *   TWIN      the copy at --twin <dir> is byte-identical with this one. It runs
 *             only when that flag names a directory: where a project keeps a
 *             second copy of the skill, this says whether the two have drifted
 *
 * VARS is the one to keep honest. An undefined custom property does not fall
 * back and does not warn: the whole declaration that used it is invalidated, so
 * a band loses its fill and a card loses its border while the dev server, the
 * linters and the build all stay green. This failure mode empties a deck of its
 * colour while everything reports success, and a deck of empty boxes is
 * indistinguishable from one that was never styled at all.
 *
 * STYLE is scoped to templates/ and assets/ on purpose. The law
 * (references/fabric-style.md) quotes off-palette hexes with a '#' in
 * its anti-pattern table, and a grep-grade checker cannot tell documentation
 * from a declaration, so a run over the skill root would report the references'
 * own bad examples. check-style.mjs applies the same scoping itself when it is
 * pointed at a skill directory.
 *
 * VUE needs vue/compiler-sfc, which this skill does not carry. It looks for one
 * in the node_modules of each bundled deck under examples/ first, then in the
 * repository the skill lives in and in the working directory, and where it
 * finds none it falls back to a structural read and SAYS SO in its output - a
 * check that cannot run must not report a pass it did not earn.
 *
 * Exit code: 0 clean, 1 findings, 2 bad invocation.
 */

import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const require_ = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));

/* ---- invocation ---------------------------------------------------------- */

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1] ?? null;
};
const quiet = argv.includes('--quiet');
const twinFlag = flag('--twin');
const vueFlag = flag('--vue');
const positional = argv.filter((a, i) => {
  if (a.startsWith('--')) return false;
  const previous = argv[i - 1];
  return previous !== '--twin' && previous !== '--vue';
});

const skill = resolve(positional[0] ?? join(here, '..'));

if (!existsSync(join(skill, 'SKILL.md'))) {
  process.stderr.write(`skill-doctor: no SKILL.md under ${skill}\n`);
  process.exit(2);
}

const findings = [];
const notes = [];
const add = (where, check, detail) => findings.push({ where, check, detail });
const rel = (p) => relative(skill, p).split(sep).join('/') || '.';

const read = (p) => readFileSync(p, 'utf8');
const listFiles = (dir, extensions) => {
  const out = [];
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const full = join(d, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        walk(full);
      } else if (extensions.some((e) => entry.name.endsWith(e))) {
        out.push(full);
      }
    }
  };
  if (existsSync(dir)) walk(dir);
  out.sort();
  return out;
};

const templatesDir = join(skill, 'templates');
const assetsDir = join(skill, 'assets');
const tokensFile = join(assetsDir, 'fabric-tokens.css');

/* ---- the twin, when one is named ------------------------------------------
 * Some projects keep a second copy of the skill - an installed copy beside the
 * source one - and want to know the two have not drifted. That is a fact about
 * one project's layout and not about the skill, so it is asked for explicitly:
 * --twin <dir>. Nothing is searched for on disk, and without the flag the check
 * does not run and says nothing.
 */

const repoRoot = resolve(skill, '..', '..', '..');

const twin = twinFlag ? resolve(twinFlag) : null;

/* ---- 1. VUE -------------------------------------------------------------- */

const compilerCandidates = () => {
  const out = [];
  if (vueFlag) {
    const given = resolve(vueFlag);
    out.push(given, join(given, 'node_modules/vue/compiler-sfc/index.js'));
  }
  /* The skill's own bundled decks first: examples/fabric-deck installs Vue, so
     once it has been installed the VUE check runs for real instead of falling
     back to the structural read. A check that quietly degrades is the failure
     this file's header is about. */
  const examples = join(skill, 'examples');
  if (existsSync(examples)) {
    for (const entry of readdirSync(examples, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      out.push(join(examples, entry.name, 'node_modules/vue/compiler-sfc/index.js'));
    }
  }
  for (const root of [repoRoot, process.cwd()]) {
    out.push(join(root, 'node_modules/vue/compiler-sfc/index.js'));
  }
  return out;
};

const loadCompiler = () => {
  for (const candidate of compilerCandidates()) {
    if (!candidate.endsWith('.js') || !existsSync(candidate)) continue;
    try {
      const mod = require_(candidate);
      if (typeof mod.parse === 'function' && typeof mod.compileScript === 'function') {
        return { sfc: mod, from: candidate };
      }
    } catch {
      /* try the next one */
    }
  }
  return null;
};

const cases = listFiles(templatesDir, ['.vue']);
if (cases.length === 0) add(rel(templatesDir), 'VUE', 'no template cases found');

const compiler = loadCompiler();

if (compiler) {
  notes.push(`VUE compiled with ${compiler.from}`);
  for (const file of cases) {
    const source = read(file);
    const id = basename(file);
    let descriptor;
    try {
      const parsed = compiler.sfc.parse(source, { filename: id });
      for (const error of parsed.errors) {
        add(rel(file), 'VUE', `parse: ${error.message ?? error}`);
      }
      descriptor = parsed.descriptor;
    } catch (error) {
      add(rel(file), 'VUE', `parse threw: ${error.message}`);
      continue;
    }
    if (!descriptor.template) add(rel(file), 'VUE', 'no <template> block');
    if (descriptor.scriptSetup || descriptor.script) {
      try {
        compiler.sfc.compileScript(descriptor, { id });
      } catch (error) {
        add(rel(file), 'VUE', `script: ${error.message}`);
      }
    }
    if (descriptor.template) {
      try {
        const compiled = compiler.sfc.compileTemplate({
          source: descriptor.template.content,
          filename: id,
          id,
        });
        for (const error of compiled.errors) {
          add(rel(file), 'VUE', `template: ${error.message ?? error}`);
        }
      } catch (error) {
        add(rel(file), 'VUE', `template threw: ${error.message}`);
      }
    }
    for (const style of descriptor.styles) {
      try {
        const compiled = compiler.sfc.compileStyle({
          source: style.content,
          filename: id,
          id,
          scoped: style.scoped,
        });
        for (const error of compiled.errors ?? []) {
          add(rel(file), 'VUE', `style: ${error.message ?? error}`);
        }
      } catch (error) {
        add(rel(file), 'VUE', `style threw: ${error.message}`);
      }
    }
  }
} else {
  notes.push(
    'VUE NOT COMPILED: no vue/compiler-sfc reachable from here. Structural read ' +
      'only - pass --vue <dir-with-node_modules> for the real check, or run ' +
      'pnpm install inside examples/fabric-deck, which is then found ' +
      'automatically.',
  );
  for (const file of cases) {
    const source = read(file);
    for (const block of ['template', 'script', 'style']) {
      const open = (source.match(new RegExp(`<${block}[\\s>]`, 'g')) ?? []).length;
      const close = (source.match(new RegExp(`</${block}>`, 'g')) ?? []).length;
      if (open !== close) {
        add(rel(file), 'VUE', `structural: ${open} <${block}> against ${close} closing`);
      }
    }
    if (!/<template[\s>]/.test(source)) add(rel(file), 'VUE', 'structural: no <template> block');
    if (!/<script setup/.test(source)) add(rel(file), 'VUE', 'structural: no <script setup>');
  }
}

/* ---- 2. VARS ------------------------------------------------------------- */

const definedTokens = new Set();
if (existsSync(tokensFile)) {
  for (const match of read(tokensFile).matchAll(/(--[\w-]+)\s*:/g)) definedTokens.add(match[1]);
} else {
  add(rel(tokensFile), 'VARS', 'the tokens file is missing');
}

for (const file of listFiles(templatesDir, ['.vue', '.css', '.md'])) {
  const text = read(file);
  const local = new Set([...text.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  const reported = new Set();
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    for (const match of line.matchAll(/var\(\s*(--[\w-]+)/g)) {
      const name = match[1];
      if (definedTokens.has(name) || local.has(name) || reported.has(name)) continue;
      reported.add(name);
      add(
        `${rel(file)}:${index + 1}`,
        'VARS',
        `${name} is defined nowhere - the whole declaration is dropped at runtime`,
      );
    }
  });
}

/* ---- 3. IMPORT -----------------------------------------------------------
 * A deck-level stylesheet imports the tokens from BESIDE it, because that is
 * where the pair lands in a deck root. Inside the skill the two files sit in
 * different directories, so an import is cleared when the target exists next to
 * the file OR under assets/ - and reported when it exists in neither, which is
 * how a renamed or moved token file would show up.
 */

for (const file of listFiles(templatesDir, ['.css']).concat(listFiles(assetsDir, ['.css']))) {
  const text = read(file);
  text.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(/@import\s+(?:url\()?["']([^"']+)["']/g)) {
      const target = match[1];
      if (/^https?:/.test(target)) continue;
      const beside = resolve(dirname(file), target);
      const inAssets = join(assetsDir, basename(target));
      if (existsSync(beside) || existsSync(inAssets)) continue;
      add(`${rel(file)}:${index + 1}`, 'IMPORT', `${target} resolves nowhere`);
    }
  });
}

/* ---- 4. STYLE ------------------------------------------------------------ */

const checker = join(skill, 'scripts', 'check-style.mjs');
if (!existsSync(checker)) {
  add('scripts/check-style.mjs', 'STYLE', 'the conformance checker is missing');
} else {
  for (const dir of [templatesDir, assetsDir]) {
    if (!existsSync(dir)) continue;
    const run = spawnSync(process.execPath, [checker, dir, '--quiet'], { encoding: 'utf8' });
    if (run.status !== 0) {
      /* One row per finding: "<file>:<line>  RULE  detail". The tail summary
         line names the same rules, so match the shape rather than the words. */
      const lines = (run.stdout ?? '')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) =>
          /^\S+:(\d+|-)\s+(PALETTE|NEARMISS|NOTATION|GRADIENT|RADIUS|FONT|SHADOW|TYPEFLOOR|TINTFILL|INK)\s/.test(l),
        );
      if (lines.length === 0) {
        add(rel(dir), 'STYLE', `check-style exited ${run.status}`);
      }
      for (const line of lines) add(rel(dir), 'STYLE', line);
    }
  }
}

/* ---- 5. POINTER ---------------------------------------------------------- */

const pointerSources = [
  join(skill, 'SKILL.md'),
  join(skill, 'templates', 'README.md'),
  ...listFiles(join(skill, 'references'), ['.md']),
];

const PATH_IN_PROSE =
  /\b(?:scripts|assets|templates|references)\/[\w./-]*\.(?:mjs|css|md|png|vue|ts)\b/g;

for (const source of pointerSources) {
  if (!existsSync(source)) continue;
  const text = read(source);
  const seen = new Set();
  text.split('\n').forEach((line, index) => {
    const targets = [];
    for (const match of line.matchAll(/\]\((\.{1,2}\/[^)\s#]+)/g)) targets.push([match[1], dirname(source)]);
    for (const match of line.matchAll(PATH_IN_PROSE)) targets.push([match[0], skill]);
    for (const [target, base] of targets) {
      const full = resolve(base, target);
      /* A pointer often appears twice on one line, once as a markdown link and
         once as a bare path. It is one finding. */
      if (seen.has(full)) continue;
      seen.add(full);
      if (existsSync(full)) continue;
      add(`${rel(source)}:${index + 1}`, 'POINTER', `${target} does not exist`);
    }
  });
}

/* ---- 6. TWIN ------------------------------------------------------------- */

if (!twin) {
  /* No --twin, nothing to compare, and nothing to say about it. */
} else if (!existsSync(join(twin, 'SKILL.md'))) {
  add('two copies', 'TWIN', `${twin} carries no SKILL.md - not a copy of the skill`);
} else {
  /* -q: the file-level verdict, which is what "byte-identical" means here. The
     hunks belong in `diff -r` when a human goes to reconcile the two copies.
     Two classes are excluded because neither is skill content and neither must
     ever gate a commit as if it were a real divergence:
       - OS metadata (Finder's .DS_Store, Windows' Thumbs.db, AppleDouble ._*)
       - node_modules, which is installed into whichever copy someone ran the
         example deck from and is excluded by the sync itself, so one copy
         having it is the normal state rather than drift. */
  const NOT_CONTENT = ['.DS_Store', 'Thumbs.db', '._*', 'node_modules'];
  const excludeArgs = NOT_CONTENT.flatMap((pattern) => ['-x', pattern]);
  const diff = spawnSync('diff', ['-rq', ...excludeArgs, skill, twin], { encoding: 'utf8' });
  if (diff.error) {
    notes.push(`TWIN not checked: ${diff.error.message}`);
  } else if (diff.status !== 0) {
    const lines = (diff.stdout ?? '').split('\n').filter(Boolean);
    for (const line of lines.slice(0, 25)) add('two copies', 'TWIN', line);
    if (lines.length > 25) add('two copies', 'TWIN', `... and ${lines.length - 25} more`);
    if (lines.length === 0) add('two copies', 'TWIN', `diff exited ${diff.status}`);
  } else {
    notes.push(`TWIN identical: ${twin}`);
  }
}

/* ---- report -------------------------------------------------------------- */

if (!quiet) {
  process.stdout.write(`\nSkill doctor - ${rel(skill) === '.' ? skill : skill}\n`);
  process.stdout.write(`  ${cases.length} template case(s), ${definedTokens.size} token(s) defined\n\n`);
  for (const note of notes) process.stdout.write(`  note: ${note}\n`);
  if (notes.length > 0) process.stdout.write('\n');
}

if (findings.length === 0) {
  process.stdout.write('  clean - the skill holds together\n\n');
  process.exit(0);
}

const whereWidth = Math.max(8, ...findings.map((f) => String(f.where).length));
const checkWidth = Math.max(5, ...findings.map((f) => f.check.length));
process.stdout.write(`  ${'LOCATION'.padEnd(whereWidth)}  ${'CHECK'.padEnd(checkWidth)}  DETAIL\n`);
process.stdout.write(`  ${'-'.repeat(whereWidth + checkWidth + 40)}\n`);
for (const f of findings) {
  process.stdout.write(
    `  ${String(f.where).padEnd(whereWidth)}  ${f.check.padEnd(checkWidth)}  ${f.detail}\n`,
  );
}

const byCheck = findings.reduce((acc, f) => ((acc[f.check] = (acc[f.check] ?? 0) + 1), acc), {});
const summary = Object.entries(byCheck)
  .sort()
  .map(([check, count]) => `${check} ${count}`)
  .join(', ');
process.stdout.write(`\n  ${findings.length} finding(s): ${summary}\n\n`);
process.exit(1);
