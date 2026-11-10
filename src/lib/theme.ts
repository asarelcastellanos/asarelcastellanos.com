/** The two themes the page can render in. */
export type Theme = 'light' | 'dark';

/** What the visitor picked with the toggle. "system" follows the OS setting, including live changes. */
export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

/** localStorage holds "light" or "dark". No entry means "system". app.html reads the same key. */
export const THEME_STORAGE_KEY = 'theme';

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

/** The toggle cycles system, light, dark, then back to system. */
export function nextPreference(preference: ThemePreference): ThemePreference {
	switch (preference) {
		case 'system':
			return 'light';
		case 'light':
			return 'dark';
		case 'dark':
			return 'system';
		default: {
			const _exhaustive: never = preference;
			return _exhaustive;
		}
	}
}

export function resolveTheme(preference: ThemePreference, systemIsDark: boolean): Theme {
	switch (preference) {
		case 'system':
			return systemIsDark ? 'dark' : 'light';
		case 'light':
		case 'dark':
			return preference;
		default: {
			const _exhaustive: never = preference;
			return _exhaustive;
		}
	}
}

/** The preference the pre-paint script in app.html already applied to the page. */
export function currentPreference(): ThemePreference {
	const value = document.documentElement.dataset.themePreference;
	return value === 'light' || value === 'dark' ? value : 'system';
}

/** Stores the preference. "system" removes the entry, so the OS setting decides on the next visit. */
export function savePreference(preference: ThemePreference): void {
	try {
		if (preference === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
		else localStorage.setItem(THEME_STORAGE_KEY, preference);
	} catch {
		// Storage can be blocked. The choice then lasts until the next load.
	}
}

/** Renders the page in a theme and records the preference on <html>, where CSS picks the toggle icon. */
export function applyTheme(theme: Theme, preference: ThemePreference): void {
	const root = document.documentElement;
	root.classList.toggle('dark', theme === 'dark');
	root.dataset.theme = theme;
	root.dataset.themePreference = preference;

	// The browser chrome should match the page. app.css is the only place that defines the color.
	const background = getComputedStyle(root).getPropertyValue('--background').trim();
	if (background !== '') {
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
	}
}
