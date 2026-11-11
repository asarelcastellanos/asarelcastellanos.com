<script lang="ts">
	import '../app.css';

	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { RESUME_URL, resumeViewer } from '$lib/resume-viewer.svelte';
	import { SITE_AUTHOR } from '$lib/site';
	import type { Component } from 'svelte';

	let { data, children } = $props();

	// The viewer loads on the first click on a resume link, so the home page does not pay for it.
	let Viewer: Component | null = $state.raw(null);

	$effect(() => {
		if (!resumeViewer.isOpen || Viewer) return;
		import('$lib/components/ResumeViewer.svelte').then(
			(module) => {
				Viewer = module.default;
			},
			() => {
				// The chunk failed to load, so hand the click back to the link's own behavior.
				resumeViewer.close();
				location.assign(RESUME_URL);
			}
		);
	});
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

<!-- The outer div leaves a 16px gutter so the dot grid shows beside the column on a phone. The dashed side borders are the frame lines. -->
<div class="px-4">
	<div class="mx-auto flex min-h-screen max-w-6xl flex-col border-x border-dashed border-frame bg-background">
		<Header hasProjects={data.hasProjects} />
		<div class="flex-1">
			{@render children()}
		</div>
		<Footer />
	</div>
</div>

{#if Viewer}
	<Viewer />
{/if}
