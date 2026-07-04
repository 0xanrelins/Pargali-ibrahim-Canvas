import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PANEL_CATALOG } from './panels'

type WidgetSelectProps = {
  activePanelIds: string[]
  onToggle: (panelId: string) => void
}

export function WidgetSelect({ activePanelIds, onToggle }: WidgetSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Widget seç">
          Widgets ({activePanelIds.length})
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {PANEL_CATALOG.map((panel) => (
          <DropdownMenuCheckboxItem
            key={panel.id}
            checked={activePanelIds.includes(panel.id)}
            onCheckedChange={() => onToggle(panel.id)}
          >
            {panel.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
