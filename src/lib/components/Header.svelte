<script lang="ts">
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
</script>

<header>
	<div class="monogram">ac</div>
	<div class="meta">
		<span>Los Angeles</span>
		<span class="dot">·</span>
		<span class="tabular"><span class="time">{time}</span> PT</span>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 0;
		margin-bottom: 96px;
	}

	.monogram {
		font-family: var(--font-sans);
		font-size: 22px;
		color: var(--fg);
		font-weight: 600;
		letter-spacing: -0.08em;
		line-height: 1;
	}

	.meta {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--fg-muted);
		letter-spacing: 0.02em;
		display: flex;
		gap: 12px;
		white-space: nowrap;
	}

	/* Reserves the width of "00:00" so the header does not shift when the clock fills in. */
	.time {
		display: inline-block;
		min-width: 5ch;
		text-align: right;
	}

	.dot {
		color: var(--ink-3);
	}
</style>
