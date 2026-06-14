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

function emptyLayouts(): ResponsiveLayouts {
  return Object.fromEntries(
    BREAKPOINT_KEYS.map((bp) => [bp, []]),
  ) as ResponsiveLayouts
}

function buildLayoutForBreakpoint(
  activePanels: string[],
  breakpoint: BreakpointKey,
): Layout {
  const cols = COLS[breakpoint]
  let y = 0

  return activePanels.map((id) => {
    const panel = getPanelById(id)
    if (!panel) return { i: id, x: 0, y, w: cols, h: 4 }

    if (breakpoint === 'lg') {
      return { i: panel.id, ...panel.grid }
    }

    const item: LayoutItem = {
      i: panel.id,
      x: 0,
      y,
      w: cols,
      h: panel.grid.h,
      minW: Math.min(panel.grid.minW ?? 2, cols),
      minH: panel.grid.minH,
    }
    y += item.h
    return item
  })
}

function buildDefaultWorkspace(): WorkspaceState {
  const activePanels = [...DEFAULT_ACTIVE_PANELS]
  const layouts = Object.fromEntries(
    BREAKPOINT_KEYS.map((bp) => [
      bp,
      buildLayoutForBreakpoint(activePanels, bp),
    ]),
  ) as ResponsiveLayouts

  return { activePanels, layouts }
}

function mergeLayoutItem(panelId: string, saved?: LayoutItem): LayoutItem {
  const panel = getPanelById(panelId)
  if (!panel) return { i: panelId, x: 0, y: 0, w: 4, h: 4 }
  if (!saved) return { i: panel.id, ...panel.grid }
  return { ...panel.grid, ...saved, i: panel.id }
}

function normalizeBreakpointLayout(
  activePanels: string[],
  breakpoint: BreakpointKey,
  saved: Layout = [],
): Layout {
  if (activePanels.length === 0) return []

  const cols = COLS[breakpoint]
  let stackY = 0

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
        minW: Math.min(merged.minW ?? 2, cols),
      }
    }

    if (!panel) return { i: id, x: 0, y: stackY, w: cols, h: 4 }

    if (breakpoint === 'lg') {
      return { i: panel.id, ...panel.grid }
    }

    const item: LayoutItem = {
      i: panel.id,
      x: 0,
      y: stackY,
      w: cols,
      h: panel.grid.h,
      minW: Math.min(panel.grid.minW ?? 2, cols),
      minH: panel.grid.minH,
    }
    stackY += item.h
    return item
  })
}

function normalizeWorkspace(
  activePanels: string[],
  layouts: Partial<ResponsiveLayouts>,
): WorkspaceState {
  const catalogIds = new Set(PANEL_CATALOG.map((panel) => panel.id))
  const panels = activePanels.filter((id) => catalogIds.has(id))

  if (panels.length === 0) {
    return { activePanels: [], layouts: emptyLayouts() }
  }

  const normalized = Object.fromEntries(
    BREAKPOINT_KEYS.map((bp) => [
      bp,
      normalizeBreakpointLayout(panels, bp, layouts[bp]),
    ]),
  ) as ResponsiveLayouts

  return { activePanels: panels, layouts: normalized }
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

    return normalizeWorkspace(panels, { lg: saved.filter((item) => panels.includes(item.i)) })
  } catch {
    return null
  }
}

function migrateSingleLayout(
  activePanels: string[],
  layout: LayoutItem[],
): WorkspaceState {
  return normalizeWorkspace(activePanels, { lg: layout })
}

export function loadWorkspace(): WorkspaceState {
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as Partial<
        WorkspaceState & { layout?: LayoutItem[] }
      >

      if (Array.isArray(data.activePanels)) {
        if (data.layouts) {
          return normalizeWorkspace(data.activePanels, data.layouts)
        }
        if (Array.isArray(data.layout)) {
          return migrateSingleLayout(data.activePanels, data.layout)
        }
      }
    }
  } catch {
    // fall through
  }

  return loadLegacyWorkspace() ?? buildDefaultWorkspace()
}

export function saveWorkspace(state: WorkspaceState) {
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(state))
}

function appendToBreakpoint(
  layout: Layout,
  panelId: string,
  breakpoint: BreakpointKey,
): Layout {
  const panel = getPanelById(panelId)
  if (!panel) return layout

  const bottom = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0)
  const cols = COLS[breakpoint]

  const item =
    breakpoint === 'lg'
      ? createLayoutItem(panel, bottom)
      : {
          i: panel.id,
          x: 0,
          y: bottom,
          w: cols,
          h: panel.grid.h,
          minW: Math.min(panel.grid.minW ?? 2, cols),
          minH: panel.grid.minH,
        }

  return [...layout, item]
}

export function appendPanel(
  state: WorkspaceState,
  panelId: string,
): WorkspaceState | null {
  if (state.activePanels.includes(panelId)) return null
  if (!getPanelById(panelId)) return null

  const layouts = Object.fromEntries(
    BREAKPOINT_KEYS.map((bp) => [
      bp,
      appendToBreakpoint(state.layouts[bp] ?? [], panelId, bp),
    ]),
  ) as ResponsiveLayouts

  return normalizeWorkspace([...state.activePanels, panelId], layouts)
}

export function removePanel(
  state: WorkspaceState,
  panelId: string,
): WorkspaceState | null {
  if (!state.activePanels.includes(panelId)) return null

  const layouts = Object.fromEntries(
    BREAKPOINT_KEYS.map((bp) => [
      bp,
      (state.layouts[bp] ?? []).filter((item) => item.i !== panelId),
    ]),
  ) as ResponsiveLayouts

  return normalizeWorkspace(
    state.activePanels.filter((id) => id !== panelId),
    layouts,
  )
}
