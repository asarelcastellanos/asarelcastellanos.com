<script lang="ts">
	import { buttonVariants } from '@heroui/styles';
	import arrowDownToLine from '@gravity-ui/icons/svgs/arrow-down-to-line.svg?raw';
	import arrowsExpandHorizontal from '@gravity-ui/icons/svgs/arrows-expand-horizontal.svg?raw';
	import chevronDown from '@gravity-ui/icons/svgs/chevron-down.svg?raw';
	import chevronUp from '@gravity-ui/icons/svgs/chevron-up.svg?raw';
	import chevronsCollapseUpRight from '@gravity-ui/icons/svgs/chevrons-collapse-up-right.svg?raw';
	import chevronsExpandUpRight from '@gravity-ui/icons/svgs/chevrons-expand-up-right.svg?raw';
	import minus from '@gravity-ui/icons/svgs/minus.svg?raw';
	import plus from '@gravity-ui/icons/svgs/plus.svg?raw';
	import printer from '@gravity-ui/icons/svgs/printer.svg?raw';
	import xmark from '@gravity-ui/icons/svgs/xmark.svg?raw';
	import { tick } from 'svelte';
	import PdfPages, { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP, type ViewerStatus } from '$lib/components/PdfPages.svelte';
	import { RESUME_URL, resumeViewer } from '$lib/resume-viewer.svelte';

	let dialog: HTMLDialogElement | undefined = $state();
	let pages: PdfPages | undefined = $state();
	let printFrame: HTMLIFrameElement | undefined = $state();

	let zoom = $state(1);
	let page = $state(1);
	let pageCount = $state(0);
	let status = $state<ViewerStatus>('loading');

	let fullscreenSupported = $state(false);
	let isFullscreen = $state(false);

	const isReady = $derived(status === 'ready');
	const fullscreenLabel = $derived(isFullscreen ? 'Exit full screen' : 'Enter full screen');

	const buttonClass = `${buttonVariants({ variant: 'ghost', isIconOnly: true })} h-11 w-11 text-muted hover:text-foreground md:h-11 md:w-11`;
	// Print and full screen drop out below 640px so the toolbar fits a 360px phone.
	const wideOnlyClass = `${buttonClass} hidden sm:inline-flex`;

	$effect(() => {
		if (!dialog) return;
		if (resumeViewer.isOpen) {
			if (dialog.open) return;
			dialog.showModal();
			void tick().then(() => pages?.focus());
		} else if (dialog.open) {
			dialog.close();
		}
	});

	$effect(() => {
		fullscreenSupported = document.fullscreenEnabled === true;
		const onChange = (): void => {
			isFullscreen = document.fullscreenElement === dialog;
		};
		document.addEventListener('fullscreenchange', onChange);
		return () => document.removeEventListener('fullscreenchange', onChange);
	});

	// Runs for the close button and for Escape, since both end with the dialog's own close event.
	function onClose(): void {
		resumeViewer.close();
		zoom = 1;
		page = 1;
		pageCount = 0;
		status = 'loading';
		if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
		resumeViewer.returnFocus();
	}

	async function toggleFullscreen(): Promise<void> {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await dialog?.requestFullscreen();
		} catch {
			// The browser refused, so the viewer stays as it is.
		}
	}

	let printPending = false;
	let printLoaded = false;

	function printPdf(event: MouseEvent): void {
		if (!printFrame) return;
		if (printLoaded) {
			runPrint(event.currentTarget);
		} else {
			printPending = true;
			printFrame.src = RESUME_URL;
		}
	}

	function onPrintFrameLoad(): void {
		if (!printPending) return;
		printPending = false;
		printLoaded = true;
		runPrint(null);
	}

	function runPrint(returnTo: EventTarget | null): void {
		// The PDF frame must have focus, or the browser prints this page instead of the PDF.
		const previous = returnTo instanceof HTMLElement ? returnTo : null;
		try {
			printFrame?.contentWindow?.focus();
			printFrame?.contentWindow?.print();
		} catch {
			window.open(RESUME_URL, '_blank', 'noopener');
		}
		previous?.focus();
	}

	function onKeydown(event: KeyboardEvent): void {
		if (!resumeViewer.isOpen || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
		if (!isReady) return;
		switch (event.key) {
			case '+':
			case '=':
				pages?.zoomBy(ZOOM_STEP);
				break;
			case '-':
			case '_':
				pages?.zoomBy(1 / ZOOM_STEP);
				break;
			case '0':
				pages?.fitWidth();
				break;
			default:
				if (!pages?.scrollForKey(event)) return;
		}
		event.preventDefault();
	}
</script>

<!-- Raw SVG strings from the icon package, which follow currentColor. They are trusted package files, so {@html} is safe. -->
{#snippet icon(svg: string)}
	<span class="shrink-0 leading-none [&>svg]:size-4" aria-hidden="true">{@html svg}</span>
{/snippet}

<svelte:window onkeydown={onKeydown} />

<dialog
	bind:this={dialog}
	aria-label="Resume"
	data-resume-viewer
	class="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col border-0 bg-background p-0 text-foreground open:flex"
	onclose={onClose}
>
	{#if resumeViewer.isOpen}
		<div
			class="flex flex-wrap items-center gap-x-1 border-b border-dashed border-frame bg-background px-2 py-1 sm:flex-nowrap sm:px-4"
		>
			<div class="order-1 flex w-full items-center sm:order-3 sm:ml-auto sm:w-auto">
				<span class="section-label mr-auto pl-2 sm:hidden">Resume</span>
				<a class={buttonClass} href={RESUME_URL} download title="Download PDF" aria-label="Download PDF">
					{@render icon(arrowDownToLine)}
				</a>
				<button type="button" class={wideOnlyClass} title="Print" aria-label="Print" onclick={printPdf}>
					{@render icon(printer)}
				</button>
				{#if fullscreenSupported}
					<button
						type="button"
						class={wideOnlyClass}
						title={fullscreenLabel}
						aria-label={fullscreenLabel}
						onclick={toggleFullscreen}
					>
						{@render icon(isFullscreen ? chevronsCollapseUpRight : chevronsExpandUpRight)}
					</button>
				{/if}
				<button type="button" class={buttonClass} title="Close" aria-label="Close" onclick={() => resumeViewer.close()}>
					{@render icon(xmark)}
				</button>
			</div>

			<div class="order-2 flex flex-1 items-center justify-between sm:order-1 sm:flex-none sm:justify-start sm:pr-4">
				<div class="flex items-center">
					<button
						type="button"
						class={buttonClass}
						title="Previous page"
						aria-label="Previous page"
						disabled={!isReady || page <= 1}
						onclick={() => pages?.goTo(page - 1)}
					>
						{@render icon(chevronUp)}
					</button>
					<span class="min-w-14 text-center font-mono text-[13px] whitespace-nowrap text-muted tabular-nums">
						<span class="sr-only">Page </span>{isReady ? `${page} of ${pageCount}` : ''}
					</span>
					<button
						type="button"
						class={buttonClass}
						title="Next page"
						aria-label="Next page"
						disabled={!isReady || page >= pageCount}
						onclick={() => pages?.goTo(page + 1)}
					>
						{@render icon(chevronDown)}
					</button>
				</div>
				<div class="flex items-center">
					<button
						type="button"
						class={buttonClass}
						title="Zoom out"
						aria-label="Zoom out"
						disabled={!isReady || zoom <= MIN_ZOOM}
						onclick={() => pages?.zoomBy(1 / ZOOM_STEP)}
					>
						{@render icon(minus)}
					</button>
					<button
						type="button"
						class={buttonClass}
						title="Zoom in"
						aria-label="Zoom in"
						disabled={!isReady || zoom >= MAX_ZOOM}
						onclick={() => pages?.zoomBy(ZOOM_STEP)}
					>
						{@render icon(plus)}
					</button>
					<button
						type="button"
						class={buttonClass}
						title="Fit to width"
						aria-label="Fit to width"
						disabled={!isReady}
						onclick={() => pages?.fitWidth()}
					>
						{@render icon(arrowsExpandHorizontal)}
					</button>
				</div>
			</div>
		</div>

		<PdfPages bind:this={pages} bind:zoom bind:page bind:pageCount bind:status />

		<iframe
			bind:this={printFrame}
			title="Resume, for printing"
			tabindex="-1"
			aria-hidden="true"
			class="pointer-events-none fixed right-0 bottom-0 size-0 border-0 opacity-0"
			onload={onPrintFrameLoad}
		></iframe>
	{/if}
</dialog>

<style>
	dialog::backdrop {
		background: color-mix(in srgb, var(--background) 80%, transparent);
		backdrop-filter: blur(4px);
	}

	/* The page behind the modal must not scroll when a scroll inside the viewer reaches its end. */
	:global(html:has(dialog[data-resume-viewer][open])) {
		overflow: hidden;
	}

	@media (prefers-reduced-motion: no-preference) {
		dialog[open] {
			animation: viewer-in 140ms ease-out;
		}

		@keyframes viewer-in {
			from {
				opacity: 0;
			}
		}
	}
</style>
