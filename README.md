# PargalıIbrahim Canvas

Raw trading terminal shell — draggable widget grid, shadcn/ui components, color themes, and layout persistence. No live data, no exchange integration. Use it as a starting point for your own research, analytics, charting, table dashboards, trade UI, or bot front-end.

## Example

Default theme with the Data Table widget — placeholder preview rows, ready to connect to Parquet or live feeds:

![PargalıIbrahim Canvas](docs/terminal-example.png)

## What you get

- **Widget grid** — drag, resize (8 directions), overlap/stack with z-index
- **Data Table widget** — shadcn table for Parquet/query preview (more widgets added incrementally)
- **5 color themes** — Neutral, Stone, Mauve, Taupe, Olive (shadcn presets)
- **shadcn/ui shell** — Card panels, DropdownMenu, Table, Dialog
- **Layout persistence** — workspace saved in `localStorage` (lg breakpoint)
- **Responsive** — lg / md / sm breakpoints; md/sm auto-stack from lg order

Stack: Vite, React 19, TypeScript, Tailwind v4, shadcn/ui, `react-grid-layout` v2.

## Quick start

```bash
git clone https://github.com/0xanrelins/Pargali-ibrahim-Canvas.git
cd Pargali-ibrahim-Canvas
npm install
npm run dev
```

Open `http://localhost:5173`. Pick theme and widgets from the header dropdowns.

## Customize

| Task | Guide |
|------|-------|
| Add or change widget content | [docs/WIDGET-GUIDE.md](docs/WIDGET-GUIDE.md) |
| Add or change a theme | [docs/THEME-GUIDE.md](docs/THEME-GUIDE.md) |
| AI / agent context | [AGENTS.md](AGENTS.md) |

Typical workflow:

1. Wire real data (WebSocket, REST) into `PanelContent.tsx` per widget `kind`
2. Add widgets in `src/panels.ts` and new `case` branches in `PanelContent.tsx`
3. Add shadcn components with `npx shadcn@latest add <component>`
4. Add color themes in `src/index.css` + `src/themeStorage.ts`
5. Rebrand header logo/text in `src/App.tsx` and `public/`

## Key files

| File | Role |
|------|------|
| `src/App.tsx` | Shell, grid, header |
| `src/panels.ts` | Widget catalog, min sizes, default layout |
| `src/PanelContent.tsx` | Widget body (replace placeholders with your data) |
| `src/layoutStorage.ts` | Workspace persistence |
| `src/themeStorage.ts` | Theme IDs + localStorage |
| `src/index.css` | shadcn theme CSS variables |
| `src/App.css` | Grid/resize overrides |
| `src/components/ui/` | shadcn components |
| `components.json` | shadcn config |

## License

MIT — see [LICENSE](LICENSE). Personal and commercial use allowed; no warranty.
