import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../lib/constants'
import Spinner from '../ui/Spinner'

// Restricts an auth/guest route to unauthenticated visitors.
// Logged-in users (matching or mismatched role) are redirected to their portal.
export default function GuestOnly({ role, children }) {
  const { user, profile, ready } = useAuth()

  if (!ready) return <div className="min-h-screen grid place-items-center"><Spinner label="Syncing secure session…" /></div>

  if (user) {
    const r = profile?.role ?? user?.user_metadata?.role
    if (r && r !== role) return <Navigate to={ROLES[r]?.loginRoute ?? '/'} replace />
    return <Navigate to={ROLES[role]?.homePath ?? '/'} replace />
  }

  return children
}