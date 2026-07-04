# Next Steps

## Goal

Make PargalıIbrahim Canvas able to load local/live market data and display it through tables, charts, reports, and dashboards.

## Short Plan

1. Add a local Python backend with FastAPI, DuckDB, and Parquet support. ✅
2. Let the UI accept a local Parquet folder path. ✅
3. Scan datasets and expose schema, row count, and preview data. ✅
4. Wire data table and chart widgets to backend preview/series. ✅
5. Add dashboard widget (shadcn dashboard-01 pattern on grid). ✅
6. Add reports widget — library, preview, recent runs (mock). ✅
7. Wire reports saved queries and export.
8. Add WebSocket/live data support (last).

## First Milestone

Parquet folder path -> dataset preview -> basic chart.
