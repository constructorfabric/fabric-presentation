<script setup lang="ts">
  /*
   * Template case: contrast-pair (exm-05, exm-11).
   *
   * Both halves are the same blue family: the way the room already works sits on
   * the tint card, the way the talk is about sits on the navy panel. Depth, not
   * hue - there is no green column and no red column in this system, and a pair
   * whose meaning survives being printed in one ink reads from the back of the
   * room.
   *
   * Each panel's head is the kicker over its heading, ruled off from the points
   * by a hairline. Nothing inside a panel is filled: a band inside a panel reads
   * narrower than the panel it heads and inverts the hierarchy.
   *
   * Each half carries the figures of ONE measurement, and the label above them
   * says which. Dropping either label would turn two different measurements into
   * one scoreboard.
   */

  type Side = {
    /* The caps kicker: whose way of working the column describes. */
    kicker: string;
    /* The column's heading, one line. */
    heading: string;
    /* One point per line, kept level with the other column. */
    points: string[];
    /* What the figures below were measured on. */
    statLabel: string;
    /* Each figure as the value the eye lands on plus what it measures. */
    stats: { value: string; rest: string }[];
  };

  const usual: Side = {
    kicker: 'The usual way',
    heading: 'Generation from scratch',
    points: [
      'Every run produces a different result',
      'Structure and versions are unpredictable',
      'Whether it builds is found out at the end',
    ],
    statLabel: 'Control run of the same prompt without Fabric, placeholder figures',
    stats: [
      { value: 'a monolith', rest: 'instead of a module per screen' },
      { value: 'zero', rest: 'unit tests carried in' },
      { value: 'no', rest: 'record of what came from where' },
    ],
  };

  const ours: Side = {
    kicker: 'The Fabric way',
    heading: 'Template materialization',
    points: [
      'The same working project on any machine',
      'The template is assembled, tested and versioned',
      'The agent improvises only inside the screens',
    ],
    statLabel: 'N runs of the same prompt with Fabric, placeholder figures',
    stats: [
      { value: 'one module', rest: 'per screen, with its own build' },
      { value: 'hundreds of', rest: 'unit tests carried by the templates' },
      { value: 'a passport', rest: 'recording every part, version and source' },
    ],
  };

  const sides = [usual, ours];
</script>

<template>
  <div class="deck-body">
    <div class="pair-cols">
      <section
        v-for="(side, index) of sides"
        :key="side.heading"
        class="pair-side"
        :class="index === 1 ? 'pair-side_dark' : 'pair-side_light'"
      >
        <!-- The panel's head: kicker over heading, ruled off from the points
             below by a hairline. Nothing here is filled - a band inside a panel
             would read narrower than the panel it heads. -->
        <header class="pair-headblock">
          <div class="fx-kicker">{{ side.kicker }}</div>
          <h3 class="pair-head">{{ side.heading }}</h3>
        </header>

        <ul class="pair-body">
          <li v-for="point of side.points" :key="point">{{ point }}</li>
        </ul>

        <p class="pair-stat-label">{{ side.statLabel }}</p>
        <ul class="pair-stats">
          <li v-for="stat of side.stats" :key="stat.value">
            <span class="pair-stat-value">{{ stat.value }}</span> {{ stat.rest }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. */

  .pair-cols {
    display: grid;
    flex: 1;
    align-items: stretch;
    gap: calc(20 * var(--fx-pt));
    grid-template-columns: repeat(2, 1fr);
    min-block-size: 0;
  }

  /* Both panels are the same object: rounded, padded, no shadow. Only the ground
     differs. */

  .pair-side {
    display: flex;
    flex-direction: column;
    border-radius: var(--fx-radius);
    gap: calc(6 * var(--fx-pt));
    padding: calc(20 * var(--fx-pt));
  }

  /* The head block: the blessed in-card heading shape - kicker typography and
     its heading, set off from the body by a hairline that runs the panel's full
     inner width. */

  .pair-headblock {
    display: flex;
    flex-direction: column;
    border-block-end: var(--fx-rule-hairline) solid var(--fx-rule);
    gap: calc(4 * var(--fx-pt));
    padding-block-end: calc(10 * var(--fx-pt));
  }

  .pair-head {
    margin: 0;
    font-size: var(--fx-size-body-lg);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.2;
  }

  .pair-body {
    margin: 0;
    font-size: var(--fx-size-body);
    line-height: var(--fx-leading-body);
    list-style: none;
    padding-block: calc(2 * var(--fx-pt)) 0;
    padding-inline: 0;
  }

  .pair-body li {
    position: relative;
    padding-inline-start: calc(12 * var(--fx-pt));
  }

  .pair-body li + li {
    margin-block-start: calc(7 * var(--fx-pt));
  }

  /* The bullet marks the line; it does not classify it, so it is the same dot on
     both sides and only its ink follows the ground. */

  .pair-body li:before {
    position: absolute;
    border-radius: 50%;
    background: currentcolor;
    block-size: calc(3 * var(--fx-pt));
    content: "";
    inline-size: calc(3 * var(--fx-pt));
    inset-block-start: 0.6em;
    inset-inline-start: 0;
  }

  /* The figures are a footnote to the column, so they are ruled off from the
     points above rather than boxed: a box would make them a second claim. */

  .pair-stat-label {
    margin-block: auto 0;
    border-block-start: var(--fx-rule-hairline) solid currentcolor;
    font-size: var(--fx-size-caption);
    font-weight: var(--fx-weight-bold);
    line-height: 1.2;
    padding-block-start: calc(10 * var(--fx-pt));
  }

  .pair-stats {
    margin: 0;
    font-size: var(--fx-size-text);
    line-height: 1.5;
    list-style: none;
    padding-block-start: calc(4 * var(--fx-pt));
    padding-inline: 0;
  }

  .pair-stat-value {
    font-weight: var(--fx-weight-bold);
  }

  /* The light side: the standard card - tint fill, 1pt hairline, accent kicker
     over ink body. */

  .pair-side_light {
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    background: var(--fx-surface-tint);
    color: var(--fx-text);
  }

  .pair-side_light .pair-head {
    color: var(--fx-text-title);
  }

  .pair-side_light .pair-stat-label {
    border-block-start-color: var(--fx-rule);
    color: var(--fx-text-muted);
  }

  .pair-side_light .pair-stat-value {
    color: var(--fx-text-title);
  }

  /* The dark side: the navy panel, with the two inks every dark page in this
     deck uses, so it reads as a piece of the cover rather than a coloured box.
     The kicker flips to the sky blue a dark ground takes. */

  .pair-side_dark {
    background: var(--fx-navy);
    color: var(--fx-tint-band);
  }

  .pair-side_dark .fx-kicker {
    color: var(--fx-text-accent-dark);
  }

  /* The grey hairline reads as a bright bar on navy, so the head block's rule
     softens to white-alpha the way the stat label's does. */

  .pair-side_dark .pair-headblock {
    border-block-end-color: rgb(255 255 255 / 18%);
  }

  .pair-side_dark .pair-head {
    color: var(--fx-text-inverted);
  }

  .pair-side_dark .pair-stat-label {
    border-block-start-color: rgb(255 255 255 / 20%);
    color: var(--fx-text-muted-dark);
  }

  .pair-side_dark .pair-stat-value {
    color: var(--fx-text-inverted);
  }
</style>
