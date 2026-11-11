<script module lang="ts">
	export type ViewerStatus = 'loading' | 'ready' | 'error';

	/** Zoom is a multiplier on the fit-to-width scale, so 1 always means fit to width. */
	export const MIN_ZOOM = 0.5;
	export const MAX_ZOOM = 3;
	export const ZOOM_STEP = 1.25;

	// A page wider than this on a large monitor is harder to read, not easier.
	const MAX_FIT_WIDTH = 1000;
	// Safari refuses canvases larger than about 16.7 million pixels, so the output scale drops to stay under it.
	const MAX_CANVAS_PIXELS = 16_000_000;
	const RERENDER_DELAY_MS = 150;
</script>

<script lang="ts">
	import { buttonVariants } from '@heroui/styles';
	import { flushSync, onMount, untrack } from 'svelte';
	import type { PDFPageProxy, RenderTask } from 'pdfjs-dist';
	import Icon from '$lib/components/Icon.svelte';
	import { RESUME_URL } from '$lib/resume-viewer.svelte';

	type Props = {
		zoom: number;
		page: number;
		pageCount: number;
		status: ViewerStatus;
	};

	let {
		zoom = $bindable(1),
		page = $bindable(1),
		pageCount = $bindable(0),
		status = $bindable('loading')
	}: Props = $props();

	let scroller: HTMLDivElement | undefined;
	let holders: HTMLDivElement[] = $state([]);
	let pageSizes: { width: number; height: number }[] = $state([]);
	let containerWidth = $state(0);

	let pdfPages: PDFPageProxy[] = [];
	const visible = new Set<number>();
	const renders = new Map<number, { task: RenderTask; key: string }>();
	let renderTimer: ReturnType<typeof setTimeout> | undefined;
	let scrollFrame = 0;

	const gutter = $derived(containerWidth < 640 ? 12 : 24);
	const widest = $derived(Math.max(1, ...pageSizes.map((size) => size.width)));
	const fitScale = $derived(
		containerWidth > 0 ? Math.max(0.05, Math.min(containerWidth - 2 * gutter, MAX_FIT_WIDTH) / widest) : 1
	);
	const scale = $derived(fitScale * zoom);

	function prefersReducedMotion(): boolean {
		return matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function isCancellation(error: unknown): boolean {
		return error instanceof Error && error.name === 'RenderingCancelledException';
	}

	function release(index: number): void {
		renders.get(index)?.task.cancel();
		renders.delete(index);
		const holder = holders[index];
		if (!holder) return;
		for (const canvas of holder.querySelectorAll('canvas')) canvas.width = canvas.height = 0;
		holder.replaceChildren();
	}

	async function renderPage(index: number): Promise<void> {
		const pdfPage = pdfPages[index];
		const holder = holders[index];
		if (!pdfPage || !holder) return;

		const viewport = pdfPage.getViewport({ scale });
		const output = Math.min(
			window.devicePixelRatio || 1,
			Math.sqrt(MAX_CANVAS_PIXELS / (viewport.width * viewport.height))
		);
		const key = `${scale.toFixed(4)}@${output.toFixed(3)}`;
		const current = renders.get(index);
		if (current?.key === key) return;
		current?.task.cancel();

		// Draw into a fresh canvas and swap it in when done, so the old one stays visible until then.
		const canvas = document.createElement('canvas');
		canvas.width = Math.floor(viewport.width * output);
		canvas.height = Math.floor(viewport.height * output);
		canvas.className = 'block size-full';

		const task = pdfPage.render({
			canvas,
			viewport,
			transform: output === 1 ? undefined : [output, 0, 0, output, 0, 0]
		});
		renders.set(index, { task, key });

		try {
			await task.promise;
		} catch (error) {
			if (isCancellation(error)) return;
			console.error(error);
			status = 'error';
			return;
		}
		if (renders.get(index)?.task !== task) return;
		holders[index]?.replaceChildren(canvas);
	}

	function renderVisible(): void {
		for (const index of visible) void renderPage(index);
	}

	function scheduleRender(delay: number): void {
		clearTimeout(renderTimer);
		renderTimer = setTimeout(renderVisible, delay);
	}

	function updatePage(): void {
		if (!scroller || holders.length === 0) return;
		const probe = scroller.scrollTop + scroller.clientHeight * 0.35;
		let current = 1;
		holders.forEach((holder, index) => {
			if (holder.offsetTop <= probe) current = index + 1;
		});
		const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
		page = atBottom && scroller.scrollTop > 0 ? holders.length : current;
	}

	function onScroll(): void {
		if (scrollFrame) return;
		scrollFrame = requestAnimationFrame(() => {
			scrollFrame = 0;
			updatePage();
		});
	}

	function setZoom(requested: number, focal?: { x: number; y: number }): void {
		if (!scroller || status !== 'ready') return;
		let next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, requested));
		if (Math.abs(next - 1) < 0.02) next = 1;
		if (next === zoom) return;

		// Keep the point under the focal position (the viewport center by default) where it is.
		const ratio = next / zoom;
		const x = focal?.x ?? scroller.clientWidth / 2;
		const y = focal?.y ?? scroller.clientHeight / 2;
		const left = (scroller.scrollLeft + x) * ratio - x;
		const top = (scroller.scrollTop + y) * ratio - y;

		zoom = next;
		flushSync();
		scroller.scrollLeft = left;
		scroller.scrollTop = top;
	}

	export function zoomBy(factor: number): void {
		setZoom(zoom * factor);
	}

	export function fitWidth(): void {
		setZoom(1);
	}

	export function goTo(target: number): void {
		const holder = holders[target - 1];
		if (!holder || !scroller) return;
		scroller.scrollTo({ top: Math.max(0, holder.offsetTop - gutter), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
	}

	export function focus(): void {
		scroller?.focus({ preventScroll: true });
	}

	/** Scrolls for a navigation key pressed while focus is on a toolbar button. Returns true if it handled the key. */
	export function scrollForKey(event: KeyboardEvent): boolean {
		if (!scroller || status !== 'ready' || event.target === scroller) return false;
		const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
		const pageStep = scroller.clientHeight * 0.9;
		switch (event.key) {
			case 'ArrowDown':
				scroller.scrollBy({ top: 48, behavior });
				return true;
			case 'ArrowUp':
				scroller.scrollBy({ top: -48, behavior });
				return true;
			case 'PageDown':
				scroller.scrollBy({ top: pageStep, behavior });
				return true;
			case 'PageUp':
				scroller.scrollBy({ top: -pageStep, behavior });
				return true;
			case 'Home':
				scroller.scrollTo({ top: 0, behavior });
				return true;
			case 'End':
				scroller.scrollTo({ top: scroller.scrollHeight, behavior });
				return true;
			default:
				return false;
		}
	}

	onMount(() => {
		const element = scroller;
		if (!element) return;
		let cancelled = false;
		let loadingTask: { destroy(): Promise<void> } | undefined;

		const resizeObserver = new ResizeObserver(([entry]) => {
			if (entry) containerWidth = entry.contentRect.width;
		});
		resizeObserver.observe(element);

		// Trackpad pinch arrives as a wheel event with ctrlKey set.
		const onWheel = (event: WheelEvent): void => {
			if (!event.ctrlKey || status !== 'ready') return;
			event.preventDefault();
			const rect = element.getBoundingClientRect();
			setZoom(zoom * Math.exp(-event.deltaY * 0.01), { x: event.clientX - rect.left, y: event.clientY - rect.top });
		};

		let pinch: { distance: number; zoom: number } | null = null;

		function touchDistance(touches: TouchList): number {
			const [a, b] = [touches[0], touches[1]];
			return a && b ? Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) : 0;
		}

		function onTouchStart(event: TouchEvent): void {
			const distance = event.touches.length === 2 ? touchDistance(event.touches) : 0;
			pinch = distance > 0 ? { distance, zoom } : null;
		}

		const onTouchMove = (event: TouchEvent): void => {
			const [a, b] = [event.touches[0], event.touches[1]];
			if (!pinch || !a || !b || status !== 'ready') return;
			event.preventDefault();
			const rect = element.getBoundingClientRect();
			setZoom(pinch.zoom * (touchDistance(event.touches) / pinch.distance), {
				x: (a.clientX + b.clientX) / 2 - rect.left,
				y: (a.clientY + b.clientY) / 2 - rect.top
			});
		};

		function onTouchEnd(event: TouchEvent): void {
			if (event.touches.length < 2) pinch = null;
		}

		element.addEventListener('wheel', onWheel, { passive: false });
		element.addEventListener('touchstart', onTouchStart, { passive: true });
		element.addEventListener('touchmove', onTouchMove, { passive: false });
		element.addEventListener('touchend', onTouchEnd);
		element.addEventListener('touchcancel', onTouchEnd);

		// pdf.js and its worker load here, not at page load, so the home page pays nothing for them.
		(async () => {
			try {
				const [pdfjs, worker] = await Promise.all([
					import('pdfjs-dist'),
					import('pdfjs-dist/build/pdf.worker.min.mjs?url')
				]);
				if (cancelled) return;
				pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
				const task = pdfjs.getDocument({ url: RESUME_URL, useWasm: false });
				loadingTask = task;
				const doc = await task.promise;
				const loaded = await Promise.all(Array.from({ length: doc.numPages }, (_, index) => doc.getPage(index + 1)));
				if (cancelled) return;
				pdfPages = loaded;
				pageSizes = loaded.map((pdfPage) => {
					const { width, height } = pdfPage.getViewport({ scale: 1 });
					return { width, height };
				});
				pageCount = loaded.length;
				page = 1;
				status = 'ready';
			} catch (error) {
				if (cancelled) return;
				console.error(error);
				status = 'error';
			}
		})();

		return () => {
			cancelled = true;
			clearTimeout(renderTimer);
			cancelAnimationFrame(scrollFrame);
			for (const { task } of renders.values()) task.cancel();
			renders.clear();
			visible.clear();
			resizeObserver.disconnect();
			element.removeEventListener('wheel', onWheel);
			element.removeEventListener('touchstart', onTouchStart);
			element.removeEventListener('touchmove', onTouchMove);
			element.removeEventListener('touchend', onTouchEnd);
			element.removeEventListener('touchcancel', onTouchEnd);
			void loadingTask?.destroy();
		};
	});

	// Render pages near the viewport and free the ones far from it, so a long document stays light.
	$effect(() => {
		if (status !== 'ready' || !scroller) return;
		const targets = [...holders];
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const index = Number((entry.target as HTMLElement).dataset.index);
					if (entry.isIntersecting) {
						visible.add(index);
					} else {
						visible.delete(index);
						release(index);
					}
				}
				scheduleRender(0);
			},
			{ root: scroller, rootMargin: '100% 0px' }
		);
		for (const target of targets) observer.observe(target);
		return () => observer.disconnect();
	});

	// A new scale (zoom or window resize) restretches the old canvases at once and re-renders after a pause.
	$effect(() => {
		void scale;
		if (status !== 'ready') return;
		scheduleRender(RERENDER_DELAY_MS);
		untrack(updatePage);
	});
