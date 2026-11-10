/** Canonical origin. The apex domain 308-redirects to www. */
export const SITE_URL = 'https://www.asarelcastellanos.com';
export const SITE_TITLE = 'Asarel Castellanos';
export const SITE_AUTHOR = 'Asarel Castellanos';
export const SITE_DESCRIPTION =
	"Full-stack engineer in Los Angeles. I'm equally at home in a React component, a Python script, or a 200-line SQL migration nobody asked for.";

export type OgImage = {
	/** Path under static/, starting with a slash. */
	path: string;
	alt: string;
};

export const DEFAULT_OG_IMAGE = {
	path: '/og.png',
	alt: 'Asarel Castellanos, full-stack engineer in Los Angeles'
} as const satisfies OgImage;

/** The title for a page below the home page, such as "Projects | Asarel Castellanos". */
export function pageTitle(name: string): string {
	return `${name} | ${SITE_TITLE}`;
}

/** Fixed pages listed in sitemap.xml. The sitemap route adds one entry per project. */
export const SITE_PAGES = ['/', '/projects'] as const satisfies readonly string[];
