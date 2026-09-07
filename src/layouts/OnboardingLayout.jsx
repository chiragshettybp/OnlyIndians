import { Link, Outlet, useLocation } from 'react-router-dom'
import ProgressBar from '../components/ui/ProgressBar'
import { SUBSCRIBER_STEP_BY_ROUTE, CREATOR_STEP_BY_ROUTE, SUBSCRIBER_STEPS, CREATOR_STEPS } from '../lib/constants'

// "Step X of 5" onboarding shell. Route path determines progress for either role.
export default function OnboardingLayout({ role }) {
  const { pathname } = useLocation()
  const isCreator = role === 'creator'
  const steps = isCreator ? CREATOR_STEPS : SUBSCRIBER_STEPS
  const map = isCreator ? CREATOR_STEP_BY_ROUTE : SUBSCRIBER_STEP_BY_ROUTE
  const current = map[pathname.replace(/\/$/, '')]
  const index = current ? steps.findIndex((s) => s.id === current.id) : -1
  const pct = index >= 0 ? Math.round(((index + 1) / steps.length) * 100) : 0

  return (
    <div className="min-h-screen bg-[#f9f9fe] flex flex-col">
      <header className="sticky top-0 z-40 frosted">
        <div className="max-w-[560px] mx-auto flex items-center gap-3 px-4 h-14">
          <Link to="/" aria-label="OnlyIndians home" className="shrink-0">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-caption-1 text-[#434655] font-medium">
                {current ? `Step ${current.num} of ${steps.length}` : 'Quick Setup'}
              </span>
              <span className="text-caption-1 text-[#004ac6] font-semibold">{pct}% Completed</span>
            </div>
            <ProgressBar value={pct} />
          </div>
        </div>
      </header>
      <main className="flex-1 px-5 py-6">
        <div className="w-full max-w-[560px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}