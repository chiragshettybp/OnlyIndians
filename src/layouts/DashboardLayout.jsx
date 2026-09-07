import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/ui/Icon'
import Avatar from '../components/ui/Avatar'
import Logo from '../components/Logo'
import { SUBSCRIBER_TABS, CREATOR_TABS, ADMIN_TABS, ROLES } from '../lib/constants'
import { cn } from '../lib/utils'

// Role-parameterized portal shell. `role` must be subscriber | creator | admin.
export default function DashboardLayout({ role }) {
  const { profile, displayName, signOut } = useAuth()
  const nav = useNavigate()
  const tabs = role === 'creator' ? CREATOR_TABS : role === 'admin' ? ADMIN_TABS : SUBSCRIBER_TABS
  const cfg = ROLES[role]

  return (
    <div className="min-h-screen bg-[#f9f9fe] flex">
      {/* Sidebar rails */}
      <aside className="hidden lg:flex flex-col w-[248px] shrink-0 bg-white border-r border-black/[0.06] sticky top-0 h-screen">
        <div className="px-5 h-16 flex items-center border-b border-black/[0.06]">
          <Link to="/"><Logo size={28} /></Link>
          <span className="ml-auto text-caption-2 px-2 py-0.5 rounded-full bg-[#d7e3ff] text-[#002f6c] font-semibold uppercase">{cfg.label}</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {tabs.map((t) => (
            <NavLink
              key={t.route}
              to={t.route}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 h-11 rounded-xl text-subheadline transition-colors',
                isActive ? 'bg-[#d7e3ff] text-[#004ac6] font-semibold' : 'text-[#434655] hover:bg-[#eef0f7]'
              )}
            >
              <Icon name={t.icon} size={20} />
              {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-black/[0.06]">
          <button onClick={signOut} className="flex items-center gap-3 w-full px-3 h-11 rounded-xl text-subheadline text-[#ba1a1a] hover:bg-[#ffedec]">
            <Icon name="logout" size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 min-w-0 flex flex-col pb-[68px] lg:pb-0">
        <header className="lg:hidden frosted sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 h-14">
            <Link to="/"><Logo size={28} /></Link>
            <button onClick={() => nav(`/${role}/settings`)} className="relative" aria-label="Account">
              <Avatar src={profile?.avatar_url} name={displayName} size="sm" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00a794] border-2 border-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 py-5 lg:px-8 lg:py-8">
          <div className="max-w-[760px] mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="hidden lg:block px-8 pb-6 text-caption-1 text-[#737686]">
          {role === 'creator' ? 'Creator Payouts run daily at 9:00 AM IST (T+1).' : role === 'admin' ? 'Admin actions are audited and reversible.' : 'Manage your subs from one place.'}
        </footer>
      </div>

      {/* Mobile tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-[20px] border-t border-black/[0.06] z-40 pb-[env(safe-area-inset-bottom)]" aria-label={`${cfg.label} navigation`}>
        <div className="grid grid-cols-5 h-[60px]">
          {tabs.map((t) => (
            <NavLink
              key={t.route}
              to={t.route}
              className={({ isActive }) => `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${isActive ? 'text-[#004ac6]' : 'text-[#737686]'}`}
            >
              <Icon name={t.icon} size={20} />
              <span>{t.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export { useAuth }