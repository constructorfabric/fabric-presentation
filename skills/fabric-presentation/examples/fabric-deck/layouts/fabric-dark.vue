<!-- The other dark pages of template v4 - Quote (layout 21) and Closing
     (layout 23, v4-09) - on the same ground as the cover, with the full footer
     and the page number. The slide body places its own frames: the closing's
     title and contacts, or the quote and its attribution (style.css §4). -->
<template>
  <div class="deck-dark">
    <slot />

    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
      <span class="deck-page-number">{{ $page }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { useSlideContext } from '@slidev/client';

  const { $page } = useSlideContext();
</script>
