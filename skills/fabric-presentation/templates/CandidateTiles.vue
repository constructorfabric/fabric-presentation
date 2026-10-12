<script setup lang="ts">
  /*
   * Template case: candidate-tiles.
   *
   * The counter-direction of status-tiles: the same three v4 cards (Three
   * Columns, v4-07), with the direction running the other way. Use it when the
   * set is proposals rather than progress. Every tile carries the same state
   * word, in muted ink, because none of them outranks the others yet - no card
   * and no word is marked, since three peer proposals have no "this one".
   *
   * The lead line says who offers what to whom, and that the set is offered,
   * not agreed: candidates are not commitments, and the slide has to say which
   * it is.
   */

  type Candidate = {
    name: string;
    note: string;
  };

  const lead = 'One line saying who is offering what - offered, not agreed.';

  /* Reversed against the status-tiles case, so the pair reads as two
     directions of one exchange. */
  const direction = { from: 'Target', to: 'Source' };

  const state = 'Candidate';

  const candidates: Candidate[] = [
    { name: 'First candidate', note: 'What exists on this side already, and what the other side lacks.' },
    { name: 'Second candidate', note: 'A capability, not a wish. Name the thing that runs today.' },
    { name: 'Third candidate', note: 'The one whose shape is least settled. Say so here, not in a caveat.' },
  ];
</script>

<template>
  <p class="deck-frame deck-guide-sub" style="--x: 0; --y: -37.8; --w: 1165">
    {{ lead }} <b class="tpl-direction">{{ direction.from }} &rarr; {{ direction.to }}</b>
  </p>

  <div class="deck-cols deck-cols_3">
    <div v-for="candidate of candidates" :key="candidate.name" class="fx-card">
      <div class="fx-kicker">{{ candidate.name }}</div>
      <p class="deck-card-body tpl-state">{{ state }}</p>
      <p class="deck-card-body">{{ candidate.note }}</p>
    </div>
  </div>
</template>

<style scoped>
  .tpl-direction {
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-state {
    color: var(--fx-text-muted);
    font-weight: var(--fx-weight-bold);
  }
</style>
