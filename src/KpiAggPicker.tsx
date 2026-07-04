import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { KPI_AGG_OPTIONS, type KpiAggregation } from '@/kpiStorage'

type KpiAggPickerProps = {
  selectedAggregation: KpiAggregation
  disabled?: boolean
  onSelect: (aggregation: KpiAggregation) => void
}

export function KpiAggPicker({
  selectedAggregation,
  disabled = false,
  onSelect,
}: KpiAggPickerProps) {
  const label =
    KPI_AGG_OPTIONS.find((option) => option.value === selectedAggregation)?.label ?? 'Agg'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="xs" disabled={disabled}>
          {label}
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuRadioGroup
          value={selectedAggregation}
          onValueChange={(value) => onSelect(value as KpiAggregation)}
        >
          {KPI_AGG_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
