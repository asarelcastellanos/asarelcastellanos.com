<script lang="ts">
	import '../app.css';

	import { OG_IMAGE, SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '$lib/site';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/monogram.svg" type="image/svg+xml" />
	<link rel="canonical" href={SITE_URL} />
	<meta name="theme-color" content="#0B0B0C" />
	<meta name="author" content={SITE_AUTHOR} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_TITLE} />
	<meta property="og:title" content={SITE_TITLE} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Asarel Castellanos — full-stack engineer in Los Angeles" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={SITE_TITLE} />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={OG_IMAGE} />
</svelte:head>

{@render children()}
