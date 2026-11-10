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
		jobTitle: 'Data analyst and engineer',
		alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Cal Poly San Luis Obispo' }],
		knowsLanguage: ['English', 'Spanish'],
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

<main id="main" class="flex flex-col">
	<section class="frame-block flex flex-col gap-6 pt-16 pb-16 sm:pt-24 sm:pb-24">
		<h1 class="max-w-3xl text-5xl leading-[0.98] font-extrabold tracking-[-0.045em] text-balance lowercase sm:text-6xl lg:text-7xl">{SITE_AUTHOR}</h1>
		<p class="max-w-2xl text-lg leading-relaxed text-pretty">
			Data analyst and engineer in Los Angeles, with an economics degree and a software background.
			Most recently, at Arrow, I designed the catalog data model for an equipment marketplace with
			41,000+ models and used an LLM to cut seller onboarding from days to under an hour.
		</p>
		<p class="flex max-w-2xl items-start gap-2.5 text-muted">
			<span aria-hidden="true" class="mt-[0.55em] size-2 shrink-0 bg-mint"></span>
			<span>Open to data analyst, BI, and analytics engineering roles in Los Angeles, remote, or anywhere I'd relocate for. Bilingual in English and Spanish.</span>
		</p>
		<div class="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
			<a
				class="{buttonVariants({ variant: 'primary', size: 'lg' })} lowercase"
				href="/asarelcastellanos_resume.pdf"
				download
			>
				<Icon name="arrow-down-to-line" />
				Download resume
			</a>
			<a class="link-mono inline-flex min-h-11 items-center text-sm" href="mailto:{EMAIL}">
				{EMAIL}
			</a>
		</div>
	</section>

	{#if data.projects.length > 0}
		<section id="projects" class="frame-block flex scroll-mt-4 flex-col gap-6 pt-14 pb-16 sm:pb-18">
			<div class="flex items-baseline justify-between gap-4">
				<h2 class="section-label">Selected projects</h2>
				<a class="link-mono text-[13px] text-muted" href="/projects">All projects</a>
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
	{/if}

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
		<a class="link-mono mt-1 inline-flex min-h-11 items-center self-start text-[13px]" href="/asarelcastellanos_resume.pdf" download>
			Full resume (PDF)
		</a>
	</Section>

	<Section title="Education">
		<ul class="flex flex-col">
			{#each education as school (school.organization)}
				<EntryRow
					organization={school.organization}
					title={school.title}
					summary={school.summary}
					dates={formatEntryDates(school)}
					mutedSummary
				/>
			{/each}
		</ul>
	</Section>

	<Section title="Elsewhere">
		<div class="flex max-w-prose flex-col border-b border-dashed border-frame">
			<LinkRow label="GitHub" meta="asarelcastellanos" href={GITHUB_URL} />
			<LinkRow label="LinkedIn" meta="in/asarelcastellanos" href={LINKEDIN_URL} />
			<LinkRow label="Email" meta={EMAIL} href="mailto:{EMAIL}" />
		</div>
	</Section>
</main>
