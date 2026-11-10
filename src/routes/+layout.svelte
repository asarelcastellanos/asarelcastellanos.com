<script lang="ts">
	import '../app.css';

	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { SITE_AUTHOR } from '$lib/site';

	let { children } = $props();
</script>

<!-- Per-page tags (title, description, canonical, Open Graph, Twitter) come from Seo.svelte. -->
<svelte:head>
	<link rel="icon" href="/monogram.svg" type="image/svg+xml" />
	<meta name="author" content={SITE_AUTHOR} />
</svelte:head>

<a
	href="#main"
	class="button button--primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
>
	Skip to main content
</a>

<div class="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
	<Header />
	<div class="flex-1">
		{@render children()}
	</div>
	<Footer />
</div>
