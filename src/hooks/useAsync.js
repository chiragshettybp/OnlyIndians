import { useCallback, useEffect, useRef, useState } from 'react'

// Runs a promise-producing fn; tracks { data, error, loading } and re-runs on dep change.
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const fnRef = useRef(fn)
  fnRef.current = fn

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await fnRef.current()
    setState({ data, error, loading: false })
    return { data, error }
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setState((s) => ({ ...s, loading: true, error: null }))
      const { data, error } = await fnRef.current()
      if (alive) setState({ data, error, loading: false })
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, run }
}

export function useInterval(fn, ms) {
  const saved = useRef(fn)
  saved.current = fn
  useEffect(() => {
    const id = setInterval(() => saved.current(), ms)
    return () => clearInterval(id)
  }, [ms])
}

export function useCountdown(seconds, { onDone } = {}) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    setLeft(seconds)
    const id = setInterval(() => setLeft((s) => {
      if (s <= 1) {
        clearInterval(id)
        onDone?.()
        return 0
      }
      return s - 1
    }), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds])
  return left
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  const set = useCallback((v) => {
    setValue((prev) => {
      const next = typeof v === 'function' ? v(prev) : v
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch { /* ignore */ }
      return next
    })
  }, [key])
  return [value, set]
}