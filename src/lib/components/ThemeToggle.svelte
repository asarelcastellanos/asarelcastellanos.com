<script lang="ts">
	import { buttonVariants } from '@heroui/styles';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { applyTheme, currentTheme, nextTheme, type Theme } from '$lib/theme';

	// Prerendered HTML is always light. onMount reads what the pre-paint script chose.
	let theme = $state<Theme>('light');

	onMount(() => {
		theme = currentTheme();
	});

	const label = $derived(nextTheme(theme) === 'light' ? 'Switch to light theme' : 'Switch to dark theme');

	function toggle(): void {
		theme = nextTheme(theme);
		applyTheme(theme);
	}
</script>

<!-- Both icons are in the markup and CSS picks one from data-theme on <html>, so there is no wrong icon
     before hydration. The kit's dark: variant also matches the system setting, so it is not used here. -->
<button
	type="button"
	class="{buttonVariants({ variant: 'ghost', isIconOnly: true })} h-11 w-11 text-muted hover:text-foreground md:h-11 md:w-11"
	aria-label={label}
	onclick={toggle}
>
	<Icon name="sun" class="hidden in-data-[theme=dark]:inline" />
	<Icon name="moon" class="inline in-data-[theme=dark]:hidden" />
</button>
