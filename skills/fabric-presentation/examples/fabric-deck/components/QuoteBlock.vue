<script setup lang="ts">
  /*
   * Template v4, layout Quote (layout 21), on the dark ground: the quote in
   * 32pt regular white, spc -50, at x=105.6 y=182.4 and 1065.6 wide; the
   * attribution in 15pt bold sky at y=470.4.
   */
  const quote =
    'We stopped writing the same shell in every project. The team takes the template and spends the time on the screens its users asked for.';

  const attribution = 'Placeholder Name, Placeholder Role, Placeholder Team';
</script>

<template>
  <p class="deck-frame deck-quote-text" style="--x: 105.6; --y: 182.4; --w: 1065.6">&ldquo;{{ quote }}&rdquo;</p>
  <p class="deck-frame deck-quote-by" style="--x: 105.6; --y: 470.4; --w: 768">{{ attribution }}</p>
</template>
