import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ResponsiveGridLayout,
  noCompactor,
  useContainerWidth,
  type Layout,
  type ResponsiveLayouts,
} from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './App.css'
import { PanelContent } from './PanelContent'
import { BREAKPOINTS, COLS } from './breakpoints'
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

function App() {
  const { width, containerRef, mounted } = useContainerWidth()
  const [workspace, setWorkspace] = useState<WorkspaceState>(loadWorkspace)
  const [theme, setTheme] = useState<Theme>(loadTheme)

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
            rowHeight={32}
            margin={[8, 8]}
            compactor={noCompactor}
            dragConfig={{ enabled: true, cancel: '.panel-close' }}
            resizeConfig={{ enabled: true, handles: RESIZE_HANDLES }}
            onLayoutChange={handleLayoutChange}
          >
            {visiblePanels.map((panel) => (
              <section key={panel.id} className="panel">
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
