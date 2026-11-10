<script lang="ts">
	import { page } from '$app/state';
	import { buttonVariants } from '@heroui/styles';
	import { pageTitle } from '$lib/site';

	// A 404 gets the specific message. Anything else gets a general one.
	const notFound = $derived(page.status === 404);
	const heading = $derived(notFound ? 'Page not found' : 'Something went wrong');
	const message = $derived(
		notFound ? 'There is nothing at this address. It may have moved or never existed.' : 'The page failed to load. Try again in a moment.'
	);
</script>

<svelte:head>
	<title>{pageTitle(heading)}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main id="main">
	<div class="frame-block flex flex-col items-center gap-3 py-20 text-center sm:py-28">
		<h1 class="text-base font-semibold lowercase">{heading}</h1>
		<p class="max-w-sm text-sm text-muted">{message}</p>
		<a href="/" class="{buttonVariants({ variant: 'secondary', size: 'sm' })} mt-1 lowercase">Go to the home page</a>
	</div>
</main>
