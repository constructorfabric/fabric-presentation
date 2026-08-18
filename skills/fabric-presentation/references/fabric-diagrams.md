# Slide diagrams

Hand-authored Excalidraw JSON, rendered to SVG, embedded into the deck. Diagrams argue visually - a sequence for a protocol, nested blocks for a structure - they never just display labeled boxes.

## Design method (before any JSON)

1. Pick the pattern that mirrors the concept's behavior: message exchange over time - **sequence** (lifelines + numbered horizontal arrows, grouped into phases); containment/plugging-in - **nested blocks** (dashed slots inside a solid container, an artifact card outside, an arrow crossing the boundary); transformation - left-to-right assembly line; comparison - side-by-side.
2. Include evidence, not placeholders: real method names, real field names from actual files, real values from the product being presented. A dark mono "artifact card" for code/data evidence. (An EXAMPLE deck is the one exception: there the labels are plausible placeholders by design.)
3. Free-floating text over containers: labels, captions and phase markers are bare text elements; boxes only where the shape carries meaning (container, slot, decision diamond). Under 30% of text inside containers.
4. Sketch coordinates on a ~1400x760 canvas; message rows every 80px; keep a bottom caption line stating the diagram's one-sentence takeaway.

## Authoring the JSON

- File next to the deck: `<name>-diagram.excalidraw`. Plain Excalidraw JSON: `{type, version, appState:{viewBackgroundColor:"#ffffff", gridSize:20}, files:{}, elements:[...]}`.
- Every element carries the full property set (seed/version/versionNonce unique, `roughness: 0` for the clean professional look, `opacity: 100`, `fontFamily: 3` = code font). Text elements duplicate content in `text` and `originalText`; a text bound inside a shape sets `containerId` and the shape lists it in `boundElements`.
- Descriptive string IDs (`head_left`, `msg3_arrow`, `arr_card_menu`) - cross-edits stay readable. Namespace seeds per section (100xxx, 200xxx).
- Build section by section (headers/lifelines first, then messages, then annotations) - never one giant emission.
- Orthogonal connectors only: multi-point arrows route H/V with explicit waypoints (`points: [[0,0],[0,111],[256,111]]`), anchored to element edges. Dashed stroke = notification/return; solid = call.

## Colours: the law's, mapped by role - no values here

A diagram carries no palette of its own. The palette's single source of truth is the law ([fabric-style.md](./fabric-style.md) §1) and its values live once, in [../assets/fabric-tokens.css](../assets/fabric-tokens.css); this file only maps the diagram roles onto the law's roles, so when the law moves this file cannot disagree with it. A diagram guide that carries its own hex table is the failure mode this indirection prevents: its values keep working long after the law they were copied from has changed, so a warm decision diamond or an off-scheme caption grey ships in a diagram while every check stays green.

| Diagram role | The law's role (look the value up there) |
|---|---|
| Primary actor / structural container | the navy - structure ink |
| Secondary actor | the accent of light grounds |
| Tertiary actor | the sky blue - the dark grounds' accent |
| Evidence card (code/data) | the deepest navy ground, text in the sky blue |
| Highlight block | the band tint |
| Decision diamond (validation) | navy stroke on the band tint - the system has no warm hue to give it |
| Message/label text | the subtitle blue |
| Structural lines, captions, muted slots | the muted ink of light grounds, dashed |

Excalidraw JSON cannot read CSS custom properties, so at authoring time the hexes are copied out of `fabric-tokens.css` - copied at that moment, never memorised and never restated in this file.

`check-style.mjs` does not read `.svg` or `.excalidraw` files, so diagram colour discipline is held by this mapping and the render pass, not by the checker - name that in review rather than assuming the green run covered it.

## Render - view - fix loop (mandatory)

You cannot judge a diagram from JSON. Render, look, fix, repeat until clean:

```sh
curl --fail --show-error --max-time 60 -X POST -H "Content-Type: text/plain" \
  --data-binary @name-diagram.excalidraw \
  https://kroki.io/excalidraw/svg -o name-diagram.svg
```

(kroki.io accepts raw Excalidraw JSON as `text/plain`; the `Content-Type: application/json` form fails with "diagram_source must not be empty". SVG only - the png endpoint 404s.) **The endpoint is a third party and receives the whole diagram source.** For a diagram carrying non-public names, figures or architecture, do not post it there: use a self-hosted Kroki, or export the SVG locally from the Excalidraw app itself. View the SVG in a real browser tab and screenshot it; macOS `qlmanage` thumbnails distort wide SVGs into squares - do not judge by them.

Defect checklist per iteration: labels crossing lifelines/borders (move, shrink font, or rely on the halo below), captions pierced by arrow verticals (reroute the arrow drop-point outside the caption's span), text kissing box edges (wrap to two lines or shift), phase labels clear of lifelines. Expect 2-4 iterations; a re-worded diagram re-runs the loop, because label widths change (a caption that cleared an arrow before may collide after).

## Embedding into a Slidev deck

The deck references the SVG as a file rather than pasting it inline: the cleaned SVG goes to `public/<name>-diagram.svg`, and the slide is an `<img>` (or a thin figure component) on a light slide whose class collapses the header to natural height so the drawing gets the freed room (`fx-diagram-slide` in the example deck). Clean the SVG once, in the file:

1. Strip `<defs>` and the `style-fonts` block - it is ~half the file (an inlined woff2) and the deck's font stack takes over anyway.
2. Drop root `width`/`height` attributes so CSS sizes it by `viewBox` (`width:100%; height:auto`), and give the `<img>` an `alt`/`aria-label`.
3. Remove the opaque white canvas `<rect>` - the diagram sits directly on the slide ground, no framed container (a bordered card around a diagram eats space and loads the slide).
4. **Knockout halo** for labels that cross lines: an SVG file loaded through `<img>` cannot be styled from the page, so the halo rule goes INSIDE the file as a `<style>` block - `text[fill="<the message-label hex, as it appears in this SVG>"] { paint-order: stroke; stroke: <the slide's ground>; stroke-width: 5px }`, scoped by fill colour so a halo never eats white-on-navy header text. Without it, labels sitting across lifelines render struck through (a failure mode seen on real diagrams).
5. Max-width ceiling computed from THIS SVG's viewBox aspect ratio against the free band between the title and the footer - width dictates height; never copy another diagram's ceiling, because another drawing's canvas is a different width.

## A/B experiments

New diagram for an existing slide: duplicate the slide, put the diagram on the copy, keep both until the presenter picks (mark the copy only in an HTML comment, its note and the README - no visible badge; identical header and ground so variants compete on substance). On adoption, delete the loser plus its now-orphaned CSS (count class usage before deleting shared classes) and record the outcome in the deck's README.
