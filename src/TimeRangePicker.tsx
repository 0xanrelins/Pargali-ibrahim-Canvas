import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TIME_RANGE_OPTIONS, type TimeRange } from '@/timeRangeStorage'

type TimeRangePickerProps = {
  value: TimeRange
  disabled?: boolean
  onChange: (range: TimeRange) => void
}

export function TimeRangePicker({ value, disabled = false, onChange }: TimeRangePickerProps) {
  const label = TIME_RANGE_OPTIONS.find((option) => option.value === value)?.label ?? value

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="xs" disabled={disabled}>
          {label}
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-28">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as TimeRange)}>
          {TIME_RANGE_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
