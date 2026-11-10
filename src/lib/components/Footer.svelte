<script lang="ts">
	import { SITE_AUTHOR } from '$lib/site';

	const year = new Date().getFullYear();
</script>

<footer>
	<span>© {year} {SITE_AUTHOR}</span>
	<span>Built with SvelteKit.</span>
</footer>

<style>
	footer {
		margin-top: 96px;
		padding-top: 24px;
		border-top: 1px solid var(--border);
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--fg-muted);
		letter-spacing: 0.02em;
	}
</style>
