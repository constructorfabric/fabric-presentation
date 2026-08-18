<script setup lang="ts">
  /*
   * Template case: section-divider (tpl-02, exm-03).
   *
   * The slide that starts a part: the navy gradient ground with its corner glow,
   * a sky-blue eyebrow in caps, a 42pt white title, and one sentence saying what
   * the part covers. No rail, no panel, no logo - the dark ground is the whole
   * structural move.
   *
   * A divider is not a bookend. A deck built of several parts - often a part per
   * presenter - opens each one with a divider, so this ground recurs through the
   * middle of the deck and is what tells the room a part has ended. Its page
   * is dark, so it carries no section nav in the footer.
   *
   * It draws its own zones, so its slide block carries `layout: none` and
   * `class: fx-section-slide`; ../style.css §3 is the rule that class needs.
   * Every margin is set per text box through inset-inline-start rather than as
   * padding on the root, which keeps the root spanning the slide edge to edge -
   * the condition any rule drawn here would need.
   */

  const props = withDefaults(
    defineProps<{
      /* A running number in caps: SECTION 01, SECTION 02. */
      kicker?: string;
      /* The section's name. One line at 42pt - about 30 characters before it
         wraps, and a wrapped section title means the part needs a shorter
         name. */
      title: string;
      /* One sentence saying what the part covers. Leave it empty and the ground
         carries the title alone, which the donors also do. */
      summary?: string;
    }>(),
    { kicker: 'Section 01', summary: '' },
  );

  /* The footer of every page: the plain-text wordmark, 10pt bold, in the muted
     blue of a dark ground. There is no logo image in the system - this run IS
     the brand mark. */
  const wordmark = 'Constructor Fabric';
</script>

<template>
  <div class="tpl-section">
    <p class="tpl-section-eyebrow">{{ props.kicker }}</p>

    <div class="tpl-section-body">
      <h2 class="tpl-section-title">{{ props.title }}</h2>
    </div>

    <p v-if="props.summary" class="tpl-section-summary">{{ props.summary }}</p>

    <p class="tpl-section-wordmark">{{ wordmark }}</p>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. The gradient pair is the one
     ground the law allows a gradient on. */

  .tpl-section {
    position: absolute;
    background: var(--fx-grad-glow), var(--fx-grad-ground);
    color: var(--fx-text-inverted);
    font-family: var(--fx-font);
    inset: 0;
  }

  /* The three text boxes sit at the layout's own offsets, each in the left
     column and each clear of the next. */

  .tpl-section-eyebrow,
  .tpl-section-summary,
  .tpl-section-wordmark {
    position: absolute;
    margin: 0;
    inline-size: 66%;
    inset-inline-start: var(--fx-margin-inline);
    line-height: 1.2;
  }

  .tpl-section-eyebrow {
    color: var(--fx-text-accent-dark);
    font-size: var(--fx-size-eyebrow);
    font-weight: var(--fx-weight-bold);
    inset-block-start: 32%;
    letter-spacing: var(--fx-track-caps);
    text-transform: uppercase;
  }

  .tpl-section-body {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;

    /* The title box: top 38%, one line high, contents centred - the layout's own
       anchor, and what puts the title where the donor puts it. */
    block-size: calc(0.14 * var(--fx-slide-h, 552px));
    inline-size: 84.8%;
    inset-block-start: 38%;
    inset-inline-start: var(--fx-margin-inline);
  }

  .tpl-section-title {
    margin: 0;
    color: var(--fx-text-inverted);
    font-size: var(--fx-size-section);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title);
    line-height: var(--fx-leading-title);
  }

  /* The sentence under the title: the pale tint that is the subtitle ink of
     every dark slide, one step quieter than white and two above the footer. */

  .tpl-section-summary {
    color: var(--fx-tint-band);
    font-size: var(--fx-size-body);
    inset-block-start: 57.3%;
    line-height: var(--fx-leading-body);
  }

  /* The wordmark: bottom-left at the footer baseline, 10pt bold, muted. A
     divider carries no page number in the donors, and no rule above the footer
     either - the dark ground is separation enough. */

  .tpl-section-wordmark {
    display: flex;
    align-items: center;

    /* The same 7.7% band the content layout's footer occupies, anchored to the
       BOTTOM of the slide rather than to 92.3% of it: the content footer sits
       in flow at the foot of the box, so bottom-anchoring is what makes the two
       land on the same baseline whatever the canvas height rounds to. Set the
       text's top at 92.3% instead and the wordmark sits high, and it then jumps
       as the deck moves off a divider - one footer geometry on every page. */
    block-size: calc((1 - var(--fx-footer-top)) * var(--fx-slide-h, 552px));
    color: var(--fx-text-muted-dark);
    font-size: var(--fx-size-footer);
    font-weight: var(--fx-weight-bold);
    gap: calc(6 * var(--fx-pt));
    inset-block-end: 0;

    /* The hairline the content footer draws, in transparent: under border-box
       sizing that 1px comes out of the box's own height, so a band without it
       centres its text half a pixel higher and the wordmark shifts by one
       device pixel between a divider and the page after it. The rule is
       invisible; its thickness is the point. */
    border-block-start: var(--fx-rule-hairline) solid transparent;
  }
</style>
