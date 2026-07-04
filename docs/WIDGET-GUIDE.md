# Widget Guide

How to add or customize widgets in PargalıIbrahim Canvas. Shell, grid, and themes: [THEME-GUIDE.md](./THEME-GUIDE.md).

**Scope:** Widget **body** only — table, chart, report content. The shell (title bar, drag handle, close, resize) lives in `App.tsx` as a shadcn `Card` and is shared by all widgets.

---

## Anatomy

| Layer | File | Responsibility |
|-------|------|----------------|
| Shell | `src/App.tsx` | shadcn `Card` — title, hint, close, drag/resize |
| Body | `src/PanelContent.tsx` | Your data / chart / table |

```
┌─ CardHeader ─────────────────────────── × ─┐
│  Data Table     market_ticks.parquet       │
├─ CardContent ──────────────────────────────┤
│  … widget content (PanelContent) …       │
└──────────────────────────────────────────┘
```

Do not add widget-specific shell styles. Put all content inside `CardContent` using shadcn components.

---

## shadcn-first (before any widget UI)

1. Check shadcn: `npx shadcn@latest search @shadcn -q "<name>"`
2. Read docs: `npx shadcn@latest docs <component>`
3. Add if missing: `npx shadcn@latest add <component>`
4. Compose in `PanelContent.tsx` — no hand-rolled table/button/dialog primitives

See also [AGENTS.md](../AGENTS.md) → **shadcn-first workflow**.

---

## Add a new widget

### 1. Register in `src/panels.ts`

```ts
export type PanelKind =
  | 'data-table'
  // … add new kinds here …
  | 'mywidget'

export const PANEL_CATALOG: PanelDef[] = [
  // …
  {
    id: 'mywidget',
    title: 'My Widget',
    hint: 'Optional subtitle',
    kind: 'mywidget',
    grid: { x: 0, y: 0, w: 6, h: 6, minW: 6, minH: 6 },
  },
]
```

- `id` — unique key; used in layout and `WidgetSelect`
- `minW` × `minH` — minimum size **and** default open size
- lg grid: 36 columns, `rowHeight` 11px → height ≈ `h × 11px`

### 2. Render in `src/PanelContent.tsx`

Add a `case` for your `kind`:

```tsx
case 'mywidget':
  return (
    <div className="h-full min-h-20">
      {/* your markup */}
    </div>
  )
```

Use an exhaustive `default` with `never` so new kinds fail at compile time if unhandled.

### 3. Use shadcn components

Reuse existing patterns first:

| Component | Use for |
|-----------|---------|
| `Tabs` + `Textarea` | Markdown notes (edit + preview) |
| `Chart` | Time series, OHLC (Recharts via shadcn) |
| `Table` | Tabular data, Parquet preview, query results |
| `Card` + `Badge` | KPI / stat cards (add `badge` when needed) |
| `Chart` | Time series (add `chart` when needed) |
| `Skeleton` | Loading states (add when needed) |

Add shadcn components via CLI when needed:

```bash
npx shadcn@latest add <component>
```

Never hardcode hex colors — use semantic tokens (`text-up`, `text-bid`, `text-muted-foreground`, …).

### 4. Widget picker

`WidgetSelect.tsx` reads `PANEL_CATALOG` automatically — no extra step.

---

## Semantic colors

| Token / class | Meaning |
|---------------|---------|
| `text-foreground` | Primary data |
| `text-muted-foreground` | Labels, secondary text |
| `text-bid` / `text-ask` | Buy / sell side |
| `text-up` / `text-down` | Positive / negative change |
| `text-long` / `text-short` | Position side |

Typography: Inter (theme default), `text-xs`, `tabular-nums` for numbers.

---

## Built-in widgets (reference)

| Widget | kind | minW × minH | Body pattern |
|--------|------|-------------|--------------|
| Notes | `notes` | 8 × 8 | `Tabs` + Edit/Preview toggle + `Textarea` |
| Chart | `chart` | 9 × 7 | shadcn `Chart` + Recharts `LineChart` |
| KPI Card | `kpi-card` | 4 × 3 | name + value + timestamp (left stack) |
| Textarea | `textarea` | 6 × 5 | shadcn `Textarea` (notes / query) |
| Data Table | `data-table` | 9 × 7 | shadcn `Table` + `TableFooter` |

Add new widgets one at a time via shadcn components. Placeholder content in `PanelContent.tsx` is replaced with real data sources as you wire them up.

---

## Wire live data

1. Create hooks or services outside `PanelContent.tsx` (e.g. `src/hooks/useDatasetPreview.ts`)
2. Pass data into `PanelContent` via props from `App.tsx`, or use context
3. Keep rendering logic in the `case` branch; keep fetch/subscribe logic separate

`CardContent` scrolls overflow. For charts, handle resize inside the widget (canvas `ResizeObserver` or chart library API).

---

## Data formatting conventions

| Type | Example |
|------|---------|
| Price | `67,840.20` |
| Percent | `+2.4%`, `-0.8%` |
| Time | `HH:mm:ss` |
| Symbol | `ETH/USDT` |
| PnL | `+$312`, `-$48` |

---

## Checklist

- [ ] `PanelKind` union updated in `panels.ts`
- [ ] Entry in `PANEL_CATALOG` with `minW`/`minH`
- [ ] `case` in `PanelContent.tsx`
- [ ] shadcn components; no hardcoded colors
- [ ] No widget-specific shell chrome in `App.tsx`
