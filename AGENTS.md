# PargalıIbrahim Canvas — Agent Guide

Context for AI agents helping users customize this repository.

## What this project is

A **raw trading terminal UI shell** — not a finished product. Users clone it to build personal interfaces for:

- Market data research and analytics
- Charting and dashboards
- Trade execution UI
- Bot monitoring and control panels

**Included:** draggable/resizable widget grid, layout persistence, 5 shadcn color themes, shadcn/ui components, 6 placeholder widgets.
**Not included:** live feeds, exchange APIs, auth, backend.

Stack: Vite, React 19, TypeScript, Tailwind v4, shadcn/ui (Radix Mira), `react-grid-layout` v2.

Screenshot: [docs/terminal-example.png](docs/terminal-example.png)

## Architecture (read this first)

```
App.tsx              → header, theme/widget dropdowns, grid shell (shadcn Card panels)
panels.ts            → widget catalog (id, title, kind, minW/minH)
PanelContent.tsx     → widget bodies (shadcn Table, Card, Item, Badge)
layoutStorage.ts     → localStorage workspace (activePanels + lg layout)
themeStorage.ts      → theme id + localStorage
index.css            → shadcn CSS variables per theme
App.css              → react-grid-layout resize overrides only
components.json      → shadcn project config
src/components/ui/   → shadcn components
.agents/skills/      → shadcn agent skills
```

Grid: 36/24/12 columns (lg/md/sm), `rowHeight` 11px, overlap allowed, z-index on last interaction. Only **lg** layout is persisted.

## Common user tasks

| User goal | Where to work | Doc |
|-----------|---------------|-----|
| Add a widget | `panels.ts`, `PanelContent.tsx` | [docs/WIDGET-GUIDE.md](docs/WIDGET-GUIDE.md) |
| Wire API/WebSocket | New hooks/services + `PanelContent` cases | [docs/WIDGET-GUIDE.md](docs/WIDGET-GUIDE.md) |
| Add a color theme | `index.css`, `themeStorage.ts` | [docs/THEME-GUIDE.md](docs/THEME-GUIDE.md) |
| Add shadcn component | `npx shadcn@latest add <component>` | [shadcn docs](https://ui.shadcn.com) |
| Rebrand | `App.tsx`, `public/`, `index.html` | — |
| Change default layout | `DEFAULT_ACTIVE_PANELS` in `panels.ts` | — |

## Agent conventions

1. **Minimize scope** — match existing patterns; no unrelated refactors
2. **No hardcoded colors in widgets** — shadcn semantic tokens (`text-up`, `text-bid`, `bg-card`, …)
3. **Shell vs body** — panel chrome in `App.tsx` (Card); content in `PanelContent.tsx`
4. **Exhaustive switches** — `PanelKind` cases use `never` in default branch
5. **Imports at top of file** — no inline imports
6. **`minW`/`minH` in `panels.ts`** = minimum and default open size
7. **Do not start dev servers** unless the user asks — they run `npm run dev` (port 5173)
8. **Do not commit** unless the user explicitly asks
9. **Read `.agents/skills/shadcn/SKILL.md`** when working with shadcn components

## Theme IDs

| ID | Label |
|----|-------|
| `neutral` | Neutral (default) |
| `stone` | Stone |
| `mauve` | Mauve |
| `taupe` | Taupe |
| `olive` | Olive |

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

## Version baseline

Tag `v0.1.0` (`5966bf3`) — pre-shadcn Sirius I baseline. Roll back: `git checkout v0.1.0`.
