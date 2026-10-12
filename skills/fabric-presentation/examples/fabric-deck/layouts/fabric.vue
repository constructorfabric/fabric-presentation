<!-- The light slide of template v4. The root is the whole canvas, unpadded and
     positioned; the title frame (y=52.8), the content box (x=48..1232 from
     y=163.2) and the footer frame (y=664.3) are absolute, at the template's own
     coordinates - see style.css §3. `ground: tint` in a slide's frontmatter puts
     it on the #F2F6FC ground the Agenda layout uses. -->
<template>
  <div class="deck-slide" :class="{ 'deck-slide_tint': ground === 'tint' }">
    <header class="deck-slide-header">
      <slot name="header" />
    </header>

    <main class="deck-slide-content">
      <slot />
    </main>

    <!-- The footer on every page: the 10pt bold wordmark and the unpadded page
         number, nothing else - no rule, no logo image. The section nav renders
         nothing while sections.ts is empty, which is how the template ships. -->
    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
      <SectionNav />
      <span class="deck-page-number">{{ $page }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed, unref } from 'vue';
  import { useSlideContext } from '@slidev/client';
  import SectionNav from '../components/SectionNav.vue';

  /* `$page` is THIS slide's number - `nav.currentPage` is where the viewer is,
     which in an export prints the same number on every page. `$frontmatter` is
     a plain reactive object in some Slidev versions and a ref in others; `unref`
     reads both. */
  const { $page, $frontmatter } = useSlideContext();

  const ground = computed(() => {
    const matter: unknown = unref($frontmatter);

    return matter && typeof matter === 'object' && 'ground' in matter
      ? (matter as { ground: unknown }).ground
      : undefined;
  });
</script>
