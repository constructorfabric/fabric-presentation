<!-- The dark slide that carries a page number: the quote and the closing. It sits
     on the same ground as the cover and differs from it in one thing - it takes
     the full footer, hairline and wordmark and number, rather than the cover's
     bare wordmark.

     The root stays UNPADDED. The 3.8% margin belongs to .deck-dark-body and to
     the footer's own padding-inline, which is what lets the footer's hairline
     run from slide edge to slide edge while its two runs of text keep the
     margin - a padded root cuts the rule short at both ends.

     The eyebrow comes from the slide's own frontmatter, so one layout serves
     every dark page instead of a layout per page. -->
<template>
  <div class="deck-cover deck-dark">
    <div class="deck-dark-body">
      <p v-if="eyebrow" class="deck-cover-eyebrow">{{ eyebrow }}</p>

      <slot />
    </div>

    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
      <span class="deck-page-number">{{ pageNumber }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed, unref } from 'vue';
  import { useSlideContext } from '@slidev/client';

  /* `$page` is THIS slide's number - `nav.currentPage` is where the viewer is,
     which in an export prints the same number on every page, and `$slidev` is a
     template global that is not on globalThis in a script block. */
  const { $page, $frontmatter } = useSlideContext();

  const pageNumber = computed(() => String($page.value).padStart(2, '0'));

  /* `$frontmatter` is a plain reactive object in some Slidev versions and a ref
     in others, and reading `.value` off the plain object yields undefined with
     no error - the eyebrow simply never appears. `unref` reads both shapes. */
  const eyebrow = computed(() => {
    const matter: unknown = unref($frontmatter);
    if (matter && typeof matter === 'object' && 'eyebrow' in matter) {
      const value = (matter as { eyebrow: unknown }).eyebrow;

      return typeof value === 'string' ? value : '';
    }

    return '';
  });
</script>