</script>

<!-- A scroll area needs focus so the arrow, Page Up, and Page Down keys scroll it. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={scroller}
	tabindex="0"
	role="region"
	aria-label="Resume pages"
	class="relative min-h-0 flex-1 touch-pan-x touch-pan-y overflow-auto overscroll-contain bg-surface-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
	onscroll={onScroll}
>
	{#if status === 'ready'}
		<div class="flex w-max min-w-full flex-col" style:padding="{gutter}px" style:gap="{gutter}px">
			{#each pageSizes as size, index (index)}
				<div
					bind:this={holders[index]}
					data-index={index}
					role="img"
					aria-label="Resume, page {index + 1} of {pageSizes.length}"
					class="mx-auto shrink-0 bg-white shadow-[0_0_0_1px_var(--separator)]"
					style:width="{size.width * scale}px"
					style:height="{size.height * scale}px"
				></div>
			{/each}
		</div>
	{:else if status === 'error'}
		<div class="grid h-full place-content-center justify-items-center gap-4 p-6 text-center">
			<p>The resume could not be shown here.</p>
			<a class={buttonVariants({ variant: 'primary', size: 'lg' })} href={RESUME_URL} download>
				<Icon name="arrow-down-to-line" />
				Download resume (PDF)
			</a>
		</div>
	{:else}
		<p class="section-label p-6" role="status">Loading resume</p>
	{/if}
</div>
