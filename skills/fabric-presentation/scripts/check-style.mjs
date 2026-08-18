#!/usr/bin/env node
/*
 * check-style.mjs - style-conformance linter for Constructor Fabric decks.
 *
 * Usage:  node scripts/check-style.mjs <deck-dir> [--quiet]
 *
 * Scans .css/.vue/.html/.md sources under <deck-dir> (node_modules, .git, dist,
 * .slidev and public/ are skipped) and reports:
 *
 *   PALETTE    a hex outside the closed palette of references/fabric-style.md,
 *              and any warm hex with the reason spelled out
 *   NEARMISS   an off-palette hex close enough to a scheme blue to be a typo
 *   NOTATION   a colour written as rgb()/hsl()/oklch()/color-mix() - notations
 *              this checker cannot read as a palette member
 *   GRADIENT   a gradient outside the dark ground and the ribbon illustration
 *   RADIUS     a square corner, or a radius not built from the token ladder
 *   SHADOW     a box-shadow, text-shadow or drop-shadow filter
 *   FONT       a serif or slab family, Arial as the primary face, or the mono
 *              face outside terminal/code content
 *   TYPEFLOOR  a literal font-size below the 11px screen floor
 *   TINTFILL   a tint fill stacked on a tint ground with no white flip
 *   INK        black ink on text - Fabric's ink is navy-family
 *
 * The rule set follows references/fabric-style.md, whose §1 is the
 * whole of it in one line: Fabric is a MONOCHROME BLUE system. There is no red,
 * no yellow, no green and no warm hue in either donor file, so status on a
 * slide is carried by words, weight and position - never by hue. Nothing here
 * demands a saturated fill anywhere in a deck, and nothing polices text on a
 * warm ground: in this system there is no such ground to set text on, and a
 * deck with no saturated fill anywhere is exactly right.
 *
 * The closed palette itself is not written here: it is derived at startup from
 * assets/fabric-tokens.css, the single source of truth for colour values.
 *
 * The rules that carry a Fabric-specific decision, and the evidence for each:
 *
 *  - PALETTE: the closed palette is the set of hexes fabric-tokens.css defines
 *    (spec §1 records where each was observed). A hex outside it is a finding; a WARM one - red, orange,
 *    yellow or green family - is a finding whose message names the reason,
 *    because a warm hue is the one thing a writer reaches for out of habit and
 *    the one thing this system never has.
 *  - RADIUS: every container in both donors is a roundRect (law §3.3), so the
 *    finding runs the opposite way from most checkers: `border-radius: 0`
 *    is the violation. A radius must come from the token ladder (--fx-radius,
 *    --fx-radius-lg, --fx-radius-pill), or be 50% for a circle or 999px for a
 *    pill. The one other token accepted is --fx-rule-accent, which caps the
 *    2pt accent rule of the closing slide (exm-15) into a lozenge.
 *  - GRADIENT: legal in exactly two places (law §1.1, §3.4) - the dark ground
 *    and the ribbon illustration. So a gradient clears the check when it comes
 *    through var(--fx-grad-ground) / var(--fx-grad-glow), when the line DEFINES
 *    one of those tokens, or when the line carries the marker comment
 *    fx-illustration. Any other gradient is a finding.
 *  - FONT: one grotesque family (law §2). Geist Mono is legal only where the
 *    slide shows literal code, so a mono family clears the check on a line
 *    carrying the marker comment fx-terminal or fx-code, or inside a rule whose
 *    selector names terminal or code content.
 *  - TINTFILL: grounds and fills alternate - on a #F2F6FC ground the cards flip
 *    white with the same hairline (law §1.3, exm-11). Whether a given fill sits
 *    on a tint ground is not perfectly greppable, so the check takes a
 *    marker-based shape: a file that sets the tint as a
 *    slide ground must also carry the flip (a `_on-tint` rule, or the marker
 *    fx-card_on-tint). Where it does not, every tint card fill in it is
 *    reported.
 *  - NOTATION: every rule above reads HEXES. A colour written as rgb(), hsl(),
 *    oklch() or color-mix() slips past all of them - it is neither on-palette
 *    nor off-palette to a checker that cannot resolve it - so an off-scheme
 *    colour ships while the run stays green. Two forms are legal and are not
 *    reported: a pure white or black alpha veil, which is how the system draws
 *    a hairline on a dark ground (law §3.3), and a scheme colour written in
 *    decimal channels, which is what the glow token does.
 *  - INK: Fabric's ink is #243143 / #0E1A2C, never black (law §1.4).
 *
 * TYPEFLOOR is unchanged: the donors' floor is 10pt = 13.3px, and screen type
 * never goes below a whole 11px, so a literal px size under that is a finding.
 * Only resolvable literals are judged - a size coming from a var() is left
 * alone, the way an unresolvable radius is.
 *
 * Scoping: pointed at a deck directory it walks the whole deck. Pointed at the
 * SKILL directory (the one holding SKILL.md) it walks templates/ and assets/
 * only, and says so. That is not a convenience: the law's own anti-pattern
 * table quotes off-palette hexes with a '#', and a grep-grade checker cannot
 * tell documentation from a declaration.
 *
 * Exit code: 0 clean, 1 violations found, 2 bad invocation.
 *
 * This is deliberately a grep-grade tool, not a CSS parser: it reads lines and
 * says what it sees, with the file and line so a human can judge.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/* The closed palette is READ, not restated: assets/fabric-tokens.css is the
 * single source of truth for every colour value in the system, and this
 * checker derives the legal set from the hexes that file defines. Adding a
 * colour to the system is one edit there; this file never needs to follow. */
