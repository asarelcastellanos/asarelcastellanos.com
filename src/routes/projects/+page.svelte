<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { pageTitle } from '$lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const description = 'Things I build outside work.';
</script>

<Seo title={pageTitle('Projects')} {description} path="/projects" />

<main id="main" class="flex flex-col">
	<div class="frame-block flex flex-col gap-1 pt-16 pb-12 sm:pt-24">
		<h1 class="text-2xl font-semibold tracking-tight lowercase">Projects</h1>
		<p class="text-sm text-muted">{description}</p>
	</div>

	<ul class="frame-block grid gap-6 pt-12 pb-16 sm:grid-cols-2">
		{#each data.projects as project (project.slug)}
			<li class="grid">
				<ProjectCard {project} />
			</li>
		{/each}
	</ul>
</main>
