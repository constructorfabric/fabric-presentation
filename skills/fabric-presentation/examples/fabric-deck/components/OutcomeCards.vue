<script setup lang="ts">
  /*
   * Template case: category-cards (tpl-08..12) - a row of five.
   *
   * All five on the slide: the set is short enough that the whole of it IS the
   * rule, and showing three would invite the question about the other two. One
   * card carries the navy fill, because one thing on a slide may be marked and
   * the mark has to land on the card the rest of the deck rests on.
   */

  type Outcome = { no: string; title: string; body: string; filled?: boolean };

  const outcomes: Outcome[] = [
    {
      no: '01',
      title: 'One agent session',
      body: 'A clean directory, one prompt, and out comes a console with a menu and screens that opens without errors.',
    },
    {
      no: '02',
      title: 'Reproducibility',
      body: 'The project is materialized from versioned templates by commands that do the same thing every time.',
    },
    {
      no: '03',
      title: 'Traceability',
      body: 'The passport remembers the source of every piece, and an upgrade arrives as a reviewable diff.',
    },
    {
      no: '04',
      title: 'Team isolation',
      body: 'Every screen is a standalone micro frontend with its own build and its own Shadow DOM.',
    },
    {
      no: '05',
      title: 'Extensibility',
      body: 'A team registers its own template with its own UI kit and it takes the same path.',
      filled: true,
    },
  ];

  const takeaway =
    'All five follow from one decision: materialize a tested template instead of generating the same project again.';
</script>

<template>
  <div class="deck-body">
    <div class="deck-cards deck-cards_5">
      <article
        v-for="item of outcomes"
        :key="item.no"
        class="fx-card"
        :class="{ 'fx-card_filled': item.filled }"
      >
        <div class="fx-kicker">{{ item.no }}</div>
        <h3 class="deck-card-title">{{ item.title }}</h3>
        <p class="deck-card-body">{{ item.body }}</p>
      </article>
    </div>

    <p class="deck-takeaway-line">{{ takeaway }}</p>
  </div>
</template>
