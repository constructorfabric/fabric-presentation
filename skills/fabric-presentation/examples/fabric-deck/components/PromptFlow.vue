<script setup lang="ts">
  /*
   * Two forms in one picture: the dark panel quoting the request verbatim, and
   * the numbered chain it sets off (tpl-17, navy circles on a hairline rail).
   *
   * The prompt is quoted rather than tidied, because a cleaned-up prompt makes
   * the slide a reconstruction and the audience cannot tell which it is. Each
   * step names its actor, since the point of the chain is that the developer,
   * the agent, the CLI and the project each do a different job.
   */

  const promptLabel = "The developer's starting prompt";

  const prompt =
    'frontx, build a console with a left-side menu and two screens in the folder demo-app: screen 1 "Overview" - a summary panel; screen 2 "Reports" - a filterable list with an export button; verify it in the light and dark themes.';

  /* A step's detail line is a run of fragments so that the literal commands
     inside it can take the mono face while the prose around them does not. */
  type Fragment = { text: string; code?: boolean };

  type Step = { who: string; title: string; body: Fragment[] };

  const steps: Step[] = [
    {
      who: 'Developer',
      title: 'Prompt',
      body: [{ text: 'an ordinary request, no flags and no parameters' }],
    },
    {
      who: 'Agent',
      title: 'Reads inventory',
      body: [
        { text: 'frontx list --json', code: true },
        { text: ' and matches the prompt against the descriptions' },
      ],
    },
    {
      who: 'Agent',
      title: 'Shows the plan',
      body: [{ text: 'one seed, two adds, and the part of the prompt left uncovered' }],
    },
    {
      who: 'CLI',
      title: 'Materializes',
      body: [{ text: 'frontx seed', code: true }, { text: ', then ' }, { text: 'frontx add', code: true }],
    },
    {
      who: 'Project',
      title: 'Writes the passport',
      body: [{ text: 'files plus an entry in ' }, { text: '.frontx/provenance.json', code: true }],
    },
    {
      who: 'Agent',
      title: 'Fills the screens',
      body: [{ text: "with the template's own skills" }],
    },
  ];

  const chips = [
    'The plan comes before the files',
    'An honest refusal writes nothing',
    'The report is read from the passport',
  ];
</script>

<template>
  <div class="deck-body">
    <div class="deck-prompt">
      <div class="deck-prompt-label">{{ promptLabel }}</div>
      <p class="deck-prompt-text">{{ prompt }}</p>
    </div>

    <div class="deck-steps deck-steps_6 flow-strip">
      <section v-for="(step, index) of steps" :key="step.title" class="deck-step">
        <span class="fx-step">{{ index + 1 }}</span>
        <p class="deck-step-who">{{ step.who }}</p>
        <h3 class="deck-step-title">{{ step.title }}</h3>
        <p class="deck-step-body">
          <template v-for="(fragment, position) of step.body" :key="position">
            <code v-if="fragment.code">{{ fragment.text }}</code>
            <template v-else>{{ fragment.text }}</template>
          </template>
        </p>
      </section>
    </div>

    <div class="deck-chips">
      <span v-for="chip of chips" :key="chip" class="deck-chip">{{ chip }}</span>
    </div>
  </div>
</template>

<style scoped>
  /* The strip sits under the panel with the donors' card gutter between them;
     everything else it needs is in ../style.css §5. */

  .flow-strip {
    margin-block-start: calc(16 * var(--fx-pt));
  }
</style>
