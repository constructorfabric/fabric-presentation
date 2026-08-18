/*
 * The deck's sections, in order, and the page each one starts on.
 *
 * Leave the array empty and the footer nav renders nothing - a single-section
 * deck carries a wordmark-and-number footer and no nav at all.
 *
 * `from` is the page number of the section's dark divider slide, which is also
 * the first page the name is shown as current on. The page number is what the
 * layout has to work with: it is the one fact about position that is the same
 * in the dev server and in an export.
 *
 * Adding a divider slide means adding its line here. Nothing checks the two
 * against each other, so the check is the render pass: advance through the deck
 * and watch the marked name change on the page the divider sits on.
 */

export type DeckSection = {
  /* Shown in the footer. Two or three words - the footer band is 10pt. */
  name: string;
  /* The page its divider slide is on. */
  from: number;
};

export const sections: DeckSection[] = [
  { name: 'What it buys', from: 5 },
  { name: 'How it assembles', from: 9 },
  { name: 'What comes next', from: 14 },
];

/* The section a page belongs to: the last one that has started. A page before
 * the first divider - the cover, the agenda, the opening pair - belongs to no
 * section, and the nav then marks nothing rather than guessing. */
export const sectionAt = (page: number): DeckSection | undefined =>
  sections.filter((section) => section.from <= page).at(-1);
