import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile, resolveLoginEmail, completeEmailVerification } from '../lib/api'
import { EMAIL_REDIRECT, looksLikePhone } from '../lib/authUtils'
import { ROLES } from '../lib/constants'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  const refreshProfile = useCallback(async (uid) => {
    if (!uid) {
      setProfile(null)
      return null
    }
    const { data, error: e } = await getProfile(uid)
    if (e) {
      setProfile(null)
      setError(e)
      return null
    }
    setProfile(data)
    setError(null)
    return data
  }, [])

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session)
        return data.session ? refreshProfile(data.session.user.id) : null
      })
      .finally(() => setReady(true))
  }, [refreshProfile])

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (nextSession) refreshProfile(nextSession.user.id)
      else setProfile(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [refreshProfile])

  // Mirror Supabase's email confirmation onto profiles.email_verified_at once.
  const mirrorAttempted = useRef(null)
  useEffect(() => {
    const user = session?.user
    if (user?.email_confirmed_at && profile && !profile.email_verified_at && mirrorAttempted.current !== user.id) {
      mirrorAttempted.current = user.id
      completeEmailVerification(user.id).then(() => refreshProfile(user.id))
    }
  }, [session, profile, refreshProfile])

  const signUp = useCallback(async ({ role, email, mobile, password, username, displayName }) => {
    const { data, error: e } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, mobile, username, display_name: displayName },
        emailRedirectTo: `${window.location.origin}${EMAIL_REDIRECT(role)}`
      }
    })
    return { data, error: e }
  }, [])

  // Phone-first sign-in: phone is silently resolved to the account email (RPC),
  // then standard email+password sign-in runs. No SMS/OTP anywhere.
  const signIn = useCallback(async ({ credential, password }) => {
    let email = String(credential || '').trim()
    if (looksLikePhone(email)) {
      const { data, error } = await resolveLoginEmail(email)
      if (error) return { data: null, error }
      if (!data) {
        return { data: null, error: { message: 'Invalid log in credentials', code: 'invalid_credentials' } }
      }
      email = data
    }
    return supabase.auth.signInWithPassword({ email, password })
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const resetPasswordForEmail = useCallback(async (email, role) => {
    const redirectTo = `${window.location.origin}/${role}/reset-password`
    return supabase.auth.resetPasswordForEmail(email, { redirectTo })
  }, [])

  const confirmResetPassword = useCallback(async (password) => {
    return supabase.auth.updateUser({ password })
  }, [])

  const verifyByToken = useCallback(async ({ token_hash, type = 'email' }) => {
    return supabase.auth.verifyOtp({ token_hash, type })
  }, [])

  const verifyOtp = useCallback(async ({ email, token, type = 'email' }) => {
    return supabase.auth.verifyOtp({ email, token, type })
  }, [])

  const completeVerification = useCallback(async (uid) => {
    return completeEmailVerification(uid).then(() => refreshProfile(uid))
  }, [refreshProfile])

  const resendVerificationEmail = useCallback(async ({ email, role }) => {
    return supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}${EMAIL_REDIRECT(role)}` }
    })
  }, [])

  const value = useMemo(
    () => ({
      session,
      profile,
      ready,
      error,
      user: session?.user ?? null,
      role: profile?.role ?? session?.user?.user_metadata?.role ?? null,
      displayName: profile?.display_name ?? session?.user?.user_metadata?.display_name ?? '',
      username: profile?.username ?? session?.user?.user_metadata?.username ?? '',
      onboarded: Boolean(profile?.onboarded),
      emailVerifiedAt: profile?.email_verified_at ?? null,
      refreshProfile,
      signUp,
      signIn,
      signOut,
      resetPasswordForEmail,
      confirmResetPassword,
      verifyOtp,
      verifyByToken,
      completeVerification,
      resendVerificationEmail
    }),
    [session, profile, ready, error, refreshProfile, signUp, signIn, signOut, resetPasswordForEmail, confirmResetPassword, verifyOtp, verifyByToken, completeVerification, resendVerificationEmail]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function roleConfig(role) {
  return ROLES[role] ?? null
}