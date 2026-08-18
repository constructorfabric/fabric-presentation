<script setup lang="ts">
  /*
   * Template case: candidate-tiles.
   *
   * The counter-direction of status-tiles: the same three cards, with the
   * motif running the other way. Distilled from a presented and reviewed slide
   * and built to the Fabric law.
   *
   * Use this when the set is proposals rather than progress. Every tile
   * carries the same chip, because none of them outranks the others yet.
   *
   * The chips are outlines - no fill inside the tiles at all. A fill is the
   * system's way of saying "this one", and three peer proposals in the same
   * state have no "this one". The only filled chip on the slide is the target
   * of the direction motif, which is a place, not a status. In a monochrome
   * system that is structural rather than a judgement call: there is no hue
   * left to say it with.
   *
   * The tile's heading is the kicker over a hairline rule, not a filled band:
   * a band inside a card is narrower than the card it heads, and the container
   * has to read wider than its contents.
   */

  type Candidate = {
    name: string;
    note: string;
  };

  const lead = 'One line saying who is offering what, and to whom.';

  /* Reversed against the status-tiles case, so the pair reads as two
     directions of one exchange. */
  const direction = { from: 'Target', to: 'Source' };

  const chipLabel = 'Candidate';

  const candidates: Candidate[] = [
    {
      name: 'First candidate',
      note: 'What exists on this side already, and what the other side lacks.',
    },
    {
      name: 'Second candidate',
      note: 'A capability, not a wish. Name the thing that runs today.',
    },
    {
      name: 'Third candidate',
      note: 'The one whose shape is least settled. Say so here, not in a caveat.',
    },
  ];

  /* Candidates are not commitments, and the slide has to say which it is. */
  const kicker = 'The line separating what is offered from what is agreed.';
</script>

<template>
  <div class="tpl-candidates">
    <div class="tpl-lead-row">
      <p class="tpl-lead">{{ lead }}</p>

      <div class="tpl-direction">
        <span class="tpl-chip">{{ direction.from }}</span>
        <span class="tpl-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.4">
            <path d="M1 5 H21 M17 1.5 L21 5 L17 8.5" />
          </svg>
        </span>
        <span class="tpl-chip tpl-chip_target">{{ direction.to }}</span>
      </div>
    </div>

    <div class="tpl-tiles">
      <section v-for="candidate of candidates" :key="candidate.name" class="tpl-tile">
        <h3 class="tpl-tile-name">{{ candidate.name }}</h3>
        <div class="tpl-tile-body">
          <span class="tpl-chip">{{ chipLabel }}</span>
          <p class="tpl-tile-note">{{ candidate.note }}</p>
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

  .tpl-candidates {
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

  /* The secondary blue rather than the accent: on the status-tiles slide the
     accent marks the work under way, and these three have no work under way
     yet. One step quieter keeps the pair of slides honest. */

  .tpl-arrow {
    display: block;
    color: var(--fx-text-subtitle);
  }

  .tpl-arrow svg {
    display: block;
    inline-size: calc(18 * var(--fx-pt));
  }

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

  /* Filled navy: the one mark on the slide, and it says where the offer lands
     rather than how any candidate is doing. */

  .tpl-chip_target {
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

  /* The padding is the card's own, so the heading's rule runs the full inner
     width of the card. */

  .tpl-tile {
    display: flex;
    flex-direction: column;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: var(--fx-radius);
    background: var(--fx-surface-tint);
    padding: var(--fx-card-pad);
  }

  /* The name: the kicker in accent caps over a hairline rule. A heading inside
     a card is never filled - a band is narrower than the card it heads, and the
     container has to read wider than its contents. */

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
