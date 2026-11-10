<script lang="ts">
	import { SITE_AUTHOR, SOURCE_URL } from '$lib/site';

	const year = new Date().getFullYear();
</script>

<footer class="mt-24 flex flex-wrap justify-between gap-2 border-t border-separator pt-6 pb-12 text-sm text-muted">
	<span>© {year} {SITE_AUTHOR}</span>
	<a href={SOURCE_URL} target="_blank" rel="noreferrer" class="hover:text-foreground">Source on GitHub</a>
</footer>
