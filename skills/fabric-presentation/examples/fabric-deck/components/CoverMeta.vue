<script setup lang="ts">
  /*
   * The cover's lower half, from the `cover` case (tpl-01, exm-01).
   *
   * The one accented run on the page is the sky blue, which is the accent a dark
   * ground takes. No gradient fill on text: the only two legal gradients in the
   * system are the dark ground itself and the ribbon illustration.
   */

  const taglineLead = 'An ecosystem for assembling frontend products from';

  const taglineAccent = 'tested, versioned templates';

  const date = 'Month Year';
</script>

<template>
  <div class="cover-meta">
    <p class="cover-tagline">
      {{ taglineLead }} <span class="cover-tagline-accent">{{ taglineAccent }}</span>
    </p>
    <p class="cover-date">{{ date }}</p>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. The layout draws the dark
     ground, the eyebrow and the white title; this component fills the column
     under them, so nothing here sets a background. */

  .cover-meta {
    display: flex;
    flex-direction: column;
    font-family: var(--fx-font);
    max-inline-size: 62%;
  }

  .cover-tagline {
    margin-block: calc(6 * var(--fx-pt)) 0;
    color: var(--fx-tint-band);
    font-size: calc(24 * var(--fx-pt));
    letter-spacing: var(--fx-track-title-sm);
    line-height: var(--fx-leading-body);
  }

  /* The one accented run on the cover, spent on the words the room has to leave
     with. */

  .cover-tagline-accent {
    color: var(--fx-text-accent-dark);
    font-weight: var(--fx-weight-bold);
  }

  .cover-date {
    margin-block: calc(26 * var(--fx-pt)) 0;
    color: var(--fx-text-muted-dark);
    font-size: var(--fx-size-caption);
    line-height: 1.2;
  }
</style>
