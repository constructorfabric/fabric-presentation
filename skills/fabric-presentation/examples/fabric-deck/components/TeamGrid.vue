<script setup lang="ts">
  /*
   * Donor layout: Team (tpl-16) - a grid of circles, each with a name in navy
   * and a role in the muted ink under it.
   *
   * The donors put a photograph in each circle. Where there is no photograph the
   * circle stays as the placeholder frame it is: the tint fill with initials in
   * navy, which keeps the row's rhythm and does not pretend to be a portrait.
   * Every circle is the same size - a team grid says who, and a circle that grew
   * would start saying rank.
   */

  type Person = { initials: string; name: string; role: string };

  const people: Person[] = [
    { initials: 'AB', name: 'Placeholder Name', role: 'Product owner' },
    { initials: 'CD', name: 'Placeholder Name', role: 'Architect' },
    { initials: 'EF', name: 'Placeholder Name', role: 'Runtime engineer' },
    { initials: 'GH', name: 'Placeholder Name', role: 'Template author' },
    { initials: 'IJ', name: 'Placeholder Name', role: 'CLI engineer' },
    { initials: 'KL', name: 'Placeholder Name', role: 'Design system lead' },
    { initials: 'MN', name: 'Placeholder Name', role: 'Release manager' },
    { initials: 'OP', name: 'Placeholder Name', role: 'Technical writer' },
  ];
</script>

<template>
  <div class="deck-body">
    <div class="team-grid">
      <figure v-for="person of people" :key="person.role + person.initials" class="team-cell">
        <span class="team-portrait" aria-hidden="true">{{ person.initials }}</span>
        <figcaption class="team-caption">
          <span class="team-name">{{ person.name }}</span>
          <span class="team-role">{{ person.role }}</span>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. */

  .team-grid {
    display: grid;
    flex: none;
    gap: calc(22 * var(--fx-pt)) calc(16 * var(--fx-pt));
    grid-template-columns: repeat(4, 1fr);
  }

  .team-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    gap: calc(9 * var(--fx-pt));
    text-align: center;
  }

  /* The portrait frame: a tint disc with the hairline every container in the
     system carries, and the initials in navy where a photograph would go. */

  .team-portrait {
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: 50%;
    background: var(--fx-surface-tint);
    block-size: calc(74 * var(--fx-pt));
    color: var(--fx-navy);
    font-size: var(--fx-size-body);
    font-weight: var(--fx-weight-bold);
    inline-size: calc(74 * var(--fx-pt));
    letter-spacing: var(--fx-track-caps);
  }

  .team-caption {
    display: flex;
    flex-direction: column;
    gap: calc(2 * var(--fx-pt));
  }

  .team-name {
    color: var(--fx-text-title);
    font-size: var(--fx-size-text);
    font-weight: var(--fx-weight-bold);
    line-height: 1.2;
  }

  .team-role {
    color: var(--fx-text-muted);
    font-size: var(--fx-size-step);
    line-height: 1.3;
  }
</style>
