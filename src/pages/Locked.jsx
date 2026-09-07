import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

// Standalone notice for banned/suspended/deleted accounts (rendered by
// RequireRole when the profile lifecycle flags are set).
export default function Locked() {
  usePageTitle('Account Locked')
  return (
    <div className="min-h-screen bg-[#f9f9fe] grid place-items-center px-6">
      <div className="w-full max-w-[420px] flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-[#ffedec] grid place-items-center text-[#ba1a1a]">
          <Icon name="lock" size={32} fill />
        </div>
        <div>
          <h1 className="text-title-1 font-bold text-[#1a1c20]">Account Locked</h1>
          <p className="text-footnote text-[#434655] mt-2 leading-relaxed">
            This account is no longer active on OnlyIndians. If you believe this is a mistake,
            reach out from the contact page below.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button block variant="outline" onClick={() => { window.location.href = '/contact' }}>Contact Support</Button>
          <Link to="/" className="text-caption-1 text-[#737686] underline text-center">Back to OnlyIndians home</Link>
        </div>
      </div>
    </div>
  )
}