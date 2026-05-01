<script lang="ts">
	let dot: HTMLDivElement | null = $state(null);
	let coarse = $state(true);

	$effect(() => {
		const mq = window.matchMedia('(pointer: fine)');
		coarse = !mq.matches;
		const onChange = () => (coarse = !mq.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	$effect(() => {
		if (coarse) return;

		const target = { x: -100, y: -100 };
		const pos = { x: -100, y: -100 };

		const onMove = (e: MouseEvent) => {
			target.x = e.clientX;
			target.y = e.clientY;
		};
		window.addEventListener('mousemove', onMove);

		let raf = 0;
		const tick = () => {
			pos.x += (target.x - pos.x) * 0.18;
			pos.y += (target.y - pos.y) * 0.18;
			if (dot) {
				dot.style.transform = `translate(${pos.x - 3}px, ${pos.y - 3}px)`;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('mousemove', onMove);
		};
	});
</script>

{#if !coarse}
	<div bind:this={dot} class="dot" aria-hidden="true"></div>
{/if}

<style>
	.dot {
		position: fixed;
		top: 0;
		left: 0;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		pointer-events: none;
		z-index: 50;
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
			display: none;
		}
	}
</style>
