<script lang="ts">
	import ArrowUpRight from '$lib/icons/ArrowUpRight.svelte';

	type Props = {
		label: string;
		href: string;
		meta: string;
	};

	let { label, href, meta }: Props = $props();
	// Only web links open in a new tab. A mailto: link hands off to the mail app.
	const isWebLink = $derived(/^https?:\/\//i.test(href));
</script>

<a {href} target={isWebLink ? '_blank' : undefined} rel={isWebLink ? 'noreferrer' : undefined}>
	<span class="label">
		{label}
		<span class="underline"></span>
	</span>
	<span class="rule"></span>
	<span class="meta">{meta}</span>
	<ArrowUpRight />
</a>

<style>
	a {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 14px 0;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		color: var(--fg);
		transition: color var(--dur-base) var(--ease-out);
		font-family: var(--font-sans);
	}

	a:hover,
	a:focus-visible {
		color: var(--accent);
	}

	.label {
		font-size: 16px;
		font-weight: 500;
		letter-spacing: -0.005em;
		position: relative;
	}

	.underline {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -3px;
		height: 1px;
		background: currentColor;
		transform-origin: left;
		transform: scaleX(0);
		transition: transform 220ms var(--ease-out);
	}

	a:hover .underline,
	a:focus-visible .underline {
		transform: scaleX(1);
	}

	.rule {
		flex: 1;
		height: 1px;
		background: var(--ink-2);
		position: relative;
		top: -4px;
		opacity: 0.6;
	}

	.meta {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--fg-muted);
		transition: color var(--dur-base) var(--ease-out);
	}

	a:hover .meta,
	a:focus-visible .meta {
		color: var(--accent);
	}
</style>
