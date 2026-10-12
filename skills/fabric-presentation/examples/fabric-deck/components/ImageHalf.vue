<script setup lang="ts">
  /*
   * Template v4, layout Image Half (v4-05): the picture in a card at x=48
   * y=144, 577.6 x 505.9; beside it a frame at x=654.4 y=153.6, 577.6 wide and
   * 486.7 high, its 16pt text at lnSpc 140% centred vertically. Replace the
   * label with the image: <img> inside the card fills it to the corner.
   */
  const label = 'Insert image';

  const body = [
    'The console opens with its left-side menu and both screens registered, with nothing written by hand.',
    'Crop the screenshot to the menu and the screen it opens: a full window cannot be read from the back of the room.',
  ];
</script>

<template>
  <div class="deck-box deck-image" style="--x: 0; --y: -19.2; --w: 577.6; --h: 505.9">
    <span class="deck-image-label">{{ label }}</span>
  </div>

  <div class="deck-frame deck-frame_h deck-frame_middle deck-image-caption" style="--x: 606.4; --y: -9.6; --w: 577.6; --h: 486.7">
    <p v-for="paragraph of body" :key="paragraph">{{ paragraph }}</p>
  </div>
</template>
