<script lang="ts">
	import StatusChip from '$lib/components/StatusChip.svelte';
	import { projectPath, type ProjectCardData } from '$lib/content/display';

	type Props = {
		project: ProjectCardData;
	};

	let { project }: Props = $props();
</script>

<!-- The whole card is one link. Hover and focus change the title color only. -->
<a
	href={projectPath(project.slug)}
	class="card card--default group gap-0 rounded-none border border-border p-0 no-underline shadow-none"
>
	{#if project.cover !== null}
		<img
			src={project.cover.src}
			alt={project.cover.alt}
			loading="lazy"
			class="aspect-video w-full border-b border-border object-cover"
		/>
	{/if}
	<div class="flex flex-col gap-2.5 p-5">
		<div class="flex items-center justify-between gap-3">
			<h2 class="text-xl font-semibold tracking-tight group-hover:text-accent group-focus-visible:text-accent">
				{project.title}
			</h2>
			<StatusChip status={project.status} />
		</div>
		<p class="text-[15px] leading-relaxed text-muted">{project.summary}</p>
		<p class="font-mono text-xs text-muted">{project.stack.join(' · ')}</p>
	</div>
</a>
