<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Bio from '$lib/components/Bio.svelte';
	import Section from '$lib/components/Section.svelte';
	import Work from '$lib/components/Work.svelte';
	import LinkRow from '$lib/components/LinkRow.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/site';
</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<main>
	<Header />
	<Bio />

	<Section eyebrow="currently">
		<p class="currently">
			Building data pipelines and crawlers that pretend to be browsers. Reading more, writing less.
			Tools sharp, dependencies few.
		</p>
	</Section>

	<Section eyebrow="work">
		<Work />
	</Section>

	<Section eyebrow="elsewhere">
		<div class="links">
			<LinkRow label="GitHub" meta="asarelcastellanos" href="https://github.com/asarelcastellanos" />
			<LinkRow
				label="LinkedIn"
				meta="in/asarelcastellanos"
				href="https://www.linkedin.com/in/asarelcastellanos/"
			/>
			<LinkRow label="Email" meta="say hi" href="mailto:asarelc@gmail.com" />
		</div>
	</Section>

	<Footer />
</main>

<style>
	main {
		max-width: 640px;
		margin: 0 auto;
		padding: 32px 24px 48px;
		min-height: 100vh;
	}

	.links {
		display: flex;
		flex-direction: column;
	}

	.currently {
		font-family: var(--font-sans);
		font-size: 16px;
		line-height: 1.55;
		color: var(--fg);
		max-width: 560px;
		margin: 0;
	}
</style>
