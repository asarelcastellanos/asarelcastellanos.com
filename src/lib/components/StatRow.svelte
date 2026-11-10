<script lang="ts">
	export type Stat = {
		label: string;
		value: string;
		note: string;
	};

	type Props = {
		/** Names the group for screen readers. */
		label: string;
		stats: Stat[];
	};

	let { label, stats }: Props = $props();
</script>

<!-- The stat row recipe: label, number, note. No icons. data-wide lets it use the full column inside prose. -->
<section aria-label={label} data-wide class="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	{#each stats as stat (stat.label)}
		<div class="card card--default gap-1 rounded-none border border-border shadow-none">
			<span class="font-mono text-[13px] text-muted lowercase">{stat.label}</span>
			<span class="text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</span>
			<span class="text-xs text-muted tabular-nums">{stat.note}</span>
		</div>
	{/each}
</section>
