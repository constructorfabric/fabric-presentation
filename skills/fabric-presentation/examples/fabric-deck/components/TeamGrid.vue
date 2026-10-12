<script setup lang="ts">
  /*
   * Template v4, layout Team (layout 17): four 274.4-wide columns, two rows; a
   * 96px photo circle (#E6EFFA, 1pt hairline) centred in each column, and 115.2
   * below its top the name and role, 14pt bold navy, centred. Replace the
   * "Photo" label with an <img> inside the circle. Names are placeholders.
   */
  type Person = { name: string; role: string };

  const people: Person[] = [
    { name: 'Placeholder Name', role: 'Product owner' },
    { name: 'Placeholder Name', role: 'Architect' },
    { name: 'Placeholder Name', role: 'Runtime engineer' },
    { name: 'Placeholder Name', role: 'Template author' },
    { name: 'Placeholder Name', role: 'CLI engineer' },
    { name: 'Placeholder Name', role: 'Design system lead' },
    { name: 'Placeholder Name', role: 'Release manager' },
    { name: 'Placeholder Name', role: 'Technical writer' },
  ];

  /* Column x and row y relative to the content box (x=48, y=163.2). */
  const colX = [0, 303.2, 606.4, 909.6];
  const rowY = [0, 232.3];
</script>

<template>
  <template v-for="(person, index) of people" :key="index">
    <div class="deck-team-photo" :style="`--x: ${colX[index % 4]}; --y: ${rowY[Math.floor(index / 4)]}`">
      <span>Photo</span>
    </div>
    <div class="deck-frame deck-team-name" :style="`--x: ${colX[index % 4]}; --y: ${rowY[Math.floor(index / 4)] + 115.2}; --w: 274.4`">
      <p>{{ person.name }}</p>
      <p>{{ person.role }}</p>
    </div>
  </template>
</template>
