import { ClockIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TIME_RANGE_OPTIONS, type TimeRange } from '@/timeRangeStorage'

type TimeRangeSelectProps = {
  value: TimeRange
  disabled?: boolean
  onChange: (range: TimeRange) => void
  className?: string
}

export function TimeRangeSelect({
  value,
  disabled = false,
  onChange,
  className,
}: TimeRangeSelectProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      <ClockIcon className="text-muted-foreground" />
      {TIME_RANGE_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? 'default' : 'outline'}
          size="xs"
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
