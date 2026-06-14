export const THEMES = ['dark', 'light', 'sirius-i'] as const

export type Theme = (typeof THEMES)[number]

export const THEME_LABELS: Record<Theme, string> = {
  dark: 'Dark',
  light: 'Light',
  'sirius-i': 'Sirius I',
}

const THEME_KEY = 'sirius-terminal-theme'

export function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'bloomberg') {
      saveTheme('sirius-i')
      return 'sirius-i'
    }
    if (saved && THEMES.includes(saved as Theme)) return saved as Theme
  } catch {
    // ignore
  }
  return 'dark'
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme)
}
