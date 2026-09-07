import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import Icon from './Icon'

export default function Modal({ open = false, onClose, title, children, sheet = false, width = 420 }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-[fadeIn_.2s]" onClick={onClose} />
      <div
        className={cn(
          'relative bg-white animate-[slideUp_.28s_ease] shadow-2xl',
          sheet ? 'w-full max-w-[560px] rounded-t-3xl' : 'rounded-3xl w-full',
          !sheet && 'mx-5'
        )}
        style={{ maxWidth: width }}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-black/[0.06]">
          <h3 className="text-headline text-[#1a1c20]">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full hover:bg-[#eef0f7] text-[#434655]" aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="p-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  )
}