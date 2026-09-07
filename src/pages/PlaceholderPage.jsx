import { useLocation } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Logo from '../components/Logo'

// Fallback rendered by the router shell until agents implement the real page from /stitch-designs.
export default function PlaceholderPage({ name }) {
  const location = useLocation()
  return (
    <div className="flex flex-col items-center text-center gap-3 py-16 px-6">
      <Logo size={40} />
      <div className="w-14 h-14 rounded-2xl bg-[#eef0f7] text-[#737686] grid place-items-center">
        <Icon name="construction" size={26} />
      </div>
      <h1 className="text-title-2 text-[#1a1c20]">{name ?? 'Screen in progress'}</h1>
      <p className="text-footnote text-[#737686] max-w-[300px]">
        Route <code className="px-1.5 py-0.5 rounded-md bg-[#eef0f7] text-[#004ac6] text-[12px]">{location.pathname}</code> is
        reserved in the router shell. The page will be implemented from the matching /stitch-designs screen.
      </p>
    </div>
  )
}