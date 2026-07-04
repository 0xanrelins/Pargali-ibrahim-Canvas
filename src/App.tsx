import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ResponsiveGridLayout,
  getCompactor,
  useContainerWidth,
  type Layout,
  type LayoutItem,
  type ResponsiveLayouts,
} from 'react-grid-layout'
import { XIcon } from 'lucide-react'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './App.css'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PanelContent } from './PanelContent'
import { BREAKPOINTS, COLS, ROW_HEIGHT, breakpointFromWidth } from './breakpoints'
import {
  appendPanel,
  lgLayoutEqual,
  loadWorkspace,
  removePanel,
  saveWorkspace,
  type WorkspaceState,
} from './layoutStorage'
import { PANEL_CATALOG } from './panels'
import { SettingsDialog } from './SettingsDialog'
import { ThemeSelect } from './ThemeSelect'
import { WidgetSelect } from './WidgetSelect'
import { applyTheme, loadTheme, saveTheme, type Theme } from './themeStorage'

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
    applyTheme(theme)
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
        const nextLg = layouts.lg ?? []
        if (lgLayoutEqual(prev.layouts.lg, nextLg)) return prev
        return { ...prev, layouts }
      })
    },
    [],
  )

  const persistLayoutInteraction = useCallback(
    (layout: Layout) => {
      setWorkspace((prev) => {
        const bp = breakpointFromWidth(width)
        const next: WorkspaceState = {
          ...prev,
          layouts: { ...prev.layouts, [bp]: layout },
        }
        saveWorkspace(next)
        return next
      })
    },
    [width],
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
    (layout: Layout, _oldItem: LayoutItem | null, newItem: LayoutItem | null) => {
      if (newItem?.i) bringToFront(newItem.i)
      persistLayoutInteraction(layout)
    },
    [bringToFront, persistLayoutInteraction],
  )

  const handleResizeStart = useCallback(
    (_layout: Layout, _oldItem: LayoutItem | null, newItem: LayoutItem | null) => {
      if (newItem?.i) bringToFront(newItem.i)
    },
    [bringToFront],
  )

  const handleResizeStop = useCallback(
    (layout: Layout, _oldItem: LayoutItem | null, newItem: LayoutItem | null) => {
      if (newItem?.i) bringToFront(newItem.i)
      persistLayoutInteraction(layout)
    },
    [bringToFront, persistLayoutInteraction],
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
    <div className="flex h-screen min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 px-3 py-2">
        <div className="flex items-center gap-2 pl-[5ch]">
          <img
            className="block h-7 w-7 shrink-0"
            src="/ibrahim-emoji-preview.png"
            alt=""
            width={28}
            height={28}
          />
          <h1 className="m-0 text-[0.95rem] font-semibold tracking-wide text-muted-foreground">
            PargalıIbrahim
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <ThemeSelect value={theme} onChange={handleThemeChange} />
          <WidgetSelect
            activePanelIds={workspace.activePanels}
            onToggle={handleTogglePanel}
          />
          <SettingsDialog theme={theme} />
        </div>
      </header>

      <main ref={containerRef} className="min-h-0 flex-1 overflow-auto p-1.5">
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
              <Card
                key={panel.id}
                size="sm"
                className="group/panel h-full cursor-grab gap-0 py-0 active:cursor-grabbing"
                style={{ zIndex: panelZIndex(panel.id) }}
              >
                <CardHeader className="pointer-events-none gap-0 px-2 pb-1 pt-1.5">
                  <div className="pointer-events-auto flex min-w-0 flex-1 items-center justify-between gap-2">
                    <CardTitle className="text-xs font-semibold">{panel.title}</CardTitle>
                    <CardDescription className="text-xs">{panel.hint}</CardDescription>
                  </div>
                  <CardAction className="pointer-events-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="panel-close opacity-0 transition-opacity group-hover/panel:opacity-100"
                      aria-label={`${panel.title} panelini kapat`}
                      onClick={() => handleTogglePanel(panel.id)}
                    >
                      <XIcon />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="panel-body min-h-0 flex-1 overflow-auto px-2 pb-2 pt-0">
                  <PanelContent kind={panel.kind} />
                </CardContent>
              </Card>
            ))}
          </ResponsiveGridLayout>
        )}

        {mounted && visiblePanels.length === 0 && (
          <p className="mx-auto my-8 text-center text-sm text-muted-foreground">
            Widget eklemek için üstteki Widgets menüsünü kullan
          </p>
        )}
      </main>
    </div>
  )
}

export default App
