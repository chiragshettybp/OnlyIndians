import { cn } from '../../lib/utils'

export default function Card({ className = '', onPress, ...rest }) {
  const Tag = onPress ? 'button' : 'div'
  return (
    <Tag
      onClick={onPress}
      className={cn('giant-card', onPress && 'text-left w-full transition-transform active:scale-[0.99]', className)}
      {...rest}
    />
  )
}