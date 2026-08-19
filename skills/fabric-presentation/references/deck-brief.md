# The brief: gathering content before slides

This skill draws presentations; the content comes from the user. The brief is the intake: what to ask, how to ask it, where the answers land, and the gate that keeps slides from being drawn against content nobody confirmed. The questions in SKILL.md's "Settle first" are the opening of this intake, not the whole of it.

## Classify first, and say so

Ceremony scales with the request; the gate never does. Name the classification aloud so the user can override it:

- **An edit.** Review, restyle, export, or fixing slides in a deck that exists. No brief is owed - work on the deck.
- **A deck from material.** A new deck, but the content already exists: notes, a document, a ticket, a previous deck. The brief is assembled FROM the material; the user is asked only what the material does not answer. Material answers content questions - it almost never answers the audience, time and format ones.
- **A deck from a conversation.** A new deck with nothing to read. The full interview below.

Whatever the class, **no slide is drawn until the claims outline is approved** (see The gate).

## How to ask

- **One question per message.** A wall of questions gets a wall of half-answers. Prefer multiple choice where the options are enumerable, with a recommended option first.
- **Ask only what is missing.** Everything the request or the material already answered is not asked again; a question whose answer would not change the deck is not asked at all.
- **Where the Superpowers `brainstorming` skill is installed, run the questioning through it** - it carries this discipline natively. Where it is not, follow this section inline; the discipline is the same either way.

## The questions, and where each answer lands

| # | Question | Lands in |
|---|---|---|
| 1 | Who is the audience, and what do they already hold? | brief: Audience - decides what to skip ("show the delta") |
| 2 | How many minutes? | brief: Format - the slide-count ceiling, at roughly 40 seconds a slide |
| 3 | Presented live, or filed and read later? | Settle first: what must be ON the slide vs said aloud |
| 4 | What does the deck export to, and does it need to animate? | Settle first: the export format |
| 5 | Is the first content slide the agenda, or the whole story in miniature? | Settle first: survival against time cuts |
| 6 | What is the one thing the room must leave believing? | brief: the conclusion - the deck ends on it |
| 7 | What happened / what exists: the facts, figures and their sources | brief: Claims outline and Sources |
| 8 | What must NOT appear on a slide? | brief: Off the slide - feeds the notes' "Not on the slide" lines |

## Where it lands: `brief.md` in the deck directory

The brief is working material of the deck, not of the skill: it lives beside `slides.md` and is committed with the deck. Its sections, each with what does NOT belong in it - a section without that boundary gets neighbouring content mixed into it and degrades to plain text:

```md
# Brief: <deck name>

## Audience
Who, what they hold already, what they need to leave with. NOT: content.

## Format
Minutes, slide ceiling, live or filed, export target. NOT: design choices.

## Claims outline
One sentence per slide, in order - each a claim, not a topic. Two sentences
for one slide means two slides. NOT: layouts, visuals, phrasing for the
slide itself.

## Sources
Where each figure and fact comes from, per claim. NOT: prose retelling them.

## Off the slide
What stays out and why: sensitive, below the audience, said-aloud-only.
```

## The gate

Present the claims outline in chat - the numbered one-sentence-per-slide list - and **stop until the user approves it**. Presenting the outline and starting the slides in the same message is skipping the gate. The approved outline is the contract the slides are built against: a slide that drifts from its approved claim is a defect, and a new claim discovered mid-build goes back to the user as an outline change, not straight into the deck.

Before presenting, one self-review pass, calibrated to flag only what would change the deck: a placeholder left in a claim, two claims that contradict each other or a number beside them, a scope that is really two decks, a slide nobody asked for.

## Red flags

| Thought | Reality |
|---|---|
| "They gave me a document - nothing to ask" | The document answers content questions. It does not answer audience, minutes, live-or-filed, export. Ask the missing ones. |
| "I'll draft the slides and confirm afterwards" | The gate is before slides. Redrawing costs more than asking. |
| "More slides is more thorough" | The time budget is the ceiling. A slide that will not be reached is dead weight. |
| "I'll build the deck shell while waiting for approval" | Scaffolding is fine; content is not. Nothing content-bearing before yes. |
| "The answer is obvious, I'll assume it" | An obvious answer costs one short question; a wrong assumption costs the deck. Assume only what you state in the outline message. |
