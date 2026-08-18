# Building a self-improving skill

The house guide for authoring an agent skill in this organisation. Read it before you write the first line of a new `SKILL.md`; it is the shape every skill here is expected to have and the loop every skill here is expected to run.

## 1. What a self-improving skill is

A skill that treats its own text as code: versioned, validated by scripts, and repaired from evidence of real use.

What it is **not** is a diary. The temptation is strong, because a skill is where the learning happened - so the skill grows a `LEARNINGS.md`, entries get dated, and within a month the file is longer than the instructions and nobody reads either. [obra/superpowers' writing-skills](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) names that shape an anti-pattern outright: dated session narratives ("in session 2025-10-03 we found...") do not belong in a skill, because a skill is a reference guide for a proven technique, not the story of how it was proven. The [Agent Skills specification](https://agentskills.io/specification) is the same evidence from the other side - the only bundled directories it names are `scripts/`, `references/` and `assets/`. There is no slot for a log because nothing consumes one.

**The law, in one line: the skill accumulates proven procedure, git accumulates history.**

Anthropic's own tooling draws that line explicitly. Its per-project learning store is [auto memory](https://code.claude.com/docs/en/memory) - machine-local, uncommitted, capped at 200 lines and 25KB, force-pruned when it overflows - and its routing rule says that when an entry is a multi-step procedure, it moves out of memory and **into a skill**. The skill receives the distilled procedure. The history stays behind.

**The content test.** Before any sentence enters a skill, it passes one of two gates: it is **outside the model's training data** (learned here through research, experimentation or a ruling - something a fresh model would get wrong without the hint), or it is **context-specific** (true of this project and lost when the context clears). Everything else is the model telling itself what it already knows - the practitioner phrasing is [exactly that](https://news.ycombinator.com/item?id=47040430), and [SkillsBench](https://arxiv.org/abs/2602.12670) measured such self-generated content at approximately zero to negative effect while curated content lifted outcomes by 16.6 points. The corollary kills a whole class of padding: **never enumerate what the model generalises over** - languages a user might write in, phrasings a request might take, synonyms of a trigger word. One statement of the rule is the entry; the list form adds tokens and subtracts signal. When a team [audited its own agent-written rules file](https://www.reddit.com/r/ClaudeCode/comments/1r95h0c/), what had accumulated was "things the model already knows ('always write clean code'). Useless or actively harmful."

## 2. The anatomy

```
skill-name/
  SKILL.md          frontmatter + instructions
  references/       docs loaded on demand
  scripts/          anything deterministic
  assets/           canonical values and files used in output
  examples/         a runnable reference implementation
  evals/evals.json  the regression test
```

- **SKILL.md** under 500 lines and roughly 5k tokens. It is loaded in full every time the skill triggers, so everything in it is paid for on every run. Beyond that size, add a layer of hierarchy and point at it. ([best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices))
- **The description is the trigger.** Name what the skill does *and* the contexts that should invoke it, in the frontmatter - not in the body, which is not read until after the decision to load. Models under-trigger skills, so write it pushy: not "how to build a dashboard" but "use this whenever the user mentions dashboards, metrics or displaying company data, even if they do not say the word dashboard." ([skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator))
- **Frontmatter carries only spec-legal keys**: `name`, `description`, `license`, `allowed-tools`, `metadata`, `compatibility`. Anything else fails validation. `name` must equal the directory name, kebab-case. ([spec](https://agentskills.io/specification))
- **references/** one level deep, each file owning one domain so only the relevant one is read. Over ~300 lines, give it a table of contents.
- **scripts/** for everything deterministic. Anthropic's guidance is blunt about this - prefer a script to a paragraph of instructions wherever the operation is mechanical, and give the script **verbose, teaching error messages**, because the agent's inner loop is "run validator, fix what it names, repeat". A script that fails with `exit 1` teaches nothing. ([best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices))
- **assets/** with **one source of truth per value domain.** Our precedent: every colour value in `fabric-presentation` is defined in exactly one tokens file; the prose names colours by token, the templates reference them, and the style checker derives its legal palette from that same file at startup rather than restating it. A value duplicated in two places is a contradiction with a delay fuse.
- **A runnable example** is the reference implementation the prose is checked against. Prose drifts silently; an example that no longer builds fails loudly.
- **evals/evals.json** - see §4. Write at least three scenarios, and write them **before** the extensive documentation, not after: they tell you which instructions are load-bearing.

## 3. The learning loop

Seven rules. Each is here because it is measured, not because it sounds prudent.

**1. Edit in place, on an observed defect only.** The trigger for a change is something that actually steered a run wrong - a command that failed, a step that was missing, a ruling from whoever owns the domain. Not "everything the run learned". This is the exact narrowing Anthropic made to `/verify`, the one self-editing skill it ships: the earlier version folded in whatever a run turned up and produced frequent merge conflicts, and the current one edits the recorded file only where that file steered the run wrong, **so the file can be committed without a per-session diff** ([Claude Code skills](https://code.claude.com/docs/en/skills)). The failure it fixes is ours too: a file that appends on every run stops being read.

**2. External evidence, never self-feedback.** A skill that rewrites itself from its own output drifts, because nothing in the loop can contradict it - [SkillLearnBench](https://arxiv.org/abs/2604.20087) measures self-feedback alone inducing recursive drift, while external feedback (a failed command, a human review, a measured eval) makes the iteration genuine. Define, per skill, what its evidence bar is and write it down. Ours for the presentation skill: a style rule may be written only from something seen in a rendered page, measured in a live DOM, or ruled by the style's owner. Yours will differ; having one is what matters, because the alternative is a confident inference that reads as sound and is disproved only by looking.

**3. Newest wins, in place.** A changed decision **rewrites** the old rule; it does not stand beside it. Anthropic states the consequence plainly: where two rules contradict each other, the model may pick one arbitrarily ([memory](https://code.claude.com/docs/en/memory)). A contradiction is not a hedge, it is a coin flip, and two versions of a rule are worse than either alone. Sweep the whole skill when a ruling lands - the reference, the examples built on it, the validator that enforced it, the comments that repeat it.

**4. Prune with proof.** Removing a rule is an edit and needs the same evidence as adding one. [ACE](https://arxiv.org/abs/2510.04618) names the two opposite failure modes: **brevity bias**, where compressing for elegance drops the load-bearing detail with the padding, and **context collapse**, where iterative monolithic rewriting erodes detail until what is left is a summary of a summary. The mitigation for both is the same - localized delta edits on itemized content, never a wholesale rewrite. Test the cut: superpowers v6.2.0 measured one of its own simplifications degrading behaviour from 8/10 to 5/10 and reworked it instead of shipping it ([release notes](https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md)).

**5. A human curates.** [SkillsBench](https://arxiv.org/abs/2602.12670) measured human-curated skills lifting task performance by 16.6 percentage points while model-self-generated skills delivered approximately zero. Models are excellent consumers of procedural knowledge and unreliable authors of it. An agent may draft the edit; a person who owns the domain accepts it.

**6. Enforce, don't instruct.** The highest-consensus community position on this whole topic ([544 points](https://www.reddit.com/r/ClaudeAI/comments/1rz2oo3/), and the point of the failure story behind it): mechanically checkable rules do not belong in prose at all. The working heuristic: "if breaking it corrupts state or breaks a build, it belongs in a deterministic check (hook, lint, test), not a directive" - and the observed dynamic is that lessons **graduate out of markdown**: a judgment note becomes, once its mechanical core is clear, a validator rule, and the prose shrinks to a pointer. More rules in context are not enforcement; a rule the model states and then violates in the same reply is a [documented, reproduced failure](https://www.reddit.com/r/ClaudeAI/comments/1u6f7cr/), fixed by an operational check, not by restating the principle.

**7. Capture is not promotion.** A candidate lesson - a papercut, a hunch, one odd session - is not an edit; it is an issue. It earns an edit only when it recurs and the failure it would have prevented can be named. This keeps one weird session from becoming permanent policy, and it is the guard practitioners converged on for exactly the "garbage piling up" worry ([r/ClaudeCode](https://www.reddit.com/r/ClaudeCode/comments/1v5aq8t/)); the working systems all add a hard cap with forced eviction and report that the store's best entries keep graduating out of it into code.

The three self-improvement systems in the literature ([SkillOpt](https://arxiv.org/abs/2605.23904), [SkillAudit](https://arxiv.org/abs/2606.14239), [SkillRevise](https://arxiv.org/abs/2606.01139)) converge on one operating rule that subsumes all seven: **accept a skill edit only when a re-run measurably improves, and roll it back otherwise.**

## 4. The verification loop

Two loops, at two speeds.

**The inner loop is validator scripts** - seconds, run on every change. Bundle them with the skill:
- a **doctor** that checks the skill's own parts still hold together: examples compile, referenced values resolve, every link points at a file that exists. These rot silently. An undefined CSS custom property does not warn, it invalidates the whole declaration while every build stays green.
- a **domain checker** the skill's output must pass, which the skill also runs against its own bundled example - so the reference implementation is proof the prose is followable.

**The outer loop is evals** - minutes, run when instructions change. The schema `skill-creator` reads ([references/schemas.md](https://github.com/anthropics/skills/blob/main/skills/skill-creator/references/schemas.md)):

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's example prompt",
      "expected_output": "Description of expected result",
      "files": ["evals/files/sample.pdf"],
      "expectations": ["The output includes X", "The skill used script Y"]
    }
  ]
}
```

Three things it buys, each documented in [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator) and [evaluating skills](https://agentskills.io/skill-creation/evaluating-skills):

1. **Isolation.** Each case runs in a fresh subagent that has only the prompt and the skill. You cannot evaluate a skill in the session that wrote it - you know too much, and you will supply from memory what the skill fails to say.
2. **A baseline.** Run every case with the skill and without it. A skill that does not beat no-skill is costing tokens for nothing, and the without-skill runs are also what tell you *which* instructions carry the win.
3. **Blind A/B before you commit.** Give an independent judge both versions' outputs without saying which is which. This is the only check that separates an improvement from a change: an edit that reads better and performs worse is common, and re-reading it will not reveal that. ([Anthropic on skill-creator](https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills))

Three practices keep the outer loop honest, each learned from a reported failure:

- **Make one scenario adversarial** - the user explicitly asks to break the rule or skip the gate. Cooperative scenarios pass on charm; the [documented finding](https://www.reddit.com/r/ClaudeAI/comments/1u6f7cr/) is that a skill can quote its own principle in the reply and still do the forbidden thing, and only the adversarial case surfaces it.
- **Rephrase the prompts, fix only the expectations.** Output judged repeatedly against the same wording learns to pass the wording; two independent practitioners report regenerating scenario phrasings per run and keeping just a small fixed core. The eval file is a golden set re-run on model bumps - the one eval artifact the community consistently keeps - not a coverage suite.
- **Prefer deterministic graders.** A model grading a model passes plausible output ("Claude verifying Claude is circular - of course it passes itself"). Wherever an expectation can be phrased as a script run - the domain checker over the produced output, an exit code, a grep - phrase it that way.

Re-run the evals **on model updates**, not only on skill edits. An instruction that earned its place on one model can be dead weight on the next, and the failure runs the other way too: a rule tuned to one model's literal-mindedness becomes a harmful hard constraint on a model that interprets. On a model bump, prune by ablation - bisect the instructions against the golden set and restore only what changes output; Anthropic's own guidance for major model updates is [ablative to the point of "delete and see"](https://www.reddit.com/r/ClaudeAI/comments/1vheltz/), with the practitioner amendment that deterministic guardrail hooks are the thing to keep.

**Trigger tuning** is a separate, transient exercise: a list of `{"query": ..., "should_trigger": true|false}` lives in the tuning workspace beside the skill (per `skill-creator`), not in the shipped skill. Two facts to tune against: the [measured problem is activation, not selection](https://www.reddit.com/r/ClaudeCode/comments/1qzjy2h/) - when the skill fires at all, it is almost always the right one - and over-firing is reported more often than under-firing, so negatives that should trigger *nothing* carry information positives cannot. The valuable negatives are near-misses sharing vocabulary with the skill; an obviously irrelevant negative tests nothing. Do not enumerate languages or phrasings the model generalises over - that is content-test padding in eval form.

## 5. Git and releases

- **The commit message is the log.** What changed, why, and the evidence. It never goes stale beside the instruction it describes, and it never needs pruning.
- **No CHANGELOG inside the skill.** No public skill repository keeps one - not [anthropics/skills](https://github.com/anthropics/skills), not [obra/superpowers](https://github.com/obra/superpowers). They rely on commit history.
- **Version in frontmatter `metadata`**, if you version at all. Note that [skills.sh](https://skills.sh) updates installed skills by git tree SHA, not by semver, so the version number is documentation for humans, not a distribution mechanism.
- **Release notes at the repository root, not in the skill** - and only when a change has a measured before and after worth publishing. superpowers' `RELEASE-NOTES.md` is the model: per rule change, what was measured before and after.
- **Open unknowns go to GitHub issues**, where they can be assigned, discussed and closed. A file of open questions inside the skill is loaded into every run that triggers it and answers none of them.

## 6. Failure modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Rule bloat** | SKILL.md past 500 lines, every run paying for instructions that fire once a year | Split into `references/`; move the deterministic parts into `scripts/`; cut with an eval, not by taste |
| **One-off promoted to rule** | One deck's preference is now house law and the next author obeys a taste nobody holds | An explicit evidence bar, written into the skill, that a single occurrence does not clear |
| **Recursive drift** | The skill edits itself from its own output and diverges from reality with rising confidence | Only external evidence licenses an edit ([SkillLearnBench](https://arxiv.org/abs/2604.20087)) |
| **Context collapse** | Repeated rewrites erode the file into a summary of a summary | Localized delta edits on itemized content; never a wholesale rewrite ([ACE](https://arxiv.org/abs/2510.04618)) |
| **Brevity bias** | A tidy-up drops the one sentence that was load-bearing | Prune with proof; when in doubt compress rather than delete; micro-test the cut |
| **Merge-conflict churn** | An append-on-every-run file makes every session a diff and every branch a conflict | Edit in place, on observed defects only ([the `/verify` narrowing](https://code.claude.com/docs/en/skills)) |
| **Negative transfer** | A model-authored rule generalises from one run and makes every other run worse | A human owner accepts every edit ([SkillsBench](https://arxiv.org/abs/2602.12670)) |
| **Contradiction** | Two versions of a rule in two files; the agent picks one arbitrarily | Newest wins, in place, with a sweep of everything the old rule touched |
| **Latent-knowledge padding** | The skill restates what the model already knows; enumerated cases the model generalises over | The content test: outside training data, or context-specific - or it does not enter |
| **Model-bump drift** | A skill tuned to one model degrades on the next; abstract rules fire on tasks they were never written for | Re-run the golden set on every model update; prune by ablation, keep deterministic guardrails |
| **Skill-pool dilution** | Dozens of installed skills; trigger precision collapses and the agent picks the wrong skill or none ([measured 29.6% to 3.3% as a pool grows 5 to 100](https://arxiv.org/abs/2608.14036)) | Few skills, sharp descriptions; delete what has not fired in a month |

## 7. Checklist for a new skill

Before it ships:

- [ ] `name` equals the directory name, kebab-case; frontmatter carries **only** spec-legal keys
- [ ] `description` names what it does **and** when to trigger, written pushy, all triggering info in the frontmatter and none in the body
- [ ] SKILL.md under 500 lines; anything longer is a `references/` file with a pointer and, past ~300 lines, a table of contents
- [ ] Every deterministic operation is a script, and every script fails with a message that says what to fix
- [ ] One source of truth per value domain, with the checkers deriving from it rather than restating it
- [ ] A runnable example the prose is checked against, and it passes the skill's own checker
- [ ] Every sentence passes the content test: outside training data, or context-specific - and nothing enumerates what the model generalises over
- [ ] At least three eval scenarios in `evals/evals.json`, one of them adversarial, written before the documentation was polished, with `expectations` a deterministic grader can check where possible
- [ ] Trigger tuning done in the workspace with near-miss negatives; the query file is not shipped in the skill
- [ ] The skill's self-improvement contract is written down: what licenses an edit, who accepts it, the evidence bar, the verification gate
- [ ] No log file, no changelog, no backlog inside the skill; unknowns are issues
- [ ] The official validator passes (`quick_validate.py` from [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator))
- [ ] The doctor is clean, the domain checker is clean, and the evals were run against the version being replaced

The last line is the one that matters most, and it is worth restating on its own: **an edit that does not improve the run does not ship.**
