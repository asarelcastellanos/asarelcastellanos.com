<script lang="ts">
	import { buttonVariants } from '@heroui/styles';
	import Icon from '$lib/components/Icon.svelte';
	import {
		applyTheme,
		currentPreference,
		DARK_SCHEME_QUERY,
		nextPreference,
		resolveTheme,
		savePreference,
		type ThemePreference
	} from '$lib/theme';

	// Prerendered HTML always says "system". The effect reads what the pre-paint script chose.
	let preference = $state<ThemePreference>('system');

	const label = $derived(`Theme: ${preference}. Switch to ${nextPreference(preference)}`);

	$effect(() => {
		preference = currentPreference();

		// While the preference is "system", follow the OS when it switches, such as at sunset.
		const query = matchMedia(DARK_SCHEME_QUERY);
		const onChange = (): void => {
			if (preference === 'system') applyTheme(resolveTheme('system', query.matches), 'system');
		};
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	});

	function cycle(): void {
		preference = nextPreference(preference);
		savePreference(preference);
		applyTheme(resolveTheme(preference, matchMedia(DARK_SCHEME_QUERY).matches), preference);
	}
</script>

<!-- All three icons are in the markup and CSS picks one from data-theme-preference on <html>, so the
     right icon shows before hydration. The kit's dark: variant also matches the system setting, so it is
     not used here. -->
<button
	type="button"
	class="{buttonVariants({ variant: 'ghost', isIconOnly: true })} h-11 w-11 text-muted hover:text-foreground md:h-11 md:w-11"
	aria-label={label}
	title={label}
	onclick={cycle}
>
	<Icon name="display" class="inline in-data-[theme-preference=light]:hidden in-data-[theme-preference=dark]:hidden" />
	<Icon name="sun" class="hidden in-data-[theme-preference=light]:inline" />
	<Icon name="moon" class="hidden in-data-[theme-preference=dark]:inline" />
</button>