const here = dirname(fileURLToPath(import.meta.url));
const TOKENS_FILE = join(here, '..', 'assets', 'fabric-tokens.css');

const loadPalette = () => {
  if (!existsSync(TOKENS_FILE)) {
    process.stderr.write(
      `check-style: cannot read the palette - ${TOKENS_FILE} is missing.\n` +
        '  assets/fabric-tokens.css is the single source of truth for colours;\n' +
        '  without it there is no legal set to check against.\n',
    );
    process.exit(2);
  }
  const out = new Set();
  for (const m of readFileSync(TOKENS_FILE, 'utf8').matchAll(/#([0-9a-fA-F]{3,6})\b/g)) {
    let hex = m[1].toLowerCase();
    if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
    if (hex.length === 6) out.add(hex);
  }
  if (out.size === 0) {
    process.stderr.write(`check-style: no hex values found in ${TOKENS_FILE} - refusing to run with an empty palette.\n`);
    process.exit(2);
  }
  return out;
};

const PALETTE = loadPalette();

const EXTENSIONS = new Set(['.css', '.vue', '.html', '.md']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.slidev', 'public', '.cache']);

const RE_HEX = /(^|[^\w&#])#([0-9a-fA-F]{3,8})\b/g;
const RE_GRADIENT = /\b(linear|radial|conic|repeating-linear|repeating-radial)-gradient\s*\(/gi;
const RE_RADIUS = /border(?:-[a-z]+){0,2}-radius\s*:\s*([^;}\n]+)/gi;
const RE_FONT = /font-family\s*:\s*([^;}\n]+)/gi;
const RE_SHADOW = /\b(box|text)-shadow\s*:\s*([^;}\n]+)/gi;
const RE_DROP_SHADOW = /\bfilter\s*:\s*([^;}\n]*drop-shadow[^;}\n]*)/gi;
const RE_FONT_SIZE = /font-size\s*:\s*([^;}\n]+)/gi;
const RE_BACKGROUND = /\bbackground(?:-color|-image)?\s*:\s*([^;}\n]+)/gi;
const RE_COLOR = /(?:^|[^-\w])color\s*:\s*([^;}\n]+)/gi;

/* The markers a line can carry to say which legal case it is in. */
const MARKER_ILLUSTRATION = 'fx-illustration';
const MARKER_MONO = /fx-terminal|fx-code/;
const MARKER_FLIP = /_on-tint|fx-card_on-tint/;

/* A gradient is legal through these, and through a line that defines them. */
const GRADIENT_LEGAL = /var\(\s*--fx-grad-(?:ground|glow)\s*\)|--fx-grad-[\w-]*\s*:/;

/* A radius must come from the ladder, or be a circle or a pill. */
const RADIUS_TOKEN = /--fx-radius|--fx-rule-accent/;

/* The tint values, by hex and by every token that carries one. */
const TINTS = ['f2f6fc', 'e6effa', '--fx-tint', '--fx-surface-tint', '--fx-tint-band'];

/* Where a tint fill is a GROUND rather than a card, read off the selector. */
const GROUND_SELECTOR = /slide|ground|page|cover|section|body|:root|html/i;
const CARD_SELECTOR = /card|tile|panel|band|cell|chip|step|row|table/i;

/* Colour notations this checker cannot read as a palette member. */
const RE_NOTATION = /\b(rgba?|hsla?|oklch|color-mix)\s*\(/gi;
/* The three channels of an rgb()/rgba(), in either the comma or the space
   syntax, so a veil and a scheme colour can be told from an invented one. */
const RE_RGB_CHANNELS = /^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})/i;

