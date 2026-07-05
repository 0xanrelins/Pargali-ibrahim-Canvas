# Documentation

Guides for building and extending your market research workspace canvas.

## Screenshots

Live Parquet data — KPI cards, chart, data table, notes (Mauve theme):

![Market workspace](./terminal-example.png)

Running locally at `localhost:5173` with the widget picker:

![Canvas live](./terminal-live.png)

## Start here

| Guide | What it covers |
|-------|----------------|
| [../README.md](../README.md) | Product overview, quick start, custom widget path |
| [WIDGET-GUIDE.md](./WIDGET-GUIDE.md) | Add widgets, wire Parquet data, standard widget settings |
| [THEME-GUIDE.md](./THEME-GUIDE.md) | Color themes, shadcn tokens, shell rules |
| [../backend/README.md](../backend/README.md) | FastAPI + DuckDB API, streams, KPI, time range |
| [NEXT-STEPS.md](./NEXT-STEPS.md) | Roadmap — done vs remaining |
| [AGENTS.md](AGENTS.md) | Architecture + AI agent conventions |
| [docs/PRODUCT-POSITIONING.md](docs/PRODUCT-POSITIONING.md) | Product positioning + UX direction |

## Typical workflows

**Load your data**

1. Start backend → `uvicorn app.main:app --reload --port 8000`
2. Start frontend → `npm run dev`
3. **Data source** → absolute path to your Parquet folder → Save
4. Registry refreshes automatically

**Build a workspace**

1. Add a widget: Chart, KPI Card, Data Table, Notes, Dashboard, Reports
2. Open **Configure** for dataset, range, fields, and calculations
3. Drag, resize, stack panels — layout persists in `localStorage`

**Create a widget**

- New widget → `panels.ts` + panel component + `PanelContent.tsx` ([WIDGET-GUIDE](./WIDGET-GUIDE.md))
- New theme → `index.css` + `themeStorage.ts` ([THEME-GUIDE](./THEME-GUIDE.md))
- New API endpoint → `backend/app/` ([backend README](../backend/README.md))

## Widgets at a glance

| Widget | Live data | Notes |
|--------|-----------|-------|
| Data Table | Parquet preview | Column picker, workspace defaults |
| Chart | Line series | Per-widget dataset + time range |
| KPI Card | `/kpi` API | Metric, aggregation, range dropdown |
| Dashboard | KPI + chart + table | Combined panel |
| Reports | Preview tab | Export mock; saved queries planned |
| Notes | localStorage | Markdown edit + preview |

## Data layout

```
your-data-folder/
├── market_ticks.parquet      # flat file dataset
├── trades/                   # stream (nested parquet)
│   └── **/*.parquet
└── prediction_price/
    └── **/*.parquet
```

Streams are auto-discovered as top-level subfolders with parquet files inside.
