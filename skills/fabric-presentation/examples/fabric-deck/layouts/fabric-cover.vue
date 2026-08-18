<!-- The root draws the dark ground and nothing else: the 3.8% margin lives on
     .deck-cover-body, so the footer beside that wrapper spans the slide edge to
     edge. -->
<template>
  <div class="deck-cover">
    <div class="deck-cover-body">
      <!-- The eyebrow the donors' own Cover layout carries, in caps above the
           title (tpl-01). It belongs to the DARK pages - a content slide's
           title stands alone. It sets the occasion rather than the company
           name: the wordmark at the footer baseline already carries the brand,
           and repeating it twice on one page spends the eyebrow on nothing. -->
      <p class="deck-cover-eyebrow">Product overview</p>

      <slot />
    </div>

    <!-- The same footer box every page carries, so the wordmark does not move
         when the deck leaves the cover. Two differences and no others: the
         hairline is transparent on the dark ground, and the cover is the one
         page in the donors that carries no number. No section nav on a dark
         page. -->
    <footer class="deck-slide-footer">
      <span class="deck-footer-brand">Constructor Fabric</span>
    </footer>
  </div>
</template>
