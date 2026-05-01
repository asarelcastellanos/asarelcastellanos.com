<script lang="ts">
	let now = $state(new Date());

	$effect(() => {
		const id = setInterval(() => {
			now = new Date();
		}, 30 * 1000);
		return () => clearInterval(id);
	});

	const time = $derived(
		now.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			timeZone: 'America/Los_Angeles',
			hour12: false
		})
	);
</script>

<header>
	<div class="monogram">ac</div>
	<div class="meta">
		<span>Los Angeles</span>
		<span class="dot">·</span>
		<span class="tabular">{time} PT</span>
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

	.dot {
		color: var(--ink-3);
	}
</style>
