import type { LayoutItem } from 'react-grid-layout'

type PanelGrid = Pick<
  LayoutItem,
  'x' | 'y' | 'w' | 'h' | 'minW' | 'minH' | 'maxW' | 'maxH'
>

export type PanelKind =
  | 'chart'
  | 'orderbook'
  | 'positions'
  | 'watchlist'
  | 'trades'
  | 'ticker'

export type PanelDef = {
  id: string
  title: string
  hint: string
  kind: PanelKind
  grid: PanelGrid
}

export const PANEL_CATALOG: PanelDef[] = [
  {
    id: 'chart',
    title: 'Chart',
    hint: 'BTC/USDT · 1h',
    kind: 'chart',
    grid: { x: 0, y: 0, w: 8, h: 10, minW: 4, minH: 4 },
  },
  {
    id: 'orderbook',
    title: 'Order Book',
    hint: 'Bids / Asks',
    kind: 'orderbook',
    grid: { x: 8, y: 0, w: 4, h: 6, minW: 3, minH: 3 },
  },
  {
    id: 'positions',
    title: 'Positions',
    hint: 'Open trades',
    kind: 'positions',
    grid: { x: 8, y: 6, w: 4, h: 4, minW: 2, minH: 2 },
  },
  {
    id: 'watchlist',
    title: 'Watchlist',
    hint: 'Symbols',
    kind: 'watchlist',
    grid: { x: 0, y: 10, w: 12, h: 3, minW: 2, minH: 2 },
  },
  {
    id: 'trades',
    title: 'Recent Trades',
    hint: 'Live feed',
    kind: 'trades',
    grid: { x: 0, y: 13, w: 6, h: 4, minW: 2, minH: 2 },
  },
  {
    id: 'ticker',
    title: 'Ticker',
    hint: 'Market stats',
    kind: 'ticker',
    grid: { x: 6, y: 13, w: 6, h: 4, minW: 1, minH: 1 },
  },
]

export const DEFAULT_ACTIVE_PANELS = ['chart', 'orderbook', 'positions', 'watchlist']

export function getPanelById(id: string) {
  return PANEL_CATALOG.find((panel) => panel.id === id)
}

export function createLayoutItem(panel: PanelDef, y: number): LayoutItem {
  return {
    i: panel.id,
    x: panel.grid.x,
    y,
    w: panel.grid.w,
    h: panel.grid.h,
    minW: panel.grid.minW,
    minH: panel.grid.minH,
    maxW: panel.grid.maxW,
    maxH: panel.grid.maxH,
  }
}
