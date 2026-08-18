<script setup lang="ts">
  /*
   * Template case: terminal-flow.
   *
   * A dark prompt panel over a three-step strip, closed by claim chips.
   * Distilled from a presented and reviewed slide and built to the Fabric law:
   * the panel sits on the same navy gradient as the cover (tpl-01), and the
   * strip is three cards of the tpl-08..12 family.
   *
   * Use it where the claim is "this input produces that output, in these
   * steps". The panel quotes the real input verbatim: a rewritten prompt makes
   * the slide a reconstruction, and the audience cannot tell which it is.
   *
   * The Fabric divergence: there is no colour per actor. Three actors handing
   * work along are told apart by their names and by their order, and the one
   * card that changes ground is the LAST one - the result, which is the point
   * of the slide. Depth marks the destination; hue marks nothing.
   */

  type Step = {
    who: string;
    title: string;
    body: string;
  };

  /* Quote it exactly as it is run. Keep it to the lines the panel can hold at
     the size below without shrinking the type past the 11px screen floor. */
  const prompt = 'the exact input, quoted as it is really given, no tidying';

  const promptLabel = 'What the panel is quoting';

  const steps: Step[] = [
    {
      who: 'First actor',
      title: 'What they hand over',
      body: 'the input, in the state it already exists in',
    },
    {
      who: 'Second actor',
      title: 'What they do with it',
      body: 'the single action, with no setup work hidden behind it',
    },
    {
      who: 'The system',
      title: 'What comes out',
      body: 'the result, described as something a viewer could go and check',
    },
  ];

  /* Chips carry the two claims the strip itself cannot state. Two is the
     ceiling: a third turns the row into a list and the eye stops reading. */
  const chips = ['The cost claim', 'The claim about what is not needed'];
</script>

<template>
  <div class="tpl-flow">
    <div class="tpl-prompt">
      <div class="tpl-prompt-label">{{ promptLabel }}</div>
      <p class="tpl-prompt-text">{{ prompt }}</p>
    </div>

    <div class="tpl-strip">
      <template v-for="(step, index) of steps" :key="step.title">
        <div v-if="index > 0" class="tpl-strip-arrow" aria-hidden="true">
          <svg viewBox="0 0 20 10" fill="none" stroke="currentColor" stroke-width="1.4">
            <path d="M1 5 H17 M13 1.5 L17 5 L13 8.5" />
          </svg>
        </div>

        <section class="tpl-step" :class="{ 'is-result': index === steps.length - 1 }">
          <div class="tpl-step-who">{{ step.who }}</div>
          <div class="tpl-step-title">{{ step.title }}</div>
          <div class="tpl-step-body">{{ step.body }}</div>
        </section>
      </template>
    </div>

    <div class="tpl-chip-row">
      <span v-for="chip of chips" :key="chip" class="tpl-chip">{{ chip }}</span>
    </div>
  </div>
</template>

<style scoped>
  /* Every value here comes from assets/fabric-tokens.css. Import that file in
     the deck before this component renders, and set --fx-scale once for the
     deck's canvas (Slidev's 980px canvas: 0.7656). */

  .tpl-flow {
    display: flex;
    flex-direction: column;
    font-family: var(--fx-font);
    inline-size: 100%;
  }

  /* The panel sits on the deck's own dark ground - the same gradient as the
     cover and the section dividers, which is one of the two places in the
     system where a gradient is legal at all. Rounded, no shadow. */

  .tpl-prompt {
    border-radius: var(--fx-radius);
    background: var(--fx-grad-ground);
    padding: var(--fx-card-pad);
  }

  .tpl-prompt-label {
    color: var(--fx-text-accent-dark);
    font-size: var(--fx-size-eyebrow);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    margin-block-end: calc(6 * var(--fx-pt));
    text-transform: uppercase;
  }

  /* The one place in a Fabric deck where the mono face is legal: a transcript
     quoted as it was typed. Never a label, a figure or a line of prose. */

  .tpl-prompt-text {
    margin: 0;
    color: var(--fx-text-inverted);
    font-family: var(--fx-font-mono); /* fx-terminal */
    font-size: var(--fx-size-text);
    line-height: 1.5;
  }

  /* The caret is the one mark saying this is a transcript and not prose. */
  .tpl-prompt-text:before {
    color: var(--fx-text-accent-dark);
    content: '> ';
  }

  /* Gutter columns rather than a column gap: the arrows need a slot of their
     own, so the steps stay on one grid and the arrowheads meet the cards. */

  .tpl-strip {
    display: grid;
    align-items: stretch;
    grid-template-columns: 1fr 26px 1fr 26px 1fr;
    margin-block-start: calc(14 * var(--fx-pt));
  }

  .tpl-strip-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--fx-text-muted);
  }

  .tpl-strip-arrow svg {
    display: block;
    inline-size: calc(14 * var(--fx-pt));
  }

  /* Three cards of the standard family: rounded, tint fill, 1pt hairline. The
     actor is a kicker in accent caps, the action is a navy bold line, the
     detail is body ink. */

  .tpl-step {
    display: flex;
    flex-direction: column;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: var(--fx-radius);
    background: var(--fx-surface-tint);
    gap: calc(4 * var(--fx-pt));
    padding: var(--fx-card-pad);
  }

  .tpl-step-who {
    color: var(--fx-text-accent);
    font-size: var(--fx-size-kicker);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    text-transform: uppercase;
  }

  .tpl-step-title {
    color: var(--fx-text-title);
    font-size: var(--fx-size-body);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.2;
  }

  .tpl-step-body {
    color: var(--fx-text);
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
  }

  /* The last step is the result, so it changes GROUND rather than hue: the
     navy panel, the sky-blue kicker that a dark ground takes, and the subtitle
     ink for the detail. It is the heaviest thing on the slide, which is where
     the eye should finish. */

  .tpl-step.is-result {
    border-color: var(--fx-navy);
    background: var(--fx-navy);
  }

  .tpl-step.is-result .tpl-step-who {
    color: var(--fx-text-accent-dark);
  }

  .tpl-step.is-result .tpl-step-title {
    color: var(--fx-text-inverted);
  }

  .tpl-step.is-result .tpl-step-body {
    color: var(--fx-tint-band);
  }

  .tpl-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: calc(6 * var(--fx-pt));
    margin-block-start: calc(14 * var(--fx-pt));
  }

  /* The claim chips are filled navy: they are the two sentences the strip
     cannot say, so they carry the weight of a statement rather than a label. */

  .tpl-chip {
    display: inline-flex;
    align-items: center;
    border-radius: var(--fx-radius-pill);
    background: var(--fx-navy);
    color: var(--fx-text-inverted);
    font-size: var(--fx-size-caption);
    font-weight: var(--fx-weight-bold);
    line-height: 1.2;
    padding-block: calc(3 * var(--fx-pt));
    padding-inline: calc(12 * var(--fx-pt));
  }
</style>
