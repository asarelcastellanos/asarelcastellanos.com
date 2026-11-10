<script lang="ts">
	import arrowDownToLine from '@gravity-ui/icons/svgs/arrow-down-to-line.svg?raw';
	import arrowUpRight from '@gravity-ui/icons/svgs/arrow-up-right.svg?raw';
	import moon from '@gravity-ui/icons/svgs/moon.svg?raw';
	import sun from '@gravity-ui/icons/svgs/sun.svg?raw';

	// Raw SVG strings from the icon package, inlined at build time so they follow currentColor.
	// The strings are trusted package files, not user input, so {@html} is safe here.
	const icons = {
		'arrow-down-to-line': arrowDownToLine,
		'arrow-up-right': arrowUpRight,
		moon,
		sun
	} as const;

	type Props = {
		name: keyof typeof icons;
		class?: string;
	};

	let { name, class: className = '' }: Props = $props();
</script>

<span class="shrink-0 leading-none [&>svg]:size-4 {className}" aria-hidden="true">{@html icons[name]}</span>
