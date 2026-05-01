<script lang="ts">
	import { roles } from '$lib/data/work';
	import ArrowDownToLine from '$lib/icons/ArrowDownToLine.svelte';
</script>

<div class="list">
	{#each roles as r, i (i)}
		<div class="row" class:no-border={i === roles.length - 1}>
			<div class="left">
				<span class="company">{r.company}</span>
				<span class="role">{r.role}</span>
			</div>
			<span class="dates tabular">{r.dates}</span>
		</div>
	{/each}
</div>

<a class="resume" href="/asarelcastellanos_resume.pdf" download>
	<span>Download résumé</span>
	<ArrowDownToLine />
</a>

<style>
	.list {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr auto;
		column-gap: 16px;
		padding: 12px 0;
		border-bottom: 1px solid var(--border);
		align-items: baseline;
		font-family: var(--font-sans);
	}

	.row.no-border {
		border-bottom: none;
	}

	.left {
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex-wrap: wrap;
	}

	.company {
		font-size: 16px;
		font-weight: 600;
		color: var(--fg);
		letter-spacing: -0.005em;
	}

	.role {
		font-size: 14px;
		color: var(--fg-muted);
		letter-spacing: -0.005em;
	}

	.dates {
		font-size: 13px;
		color: var(--fg-muted);
		white-space: nowrap;
	}

	.resume {
		margin-top: 24px;
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border: 1px solid var(--border);
		border-radius: 2px;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 500;
		color: var(--fg);
		text-decoration: none;
		letter-spacing: -0.005em;
		background: transparent;
		transition:
			background var(--dur-base) var(--ease-out),
			color var(--dur-base) var(--ease-out),
			border-color var(--dur-base) var(--ease-out);
		width: fit-content;
	}

	.resume:hover {
		background: var(--ink-1);
		color: var(--accent);
		border-color: var(--accent);
	}

	.resume:active {
		opacity: 0.7;
		transition: opacity var(--dur-fast) var(--ease-out);
	}
</style>
