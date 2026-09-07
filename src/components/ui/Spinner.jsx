import Icon from './Icon'

export default function Spinner({ label = 'Loading…', size = 22 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#737686]">
      <Icon name="progress_activity" size={size} className="animate-spin text-[#004ac6]" />
      {label ? <span className="text-caption-1">{label}</span> : null}
    </div>
  )
}