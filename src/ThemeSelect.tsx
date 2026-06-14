import { useCallback, useEffect, useRef, useState } from 'react'
import { THEME_LABELS, THEMES, type Theme } from './themeStorage'

type ThemeSelectProps = {
  value: Theme
  onChange: (theme: Theme) => void
}

export function ThemeSelect({ value, onChange }: ThemeSelectProps) {
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

  const handleSelect = useCallback(
    (theme: Theme) => {
      onChange(theme)
      setOpen(false)
    },
    [onChange],
  )

  return (
    <div className="dropdown dropdown--single" ref={rootRef}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-label="Tema seç"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="dropdown-label">{THEME_LABELS[value]}</span>
        <span className="dropdown-chevron" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <ul className="dropdown-menu" role="listbox" aria-label="Tema seç">
          {THEMES.map((id) => {
            const selected = id === value
            return (
              <li key={id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`dropdown-option${selected ? ' is-selected' : ''}`}
                  onClick={() => handleSelect(id)}
                >
                  <span className="dropdown-check" aria-hidden>
                    {selected ? '✓' : ''}
                  </span>
                  <span>{THEME_LABELS[id]}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
