# PargalıIbrahim Canvas — Agent Guide

Context for AI agents helping users customize this repository.

## What this project is

A **raw trading terminal UI shell** — not a finished product. Users clone it to build personal interfaces for:

- Market data research and analytics
- Charting and dashboards
- Trade execution UI
- Bot monitoring and control panels

**Included:** draggable/resizable widget grid, layout persistence, 3 themes, 6 placeholder widgets.  
**Not included:** live feeds, exchange APIs, auth, backend.

Stack: Vite, React 19, TypeScript, `react-grid-layout` v2.

Screenshot: [docs/example-dashboard.png](docs/example-dashboard.png)

## Architecture (read this first)

```
App.tsx          → header, theme/widget dropdowns, grid shell
panels.ts        → widget catalog (id, title, kind, minW/minH)
PanelContent.tsx → widget bodies (swap placeholders for real data)
layoutStorage.ts → localStorage workspace (activePanels + lg layout)
themeStorage.ts  → theme id + localStorage
index.css        → CSS variables per theme
App.css          → shared shell + widget classes + sirius-i overrides
```

Grid: 36/24/12 columns (lg/md/sm), `rowHeight` 11px, overlap allowed, z-index on last interaction. Only **lg** layout is persisted.

## Common user tasks

| User goal | Where to work | Doc |
|-----------|---------------|-----|
| Add a widget | `panels.ts`, `PanelContent.tsx`, maybe `App.css` | [docs/WIDGET-GUIDE.md](docs/WIDGET-GUIDE.md) |
| Wire API/WebSocket | New hooks/services + `PanelContent` cases | [docs/WIDGET-GUIDE.md](docs/WIDGET-GUIDE.md) |
| Add a theme | `index.css`, `themeStorage.ts` | [docs/THEME-GUIDE.md](docs/THEME-GUIDE.md) |
| Rebrand | `App.tsx`, `public/`, `index.html` | — |
| Change default layout | `DEFAULT_ACTIVE_PANELS` in `panels.ts` | — |

## Agent conventions

1. **Minimize scope** — match existing patterns; no unrelated refactors
2. **No hardcoded colors in widgets** — CSS variables (`--text`, `--bid`, …) and semantic classes
3. **Shell vs body** — never add widget-specific chrome in `App.tsx`; content stays in `PanelContent.tsx`
4. **Exhaustive switches** — `PanelKind` cases use `never` in default branch
5. **Imports at top of file** — no inline imports
6. **`minW`/`minH` in `panels.ts`** = minimum and default open size
7. **Do not start dev servers** unless the user asks — they run `npm run dev` (port 5173)
8. **Do not commit** unless the user explicitly asks

## Theme IDs

| ID | Label |
|----|-------|
| `dark` | Dark |
| `light` | Light |
| `sirius-i` | Sirius I (default) |

## Placeholder widgets

| id | kind | Purpose |
|----|------|---------|
| chart | chart | Price / candlestick area |
| orderbook | orderbook | Depth table |
| positions | positions | Open positions |
| watchlist | watchlist | Symbol list |
| trades | trades | Recent trades feed |
| ticker | ticker | Market stats cards |

## Persistence keys (localStorage)

| Key | Content |
|-----|---------|
| `sirius-terminal-workspace` | `{ activePanels, layout, gridVersion }` |
| `sirius-terminal-theme` | Theme id string |

## Run & build

```bash
npm install
npm run dev      # development
npm run build    # production build
```

## Extended docs

- [README.md](README.md) — project overview, quick start
- [docs/WIDGET-GUIDE.md](docs/WIDGET-GUIDE.md) — add/customize widgets
- [docs/THEME-GUIDE.md](docs/THEME-GUIDE.md) — add/customize themes
- [docs/SIRIUS-I-WIDGET-GUIDE.md](docs/SIRIUS-I-WIDGET-GUIDE.md) — detailed Sirius I widget content spec
- [docs/Sirius-Terminal-Theme.md](docs/Sirius-Terminal-Theme.md) — detailed theme variable reference

## Version baseline

Tag `v0.1.0` (`5966bf3`) — Sirius I UI baseline (grid, themes, dropdowns). Roll back: `git checkout v0.1.0`.
