<script setup lang="ts">
  /*
   * The closing's lower half, mirroring the cover: the phrase in the sky blue
   * where the cover puts its tagline, then the four steps that take a room from
   * nothing to a running console.
   *
   * The accent is solid rather than a gradient fill on the text: the only two
   * legal gradients in the system are the dark ground and the ribbon motif.
   */

  const phraseLead = 'Frontend that';

  const phraseAccent = 'assembles itself from tested templates';

  const label = 'Four steps to a project';

  /* Each step is prose with the literal command inside it, so the mono face
     lands on the command and nowhere else. */
  type Fragment = { text: string; code?: boolean };

  const steps: Fragment[][] = [
    [{ text: 'Install the CLI globally - ' }, { text: 'npm install -g @gears-frontx/cli', code: true }],
    [
      { text: 'Register the shell and the screen template - ' },
      { text: 'frontx install', code: true },
    ],
    /* One line per row: a row that wraps stands taller than its neighbours and
       the four stop reading as one run. */
    [
      { text: 'Give the agent one prompt: it shows the plan, then ' },
      { text: 'frontx seed', code: true },
      { text: ' and ' },
      { text: 'frontx add', code: true },
    ],
    [{ text: 'Open the browser: a console with a left-side menu and two screens, no errors' }],
  ];
</script>

<template>
  <div class="closing-meta">
    <p class="closing-phrase">
      {{ phraseLead }} <span class="closing-phrase-accent">{{ phraseAccent }}</span>
    </p>

    <p class="closing-label">{{ label }}</p>

    <ol class="closing-run">
      <li v-for="(step, index) of steps" :key="index" class="closing-run-row">
        <span class="closing-run-no">{{ String(index + 1).padStart(2, '0') }}</span>
        <span>
          <template v-for="(fragment, position) of step" :key="position">
            <code v-if="fragment.code">{{ fragment.text }}</code>
            <template v-else>{{ fragment.text }}</template>
          </template>
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. */

  .closing-meta {
    display: flex;
    flex-direction: column;
    font-family: var(--fx-font);
    max-inline-size: 72%;
  }

  .closing-phrase {
    margin-block: calc(6 * var(--fx-pt)) 0;
    color: var(--fx-tint-band);
    font-size: calc(22 * var(--fx-pt));
    letter-spacing: var(--fx-track-title-sm);
    line-height: var(--fx-leading-body);
  }

  .closing-phrase-accent {
    color: var(--fx-text-accent-dark);
    font-weight: var(--fx-weight-bold);
  }

  /* The caps label over the run list - the same eyebrow shape the layout sets
     above the title, one step quieter. */

  .closing-label {
    margin-block: calc(20 * var(--fx-pt)) 0;
    color: var(--fx-text-muted-dark);
    font-size: var(--fx-size-caption);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    line-height: 1.2;
    text-transform: uppercase;
  }

  /* Four rows down the page: wrapped into a row they break three-and-one, which
     reads as ragged rather than as an ordered run. */

  .closing-run {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin: 0;
    gap: calc(7 * var(--fx-pt));
    list-style: none;
    padding-block-start: calc(10 * var(--fx-pt));
    padding-inline: 0;
  }

  /* Rounded, unfilled, hairline in the muted blue of the dark ground: the four
     steps rank the same, so none of them takes a fill. */

  .closing-run-row {
    display: inline-flex;
    align-items: center;
    border: var(--fx-rule-hairline) solid var(--fx-muted-dark);
    border-radius: var(--fx-radius-pill);
    color: var(--fx-tint-band);
    font-size: var(--fx-size-text);
    gap: calc(8 * var(--fx-pt));
    line-height: 1.2;
    padding-block: calc(5 * var(--fx-pt));
    padding-inline: calc(12 * var(--fx-pt));
  }

  .closing-run-no {
    color: var(--fx-text-accent-dark);
    font-weight: var(--fx-weight-bold);
  }

  /* The literal commands inside the rows keep the mono face, but not the navy
     the light slides give them: on this ground navy would vanish. */

  .closing-run-row code {
    color: var(--fx-text-inverted);
    font-family: var(--fx-font-mono); /* fx-code */
    font-size: 0.94em;
  }
</style>
