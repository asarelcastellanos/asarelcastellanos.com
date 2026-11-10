<script lang="ts">
	import { DEFAULT_OG_IMAGE, SITE_TITLE, SITE_URL, type OgImage } from '$lib/site';

	type Props = {
		/** The full page title, as shown in the browser tab. */
		title: string;
		description: string;
		/** The path of this page, such as "/projects". It becomes the canonical URL. */
		path: string;
		image?: OgImage;
	};

	let { title, description, path, image = DEFAULT_OG_IMAGE }: Props = $props();

	const url = $derived(`${SITE_URL}${path}`);
	const imageUrl = $derived(`${SITE_URL}${image.path}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_TITLE} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={image.alt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={image.alt} />
</svelte:head>
