import { error } from '@sveltejs/kit';
import { getProject, nextProject, projects } from '$lib/content/projects';
import type { EntryGenerator, PageLoad } from './$types';

// Only non-draft projects are listed here, so a draft is never prerendered.
export const entries: EntryGenerator = () => projects.map((project) => ({ slug: project.slug }));

export const load: PageLoad = ({ params }) => {
	const project = getProject(params.slug);
	if (project === undefined) error(404, 'Project not found');
	return { project, next: nextProject(params.slug) ?? null };
};
