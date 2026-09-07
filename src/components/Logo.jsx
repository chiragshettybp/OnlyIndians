import { cn } from '../lib/utils'

const LOGO_URL = 'https://i.postimg.cc/y8KXrPW8/142a93ed-e483-415f-9944-67aaab00b448.png'

export default function Logo({ size = 34, mono = false, fontSize = 'inherit', className = '', showText = true }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img
        src={LOGO_URL}
        alt="OnlyIndians logo"
        style={{ width: size, height: size }}
        className="shrink-0"
      />
      {showText && (
        <span className="font-bold tracking-tight text-[#1a1c20]" style={{ fontSize: fontSize === 'inherit' ? undefined : fontSize }}>
          Only<span style={{ color: '#004ac6' }}>Indians</span>
        </span>
      )}
    </span>
  )
}