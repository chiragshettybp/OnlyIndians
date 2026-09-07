import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../lib/constants'

// Requires the profile to have finished onboarding before rendering a dashboard route.
export default function RequireOnboarding({ role, children }) {
  const { user, profile, ready } = useAuth()
  if (!ready) return children
  if (user && !profile?.onboarded) return <Navigate to={ROLES[role]?.onboardingFirst ?? '/'} replace />
  return children
}