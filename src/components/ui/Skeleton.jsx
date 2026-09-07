import { cn } from '../../lib/utils'

export default function Skeleton({ className = '', circle = false }) {
  return <div className={cn('animate-pulse bg-[#e7e8ee]', circle ? 'rounded-full' : 'rounded-xl', className)} />
}