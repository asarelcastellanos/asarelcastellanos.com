<script lang="ts">
	import { buttonVariants } from '@heroui/styles';
	import Icon from '$lib/components/Icon.svelte';
	import { roles } from '$lib/data/work';
</script>

<ul class="flex flex-col">
	{#each roles as r, i (i)}
		<li
			class="grid gap-x-8 gap-y-1 border-t border-separator py-4 last:border-b sm:grid-cols-[1fr_auto] sm:items-baseline"
		>
			<div class="flex flex-col gap-0.5">
				<span class="font-medium">{r.company}</span>
				<span class="text-sm text-muted">{r.role}</span>
			</div>
			<span class="font-mono text-sm whitespace-nowrap text-muted tabular-nums">{r.dates}</span>
		</li>
	{/each}
</ul>

<a
	class="{buttonVariants({ variant: 'primary', size: 'lg' })} self-start"
	href="/asarelcastellanos_resume.pdf"
	download
>
	Download résumé
	<Icon name="arrow-down-to-line" />
</a>
