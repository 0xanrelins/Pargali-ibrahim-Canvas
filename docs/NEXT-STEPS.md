# Next Steps

## Goal

Make PargalıIbrahim Canvas able to load local/live market data and display it through tables, charts, reports, and dashboards.

## Done

1. Local Python backend — FastAPI, DuckDB, Parquet streams ✅
2. Data source dialog — folder path + registry ✅
3. Widget catalog — Data Table, Chart, KPI, Dashboard, Reports, Notes ✅
4. Per-widget dataset binding + multi-instance widgets ✅
5. Time range filter — `15m | 1h | 6h | 24h | 7d | All` ✅
6. KPI aggregations — Last, Avg, Sum, Min, Max, Count, Change % ✅
7. Timestamp / cell formatters ✅
8. Data Table column picker + workspace defaults ✅

## Remaining

| Priority | Task |
|----------|------|
| 1 | Reports — saved queries + CSV/PDF export (UI mock today) |
| 2 | Backend performance — large stream queries (indexing, caching, file pruning) |
| 3 | WebSocket / live feed (last) |

## Optional polish

- Time range as dropdown on Chart / Table / Dashboard (KPI already uses dropdown)
- OHLC / candlestick chart type
- Global vs per-widget range sync toggle

## First milestone (complete)

Parquet folder path → dataset preview → chart + KPI + table.
