<script setup lang="ts">
  /*
   * Template case: quarter-table (tpl-21) - twice on one slide.
   *
   * The anatomy is the donors': a navy header band with white bold caps, zebra
   * body rows, hairline rules, no vertical walls, and rounded outer corners on
   * the container. The header band is legal because it spans the whole table -
   * it is the table's own head, not a strip inside a card (the in-card heading
   * shape is the kicker over a hairline).
   *
   * Two tables rather than one because they answer two different questions, and
   * a single table would have to invent a column that means nothing in half its
   * rows. They stack rather than sit side by side: the wide one needs the full
   * content width for its three columns, and the narrow one under it reads as a
   * footnote to it rather than as a competitor.
   *
   * Every figure below is a placeholder.
   */

  type Row = { name: string; detail: string; when: string; note: string };

  const rows: Row[] = [
    { name: 'template-shell', detail: 'menu, themes, routing', when: '1.x', note: 'installed once per project' },
    { name: 'template-mfe', detail: 'one screen as a micro frontend', when: '1.x', note: 'one add per screen' },
    { name: 'Screen templates', detail: 'lists, forms, dashboards', when: '0.x', note: 'pilot, N teams' },
    { name: 'Your own template', detail: 'own UI kit, own screens', when: 'yours', note: 'registered by the same install' },
  ];

  const compactLabel = 'What the assembled project carries out of the box';

  type Compact = { name: string; value: string };

  const compact: Compact[] = [
    { name: 'Themes', value: 'light and dark, from the shared tokens' },
    { name: 'Type system', value: 'a screen declaration validated by schema before runtime' },
    { name: 'Isolation', value: 'one federated module per screen, styles in Shadow DOM' },
  ];
</script>

<template>
  <div class="deck-body">
    <div class="deck-runs">
      <div class="deck-runs-table">
        <div class="deck-runs-row deck-runs-row_head">
          <div>Template</div>
          <div>Version</div>
          <div>Where it stands</div>
        </div>

        <div
          v-for="(row, index) of rows"
          :key="row.name"
          class="deck-runs-row"
          :class="{ 'deck-runs-row_band': index % 2 === 1 }"
        >
          <div class="deck-runs-agent">
            {{ row.name }}<span class="deck-runs-model">{{ row.detail }}</span>
          </div>
          <div class="deck-runs-time">{{ row.when }}</div>
          <div class="deck-runs-tokens">{{ row.note }}</div>
        </div>
      </div>

      <p class="deck-runs-ctl-label">{{ compactLabel }}</p>

      <!-- The compact table: the same object with two columns instead of three,
           so the pair reads as one family rather than as two designs. -->
      <div class="deck-runs-table table-compact">
        <div
          v-for="(item, index) of compact"
          :key="item.name"
          class="deck-runs-row table-compact-row"
          :class="{ 'deck-runs-row_band': index % 2 === 1 }"
        >
          <div class="deck-runs-agent">{{ item.name }}</div>
          <div class="deck-runs-tokens">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* The table furniture is in ../style.css §5; only the compact table's own
     column split belongs here. */

  .table-compact-row {
    grid-template-columns: 1fr 3fr;
  }
</style>
