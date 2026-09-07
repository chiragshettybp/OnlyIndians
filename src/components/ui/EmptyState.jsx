import Button from './Button'
import Icon from './Icon'

export default function EmptyState({ icon = 'inbox', title, body = 'There is nothing here yet.', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-14 px-6">
      <span className="w-16 h-16 rounded-full bg-[#eef0f7] text-[#737686] grid place-items-center mb-1">
        <Icon name={icon} size={30} />
      </span>
      <h3 className="text-headline text-[#1a1c20]">{title}</h3>
      <p className="text-footnote text-[#737686] max-w-[280px]">{body}</p>
      {actionLabel ? (
        <Button variant="primary" size="sm" iconName="add" className="mt-3" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}