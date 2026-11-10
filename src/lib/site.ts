/** Canonical origin. The apex domain 308-redirects to www. */
export const SITE_URL = 'https://www.asarelcastellanos.com';
export const SITE_TITLE = 'Asarel Castellanos';
export const SITE_AUTHOR = 'Asarel Castellanos';
/** The first sentence and a half of the home intro. */
export const SITE_DESCRIPTION =
	'Full-stack engineer in Los Angeles. At Arrow I build the crawlers and ingestion pipelines behind an equipment marketplace.';
export const SOURCE_URL = 'https://github.com/asarelcastellanos/asarelcastellanos.com';
export const GITHUB_URL = 'https://github.com/asarelcastellanos';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/asarelcastellanos/';
export const EMAIL = 'asarelc@gmail.com';

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
