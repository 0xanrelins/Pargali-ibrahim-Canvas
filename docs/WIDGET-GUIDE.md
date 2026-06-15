# Widget Guide

How to add or customize widgets in PargalıIbrahim Canvas. Shell, grid, and themes: [THEME-GUIDE.md](./THEME-GUIDE.md).

**Scope:** Widget **body** only — chart, table, list content. The shell (title bar, drag handle, close, resize) lives in `App.tsx` and is shared by all widgets.

---

## Anatomy

| Layer | File | Responsibility |
|-------|------|----------------|
| Shell | `src/App.tsx` | Title, hint, × close, drag handle, resize |
| Body | `src/PanelContent.tsx` | Your data / chart / table |

```
┌─ panel-handle ─────────────────────── × ─┐
│  Chart          BTC/USDT · 1h            │
├─ panel-body ─────────────────────────────┤
│  … widget content (PanelContent) …       │
└──────────────────────────────────────────┘
```

Do not add widget-specific shell styles. Put all content inside `panel-body` using shared classes.

---

## Add a new widget

### 1. Register in `src/panels.ts`

```ts
export type PanelKind =
  | 'chart'
  | 'orderbook'
  // … existing kinds …
  | 'mywidget'   // add here

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
- `minW` × `minH` — minimum size **and** default open size (`createLayoutItem` uses min as w/h)
- lg grid: 36 columns, `rowHeight` 11px → height ≈ `h × 11px`

### 2. Render in `src/PanelContent.tsx`

Add a `case` for your `kind`:

```tsx
case 'mywidget':
  return (
    <div className="panel-content">
      {/* your markup */}
    </div>
  )
```

Use an exhaustive `default` with `never` so new kinds fail at compile time if unhandled.

### 3. Styles in `src/App.css` (only if needed)

Reuse existing patterns first:

| Class | Use for |
|-------|---------|
| `.data-table` | Tabular data (order book, positions, trades) |
| `.watchlist` | Symbol lists |
| `.ticker-grid` + `.ticker-stat` | Stat cards |
| `.panel-content` + `.panel-content--chart` | Chart area |

Add a new shared class only when no existing pattern fits. Never hardcode hex colors — use CSS variables (`--text`, `--bid`, `--ask`, etc.).

### 4. Widget picker

`WidgetSelect.tsx` reads `PANEL_CATALOG` automatically — no extra step.

---

## Semantic colors

| Class / variable | Meaning |
|------------------|---------|
| `--text` | Primary data (price, symbol) |
| `--text-dim` | Labels, table headers |
| `--text-muted` | Secondary text |
| `--bid` / `.bid` | Buy side |
| `--ask` / `.ask` | Sell side |
| `--up` / `.up` | Positive change |
| `--down` / `.down` | Negative change |
| `--long` / `.long` | Long position |
| `--short` / `.short` | Short position |

Typography: monospace stack from `body`, `0.75rem`, `font-variant-numeric: tabular-nums` for numbers.

---

## Built-in widgets (reference)

| Widget | kind | minW × minH | Body pattern |
|--------|------|-------------|--------------|
| Chart | `chart` | 12 × 12 | `.panel-content--chart` |
| Order Book | `orderbook` | 9 × 9 | `table.data-table`, `tr.bid` / `tr.ask` |
| Positions | `positions` | 6 × 6 | `table.data-table` |
| Watchlist | `watchlist` | 6 × 6 | `ul.watchlist` |
| Recent Trades | `trades` | 6 × 6 | `table.data-table` |
| Ticker | `ticker` | 3 × 3 | `.ticker-grid` |

Placeholder content in `PanelContent.tsx` is meant to be replaced with your API/WebSocket data.

---

## Wire live data

1. Create hooks or services outside `PanelContent.tsx` (e.g. `src/hooks/useOrderBook.ts`)
2. Pass data into `PanelContent` via props from `App.tsx`, or use context
3. Keep rendering logic in the `case` branch; keep fetch/subscribe logic separate

`panel-body` scrolls overflow. For charts, handle resize inside the widget (canvas `ResizeObserver` or chart library API).

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
- [ ] Shared CSS classes; no hardcoded colors
- [ ] Sirius I overrides in `App.css` only if the shared pattern needs theme-specific tuning

Detailed Sirius I content rules: [SIRIUS-I-WIDGET-GUIDE.md](./SIRIUS-I-WIDGET-GUIDE.md).
