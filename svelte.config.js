import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			// Keep straight quotes and plain hyphens. The default turns "--" into a dash and quotes into curly ones.
			smartypants: false,
			// src/lib/content/frontmatter.ts is the only frontmatter parser. mdsvex still has to strip the
			// block from the body, so it gets a parser that reads nothing.
			frontmatter: { type: 'yaml', marker: '-', parse: () => ({}) }
		})
	],
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// Pinned so the build doesn't depend on the local Node version. Every page is prerendered,
		// so this runtime only serves the fallback function.
		adapter: adapter({ runtime: 'nodejs24.x' })
	}
};

export default config;
