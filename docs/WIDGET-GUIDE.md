# Widget Guide

How to add or customize widgets in PargalıIbrahim Canvas. Shell, grid, and themes: [THEME-GUIDE.md](./THEME-GUIDE.md).

**Scope:** Widget **body** only — chart, table, list content. The shell (title bar, drag handle, close, resize) lives in `App.tsx` as a shadcn `Card` and is shared by all widgets.

---

## Anatomy

| Layer | File | Responsibility |
|-------|------|----------------|
| Shell | `src/App.tsx` | shadcn `Card` — title, hint, close, drag/resize |
| Body | `src/PanelContent.tsx` | Your data / chart / table |

```
┌─ CardHeader ─────────────────────────── × ─┐
│  Chart          BTC/USDT · 1h              │
├─ CardContent ──────────────────────────────┤
│  … widget content (PanelContent) …       │
└──────────────────────────────────────────┘
```

Do not add widget-specific shell styles. Put all content inside `CardContent` using shadcn components.

---

## Add a new widget

### 1. Register in `src/panels.ts`

```ts
export type PanelKind =
  | 'chart'
  | 'orderbook'
  // … existing kinds …
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
| `Table` | Tabular data (order book, positions, trades) |
| `Item` + `Badge` | Symbol lists (watchlist) |
| `Card` | Stat cards (ticker), chart placeholder |
| Tailwind utilities | Layout, spacing |

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
| Chart | `chart` | 12 × 12 | `Card` placeholder |
| Order Book | `orderbook` | 9 × 9 | `Table` |
| Positions | `positions` | 6 × 6 | `Table` |
| Watchlist | `watchlist` | 6 × 6 | `Item` + `Badge` |
| Recent Trades | `trades` | 6 × 6 | `Table` |
| Ticker | `ticker` | 3 × 3 | `Card` grid |

Placeholder content in `PanelContent.tsx` is meant to be replaced with your API/WebSocket data.

---

## Wire live data

1. Create hooks or services outside `PanelContent.tsx` (e.g. `src/hooks/useOrderBook.ts`)
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
