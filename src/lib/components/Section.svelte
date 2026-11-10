<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		id?: string;
		children: Snippet;
	};

	let { title, id, children }: Props = $props();
</script>

<section {id} class="flex scroll-mt-4 flex-col gap-4">
	<h2 class="text-base font-semibold">{title}</h2>
	{@render children()}
</section>
