<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	// Empty during prerender so the static HTML carries no build-time clock.
	let time = $state('');

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			timeZone: 'America/Los_Angeles',
			hour12: false
		});
	}

	$effect(() => {
		time = formatTime(new Date());
		const id = setInterval(() => {
			time = formatTime(new Date());
		}, 30 * 1000);
		return () => clearInterval(id);
	});

	const navLinkClass = 'link min-h-11 text-sm text-muted hover:text-foreground';
</script>

<header class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4">
	<div class="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-8">
		<a
			href="/"
			aria-label="Home"
			class="inline-flex min-h-11 items-center rounded-md text-2xl leading-none font-semibold tracking-tighter"
		>
			ac
		</a>
		<nav aria-label="Main" class="flex gap-4 sm:gap-6">
			<a
				href="/projects"
				class={navLinkClass}
				aria-current={page.url.pathname.startsWith('/projects') ? 'page' : undefined}>Projects</a
			>
			<a href="/#experience" class={navLinkClass}>Experience</a>
			<a href="/asarelcastellanos_resume.pdf" class={navLinkClass}>Résumé</a>
		</nav>
	</div>
	<div class="flex items-center gap-3">
		<!-- Hidden below 640px so the header stays on one row on a phone. -->
		<p class="hidden gap-2 font-mono sm:flex text-sm whitespace-nowrap text-muted tabular-nums">
			<span>Los Angeles</span>
			<span aria-hidden="true">·</span>
			<span>
				<!-- Reserves the width of "00:00" so the header does not shift when the clock fills in. -->
				<span class="inline-block min-w-[5ch] text-right">{time}</span> PT
			</span>
		</p>
		<ThemeToggle />
	</div>
</header>
