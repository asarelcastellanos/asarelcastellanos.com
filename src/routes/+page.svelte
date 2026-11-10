<script lang="ts">
	import { buttonVariants } from '@heroui/styles';
	import EntryRow from '$lib/components/EntryRow.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import LinkRow from '$lib/components/LinkRow.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Section from '$lib/components/Section.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { education, formatEntryDates, roles } from '$lib/data/work';
	import {
		EMAIL,
		GITHUB_URL,
		LINKEDIN_URL,
		SITE_AUTHOR,
		SITE_DESCRIPTION,
		SITE_TITLE,
		SITE_URL
	} from '$lib/site';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const personJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: SITE_AUTHOR,
		url: SITE_URL,
		jobTitle: 'Full-stack engineer',
		worksFor: { '@type': 'Organization', name: 'Arrow' },
		alumniOf: { '@type': 'CollegeOrUniversity', name: 'Cal Poly San Luis Obispo' },
		sameAs: [GITHUB_URL, LINKEDIN_URL],
		address: { '@type': 'PostalAddress', addressLocality: 'Los Angeles' }
	};

	// Escape "<" so no string in the data can close the script tag.
	const personScript = JSON.stringify(personJsonLd).replaceAll('<', '\\u003c');
</script>

<Seo title={SITE_TITLE} description={SITE_DESCRIPTION} path="/" />

<svelte:head>
	{@html `<script type="application/ld+json">${personScript}</script>`}
</svelte:head>

<main id="main" class="flex flex-col gap-16 pt-16 sm:pt-24 md:gap-24">
	<section class="flex max-w-2xl flex-col gap-5 sm:gap-6">
		<h1 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{SITE_AUTHOR}</h1>
		<p class="text-lg leading-relaxed text-pretty">
			Full-stack engineer in Los Angeles. At Arrow I build the crawlers and ingestion pipelines
			behind an equipment marketplace: 45,000 listings a day from more than 200 sources, matched
			against a catalog of 41,000 models. Outside work I build things like
			<a class="link text-accent" href="/projects/howlate-la">howlate.la</a>, which records every LA
			Metro bus and train and grades each one against the timetable.
		</p>
		<p class="text-muted">
			Open to new full-stack and data roles, in Los Angeles or anywhere I'd relocate for.
		</p>
		<div class="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
			<a
				class={buttonVariants({ variant: 'primary', size: 'lg' })}
				href="/asarelcastellanos_resume.pdf"
				download
			>
				<Icon name="arrow-down-to-line" />
				Download résumé
			</a>
			<a class="inline-flex min-h-11 items-center text-muted hover:text-foreground" href="mailto:{EMAIL}">
				{EMAIL}
			</a>
		</div>
	</section>

	<section id="projects" class="flex scroll-mt-4 flex-col gap-6">
		<div class="flex items-baseline justify-between gap-4">
			<h2 class="text-base font-semibold">Selected projects</h2>
			<a class="link text-sm text-muted hover:text-foreground" href="/projects">All projects</a>
		</div>
		<!-- auto-fit with a 300px minimum keeps a lone card from filling the row; the cap sets its width. -->
		<ul class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
			{#each data.projects as project (project.slug)}
				<li class="grid max-w-md">
					<ProjectCard {project} />
				</li>
			{/each}
		</ul>
	</section>

	<Section id="experience" title="Experience">
		<ul class="flex flex-col">
			{#each roles as role (role.organization)}
				<EntryRow
					organization={role.organization}
					title={role.title}
					summary={role.summary}
					dates={formatEntryDates(role)}
				/>
			{/each}
		</ul>
		<a
			class="{buttonVariants({ variant: 'outline', size: 'md' })} mt-2 self-start"
			href="/asarelcastellanos_resume.pdf"
			download
		>
			<Icon name="arrow-down-to-line" />
			Full résumé (PDF)
		</a>
	</Section>

	<Section title="Education">
		<ul class="flex flex-col">
			<EntryRow
				organization={education.organization}
				title={education.title}
				summary={education.summary}
				dates={formatEntryDates(education)}
				mutedSummary
			/>
		</ul>
	</Section>

	<Section title="Elsewhere">
		<div class="flex max-w-prose flex-col border-b border-separator">
			<LinkRow label="GitHub" meta="asarelcastellanos" href={GITHUB_URL} />
			<LinkRow label="LinkedIn" meta="in/asarelcastellanos" href={LINKEDIN_URL} />
			<LinkRow label="Email" meta={EMAIL} href="mailto:{EMAIL}" />
		</div>
	</Section>
</main>
