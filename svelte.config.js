import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

// Build config for rendering the kb export locally. The export ships src/ only.
const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook } }), vitePreprocess()],
  // CSS inlined, so one rendered page file reads the same as the site.
  kit: { adapter: adapter(), inlineStyleThreshold: Infinity },
};