/* Ink that is not Fabric ink. #000 in any form, and the keyword. */
const BLACK_INK = /#000\b|#000000\b|#0a0a0a\b|\bblack\b/i;
const BLACK_HEXES = new Set(['000000', '0a0a0a']);

/* Families that are not the one grotesque, and the mono face that is legal
 * only over literal code. */
const SERIF_FAMILY = /\b(serif|georgia|times|garamond|slab|cambria|palatino|baskerville)\b/i;
const MONO_FAMILY = /\b(mono|menlo|consolas|courier|monaco)\b/i;

/* The donors' floor is 10pt = 13.3px; on screen it rounds up to a whole 11. */
const TYPE_FLOOR_PX = 11;

const NEARMISS_MAX = 90;
const SCHEME = Object.fromEntries(
  [...PALETTE].map((hex) => [
    `#${hex}`,
    [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)],
  ]),
);

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const root = args.find((a) => !a.startsWith('--'));

if (!root) {
  process.stderr.write('usage: node check-style.mjs <deck-dir> [--quiet]\n');
  process.exit(2);
}

let rootStat;
try {
  rootStat = statSync(root);
} catch {
  process.stderr.write(`check-style: no such directory: ${root}\n`);
  process.exit(2);
}
if (!rootStat.isDirectory()) {
  process.stderr.write(`check-style: not a directory: ${root}\n`);
  process.exit(2);
}

const files = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full);
    } else if (EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf('.')))) {
      files.push(full);
    }
  }
};

/* Pointed at the skill itself, the checker judges the material the skill ships
 * and not the prose that documents it. Everywhere else it walks what it is
 * given. */
const isSkillRoot = (() => {
  try {
    return statSync(join(root, 'SKILL.md')).isFile();
  } catch {
    return false;
  }
})();

const scoped = [];
if (isSkillRoot) {
  for (const dir of ['templates', 'assets']) {
    const full = join(root, dir);
    try {
      if (statSync(full).isDirectory()) {
        scoped.push(dir);
        walk(full);
      }
    } catch {
      /* the skill does not ship that directory */
    }
  }
} else {
  walk(root);
}
files.sort();

const findings = [];
const add = (file, line, rule, detail) =>
  findings.push({ file: relative(root, file).split(sep).join('/'), line, rule, detail });

const normaliseHex = (raw) => {
  const hex = raw.toLowerCase();
  if (hex.length === 3) return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length === 4) return hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length === 8) return hex.slice(0, 6); // alpha is not a colour choice
  if (hex.length === 6) return hex;
  return null; // 5 or 7 digits: not a colour
};

const rgb = (norm) => [
  parseInt(norm.slice(0, 2), 16),
  parseInt(norm.slice(2, 4), 16),
  parseInt(norm.slice(4, 6), 16),
];

/* Warm means the hex leans red/orange/yellow (red over blue) or green (green
 * over both). A monochrome blue system has none of them, and a writer coming
 * from a status palette reaches for one first. */
const isWarm = (norm) => {
  const [r, g, b] = rgb(norm);
  return r - b >= 24 || (g - r >= 24 && g - b >= 24);
};

/* The nearest palette colour to an off-palette hex, or null when nothing is
 * close. Plain sRGB euclidean distance: crude, and enough to tell a typo from a
 * colour somebody meant. */
