<script lang="ts">
	import Bio from '$lib/components/Bio.svelte';
	import Section from '$lib/components/Section.svelte';
	import Work from '$lib/components/Work.svelte';
	import LinkRow from '$lib/components/LinkRow.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/site';
</script>

<Seo title={SITE_TITLE} description={SITE_DESCRIPTION} path="/" />

<main id="main" class="flex flex-col gap-16 pt-16 sm:pt-24">
	<Bio />

	<Section title="Currently">
		<p class="max-w-prose leading-relaxed">
			Building data pipelines and crawlers that pretend to be browsers. Reading more, writing less.
			Tools sharp, dependencies few.
		</p>
	</Section>

	<Section id="experience" title="Work">
		<Work />
	</Section>

	<Section title="Elsewhere">
		<div class="flex max-w-prose flex-col border-b border-separator">
			<LinkRow label="GitHub" meta="asarelcastellanos" href="https://github.com/asarelcastellanos" />
			<LinkRow
				label="LinkedIn"
				meta="in/asarelcastellanos"
				href="https://www.linkedin.com/in/asarelcastellanos/"
			/>
			<LinkRow label="Email" meta="say hi" href="mailto:asarelc@gmail.com" />
		</div>
	</Section>
</main>
