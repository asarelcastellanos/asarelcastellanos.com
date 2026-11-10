import { projectPath } from '$lib/content/display';
import { projects } from '$lib/content/projects';
import { SITE_PAGES, SITE_URL } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const projectPaths = projects.length > 0 ? ['/projects', ...projects.map((project) => projectPath(project.slug))] : [];
	const paths = [...SITE_PAGES, ...projectPaths];
	const urls = paths.map((path) => `\t<url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
};
