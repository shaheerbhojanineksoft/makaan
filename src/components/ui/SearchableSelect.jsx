import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

/**
 * Filter-friendly searchable select — type to filter, click to pick.
 *
 * @param {{
 *   icon?: import('lucide-react').LucideIcon,
 *   label: string,
 *   value: string,
 *   onChange: (value: string) => void,
 *   options: string[],
 *   placeholder?: string,
 *   emptyLabel?: string,
 *   required?: boolean,
 *   invalid?: boolean,
 *   className?: string,
 * }} props
 */
export default function SearchableSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  emptyLabel = 'All',
  required = false,
  invalid = false,
  className = '',
}) {
  const listId = useId()
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)

  const items = useMemo(() => {
    const base = [{ value: '', label: emptyLabel }, ...options.map((option) => ({ value: option, label: option }))]
    const needle = query.trim().toLowerCase()
    if (!needle) return base
    return base.filter((item) => item.label.toLowerCase().includes(needle))
  }, [emptyLabel, options, query])

  const displayValue = value || emptyLabel

  useEffect(() => {
    if (!open) return undefined

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
        setQuery('')
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setHighlight(0)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  function selectItem(nextValue) {
    onChange(nextValue)
    setOpen(false)
    setQuery('')
  }

  function handleTriggerKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
    }
  }

  function handleListKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight((index) => Math.min(index + 1, Math.max(items.length - 1, 0)))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = items[highlight]
      if (item) selectItem(item.value)
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        className={`flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left shadow-sm transition ring-1 ${
          open
            ? 'ring-2 ring-brand-light/60'
            : invalid
              ? 'ring-rose-300'
              : 'ring-transparent hover:ring-brand/15'
        }`}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />}
        <span
          className={`min-w-0 flex-1 truncate text-sm font-semibold ${
            value ? 'text-slate-800' : 'text-slate-400'
          }`}
        >
          {displayValue}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+0.4rem)] left-0 z-50 w-full min-w-[14rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleListKeyDown}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            className="max-h-56 overflow-y-auto py-1.5"
          >
            {items.length === 0 ? (
              <li className="px-3 py-3 text-sm font-medium text-slate-400">No matches found</li>
            ) : (
              items.map((item, index) => {
                const selected = item.value === value
                const active = index === highlight
                return (
                  <li key={`${item.value || 'all'}-${item.label}`} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(index)}
                      onClick={() => selectItem(item.value)}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-semibold transition ${
                        active ? 'bg-brand-soft text-brand' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {selected && <Check className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
