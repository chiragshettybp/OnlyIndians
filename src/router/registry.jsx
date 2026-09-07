import { lazy } from 'react'

// Every screen from docs/ROUTES.md maps to a lazy page component in src/pages/.
// Files must live FLAT in src/pages/ (e.g. src/pages/SubHome.jsx) so Vite's
// dynamic-import glob resolves them. Page agents add files here as they build.
const P = (name) => lazy(() => import(`../pages/${name}.jsx`))

export const pages = {
  // ---- Marketing / public ----
  Home: P('Home'),
  Discover: P('Discover'),
  HowItWorks: P('HowItWorks'),
  Pricing: P('Pricing'),
  Help: P('Help'),
  FAQ: P('FAQ'),
  About: P('About'),
  Status: P('Status'),
  Contact: P('Contact'),
  Terms: P('Terms'),
  Privacy: P('Privacy'),
  Guidelines: P('Guidelines'),
  PublicProfile: P('PublicProfile'),

  // ---- Auth ----
  SubscriberLogin: P('SubscriberLogin'),
  SubscriberRegister: P('SubscriberRegister'),
  CreatorLogin: P('CreatorLogin'),
  CreatorRegister: P('CreatorRegister'),
  VerifyEmail: P('VerifyEmail'),
  VerificationSuccess: P('VerificationSuccess'),
  VerificationFailed: P('VerificationFailed'),
  ForgotPassword: P('ForgotPassword'),
  ResetPassword: P('ResetPassword'),
  CheckEmail: P('CheckEmail'),
  Logout: P('Logout'),
  Locked: P('Locked'),

  // ---- Subscriber onboarding ----
  OnboardingProfile: P('OnboardingProfile'),
  OnboardingAvatar: P('OnboardingAvatar'),
  OnboardingPreferences: P('OnboardingPreferences'),
  OnboardingInterests: P('OnboardingInterests'),
  OnboardingUsername: P('OnboardingUsername'),
  OnboardingComplete: P('OnboardingComplete'),

  // ---- Subscriber dashboard ----
  SubHome: P('SubHome'),
  SubExplore: P('SubExplore'),
  SubSearch: P('SubSearch'),
  SubMessages: P('SubMessages'),
  SubChat: P('SubChat'),
  SubNotifications: P('SubNotifications'),
  SubSettings: P('SubSettings'),
  SubSubscription: P('SubSubscription'),
  SubPayments: P('SubPayments'),

  // ---- Creator onboarding ----
  CreatorOnboardingProfile: P('CreatorOnboardingProfile'),
  CreatorOnboardingVisual: P('CreatorOnboardingVisual'),
  CreatorOnboardingIdentity: P('CreatorOnboardingIdentity'),
  CreatorOnboardingPayouts: P('CreatorOnboardingPayouts'),
  CreatorOnboardingPricing: P('CreatorOnboardingPricing'),
  CreatorOnboardingComplete: P('CreatorOnboardingComplete'),

  // ---- Creator dashboard ----
  CrStudio: P('CrStudio'),
  CrContent: P('CrContent'),
  CrEditor: P('CrEditor'),
  CrEarnings: P('CrEarnings'),
  CrMessages: P('CrMessages'),
  CrChat: P('CrChat'),
  CrSubscribers: P('CrSubscribers'),
  CrSettings: P('CrSettings'),
  CrPayouts: P('CrPayouts'),

  // ---- Admin ----
  AdDashboard: P('AdDashboard'),
  AdUsers: P('AdUsers'),
  AdUserDetail: P('AdUserDetail'),
  AdVerification: P('AdVerification'),
  AdVerificationDetail: P('AdVerificationDetail'),
  AdReports: P('AdReports'),
  AdPayouts: P('AdPayouts'),
  AdTickets: P('AdTickets'),
  AdSettings: P('AdSettings')
}

export default pages