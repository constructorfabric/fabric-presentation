<script setup lang="ts">
  /*
   * Template v4, layout Big Stats (layout 14): three cards 249.6 high starting
   * 86.4 below the content top, each a 40pt bold navy number centred over its
   * label. Every figure is a placeholder.
   */
  type Stat = { value: string; label: string };

  const tiles: Stat[] = [
    { value: '2', label: 'Templates registered to start: the shell and the screen' },
    { value: '1', label: 'Command for every further screen' },
    { value: '1', label: 'Upgrade path, the same for every project' },
  ];
</script>

<template>
  <div class="deck-cols deck-cols_3 deck-stats">
    <div v-for="tile of tiles" :key="tile.label" class="fx-card">
      <div class="fx-metric-value">{{ tile.value }}</div>
      <p class="deck-card-body">{{ tile.label }}</p>
    </div>
  </div>
</template>
