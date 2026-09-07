import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import Icon from './Icon'

export default function Dropdown({ trigger, children, align = 'right', width = 200 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open ? (
        <div
          className={cn(
            'absolute z-30 mt-1.5 bg-white rounded-2xl border border-black/[0.06] shadow-xl py-1.5 animate-[fadeIn_.15s]',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          style={{ width }}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export function MenuItem({ icon, label, onPress, tone = 'default', close }) {
  return (
    <button
      onClick={() => {
        onPress?.()
        close?.()
      }}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-subheadline text-left hover:bg-[#eef0f7] transition-colors',
        tone === 'danger' && 'text-[#ba1a1a]'
      )}
    >
      <Icon name={icon} size={18} className={tone === 'danger' ? 'text-[#ba1a1a]' : 'text-[#434655]'} />
      {label}
    </button>
  )
}

export function MenuDivider() {
  return <div className="h-px bg-black/[0.06] my-1.5" />
}