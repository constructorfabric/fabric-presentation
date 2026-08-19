---
name: fabric-presentation
description: "Builds Constructor Fabric slide decks in Slidev. Use whenever the user mentions a presentation, slides, a deck, a pitch, or a talk - making one, reviewing or restyling an existing one, or exporting it. Carries the Fabric style (monochrome-blue palette, tokens, composition rules), a style checker, a deck scaffolder, worked slide templates, a runnable example deck, and export to PDF or a single self-contained HTML file."
compatibility: Requires Node 18+ and network access to install the deck's npm dependencies
metadata:
  version: "0.1.0"
---

# Fabric Presentation

Each slide makes one claim. The visual exists to make that claim land faster than a sentence would.

## Start here

Two routes to a deck, both giving a runnable Slidev project:

- **Copy the example** (the default). `cp -r examples/fabric-deck/ <target-dir>` - a complete deck where every slide is a different composition; delete what the deck does not need.
- **Scaffold the minimum.** `node scripts/new-deck.mjs <target-dir> --cases category-cards,quarter-table` - a cover, one content slide and the cases you name. `--list` prints the cases. Take this route only when the deck wants the minimum rather than the menu.

The `node scripts/...` commands here and in the references run from the skill directory; from anywhere else, give the path to your installed copy of the skill.

## Settle first

For a new deck, these questions open the **brief** - [references/deck-brief.md](./references/deck-brief.md) carries the whole intake: what to ask (one question per message, only what the request has not already answered - through the Superpowers `brainstorming` skill where it is installed), the `brief.md` that lands beside `slides.md`, and the gate: a one-sentence-per-slide claims outline the user approves **before any slide is drawn**.

- **The export format, and whether it animates.** A static export cannot reveal or build. Check how the tool exports click-steps before designing one - if it splits them into separate pages, a reveal silently becomes extra slides. When static, draw both states in place instead.
- **Whether you are there when it is read.** A filed deck is read later with no narration, so anything load-bearing you would have *said* has to be *on* the slide. Check whether the export carries speaker notes - many formats do, and that gives what you would say a home that travels with the file. It travels to everyone who opens it, including people who were not in the room: a note is not private. Nothing goes in one that you would only say aloud - and nothing whose disclosure is itself a cost, since naming a weakness and where it lives is a disclosure, not a caveat.
- **What the first content slide is for.** It is either the agenda, or the whole story in miniature so the deck survives time being cut. Settle which with the presenter - a story-carrying first slide buys insurance against a short session, and pays for it by obliging them to tell everything before the first real slide.

## Per slide

- Write the claim as a sentence before choosing a visual. Two sentences means two slides.
- **Title states the claim** - not the topic, not the layout, and short enough to hold one line.
- **The title must not contradict anything on its own slide.** Check it against every number beside it.
- **A number beside a claim must measure the thing the claim is about.** A true count of a neighbouring set reads as proof of the title, so a slide of verified facts still misleads.
- **Every label holds one line; a label on a mark inside the picture holds three to five words.** Longer ones are not read, and the labels a viewer scans rather than reads are the ones inside the picture - a panel's heading or a status line may carry a clause. Cutting them costs no accuracy once the accuracy moves into channels that cannot equivocate - a signed number for direction and size, a category mark for kind, words only for what neither can carry, and the full attribution in the speaker notes.
- **Name what the eye hits first** - largest, brightest, longest. If that is not the takeaway, redesign.
- Skip what the audience already holds. Show the delta.

## Choosing the form

Pick by what the claim is about, not by what is quick to draw:

| Form | Claim about |
|---|---|
| Scheme | where things flow |
| Sequence / dependency | what waits on what |
| Count | a number moving |
| Grid | coverage |
| Set | what was chosen, its markings showing the rule |
| Real capture | that the thing genuinely behaves as described |

Where the form is a drawn scheme, [references/fabric-diagrams.md](./references/fabric-diagrams.md) carries the method: Excalidraw-authored SVG, the diagram roles mapped onto the law's palette, the render-view-fix loop, and the embedding rules that keep labels legible over lines.

