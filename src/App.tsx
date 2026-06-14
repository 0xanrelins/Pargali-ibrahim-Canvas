import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ResponsiveGridLayout,
  getCompactor,
  useContainerWidth,
  type Layout,
  type LayoutItem,
  type ResponsiveLayouts,
} from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './App.css'
import { PanelContent } from './PanelContent'
import { BREAKPOINTS, COLS, ROW_HEIGHT } from './breakpoints'
import {
  appendPanel,
  loadWorkspace,
  removePanel,
  saveWorkspace,
  type WorkspaceState,
} from './layoutStorage'
import { PANEL_CATALOG } from './panels'
import { ThemeSelect } from './ThemeSelect'
import { WidgetSelect } from './WidgetSelect'
import { loadTheme, saveTheme, type Theme } from './themeStorage'

const RESIZE_HANDLES = ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'] as const
const OVERLAP_COMPACTOR = getCompactor(null, true)

function App() {
  const { width, containerRef, mounted } = useContainerWidth()
  const [workspace, setWorkspace] = useState<WorkspaceState>(loadWorkspace)
  const [theme, setTheme] = useState<Theme>(loadTheme)
  const [stackOrder, setStackOrder] = useState<string[]>(
    () => loadWorkspace().activePanels,
  )

  useEffect(() => {
    setStackOrder((prev) => {
      const kept = prev.filter((id) => workspace.activePanels.includes(id))
      const added = workspace.activePanels.filter((id) => !kept.includes(id))
      return [...kept, ...added]
    })
  }, [workspace.activePanels])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  const visiblePanels = useMemo(
    () =>
      workspace.activePanels
        .map((id) => PANEL_CATALOG.find((panel) => panel.id === id))
        .filter((panel): panel is (typeof PANEL_CATALOG)[number] => !!panel),
    [workspace.activePanels],
  )

  const handleLayoutChange = useCallback(
    (_layout: Layout, layouts: ResponsiveLayouts) => {
      setWorkspace((prev) => {
        const next = { ...prev, layouts }
        saveWorkspace(next)
        return next
      })
    },
    [],
  )

  const bringToFront = useCallback((panelId: string) => {
    setStackOrder((prev) => [...prev.filter((id) => id !== panelId), panelId])
  }, [])

  const handleDragStart = useCallback(
    (_layout: Layout, _oldItem: LayoutItem | null, newItem: LayoutItem | null) => {
      if (newItem?.i) bringToFront(newItem.i)
    },
    [bringToFront],
  )

  const handleDragStop = useCallback(
    (_layout: Layout, _oldItem: LayoutItem | null, newItem: LayoutItem | null) => {
      if (newItem?.i) bringToFront(newItem.i)
    },
    [bringToFront],
  )

  const handleResizeStart = useCallback(
    (_layout: Layout, _oldItem: LayoutItem | null, newItem: LayoutItem | null) => {
      if (newItem?.i) bringToFront(newItem.i)
    },
    [bringToFront],
  )

  const handleResizeStop = useCallback(
    (_layout: Layout, _oldItem: LayoutItem | null, newItem: LayoutItem | null) => {
      if (newItem?.i) bringToFront(newItem.i)
    },
    [bringToFront],
  )

  const panelZIndex = useCallback(
    (panelId: string) => {
      const index = stackOrder.indexOf(panelId)
      return index === -1 ? 1 : index + 1
    },
    [stackOrder],
  )

  const handleTogglePanel = useCallback((panelId: string) => {
    setWorkspace((prev) => {
      const next = prev.activePanels.includes(panelId)
        ? removePanel(prev, panelId)
        : appendPanel(prev, panelId)
      if (!next) return prev
      saveWorkspace(next)
      return next
    })
  }, [])

  const handleThemeChange = useCallback((next: Theme) => {
    setTheme(next)
  }, [])

  return (
    <div className="terminal">
      <header className="terminal-header">
        <div className="terminal-header-title">
          <img className="terminal-logo" src="/sirius-logo.png" alt="" width={28} height={24} />
          <h1>Sirius</h1>
        </div>

        <div className="terminal-header-actions">
          <ThemeSelect value={theme} onChange={handleThemeChange} />
          <WidgetSelect
            activePanelIds={workspace.activePanels}
            onToggle={handleTogglePanel}
          />
        </div>
      </header>

      <main ref={containerRef} className="terminal-grid">
        {mounted && width > 0 && visiblePanels.length > 0 && (
          <ResponsiveGridLayout
            layouts={workspace.layouts}
            width={width}
            breakpoints={BREAKPOINTS}
            cols={COLS}
            rowHeight={ROW_HEIGHT}
            margin={[8, 8]}
            compactor={OVERLAP_COMPACTOR}
            dragConfig={{ enabled: true, cancel: '.panel-close' }}
            resizeConfig={{ enabled: true, handles: RESIZE_HANDLES }}
            onLayoutChange={handleLayoutChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
          >
            {visiblePanels.map((panel) => (
              <section
                key={panel.id}
                className="panel"
                style={{ zIndex: panelZIndex(panel.id) }}
              >
                <div className="panel-handle">
                  <div className="panel-handle-left">
                    <span className="panel-title">{panel.title}</span>
                    <span className="panel-hint">{panel.hint}</span>
                  </div>
                  <button
                    type="button"
                    className="panel-close"
                    aria-label={`${panel.title} panelini kapat`}
                    onClick={() => handleTogglePanel(panel.id)}
                  >
                    ×
                  </button>
                </div>
                <div className="panel-body">
                  <PanelContent kind={panel.kind} />
                </div>
              </section>
            ))}
          </ResponsiveGridLayout>
        )}

        {mounted && visiblePanels.length === 0 && (
          <p className="empty-grid">Widget eklemek için üstteki Widgets menüsünü kullan</p>
        )}
      </main>
    </div>
  )
}

export default App
