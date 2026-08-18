<script setup lang="ts">
  /*
   * Template case: quarter-table.
   *
   * The house roadmap table: a navy header band naming the periods, a tint
   * band under it carrying one claim per period, then row groups with a navy
   * row label and marked references in the cells. Built from the rendered
   * donors, tpl-21 ("Data / results": solid --fx-navy header, white
   * bold, --fx-tint zebra rows, --fx-line hairlines, no vertical walls) and exm-13
   * (the --fx-tint-band "Main takeaway" band with navy bold text).
   *
   * The Fabric divergence: the claim row under the header is a TINT band, not
   * a saturated one. It stays the row a reader remembers because it is the
   * only band in the body of the table and because its text is navy bold -
   * weight and position, which is how this system marks importance.
   *
   * Keep: two header rows in that order (navy naming the columns, the tint
   * band saying what each column is FOR), no vertical rules, a hairline
   * between row groups, rounded outer corners, and every reference navy bold.
   * Four periods fit; five makes the claims wrap to three lines.
   */

  type Row = {
    /* The row label: what kind of work this row is. Navy bold. */
    label: string;
    /* One cell per period, each a short list. A cell may be empty - the donors
       leave plenty blank rather than padding them. */
    cells: string[][];
  };

  const periods = ['26-Q1', '26-Q2', '26-Q3', '26-Q4'];

  /* The tint band: one claim per period, and it must be a claim, not a label. */
  const focus = [
    'What the first period is for',
    'What the second period is for',
    'What the third period is for',
    'What the fourth period is for',
  ];

  const rows: Row[] = [
    {
      label: 'First kind of work',
      cells: [
        ['An item, with its reference [REF-1001]', 'A second item'],
        ['An item [REF-1002]'],
        ['An item'],
        [],
      ],
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
  <table class="tpl-qt">
    <thead>
      <tr class="tpl-qt-head">
        <th class="tpl-qt-corner">Category</th>
        <th v-for="period of periods" :key="period">{{ period }}</th>
      </tr>
      <tr class="tpl-qt-focus">
        <th class="tpl-qt-focus-label">Key focus</th>
        <td v-for="(claim, index) of focus" :key="index">{{ claim }}</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row of rows" :key="row.label">
        <th class="tpl-qt-label">{{ row.label }}</th>
        <td v-for="(cell, index) of row.cells" :key="index">
          <ul v-if="cell.length" class="tpl-qt-list">
            <li v-for="item of cell" :key="item">
              <span v-for="(part, partIndex) of parts(item)" :key="partIndex" :class="{ 'tpl-marked': part.marked }">{{ part.text }}</span>
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
  /* Every value comes from assets/fabric-tokens.css. */
  .tpl-qt {
    /* The table fills the content box: the rows stretch rather than leaving a
       white band under the last one. `separate` rather than `collapse`, because
       a collapsed table cannot carry the rounded outer corners the system asks
       of every container. */
    block-size: 100%;
    border-collapse: separate;
    border-spacing: 0;
    color: var(--fx-text);
    font-family: var(--fx-font);
    font-size: var(--fx-size-text);
    inline-size: 100%;
    table-layout: fixed;
  }

  /* No vertical rules anywhere: that is the whole table pattern in one line. */
  .tpl-qt th,
  .tpl-qt td {
    border: none;
    padding-block: calc(7 * var(--fx-pt));
    padding-inline: calc(10 * var(--fx-pt));
    text-align: start;
    vertical-align: top;
  }

  /* Row 1: the periods, on the navy band. White bold. */
  .tpl-qt-head th {
    background: var(--fx-navy);
    color: var(--fx-text-inverted);
    font-size: var(--fx-size-text);
    font-weight: var(--fx-weight-bold);
    text-align: center;
  }

  .tpl-qt-corner,
  .tpl-qt-focus-label {
    inline-size: 16%;
    text-align: start;
  }

  /* Row 2: what each period is FOR. The band tint with navy bold text - the
     one band in the body of the table, and the row a reader remembers. */

  .tpl-qt-focus th,
  .tpl-qt-focus td {
    background: var(--fx-tint-band);
    color: var(--fx-navy);
    font-size: var(--fx-size-text);
    font-weight: var(--fx-weight-bold);
    line-height: 1.25;
    text-align: center;
  }

  .tpl-qt-focus .tpl-qt-focus-label {
    text-align: start;
  }

  /* Body: hairline rules between the groups, and the zebra the donors set on
     every other row (tpl-21). */

  .tpl-qt tbody tr + tr th,
  .tpl-qt tbody tr + tr td {
    border-block-start: var(--fx-rule-hairline) solid var(--fx-rule);
  }

  .tpl-qt tbody tr:nth-child(even) th,
  .tpl-qt tbody tr:nth-child(even) td {
    background: var(--fx-surface-tint);
  }

  .tpl-qt-label {
    color: var(--fx-text-title);
    font-size: var(--fx-size-text);
    font-weight: var(--fx-weight-bold);
    line-height: 1.25;
  }

  /* Rounded outer corners. A table cannot clip its own overflow reliably, so
     the four corner cells carry the radius themselves. */

  .tpl-qt-head th:first-child {
    border-start-start-radius: var(--fx-radius);
  }

  .tpl-qt-head th:last-child {
    border-start-end-radius: var(--fx-radius);
  }

  .tpl-qt tbody tr:last-child th:first-child {
    border-end-start-radius: var(--fx-radius);
  }

  .tpl-qt tbody tr:last-child td:last-child {
    border-end-end-radius: var(--fx-radius);
  }

  .tpl-qt-list {
    margin: 0;
    line-height: 1.35;
    padding-inline-start: calc(12 * var(--fx-pt));
  }

  .tpl-qt-list li + li {
    margin-block-start: calc(4 * var(--fx-pt));
  }

  /* The marked reference: navy bold inside ink prose. Depth and weight, which
     is the only emphasis a monochrome system has. */

  .tpl-marked {
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }
</style>
