<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		id?: string;
		children: Snippet;
	};

	let { title, id, children }: Props = $props();
</script>

<section {id} class="frame-block flex scroll-mt-4 flex-col gap-5 pt-14 pb-16 sm:pb-18">
	<h2 class="section-label">{title}</h2>
	{@render children()}
</section>
