---
title: Constructor Fabric
layout: fabric-cover
transition: none
mdc: true
fonts:
  provider: none
eyebrow: Product overview
subtitle: An ecosystem for assembling frontend products from tested, versioned templates
author: Month Year
defaults:
  layout: fabric
---

# Constructor Fabric

<!--
Claim: what this deck is and who is behind it. A cover asserts nothing else.

What to say: why this room is in it, and what they will be able to decide by the end.

Not on the slide (answer if asked): every figure in this deck is a placeholder - the mechanics are real, the numbers are not measurements anyone took.
-->

---
ground: tint
---

::header::

# Five things to settle today

::default::

<AgendaRows />

---

::header::

# Every team writes the same project again

::default::

<ul class="deck-frame deck-points" style="--x: 0; --y: 28.8; --w: 912">
  <li>A shell with a menu, routing and themes, written from nothing</li>
  <li>A build per project, configured by hand and drifting</li>
  <li>Screens that cannot move between projects</li>
  <li>Upgrades that arrive as migrations, not as diffs</li>
  <li>A month gone before the first screen a user asked for</li>
</ul>

<!--
Claim: the cost is not one project - it is the same project paid for again by every team.

What to say: ask the room which of the five they wrote last quarter.
-->

---

::header::

# Materialization over generation

::default::

<ContrastPair />

<!--
Claim: a project materialized from tested templates can be re-derived; one generated from scratch cannot.

What to say: where each column's cost actually lands - the generated side pays again at every upgrade, and most rooms have an example of it.

Not on the slide (answer if asked): what materialization costs when a template turns out to be the wrong one, and how a team gets off it. Both columns' figures are placeholders, and the two labels say which run each set was measured on.
-->

---

::header::

# From libraries to a project

::default::

<PlatformFlow />

<!--
Claim: four layers, and the project is the only one a team writes into.

What to say: everything a team used to write by hand now sits in the two layers in the middle.
-->

---
layout: fabric-section
eyebrow: Section 01
summary: What a project gets on the first day, and the template inventory it comes from.
---

# What it buys

---

::header::

# What a new project starts with

::default::

<BigStats />

---

::header::

# The template inventory

::default::

<ReleaseTables />

---

::header::

# The console as it arrives

::default::

<ImageHalf />

---
layout: fabric-section
eyebrow: Section 02
summary: One prompt, one plan, one set of commands, and what the assembled project is made of.
---

# How it assembles

---

::header::

# Seven commands

::default::

<CommandList />

---

::header::

# A build from a single prompt

::default::

<PromptFlow />

---

::header::

# Runtime: shell and screens

::default::

<figure class="deck-box deck-figure" style="--x: 0; --y: -19.2; --w: 1184; --h: 505.9">
<img src="/runtime-diagram.svg" alt="Runtime diagram: a screen's declaration, the schema check before runtime, and the shell with its domains and menu" />
</figure>

---

::header::

# A narrow typed contract

::default::

<figure class="deck-box deck-figure" style="--x: 0; --y: -19.2; --w: 1184; --h: 505.9">
<img src="/bridge-diagram.svg" alt="Exchange diagram: shell, bridge and screen, with six numbered messages in two phases" />
</figure>

---
layout: fabric-section
eyebrow: Section 03
summary: The rollout quarter by quarter, the decision it needs, and who carries it.
---

# What comes next

---

::header::

# What lands, and in what order

::default::

<Timeline />

<!--
Claim: each quarter closes one reason a project gets written from nothing again.

Not on the slide (answer if asked): the quarter labels are placeholders.
-->

---

::header::

# Two of five workstreams need a decision

::default::

<StatusBoard />

<!--
Claim: the plan is mostly on track, and the two rows that are not each wait on one named decision.

What to say: green, amber and red are the template's status colours (v4) and stay small - the status cell and its word, never a row or a heading. Walk the at-risk and blocked rows; the on-track ones need no narration.
-->

---

::header::

# Two ways to start

::default::

<OptionCompare />

<!--
Claim: both starts are reversible. What is not reversible is starting on both at once with the same people.
-->

---

::header::

# The team behind the platform

::default::

<TeamGrid />

---

::header::

# Four consequences of one decision

::default::

<OutcomeCards />

<!--
Claim: all four follow from one decision - materialize a tested template instead of generating the same project again.
-->

---
layout: fabric-dark
---

<QuoteBlock />

---
layout: fabric-dark
---

<div class="deck-frame deck-closing-title" style="--x: 48; --y: 201.6; --w: 960">

# Thank you

</div>

<div class="deck-frame deck-closing-contacts" style="--x: 48; --y: 360; --w: 768">
  <p>Placeholder Name</p>
  <p>email@company.com</p>
  <p>constructor.tech</p>
</div>

<!--
Claim: none the deck has not already made.

What to say: which step this room is being asked to take first, and who to talk to about it: install the CLI, register the shell and the screen template, give the agent one prompt, open the browser.
-->
