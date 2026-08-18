<script setup lang="ts">
  /*
   * Donor layouts: Image Half (tpl-06) - the picture takes one half of the
   * content zone and the text column the other, with the caption in the muted
   * ink under the frame. The same frame at full content width is the Image
   * layout (tpl-04), and full bleed under one white sentence is Image Full.
   *
   * With no picture yet the frame stands as the placeholder the donors draw: the
   * tint ground inside the same rounded hairline container every other element
   * uses, with a muted INSERT IMAGE label centred in it. It is a frame waiting
   * for a picture, not a graphic - so it carries no accent and no fill of its
   * own beyond the tint.
   *
   * A finished deck does not ship this slide: a placeholder beside real content
   * reads as unfinished and costs more than the missing picture. It is here
   * because the example's job is to show every composition the system has.
   */

  const caption = 'Screenshot of the assembled console, with the template versions it came from';

  const heading = 'The shell with two screens, straight out of the CLI';

  const body = [
    'The text column states the claim; the picture is only the evidence for it. Here the claim is that the console opens with its left-side menu and both screens registered, with nothing written by hand.',
    'Crop the screenshot to the region the claim is about - the menu and the screen it opens - because a full window cannot be read from the back of the room, and the claim has to survive without it.',
  ];
</script>

<template>
  <div class="deck-body">
    <div class="half-cols">
      <figure class="half-figure">
        <div class="half-frame">
          <span class="half-frame-label">Insert image</span>
        </div>
        <figcaption class="half-caption">{{ caption }}</figcaption>
      </figure>

      <section class="half-text">
        <h3 class="half-heading">{{ heading }}</h3>
        <p v-for="paragraph of body" :key="paragraph" class="half-body">{{ paragraph }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. */

  .half-cols {
    display: grid;
    flex: 1;
    align-items: stretch;
    gap: calc(24 * var(--fx-pt));
    grid-template-columns: repeat(2, 1fr);
    min-block-size: 0;
  }

  .half-figure {
    display: flex;
    flex-direction: column;
    margin: 0;
    gap: calc(8 * var(--fx-pt));
    min-block-size: 0;
  }

  /* The frame: the same rounded hairline container as a card, filled with the
     tint. Nothing accented - it is an empty slot, and an accent would make the
     absent picture the loudest thing on the slide. */

  .half-frame {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: var(--fx-radius);
    background: var(--fx-surface-tint);
    min-block-size: 0;
  }

  .half-frame-label {
    color: var(--fx-text-muted);
    font-size: var(--fx-size-caption);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    text-transform: uppercase;
  }

  .half-caption {
    flex: none;
    color: var(--fx-text-muted);
    font-size: var(--fx-size-step);
    line-height: 1.3;
  }

  /* The column starts at the frame's top edge rather than centred in its own
     half: a shared top line is what makes the two halves read as one
     composition instead of two blocks placed side by side. */

  .half-text {
    display: flex;
    flex-direction: column;
    gap: calc(10 * var(--fx-pt));
  }

  .half-heading {
    margin: 0;
    color: var(--fx-text-title);
    font-size: var(--fx-size-body-lg);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.2;
  }

  .half-body {
    margin: 0;
    color: var(--fx-text);
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
  }
</style>
