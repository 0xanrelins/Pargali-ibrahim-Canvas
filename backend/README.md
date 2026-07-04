# PargalıIbrahim Canvas API

Local FastAPI + DuckDB service for Parquet folders.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/generate_sample.py
```

Sample file is written to `../data/sample/market_ticks.parquet`.

## Run

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

## Configure from UI

1. Start backend (`uvicorn` above)
2. Start frontend (`npm run dev`)
3. Open **Data source** → set Parquet folder to the absolute path of `data/sample`
4. Save folder

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Backend status + folder |
| GET/PUT | `/api/settings` | Read/write parquet folder |
| GET | `/api/datasets` | List `.parquet` files |
| GET | `/api/registry` | List streams with schema + sample rows |
| GET | `/api/datasets/{name}/preview` | Row preview |
| GET | `/api/datasets/{name}/series` | Chart series |

Scans the folder for:

- Root-level `*.parquet` files (e.g. `data/sample`)
- **Streams** — each top-level subfolder with parquet files (`trades`, `prediction_price`, …)

Streams read all nested parquet via `subfolder/**/*.parquet`.

Folder path is stored in `backend/.canvas-state.json` (gitignored).
