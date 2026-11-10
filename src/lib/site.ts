/** Canonical origin. The apex domain 308-redirects to www. */
export const SITE_URL = 'https://www.asarelcastellanos.com';
export const SITE_TITLE = 'Asarel Castellanos';
export const SITE_AUTHOR = 'Asarel Castellanos';
export const SITE_DESCRIPTION =
	"Full-stack engineer in Los Angeles. I'm equally at home in a React component, a Python script, or a 200-line SQL migration nobody asked for.";
export const OG_IMAGE = `${SITE_URL}/og.png`;

/** Paths listed in sitemap.xml. Later PRs add project pages here. */
export const SITE_PAGES = ['/'] as const satisfies readonly string[];
