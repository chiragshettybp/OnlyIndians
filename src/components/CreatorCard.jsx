import { useNavigate } from 'react-router-dom'
import Avatar from './ui/Avatar'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { formatINR } from '../lib/utils'

// Creator discovery card. `creator` is a joined row: profiles.* (+ creator_profiles nested for admins/feed).
export default function CreatorCard({ creator, compact = false, onPress }) {
  const nav = useNavigate()
  const profile = creator?.creator_profiles ?? creator
  const price = profile?.subscription_price ?? 299
  const fans = profile?.fan_count ?? creator?.subscriber_count ?? 0
  const open = () => {
    if (onPress) return onPress(creator)
    nav(`/@${creator.username ?? creator.handle}`)
  }
  if (compact) {
    return (
      <button onClick={open} className="giant-card p-3.5 w-full text-left flex items-center gap-3 transition-transform active:scale-[0.99]">
        <Avatar src={creator?.avatar_url} name={creator?.display_name} size="md" verified />
        <div className="min-w-0 flex-1">
          <p className="text-subheadline text-[#1a1c20] font-semibold truncate">{creator?.display_name}</p>
          <p className="text-caption-1 text-[#737686]">@{creator?.username ?? creator?.handle}</p>
          <p className="text-caption-1 text-[#434655] mt-0.5 flex items-center gap-1">
            <Icon name="verified" size={13} className="text-[#004ac6]" /> {creator?.category ?? creator?.creator_profiles?.category ?? 'Creator'}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-headline text-[#004ac6] font-bold">{formatINR(price)}<span className="text-caption-1 text-[#737686] font-normal">/mo</span></p>
          <p className="text-caption-1 text-[#737686]">{Intl.NumberFormat('en-IN').format(fans)} fans</p>
        </div>
      </button>
    )
  }
  return (
    <div className="giant-card overflow-hidden">
      <div className="h-16 bg-gradient-to-r from-[#002f6c] to-[#004ac6] relative">
        {creator?.banner_url ? <img src={creator.banner_url} alt="" className="w-full h-full object-cover" /> : <div className="absolute -right-3 -top-3 w-24 h-24 rounded-full bg-white/10" />}
      </div>
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-8 mb-2">
          <Avatar src={creator?.avatar_url} name={creator?.display_name} size="lg" verified className="ring-4 ring-white shadow" shape="circle" />
        </div>
        <h3 className="text-headline text-[#1a1c20]">{creator?.display_name}</h3>
        <p className="text-caption-1 text-[#004ac6] font-medium">@{creator?.username ?? creator?.handle}</p>
        <p className="text-footnote text-[#434655] mt-1.5 line-clamp-2 min-h-[36px]">{creator?.bio || 'Verified Indian creator on OnlyIndians.'}</p>
        <div className="flex items-center gap-2 mt-3">
          <Badge tone="brand">@{creator?.username ?? creator?.handle}</Badge>
          <span className="text-caption-1 text-[#737686]">{Intl.NumberFormat('en-IN').format(fans)} fans</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-title-3 text-[#004ac6] font-bold">{formatINR(price)}<span className="text-caption-1 text-[#737686] font-normal"> /month</span></p>
          <Button size="sm" iconName="arrow_forward" onClick={open}>Subscribe</Button>
        </div>
      </div>
    </div>
  )
}