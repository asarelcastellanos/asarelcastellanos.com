<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	type Props = {
		label: string;
		href: string;
		meta: string;
	};

	let { label, href, meta }: Props = $props();
	// Only web links open in a new tab. A mailto: link hands off to the mail app.
	const isWebLink = $derived(/^https?:\/\//i.test(href));
</script>

<a
	{href}
	target={isWebLink ? '_blank' : undefined}
	rel={isWebLink ? 'noreferrer' : undefined}
	class="group flex items-baseline gap-3 border-t border-separator py-3.5"
>
	<span class="font-medium group-hover:text-accent group-focus-visible:text-accent">{label}</span>
	<span class="flex-1"></span>
	<span class="font-mono text-sm text-muted">{meta}</span>
	<Icon name="arrow-up-right" class="self-center text-muted" />
</a>
