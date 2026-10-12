<!-- The cover of template v4 (v4-01), every frame at the XML's coordinates:
     the eyebrow at y=163.2, the title at y=201.6 (1084.8 wide, room for two
     lines at 64pt), the subtitle at y=436.8 and the author line at y=585.6.
     The slide's own `# heading` is the title; eyebrow, subtitle and author come
     from its frontmatter. The cover is the one page with no page number. -->
<template>
  <div class="deck-dark">
    <p v-if="matter.eyebrow" class="deck-frame deck-eyebrow" style="--x: 48; --y: 163.2; --w: 768">
      {{ matter.eyebrow }}
    </p>

    <div class="deck-frame deck-cover-title" style="--x: 48; --y: 201.6; --w: 1084.8">
      <slot />
    </div>

    <p v-if="matter.subtitle" class="deck-frame deck-cover-subtitle" style="--x: 48; --y: 436.8; --w: 844.8">
      {{ matter.subtitle }}
    </p>

    <p v-if="matter.author" class="deck-frame deck-cover-author" style="--x: 48; --y: 585.6; --w: 768">
      {{ matter.author }}
    </p>

    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed, unref } from 'vue';
  import { useSlideContext } from '@slidev/client';

  const { $frontmatter } = useSlideContext();

  /* `$frontmatter` is a plain reactive object in some Slidev versions and a ref
     in others, and reading `.value` off the plain object yields undefined with
     no error. `unref` reads both shapes. */
  const matter = computed(() => {
    const value: unknown = unref($frontmatter);

    return (value && typeof value === 'object' ? value : {}) as Record<string, string | undefined>;
  });
</script>
