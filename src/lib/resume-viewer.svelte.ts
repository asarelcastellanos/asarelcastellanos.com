export const RESUME_URL = '/asarelcastellanos_resume.pdf';

class ResumeViewerState {
	isOpen = $state(false);
	#opener: HTMLElement | null = null;

	open(opener: HTMLElement | null = null): void {
		this.#opener = opener;
		this.isOpen = true;
	}

	close(): void {
		this.isOpen = false;
	}

	/** Called once the dialog has closed, because focus cannot move out of an open modal. */
	returnFocus(): void {
		this.#opener?.focus();
		this.#opener = null;
	}
}

export const resumeViewer = new ResumeViewerState();

/**
 * Click handler for every link to the resume PDF. The link keeps its real href, so a modified click,
 * a browser without <dialog>, and the page before hydration all still reach the PDF itself.
 */
export function openResumeFromClick(event: MouseEvent): void {
	if (event.defaultPrevented || event.button !== 0) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
	if (typeof HTMLDialogElement === 'undefined' || typeof HTMLDialogElement.prototype.showModal !== 'function') return;

	event.preventDefault();
	resumeViewer.open(event.currentTarget instanceof HTMLElement ? event.currentTarget : null);
}
