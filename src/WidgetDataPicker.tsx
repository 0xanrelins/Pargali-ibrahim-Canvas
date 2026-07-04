import { useMemo, useState } from 'react'
import { DatabaseIcon } from 'lucide-react'
import type { DatasetSummary } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type WidgetDataPickerProps = {
  datasets: DatasetSummary[]
  selectedName: string | null
  disabled?: boolean
  onSelect: (name: string) => void
}

const searchInputClassName =
  'h-8 w-full rounded-md border border-input bg-input/20 px-2 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30'

function datasetLabel(dataset: DatasetSummary) {
  return dataset.name.replace(/\.parquet$/i, '')
}

function datasetMeta(dataset: DatasetSummary) {
  if (dataset.kind === 'stream') return `${dataset.file_count.toLocaleString()} files`
  return `${dataset.row_count.toLocaleString()} rows`
}

export function WidgetDataPicker({
  datasets,
  selectedName,
  disabled = false,
  onSelect,
}: WidgetDataPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selectedDataset = datasets.find((dataset) => dataset.name === selectedName)
  const visibleDatasets = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return datasets
    return datasets.filter((dataset) => dataset.name.toLowerCase().includes(normalized))
  }, [datasets, query])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="xs" disabled={disabled}>
          <DatabaseIcon data-icon="inline-start" />
          {selectedDataset ? datasetLabel(selectedDataset) : 'Data'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select data</DialogTitle>
          <DialogDescription>Pick a stream or parquet file for this widget.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={searchInputClassName}
            placeholder="Search streams…"
            aria-label="Search datasets"
          />

          <div className="max-h-72 overflow-auto rounded-md ring-1 ring-border/60">
            {visibleDatasets.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">No datasets</p>
            ) : (
              visibleDatasets.map((dataset) => {
                const selected = dataset.name === selectedName
                return (
                  <button
                    key={dataset.name}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-2 py-2 text-left hover:bg-muted/60',
                      selected && 'bg-muted/50',
                    )}
                    onClick={() => {
                      onSelect(dataset.name)
                      setOpen(false)
                    }}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium">
                        {datasetLabel(dataset)}
                      </span>
                      <span className="block truncate text-[0.65rem] text-muted-foreground">
                        {dataset.kind}
                      </span>
                    </span>
                    <Badge variant={selected ? 'secondary' : 'outline'}>{datasetMeta(dataset)}</Badge>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
