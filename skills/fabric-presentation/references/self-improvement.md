# Self-improvement: how this skill changes

SKILL.md says the skill is developed from what the decks teach it. This file is the mechanism: what licenses a change, where it lands, what evidence it needs, and what has to pass before the change leaves your hands.

The law in one line: **the skill accumulates proven procedure, git accumulates history.** The skill's text is the current best instruction to whoever builds the next deck. It is not a diary, and it carries no log of what it used to say - that is what the commit history is for, and a reader who wants the story reads `git log`, not the skill.

---

## 1. The rule of repair

A defect observed in use is fixed **in place, in the session that observed it**, in whatever part of the skill carried it: the reference with the wrong rule, the template case built on it, the checker that failed to catch it, the scaffolder that generated it.

No entry accompanies the fix. The commit message carries what changed, why, and the evidence - that is the record, and it is one that never goes stale, never conflicts with the instruction beside it, and never has to be pruned.

A defect is one of:

- **A rule here turned out wrong.** Not incomplete, wrong: it named a colour, a form or a measurement that a rendering or a review contradicted. The most valuable kind, because a wrong rule is followed confidently.
- **A trap the skill did not warn about.** A command that fails on first use, a value that resolves to nothing, a flag that silently changes the output, a server that dies when it is backgrounded. Traps cost a whole round when they are met blind.
- **A ruling from someone who owns the style.** A review, a call, a decision from the person who is allowed to decide. Record what was ruled, not the discussion.
- **A shape that recurred a third time.** The same structure carried a claim on a third slide - that is a case for `templates/`, not a coincidence.

## 2. Edit only on an observed defect, and a person accepts it

The trigger for an edit is something that actually steered a build wrong, or a ruling from the style's owner. Never "everything a run learned".

This is the narrowing the field converged on. The one self-editing skill Anthropic ships used to fold in whatever a run turned up, and the result was constant churn in the recorded file; it now edits only where the file steered the run wrong - a command that failed, a step that was missing - so the file can be committed without a per-session diff. Two failure modes sit behind that narrowing, and both are ours too: an append-everything file grows until nobody reads it, and a skill that rewrites itself from its own output drifts, because self-feedback with no external check has nothing to correct it. A failed command, a review, a measured eval - those are external. A feeling that the run went well is not.

An agent drafts the edit; a person who owns the skill accepts it. That split is measured, not ceremonial: curated skill content lifts task performance where model-self-generated content delivers about zero - models consume procedural knowledge far better than they author it. Improvement is a deliberate pass over a named defect, never a silent mutation in the middle of doing something else.

A candidate that is not yet a defect - a hunch, a single papercut the run recovered from - is not an edit. It goes to the repository's issues, and it earns an edit only when it recurs and the failure it would have prevented can be named. One weird session must not become permanent policy.

## 2a. What may be written here at all

Before evidence, a content test. The skill may carry only what is at least one of:

1. **Outside the model's training data** - learned here through rendering, measurement, experiment, or a ruling; something a fresh model would get wrong without the hint.
2. **Context-specific** - true of this style, this toolchain, these files; known now and lost when the context clears.

Everything else is the model telling itself what it already knows, and that content is measured as worse than nothing: it spends attention, dilutes the rules that do carry weight, and reads as coverage while adding none. The same test kills enumeration: never list cases a model already generalises over - languages a user might write in, phrasings a request might take, synonyms of a trigger word. If the model generalises it, one statement of the rule is the whole entry; the list form adds tokens and subtracts nothing.

And where a rule is mechanically checkable, the skill's text is the wrong home for it altogether: put it in `check-style.mjs` or `skill-doctor.mjs`, where breaking it fails a run instead of hoping to be read, and let the prose shrink to a pointer. Enforcement beats instruction; prose is for judgment calls a script cannot make.

## 3. The evidence bar

**A style rule may be written here only from something SEEN in a rendered page or measured in a live DOM. Inference is not evidence: not from a theme slot's name, not from a fill census over layout XML, not from tint arithmetic over the scheme, not from what a token is called. Those inputs are all real, and all of them are silent about how a colour is used, which is the only thing a rule about colour can be about. The bar exists because a derived colour rule fails in a way review does not catch: the inputs are real, the reasoning is sound, and the conclusion is still about something the source never said - so it survives every reading and is disproved only by looking at a page. Where the rendering is silent, write "not observed" and stop. That sentence is a finding; a rule inferred to fill the gap is a defect with a confident voice.**

What clears the bar, in descending order of strength: a rendered page of the official template or an example deck, read at zoom, with the page number recorded; a measured value off that render (a fill percentage, a hex sampled from a pixel); a screenshot of our own deck in a real browser; a measurement taken from the live DOM. What does not clear it: a name, an arithmetic derivation, a plausible pattern, the way the last deck did it, or a build that went green.

The bar applies to rules. It does not apply to traps: a command that failed with a message is evidence of itself, and the message is the record.

