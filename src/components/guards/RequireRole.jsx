import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../lib/constants'
import Spinner from '../ui/Spinner'

// Restricts a route tree to a single portal role with full eligibility checks:
//  - guest            -> role login route
//  - wrong role       -> that role's own portal
//  - deleted/banned/suspended -> /locked
//  - email unverified -> /verify (onboarding + dashboards require verification)
export default function RequireRole({ role, allowGuests = false, children }) {
  const { user, profile, ready } = useAuth()
  const location = useLocation()

  if (!ready) return <div className="min-h-screen grid place-items-center"><Spinner label="Syncing secure session…" /></div>

  const cfg = ROLES[role]
  if (allowGuests && !user) return children

  if (!user) return <Navigate to={cfg.loginRoute} replace state={{ from: location.pathname }} />

  const p = profile
  const actualRole = p?.role ?? user?.user_metadata?.role
  if (p && p.role !== role) return <Navigate to={ROLES[p.role]?.loginRoute ?? '/'} replace />
  if (!p?.role && actualRole !== role) return <Navigate to={ROLES[actualRole]?.loginRoute ?? '/'} replace />

  if (p?.status === 'deleted' || p?.status === 'banned' || p?.suspended_at) {
    return <Navigate to="/locked" replace />
  }

  if (p && !p.email_verified_at) {
    return <Navigate to="/verify" replace state={{ from: location.pathname }} />
  }

  return children
}