import { useEffect, useRef, useState } from 'react'
import { PANEL_CATALOG } from './panels'

type WidgetSelectProps = {
  activePanelIds: string[]
  onToggle: (panelId: string) => void
}

export function WidgetSelect({ activePanelIds, onToggle }: WidgetSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="dropdown dropdown--multi" ref={rootRef}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-label="Widget seç"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="dropdown-label">Widgets ({activePanelIds.length})</span>
        <span className="dropdown-chevron" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <ul
          className="dropdown-menu"
          role="listbox"
          aria-label="Widget seç"
          aria-multiselectable="true"
        >
          {PANEL_CATALOG.map((panel) => {
            const selected = activePanelIds.includes(panel.id)
            return (
              <li key={panel.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`dropdown-option${selected ? ' is-selected' : ''}`}
                  onClick={() => onToggle(panel.id)}
                >
                  <span className="dropdown-check" aria-hidden>
                    {selected ? '✓' : ''}
                  </span>
                  <span>{panel.title}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
