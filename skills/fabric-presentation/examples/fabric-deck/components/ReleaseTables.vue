<script setup lang="ts">
  /*
   * Template v4's table (v4-08, layout Table or Chart): square corners, a
   * 0.75pt grid on every cell, a navy header in 13pt bold white, body rows in
   * 13pt ink alternating white and tint, text at the top of each cell. The
   * whole shape is .fx-table in fabric-tokens.css. Every value is a
   * placeholder.
   */
  type Row = { name: string; detail: string; version: string; note: string };

  const rows: Row[] = [
    { name: 'template-shell', detail: 'Menu, themes, routing', version: '1.x', note: 'Installed once per project' },
    { name: 'template-mfe', detail: 'One screen as a micro frontend', version: '1.x', note: 'One add per screen' },
    { name: 'Screen templates', detail: 'Lists, forms, dashboards', version: '0.x', note: 'Pilot, N teams' },
    { name: 'Your own template', detail: 'Own UI kit, own screens', version: 'Yours', note: 'Registered by the same install' },
  ];
</script>

<template>
  <table class="fx-table">
    <colgroup>
      <col style="width: 25%" />
      <col style="width: 31%" />
      <col style="width: 12%" />
      <col />
    </colgroup>
    <thead>
      <tr><th>Template</th><th>What it carries</th><th>Version</th><th>Where it stands</th></tr>
    </thead>
    <tbody>
      <tr v-for="row of rows" :key="row.name">
        <td>{{ row.name }}</td>
        <td>{{ row.detail }}</td>
        <td>{{ row.version }}</td>
        <td>{{ row.note }}</td>
      </tr>
    </tbody>
  </table>
</template>
