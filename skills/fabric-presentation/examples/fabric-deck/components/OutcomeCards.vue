<script setup lang="ts">
  /*
   * Template v4, layout Four Columns (layout 12): four equal cards, 274.4 x
   * 297.6 on a 28.8 gutter; the blue caps kicker, 8pt under it the body in 13pt
   * ink at lnSpc 130%. No card is filled: the template marks none.
   */
  type Outcome = { title: string; body: string };

  const outcomes: Outcome[] = [
    { title: 'Reproducibility', body: 'The project is materialized from versioned templates by commands that do the same thing every time.' },
    { title: 'Traceability', body: 'The passport remembers the source of every piece, and an upgrade arrives as a reviewable diff.' },
    { title: 'Team isolation', body: 'Every screen is a standalone micro frontend with its own build and its own Shadow DOM.' },
    { title: 'Extensibility', body: 'A team registers its own template with its own UI kit, and it takes the same path.' },
  ];
</script>

<template>
  <div class="deck-cols deck-cols_4">
    <div v-for="outcome of outcomes" :key="outcome.title" class="fx-card">
      <div class="fx-kicker">{{ outcome.title }}</div>
      <p class="deck-card-body">{{ outcome.body }}</p>
    </div>
  </div>
</template>
