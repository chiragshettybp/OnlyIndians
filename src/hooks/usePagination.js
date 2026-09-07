import { useCallback, useState } from 'react'

export function usePagination({ pageSize = 10, initialPage = 1 } = {}) {
  const [page, setPage] = useState(initialPage)
  const [total, setTotal] = useState(0)
  const next = useCallback(() => setPage((p) => (page < Math.max(1, Math.ceil(total / pageSize)) ? p + 1 : p)), [page, total, pageSize])
  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), [])
  const go = setPage
  const reset = useCallback(() => setPage(1), [])
  return { page, setPage: go, total, setTotal, next, prev, reset, pageSize }
}

export function pageRange(page, pageCount) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1)
  if (page <= 3) return [1, 2, 3, 4, '…', pageCount]
  if (page >= pageCount - 2) return [1, '…', pageCount - 3, pageCount - 2, pageCount - 1, pageCount]
  return [1, '…', page - 1, page, page + 1, '…', pageCount]
}