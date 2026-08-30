'use client';

import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  resolvedTheme: 'light',

  setTheme: (theme: Theme) => {
    if (typeof window === 'undefined') return;

    let resolved: 'light' | 'dark' = 'dark';
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = prefersDark ? 'dark' : 'light';
    } else {
      resolved = theme;
    }

    localStorage.setItem('andropvs_theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    document.documentElement.setAttribute('data-theme', resolved);

    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const current = get().resolvedTheme;
    const next = current === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  initializeTheme: () => {
    if (typeof window === 'undefined') return;

    const storedTheme = (localStorage.getItem('andropvs_theme') as Theme) || 'light';
    get().setTheme(storedTheme);
  },
}));
