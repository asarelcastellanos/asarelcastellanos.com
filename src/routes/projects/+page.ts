import { projects } from '$lib/content/projects';
import type { PageLoad } from './$types';

export const load: PageLoad = () => ({
	// Cards only need the summary fields, so the compiled bodies stay out of this page's data.
	projects: projects.map(({ slug, title, summary, status, stack, cover }) => ({
		slug,
		title,
		summary,
		status,
		stack,
		cover
	}))
});
