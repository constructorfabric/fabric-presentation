# Fabric Presentation

An agent skill that builds Constructor Fabric slide decks in [Slidev](https://sli.dev). It carries the Fabric style as enforceable rules - the monochrome-blue palette, type ladder and composition law derived from the official Fabric templates - plus CSS tokens, worked slide templates, a deck scaffolder, a style checker, a runnable example deck, and export to PDF or a single self-contained HTML file. Point your coding agent at it and ask for a deck; the skill keeps the result on brand.

## Install

Via [skills.sh](https://skills.sh):

```sh
npx skills add constructorfabric/fabric-presentation
```

Add `-g` to install globally instead of into the current project.

Requires Node 18 or newer.

Manual alternative: copy [`skills/fabric-presentation/`](skills/fabric-presentation/) into your agent's skills folder as `fabric-presentation/` - `.claude/skills/` for Claude Code, or `.agents/skills/` if your agent follows that convention.

Then ask your agent, for example: "build a presentation about our roadmap using the fabric-presentation skill". The fastest start is a copy of [`skills/fabric-presentation/examples/fabric-deck/`](skills/fabric-presentation/examples/fabric-deck/) - a runnable deck where every slide is a different composition.
