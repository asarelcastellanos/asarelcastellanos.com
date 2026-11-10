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

	const navLinkClass =
		'inline-flex min-h-11 items-center font-mono text-[13px] tracking-[0.02em] text-muted lowercase hover:text-foreground';
</script>

<header class="frame-block flex items-center justify-between gap-x-3 py-3">
	<div class="flex items-center gap-x-3 sm:gap-x-8">
		<a
			href="/"
			aria-label="Home"
			class="inline-flex min-h-11 items-center text-2xl leading-none font-bold tracking-[-0.08em]"
		>
			ac
		</a>
		<nav aria-label="Main" class="flex gap-3 sm:gap-7">
			<a
				href="/projects"
				class={navLinkClass}
				aria-current={page.url.pathname.startsWith('/projects') ? 'page' : undefined}>Projects</a
			>
			<a href="/#experience" class={navLinkClass}>Experience</a>
			<a href="/asarelcastellanos_resume.pdf" class={navLinkClass}>Resume</a>
		</nav>
	</div>
	<div class="flex items-center gap-3">
		<!-- Hidden below 640px so the header stays on one row on a phone. -->
		<p class="hidden gap-2 font-mono text-[13px] whitespace-nowrap text-muted tabular-nums lowercase sm:flex">
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
