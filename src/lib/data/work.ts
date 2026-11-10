import { isYearMonth, type YearMonth } from '$lib/content/frontmatter';
import { formatMonth } from '$lib/content/projects';

/** An end date is a month, null for "still going", or "unknown" when the date is not known yet. */
export type EndDate = YearMonth | null | 'unknown';

export type Entry = {
	organization: string;
	/** The role or degree. */
	title: string;
	/** One sentence about the work. */
	summary: string;
	start: YearMonth;
	end: EndDate;
};

/** Builds a YearMonth from a literal and fails loudly on a typo. */
function month(value: string): YearMonth {
	if (!isYearMonth(value)) throw new Error(`Not a YYYY-MM month: ${value}`);
	return value;
}

function formatEnd(end: EndDate): string {
	switch (end) {
		case null:
			return 'now';
		case 'unknown':
			return '[END]';
		default:
			return formatMonth(end);
	}
}

/** "Feb 2026 to now", "Sep 2023 to Dec 2025", or "Jun 2025 to [END]" while the end is unknown. */
export function formatEntryDates(entry: Pick<Entry, 'start' | 'end'>): string {
	return `${formatMonth(entry.start)} to ${formatEnd(entry.end)}`;
}

/** Newest first. */
export const roles: readonly Entry[] = [
	{
		organization: 'Arrow',
		title: 'Full-stack engineer',
		summary:
			'Built the crawlers and ingestion pipelines that bring in 45,000+ used-equipment listings a day from 200+ sources, and cut seller onboarding from days to under an hour.',
		start: month('2026-02'),
		end: null
	},
	{
		organization: 'Cal Poly Orfalea College of Business',
		title: 'Research assistant',
		summary: '[One sentence on the Summer Undergraduate Research Program project]',
		start: month('2025-06'),
		end: 'unknown'
	},
	{
		organization: 'Snap',
		title: 'Software engineering intern',
		summary:
			'Shipped a Vue and Go tool that traces each media upload through its IDs, which cut root-cause investigations from hours to minutes.',
		start: month('2024-06'),
		end: month('2024-09')
	},
	{
		organization: 'Axios',
		title: 'Software engineering intern',
		summary:
			'Moved the newsletter signup flow from Webflow to Next.js with accessible TypeScript components, and added a honeypot that flagged 100+ bots in its first week.',
		start: month('2023-06'),
		end: month('2023-08')
	},
	{
		organization: 'Snap Engineering Academy',
		title: 'Scholar',
		summary: 'Built the React Native starter template that the 2022, 2023, and 2024 cohorts used.',
		start: month('2022-06'),
		end: month('2022-08')
	}
];

export const education: Entry = {
	organization: 'Cal Poly San Luis Obispo',
	title: 'BS Economics, Quantitative Analysis',
	summary:
		'Econometrics, time series forecasting, statistical computing in R, regression analysis, and design of experiments.',
	start: month('2023-09'),
	end: month('2025-12')
};
