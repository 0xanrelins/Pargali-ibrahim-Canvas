# Sirius Canvas — Agent Context

## Version baseline

**Default project reference: `v0.1.0`** (commit `5966bf3`)

Sirius I UI baseline — grid, themes, custom dropdowns, widget picker, branding. Roll back with:

```bash
git checkout v0.1.0
# or: git reset --hard v0.1.0
```

Tag new milestones as `v0.2.0`, `v0.3.0`, etc.

## Agent maintenance (required)

**Her git commit'te bu dosyayı güncelle** — proje journey'si burada yaşar.

1. **Journey** bölümüne yeni satır ekle: tarih, commit hash (ve tag varsa), 1–3 madde ne değişti
2. **Where we are** — önemli milestone olduysa güncelle
3. **Where we're going** — öncelikler değiştiyse güncelle

Kısa, factual, gelecekteki agent tek okumada anlasın.

## Journey

| Date | Ref | Summary |
|------|-----|---------|
| 2026-06-14 | `v0.1.0` / `5966bf3` | İlk baseline: draggable grid, layout persistence, Sirius I theme, custom theme + widget dropdowns, logo/favicon, header branding |
| 2026-06-14 | `9023631` | `AGENTS.md`: LLM context, `v0.1.0` baseline notu, journey kuralı (her commit'te güncelle) |
| 2026-06-14 | `9f47cd1` | Responsive bootstrap: lg-only layout save, md/sm auto-stack, per-widget minW/minH |
| 2026-06-14 | `42eec8c` | 8-direction invisible resize handles; edge handle transform fix |
| 2026-06-14 | `d293bf1` | Allow overlap + z-index stack; 8-handle edge fix with overlap |
| 2026-06-14 | `621716d` | 36-col grid; toggle layout fix; min default size; scroll shell; `docs/Sirius-Terminal-Theme.md` |
| 2026-06-14 | `34fc32c` | Finer 36-col grid, layout toggle fix, theme docs |
| 2026-06-14 | `af4d22f` | Persist on drag/resize stop; `gridVersion` fixes refresh reset; `lgLayoutEqual` mount guard |

## Goal

Build a **modular trading terminal**: draggable/resizable widget grid, persistent layout, live market data (future).

## Where we are

- Vite + React 19 + TypeScript + `react-grid-layout` v2
- **Responsive bootstrap:** 3 breakpoints (lg/md/sm, 36/24/12 cols); `rowHeight` 11px; only **lg** layout persisted; md/sm auto-stacked from lg order
- **Per-widget minW/minH** in `panels.ts`; default open size = min (ideal size)
- 6 widget types — placeholder content (`PanelContent.tsx`)
- 3 themes: Dark, Light, **Sirius I** (`sirius-i`) — primary design target
- Header: logo, theme + widget dropdowns (shared `dropdown-*` styles)
- **8-direction resize:** global invisible handles (s/n/e/w + corners)
- **Allow overlap:** panels can stack; last dragged/resized on top (z-index)
- Layout key: `sirius-terminal-workspace` (stores `{ activePanels, layout, gridVersion }`); persist on **drag/resize stop**; `onLayoutChange` sync-only

## Where we're going

1. Sirius I as default theme for new users
2. Widget design guide (`docs/SIRIUS-I-WIDGET-GUIDE.md`)
3. Real panel content — charts, order book, WebSocket/API
4. GitHub remote + push

## Key files

| File | Role |
|------|------|
| `src/App.tsx` | Shell, grid, header |
| `src/panels.ts` | Widget catalog |
| `src/layoutStorage.ts` | Workspace persistence |
| `src/themeStorage.ts` | Theme IDs + localStorage |
| `src/index.css` | Theme CSS variables |
| `src/App.css` | Components + Sirius I overrides |
| `src/ThemeSelect.tsx` | Single-select dropdown |
| `src/WidgetSelect.tsx` | Multi-select dropdown |
| `vite.config.ts` | `process.env` defines (required for drag) |
| `docs/Sirius-Terminal-Theme.md` | Tema + kabuk rehberi |

## Run

```bash
npm run dev
```

Default port 5173. User runs dev server — do not start extra servers.

## Conventions

- **Her commit → `AGENTS.md` Journey güncelle** (yukarıdaki kural)
- CSS variables + shared classes; don't hardcode colors per panel
- Minimize scope; match existing patterns
- Internal theme id: `sirius-i`, label: `Sirius I`
- No commits unless user asks
