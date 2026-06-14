import type { Layout, LayoutItem, ResponsiveLayouts } from 'react-grid-layout'
import { BREAKPOINT_KEYS, COLS, type BreakpointKey } from './breakpoints'
import {
  DEFAULT_ACTIVE_PANELS,
  PANEL_CATALOG,
  createLayoutItem,
  getPanelById,
} from './panels'

export const WORKSPACE_STORAGE_KEY = 'sirius-terminal-workspace'
const LEGACY_LAYOUT_KEY = 'sirius-terminal-layout'
const LEGACY_LG_COLS = 12
const GRID_SCALE = COLS.lg / LEGACY_LG_COLS

const FALLBACK_GRID = { w: 12, h: 12 } as const

export type WorkspaceState = {
  activePanels: string[]
  layouts: ResponsiveLayouts
}

/** Persisted shape — only lg layout is stored; md/sm are derived on load. */
type StoredWorkspace = {
  activePanels: string[]
  layout: Layout
  gridVersion?: number
}

const CURRENT_GRID_VERSION = 2

function emptyLayouts(): ResponsiveLayouts {
  return Object.fromEntries(
    BREAKPOINT_KEYS.map((bp) => [bp, []]),
  ) as ResponsiveLayouts
}

function migrateFromLegacyCols(layout: Layout): Layout {
  if (layout.length === 0) return layout

  return layout.map((item) => ({
    ...item,
    x: item.x * GRID_SCALE,
    y: item.y * GRID_SCALE,
    w: item.w * GRID_SCALE,
    h: item.h * GRID_SCALE,
    minW: item.minW != null ? item.minW * GRID_SCALE : undefined,
    minH: item.minH != null ? item.minH * GRID_SCALE : undefined,
    maxW: item.maxW != null ? item.maxW * GRID_SCALE : undefined,
    maxH: item.maxH != null ? item.maxH * GRID_SCALE : undefined,
  }))
}

function needsLegacyColMigration(
  layout: Layout,
  gridVersion?: number,
  source: 'workspace' | 'legacy' = 'workspace',
): boolean {
  if (gridVersion === CURRENT_GRID_VERSION) return false
  if (layout.length === 0) return false
  // Already saved on 36-col workspace before gridVersion field existed
  if (source === 'workspace' && gridVersion === undefined) return false
  const maxW = Math.max(...layout.map((item) => item.w))
  return maxW <= LEGACY_LG_COLS
}

function prepareStoredLayout(
  layout: Layout,
  gridVersion?: number,
  source: 'workspace' | 'legacy' = 'workspace',
): Layout {
  if (!needsLegacyColMigration(layout, gridVersion, source)) return layout
  return migrateFromLegacyCols(layout)
}

function attachCatalogConstraints(item: LayoutItem): LayoutItem {
  const panel = getPanelById(item.i)
  if (!panel) return item

  const cols = COLS.lg
  const minW = Math.min(panel.grid.minW ?? 1, cols)
  const minH = panel.grid.minH ?? 1
  const w = Math.min(Math.max(item.w, minW), cols)

  return {
    ...item,
    w,
    x: Math.min(item.x, Math.max(0, cols - w)),
    minW,
    minH,
    maxW: item.maxW ?? panel.grid.maxW,
    maxH: item.maxH ?? panel.grid.maxH,
  }
}

function lgLayoutForPanels(activePanels: string[], lgLayout: Layout): Layout {
  const cols = COLS.lg

  return activePanels.map((id) => {
    const savedItem = lgLayout.find((entry) => entry.i === id)
    if (savedItem) return attachCatalogConstraints(savedItem)

    const panel = getPanelById(id)
    if (!panel) return { i: id, x: 0, y: 0, ...FALLBACK_GRID }
    return { i: panel.id, ...panel.grid, minW: Math.min(panel.grid.minW ?? 1, cols) }
  })
}

/** Stack panels on md/sm using lg visual order (top-to-bottom, left-to-right). */
function buildStackedLayout(
  activePanels: string[],
  lgLayout: Layout,
  breakpoint: BreakpointKey,
): Layout {
  const cols = COLS[breakpoint]
  const ordered = [...activePanels].sort((a, b) => {
    const ia = lgLayout.find((item) => item.i === a)
    const ib = lgLayout.find((item) => item.i === b)
    const ya = ia?.y ?? 0
    const yb = ib?.y ?? 0
    if (ya !== yb) return ya - yb
    return (ia?.x ?? 0) - (ib?.x ?? 0)
  })

  let y = 0
  return ordered.map((id) => {
    const lgItem = lgLayout.find((item) => item.i === id)
    const panel = getPanelById(id)
    const h = lgItem?.h ?? panel?.grid.h ?? FALLBACK_GRID.h
    const item: LayoutItem = {
      i: id,
      x: 0,
      y,
      w: cols,
      h,
      minW: Math.min(panel?.grid.minW ?? 1, cols),
      minH: panel?.grid.minH ?? 1,
    }
    y += h
    return item
  })
}

