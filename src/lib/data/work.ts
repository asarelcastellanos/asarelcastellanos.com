import { isYearMonth, type YearMonth } from '$lib/content/frontmatter';
import { formatMonth } from '$lib/content/display';

/** An end date is a month, or null for "still going". */
export type EndDate = YearMonth | null;

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
		default:
			return formatMonth(end);
	}
}

/** "Feb 2026 to now" or "Sep 2023 to Dec 2025". */
export function formatEntryDates(entry: Pick<Entry, 'start' | 'end'>): string {
	return `${formatMonth(entry.start)} to ${formatEnd(entry.end)}`;
}

/** Newest first. Source: the owner's LinkedIn profile, November 2026. */
export const roles: readonly Entry[] = [
	{
		organization: 'Arrow',
		title: 'Data engineer and analyst',
		summary:
			'Designed the catalog data model for 41,000+ equipment models, matched seller listings to it with an LLM at 92% accuracy, and built a crawler that collects 45,000+ listings a day from 200+ sites.',
		start: month('2026-02'),
		end: month('2026-05')
	},
	{
		organization: 'Cal Poly Orfalea College of Business',
		title: 'Research assistant',
		summary:
			'Studied how tariffs reach local industries with Dr. Hamed Ghoddusi, built the R pipelines and event study behind the analysis, and presented the findings to Paso Robles winery owners.',
		start: month('2025-06'),
		end: month('2025-08')
	},
	{
		organization: 'Snap',
		title: 'Software engineering intern',
		summary:
			'Wrote BigQuery SQL to find where media quality dropped in the Stories and Spotlight pipeline, and shipped a Vue and Go tool that cut time spent on tracing tickets by 80%.',
		start: month('2024-06'),
		end: month('2024-09')
	},
	{
		organization: 'Axios',
		title: 'Software engineering intern',
		summary:
			'Moved the newsletter signup flow from Webflow to Next.js with accessible TypeScript components, and added a honeypot that flagged 3,000+ bots in its first week.',
		start: month('2023-06'),
		end: month('2023-08')
	},
	{
		organization: 'Snap Engineering Academy',
		title: 'Scholar',
		summary:
			'Built the React Native starter template that the 2022, 2023, and 2024 cohorts used, saving instructors about a week of setup each time.',
		start: month('2022-06'),
		end: month('2022-08')
	}
];

/** Newest first. */
export const education: readonly Entry[] = [
	{
		organization: 'Cal Poly San Luis Obispo',
		title: 'BS Economics, Quantitative Analysis',
		summary:
			'Econometrics, time series forecasting, statistical computing in R, regression analysis, and design of experiments.',
		start: month('2023-06'),
		end: month('2025-12')
	},
	{
		organization: 'Santa Monica College',
		title: 'AS Computer Science, AA-T Economics',
		summary: 'Tutored 13 computer science courses in five languages before transferring to Cal Poly.',
		start: month('2021-06'),
		end: month('2023-06')
	}
];
