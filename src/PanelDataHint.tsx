import { useEffect, useState } from 'react'
import { CardDescription } from '@/components/ui/card'
import {
  DATASET_CHANGED_EVENT,
  WIDGET_DATA_CHANGED_EVENT,
  loadWidgetDataset,
  loadWorkspaceDataConfig,
} from '@/datasetStorage'
import type { PanelKind } from '@/panels'

const DATA_PANEL_KINDS = new Set<PanelKind>([
  'chart',
  'dashboard',
  'data-table',
  'reports',
])

function formatDatasetName(name: string) {
  return name.replace(/\.parquet$/i, '')
}

function buildDataHint(panelId: string, kind: PanelKind): string | null {
  if (!DATA_PANEL_KINDS.has(kind)) return null

  const dataset =
    loadWidgetDataset(panelId) ?? loadWorkspaceDataConfig().datasetName
  if (!dataset) return null

  return formatDatasetName(dataset)
}

type PanelDataHintProps = {
  panelId: string
  kind: PanelKind
  fallback?: string
}

export function PanelDataHint({ panelId, kind, fallback }: PanelDataHintProps) {
  const [hint, setHint] = useState(() => buildDataHint(panelId, kind) ?? fallback ?? null)

  useEffect(() => {
    const refresh = () => {
      setHint(buildDataHint(panelId, kind) ?? fallback ?? null)
    }

    refresh()
    window.addEventListener(DATASET_CHANGED_EVENT, refresh)
    window.addEventListener(WIDGET_DATA_CHANGED_EVENT, refresh)
    window.addEventListener('parquet-settings-changed', refresh)

    return () => {
      window.removeEventListener(DATASET_CHANGED_EVENT, refresh)
      window.removeEventListener(WIDGET_DATA_CHANGED_EVENT, refresh)
      window.removeEventListener('parquet-settings-changed', refresh)
    }
  }, [fallback, kind, panelId])

  if (!hint) return null

  return <CardDescription className="truncate text-xs">{hint}</CardDescription>
}
