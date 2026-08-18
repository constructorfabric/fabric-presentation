<script setup lang="ts">
  /*
   * Template case: contrast-pair.
   *
   * Two panels side by side: the side that holds against the side that does
   * not. Built from the rendered donors, exm-05 and exm-11 - the
   * two-column comparison, where both halves are the SAME blue family and only
   * the ground and the heading tell them apart.
   *
   * In a monochrome blue system there is no green half and no red half, so the
   * pair is carried by:
   *
   *   - GROUND: the side that needs the room's attention sits on the navy
   *     panel, the other on the tint card. Depth, not hue.
   *   - WORDS: the headings say which is which. "What holds" / "What does not"
   *     is doing the work a colour would do elsewhere, so it has to be
   *     written, not implied.
   *
   * A pair whose meaning survives being printed in one ink is a pair the
   * audience can read from the back of the room. That is the whole point of
   * the rule.
   *
   * Each panel's heading is the kicker over a hairline rule, not a filled band:
   * a band inside a panel is narrower than the panel it heads, and the outer
   * thing has to read wider than what it contains. The one band
   * this case draws is the third block's, and that band stands on the
   * BARE GROUND heading the lines under it, which is the shape the donors draw
   * it in (exm-05/06/07/13).
   *
   * Keep: two panels of equal weight, one heading each, and the neutral block
   * underneath for what belongs to neither side. Drop the third block if the
   * slide has nothing for it.
   */

  type Side = {
    /* The panel's heading. One or two words: "Holds" / "Does not". */
    heading: string;
    /* One line per point. Keep the two columns within a line of each other -
       side-by-side content that ends level is what stops the pair reading as
       ragged. */
    points: string[];
  };

  const good: Side = {
    heading: 'What holds',
    points: [
      'The first thing that worked, in one line',
      'The second thing that worked',
      'A third, if the column needs it',
    ],
  };

  const bad: Side = {
    heading: 'What does not',
    points: [
      'The first thing that did not, in one line',
      'The second, with its number marked',
      'A third, if the column needs it',
    ],
  };

  /* The marked token: a figure, an id, the thing the eye should land on. On the
     navy panel it is sky-blue bold - the accent that reads on a dark ground -
     and it is the one mark on the slide. */
  const marked = 'the figure';

  /* Belongs to neither column: context, a decision, a next step. */
  const other = [
    'What is true of both columns and so belongs under them.',
    'A second line, at most. This block is not a third column.',
  ];
</script>

<template>
  <div class="tpl-pair">
    <div class="tpl-pair-cols">
      <section class="tpl-side tpl-side_light">
        <h3 class="tpl-side-head">{{ good.heading }}</h3>
        <ul class="tpl-side-body">
          <li v-for="point of good.points" :key="point">{{ point }}</li>
        </ul>
      </section>

      <section class="tpl-side tpl-side_dark">
        <h3 class="tpl-side-head">{{ bad.heading }}</h3>
        <ul class="tpl-side-body">
          <li v-for="(point, index) of bad.points" :key="point">
            {{ point }}<template v-if="index === 1">: <span class="tpl-marked">{{ marked }}</span></template>
          </li>
        </ul>
      </section>
    </div>

    <section class="tpl-other">
      <h3 class="tpl-other-head">Other</h3>
      <ul class="tpl-other-body">
        <li v-for="line of other" :key="line">{{ line }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
  /* Every value comes from assets/fabric-tokens.css. */
  .tpl-pair {
    display: flex;
    flex-direction: column;

    /* The pair fills the content box - the donors run both panels to the
       bottom of the content zone rather than floating them in the middle. */
    block-size: 100%;
    font-family: var(--fx-font);
    gap: calc(14 * var(--fx-pt));
    inline-size: 100%;
  }

  .tpl-pair-cols {
    display: grid;
    flex: 1;
    align-items: stretch;
    gap: calc(24 * var(--fx-pt));
    grid-template-columns: repeat(2, 1fr);
  }

  /* Both panels are the same object: rounded, padded, no shadow. Only the
     ground differs. */

  .tpl-side {
    display: flex;
    flex-direction: column;
    border-radius: var(--fx-radius);
    padding: var(--fx-card-pad);
  }

  /* The panel's heading: kicker typography over a hairline rule that runs the
     panel's full inner width. Nothing is filled, so nothing inside the panel
     reads wider or heavier than the panel. */

  .tpl-side-head {
    margin: 0;
    border-block-end: var(--fx-rule-hairline) solid var(--fx-rule);
    font-size: var(--fx-size-kicker);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    line-height: 1.2;
    padding-block-end: calc(7 * var(--fx-pt));
    text-transform: uppercase;
  }

  .tpl-side-body {
    flex: 1;
    margin: 0;
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
    list-style: none;
    padding-block: calc(10 * var(--fx-pt)) 0;
    padding-inline: 0;
  }

  .tpl-side-body li + li {
    margin-block-start: calc(6 * var(--fx-pt));
  }

  /* The light side: the standard card - tint fill, 1pt hairline, navy heading
     over ink body. */

  .tpl-side_light {
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    background: var(--fx-surface-tint);
    color: var(--fx-text);
  }

  .tpl-side_light .tpl-side-head {
    color: var(--fx-text-accent);
  }

  /* The dark side: the navy panel. White heading, subtitle ink for the body -
     the same two inks every dark slide in the deck uses, so the panel reads as
     a piece of the cover rather than as a coloured box. */

  .tpl-side_dark {
    background: var(--fx-navy);
    color: var(--fx-tint-band);
  }

  /* On the navy panel the kicker takes the sky blue and its rule a soft
     white-alpha line: the grey hairline reads as a bright bar on navy. */

  .tpl-side_dark .tpl-side-head {
    border-block-end-color: rgb(255 255 255 / 18%);
    color: var(--fx-text-accent-dark);
  }

  .tpl-marked {
    color: var(--fx-text-accent-dark);
    font-weight: var(--fx-weight-bold);
  }

  /* Neither column: a band header with the lines under it, which is EXM's
     quiet alternative to a third panel. This is the band's ONE legal shape -
     standing on the bare ground, heading the block below it (exm-05/06/07/13).
     Inside a card or a panel it would be a fill narrower than its container,
     which the law forbids. */

  .tpl-other {
    color: var(--fx-text);
  }

  .tpl-other-head {
    display: flex;
    align-items: center;
    border-radius: calc(var(--fx-radius) / 2);
    background: var(--fx-tint-band);
    color: var(--fx-navy);
    font-size: var(--fx-size-text);
    font-weight: var(--fx-weight-bold);
    margin-block: 0;
    margin-inline: 0;
    min-block-size: var(--fx-band-h);
    padding-inline: var(--fx-card-pad);
  }

  .tpl-other-body {
    margin: 0;
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
    padding-block-start: calc(6 * var(--fx-pt));
    padding-inline-start: calc(16 * var(--fx-pt));
  }
</style>
