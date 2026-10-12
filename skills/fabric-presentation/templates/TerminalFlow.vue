<script setup lang="ts">
  /*
   * Template case: terminal-flow.
   *
   * A dark prompt panel over a three-step strip. Distilled from a presented
   * and reviewed slide and built from template v4's parts: the panel sits on
   * the same vertical navy ground as the cover, with the card's corner, and it
   * is the one place the mono face is legal; the strip is the Three Columns
   * card row (v4-07), the actor as the kicker, the step's name in bold navy.
   *
   * Use it where the claim is "this input produces that output, in these
   * steps". The panel quotes the real input verbatim: a rewritten prompt makes
   * the slide a reconstruction, and the audience cannot tell which it is.
   *
   * There is no colour per actor. Three actors handing work along are told
   * apart by their names and their order. The two claims the strip cannot
   * state - the cost, and what is not needed - go in a muted line under it.
   */

  type Step = {
    who: string;
    title: string;
    body: string;
  };

  /* Quote it exactly as it is run, in two lines at most. */
  const prompt = 'the exact input, quoted as it is really given, no tidying';

  const promptLabel = 'What the panel is quoting';

  const steps: Step[] = [
    { who: 'First actor', title: 'What they hand over', body: 'The input, in the state it already exists in.' },
    { who: 'Second actor', title: 'What they do with it', body: 'The single action, with no setup work hidden behind it.' },
    { who: 'The system', title: 'What comes out', body: 'The result, described as something a viewer could go and check.' },
  ];

  /* Two is the ceiling: a third turns the line into a list. */
  const facts = ['The cost claim', 'The claim about what is not needed'];
</script>

<template>
  <div class="tpl-flow">
    <div class="tpl-prompt">
      <div class="tpl-prompt-label">{{ promptLabel }}</div>
      <p class="tpl-prompt-text">{{ prompt }}</p>
    </div>

    <div class="deck-cols deck-cols_3 tpl-steps">
      <div v-for="step of steps" :key="step.title" class="fx-card">
        <div class="fx-kicker">{{ step.who }}</div>
        <p class="deck-card-body tpl-step-title">{{ step.title }}</p>
        <p class="deck-card-body">{{ step.body }}</p>
      </div>
    </div>

    <p class="tpl-facts">{{ facts.join(' · ') }}</p>
  </div>
</template>

<style scoped>
  /* The panel: the dark ground, the card's corner and inset. */

  .tpl-flow {
    display: flex;
    flex-direction: column;
    gap: var(--fx-gutter);
  }

  .tpl-prompt {
    border-radius: var(--fx-radius);
    background: var(--fx-grad-ground);
    padding: var(--fx-card-pad);
  }

  .tpl-prompt-label {
    color: var(--fx-text-accent-dark);
    font-size: var(--fx-size-kicker);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-kicker);
    line-height: var(--fx-leading-single);
    margin-block-end: calc(8 * var(--fx-pt));
    text-transform: uppercase;
  }

  .tpl-prompt-text {
    margin: 0;
    color: var(--fx-text-inverted);
    font-family: var(--fx-font-mono); /* fx-terminal */
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-card);
  }

  .tpl-prompt-text:before {
    color: var(--fx-text-accent-dark);
    content: "> ";
  }

  /* Three steps under a panel need less than the layout's full card height. */

  .tpl-steps .fx-card {
    block-size: auto;
  }

  .tpl-step-title {
    color: var(--fx-navy);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-facts {
    margin: 0;
    color: var(--fx-text-muted);
    font-size: var(--fx-size-caption);
    padding-inline: var(--fx-inset-x);
  }
</style>
