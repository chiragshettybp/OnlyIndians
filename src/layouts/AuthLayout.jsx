import { Link, Outlet, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/ui/Button'

// Centered card shell used for all login/register/verify/forgot flows (both roles).
export default function AuthLayout({ helpRoute = '/help' }) {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-[#f9f9fe] flex flex-col">
      <header className="sticky top-0 z-40">
        <div className="max-w-[520px] mx-auto flex items-center justify-between px-4 h-14">
          <button onClick={() => nav(-1)} className="w-9 h-9 grid place-items-center rounded-full text-[#434655] hover:bg-[#eef0f7]" aria-label="Back">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <Link to="/" aria-label="OnlyIndians home"><Logo size={28} /></Link>
          <Link to={helpRoute} className="w-9 h-9 grid place-items-center rounded-full text-[#434655] hover:bg-[#eef0f7]" aria-label="Help">
            <span className="material-symbols-outlined">help</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col px-5 py-8">
        <div className="w-full max-w-[420px] mx-auto my-auto">
          <Outlet />
        </div>
      </main>
      <footer className="pb-6 pt-4">
        <p className="text-center text-caption-1 text-[#737686] px-6">
          By continuing you agree to the Terms of Service & Privacy Policy.<br />
          <span className="text-[#434655]">Protected by end-to-end encrypted session keys.</span>
        </p>
      </footer>
    </div>
  )
}

export { Button }