import Skeleton from './Skeleton'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

// Minimal responsive table. Rendering is fully delegated to `columns`.
export default function DataTable({ columns = [], rows = [], keyFn, loading = false, empty, error, sticky = true }) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }
  if (error) return <ErrorState message={error.message} onRetry={error.onRetry} />
  if (!rows.length) return <EmptyState {...empty} />

  return (
    <div className="giant-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left" aria-label="Data table">
          <thead className={sticky ? 'sticky top-0 z-10' : ''}>
            <tr className="bg-[#f4f5f7]">
              {columns.map((c, i) => (
                <th key={c.key ?? i} className="px-4 py-3 text-caption-1 font-semibold text-[#434655] whitespace-nowrap" style={c.width ? { width: c.width } : undefined}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="hairline">
            {rows.map((row, i) => {
              const rid = keyFn ? keyFn(row) : i
              return (
                <tr key={rid} className="bg-white">
                  {columns.map((c, j) => (
                    <td key={c.key ?? j} className="px-4 py-3 text-subheadline text-[#1a1c20] align-middle">
                      {(c.cell ? c.cell(row) : c.value ? row[c.value] : '') ?? '—'}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}