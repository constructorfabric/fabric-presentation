<script setup lang="ts">
  /*
   * Donor layout: Comparison (tpl-12) - two option cards of equal weight, each a
   * bullet list under its own head, with the decision line under the pair.
   *
   * Different from the contrast-pair on the earlier slide, and deliberately: the
   * pair says "this way against that way" and marks one of them with the navy
   * ground. A comparison of two OPTIONS still open must not do that - a filled
   * card would announce the decision the slide is asking the room to make. Both
   * cards are the same tint card, and the decision is a sentence under them.
   *
   * The heads are the kicker over a hairline rule: an in-card heading is never a
   * filled band.
   */

  type Option = { kicker: string; heading: string; forIt: string[]; against: string[] };

  const options: Option[] = [
    {
      kicker: 'Option A',
      heading: 'Take the shell template first',
      forIt: [
        'Every team lands on one menu, one router and one theme set',
        'The upgrade path exists from day one',
      ],
      against: [
        'Screens keep their current builds until the next step',
        'One release train has to be re-planned',
      ],
    },
    {
      kicker: 'Option B',
      heading: 'Take the screen template first',
      forIt: [
        'A team sees the benefit inside one screen of its own',
        'No coordination with the other projects is needed',
      ],
      against: [
        'The shells stay duplicated for another N quarters',
        'Themes drift until the shell template arrives',
      ],
    },
  ];

  const decision = 'Both are reversible. What is not reversible is starting on both at once with the same people.';
</script>

<template>
  <div class="deck-body">
    <div class="compare-cols">
      <article v-for="option of options" :key="option.heading" class="compare-card">
        <header class="compare-head">
          <div class="fx-kicker">{{ option.kicker }}</div>
          <h3 class="compare-title">{{ option.heading }}</h3>
        </header>

        <div class="compare-group">
          <p class="compare-group-label">What it buys</p>
          <ul class="compare-list">
            <li v-for="line of option.forIt" :key="line">{{ line }}</li>
          </ul>
        </div>

        <div class="compare-group">
          <p class="compare-group-label">What it costs</p>
          <ul class="compare-list">
            <li v-for="line of option.against" :key="line">{{ line }}</li>
          </ul>
        </div>
      </article>
    </div>

    <p class="deck-takeaway-line">{{ decision }}</p>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. */

  .compare-cols {
    display: grid;
    flex: none;
    align-items: stretch;
    gap: calc(20 * var(--fx-pt));
    grid-template-columns: repeat(2, 1fr);
  }

  .compare-card {
    display: flex;
    flex-direction: column;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: var(--fx-radius);
    background: var(--fx-surface-tint);
    gap: calc(12 * var(--fx-pt));
    padding: calc(18 * var(--fx-pt));
  }

  /* The in-card head: kicker over heading, ruled off from the lists below. */

  .compare-head {
    display: flex;
    flex-direction: column;
    border-block-end: var(--fx-rule-hairline) solid var(--fx-rule);
    gap: calc(4 * var(--fx-pt));
    padding-block-end: calc(10 * var(--fx-pt));
  }

  .compare-title {
    margin: 0;
    color: var(--fx-text-title);
    font-size: var(--fx-size-body-lg);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.2;
  }

  .compare-group {
    display: flex;
    flex-direction: column;
    gap: calc(5 * var(--fx-pt));
  }

  /* The two groups are told apart by their words, not by a hue: the system has
     no colour for "good" and none for "bad". */

  .compare-group-label {
    margin: 0;
    color: var(--fx-text-muted);
    font-size: var(--fx-size-caption);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    line-height: 1.2;
    text-transform: uppercase;
  }

  .compare-list {
    margin: 0;
    color: var(--fx-text);
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
    list-style: none;
    padding: 0;
  }

  .compare-list li {
    position: relative;
    padding-inline-start: calc(12 * var(--fx-pt));
  }

  .compare-list li + li {
    margin-block-start: calc(4 * var(--fx-pt));
  }

  .compare-list li:before {
    position: absolute;
    border-radius: 50%;
    background: currentcolor;
    block-size: calc(3 * var(--fx-pt));
    content: "";
    inline-size: calc(3 * var(--fx-pt));
    inset-block-start: 0.6em;
    inset-inline-start: 0;
  }
</style>
