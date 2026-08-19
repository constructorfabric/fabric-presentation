<!--
  custom-nav-controls.vue - the single-file HTML export, as a button in the nav bar.

  Slidev mounts a file of this name from the deck root into the nav control bar,
  after the slide counter (`#slidev/custom-nav-controls`). The export itself is a
  Node process - it runs `slidev build` and inlines fonts and assets afterwards -
  so nothing here can do the work. The button calls `GET /__fabric/export-html`,
  which the deck's own `vite.config.ts` registers on the dev server, and hands the
  reply to the browser as a download.

  IT RENDERS IN DEV ONLY, and that is a requirement rather than a tidiness.
  The thing this button produces is a deck that gets mailed to a room: an export
  control inside it would be dead (there is no dev server behind the file) and
  would invite a reader to click it. Slidev's own two export affordances are
  already dev-only on the same reasoning - the browser exporter is
  `browserExporter: dev` by default, and the download-as-PDF icon needs
  `download: true` in headmatter.

  The guard is `import.meta.env.MODE`, and the reason it is MODE rather than the
  obvious `DEV` is written over the line itself: `DEV` can read true inside a
  build, and this one is the one flag that must not.

  The styling is Slidev's, not the deck's: `.slidev-icon-btn` is the class every
  button in that bar carries, and the icons come from the same carbon set. A
  Fabric colour here would be wrong - this is the tool's chrome, not a slide.
-->

<script setup lang="ts">
import { ref } from 'vue';

/* MODE, not DEV. Vite replaces both at build time, but it derives `DEV` from
   NODE_ENV whenever NODE_ENV is set - so a build spawned by a process that has
   `NODE_ENV=development` (a dev server, a watch task) would hand the built deck
   a `DEV` that reads TRUE, and the button would ship inside the export. `MODE`
   comes from the command instead: `development` under `slidev`, `production`
   under `slidev build`, whatever the environment says. */
const isDev = import.meta.env.MODE === 'development';

const IDLE = 'Export single-file HTML';

const state = ref<'idle' | 'building' | 'done' | 'error'>('idle');
const label = ref(IDLE);

/* The export takes tens of seconds and the browser shows nothing while a fetch
   is in flight, so the button carries the whole state itself: a spinner while
   the build runs, then a tick or the failure's first line, which is what the
   reader needs and is short enough for a tooltip. */
const settle = (next: 'done' | 'error', text: string) => {
  state.value = next;
  label.value = text;
  setTimeout(() => {
    if (state.value === next) {
      state.value = 'idle';
      label.value = IDLE;
    }
  }, 8000);
};

const exportHtml = async () => {
  if (state.value === 'building') return;
  state.value = 'building';
  label.value = 'Building the single-file HTML - this takes a while';

  try {
    const response = await fetch('/__fabric/export-html');
    const text = await response.text();
    if (!response.ok) throw new Error(text.trim().split('\n')[0] || `HTTP ${response.status}`);

    const named = /filename="([^"]+)"/.exec(response.headers.get('content-disposition') ?? '');
    const name = named?.[1] ?? 'deck.html';

    const url = URL.createObjectURL(new Blob([text], { type: 'text/html' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);

    settle('done', `Downloaded ${name}`);
  } catch (error) {
    settle('error', `Export failed: ${(error as Error).message}`);
  }
};
</script>

<template>
  <button
    v-if="isDev"
    class="slidev-icon-btn"
    :class="{ disabled: state === 'building' }"
    :title="label"
    @click="exportHtml"
  >
    <span class="sr-only">{{ label }}</span>
    <div v-if="state === 'building'" class="i-svg-spinners:90-ring-with-bg" />
    <div v-else-if="state === 'done'" class="i-carbon:checkmark" />
    <div v-else-if="state === 'error'" class="i-carbon:warning" />
    <div v-else class="i-carbon:html" />
  </button>
</template>
