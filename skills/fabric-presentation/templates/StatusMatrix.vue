<script setup lang="ts">
  /*
   * Template case: status-matrix.
   *
   * A capability matrix whose every cell is readable at a glance, on template
   * v4's table (.fx-table, v4-08: square, full 0.75pt grid, navy header, 13pt).
   * The rows do not alternate here: the cells carry the state, and a zebra
   * under them would read as a second state.
   *
   * The vocabulary for state, dark to light, so "how much of this is there"
   * reads as weight down a column:
   *
   *   present  navy fill, white bold      - the heaviest thing on the grid
   *   deferred --fx-tint-band, navy        - present but not yet
   *   partial  --fx-tint, navy             - the quietest filled state
   *   absent   white, muted ink           - the lightest, and it recedes
   *
   * Yes / no is not a status in the template's sense, so green, amber and red
   * stay out of it. Every cell ALSO carries its word: the fill is the second
   * reading, never the only one.
   *
   * A filled grid says "this comparison is complete". Only use it for a set
   * you can defend cell by cell, and put the source of each column in the notes.
   */

  type State = 'yes' | 'no' | 'defer' | 'part';

  type Row = {
    /* The capability. One line. */
    feature: string;
    /* One state per column, plus the word that goes in the cell. The word is
       not optional - it is what the state means. */
    cells: { state: State; text: string }[];
  };

  const columns = ['Ours', 'First other', 'Second other'];

  const rows: Row[] = [
    { feature: 'The first capability', cells: [{ state: 'yes', text: 'Yes' }, { state: 'no', text: 'No' }, { state: 'yes', text: 'Yes' }] },
    { feature: 'The second capability', cells: [{ state: 'yes', text: 'Yes' }, { state: 'no', text: 'No' }, { state: 'no', text: 'No' }] },
    { feature: 'The third capability', cells: [{ state: 'defer', text: 'Q2 26' }, { state: 'yes', text: 'Yes' }, { state: 'no', text: 'No' }] },
    { feature: 'The fourth capability', cells: [{ state: 'yes', text: 'Yes' }, { state: 'part', text: 'Partly' }, { state: 'no', text: 'No' }] },
    { feature: 'The fifth capability', cells: [{ state: 'no', text: 'No' }, { state: 'no', text: 'No' }, { state: 'yes', text: 'Yes' }] },
  ];
</script>

<template>
  <table class="fx-table tpl-mx">
    <colgroup>
      <col style="width: 34%" />
      <col v-for="column of columns" :key="column" />
    </colgroup>
    <thead>
      <tr>
        <th>Capability</th>
        <th v-for="column of columns" :key="column">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row of rows" :key="row.feature">
        <th scope="row">{{ row.feature }}</th>
        <td v-for="(cell, index) of row.cells" :key="index" :class="`tpl-mx-cell_${cell.state}`">{{ cell.text }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
  .tpl-mx tbody tr:nth-child(even) {
    background: var(--fx-surface);
  }

  .tpl-mx-cell_yes {
    background: var(--fx-navy);
    color: var(--fx-text-inverted);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-mx-cell_defer {
    background: var(--fx-tint-band);
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-mx-cell_part {
    background: var(--fx-surface-tint);
    color: var(--fx-navy);
  }

  .tpl-mx-cell_no {
    color: var(--fx-text-muted);
  }
</style>
