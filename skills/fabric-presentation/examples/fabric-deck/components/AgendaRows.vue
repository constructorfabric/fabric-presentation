<script setup lang="ts">
  /*
   * Donor layout: Agenda (tpl-03).
   *
   * Numbered rows down the page, each one a part of the deck with a line saying
   * what it settles. The number is the structure marker - navy, tabular, sitting
   * in its own column so the row titles start on one line whatever the digits do
   * - and the rows are separated by hairlines rather than by boxes, because an
   * agenda is a list and not a set of cards.
   */

  type Item = { title: string; note: string };

  const items: Item[] = [
    { title: 'Where the time goes today', note: 'What every team writes again: shell, router, themes, build' },
    { title: 'The four layers', note: 'Libraries, templates, the CLI, and the project they assemble' },
    { title: 'What materialization buys', note: 'What a project carries on its first day' },
    { title: 'How a project is assembled', note: 'One prompt, one plan, one set of commands' },
    { title: 'The rollout', note: 'What lands each quarter and what waits' },
  ];
</script>

<template>
  <div class="deck-body">
    <ol class="agenda">
      <li v-for="(item, index) of items" :key="item.title" class="agenda-row">
        <span class="agenda-no">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="agenda-text">
          <span class="agenda-title">{{ item.title }}</span>
          <span class="agenda-note">{{ item.note }}</span>
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. */

  .agenda {
    display: flex;
    flex-direction: column;
    margin: 0;
    list-style: none;
    padding: 0;
  }

  /* The number column is fixed, so every title starts on the same vertical line
     and the list reads as one column rather than five indented rows. */

  .agenda-row {
    display: grid;
    align-items: baseline;
    column-gap: calc(18 * var(--fx-pt));
    grid-template-columns: calc(34 * var(--fx-pt)) 1fr;
    padding-block: calc(17 * var(--fx-pt));
  }

  .agenda-row + .agenda-row {
    border-block-start: var(--fx-rule-hairline) solid var(--fx-rule);
  }

  .agenda-no {
    color: var(--fx-text-accent);
    font-size: var(--fx-size-body);
    font-variant-numeric: tabular-nums;
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
  }

  .agenda-text {
    display: flex;
    align-items: baseline;
    column-gap: calc(16 * var(--fx-pt));
    flex-wrap: wrap;
  }

  .agenda-title {
    color: var(--fx-text-title);
    font-size: var(--fx-size-body-lg);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.2;
  }

  .agenda-note {
    color: var(--fx-text-muted);
    font-size: var(--fx-size-text);
    line-height: 1.3;
  }
</style>
