import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { NAV_LINKS, MORE_LINKS, BRAND, ROLES } from '../lib/constants'

export default function MarketingLayout() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-[#f9f9fe] flex flex-col">
      <header className="frosted fixed top-0 inset-x-0 z-40" aria-label="Main">
        <div className="max-w-[520px] mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" aria-label="OnlyIndians home"><Logo size={30} /></Link>
          <div className="hidden md:flex items-center gap-5">
            {NAV_LINKS.slice(0, 5).map((l) => (
              <NavLink key={l.route} to={l.route} className={({ isActive }) => `text-subheadline ${isActive ? 'text-[#004ac6] font-semibold' : 'text-[#434655]'}`}>
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => nav(ROLES.subscriber.loginRoute)}>Sign In</Button>
            <Button size="sm" onClick={() => nav(ROLES.subscriber.registerRoute)}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-14 pb-20 md:pb-10">
        <Outlet />
      </main>

      <footer className="border-t border-black/[0.06] bg-white/80 backdrop-blur">
        <div className="max-w-[520px] mx-auto px-4 py-8">
          <nav className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6" aria-label="Footer">
            {[...NAV_LINKS, ...MORE_LINKS].map((l) => (
              <Link key={l.label} to={l.route} className="text-footnote text-[#434655] hover:text-[#004ac6]">{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 mb-3"><Logo size={22} /><span className="text-caption-1 text-[#434655]">© 2026 OnlyIndians Technologies (OPC) Pvt. Ltd.</span></div>
          <p className="text-caption-1 text-[#737686] flex items-center gap-1.5">
            <Icon name="favorite" size={13} className="text-[#004ac6]" /> {BRAND.footer}
          </p>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-[20px] border-t border-black/[0.06] z-40 pb-[env(safe-area-inset-bottom)]" aria-label="Mobile navigation">
        <div className="grid grid-cols-6 h-[60px]">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.route}
              to={l.route}
              className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${isActive ? 'text-[#004ac6]' : 'text-[#737686]'}`}
            >
              <Icon name={l.icon} size={20} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}