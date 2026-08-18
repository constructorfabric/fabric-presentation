<script setup lang="ts">
  /*
   * Donor layout: Timeline (tpl-18) - navy pill badges threaded on a hairline
   * rail, each with its heading and a line of description under it.
   *
   * The rail is an element of its own rather than a border on the pills, so the
   * line runs behind every badge at the same height whatever the columns do.
   * The pills are all the same object: a timeline says WHEN, and a badge that
   * changed weight would quietly start saying how important instead.
   *
   * Horizontal extent reads as elapsed time whether or not an axis is drawn,
   * which is the one form where that default meaning is the intended one.
   */

  type Milestone = { badge: string; title: string; body: string };

  const milestones: Milestone[] = [
    {
      badge: 'Q1',
      title: 'Shared shell',
      body: 'One shell template with its menu, themes and routing, taken as a version rather than copied.',
    },
    {
      badge: 'Q2',
      title: 'Screens as modules',
      body: 'A screen becomes a micro frontend with its own build and its own Shadow DOM.',
    },
    {
      badge: 'Q3',
      title: 'Upgrade as a diff',
      body: 'A new template version arrives as a change to review, not a migration to write.',
    },
    {
      badge: 'Q4',
      title: 'Templates of your own',
      body: 'Any team registers its own template from its own git source and it takes the same path.',
    },
  ];

  const takeaway = 'Quarter labels are placeholders: each one closes a reason a project gets written from nothing again.';
</script>

<template>
  <div class="deck-body">
    <div class="timeline">
      <section v-for="stop of milestones" :key="stop.badge" class="timeline-stop">
        <span class="fx-pill">{{ stop.badge }}</span>
        <h3 class="timeline-title">{{ stop.title }}</h3>
        <p class="timeline-body">{{ stop.body }}</p>
      </section>
    </div>

    <p class="deck-takeaway-line timeline-takeaway">{{ takeaway }}</p>
  </div>
</template>

<style scoped>
  /* Every value comes from ../fabric-tokens.css. */

  /* One gutter value, declared once: the rail segment has to span exactly the
     gutter it crosses, so the two cannot be independent numbers. */

  .timeline {
    display: grid;
    flex: none;
    align-items: start;
    column-gap: var(--timeline-gap);
    grid-template-columns: repeat(4, 1fr);

    --timeline-gap: calc(20 * var(--fx-pt));
  }

  .timeline-stop {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: calc(7 * var(--fx-pt));
  }

  /* The rail is drawn per gap rather than as one line under the whole strip: a
     segment runs from each stop to the next, so the rail ENDS at the last badge
     instead of overshooting into empty space and claiming a stop that is not
     drawn. It sits behind the badges, which are opaque navy. */

  .timeline-stop:not(:last-child):before {
    position: absolute;
    z-index: 0;
    background: var(--fx-rule);
    block-size: var(--fx-rule-hairline);
    content: "";
    inline-size: calc(100% + var(--timeline-gap));
    inset-block-start: calc(13 * var(--fx-pt));
    inset-inline-start: 0;
  }

  .timeline-stop > * {
    position: relative;
    z-index: 1;
  }

  .timeline-title {
    margin: 0;
    color: var(--fx-text-title);
    font-size: var(--fx-size-body);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-title-sm);
    line-height: 1.2;
    margin-block-start: calc(6 * var(--fx-pt));
  }

  .timeline-body {
    margin: 0;
    color: var(--fx-text);
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
  }

  /* The conclusion stays directly under the strip. Pushed to the foot of the
     content box it leaves a band of empty slide between the two, which reads as
     a missing block rather than as room. */

  .timeline-takeaway {
    margin-block-start: calc(24 * var(--fx-pt));
  }
</style>
