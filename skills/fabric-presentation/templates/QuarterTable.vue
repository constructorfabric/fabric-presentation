<script setup lang="ts">
  /*
   * Template case: quarter-table.
   *
   * The roadmap as template v4's table (v4-08, layout Table or Chart): square
   * corners, a 0.75pt #DCE3EE line on every side of every cell, the navy
   * header row naming the periods in 13pt bold white, body rows in 13pt ink
   * alternating white and tint, text at the TOP of each cell - all of it
   * .fx-table in fabric-tokens.css, so this case adds nothing but its marks.
   *
   * The first body row says what each period is FOR, one claim per period, set
   * in navy bold: weight and position are how this system marks importance, and
   * the table has no second header band. Then one row per kind of work, the
   * references inside the cells in navy bold. Four periods fit; five makes the
   * claims wrap to three lines.
   */

  type Row = {
    /* The row label: what kind of work this row is. */
    label: string;
    /* One cell per period, each a short list. A cell may be empty - leave it
       blank rather than padding it. */
    cells: string[][];
  };

  const periods = ['26-Q1', '26-Q2', '26-Q3', '26-Q4'];

  /* One claim per period, and it must be a claim, not a label. */
  const focus = [
    'What the first period is for',
    'What the second period is for',
    'What the third period is for',
    'What the fourth period is for',
  ];

  const rows: Row[] = [
    {
      label: 'First kind of work',
      cells: [['An item, with its reference [REF-1001]', 'A second item'], ['An item [REF-1002]'], ['An item'], []],
    },
    {
      label: 'Second kind of work',
      cells: [['An item [REF-1003]'], ['An item', 'A second item [REF-1004]'], [], ['An item']],
    },
    {
      label: 'Third kind of work',
      cells: [['An item'], ['An item [REF-1005]'], ['An item'], ['An item']],
    },
  ];

  /* A reference inside a cell is navy bold. The split keeps the marked token in
     its own span without touching the copy. */
  const parts = (item: string): { text: string; marked: boolean }[] =>
    item
      .split(/(\[[^\]]+\])/)
      .filter(Boolean)
      .map((chunk) => ({ text: chunk, marked: chunk.startsWith('[') }));
</script>

<template>
  <table class="fx-table">
    <colgroup>
      <col style="width: 20%" />
      <col v-for="period of periods" :key="period" />
    </colgroup>
    <thead>
      <tr>
        <th>Category</th>
        <th v-for="period of periods" :key="period">{{ period }}</th>
      </tr>
    </thead>
    <tbody>
      <tr class="tpl-focus">
        <th scope="row">Key focus</th>
        <td v-for="(claim, index) of focus" :key="index">{{ claim }}</td>
      </tr>
      <tr v-for="row of rows" :key="row.label">
        <th scope="row">{{ row.label }}</th>
        <td v-for="(cell, index) of row.cells" :key="index">
          <p v-for="item of cell" :key="item" class="tpl-item">
            <span v-for="(part, partIndex) of parts(item)" :key="partIndex" :class="{ 'tpl-marked': part.marked }">{{ part.text }}</span>
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
  /* Everything else is .fx-table. */

  .tpl-focus td,
  .tpl-focus th,
  .tpl-marked {
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-item {
    margin: 0;
  }
</style>
