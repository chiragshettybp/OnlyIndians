import { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './context/ToastContext'
import MarketingLayout from './layouts/MarketingLayout'
import AuthLayout from './layouts/AuthLayout'
import OnboardingLayout from './layouts/OnboardingLayout'
import DashboardLayout from './layouts/DashboardLayout'
import GuestOnly from './components/guards/GuestOnly'
import RequireRole from './components/guards/RequireRole'
import RequireOnboarding from './components/guards/RequireOnboarding'
import Page from './pages/Page'
import NotFound from './pages/NotFound'
import Spinner from './components/ui/Spinner'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<Spinner label="Loading OnlyIndians…" />}>
              <Routes>
                {/* ---- Public marketing shell ---- */}
                <Route element={<MarketingLayout />}>
                  <Route index element={<Page name="Home" />} />
                  <Route path="discover" element={<Page name="Discover" />} />
                  <Route path="how-it-works" element={<Page name="HowItWorks" />} />
                  <Route path="pricing" element={<Page name="Pricing" />} />
                  <Route path="help" element={<Page name="Help" />} />
                  <Route path="faq" element={<Page name="FAQ" />} />
                  <Route path="about" element={<Page name="About" />} />
                  <Route path="status" element={<Page name="Status" />} />
                  <Route path="contact" element={<Page name="Contact" />} />
                  <Route path="terms" element={<Page name="Terms" />} />
                  <Route path="privacy" element={<Page name="Privacy" />} />
                  <Route path="community-guidelines" element={<Page name="Guidelines" />} />
                  <Route path="guidelines" element={<Navigate to="/community-guidelines" replace />} />
                  <Route path="@:username" element={<Page name="PublicProfile" />} />
                </Route>

                {/* ---- Legacy /auth/* redirects to role-scoped routes ---- */}
                <Route path="auth/subscriber/login" element={<Navigate to="/subscriber/login" replace />} />
                <Route path="auth/subscriber/register" element={<Navigate to="/subscriber/register" replace />} />
                <Route path="auth/creator/login" element={<Navigate to="/creator/login" replace />} />
                <Route path="auth/creator/register" element={<Navigate to="/creator/register" replace />} />
                <Route path="auth/forgot-password" element={<Navigate to="/" replace />} />
                <Route path="auth/logout" element={<Navigate to="/" replace />} />
                <Route path="auth/:role/verify" element={<Navigate to="/verify" replace />} />
                <Route path="auth/verification-success" element={<Navigate to="/verify/success" replace />} />
                <Route path="auth/verification-failed" element={<Navigate to="/verify/failed" replace />} />

                {/* ---- Auth shell (role-scoped) ---- */}
                <Route element={<AuthLayout />}>
                  <Route path="subscriber/login" element={<GuestOnly role="subscriber"><Page name="SubscriberLogin" /></GuestOnly>} />
                  <Route path="subscriber/register" element={<GuestOnly role="subscriber"><Page name="SubscriberRegister" /></GuestOnly>} />
                  <Route path="subscriber/forgot-password" element={<GuestOnly role="subscriber"><Page name="ForgotPassword" /></GuestOnly>} />
                  <Route path="subscriber/reset-password" element={<Page name="ResetPassword" />} />
                  <Route path="subscriber/check-email" element={<GuestOnly role="subscriber"><Page name="CheckEmail" /></GuestOnly>} />
                  <Route path="creator/login" element={<GuestOnly role="creator"><Page name="CreatorLogin" /></GuestOnly>} />
                  <Route path="creator/register" element={<GuestOnly role="creator"><Page name="CreatorRegister" /></GuestOnly>} />
                  <Route path="creator/forgot-password" element={<GuestOnly role="creator"><Page name="ForgotPassword" /></GuestOnly>} />
                  <Route path="creator/reset-password" element={<Page name="ResetPassword" />} />
                  <Route path="creator/check-email" element={<GuestOnly role="creator"><Page name="CheckEmail" /></GuestOnly>} />
                </Route>

                {/* ---- Shared email verification / locked ---- */}
                <Route path="verify" element={<Page name="VerifyEmail" />} />
                <Route path="verify/success" element={<Page name="VerificationSuccess" />} />
                <Route path="verify/failed" element={<Page name="VerificationFailed" />} />
                <Route path="locked" element={<Page name="Locked" />} />

                {/* ---- Logout (role-guarded, then force sign-out) ---- */}
                <Route path="subscriber/logout" element={<RequireRole role="subscriber"><Page name="Logout" /></RequireRole>} />
                <Route path="creator/logout" element={<RequireRole role="creator"><Page name="Logout" /></RequireRole>} />

                {/* ---- Subscriber onboarding ---- */}
                <Route path="subscriber/onboarding">
                  <Route element={<RequireRole role="subscriber"><OnboardingLayout role="subscriber" /></RequireRole>}>
                    <Route path="profile" element={<Page name="OnboardingProfile" />} />
                    <Route path="avatar" element={<Page name="OnboardingAvatar" />} />
                    <Route path="preferences" element={<Page name="OnboardingPreferences" />} />
                    <Route path="interests" element={<Page name="OnboardingInterests" />} />
                    <Route path="userflow" element={<Page name="OnboardingUsername" />} />
                    <Route path="complete" element={<Page name="OnboardingComplete" />} />
                    <Route index element={<NavigateOnboarding role="subscriber" />} />
                  </Route>
                </Route>

                {/* ---- Subscriber dashboard ---- */}
                <Route element={<RequireRole role="subscriber"><RequireOnboarding role="subscriber"><DashboardLayout role="subscriber" /></RequireOnboarding></RequireRole>}>
                  <Route path="subscriber" element={<Page name="SubHome" />} />
                  <Route path="subscriber/explore" element={<Page name="SubExplore" />} />
                  <Route path="subscriber/explore/search" element={<Page name="SubSearch" />} />
                  <Route path="subscriber/messages" element={<Page name="SubMessages" />} />
                  <Route path="subscriber/messages/:cid" element={<Page name="SubChat" />} />
                  <Route path="subscriber/notifications" element={<Page name="SubNotifications" />} />
                  <Route path="subscriber/settings" element={<Page name="SubSettings" />} />
                  <Route path="subscriber/settings/subscription" element={<Page name="SubSubscription" />} />
                  <Route path="subscriber/settings/payments" element={<Page name="SubPayments" />} />
                </Route>

                {/* ---- Creator onboarding ---- */}
                <Route path="creator/onboarding">
                  <Route element={<RequireRole role="creator"><OnboardingLayout role="creator" /></RequireRole>}>
                    <Route path="profile" element={<Page name="CreatorOnboardingProfile" />} />
                    <Route path="avatar-banner" element={<Page name="CreatorOnboardingVisual" />} />
                    <Route path="identity" element={<Page name="CreatorOnboardingIdentity" />} />
                    <Route path="payouts" element={<Page name="CreatorOnboardingPayouts" />} />
                    <Route path="pricing" element={<Page name="CreatorOnboardingPricing" />} />
                    <Route path="complete" element={<Page name="CreatorOnboardingComplete" />} />
                    <Route index element={<NavigateOnboarding role="creator" />} />
                  </Route>
                </Route>

                {/* ---- Creator dashboard ---- */}
                <Route element={<RequireRole role="creator"><RequireOnboarding role="creator"><DashboardLayout role="creator" /></RequireOnboarding></RequireRole>}>
                  <Route path="creator" element={<Page name="CrStudio" />} />
                  <Route path="creator/content" element={<Page name="CrContent" />} />
                  <Route path="creator/content/:postId/editor" element={<Page name="CrEditor" />} />
                  <Route path="creator/earnings" element={<Page name="CrEarnings" />} />
                  <Route path="creator/payouts" element={<Page name="CrPayouts" />} />
                  <Route path="creator/messages" element={<Page name="CrMessages" />} />
                  <Route path="creator/messages/:cid" element={<Page name="CrChat" />} />
                  <Route path="creator/subscribers" element={<Page name="CrSubscribers" />} />
                  <Route path="creator/settings" element={<Page name="CrSettings" />} />
                </Route>

                {/* ---- Admin (later module) ---- */}
                <Route element={<RequireRole role="admin"><DashboardLayout role="admin" /></RequireRole>}>
                  <Route path="admin" element={<Page name="AdDashboard" />} />
                  <Route path="admin/users" element={<Page name="AdUsers" />} />
                  <Route path="admin/users/:id" element={<Page name="AdUserDetail" />} />
                  <Route path="admin/verification" element={<Page name="AdVerification" />} />
                  <Route path="admin/verification/:id" element={<Page name="AdVerificationDetail" />} />
                  <Route path="admin/moderation" element={<Page name="AdReports" />} />
                  <Route path="admin/payouts" element={<Page name="AdPayouts" />} />
                  <Route path="admin/tickets" element={<Page name="AdTickets" />} />
                  <Route path="admin/settings" element={<Page name="AdSettings" />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

function NavigateOnboarding({ role }) {
  return <Navigate to={`/${role}/onboarding/profile`} replace />
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}