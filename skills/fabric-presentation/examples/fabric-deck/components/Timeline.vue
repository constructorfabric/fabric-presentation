<script setup lang="ts">
  /*
   * Template v4, layout Process (layout 18), at its own coordinates: a 1.5pt
   * #DCE3EE rail at y=275 from x=196 to 1084; four 52.8 navy circles at
   * y=249.6 carrying 16pt bold white labels; under each, the step name (14pt
   * bold navy) and its note (11pt muted, lnSpc 130%), both centred in frames
   * 267.2 wide. Positions here are relative to the content box (x=48,
   * y=163.2). Quarter labels are placeholders.
   */
  type Step = { badge: string; title: string; body: string };

  const steps: Step[] = [
    { badge: 'Q1', title: 'Shared shell', body: 'One shell template with its menu, themes and routing, taken as a version.' },
    { badge: 'Q2', title: 'Screens as modules', body: 'A screen becomes a micro frontend with its own build and Shadow DOM.' },
    { badge: 'Q3', title: 'Upgrade as a diff', body: 'A new template version arrives as a change to review, not a migration.' },
    { badge: 'Q4', title: 'Templates of your own', body: 'Any team registers its own template and it takes the same path.' },
  ];

  /* Circle x and frame x of each step, from the layout's XML minus x=48. */
  const circleX = [121.6, 417.6, 713.6, 1009.6];
  const frameX = [14.4, 310.4, 606.4, 902.4];
</script>

<template>
  <div class="deck-box deck-process-rail" style="--x: 148; --y: 111.8; --w: 888; --h: 2" />

  <template v-for="(step, index) of steps" :key="step.title">
    <span class="deck-box fx-step" :style="`--x: ${circleX[index]}; --y: 86.4; --w: 52.8; --h: 52.8`">{{ step.badge }}</span>
    <p class="deck-frame deck-process-name" :style="`--x: ${frameX[index]}; --y: 168; --w: 267.2`">{{ step.title }}</p>
    <p class="deck-frame deck-process-note" :style="`--x: ${frameX[index]}; --y: 211.2; --w: 267.2`">{{ step.body }}</p>
  </template>
</template>
