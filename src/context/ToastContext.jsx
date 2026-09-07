import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

let seed = 0
const VIEW_MS = 3600

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback((kind, title, body, opts = {}) => {
    const id = ++seed
    const toast = { id, kind: kind === 'error' ? 'error' : kind === 'success' ? 'success' : 'info', title, body, duration: opts.duration ?? VIEW_MS }
    setToasts((t) => [...t, toast])
    if (toast.duration !== Infinity) {
      timers.current[id] = setTimeout(() => dismiss(id), toast.duration)
    }
    return id
  }, [dismiss])

  const api = useMemo(() => ({
    push,
    dismiss,
    success: (title, body, opts) => push('success', title, body, opts),
    error: (title, body, opts) => push('error', title, body, opts),
    info: (title, body, opts) => push('info', title, body, opts)
  }), [push, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kind}`} role="status" onClick={() => dismiss(t.id)}>
            <span className="material-symbols-outlined toast-icon">
              {t.kind === 'success' ? 'check_circle' : t.kind === 'error' ? 'error' : 'info'}
            </span>
            <div className="toast-copy">
              <strong>{t.title}</strong>
              {t.body ? <span>{t.body}</span> : null}
            </div>
            <span className="material-symbols-outlined toast-close">close</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}