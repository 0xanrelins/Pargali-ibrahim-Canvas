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

export type WorkspaceState = {
  activePanels: string[]
  layouts: ResponsiveLayouts
}

/** Persisted shape — only lg layout is stored; md/sm are derived on load. */
type StoredWorkspace = {
  activePanels: string[]
  layout: Layout
}

function emptyLayouts(): ResponsiveLayouts {
  return Object.fromEntries(
    BREAKPOINT_KEYS.map((bp) => [bp, []]),
  ) as ResponsiveLayouts
}

function mergeLayoutItem(panelId: string, saved?: LayoutItem): LayoutItem {
  const panel = getPanelById(panelId)
  if (!panel) return { i: panelId, x: 0, y: 0, w: 4, h: 4 }
  if (!saved) return { i: panel.id, ...panel.grid }
  return { ...panel.grid, ...saved, i: panel.id, minW: panel.grid.minW, minH: panel.grid.minH }
}

function normalizeLgLayout(activePanels: string[], saved: Layout = []): Layout {
  if (activePanels.length === 0) return []

  const cols = COLS.lg

  return activePanels.map((id) => {
    const savedItem = saved.find((entry) => entry.i === id)
    const panel = getPanelById(id)

    if (savedItem) {
      const merged = mergeLayoutItem(id, savedItem)
      const width = Math.min(merged.w, cols)
      return {
        ...merged,
        w: width,
        x: Math.min(merged.x, Math.max(0, cols - width)),
        minW: Math.min(merged.minW ?? 1, cols),
      }
    }

    if (!panel) return { i: id, x: 0, y: 0, w: 4, h: 4 }
    return { i: panel.id, ...panel.grid }
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
    const h = lgItem?.h ?? panel?.grid.h ?? 4
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

function expandLayouts(activePanels: string[], lgLayout: Layout): ResponsiveLayouts {
  const lg = normalizeLgLayout(activePanels, lgLayout)
  return {
    lg,
    md: buildStackedLayout(activePanels, lg, 'md'),
    sm: buildStackedLayout(activePanels, lg, 'sm'),
  }
}

function buildDefaultWorkspace(): WorkspaceState {
  const activePanels = [...DEFAULT_ACTIVE_PANELS]
  const lg = normalizeLgLayout(
    activePanels,
    activePanels.map((id) => {
      const panel = getPanelById(id)
      return panel ? { i: panel.id, ...panel.grid } : { i: id, x: 0, y: 0, w: 4, h: 4 }
    }),
  )
  return { activePanels, layouts: expandLayouts(activePanels, lg) }
}

function normalizeWorkspace(
  activePanels: string[],
  lgLayout: Layout,
): WorkspaceState {
  const catalogIds = new Set(PANEL_CATALOG.map((panel) => panel.id))
  const panels = activePanels.filter((id) => catalogIds.has(id))

  if (panels.length === 0) {
    return { activePanels: [], layouts: emptyLayouts() }
  }

  return { activePanels: panels, layouts: expandLayouts(panels, lgLayout) }
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

    return normalizeWorkspace(
      panels,
      saved.filter((item) => panels.includes(item.i)),
    )
  } catch {
    return null
  }
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
          return normalizeWorkspace(data.activePanels, data.layout)
        }
        if (data.layouts?.lg) {
          return normalizeWorkspace(data.activePanels, data.layouts.lg)
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
  }
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(payload))
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
  return normalizeWorkspace([...state.activePanels, panelId], lg)
}

export function removePanel(
  state: WorkspaceState,
  panelId: string,
): WorkspaceState | null {
  if (!state.activePanels.includes(panelId)) return null

  const lg = (state.layouts.lg ?? []).filter((item) => item.i !== panelId)
  return normalizeWorkspace(
    state.activePanels.filter((id) => id !== panelId),
    lg,
  )
}
