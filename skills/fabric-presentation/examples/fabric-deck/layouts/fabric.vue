<!-- The root carries NO .slidev-layout class: that class is the theme's own,
     and its padding insets the slide box, which pulls the footer's rule off the
     left and right edges. The footer is full bleed. -->
<template>
  <div class="deck-slide">
    <!-- The header holds the title alone, with the optional blue takeaway line
         under it. The caps eyebrow does not go over a content title: it
         repeats the claim the title already states. -->
    <header class="deck-slide-header">
      <slot name="header" />
    </header>

    <main class="deck-slide-content">
      <slot />
    </main>

    <!-- The footer is mandatory on every content slide: a hairline rule, the
         10pt bold wordmark at the left margin, the section names in the middle
         and a two-digit page number at the right. There is no logo image
         anywhere in the system. The nav renders nothing when sections.ts
         declares no sections, and no dark page mounts it at all. -->
    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
      <SectionNav />
      <span class="deck-page-number">{{ pageNumber }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useSlideContext } from '@slidev/client';
  import SectionNav from '../components/SectionNav.vue';

  /* `$page` is THIS slide's number. The deck's navigation state is a different
     thing: `nav.currentPage` is where the viewer is, which in an export renders
     the same number on every page, and `$slidev` is a template global that is
     not on globalThis in a script block, so reading it here yields nothing at
     all. Two digits, so the number's width does not jitter between 9 and 10 -
     the donor decks pad theirs the same way. */
  const { $page } = useSlideContext();

  const pageNumber = computed(() => String($page.value).padStart(2, '0'));
</script>