const nearestScheme = (norm) => {
  const [r, g, b] = rgb(norm);
  let best = null;
  let bestD = Infinity;
  for (const [hex, [sr, sg, sb]] of Object.entries(SCHEME)) {
    const d = Math.sqrt((r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2);
    if (d < bestD) {
      bestD = d;
      best = hex;
    }
  }
  return bestD <= NEARMISS_MAX ? { hex: best, distance: Math.round(bestD) } : null;
};

for (const file of files) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  const lines = text.split('\n');

  /* Both TINTFILL halves need to know which rule a line is in, so the loop
     tracks the selector it last opened. A selector spread over several lines is
     accumulated; a grep-grade tool does not need more than that. */
  let selector = '';
  let buffer = '';

  /* TINTFILL is a property of the FILE: a tint ground somewhere, tint cards
     elsewhere, and no flip between them. Collected here, judged below. */
  const tintFills = [];
  let tintGround = false;
  const hasFlip = MARKER_FLIP.test(text);

  lines.forEach((line, index) => {
    const lineNo = index + 1;

    if (line.includes('{')) {
      selector = `${buffer} ${line.slice(0, line.indexOf('{'))}`.trim();
      buffer = '';
    } else if (line.includes('}')) {
      buffer = '';
    } else if (/,\s*$/.test(line) && !/^\s*[/*]/.test(line)) {
      /* A selector list spread over several lines: each line but the last ends
         in a comma. Anything else - prose, a comment, a declaration - is not
         part of a selector and must not pollute the buffer. */
      buffer = `${buffer} ${line}`.trim();
    }

    // (a) black ink on text - reported before the palette, so the message is
    //     the useful one rather than "off-palette"
    const inkHexes = new Set();
    RE_COLOR.lastIndex = 0;
    let hit;
    while ((hit = RE_COLOR.exec(line)) !== null) {
      const value = hit[1];
      if (!BLACK_INK.test(value)) continue;
      for (const black of value.matchAll(RE_HEX)) {
        const norm = normaliseHex(black[2]);
        if (norm) inkHexes.add(norm);
      }
      add(file, lineNo, 'INK', `${value.trim()} - Fabric ink is #243143 / #0E1A2C, never black`);
    }

    // (b) palette, and the near-miss version of the same finding
    RE_HEX.lastIndex = 0;
    while ((hit = RE_HEX.exec(line)) !== null) {
      const norm = normaliseHex(hit[2]);
      if (!norm) continue;
      if (PALETTE.has(norm)) continue;
      if (BLACK_HEXES.has(norm) && inkHexes.has(norm)) continue; // INK said it better
      if (isWarm(norm)) {
        add(
          file,
          lineNo,
          'PALETTE',
          `#${hit[2]} - Fabric is monochrome blue: no red, yellow or green anywhere. Status is words, weight and position`,
        );
        continue;
      }
      const near = nearestScheme(norm);
      if (near) {
        add(file, lineNo, 'NEARMISS', `#${hit[2]} is ${near.distance} off ${near.hex} - use the token`);
      } else {
        add(file, lineNo, 'PALETTE', `#${hit[2]} (off-palette)`);
      }
    }

    // (b2) colours the checker cannot read: rgb(), hsl(), oklch(), color-mix()
    RE_NOTATION.lastIndex = 0;
    while ((hit = RE_NOTATION.exec(line)) !== null) {
      const notation = hit[1].toLowerCase();
      const channels = RE_RGB_CHANNELS.exec(line.slice(hit.index));
      if (channels) {
        const [r, g, b] = channels.slice(1).map(Number);
        // a pure white or black alpha veil - the hairline on a dark ground
        if ((r === 255 && g === 255 && b === 255) || (r === 0 && g === 0 && b === 0)) continue;
        // a scheme colour written in decimal channels
        const asHex = [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
        if (PALETTE.has(asHex)) continue;
      }
      add(
        file,
        lineNo,
        'NOTATION',
        `${notation}( - write colours as the scheme hexes or the --fx tokens so the checker can read them`,
      );
    }

    // (c) gradients - the dark ground and the ribbon illustration, nothing else
    RE_GRADIENT.lastIndex = 0;
    while ((hit = RE_GRADIENT.exec(line)) !== null) {
      if (GRADIENT_LEGAL.test(line) || line.includes(MARKER_ILLUSTRATION)) continue;
      add(
        file,
        lineNo,
        'GRADIENT',
        `${hit[1]}-gradient( - only var(--fx-grad-ground)/(--fx-grad-glow) or a ${MARKER_ILLUSTRATION} rule`,
      );
    }

    // (d) corner radius - Fabric is rounded, and the radius comes from a token
    RE_RADIUS.lastIndex = 0;
    while ((hit = RE_RADIUS.exec(line)) !== null) {
      const raw = hit[1].trim().replace(/\s*\/\*.*$/, '').trim();
      if (RADIUS_TOKEN.test(raw)) continue;
      if (/^(50%|999px|var\(--fx-radius-pill\))$/.test(raw)) continue;
      if (/^0(px|rem|em|pt|%)?$/.test(raw)) {
        add(file, lineNo, 'RADIUS', `${raw} - Fabric containers are rounded, not square`);
        continue;
      }
      add(
        file,
        lineNo,
        'RADIUS',
        `${raw} - build it from --fx-radius / --fx-radius-lg / --fx-radius-pill (or 50% for a circle)`,
      );
    }

    // (e) fonts - one grotesque, and mono only over literal code
    RE_FONT.lastIndex = 0;
    while ((hit = RE_FONT.exec(line)) !== null) {
      const value = hit[1].trim();
      const withoutSans = value.replace(/sans-serif/gi, '');
      if (SERIF_FAMILY.test(withoutSans)) {
        add(file, lineNo, 'FONT', `${value} - the system is one grotesque, no serif and no slab`);
      }
      if (MONO_FAMILY.test(value) && !MARKER_MONO.test(line) && !MARKER_MONO.test(selector) && !/terminal|code/i.test(selector)) {
        add(
          file,
          lineNo,
          'FONT',
          `${value} - mono is for literal code only; mark the line fx-terminal or fx-code`,
        );
      }
      const first = value.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      if (/^arial$/i.test(first)) {
        add(file, lineNo, 'FONT', 'Arial as the primary text face - the family is Geist, Arial is the fallback');
      }
    }

    // (f) shadows - nothing in the system casts one
    RE_SHADOW.lastIndex = 0;
    while ((hit = RE_SHADOW.exec(line)) !== null) {
      const value = hit[2].trim().replace(/\s*\/\*.*$/, '').trim();
      if (/^none$/i.test(value)) continue;
      add(file, lineNo, 'SHADOW', `${hit[1]}-shadow - the system has none`);
    }
    RE_DROP_SHADOW.lastIndex = 0;
    while ((hit = RE_DROP_SHADOW.exec(line)) !== null) {
      add(file, lineNo, 'SHADOW', 'filter: drop-shadow - the system has none');
    }

    // (g) tint fills, collected for the per-file judgement below
    RE_BACKGROUND.lastIndex = 0;
    while ((hit = RE_BACKGROUND.exec(line)) !== null) {
      const value = hit[1].toLowerCase();
      if (!TINTS.some((needle) => value.includes(needle))) continue;
      if (GROUND_SELECTOR.test(selector)) tintGround = true;
      else if (CARD_SELECTOR.test(selector)) tintFills.push({ lineNo, selector });
    }

    // (h) type floor
    RE_FONT_SIZE.lastIndex = 0;
    while ((hit = RE_FONT_SIZE.exec(line)) !== null) {
      const token = hit[1].trim().replace(/\s*\/\*.*$/, '').trim();
      const m = /^(-?[\d.]+)(px|rem|em|pt)$/.exec(token);
      if (!m) continue; // var(), calc(), keywords and %: not judged here
      const value = Number(m[1]);
      const px = m[2] === 'px' ? value : m[2] === 'pt' ? value * (96 / 72) : value * 16;
      if (px < TYPE_FLOOR_PX) {
        add(file, lineNo, 'TYPEFLOOR', `${token} - below the ${TYPE_FLOOR_PX}px floor`);
      }
    }
  });

  /* (i) tint on tint. The file sets the tint as a ground somewhere and fills a
     card with the same tint elsewhere, and nothing in it flips those cards to
     white - which is the one thing the law says must happen (exm-11). */
  if (tintGround && !hasFlip) {
    for (const fill of tintFills) {
      add(
        file,
        fill.lineNo,
        'TINTFILL',
        `${fill.selector} - tint fill on a tint ground; flip it white with an _on-tint rule`,
      );
    }
  }
}

if (!quiet) {
  const scope = isSkillRoot ? ` (${scoped.join(' + ') || 'nothing to scan'})` : '';
  process.stdout.write(
    `\nConstructor Fabric style check - ${files.length} file(s) under ${root}${scope}\n\n`,
  );
}

if (findings.length === 0) {
  process.stdout.write('  clean - no violations\n\n');
  process.exit(0);
}

const width = (key, min) => Math.max(min, ...findings.map((f) => String(f[key]).length));
const locWidth = Math.max(8, ...findings.map((f) => `${f.file}:${f.line}`.length));
const ruleWidth = width('rule', 4);

const header = `  ${'LOCATION'.padEnd(locWidth)}  ${'RULE'.padEnd(ruleWidth)}  DETAIL`;
process.stdout.write(`${header}\n  ${'-'.repeat(locWidth + ruleWidth + 40)}\n`);
for (const f of findings) {
  process.stdout.write(
    `  ${`${f.file}:${f.line}`.padEnd(locWidth)}  ${f.rule.padEnd(ruleWidth)}  ${f.detail}\n`,
  );
}

const byRule = findings.reduce((acc, f) => ((acc[f.rule] = (acc[f.rule] ?? 0) + 1), acc), {});
const summary = Object.entries(byRule)
  .sort()
  .map(([rule, count]) => `${rule} ${count}`)
  .join(', ');
process.stdout.write(`\n  ${findings.length} violation(s): ${summary}\n\n`);
process.exit(1);
