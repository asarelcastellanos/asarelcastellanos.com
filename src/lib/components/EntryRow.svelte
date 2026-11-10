<script lang="ts">
	type Props = {
		organization: string;
		title: string;
		summary: string;
		dates: string;
		/** Education rows show the coursework sentence in muted text. */
		mutedSummary?: boolean;
	};

	let { organization, title, summary, dates, mutedSummary = false }: Props = $props();
</script>

<!-- Phone: company and title, sentence, dates, stacked. From md: three columns on one line. -->
<li
	class="flex flex-col gap-2 border-t border-separator py-5 last:border-b md:grid md:grid-cols-[16rem_1fr_auto] md:gap-x-8 md:gap-y-0"
>
	<div class="flex flex-col gap-0.5">
		<span class="font-medium">{organization}</span>
		<span class="text-sm text-muted">{title}</span>
	</div>
	<p class="text-sm leading-relaxed text-pretty {mutedSummary ? 'text-muted' : ''}">{summary}</p>
	<span class="font-mono text-sm text-muted whitespace-nowrap tabular-nums md:text-right">{dates}</span>
</li>
