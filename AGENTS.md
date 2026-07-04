# PargalıIbrahim Canvas — Agent Guide

Context for AI agents helping users customize this repository.

## What this project is

A **raw trading terminal UI shell** — not a finished product. Users clone it to build personal interfaces for:

- Market data research and analytics
- Charting and dashboards
- Trade execution UI
- Bot monitoring and control panels

**Included:** draggable/resizable widget grid, layout persistence, 5 shadcn color themes, shadcn/ui components, 1 data table widget (more widgets added incrementally).
**Not included:** live feeds, exchange APIs, auth, backend.

Stack: Vite, React 19, TypeScript, Tailwind v4, shadcn/ui (Radix Mira), `react-grid-layout` v2.

Screenshot: [docs/terminal-example.png](docs/terminal-example.png)

## Architecture (read this first)

```
App.tsx              → header, theme/widget dropdowns, grid shell (shadcn Card panels)
panels.ts            → widget catalog (id, title, kind, minW/minH)
PanelContent.tsx     → widget bodies (shadcn Table, Card, …)
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
10. **shadcn first** — before building UI, check if shadcn has the component or block; add via CLI, compose — do not hand-roll primitives

## shadcn-first workflow

Before any new UI work:

1. Read `.agents/skills/shadcn/SKILL.md`
2. Search: `npx shadcn@latest search @shadcn -q "<name>"`
3. Docs: `npx shadcn@latest docs <component>`
4. Add: `npx shadcn@latest add <component>`
5. Compose in app code — only build custom **wrappers** (e.g. `ThemeSelect`), not custom buttons/tables/dialogs

## UI inventory

### shadcn installed + in use

| Component | Used in |
|-----------|---------|
| `button` | `App.tsx`, header controls |
| `card` | `App.tsx` (panel shell) |
| `tabs` | `NotesPanel.tsx` |
| `textarea` | `NotesPanel.tsx` |
| `chart` | `ChartPanel.tsx` |
| `table` | `PanelContent.tsx` |
| `textarea` | `PanelContent.tsx` |
| `badge` | installed — KPI / stats |
| `dropdown-menu` | `ThemeSelect`, `WidgetSelect` |
| `dialog` | `DataSourceDialog` |
| `skeleton` | installed — use for loading states |

### Intentionally custom (not shadcn)

| Area | Why |
|------|-----|
| `react-grid-layout` + `App.css` | Drag/resize grid — no shadcn equivalent |
| `layoutStorage.ts`, `themeStorage.ts` | Persistence logic |
| `ThemeSelect`, `WidgetSelect`, `DatasetSelect`, `DataSourceDialog` | Thin app wrappers composing shadcn |

Add components only when needed (e.g. `skeleton`, `chart`, `badge` for KPI cards). Remove unused installs to keep the tree clean.


| ID | Label |
|----|-------|
| `neutral` | Neutral (default) |
| `stone` | Stone |
| `mauve` | Mauve |
| `taupe` | Taupe |
| `olive` | Olive |

## Widgets

| id | kind | Purpose |
|----|------|---------|
| notes | notes | Markdown editor + preview (localStorage) |
| dashboard | dashboard | KPI row, chart, and symbol table in one panel |
| reports | reports | Saved report library, preview, and run history (mock) |
| chart | chart | Line chart (Recharts) |
| kpi-card | kpi-card | Generic metric — name, value, timestamp |
| data-table | data-table | Parquet / query result preview table |

## Persistence keys (localStorage)

| Key | Content |
|-----|---------|
| `pargali-canvas-workspace` | `{ activePanels, layout, gridVersion }` |
| `pargali-canvas-theme` | Theme id string |
| `pargali-canvas-notes` | Notes workspace (files, contents, active tab) |

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