### Meanings you did not choose

- **Horizontal extent reads as elapsed time**, axis or no axis. A bar widened for emphasis reads as "this got slower."
- **A connected line asserts continuity** between its points. Discrete readings need separate columns, with what happened labelled in each gap.
- **A clean solid diagram reads as "this is how it works today."**
- **Alignment is a claim.** A connector that stops short of its target says "points at" where it meant "meets". A mark stretched to fill its slot marks the slot, not the thing.
- **Position assigns ownership.** A caption between two data points is read as belonging to one of them.
- **Size driven by text asserts a quantity.** An element sized by its own label must not sit in a coordinate system where size means an amount - it will state a number nobody chose.

Where the form's own default meaning cuts against the claim, guard it explicitly: sizes schematic rather than proportional, the axis labelled for what it means, the strongest accent on the element carrying the point. Where the meaning comes instead from how the thing is drawn, no guard helps - an edge that lands in the wrong place has to be moved.

## Composition

Both rules below are invisible in the markup and appear only in a render.

- **One structure per slide.** The slide sits on one underlying structure, and every element's edges land on it: elements share edges, centres and gutters, a source spans the set it feeds, two connectors of the same kind terminate the same way, a grouping mark shares an edge with what it groups. Where edges do not line up, the picture reads as objects placed near each other rather than as one composition. Consistent gaps are not structure - separation and alignment are separate problems, and a slide can pass the first while failing the second.
- **Same kind, same pattern.** The same kind of thing gets the same visual treatment, and a difference in size, weight or shape must mean a difference in kind. A legend sample is drawn exactly as the mark it explains.

Three habits keep the structure real:

- **Alignment by construction, not coincidence.** One structure the whole picture shares. Two that merely agree today are a defect waiting for a wording change - panels pairing up only because one label happens to be taller than another will break the moment that label is edited. Where the structure is a CSS grid, [references/slidev.md](./references/slidev.md) has the placements that make a centre line a real line.
- **One job per element.** Two independent markings on one dense element compete, and the viewer decodes a legend before reading anything.
- **Each element earns its own place.** A connector drawn by stretching a node until it reaches its target couples "does this block look filled" to "does this connector have an origin", and the two then fight - give the connector its own element.

Where several junctions look wrong independently, suspect one shared boundary carrying one wrong value; find the common cause before nudging elements.

## Fabric style

A deck presented as Constructor Fabric's own is not styled to taste. [references/fabric-style.md](./references/fabric-style.md) is the law it follows, and every rule in it is tied to a page of a **rendering** of the official Fabric template and its example deck: a closed **monochrome blue** palette in which each colour has one job - the navy (`--fx-navy`) for titles and structure, the body ink (`--fx-ink`), the light-ground accent (`--fx-blue`: kickers, the big stat, links), the dark-ground accent (`--fx-blue-sky`: eyebrows, quote attributions), the tints (`--fx-tint`, `--fx-tint-band`) for cards and bands, and the hairline (`--fx-line`). **There is no red, no yellow, no green - no status colour at all**: status on a Fabric slide is carried by words, weight and position, and one warm pixel reads as another company's deck. Corners are ROUNDED, the dark slides (cover, sections, quote, closing) sit on the navy gradient ground - the only legal gradient besides the ribbon illustration - and every page closes with the plain-text wordmark "Constructor Fabric" and a page number over a hairline rule; there is no logo image and no mark of any kind - the web's four-square BrandMark is not part of the deck system and goes on no slide. Build from the tokens rather than restating them. [assets/fabric-tokens.css](./assets/fabric-tokens.css) is the **single source of truth for every colour value** - the one file where a hex is defined; everything else, this file included, names colours by token and role. It also carries the type ladder and the zone geometry as custom properties. [references/fabric-style-spec.md](./references/fabric-style-spec.md) is the OOXML derivation behind the law (theme slots, layout inventory, placeholder geometry), and [assets/reference/](./assets/reference/) holds the donors' dark-ground jpeg. For the Slidev deck family built from this skill, [references/fabric-slidev-decks.md](./references/fabric-slidev-decks.md) carries what those decks share: the slide pattern, the footer, and the traps in running the dev server. Where a slide is one of the shapes already worked out, start from its case in [templates/README.md](./templates/README.md) rather than from an empty component, and where a whole deck is wanted, [examples/fabric-deck/](./examples/fabric-deck/) is a runnable one whose every slide demonstrates a different composition on placeholder content - the fastest thing to copy and the quickest way to see what the system can draw.

