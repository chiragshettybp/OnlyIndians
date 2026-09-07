import { useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import Icon from './Icon'

// Accessible accordion. `content` may be a string or React node.
// `single` toggles one-at-a-time when used with default open management.
export default function Accordion({ items = [], single = true, defaultOpen = [], value, onValueChange, className = '' }) {
  const [open, setOpen] = useState(() => (value ? [...(Array.isArray(value) ? value : [])] : defaultOpen))
  const isControlled = value !== undefined
  const openSet = isControlled ? new Set(Array.isArray(value) ? value : []) : new Set(open)
  const listRef = useRef(null)

  const toggle = (itemValue) => {
    const next = new Set(openSet)
    if (next.has(itemValue)) {
      next.delete(itemValue)
    } else {
      if (single) next.clear()
      next.add(itemValue)
    }
    const arr = [...next]
    if (isControlled) onValueChange?.(arr)
    else setOpen(arr)
  }

  const onKeyDown = (e) => {
    const buttons = Array.from(listRef.current?.querySelectorAll('button[role="button"]') ?? [])
    const idx = buttons.indexOf(e.currentTarget)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      buttons[(idx + 1) % buttons.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      buttons[(idx - 1 + buttons.length) % buttons.length]?.focus()
    }
  }

  return (
    <div ref={listRef} className={cn('hairline rounded-2xl overflow-hidden', className)}>
      {items.map((item, i) => {
        const isOpen = openSet.has(item.value)
        const btnId = `acc-btn-${item.value}`
        const panelId = `acc-panel-${item.value}`
        return (
          <div key={item.value} className="bg-white">
            <h3 className="m-0">
              <button
                type="button"
                role="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                id={btnId}
                onClick={() => toggle(item.value)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="inset-row w-full text-left text-subheadline font-semibold text-[#1a1c20] hover:bg-[#f4f5f7] transition-colors"
              >
                <span className="flex items-center gap-3 min-w-0">
                  {item.icon ? <Icon name={item.icon} size={20} className="text-[#004ac6] shrink-0" /> : null}
                  <span>{item.title}</span>
                </span>
                <Icon name="expand_more" size={22} className={cn('text-[#737686] transition-transform duration-300', isOpen && 'rotate-180')} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-footnote text-[#434655] leading-relaxed">{item.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Convenience: pre-open items by URL hash (`#payments`).
export function openByHash(items, hash) {
  if (!hash || !hash.startsWith('#')) return []
  const key = hash.slice(1)
  const match = items.find((it) => it.value === key || it.title.toLowerCase().replace(/\s+/g, '-') === key)
  return match ? [match.value] : []
}

export function toHash(value) {
  return `#${value}`
}