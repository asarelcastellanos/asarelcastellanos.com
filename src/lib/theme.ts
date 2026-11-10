/** The two themes. Absence of a stored choice means "follow the system". */
export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: unknown): value is Theme {
	return THEMES.some((theme) => theme === value);
}

export function nextTheme(theme: Theme): Theme {
	switch (theme) {
		case 'light':
			return 'dark';
		case 'dark':
			return 'light';
		default: {
			const _exhaustive: never = theme;
			return _exhaustive;
		}
	}
}

/** The theme the pre-paint script in app.html already applied to the page. */
export function currentTheme(): Theme {
	return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Sets the theme on the page, in the browser UI color, and in localStorage. */
export function applyTheme(theme: Theme): void {
	const root = document.documentElement;
	root.classList.toggle('dark', theme === 'dark');
	root.dataset.theme = theme;

	// The browser chrome should match the page. app.css is the only place that defines the color.
	const background = getComputedStyle(root).getPropertyValue('--background').trim();
	if (background !== '') {
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
	}

	try {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch {
		// Storage can be blocked. The choice then lasts until the next load.
	}
}