## Honesty

The failure mode is a true slide leaving a false impression.

- **Every slide claiming status carries one status signal.** Silence reads as finished.
- **One signal, not a ledger.** The fix for an overclaim is a truer shape, not a list of exceptions. A caveat is never free: it spends the slide's most valuable line and plants the very reading it denies. Changing the form's axis beats guarding it with prose - a chain read as a speed claim when it runs horizontally stops making that claim when it runs down the slide.
- **Prose is where an overclaim hides**, because a sentence has to name one mechanism and will name the flattering one. Where the sources say a figure has mixed causes, a label naming a single cause claims more than they support. Let the signed number and the category mark carry what they can, and leave the mechanism to the notes.
- **Enforcement claims and inventory claims are different.** "This cannot ship" rests on a control; "we have none" is a count anything can falsify. Prefer the defensible one.
- **No metric you cannot defend** - and no layout shaped like a chart whose obvious question you cannot answer.
- **One vantage point is not a general claim.** Measured in one place, on one machine, in one configuration: that is an answer to a question, not a headline.
- **Exhaustive beats illustrative for a small set.** Three of eight invites "what are the other five?" The whole short set *is* the rule.

**When something is nearly true** - merged but not deployed, built but not switched on - state the stronger version *only* where a mechanism already in motion closes the gap. Not where it needs a decision, an approval, or unstarted work. That exclusion is the safeguard; without it the rule becomes "present intentions as achievements." Say plainly which claims rest on it.

## Off the slide

- Below the audience's level: ticket IDs, paths, internal tool names, process detail. Say it aloud if it matters.
- Placeholders. A "TBD" beside real outcomes reads as unfinished and costs more than the missing item.
- Anything kept only because it is true.

None of it is lost - it is the answer if asked.

## Across the deck

- **Slides hand off.** One ends on what it cannot do; the next does it.
- **Merge two slides that are one idea.** Split apart, the viewer assembles it themselves; side by side, the contrast is the argument.
- **One definition per repeating element.** Fix what solid, outlined, dashed and muted mean, then hold it - markings for a *category* need a different device, or they read as progress. The same holds for everything else that recurs: the size of small grey text, an arrowhead's geometry, a connector's tone, a node's box, the hue that carries a category. Undefined, each quietly acquires variants that mean nothing, and the audience hunts for the difference.
- **Any mark you invent is deck vocabulary the moment it appears twice** - and it can flip meaning between adjacent slides, a strike-through reading "already gone" on one and "not started yet" on the next. Check each mark against its neighbours. The repair is usually to find the thing the mark is actually true of, not to soften the mark.
- **Consistent title grammar.** A bare topic label among conclusions reads as unfinished.
- **End on a conclusion**, not a list of what you will show.

## Look at every slide rendered

A slide is finished when you have seen it as the audience will. Nothing upstream of the render tells you it is wrong: the claim can be right and the sources checked, and the slide still ragged or clipped.

