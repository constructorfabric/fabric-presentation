<script setup lang="ts">
  /*
   * A status table in the form of template v4's guide page (v4-11): the
   * template's square table with a navy header, and the status column as the
   * guide draws it - the cell filled with the status tint, the status word in
   * bold status ink. Green, amber and red go nowhere else on the slide: no row
   * fill, no heading, no chart. Every row is a placeholder.
   */
  type State = 'on-track' | 'at-risk' | 'blocked';

  const label: Record<State, string> = {
    'on-track': 'On track',
    'at-risk': 'At risk',
    blocked: 'Blocked',
  };

  type Row = { name: string; state: State; next: string };

  const rows: Row[] = [
    { name: 'Shell template', state: 'on-track', next: 'Release candidate this sprint' },
    { name: 'Screen templates', state: 'on-track', next: 'Pilot with two teams' },
    { name: 'Type registry', state: 'at-risk', next: 'Waiting on a schema sign-off' },
    { name: 'Federated build', state: 'on-track', next: 'Load test next week' },
    { name: 'Billing migration', state: 'blocked', next: 'Needs a decision on data ownership' },
  ];
</script>

<template>
  <table class="fx-table deck-guide-table">
    <colgroup>
      <col style="width: 27%" />
      <col style="width: 19%" />
      <col />
    </colgroup>
    <thead>
      <tr><th>Workstream</th><th>Status</th><th>Next step</th></tr>
    </thead>
    <tbody class="deck-guide-plain">
      <tr v-for="row of rows" :key="row.name">
        <td>{{ row.name }}</td>
        <td :class="`fx-status-cell_${row.state}`">{{ label[row.state] }}</td>
        <td>{{ row.next }}</td>
      </tr>
    </tbody>
  </table>
</template>
