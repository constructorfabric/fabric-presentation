<script setup lang="ts">
  /*
   * Donor layouts: Big Stats (tpl-13, three tiles at 40pt) with EXM's louder
   * single stat under them (exm-12, one number at 54pt in the accent blue).
   *
   * The two sizes are a hierarchy, not a decoration: the three tiles are the
   * readings, the one large number is the reading the room has to leave with.
   * That is also why the accent is spent once - the tiles set their numbers in
   * the structure navy, and the accent blue lands only on the hero figure.
   *
   * Every figure here is a placeholder. A number on a Fabric slide names what it
   * measures directly under it, because a bare figure invites the audience to
   * supply the units themselves.
   */

  type Stat = { value: string; unit?: string; label: string; note: string };

  const tiles: Stat[] = [
    {
      value: '2',
      unit: 'templates',
      label: 'Registered to start',
      note: 'The shell and the screen micro frontend, installed once into the local inventory.',
    },
    {
      value: '1',
      unit: 'command',
      label: 'Per screen added',
      note: 'Every further screen is one more add of the same versioned template.',
    },
    {
      value: '1',
      unit: 'upgrade path',
      label: 'For every project',
      note: 'A version bump arrives as a diff to review, not as a migration to write.',
    },
  ];

  const hero = {
    value: 'N teams',
    label: 'assemble their console from the same two templates',
    note: 'Placeholder figure: replace it with the adoption number the deck is actually reporting.',
  };
</script>

<template>
  <div class="deck-body">
    <div class="stats-row">
      <article v-for="tile of tiles" :key="tile.label" class="stats-tile">
        <p class="stats-value">
          {{ tile.value }}<span v-if="tile.unit" class="stats-unit">{{ tile.unit }}</span>
        </p>
        <h3 class="stats-label">{{ tile.label }}</h3>
        <p class="stats-note">{{ tile.note }}</p>
      </article>
    </div>

    <!-- The louder variant: one figure at 54pt beside the sentence that says
         what it measures. It is ruled off from the tiles rather than boxed - a
         box would make it a fourth tile instead of the conclusion of three. -->
    <section class="stats-hero">
      <p class="stats-hero-value">{{ hero.value }}</p>
      <div class="stats-hero-text">
        <p class="stats-hero-label">{{ hero.label }}</p>
        <p class="stats-note">{{ hero.note }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. */

  .stats-row {
    display: grid;
    flex: none;
    align-items: stretch;
    gap: calc(16 * var(--fx-pt));
    grid-template-columns: repeat(3, 1fr);
  }

  .stats-tile {
    display: flex;
    flex-direction: column;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: var(--fx-radius);
    background: var(--fx-surface-tint);
    gap: calc(5 * var(--fx-pt));
    padding: calc(18 * var(--fx-pt));
  }

  /* tpl-13's 40pt figure, in the structure navy. The unit rides beside it at
     body size so the number keeps its own weight. */

  .stats-value {
    margin: 0;
    color: var(--fx-navy);
    font-size: var(--fx-size-stat-tile);
    font-variant-numeric: tabular-nums;
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title);
    line-height: 1.05;
  }

  .stats-unit {
    color: var(--fx-text-muted);
    font-size: var(--fx-size-body);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    margin-inline-start: calc(7 * var(--fx-pt));
  }

  .stats-label {
    margin: 0;
    color: var(--fx-text-title);
    font-size: var(--fx-size-body);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.2;
  }

  .stats-note {
    margin: 0;
    color: var(--fx-text);
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
  }

  .stats-hero {
    display: flex;
    flex: none;
    align-items: center;
    border-block-start: var(--fx-rule-hairline) solid var(--fx-rule);
    gap: calc(24 * var(--fx-pt));
    margin-block-start: calc(20 * var(--fx-pt));
    padding-block-start: calc(16 * var(--fx-pt));
  }

  /* EXM's 54pt figure, and the one place the accent blue lands on this slide. */

  .stats-hero-value {
    flex: none;
    margin: 0;
    color: var(--fx-text-accent);
    font-size: var(--fx-size-stat);
    font-variant-numeric: tabular-nums;
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title);
    line-height: 1;
  }

  .stats-hero-text {
    display: flex;
    flex-direction: column;
    gap: calc(5 * var(--fx-pt));
  }

  .stats-hero-label {
    margin: 0;
    color: var(--fx-text-title);
    font-size: var(--fx-size-body-lg);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.25;
  }
</style>
