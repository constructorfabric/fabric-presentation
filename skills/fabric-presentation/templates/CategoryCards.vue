<script setup lang="ts">
  /*
   * Template case: category-cards.
   *
   * A row of cards, each a different KIND of thing - template v4's column
   * layouts (v4-06 two, v4-07 three, layout 12 four): cards 297.6 high from the
   * content top on a 28.8 gutter, each headed by the 12pt accent-blue caps
   * kicker over an ink body. Change `deck-cols_4` to `_3` or `_2` with the
   * number of cards; the body steps 13pt / 14pt / 15pt with it.
   *
   * The cards do NOT get a colour each. Blue and navy lead and the secondary
   * accents are used selectively, so what tells one kind from another is the
   * kicker, the order and the words - never the fill. Four is the ceiling: the
   * template has no five-column layout.
   *
   * On a tint ground (`ground: tint`) add `fx-card_on-tint` to every card: the
   * system never stacks tint on tint.
   */

  type Card = {
    /* The kind's name, set as the card's kicker. Caps, 2-3 words. */
    heading: string;
    /* Two to four points, each a short line. The first is the one that matters. */
    points: string[];
  };

  const cards: Card[] = [
    { heading: 'First kind', points: ['The point that carries the card', 'A second point', 'A third point'] },
    { heading: 'Second kind', points: ['What this kind is for', 'What it needs', 'What it gives back'] },
    { heading: 'Third kind', points: ['The part already in place', 'What it covers', 'Where it stops'] },
    { heading: 'Fourth kind', points: ['The part still moving', 'What it waits on', 'What decides it'] },
  ];
</script>

<template>
  <div class="deck-cols deck-cols_4">
    <div v-for="card of cards" :key="card.heading" class="fx-card">
      <div class="fx-kicker">{{ card.heading }}</div>
      <p v-for="point of card.points" :key="point" class="deck-card-body">{{ point }}</p>
    </div>
  </div>
</template>