- **Export the real format before the deck has content**, then **export each slide as you finish drawing it and look at the image - zoomed in, not at slide scale.** The first run proves the toolchain - export paths pull dependencies that fail on first use. The per-slide runs are how everything below is caught; none of it shows before the render, and composition faults surface only at zoom, where an edge that misses by a hair is visible as a miss.
- **The title fits one line.** A wrapping title takes a second line of height from every slide and reads as two claims. Shrink the deck's title size until the longest one fits - the claim is the part that must not give.
- **Nothing may fit by a pixel.** A line held on one line by a no-wrap rule, or a box that just clears its frame, clips the first time its wording changes. Leave slack, or let it wrap.
- **The picture fills the frame - and each block fills its own box.** A band of unused space under the content reads as an unfinished slide, and everything above it is smaller than it needed to be. Grow the picture into the space and size its parts for the room that frees. The same applies inside: a large box whose text uses a third of its height reads as empty weight and pulls the eye off the news.
- **Side-by-side content ends level.** One panel running a line longer than its neighbour reads as ragged. Match them, or move the overflow off the slide.

For a Slidev deck, [references/slidev.md](./references/slidev.md) carries its commands, the browser its export needs, and the sizing traps that clip a slide. Where the audience needs a file to double-click and mail on rather than a PDF, `node scripts/export-single-html.mjs <deck-dir>` writes the whole deck as one self-contained `.html` - the live deck, no network, nothing beside it - and with the dev server up, the HTML icon at the end of the nav control bar does the same by hand. Nothing of either route appears inside the exported file. The same reference carries its traps and its limits.

On a Fabric deck the round is not finished when the slides look right: run `node scripts/check-style.mjs <deck-dir>` and fix what it names in the files you own. And when the deck is meant to pass as Constructor Fabric's own, put one of your rendered slides beside the donor page its shape came from and look at the two together - colour weight, saturation, type scale, density. A slide that reads as a draft next to its own source is the failure the checker cannot see.

## Method

- Ground every claim in a source before drawing it.
- **Re-verify volatile numbers immediately before finalising.** Counts move between drafting and presenting, and stale is usually weaker than the truth.
- **Record, per slide: the claim, the source of each figure, and where the slide stops.** It is what lets a slide stay uncluttered and still be defensible. Where the deck is built from source, that record belongs inside the slide: what it claims and where it stops in its speaker notes, why it is drawn this way beside the markup that draws it. The notes ship with the file, so what goes in them is written for a later reader - no working labels, and no decisions about what you chose not to draw. A separate document is a second copy of the deck, and so is a block of spec sitting above a slide already drawn - both go stale. Before the slide exists that block is the working spec; drawing the slide is what distils it. The record is owed by a slide whose claim can be argued with, not by every slide in the file: where a slide asserts nothing beyond the picture it shows, it needs no note, and an empty one is not a gap to be filled.
- **Get a critique from someone who did not build it.** Ask: what does the eye hit first, what does this form imply that we did not intend, where does a slide read as more finished than it is.

## Continuous development

This skill accumulates proven procedure; git accumulates the history. There is no log inside it - what changed, why, and the evidence go in the commit message, where they cannot go stale beside the instruction they describe.

Edit it when a defect is **observed in use**: a rule here steered a build wrong, a trap cost a round because nothing warned about it, someone who owns the style ruled, or a shape carried a claim for the third time and is now a case. Fix it in place, in that session, in every part that carried it - the reference, the template case built on it, the checker that missed it. Not "everything the run learned": a skill that folds in whatever turns up grows until nobody reads it. Where a new ruling contradicts an old one, the newer rewrites the older rather than standing beside it; two versions of a rule are worse than either alone. Removing a rule is an edit too and needs the same evidence - cutting for brevity drops the load-bearing detail along with the padding.

Before a change to the skill leaves your hands: `node scripts/skill-doctor.mjs` clean - it compiles every case (structural read when no Vue compiler is reachable - it says so), resolves every token, checks every pointer and exits non-zero on what has rotted - and `node scripts/check-style.mjs examples/fabric-deck` clean. When the change touches instructions rather than prose, run [evals/](./evals/) against the new version and the one it replaces; an edit that does not improve the run does not ship. Open unknowns go to the repository's issues, not to a file in here.

[references/self-improvement.md](./references/self-improvement.md) is the full contract: what licenses an edit, the evidence a style rule needs before it may be written at all, and what each gate checks.
