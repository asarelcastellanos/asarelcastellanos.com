<script lang="ts">
	import { SITE_AUTHOR, SOURCE_URL } from '$lib/site';

	const year = new Date().getFullYear();
</script>

<footer class="flex flex-wrap justify-between gap-2 px-5 pt-6 pb-10 font-mono text-xs text-muted lowercase sm:px-8">
	<span>© {year} {SITE_AUTHOR}</span>
	<a href={SOURCE_URL} target="_blank" rel="noreferrer" class="link-mono hover:text-accent">Source on GitHub</a>
</footer>
