import { projects } from '$lib/content/projects';
import type { LayoutServerLoad } from './$types';

// The header hides its Projects link while every project is a draft.
export const load: LayoutServerLoad = () => ({
	hasProjects: projects.length > 0
});
