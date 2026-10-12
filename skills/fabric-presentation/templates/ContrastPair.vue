<script setup lang="ts">
  /*
   * Template case: contrast-pair.
   *
   * The side that holds against the side that does not, as template v4's
   * Comparison layout (layout 13) draws it: two cards of EQUAL weight, 577.6 x
   * 297.6 on a 28.8 gutter, neither marked, each headed by its kicker, the
   * points in 15pt ink at lnSpc 150%.
   *
   * Green and red are status signals only, never a half of the slide, so the
   * pair is carried by WORDS: the kickers say which side is which. A pair whose
   * meaning survives being printed in one ink reads from the back of the room.
   *
   * One token per slide may be marked - a figure, an id - in navy bold. What is
   * true of both sides belongs in the notes, not in a third block.
   */

  type Side = {
    /* The card's kicker. Two to four words: "What holds" / "What does not". */
    heading: string;
    /* One line per point. Keep the two cards within a line of each other -
       side-by-side content that ends level stops the pair reading as ragged. */
    points: string[];
  };

  const good: Side = {
    heading: 'What holds',
    points: ['The first thing that worked, in one line', 'The second thing that worked', 'A third, if the card needs it'],
  };

  const bad: Side = {
    heading: 'What does not',
    points: ['The first thing that did not, in one line', 'The second, with its number marked', 'A third, if the card needs it'],
  };

  /* The marked token, on the second point of the second card. */
  const marked = 'the figure';
</script>

<template>
  <div class="deck-cols deck-cols_2 deck-compare">
    <div class="fx-card">
      <div class="fx-kicker">{{ good.heading }}</div>
      <p v-for="point of good.points" :key="point" class="deck-card-body">{{ point }}</p>
    </div>

    <div class="fx-card">
      <div class="fx-kicker">{{ bad.heading }}</div>
      <p v-for="(point, index) of bad.points" :key="point" class="deck-card-body">
        {{ point }}<template v-if="index === 1">: <b class="tpl-marked">{{ marked }}</b></template>
      </p>
    </div>
  </div>
</template>

<style scoped>
  .tpl-marked {
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }
</style>
