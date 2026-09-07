import { useLocation, useNavigate } from 'react-router-dom'
import { stepNeighbors } from '../lib/onboarding'

// Reads prev/next onboarding routes from the current path for a given role.
export function useOnboardingNav(role) {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { prev, next } = stepNeighbors(role, pathname)
  return {
    prev,
    next,
    goPrev: () => prev && nav(prev),
    goNext: () => next && nav(next)
  }
}

export default useOnboardingNav