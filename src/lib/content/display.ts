import type { ProjectMeta, YearMonth } from './frontmatter.ts';

// Helpers that components run in the browser. This module imports no project files, so using it does
// not pull every compiled write-up into the page's JavaScript.

/** What a card needs. The body stays out so list pages don't carry it. */
export type ProjectCardData = Pick<ProjectMeta, 'title' | 'summary' | 'status' | 'stack' | 'cover'> & {
	slug: string;
};

export function projectPath(slug: string): string {
	return `/projects/${slug}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export function formatMonth(value: YearMonth): string {
	const year = value.slice(0, 4);
	const month = MONTHS[Number(value.slice(5, 7)) - 1];
	return `${month} ${year}`;
}

/** "Aug 2026 to now" for an ongoing project, "Sep 2023 to Dec 2025" for a finished one. */
export function formatTimeline(start: YearMonth, end: YearMonth | null): string {
	return `${formatMonth(start)} to ${end === null ? 'now' : formatMonth(end)}`;
}
