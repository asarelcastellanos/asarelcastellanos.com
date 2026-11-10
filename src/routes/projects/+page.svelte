<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { pageTitle } from '$lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const description = 'Things I build outside work.';
</script>

<Seo title={pageTitle('Projects')} {description} path="/projects" />

<main id="main" class="flex flex-col gap-8 pt-16 sm:pt-24">
	<div class="flex flex-col gap-1">
		<h1 class="text-2xl font-semibold tracking-tight">Projects</h1>
		<p class="text-sm text-muted">{description}</p>
	</div>

	<ul class="grid gap-6 sm:grid-cols-2">
		{#each data.projects as project (project.slug)}
			<li class="grid">
				<ProjectCard {project} />
			</li>
		{/each}
	</ul>
</main>
