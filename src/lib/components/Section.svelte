<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		eyebrow: string;
		title?: string;
		children: Snippet;
	};

	let { eyebrow, title, children }: Props = $props();
</script>

<section>
	<div class="eyebrow">— {eyebrow}</div>
	{#if title}
		<h2>{title}</h2>
	{/if}
	{@render children()}
</section>

<style>
	section {
		margin-bottom: 64px;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--fg-muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 16px;
	}

	h2 {
		font-family: var(--font-sans);
		font-size: 22px;
		font-weight: 500;
		letter-spacing: -0.005em;
		margin: 0 0 16px;
		color: var(--fg);
	}
</style>
