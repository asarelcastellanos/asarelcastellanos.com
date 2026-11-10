<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import StatusChip from '$lib/components/StatusChip.svelte';
	import { formatTimeline, projectPath } from '$lib/content/projects';
	import { pageTitle } from '$lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const project = $derived(data.project);
	const next = $derived(data.next);

	const image = $derived({
		path: `/og/${project.slug}.png`,
		alt: `${project.title}. ${project.summary}`
	});
	const Body = $derived(project.Body);
</script>

<Seo title={pageTitle(project.title)} description={project.summary} path={projectPath(project.slug)} {image} />

<main id="main" class="flex flex-col">
	<header class="frame-block flex flex-col gap-4 pt-12 pb-12 sm:pt-16">
		<a href="/projects" class="inline-flex min-h-11 items-center gap-1 self-start font-mono text-[13px] text-muted lowercase underline underline-offset-4 hover:text-accent">
			<Icon name="arrow-left" />
			Projects
		</a>
		<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
			<StatusChip status={project.status} />
		</div>
		<p class="max-w-3xl text-lg text-pretty">{project.summary}</p>
	</header>

	<dl class="frame-block grid grid-cols-2 gap-x-8 gap-y-4 py-6 sm:grid-cols-4">
		<div class="flex flex-col gap-1">
			<dt class="font-mono text-[13px] text-muted lowercase">Role</dt>
			<dd>{project.role}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="font-mono text-[13px] text-muted lowercase">Timeline</dt>
			<dd class="tabular-nums">{formatTimeline(project.start, project.end)}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="font-mono text-[13px] text-muted lowercase">Stack</dt>
			<dd>{project.stack.join(', ')}</dd>
		</div>
		{#if project.links.site !== null || project.links.source !== null}
			<div class="flex flex-col gap-1">
				<dt class="font-mono text-[13px] text-muted lowercase">Links</dt>
				<dd class="flex flex-wrap gap-x-4">
					{#if project.links.site !== null}
						<a href={project.links.site} class="link text-accent" target="_blank" rel="noreferrer">Site</a>
					{/if}
					{#if project.links.source !== null}
						<a href={project.links.source} class="link text-accent" target="_blank" rel="noreferrer">Source</a>
					{/if}
				</dd>
			</div>
		{/if}
	</dl>

	{#if project.cover !== null}
		<div class="frame-block py-10">
			<img src={project.cover.src} alt={project.cover.alt} class="aspect-video w-full border border-border object-cover" />
		</div>
	{/if}

	<!-- Direct children of the body are capped at the prose width. The stat row opts out with data-wide. -->
	<article class="typography-prose frame-block flex flex-col gap-4 py-10 [&>:not([data-wide])]:max-w-prose [&_h2]:mt-6 [&_h2]:text-xl">
		<Body />
	</article>

	{#if next !== null}
		<nav aria-label="More projects" class="frame-block flex justify-end py-6">
			<a href={projectPath(next.slug)} class="group flex flex-col items-end gap-1">
				<span class="font-mono text-[13px] text-muted lowercase">Next project</span>
				<span class="text-lg font-semibold group-hover:text-accent group-focus-visible:text-accent">{next.title}</span>
			</a>
		</nav>
	{/if}
</main>
