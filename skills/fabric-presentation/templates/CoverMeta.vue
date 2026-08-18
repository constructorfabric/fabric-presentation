<script setup lang="ts">
  /*
   * Template case: cover.
   *
   * The cover's lower half: the tagline that finishes the title, and the name
   * chips. Distilled from a presented and reviewed cover slide, built to the
   * Fabric law (tpl-01, exm-01).
   *
   * The title itself stays in the markdown as the slide's `#` heading, so the
   * cover layout can style it. Everything under it is this component.
   *
   * The cover is a DARK slide: the layout paints the navy gradient with its
   * corner glow, the title is white, and everything here is one of the two
   * inks that ground carries - --fx-tint-band for the subtitle run, --fx-muted-dark for the
   * quiet author line. The one accented span takes the sky blue, which is the
   * accent for dark grounds; the accent blue --fx-blue belongs to light slides
   * and would sink into the navy here.
   *
   * The tagline says what the thing IS, in one sentence a stranger could
   * repeat. Names are chips because a chip is a label of equal weight: a list
   * of names in running text makes the first name the author and the rest the
   * helpers.
   */

  const tagline = {
    before: 'One sentence naming what this is, ending on ',
    accent: 'the words that carry the difference',
    after: '.',
  };

  const people = ['First Name', 'Second Name', 'Third Name', 'Fourth Name'];
</script>

<template>
  <div class="tpl-cover">
    <p class="tpl-tagline">
      {{ tagline.before }}<span class="tpl-tagline-accent">{{ tagline.accent }}</span
      >{{ tagline.after }}
    </p>

    <div class="tpl-people">
      <span v-for="person of people" :key="person" class="tpl-chip">{{ person }}</span>
    </div>
  </div>
</template>

<style scoped>
  /* Every value here comes from assets/fabric-tokens.css. Import that file in
     the deck before this component renders, and set --fx-scale once for the
     deck's canvas (Slidev's 980px canvas: 0.7656).

     The cover layout draws the dark gradient ground, the eyebrow and the 64pt
     white title; this component only fills the text column, so nothing here
     sets a background. */

  .tpl-cover {
    display: flex;
    flex-direction: column;
    font-family: var(--fx-font);
    max-inline-size: 84.8%;
  }

  .tpl-tagline {
    color: var(--fx-tint-band);
    font-size: var(--fx-size-body-lg);
    line-height: var(--fx-leading-body);
    margin-block: calc(10 * var(--fx-pt)) 0;
    max-inline-size: 66%;
  }

  /* The sky blue is the accent for a dark ground, and on the cover it is spent
     once - on the words the room has to leave with. */

  .tpl-tagline-accent {
    color: var(--fx-text-accent-dark);
    font-weight: var(--fx-weight-bold);
  }

  .tpl-people {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: calc(6 * var(--fx-pt));
    margin-block-start: calc(16 * var(--fx-pt));
    max-inline-size: 66%;
  }

  /* Rounded, unfilled, hairline in the muted blue of the dark ground: every
     name on a cover ranks the same, so none of them takes a fill. */

  .tpl-chip {
    display: inline-flex;
    align-items: center;
    border: var(--fx-rule-hairline) solid var(--fx-muted-dark);
    border-radius: var(--fx-radius-pill);
    color: var(--fx-text-muted-dark);
    font-size: var(--fx-size-caption);
    line-height: 1.2;
    padding-block: calc(3 * var(--fx-pt));
    padding-inline: calc(10 * var(--fx-pt));
  }
</style>
