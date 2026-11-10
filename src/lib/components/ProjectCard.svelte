<script lang="ts">
	import { chipVariants } from '@heroui/styles';
	import { projectPath, type ProjectCardData } from '$lib/content/projects';

	type Props = {
		project: ProjectCardData;
	};

	let { project }: Props = $props();

	const chip = chipVariants({ variant: 'secondary', color: 'default', size: 'sm' });
</script>

<!-- The whole card is one link. Hover and focus change the title color only. -->
<a
	href={projectPath(project.slug)}
	class="card card--default group gap-4 no-underline"
>
	{#if project.cover !== null}
		<img
			src={project.cover.src}
			alt={project.cover.alt}
			loading="lazy"
			class="aspect-video w-full rounded-2xl object-cover"
		/>
	{/if}
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between gap-3">
			<h2 class="text-lg font-semibold tracking-tight group-hover:text-accent group-focus-visible:text-accent">
				{project.title}
			</h2>
			<span class={chip.base()}><span class={chip.label()}>{project.status}</span></span>
		</div>
		<p class="text-sm text-muted">{project.summary}</p>
		<p class="font-mono text-xs text-muted">{project.stack.join(' · ')}</p>
	</div>
</a>
