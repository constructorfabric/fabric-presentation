<script setup lang="ts">
  /*
   * Donor layout: Four Columns (tpl-11), read as a scheme.
   *
   * The claim is about where things flow, so the form is a scheme. Each layer is
   * a card whose head names it - the kicker in caps over a hairline rule, never
   * a filled band, because a band inside a card reads narrower than the card it
   * heads and inverts the hierarchy. The assembled project is the one filled element on the slide, because
   * it is what the other three columns exist to produce. The connectors are
   * columns of the grid rather than pseudo-elements on the cards, so an arrow
   * has its own place and does not move when a card's wording changes.
   */

  type Layer = {
    /* The head of the column: which layer of the stack this is. */
    name: string;
    /* One entry per thing that lives in that layer. */
    nodes: { name: string; desc: string }[];
    /* The result column is the one that carries depth. */
    filled?: boolean;
  };

  const layers: Layer[] = [
    {
      name: 'Libraries (npm)',
      nodes: [
        { name: 'mfes', desc: 'micro frontend runtime' },
        { name: 'gts-plugin', desc: 'the shared type system' },
        { name: 'ui-kit', desc: 'components and themes' },
      ],
    },
    {
      name: 'Templates',
      nodes: [
        { name: 'template-shell', desc: 'shell: menu, themes, routing' },
        { name: 'template-mfe', desc: 'one screen as a micro frontend' },
        { name: 'your own templates', desc: 'registered from any git source' },
      ],
    },
    {
      name: 'Orchestration',
      nodes: [
        { name: 'the frontx CLI', desc: 'installs templates and assembles from them' },
        { name: 'the kit for the agent', desc: 'skills on top of the same commands' },
        { name: 'the CLI is self-sufficient', desc: 'the agent is an optional add-on' },
      ],
    },
    {
      name: 'Assembled project',
      filled: true,
      nodes: [
        { name: 'shell app', desc: 'the menu and the frame, once' },
        { name: 'screen 1 as a module', desc: 'own build, own Shadow DOM' },
        { name: 'screen 2 as a module', desc: 'one micro frontend per screen' },
        { name: 'the passport file', desc: 'every part, its version and its source' },
      ],
    },
  ];

  const takeaway =
    'The shell is installed once and the screen template once per screen; libraries are versioned apart from templates.';
</script>

<template>
  <div class="deck-body">
    <div class="deck-flow">
      <template v-for="(layer, index) of layers" :key="layer.name">
        <!-- The connector between this column and the previous one. It is drawn
             in the grid column between them, so it points at the card rather
             than reaching for it. -->
        <div v-if="index > 0" class="deck-flow-arrow" aria-hidden="true">
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
            <path
              d="M0 6 H17 M12 1.5 L17 6 L12 10.5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <section class="deck-flow-col" :class="{ 'deck-flow-col_filled': layer.filled }">
          <div class="deck-flow-layer">{{ layer.name }}</div>
          <div v-for="node of layer.nodes" :key="node.name" class="flow-node">
            <div class="deck-flow-name">{{ node.name }}</div>
            <div class="deck-flow-desc">{{ node.desc }}</div>
          </div>
        </section>
      </template>
    </div>

    <p class="deck-takeaway-line">{{ takeaway }}</p>
  </div>
</template>

<style scoped>
  /* The layout classes live in ../style.css §5, shared with nothing else in the
     deck; only the node's own two lines need a rule here. */

  .flow-node {
    display: flex;
    flex-direction: column;
    gap: calc(2 * var(--fx-pt));
  }
</style>
