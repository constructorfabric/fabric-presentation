<!-- The section names in the footer of a LIGHT content page, current one in the
     accent blue. Our own convention - the donors carry no such nav -
     and it never goes on a filled or dark page: cover, section divider, quote
     and closing keep a wordmark-only footer, which is why the dark layouts do
     not mount this component at all. -->
<template>
  <nav v-if="sections.length > 0" class="deck-footer-nav">
    <span
      v-for="section of sections"
      :key="section.name"
      class="deck-footer-nav-item"
      :class="{ 'deck-footer-nav-item_current': section.name === current?.name }"
    >
      {{ section.name }}
    </span>
  </nav>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useSlideContext } from '@slidev/client';
  import { sectionAt, sections } from '../sections';

  /* `$page` is THIS slide's number, which is what an export needs: the deck's
     navigation state prints the same number on every exported page. */
  const { $page } = useSlideContext();

  const current = computed(() => sectionAt($page.value));
</script>
