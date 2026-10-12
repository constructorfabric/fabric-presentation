<script setup lang="ts">
  /*
   * Template v4, layout Comparison (layout 13): two cards of equal weight,
   * 577.6 x 297.6 on a 28.8 gutter, neither marked; inside, the kicker and the
   * points in 15pt ink at lnSpc 150%. The decision line belongs in the notes.
   */
  type Option = { kicker: string; points: string[] };

  const options: Option[] = [
    {
      kicker: 'Option A - the shell template first',
      points: [
        'One menu, one router and one theme set for every team',
        'The upgrade path exists from day one',
        'Screens keep their current builds for now',
        'One release train has to be re-planned',
      ],
    },
    {
      kicker: 'Option B - the screen template first',
      points: [
        'A team sees the benefit inside one screen',
        'No coordination with other projects is needed',
        'The shells stay duplicated for N more quarters',
        'Themes drift until the shell template arrives',
      ],
    },
  ];
</script>

<template>
  <div class="deck-cols deck-cols_2 deck-compare">
    <div v-for="option of options" :key="option.kicker" class="fx-card">
      <div class="fx-kicker">{{ option.kicker }}</div>
      <p v-for="point of option.points" :key="point" class="deck-card-body">{{ point }}</p>
    </div>
  </div>
</template>
