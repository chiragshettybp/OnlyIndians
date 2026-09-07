import Icon from './Icon'
import { pageRange } from '../../hooks/usePagination'
import { cn } from '../../lib/utils'

export default function Pagination({ page, pageCount, onPage, total }) {
  if (pageCount <= 1) return null
  const pages = pageRange(page, pageCount)
  const base = 'w-9 h-9 rounded-full grid place-items-center text-subheadline transition-colors'
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button className={cn(base, 'text-[#434655] hover:bg-[#eef0f7]', page === 1 && 'opacity-30 pointer-events-none')} onClick={() => onPage(page - 1)} aria-label="Previous page">
        <Icon name="chevron_left" size={18} />
      </button>
      {total != null ? <span className="px-2 text-caption-1 text-[#737686]">{total} items</span> : null}
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="text-caption-1 text-[#737686] px-1">·</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={cn(base, p === page ? 'bg-[#004ac6] text-white font-semibold' : 'text-[#1a1c20] hover:bg-[#eef0f7]')}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
      <button className={cn(base, 'text-[#434655] hover:bg-[#eef0f7]', page === pageCount && 'opacity-30 pointer-events-none')} onClick={() => onPage(page + 1)} aria-label="Next page">
        <Icon name="chevron_right" size={18} />
      </button>
    </div>
  )
}