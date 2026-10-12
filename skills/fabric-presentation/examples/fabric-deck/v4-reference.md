---
title: Template v4 reference
layout: fabric-cover
transition: none
mdc: true
fonts:
  provider: none
eyebrow: Presentation
subtitle: A short one-line subtitle or description of the deck.
author: Author Name · Month Year
defaults:
  layout: fabric
---

<!--
The eleven example slides of the designer's template v4 (ppt.constructor.rocks,
Constructor-Fabric-Extended-2026-v4.pptx, 9 October 2026), rebuilt with this
deck's own layouts and classes and the template's own words. It is the fixture
the style is checked against: render it beside the template's pages and the two
should match frame for frame. Run it with `pnpm exec slidev v4-reference.md`.
-->

# Presentation title goes here

---
layout: fabric-section
eyebrow: Section 01
summary: One sentence summarizing what this section covers.
---

# Section title

---

::header::

# Key points

::default::

<ul class="deck-frame deck-points" style="--x: 0; --y: 28.8; --w: 912">
  <li>First key point</li>
  <li>Second key point</li>
  <li>Third key point</li>
  <li>Fourth key point</li>
  <li>Fifth key point</li>
</ul>

---

::header::

# Full image title

---

::header::

# Half image title

::default::

<div class="deck-frame deck-frame_h deck-frame_middle deck-image-caption" style="--x: 606.4; --y: -9.6; --w: 577.6; --h: 486.7">
  <p>Add a caption or short description beside the image here.</p>
</div>

---

::header::

# Two text blocks

::default::

<div class="deck-cols deck-cols_2">
  <div class="fx-card"><div class="fx-kicker">Heading one</div><p class="deck-card-body">Add supporting details for this column here.</p></div>
  <div class="fx-card"><div class="fx-kicker">Heading two</div><p class="deck-card-body">Add supporting details for this column here.</p></div>
</div>

---

::header::

# Three text blocks

::default::

<div class="deck-cols deck-cols_3">
  <div class="fx-card"><div class="fx-kicker">Heading one</div><p class="deck-card-body">Add supporting details for this column here.</p></div>
  <div class="fx-card"><div class="fx-kicker">Heading two</div><p class="deck-card-body">Add supporting details for this column here.</p></div>
  <div class="fx-card"><div class="fx-kicker">Heading three</div><p class="deck-card-body">Add supporting details for this column here.</p></div>
</div>

---

::header::

# Table slide

::default::

<table class="fx-table">
  <thead><tr><th>Metric</th><th class="fx-num">Q1</th><th class="fx-num">Q2</th><th class="fx-num">Q3</th></tr></thead>
  <tbody>
    <tr><td>Active users</td><td class="fx-num">12,400</td><td class="fx-num">15,900</td><td class="fx-num">19,200</td></tr>
    <tr><td>Revenue</td><td class="fx-num">$210k</td><td class="fx-num">$268k</td><td class="fx-num">$331k</td></tr>
    <tr><td>Retention</td><td class="fx-num">92%</td><td class="fx-num">93%</td><td class="fx-num">95%</td></tr>
  </tbody>
</table>

---
layout: fabric-dark
---

<div class="deck-frame deck-closing-title" style="--x: 48; --y: 201.6; --w: 960">

# Thank you

</div>

---

::header::

# Colour hierarchy

::default::

<p class="deck-frame deck-heading" style="--x: 0; --y: -27.8; --w: 1152">Primary colours</p>

<table class="fx-table deck-guide-table deck-swatches" style="position: absolute; top: calc(26.8 * var(--fx-u))">
  <colgroup><col style="width: 22.8%"><col style="width: 16.05%"><col></colgroup>
  <tbody>
    <tr><td class="deck-swatch" style="background: var(--fx-blue)">Fabric blue</td><td style="background: var(--fx-tint-band)">#0065E3</td><td>Main brand accent, links and emphasis</td></tr>
    <tr><td class="deck-swatch" style="background: var(--fx-navy)">Navy</td><td style="background: var(--fx-navy-tint)">#00204D</td><td>Main dark colour, headings and backgrounds</td></tr>
  </tbody>
</table>

<p class="deck-frame deck-heading" style="--x: 0; --y: 209.2; --w: 1152">Secondary accents</p>

<table class="fx-table deck-guide-table deck-swatches deck-swatches_short" style="position: absolute; top: calc(262.8 * var(--fx-u))">
  <colgroup><col style="width: 22.8%"><col style="width: 16.05%"><col></colgroup>
  <tbody>
    <tr><td class="deck-swatch" style="background: var(--fx-teal)">Teal</td><td style="background: var(--fx-teal-tint)">#087582</td><td>Supporting emphasis and selected data series</td></tr>
    <tr><td class="deck-swatch" style="background: var(--fx-lilac)">Lilac</td><td style="background: var(--fx-lilac-tint)">#8545D6</td><td>Occasional secondary emphasis and categories</td></tr>
  </tbody>
</table>

<p class="deck-frame deck-guide-lead" style="--x: 0; --y: 400.2; --w: 1165">Green, amber and red are status colours only.</p>
<p class="deck-frame deck-guide-body" style="--x: 0; --y: 441.2; --w: 1165">Use them sparingly for tags and traffic lights, not large fills or general decoration.</p>

---

::header::

# Status colours - small signals only

::default::

<p class="deck-frame deck-guide-sub" style="--x: 0; --y: -37.8; --w: 1165">Reserve green, amber and red for status tags and traffic lights.</p>

<table class="fx-table deck-guide-table" style="position: absolute; top: calc(43.8 * var(--fx-u))">
  <colgroup><col style="width: 19%"><col style="width: 60.8%"><col></colgroup>
  <thead><tr><th>Status tag</th><th>Meaning</th><th>HEX</th></tr></thead>
  <tbody class="deck-guide-plain">
    <tr><td class="fx-status-cell_on-track">On track</td><td>Good, complete or healthy.</td><td>#15803D</td></tr>
    <tr><td class="fx-status-cell_at-risk">At risk</td><td>Attention or action needed.</td><td>#F4B544</td></tr>
    <tr><td class="fx-status-cell_blocked">Blocked</td><td>Failed, critical or unable to continue.</td><td>#C92E47</td></tr>
  </tbody>
</table>

<p class="deck-frame deck-heading" style="--x: 0; --y: 310.2; --w: 1165">Keep these colours visually minor.</p>
<div class="deck-frame deck-guide-body" style="--x: 0; --y: 363.2; --w: 1165"><p>Use small dots, tags or compact indicators with a clear status label.</p><p>Avoid large backgrounds, headings or decorative charts in status colours.</p></div>
<p class="deck-frame deck-guide-body" style="--x: 0; --y: 447.2; --w: 1165">Blue and navy remain dominant. Teal and lilac provide supporting accents.</p>