Cases in `templates/` have their own bar: a case grows from a slide that has been **presented and reviewed**, never from a draft. Copying an unreviewed slide into `templates/` promotes one person's guess to the house pattern, and the next deck inherits it as settled.

## 4. Newest wins, in place

Where two rulings disagree, the newer one **rewrites** the older. Two versions of a rule in two files is worse than either version alone: an agent reading contradictory instructions picks one arbitrarily, so a contradiction is not a hedge, it is a coin flip.

A ruling does not stop at the file that carried the rule. The sweep it needs, in order: the reference that carried the old rule, every template case whose header comment cites the old reasoning, the checker rule that enforced it, and the token comments that repeat it. Take `candidate-tiles`: its chips carry a direction motif in the secondary blue, justified against the palette law in a comment beside the rule that sets it. Change what the law says about that colour and the case is not merely unjustified, it is wrong - and a skill that ships a law and a worked example contradicting each other loses, because the example is what gets copied.

## 5. Prune with proof

Removing a rule is an edit like any other and needs the same evidence. Over-pruning is a measured failure mode, not a theoretical one: cutting for brevity drops the load-bearing detail along with the padding, and rewriting a file wholesale erodes detail run after run until what is left is a summary of a summary. Both are caused by the same move - the monolithic rewrite. Edit the item that is wrong; leave the rest of the file alone.

When a rule looks redundant but you cannot show it costs anything, compress it rather than delete it. When you do cut, test the cut: run the evals before and after, and if the run gets worse, put it back and find a different fix.

**On a model change, prune by ablation.** A newer model retrieves instructions more aggressively and self-checks by default, so two classes of rule turn from dormant to harmful: the abstract rule ("be careful with...", "double-check...") that now fires on tasks it was never written for and gets filled in with a guess, and the verify-again instruction that duplicates what the model already does. The test is a bisect: remove a suspect rule, run the evals, restore it only if the run got worse. Concrete, domain-specific facts survive this; abstractions rarely do.

## 6. The verification gate

Nothing leaves your hands until:

1. `node scripts/skill-doctor.mjs` is clean - the integrity check below.
2. `node scripts/check-style.mjs examples/fabric-deck` is clean - the reference implementation still obeys the law the prose states.
3. **When the change touches instructions rather than prose**, the evals in [../evals/evals.json](../evals/evals.json) run against the new version and the old one, and the new version does at least as well. An edit that does not improve the run does not ship. This is the only check that can tell an improvement from a change: a skill edit that reads better and performs worse is common, and reading it again will not reveal that.

Two facts about running them honestly. The graders that cannot be fooled are the deterministic ones - `check-style.mjs` over what the run produced, the exporter's own self-containment audit - so lean on those wherever an expectation can be phrased as one; a model grading its own kind will pass plausible output. And the fixed prompts are a floor, not coverage: a run graded only against wording it has seen before learns to pass the wording, so when judging a change, rephrase the scenarios and keep only the expectations fixed.

Re-run the evals when the model changes too. An instruction that carried its weight on one model can be dead weight on the next - and §5's ablation pass is what the re-run feeds.

## 7. The integrity check

Prose cannot check itself, and the parts of this skill that are not prose can break silently: a case that no longer compiles, a `var()` naming a property nobody defines, a pointer to a file that moved.

```
node scripts/skill-doctor.mjs [skill-dir] [--quiet] [--twin <dir>] [--vue <dir>]
```

Run it from the skill root at the end of any session that changed the skill, and before trusting a case. It compiles every `templates/*.vue` (falling back to a declared structural read when no Vue compiler is reachable), resolves every custom property referenced in `templates/` and `deck-style.css` against `assets/fabric-tokens.css`, runs `check-style.mjs` over `templates/` and `assets/`, and checks that every file SKILL.md and the references point at exists. Where a project keeps a second copy of the skill, `--twin <dir>` adds a byte-level diff of the two; without the flag nothing on disk is searched for. It prints a findings table and exits 1 on any finding.

Two scoping facts worth knowing before reading its output. The style check is run over `templates/` and `assets/` only, because the law's own anti-pattern tables quote off-scheme hexes with a `#` and a grep-grade checker cannot tell documentation from a declaration; the template cases avoid this by writing such hexes without the `#`. And the Vue compile step needs `vue/compiler-sfc`, which the skill does not carry: where no deck's `node_modules` is reachable it falls back to a structural check and says so in its output rather than reporting a pass it did not earn.

`scripts/new-deck.mjs` is the other side of the same machinery - it scaffolds a Fabric Slidev deck out of this skill's own material, and [fabric-slidev-decks.md](fabric-slidev-decks.md) carries its usage.

## 8. What does not go in the skill

- **Open unknowns.** A question the round could not settle goes to the repository's GitHub issues, where it can be assigned, discussed and closed. A file of open questions inside the skill is loaded into every run that triggers it and answers none of them.
- **History.** What a rule used to say, when it changed, who changed it: `git log`.
- **One-off taste.** A choice that belonged to one slide's content, one audience or one room. Promoted, it makes the next deck obey a preference nobody holds.
- **Something reasoned out but not seen.** See §3.
