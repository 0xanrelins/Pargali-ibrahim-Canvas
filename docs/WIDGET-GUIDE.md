# Widget Guide

How to add or customize widgets in PargalıIbrahim Canvas. Shell, grid, and themes: [THEME-GUIDE.md](./THEME-GUIDE.md). Backend API: [../backend/README.md](../backend/README.md).

**Scope:** Widget **body** only — table, chart, KPI content. The shell (title bar, drag handle, close, resize) lives in `App.tsx` as a shadcn `Card` and is shared by all widgets.

---

## Anatomy

| Layer | File | Responsibility |
|-------|------|----------------|
| Shell | `src/App.tsx` | shadcn `Card` — title, optional data hint, close, drag/resize |
| Router | `src/PanelContent.tsx` | `switch (kind)` → panel component |
| Body | `src/*Panel.tsx` | Widget-specific UI + data hooks |

```
┌─ CardHeader ─────────────────────────── × ─┐
│  Chart 2              prediction_price    │
├─ CardContent ──────────────────────────────┤
│  … widget content …                      │
└──────────────────────────────────────────┘
```

KPI Card has no header data hint (dataset/metric shown in pickers). Other data widgets may show dataset name in the header via `PanelDataHint`.

---

## Widget instances

- `PANEL_CATALOG` in `panels.ts` — templates (`chart`, `data-table`, …)
- Each added widget gets a **unique instance id** (`chart-a1b2c3`) via `createPanelInstance()`
- **Widgets** menu → pick type → **adds** a new instance
- Panel **X** → removes that instance
- Layout `i` field = instance id

---

## Add a new widget

### 1. Register template in `src/panels.ts`

```ts
export type PanelKind = 'data-table' | 'mywidget' // …

export const PANEL_CATALOG: PanelDef[] = [
  {
    id: 'mywidget',        // template id (also kind prefix)
    title: 'My Widget',
    hint: 'Optional subtitle',
    kind: 'mywidget',
    grid: { x: 0, y: 0, w: 6, h: 6, minW: 6, minH: 6 },
  },
]
```

- `minW` × `minH` — minimum size **and** default open size
- lg grid: 36 columns, `rowHeight` 11px → height ≈ `h × 11px`

### 2. Create panel component

Add `src/MyWidgetPanel.tsx` and route in `PanelContent.tsx`:

```tsx
case 'mywidget':
  return <MyWidgetPanel panelId={panelId} />
```

Use an exhaustive `default` with `never`.

### 3. Widget picker

`WidgetSelect.tsx` reads `PANEL_CATALOG` — new templates appear automatically in the add menu.

---

## Wire Parquet / live data

### Existing pattern

1. `ParquetDataProvider` in `App.tsx` — global dataset catalog
2. `useWidgetParquetData(panelId, preferredName?)` — per-instance dataset, preview, series, time range
3. `useKpiCardData(panelId)` — KPI-specific: schema + `/kpi` endpoint
4. `WidgetDataPicker` — dataset selection dialog per widget
5. `TimeRangeSelect` or `TimeRangePicker` — `15m | 1h | 6h | 24h | 7d | All`

### Data journey (recommended)

1. **Data source** → set Parquet folder
2. **Data Table** → pick dataset + columns (saves workspace defaults)
3. Add Chart / KPI / Dashboard → inherit or override dataset per widget

### Formatting

| Helper | Use |
|--------|-----|
| `formatTime.ts` | Epoch ms/s → `HH:mm`, `MM/DD HH:mm:ss` |
| `formatCellValue.ts` | Table cells, long id truncation |
| `formatKpi.ts` | KPI value, caption, change % |

---

## Built-in widgets

| Widget | kind | Data hook | Pickers |
|--------|------|-----------|---------|
| Notes | `notes` | `notesStorage` | — |
| Data Table | `data-table` | `useWidgetParquetData` | dataset, columns, time range |
| Chart | `chart` | `useWidgetParquetData` | dataset, time range |
| KPI Card | `kpi-card` | `useKpiCardData` | dataset, metric, agg, range (dropdown) |
| Dashboard | `dashboard` | `useWidgetParquetData` | dataset, time range |
| Reports | `reports` | `useWidgetParquetData` (preview) | dataset, time range; export mock |

### KPI aggregations

`Last | Avg | Sum | Min | Max | Count | Change %` — computed server-side via `GET /api/datasets/{name}/kpi`.

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

## Checklist

- [ ] `PanelKind` union updated in `panels.ts`
- [ ] Entry in `PANEL_CATALOG` with `minW`/`minH`
- [ ] Panel component + `case` in `PanelContent.tsx`
- [ ] shadcn components; no hardcoded colors
- [ ] Per-widget state keyed by `panelId` (instance id)
- [ ] No widget-specific shell chrome in `App.tsx`
