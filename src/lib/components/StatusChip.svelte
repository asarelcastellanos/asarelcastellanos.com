<script lang="ts">
	type Props = {
		status: string;
	};

	let { status }: Props = $props();
</script>

<!-- Mono text with a small mint square. The text carries the meaning, the square only marks it. -->
<span class="inline-flex items-center gap-2 font-mono text-xs whitespace-nowrap">
	<span aria-hidden="true" class="size-[7px] shrink-0 bg-mint"></span>
	{status}
</span>
