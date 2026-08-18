<script setup lang="ts">
  /*
   * Template case: terminal-flow - the whole command surface on the dark panel.
   *
   * Seven of seven: the complete set is the claim, so the slide shows all of
   * them rather than the interesting ones. The panel is the only place in the
   * system where the mono face carries running text, and the mono face is spent
   * only on the command itself - the sentence beside it is prose and stays in
   * the brand grotesque, which is what keeps the two columns telling apart what
   * the machine reads from what the reader reads.
   */

  type Command = {
    /* The literal invocation, split so the subcommand can take the accent. */
    verb: string;
    args: string;
    /* What it does, in one line. */
    desc: string;
    /* The clause set apart inside that line. */
    aside?: string;
  };

  const commands: Command[] = [
    { verb: 'install', args: '<spec>', desc: 'installs a template from a source into the local inventory' },
    { verb: 'list', args: '[--json]', desc: 'shows the installed templates with their descriptions' },
    { verb: 'seed', args: '<template> <dir>', desc: 'seeds a new project from a template into a directory' },
    {
      verb: 'add',
      args: '<template> <dir>',
      desc: 'adds a template to an existing project:',
      aside: 'a second screen is one more add',
    },
    {
      verb: 'upgrade',
      args: '<project> <version>',
      desc: 'raises an applied template to a new version, changes arrive as a diff for review',
    },
    {
      verb: 'update-local',
      args: '<identity> <spec>',
      desc: 'updates the template itself in the local inventory',
    },
    { verb: 'validate', args: '<templateDir>', desc: 'checks the template manifest before it is published' },
  ];

  const chips = [
    'Source: git host, path and ref',
    'Local inventory, no registry',
    'Deterministic behavior',
  ];
</script>

<template>
  <div class="deck-body">
    <div class="deck-prompt">
      <div class="deck-cmd-rows">
        <template v-for="command of commands" :key="command.verb">
          <div class="deck-cmd-name">frontx <b>{{ command.verb }}</b> {{ command.args }}</div>
          <div class="deck-cmd-desc">
            {{ command.desc }}
            <em v-if="command.aside">{{ command.aside }}</em>
          </div>
        </template>
      </div>
    </div>

    <div class="deck-chips">
      <span v-for="chip of chips" :key="chip" class="deck-chip">{{ chip }}</span>
    </div>
  </div>
</template>