/** Toggle path — preserve lg geometry; only add/remove items, refresh md/sm. */
function patchWorkspace(activePanels: string[], lgLayout: Layout): WorkspaceState {
  const catalogIds = new Set(PANEL_CATALOG.map((panel) => panel.id))
  const panels = activePanels.filter((id) => catalogIds.has(id))

  if (panels.length === 0) {
    return { activePanels: [], layouts: emptyLayouts() }
  }

  const lg = lgLayoutForPanels(panels, lgLayout)
  return {
    activePanels: panels,
    layouts: {
      lg,
      md: buildStackedLayout(panels, lg, 'md'),
      sm: buildStackedLayout(panels, lg, 'sm'),
    },
  }
}

function buildDefaultWorkspace(): WorkspaceState {
  const activePanels = [...DEFAULT_ACTIVE_PANELS]
  const catalogLayout = activePanels.map((id) => {
    const panel = getPanelById(id)
    return panel ? { i: panel.id, ...panel.grid } : { i: id, x: 0, y: 0, ...FALLBACK_GRID }
  })
  return patchWorkspace(activePanels, catalogLayout)
}

function loadLegacyWorkspace(): WorkspaceState | null {
  try {
    const raw = localStorage.getItem(LEGACY_LAYOUT_KEY)
    if (!raw) return null

    const saved = JSON.parse(raw) as LayoutItem[]
    if (!Array.isArray(saved)) return null

    const activePanels = DEFAULT_ACTIVE_PANELS.filter((id) =>
      saved.some((item) => item.i === id),
    )
    const panels = activePanels.length > 0 ? activePanels : [...DEFAULT_ACTIVE_PANELS]

    return loadStoredWorkspace(
      panels,
      saved.filter((item) => panels.includes(item.i)),
      undefined,
      'legacy',
    )
  } catch {
    return null
  }
}

function loadStoredWorkspace(
  activePanels: string[],
  layout: Layout,
  gridVersion?: number,
  source: 'workspace' | 'legacy' = 'workspace',
): WorkspaceState {
  const migrated = prepareStoredLayout(layout, gridVersion, source)
  const state = patchWorkspace(activePanels, migrated)
  if (
    needsLegacyColMigration(layout, gridVersion, source) ||
    (source === 'workspace' && gridVersion === undefined)
  ) {
    saveWorkspace(state)
  }
  return state
}

export function loadWorkspace(): WorkspaceState {
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Partial<
        StoredWorkspace & WorkspaceState & { layout?: LayoutItem[] }
      >

      if (Array.isArray(data.activePanels)) {
        if (Array.isArray(data.layout)) {
          return loadStoredWorkspace(data.activePanels, data.layout, data.gridVersion)
        }
        if (data.layouts?.lg) {
          return loadStoredWorkspace(data.activePanels, data.layouts.lg, data.gridVersion)
        }
      }
    }
  } catch {
    // fall through
  }

  return loadLegacyWorkspace() ?? buildDefaultWorkspace()
}

export function saveWorkspace(state: WorkspaceState) {
  const payload: StoredWorkspace = {
    activePanels: state.activePanels,
    layout: state.layouts.lg ?? [],
    gridVersion: CURRENT_GRID_VERSION,
  }
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(payload))
}

export function lgLayoutEqual(a: Layout = [], b: Layout = []): boolean {
  if (a.length !== b.length) return false
  const byId = new Map(b.map((item) => [item.i, item]))
  return a.every((item) => {
    const other = byId.get(item.i)
    if (!other) return false
    return (
      item.x === other.x &&
      item.y === other.y &&
      item.w === other.w &&
      item.h === other.h
    )
  })
}

function appendToLg(layout: Layout, panelId: string): Layout {
  const panel = getPanelById(panelId)
  if (!panel) return layout

  const bottom = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0)
  return [...layout, createLayoutItem(panel, bottom)]
}

export function appendPanel(
  state: WorkspaceState,
  panelId: string,
): WorkspaceState | null {
  if (state.activePanels.includes(panelId)) return null
  if (!getPanelById(panelId)) return null

  const lg = appendToLg(state.layouts.lg ?? [], panelId)
  return patchWorkspace([...state.activePanels, panelId], lg)
}

export function removePanel(
  state: WorkspaceState,
  panelId: string,
): WorkspaceState | null {
  if (!state.activePanels.includes(panelId)) return null

  const lg = (state.layouts.lg ?? []).filter((item) => item.i !== panelId)
  return patchWorkspace(
    state.activePanels.filter((id) => id !== panelId),
    lg,
  )
}
