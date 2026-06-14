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
    grid: { x: 0, y: 0, w: 12, h: 12, minW: 12, minH: 12 },
  },
  {
    id: 'orderbook',
    title: 'Order Book',
    hint: 'Bids / Asks',
    kind: 'orderbook',
    grid: { x: 12, y: 0, w: 9, h: 9, minW: 9, minH: 9 },
  },
  {
    id: 'positions',
    title: 'Positions',
    hint: 'Open trades',
    kind: 'positions',
    grid: { x: 21, y: 0, w: 6, h: 6, minW: 6, minH: 6 },
  },
  {
    id: 'watchlist',
    title: 'Watchlist',
    hint: 'Symbols',
    kind: 'watchlist',
    grid: { x: 0, y: 12, w: 6, h: 6, minW: 6, minH: 6 },
  },
  {
    id: 'trades',
    title: 'Recent Trades',
    hint: 'Live feed',
    kind: 'trades',
    grid: { x: 0, y: 0, w: 6, h: 6, minW: 6, minH: 6 },
  },
  {
    id: 'ticker',
    title: 'Ticker',
    hint: 'Market stats',
    kind: 'ticker',
    grid: { x: 0, y: 0, w: 3, h: 3, minW: 3, minH: 3 },
  },
]

export const DEFAULT_ACTIVE_PANELS = ['chart', 'orderbook', 'positions', 'watchlist']

export function getPanelById(id: string) {
  return PANEL_CATALOG.find((panel) => panel.id === id)
}

export function createLayoutItem(panel: PanelDef, y: number): LayoutItem {
  const { minW = 1, minH = 1, maxW, maxH, x } = panel.grid
  return {
    i: panel.id,
    x,
    y,
    w: minW,
    h: minH,
    minW,
    minH,
    maxW,
    maxH,
  }
}
