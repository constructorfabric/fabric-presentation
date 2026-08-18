<script setup lang="ts">
  /*
   * Template case: status-tiles.
   *
   * Three cards, each a named thing with its status, under a direction motif
   * that says which way the work moves. Distilled from a presented and
   * reviewed slide and built to the Fabric law from tpl-08..12 (the card row)
   * and tpl-18 (the navy pill badge, white bold).
   *
   * Replace the copy below. The structure is the part to keep: exactly one
   * tile carries `current`, because the mark has to land on one thing for the
   * eye to find it, and two marked tiles send the viewer hunting for the
   * difference between them.
   *
   * The mark is a NAVY FILL, not a colour: filled navy with white bold reads
   * as "this one", and every other chip stays an outline. Status here is
   * carried by the word in the chip - "In progress", "Next in line" - and the
   * fill only says where to look first. The fill lands on a CHIP, never on the
   * tile's heading: a heading inside a card is the kicker over a hairline rule,
   * because a band narrower than the card it heads inverts the hierarchy.
   */

  type Tile = {
    name: string;
    status: string;
    current: boolean;
    note: string;
  };

  const lead = 'One line saying what the set below is a picture of.';

  /* The motif reads left to right: what moves, and where it lands. The
     landing side carries the filled chip. */
  const direction = { from: 'Source', to: 'Target' };

  const tiles: Tile[] = [
    {
      name: 'First item',
      status: 'In progress',
      current: false,
      note: 'Two lines at most. What this item is, and what state it is in.',
    },
    {
      name: 'Second item',
      status: 'Next in line',
      current: false,
      note: 'What waits on the first, and what it gives once it lands.',
    },
    {
      name: 'Third item',
      status: 'On the roadmap',
      current: false,
      note: 'The furthest out. Say what it depends on, not when it arrives.',
    },
  ];

  /* The line that names what the slide deliberately does not claim. */
  const kicker = 'What this slide deliberately leaves unsaid, and why.';
</script>

<template>
  <div class="tpl-status">
    <div class="tpl-lead-row">
      <p class="tpl-lead">{{ lead }}</p>

      <div class="tpl-direction">
        <span class="tpl-chip">{{ direction.from }}</span>
        <span class="tpl-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.4">
            <path d="M1 5 H21 M17 1.5 L21 5 L17 8.5" />
          </svg>
        </span>
        <span class="tpl-chip tpl-chip_filled">{{ direction.to }}</span>
      </div>
    </div>

    <div class="tpl-tiles">
      <section v-for="tile of tiles" :key="tile.name" class="tpl-tile">
        <h3 class="tpl-tile-name">{{ tile.name }}</h3>
        <div class="tpl-tile-body">
          <span class="tpl-chip" :class="{ 'tpl-chip_filled': tile.current }">{{ tile.status }}</span>
          <p class="tpl-tile-note">{{ tile.note }}</p>
        </div>
      </section>
    </div>

    <p class="tpl-kicker">{{ kicker }}</p>
  </div>
</template>

<style scoped>
  /* Every value here comes from assets/fabric-tokens.css. Import that file in
     the deck before this component renders, and set --fx-scale once for the
     deck's canvas (Slidev's 980px canvas: 0.7656). */

  .tpl-status {
    display: flex;
    flex-direction: column;
    font-family: var(--fx-font);
    inline-size: 100%;
  }

  .tpl-lead-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: calc(20 * var(--fx-pt));
    margin-block-end: calc(14 * var(--fx-pt));
  }

  /* The takeaway line: the secondary blue EXM sets under nearly every content
     title. It states the conclusion, not the topic. */

  .tpl-lead {
    margin: 0;
    color: var(--fx-text-subtitle);
    font-size: var(--fx-size-body);
    line-height: var(--fx-leading-body);
    max-inline-size: 66%;
  }

  .tpl-direction {
    display: flex;
    flex: none;
    align-items: center;
    gap: calc(6 * var(--fx-pt));
  }

  /* The accent blue, spent once on the slide: the arrow is the only thing that
     has to be seen before the words are read. */

  .tpl-arrow {
    display: block;
    color: var(--fx-text-accent);
  }

  .tpl-arrow svg {
    display: block;
    inline-size: calc(18 * var(--fx-pt));
  }

  /* The chip: rounded, unfilled, hairline - a label of equal weight. */
  .tpl-chip {
    display: inline-flex;
    align-items: center;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: var(--fx-radius-pill);
    background: var(--fx-surface);
    color: var(--fx-text-muted);
    font-size: var(--fx-size-caption);
    line-height: 1.2;
    padding-block: calc(3 * var(--fx-pt));
    padding-inline: calc(10 * var(--fx-pt));
  }

  /* Filled navy with white bold: the one mark on the slide. */
  .tpl-chip_filled {
    border-color: var(--fx-navy);
    background: var(--fx-navy);
    color: var(--fx-text-inverted);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-tiles {
    display: grid;
    gap: calc(16 * var(--fx-pt));
    grid-template-columns: repeat(3, 1fr);
  }

  /* The card: rounded, tint fill, 1pt hairline, no shadow. The padding is the
     card's own, so the heading's rule runs the full inner width. */

  .tpl-tile {
    display: flex;
    flex-direction: column;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: var(--fx-radius);
    background: var(--fx-surface-tint);
    padding: var(--fx-card-pad);
  }

  /* The name: the kicker in accent caps, set off from the body by a hairline.
     A heading inside a card is never filled - a band is narrower than the card
     it heads, and the container has to read wider than its contents. */

  .tpl-tile-name {
    margin: 0;
    border-block-end: var(--fx-rule-hairline) solid var(--fx-rule);
    color: var(--fx-text-accent);
    font-size: var(--fx-size-kicker);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    line-height: 1.2;
    padding-block-end: calc(7 * var(--fx-pt));
    text-transform: uppercase;
  }

  .tpl-tile-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: calc(8 * var(--fx-pt));
    padding-block-start: calc(10 * var(--fx-pt));
  }

  .tpl-tile-note {
    margin: 0;
    color: var(--fx-text);
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
  }

  .tpl-kicker {
    color: var(--fx-text-muted);
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
    margin-block: calc(16 * var(--fx-pt)) 0;
  }
</style>
