<script setup lang="ts">
  /*
   * Template case: category-cards.
   *
   * A row of cards, each a different KIND of thing, each headed by a kicker in
   * accent-blue caps over an ink body. Built from the rendered
   * donors: tpl-08 to tpl-12, the one-to-four-column card rows
   * ("HEADING ONE / HEADING TWO ..."), and exm-11, where the same card flips
   * white because the slide ground is the tint.
   *
   * The Fabric divergence worth naming: the cards do NOT get a colour each.
   * The system is monochrome blue, so what tells one kind from another is the
   * kicker, the order and the words - never the fill. Every card on the row is
   * the same container, which is also why a row of them reads as one set
   * rather than as five decorated boxes.
   *
   * Keep: rounded corners, the --fx-tint fill with its 1pt --fx-line hairline, the
   * kicker in caps and tracked out, and the body in the working ink. If the
   * slide's ground is the tint rather than white, add `tpl-cat_on-tint` to
   * flip the fills - the system never stacks tint on tint.
   *
   * Replace the copy. Four cards fit the content column comfortably; five is
   * the ceiling before the kickers wrap.
   */

  type Card = {
    /* The kind's name, set as the card's kicker. Caps, 3-4 words: tracked-out
       capitals eat about a third more width than the same words in sentence
       case. */
    heading: string;
    /* Three to five points, each one line. The first is the one that matters. */
    points: string[];
  };

  const cards: Card[] = [
    {
      heading: 'First kind',
      points: ['The point that carries the card', 'A second point', 'A third point'],
    },
    {
      heading: 'Second kind',
      points: ['What this kind is for', 'What it needs', 'What it gives back'],
    },
    {
      heading: 'Third kind',
      points: ['The part already in place', 'What it covers', 'Where it stops'],
    },
    {
      heading: 'Fourth kind',
      points: ['The part still moving', 'What it waits on', 'What decides it'],
    },
    {
      heading: 'Fifth kind',
      points: ['The part we own', 'How it is reached', 'What it guarantees'],
    },
  ];
</script>

<template>
  <div class="tpl-cats">
    <section v-for="card of cards" :key="card.heading" class="tpl-cat">
      <h3 class="tpl-cat-head">{{ card.heading }}</h3>
      <ul class="tpl-cat-body">
        <li v-for="point of card.points" :key="point">{{ point }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
  /* Every value comes from assets/fabric-tokens.css. Import that file in the
     deck before this component renders, and set --fx-scale once for the deck's
     canvas (Slidev's 980px canvas: 0.7656). */

  .tpl-cats {
    display: grid;

    /* The row of cards fills the content box: a band of unused space under a
       card row reads as an unfinished slide, and the donors run their cards to
       the full height of the content zone. */
    align-items: stretch;
    block-size: 100%;
    font-family: var(--fx-font);
    gap: calc(16 * var(--fx-pt));
    grid-template-columns: repeat(5, 1fr);
    inline-size: 100%;
    max-block-size: 100%;
  }

  /* The card: rounded, tint fill, 1pt hairline, no shadow. The donors set the
     corner at roundRect adj 3000, which is the --fx-radius token. */

  .tpl-cat {
    display: flex;
    flex-direction: column;
    border: var(--fx-rule-hairline) solid var(--fx-rule);
    border-radius: var(--fx-radius);
    background: var(--fx-surface-tint);
    block-size: 100%;
    padding: var(--fx-card-pad);
  }

  /* The flip for a tint slide (exm-11): white fill, same hairline. */
  .tpl-cat_on-tint {
    background: var(--fx-surface);
  }

  /* The kicker: accent blue, bold, caps, tracked out. It is the only coloured
     element on the card, and it is the only one that needs to be. */

  .tpl-cat-head {
    margin: 0;
    color: var(--fx-text-accent);
    font-size: var(--fx-size-kicker);
    font-weight: var(--fx-weight-bold);
    letter-spacing: var(--fx-track-caps);
    line-height: 1.2;
    text-transform: uppercase;
  }

  .tpl-cat-body {
    margin: 0;
    color: var(--fx-text);
    font-size: var(--fx-size-text);
    line-height: var(--fx-leading-body);
    list-style: none;
    padding-block: calc(10 * var(--fx-pt)) 0;
    padding-inline: 0;
  }

  .tpl-cat-body li {
    position: relative;
    padding-inline-start: calc(10 * var(--fx-pt));
  }

  .tpl-cat-body li + li {
    margin-block-start: calc(6 * var(--fx-pt));
  }

  /* The bullet mark: a small navy dot, the same structural navy as a step
     circle or a table header. It marks the line, it does not classify it. */

  .tpl-cat-body li:before {
    position: absolute;
    border-radius: 50%;
    background: var(--fx-navy);
    block-size: calc(3 * var(--fx-pt));
    content: '';
    inline-size: calc(3 * var(--fx-pt));
    inset-block-start: 0.55em;
    inset-inline-start: 0;
  }
</style>
