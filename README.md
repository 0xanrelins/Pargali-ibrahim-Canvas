# PargalıIbrahim Canvas

Raw trading terminal shell — draggable widget grid, shadcn/ui components, color themes, layout persistence, and a local Parquet data backend. Use it as a starting point for research, analytics, charting, dashboards, trade UI, or bot front-ends.

## Example

Default theme with live Parquet-backed widgets:

![PargalıIbrahim Canvas](docs/terminal-example.png)

## What you get

- **Widget grid** — drag, resize (8 directions), overlap/stack with z-index; multiple instances per widget type
- **Local Parquet backend** — FastAPI + DuckDB; folder or stream datasets (`trades`, `prediction_price`, …)
- **Data widgets** — Data Table, Chart, KPI Card, Dashboard, Reports (preview), Notes
- **Per-widget data binding** — dataset, columns, time range, KPI metric + aggregation
- **5 color themes** — Neutral, Stone, Mauve, Taupe, Olive (shadcn presets)
- **Layout persistence** — workspace saved in `localStorage` (lg breakpoint)

Stack: Vite, React 19, TypeScript, Tailwind v4, shadcn/ui, `react-grid-layout` v2, FastAPI, DuckDB.

## Quick start

### Frontend

```bash
git clone https://github.com/0xanrelins/Pargali-ibrahim-Canvas.git
cd Pargali-ibrahim-Canvas
npm install
npm run dev
```

Open `http://localhost:5173`.

### Backend (Parquet data)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/generate_sample.py   # optional sample data
uvicorn app.main:app --reload --port 8000
```

In the UI: **Data source** → set your Parquet folder path (absolute path to `data/sample` or your own library) → Save.

Vite proxies `/api` to `http://127.0.0.1:8000`. See [backend/README.md](backend/README.md) for API details.

## Customize

| Task | Guide |
|------|-------|
| Add or change widget content | [docs/WIDGET-GUIDE.md](docs/WIDGET-GUIDE.md) |
| Add or change a theme | [docs/THEME-GUIDE.md](docs/THEME-GUIDE.md) |
| Roadmap / next work | [docs/NEXT-STEPS.md](docs/NEXT-STEPS.md) |
| AI / agent context | [AGENTS.md](AGENTS.md) |

## Key files

| File | Role |
|------|------|
| `src/App.tsx` | Shell, grid, header |
| `src/panels.ts` | Widget catalog + instance ids |
| `src/PanelContent.tsx` | Widget body router |
| `src/context/ParquetDataContext.tsx` | Dataset catalog + per-widget loading |
| `src/api/client.ts` | Backend API client |
| `backend/app/` | FastAPI + DuckDB dataset APIs |
| `src/layoutStorage.ts` | Workspace persistence |
| `src/datasetStorage.ts` | Per-widget dataset + workspace column defaults |

## License

MIT — see [LICENSE](LICENSE). Personal and commercial use allowed; no warranty.
