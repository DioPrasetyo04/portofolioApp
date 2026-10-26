import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return true;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'dark';
    }

    // Default migration check
    if (!localStorage.getItem('portfolio_dark_default_v1')) {
        localStorage.setItem('appearance', 'dark');
        localStorage.setItem('portfolio_dark_default_v1', 'true');
        setCookie('appearance', 'dark');
        return 'dark';
    }

    const stored = localStorage.getItem('appearance') as Appearance | null;
    if (!stored || stored === 'system') {
        return 'dark';
    }

    return stored;
};

let currentAppearance: Appearance = typeof window !== 'undefined'
    ? getStoredAppearance()
    : 'dark';

const isDarkMode = (appearance: Appearance): boolean => {
    if (appearance === 'dark') return true;
    if (appearance === 'light') return false;
    // 'system': if system prefers dark or default to dark
    return prefersDark();
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = (): void => {
    if (currentAppearance === 'system') {
        applyTheme(currentAppearance);
        notify();
    }
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('portfolio_dark_default_v1')) {
        localStorage.setItem('appearance', 'dark');
        localStorage.setItem('portfolio_dark_default_v1', 'true');
        setCookie('appearance', 'dark');
        currentAppearance = 'dark';
    } else {
        const stored = localStorage.getItem('appearance');
        if (!stored || stored === 'system') {
            localStorage.setItem('appearance', 'dark');
            setCookie('appearance', 'dark');
            currentAppearance = 'dark';
        } else {
            currentAppearance = stored as Appearance;
        }
    }

    applyTheme(currentAppearance);
    notify();

    // Set up system theme change listener
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'dark',
    );

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
        notify();
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
