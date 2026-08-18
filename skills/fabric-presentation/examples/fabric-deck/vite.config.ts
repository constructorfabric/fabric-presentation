/*
 * Vite config for this deck. It exists for ONE job: the single-file HTML export
 * (`scripts/export-single-html.mjs` in the fabric-presentation skill).
 *
 * A plain `slidev build` must keep Slidev's own chunking - the SPA in `dist/`
 * loads faster split than welded - so everything here is behind the environment
 * variable the export script sets. With FABRIC_SINGLE_FILE unset this file adds
 * nothing at all, which is why it can sit in every deck.
 *
 * The three settings that make one file possible, and why each is needed:
 *
 *  - `viteSingleFile()` welds the emitted .js and .css back into index.html.
 *  - `inlineDynamicImports` stops Rollup splitting the bundle: a dynamic import
 *    would emit a sibling chunk the welded HTML could never fetch over file://.
 *  - `manualChunks` must then be REMOVED. Slidev sets one (shiki, monaco,
 *    ~icons), and Rollup refuses to accept manualChunks together with
 *    inlineDynamicImports - the build fails outright with INVALID_OPTION rather
 *    than silently splitting. vite-plugin-singlefile does not clear it, so the
 *    small `enforce: post` plugin below does.
 */

import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const singleFile = process.env.FABRIC_SINGLE_FILE === '1';

/* Runs after vite-plugin-singlefile has set inlineDynamicImports, and takes
   Slidev's manualChunks back off. Mutating the config object is how a Vite
   `config` hook edits in place; returning a partial would merge rather than
   delete. */
const dropManualChunks = {
  name: 'fabric:drop-manual-chunks',
  enforce: 'post' as const,
  config(config: Record<string, any>) {
    const output = config.build?.rollupOptions?.output;
    for (const o of Array.isArray(output) ? output : [output]) {
      if (o) delete o.manualChunks;
    }
  },
};

export default defineConfig({
  plugins: singleFile ? [viteSingleFile(), dropManualChunks] : [],
});
