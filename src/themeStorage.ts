export const THEMES = ['neutral', 'stone', 'mauve', 'taupe', 'olive'] as const

export type Theme = (typeof THEMES)[number]

export const DEFAULT_THEME: Theme = 'neutral'

export const THEME_LABELS: Record<Theme, string> = {
  neutral: 'Neutral',
  stone: 'Stone',
  mauve: 'Mauve',
  taupe: 'Taupe',
  olive: 'Olive',
}

export const THEME_STORAGE_KEY = 'pargali-canvas-theme'

const LEGACY_THEME_KEYS = ['sirius-terminal-theme'] as const

const LEGACY_THEME_IDS = new Set([
  'bloomberg',
  'dark',
  'light',
  'sirius-i',
])

function readStoredTheme(): { value: string; migrated: boolean } | null {
  const current = localStorage.getItem(THEME_STORAGE_KEY)
  if (current) return { value: current, migrated: false }

  for (const legacyKey of LEGACY_THEME_KEYS) {
    const legacy = localStorage.getItem(legacyKey)
    if (legacy) {
      localStorage.removeItem(legacyKey)
      return { value: legacy, migrated: true }
    }
  }

  return null
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.add('dark')
}

export function loadTheme(): Theme {
  try {
    const stored = readStoredTheme()
    if (!stored) return DEFAULT_THEME

    const { value: saved, migrated } = stored
    if (LEGACY_THEME_IDS.has(saved)) {
      saveTheme(DEFAULT_THEME)
      return DEFAULT_THEME
    }
    if (THEMES.includes(saved as Theme)) {
      if (migrated) saveTheme(saved as Theme)
      return saved as Theme
    }
  } catch {
    // ignore
  }
  return DEFAULT_THEME
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}
