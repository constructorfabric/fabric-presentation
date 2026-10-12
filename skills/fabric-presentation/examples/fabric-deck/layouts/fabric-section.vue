<!-- The section divider of template v4 (v4-02): the eyebrow at y=230.4, the
     42pt title at y=273.6, the one-sentence summary at y=412.8, and the full
     footer with the page number. The slide's own `# heading` is the title;
     eyebrow and summary come from its frontmatter. -->
<template>
  <div class="deck-dark">
    <p v-if="matter.eyebrow" class="deck-frame deck-eyebrow" style="--x: 48; --y: 230.4; --w: 768">
      {{ matter.eyebrow }}
    </p>

    <div class="deck-frame deck-section-title" style="--x: 48; --y: 273.6; --w: 1056">
      <slot />
    </div>

    <p v-if="matter.summary" class="deck-frame deck-section-summary" style="--x: 48; --y: 412.8; --w: 825.6">
      {{ matter.summary }}
    </p>

    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
      <span class="deck-page-number">{{ $page }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed, unref } from 'vue';
  import { useSlideContext } from '@slidev/client';

  const { $page, $frontmatter } = useSlideContext();

  const matter = computed(() => {
    const value: unknown = unref($frontmatter);

    return (value && typeof value === 'object' ? value : {}) as Record<string, string | undefined>;
  });
</script>
