<script setup lang="ts">
  /*
   * Template case: status-matrix.
   *
   * A capability matrix where the state of every cell is readable at a glance
   * without a single hue. Built from the rendered donors: the
   * table anatomy of tpl-21 (navy header band, white bold, --fx-tint zebra,
   * --fx-line hairlines) and the band tint of exm-13.
   *
   * The Fabric vocabulary for state, and the reason it works in one colour:
   *
   *   present  navy fill, white bold      - the heaviest thing on the grid
   *   deferred --fx-tint-band band tint, navy    - present but not yet
   *   partial  --fx-tint card tint, navy    - the quietest filled state
   *   absent   white, hairline, muted ink - the lightest, and it recedes
   *
   * The ladder runs dark to light, so "how much of this is there" is legible
   * as weight down the column. Every cell ALSO carries its word: the fill is
   * the second reading, never the only one, and a cell that says nothing but
   * its colour is the anti-pattern this system exists to avoid.
   *
   * The form makes a strong claim: a filled grid says "this comparison is
   * complete". Only use it for a set you can defend cell by cell, and put the
   * source of each column in the notes.
   */

  type State = 'yes' | 'no' | 'defer' | 'part';

  type Row = {
    /* The capability. One line, ink, in the tint label column. */
    feature: string;
    /* One state per column, plus the word that goes in the cell. The word is
       not optional - it is what the state means. */
    cells: { state: State; text: string }[];
  };

  const columns = ['Ours', 'First other', 'Second other'];

  const rows: Row[] = [
    {
      feature: 'The first capability',
      cells: [
        { state: 'yes', text: 'Yes' },
        { state: 'no', text: 'No' },
        { state: 'yes', text: 'Yes' },
      ],
    },
    {
      feature: 'The second capability',
      cells: [
        { state: 'yes', text: 'Yes' },
        { state: 'no', text: 'No' },
        { state: 'no', text: 'No' },
      ],
    },
    {
      feature: 'The third capability',
      cells: [
        { state: 'defer', text: 'Q2 26' },
        { state: 'yes', text: 'Yes' },
        { state: 'no', text: 'No' },
      ],
    },
    {
      feature: 'The fourth capability',
      cells: [
        { state: 'yes', text: 'Yes' },
        { state: 'part', text: 'Partly' },
        { state: 'no', text: 'No' },
      ],
    },
    {
      feature: 'The fifth capability',
      cells: [
        { state: 'no', text: 'No' },
        { state: 'no', text: 'No' },
        { state: 'yes', text: 'Yes' },
      ],
    },
  ];
</script>

<template>
  <table class="tpl-mx">
    <thead>
      <tr>
        <th class="tpl-mx-corner">Capability</th>
        <th v-for="column of columns" :key="column">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row of rows" :key="row.feature">
        <th class="tpl-mx-label">{{ row.feature }}</th>
        <td v-for="(cell, index) of row.cells" :key="index" :class="`tpl-mx-cell_${cell.state}`">
          {{ cell.text }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
  /* Every value comes from assets/fabric-tokens.css. */
  .tpl-mx {
    /* The matrix fills the content box: the grid IS the argument, so it gets
       the room. `separate` rather than `collapse`, because a collapsed table
       cannot carry rounded outer corners. */
    block-size: 100%;
    border-collapse: separate;
    border-spacing: 0;
    color: var(--fx-text);
    font-family: var(--fx-font);
    font-size: var(--fx-size-text);
    inline-size: 100%;
    table-layout: fixed;
  }

  .tpl-mx th,
  .tpl-mx td {
    border: none;
    padding-block: calc(6 * var(--fx-pt));
    padding-inline: calc(10 * var(--fx-pt));
    text-align: center;
  }

  /* The header: the navy band, white bold - the same band as any other table
     in the deck. */

  .tpl-mx thead th {
    background: var(--fx-navy);
    color: var(--fx-text-inverted);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-mx-corner,
  .tpl-mx-label {
    inline-size: 34%;
    text-align: start;
  }

  /* The label column recedes on the card tint, so the eye reads across the
     value cells rather than down the names. */

  .tpl-mx-label {
    background: var(--fx-surface-tint);
    color: var(--fx-text);
    font-size: var(--fx-size-text);
    font-weight: var(--fx-weight-regular);
  }

  /* A hairline between rows, and nothing vertical: the columns are held apart
     by the fills, not by walls. */

  .tpl-mx tbody tr + tr th,
  .tpl-mx tbody tr + tr td {
    border-block-start: var(--fx-rule-hairline) solid var(--fx-rule);
  }

  /* Present: the heaviest cell on the grid. White bold on navy - never white
     on the accent blue. */

  .tpl-mx-cell_yes {
    background: var(--fx-navy);
    color: var(--fx-text-inverted);
    font-weight: var(--fx-weight-bold);
  }

  /* Deferred: the band tint under navy bold. Present, but not yet. */
  .tpl-mx-cell_defer {
    background: var(--fx-tint-band);
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }

  /* Partial: the card tint, one step quieter than deferred. */
  .tpl-mx-cell_part {
    background: var(--fx-surface-tint);
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }

  /* Absent: no fill at all, a hairline to keep the cell in the grid, and the
     muted ink. It is the lightest thing on the slide, which is the whole
     argument - an empty cell should look empty. The word still says "No",
     because a viewer must never have to decode a colour. */

  .tpl-mx-cell_no {
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    background: var(--fx-surface);
    color: var(--fx-text-muted);
  }

  /* Rounded outer corners: a table cannot clip its own overflow reliably, so
     the four corner cells carry the radius themselves. */

  .tpl-mx thead th:first-child {
    border-start-start-radius: var(--fx-radius);
  }

  .tpl-mx thead th:last-child {
    border-start-end-radius: var(--fx-radius);
  }

  .tpl-mx tbody tr:last-child th:first-child {
    border-end-start-radius: var(--fx-radius);
  }

  .tpl-mx tbody tr:last-child td:last-child {
    border-end-end-radius: var(--fx-radius);
  }
</style>
