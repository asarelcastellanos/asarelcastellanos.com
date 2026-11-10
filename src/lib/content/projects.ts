import type { Component } from 'svelte';
import { parseProjectMeta, slugFromPath, type ProjectMeta, type YearMonth } from './frontmatter.ts';

// The only place that reads project files. Drafts are loaded and validated too, then left out below,
// so a broken draft still fails the build. The repo is public, so a draft is not a secret either way.
const sources: Record<string, string> = import.meta.glob('/src/content/projects/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});
const bodies: Record<string, Component> = import.meta.glob('/src/content/projects/*.md', {
	import: 'default',
	eager: true
});

export type { ProjectMeta, ProjectStatus, YearMonth } from './frontmatter.ts';

export type Project = ProjectMeta & {
	slug: string;
	/** The Markdown body, compiled to a Svelte component. */
	Body: Component;
};

/** What a card needs. The body stays out so list pages don't carry it. */
export type ProjectCardData = Pick<Project, 'slug' | 'title' | 'summary' | 'status' | 'stack' | 'cover'>;

function load(): Project[] {
	const loaded: Project[] = [];
	for (const [path, source] of Object.entries(sources)) {
		const meta = parseProjectMeta(source, path);
		const Body = bodies[path];
		if (Body === undefined) throw new Error(`${path}: the file has no compiled body`);
		if (meta.draft) continue;
		loaded.push({ ...meta, slug: slugFromPath(path), Body });
	}
	return loaded.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

/** Every non-draft project, in display order. */
export const projects: readonly Project[] = load();

export function getProject(slug: string): Project | undefined {
	return projects.find((project) => project.slug === slug);
}

/** The project after this one, wrapping to the first. Undefined when there is nothing else to show. */
export function nextProject(slug: string): Project | undefined {
	if (projects.length < 2) return undefined;
	const index = projects.findIndex((project) => project.slug === slug);
	if (index === -1) return undefined;
	return projects[(index + 1) % projects.length];
}

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
