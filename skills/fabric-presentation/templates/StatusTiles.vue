<script setup lang="ts">
  /*
   * Template case: status-tiles.
   *
   * Three cards, each a named thing with its state, under a line that says
   * which way the work moves. Distilled from a presented and reviewed slide and
   * built on template v4's Three Columns layout (v4-07): cards 297.6 high from
   * the content top, each the 12pt accent-blue kicker over its body. The lead
   * line sits where v4-11 sets its subtitle: 18pt navy under the title.
   *
   * State is a WORD in bold under the kicker. These states - in progress, next,
   * on the roadmap - are not the template's status trio (on track, at risk,
   * blocked), so green, amber and red stay out. Exactly one tile carries
   * `current`, and its state word takes the accent blue: the mark has to land
   * on one thing for the eye to find it, and two marked tiles send the viewer
   * hunting for the difference.
   */

  type Tile = {
    name: string;
    status: string;
    current: boolean;
    note: string;
  };

  const lead = 'One line saying what the set below is a picture of.';

  /* The direction reads left to right: what moves, and where it lands. */
  const direction = { from: 'Source', to: 'Target' };

  const tiles: Tile[] = [
    { name: 'First item', status: 'In progress', current: true, note: 'Two lines at most. What this item is, and what state it is in.' },
    { name: 'Second item', status: 'Next in line', current: false, note: 'What waits on the first, and what it gives once it lands.' },
    { name: 'Third item', status: 'On the roadmap', current: false, note: 'The furthest out. Say what it depends on, not when it arrives.' },
  ];
</script>

<template>
  <p class="deck-frame deck-guide-sub" style="--x: 0; --y: -37.8; --w: 1165">
    {{ lead }} <b class="tpl-direction">{{ direction.from }} &rarr; {{ direction.to }}</b>
  </p>

  <div class="deck-cols deck-cols_3">
    <div v-for="tile of tiles" :key="tile.name" class="fx-card">
      <div class="fx-kicker">{{ tile.name }}</div>
      <p class="deck-card-body tpl-state" :class="{ 'tpl-state_current': tile.current }">{{ tile.status }}</p>
      <p class="deck-card-body">{{ tile.note }}</p>
    </div>
  </div>
</template>

<style scoped>
  .tpl-direction,
  .tpl-state {
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-state_current {
    color: var(--fx-blue);
  }
</style>
