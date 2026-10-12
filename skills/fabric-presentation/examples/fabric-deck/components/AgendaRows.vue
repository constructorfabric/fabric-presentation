<script setup lang="ts">
  /*
   * Template v4, layout Agenda (layout 4). The slide sits on the tint ground
   * (`ground: tint` in its frontmatter); one frame at the content top, 883.2
   * wide, rows of 17pt ink at lnSpc 170%: the number, three spaces, the item,
   * a dash and its note - plain text in one colour, no rules, the way the
   * template writes "01   Welcome & introductions - 10 min".
   */
  type Item = { title: string; note: string };

  const items: Item[] = [
    { title: 'Where the time goes today', note: 'shell, router, themes, build' },
    { title: 'The four layers', note: 'libraries, templates, CLI, project' },
    { title: 'What materialization buys', note: 'a project on its first day' },
    { title: 'How a project is assembled', note: 'one prompt, one plan' },
    { title: 'The rollout', note: 'what lands each quarter' },
  ];

  const row = (index: number, item: Item) =>
    `${String(index + 1).padStart(2, '0')}   ${item.title} - ${item.note}`;
</script>

<template>
  <ol class="deck-frame deck-agenda" style="--x: 0; --y: 0; --w: 883.2">
    <li v-for="(item, index) of items" :key="item.title">{{ row(index, item) }}</li>
  </ol>
</template>
