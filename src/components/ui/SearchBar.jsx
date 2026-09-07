import { useRef } from 'react'
import { cn } from '../../lib/utils'
import Icon from './Icon'

export default function SearchBar({ value = '', onChange, onSearch, placeholder = 'Search', className = '', icon = 'search' }) {
  const inputRef = useRef(null)
  const submit = (e) => {
    e?.preventDefault()
    onSearch?.(value)
  }
  return (
    <form onSubmit={submit} className={cn('relative w-full', className)}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686] pointer-events-none"><Icon name={icon} size={20} /></span>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="input-field !rounded-full !bg-white !border !border-black/[0.08] !shadow-sm pl-12 pr-24"
        aria-label={placeholder}
      />
      {value ? (
        <button type="button" onClick={() => onChange?.('')} className="absolute right-16 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-full text-[#737686] hover:bg-[#eef0f7]" aria-label="Clear">
          <Icon name="close" size={16} />
        </button>
      ) : null}
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 rounded-full bg-[#004ac6] text-white text-[13px] font-semibold"
        aria-label="Search"
      >
        <span className="md:hidden"><Icon name={icon === 'search' ? 'search' : icon} size={17} /></span>
        <span className="hidden md:inline">Search</span>
      </button>
    </form>
  )
}