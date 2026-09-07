import Button from './Button'
import Icon from './Icon'

export default function ErrorState({ title = "Couldn't load this.", message = 'Something went wrong. Try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-14 px-6">
      <span className="w-16 h-16 rounded-full bg-[#ffedec] text-[#ba1a1a] grid place-items-center mb-1">
        <Icon name="error" size={30} />
      </span>
      <h3 className="text-headline text-[#1a1c20]">{title}</h3>
      <p className="text-footnote text-[#737686] max-w-[280px]">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" iconName="refresh" className="mt-3" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  )
}