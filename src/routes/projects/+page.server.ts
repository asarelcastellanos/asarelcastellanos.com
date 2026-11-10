import { projects, toCardData } from '$lib/content/projects';
import type { PageServerLoad } from './$types';

// A server load, so the Markdown bodies stay out of the browser bundle for this page.
export const load: PageServerLoad = () => ({
	projects: projects.map(toCardData)
});
