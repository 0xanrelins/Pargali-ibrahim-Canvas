# Theme Guide

How themes and the terminal shell work in PargalıIbrahim Canvas. Widget content rules: [WIDGET-GUIDE.md](./WIDGET-GUIDE.md).

All colors are CSS variables. Components use shared classes — widget bodies must not copy theme hex values.

---

## Source files

| File | Role |
|------|------|
| `src/index.css` | Theme variable blocks (`dark`, `light`, `sirius-i`) |
| `src/App.css` | Shell + widget styles; `[data-theme='sirius-i']` overrides |
| `src/themeStorage.ts` | Theme IDs, labels, localStorage key |
| `src/ThemeSelect.tsx` | Header theme dropdown |
| `index.html` | Initial `data-theme` on `<html>` |

Theme is applied via `document.documentElement.dataset.theme`. Default for new users: `sirius-i` (Sirius I).

---

## Built-in themes

| ID | Label | Character |
|----|-------|-----------|
| `dark` | Dark | Classic terminal — blue handle, visible panel borders |
| `light` | Light | Light background, green/red bid/ask |
| `sirius-i` | Sirius I | Soft black, minimal borders, sage/dusty-rose bid/ask |

Internal id `sirius-i`, display label `Sirius I`. Legacy `bloomberg` in localStorage migrates to `sirius-i`.

### Core variables (all themes)

| Variable | Typical use |
|----------|-------------|
| `--bg` | Page background |
| `--panel-bg` | Panel body |
| `--panel-border` | Panel frame |
| `--panel-header-bg` | Title bar (transparent on Sirius I) |
| `--text` / `--text-dim` / `--text-muted` | Text hierarchy |
| `--bid`, `--ask`, `--up`, `--down`, `--long`, `--short` | Market semantics |
| `--handle` | Resize handle color |
| `--grid-line` | Chart grid (transparent on Sirius I) |
| `--chart-glow` | Chart area gradient |

Full hex tables: `src/index.css`. Sirius I shell tweaks: `src/App.css` → `[data-theme='sirius-i']`.

---

## Add a new theme

### 1. Define variables in `src/index.css`

```css
[data-theme='my-theme'] {
  --bg: #0a0a0a;
  --text: #ffffff;
  --bid: #77a898;
  --ask: #9e8585;
  /* copy full set from dark or sirius-i and adjust */
}
```

Include every variable used in `App.css` — missing vars fall through unpredictably.

### 2. Register in `src/themeStorage.ts`

```ts
export const THEMES = ['dark', 'light', 'sirius-i', 'my-theme'] as const

export const THEME_LABELS: Record<Theme, string> = {
  dark: 'Dark',
  light: 'Light',
  'sirius-i': 'Sirius I',
  'my-theme': 'My Theme',
}
```

`ThemeSelect` picks up `THEMES` automatically.

### 3. Optional shell overrides in `src/App.css`

```css
[data-theme='my-theme'] .panel {
  /* theme-specific shell tweaks only */
}
```

Keep widget bodies theme-agnostic; override shared classes, not per-widget IDs.

### 4. Default theme (optional)

Change the fallback in `loadTheme()` in `themeStorage.ts` and `data-theme` in `index.html`.

---

## Shell & grid (theme-independent)

| Topic | Value |
|-------|-------|
| Grid | `react-grid-layout` v2 |
| Breakpoints | lg 36 cols / md 24 / sm 12 |
| Row height | 11px |
| Overlap | Enabled — last dragged panel on top |
| Layout storage | `localStorage` key `sirius-terminal-workspace` (lg only) |
| Resize | 8 invisible handles (edges + corners) |

---

## Design rules

1. **No hardcoded colors in widgets** — use variables and semantic classes (`.bid`, `.up`, …)
2. **One shell for all widgets** — no per-panel colored title bars
3. **Sirius I first** — if you ship a custom theme, test tabular data and charts against all three built-ins
4. **Monospace + tabular nums** — trading data stays aligned

Extended Sirius I reference: [Sirius-Terminal-Theme.md](./Sirius-Terminal-Theme.md).
