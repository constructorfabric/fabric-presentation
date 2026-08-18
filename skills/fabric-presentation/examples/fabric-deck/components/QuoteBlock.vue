<script setup lang="ts">
  /*
   * Donor layout: Quote (tpl-19) - a dark page carrying one sentence and its
   * attribution, and nothing else.
   *
   * The quote is the only dark page between the bookends, and that is the point:
   * a sentence someone else said reads as a change of voice, so the ground
   * changes with it. The attribution takes the sky blue, the accent a dark
   * ground uses; the quote itself stays white, because two accents on a page of
   * one sentence would compete for the same job.
   *
   * The quotation marks are drawn as part of the text rather than as an
   * ornament: a large decorative glyph would be the biggest thing on the slide
   * and the eye would land on punctuation.
   */

  const quote =
    'We stopped writing the same shell in every project. The team takes the template that exists and spends the time on the screens their own users asked for.';

  const attribution = 'Placeholder Name, Placeholder Role, Placeholder Team';
</script>

<template>
  <figure class="quote">
    <blockquote class="quote-text">{{ quote }}</blockquote>
    <figcaption class="quote-source">{{ attribution }}</figcaption>
  </figure>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. The layout draws the dark
     ground and the footer; this component fills the column between them. */

  .quote {
    display: flex;
    flex-direction: column;
    margin: 0;
    gap: calc(22 * var(--fx-pt));
    max-inline-size: 80%;
  }

  .quote-text {
    margin: 0;
    color: var(--fx-text-inverted);
    font-size: calc(28 * var(--fx-pt));
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.35;
  }

  .quote-text:before {
    content: "“";
  }

  .quote-text:after {
    content: "”";
  }

  .quote-source {
    color: var(--fx-text-accent-dark);
    font-size: var(--fx-size-caption);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    line-height: 1.2;
    text-transform: uppercase;
  }
</style>
