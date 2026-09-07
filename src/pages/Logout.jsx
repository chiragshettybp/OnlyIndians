import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/constants'
import Spinner from '../components/ui/Spinner'

export default function Logout() {
  const { pathname } = useLocation()
  const role = pathname.split('/')[1] === 'creator' ? 'creator' : 'subscriber'
  const cfg = ROLES[role]
  usePageTitle(`Sign Out · ${cfg.label}`)

  const { signOut } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    signOut().finally(() => nav(cfg.loginRoute, { replace: true }))
  }, [signOut, nav, cfg.loginRoute])

  return <div className="min-h-[50vh] grid place-items-center"><Spinner label="Signing you out…" /></div>
}