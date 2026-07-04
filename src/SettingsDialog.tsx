import { SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { THEME_LABELS, type Theme } from './themeStorage'

type SettingsDialogProps = {
  theme: Theme
}

export function SettingsDialog({ theme }: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Ayarlar">
          <SettingsIcon data-icon="inline-start" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terminal Settings</DialogTitle>
          <DialogDescription>Workspace and appearance options.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 text-xs">
          <p>
            Active theme: <span className="font-medium text-foreground">{THEME_LABELS[theme]}</span>
          </p>
          <p className="text-muted-foreground">More settings coming soon.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
