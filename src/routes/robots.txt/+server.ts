import { SITE_URL } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
