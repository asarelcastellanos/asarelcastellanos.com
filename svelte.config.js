import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
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
