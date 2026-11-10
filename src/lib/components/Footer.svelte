<script lang="ts">
	import { SITE_AUTHOR } from '$lib/site';

	const year = new Date().getFullYear();
</script>

<footer class="mt-24 flex flex-wrap justify-between gap-2 border-t border-separator pt-6 pb-12 text-sm text-muted">
	<span>© {year} {SITE_AUTHOR}</span>
	<span>Built with SvelteKit.</span>
</footer>
