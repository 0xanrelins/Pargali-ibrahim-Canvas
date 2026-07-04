import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type KpiMetricPickerProps = {
  columns: string[]
  selectedColumn: string | null
  disabled?: boolean
  onSelect: (column: string) => void
}

export function KpiMetricPicker({
  columns,
  selectedColumn,
  disabled = false,
  onSelect,
}: KpiMetricPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="xs" disabled={disabled}>
          {selectedColumn ?? 'Metric'}
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-72 min-w-36 overflow-auto">
        <DropdownMenuRadioGroup
          value={selectedColumn ?? undefined}
          onValueChange={onSelect}
        >
          {columns.map((column) => (
            <DropdownMenuRadioItem key={column} value={column}>
              {column}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
