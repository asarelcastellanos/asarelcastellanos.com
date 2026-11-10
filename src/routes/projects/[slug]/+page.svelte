<script lang="ts">
	import { chipVariants } from '@heroui/styles';
	import Icon from '$lib/components/Icon.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { formatTimeline, projectPath } from '$lib/content/projects';
	import { pageTitle } from '$lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const project = $derived(data.project);
	const next = $derived(data.next);

	const chip = chipVariants({ variant: 'secondary', color: 'default', size: 'md' });

	const image = $derived({
		path: `/og/${project.slug}.png`,
		alt: `${project.title}. ${project.summary}`
	});
	const Body = $derived(project.Body);
</script>

<Seo title={pageTitle(project.title)} description={project.summary} path={projectPath(project.slug)} {image} />

<main id="main" class="flex flex-col gap-10 pt-12 sm:pt-16">
	<header class="flex max-w-3xl flex-col gap-4">
		<a href="/projects" class="link self-start text-sm text-muted hover:text-foreground">
			<Icon name="arrow-left" class="mr-1" />
			Projects
		</a>
		<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
			<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
			<span class={chip.base()}><span class={chip.label()}>{project.status}</span></span>
		</div>
		<p class="text-lg text-pretty">{project.summary}</p>
	</header>

	<dl class="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-separator py-5 sm:grid-cols-4">
		<div class="flex flex-col gap-1">
			<dt class="text-sm text-muted">Role</dt>
			<dd>{project.role}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-sm text-muted">Timeline</dt>
			<dd class="tabular-nums">{formatTimeline(project.start, project.end)}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-sm text-muted">Stack</dt>
			<dd>{project.stack.join(', ')}</dd>
		</div>
		{#if project.links.site !== null || project.links.source !== null}
			<div class="flex flex-col gap-1">
				<dt class="text-sm text-muted">Links</dt>
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
		<img
			src={project.cover.src}
			alt={project.cover.alt}
			class="aspect-video w-full rounded-3xl object-cover"
		/>
	{/if}

	<!-- Direct children of the body are capped at the prose width. The stat row opts out with data-wide. -->
	<article class="typography-prose flex flex-col gap-4 [&>:not([data-wide])]:max-w-prose [&_h2]:mt-6 [&_h2]:text-xl">
		<Body />
	</article>

	{#if next !== null}
		<nav aria-label="More projects" class="flex justify-end border-t border-separator py-6">
			<a href={projectPath(next.slug)} class="group flex flex-col items-end gap-1">
				<span class="text-sm text-muted">Next project</span>
				<span class="text-lg font-semibold group-hover:text-accent group-focus-visible:text-accent">{next.title}</span>
			</a>
		</nav>
	{/if}
</main>
