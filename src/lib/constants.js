export const BRAND = {
  name: 'OnlyIndians',
  shortName: 'OI',
  tagline: "India's Verified Creator Network",
  claim: 'Empowering Indian Creators & Fans.',
  footer: 'Designed for creators across Bharat • Proudly built in India'
}

export const PLATFORM = {
  creatorNetShare: 0.88,
  platformFeeRate: 0.12,
  payoutDelayLabel: 'T+1',
  settlementNote: 'Automated daily INR settlements directly to Indian bank / UPI (T+1).',
  verifiedCreatorsLabel: '4,800+ verified Indian creators',
  priceRange: { min: 99, max: 9999 }
}

export const PLATFORM_FACTS = [
  { value: '4,800+', label: 'Verified creators live' },
  { value: '₹0', label: 'Joining / listing fee' },
  { value: '88%', label: 'Net creator payout' },
  { value: 'T+1', label: 'Daily INR settlements' }
]

export const TRUST_PILLARS = [
  {
    icon: 'phone_iphone',
    title: 'Verified India-only accounts',
    desc: 'Email-verified through a secure link. Your +91 number is your primary identifier — no SMS OTPs, ever.'
  },
  {
    icon: 'mark_email_read',
    title: 'Zero SMS OTP Fatigue',
    desc: 'Instant magic links sent directly to your registered email inbox.'
  },
  {
    icon: 'shield',
    title: 'RBI-Mandated Tokenized UPI',
    desc: 'Direct bank settlement via official UPI rails. Never store card data unencrypted.'
  },
  {
    icon: 'gavel',
    title: 'Indian IT Rules (2021) Compliant',
    desc: 'Resident grievance officer & proactive content moderation built in.'
  }
]

export const CONCIERGE = {
  title: 'Creator with 10k+ Fans?',
  desc: 'Free fan migration concierge — 0% platform commission for your first 60 days and dedicated WhatsApp account support.',
  cta: 'Apply for Concierge Migration'
}

export const EXPLORE_LINKS = [
  'Explore Platform',
  'How OnlyIndians Works',
  'Transparent Pricing & Fees',
  'Frequently Asked Questions',
  'All Systems Operational'
]

export const NAV_LINKS = [
  { label: 'Home', route: '/', icon: 'home' },
  { label: 'Explore', route: '/discover', icon: 'explore' },
  { label: 'How It Works', route: '/how-it-works', icon: 'play_circle' },
  { label: 'Pricing', route: '/pricing', icon: 'payments' },
  { label: 'Help', route: '/help', icon: 'support_agent' },
  { label: 'More', route: '/faq', icon: 'more_horiz' }
]

export const MORE_LINKS = [
  { label: 'About', route: '/about', icon: 'info' },
  { label: 'Platform Status', route: '/status', icon: 'monitor_heart' },
  { label: 'FAQ', route: '/faq', icon: 'quiz' },
  { label: 'Contact', route: '/contact', icon: 'call' },
  { label: 'Terms of Service', route: '/terms', icon: 'description' },
  { label: 'Privacy Policy', route: '/privacy', icon: 'privacy_tip' },
  { label: 'Community Guidelines', route: '/community-guidelines', icon: 'groups' }
]

export const HERO_USP = [
  { icon: 'block', label: 'Zero Ads' },
  { icon: 'forum', label: 'Direct Q&A' },
  { icon: 'cancel', label: '1-Click Cancel' }
]

export const CREATOR_USP = [
  { icon: 'payments', label: 'Daily INR Payouts' },
  { icon: 'receipt_long', label: 'Auto GST/TDS' },
  { icon: 'tune', label: 'No Algorithms' }
]

export const SUBSCRIBER_STEPS = [
  { id: 'profile', num: 1, title: 'Profile Details', route: '/subscriber/onboarding/profile', label: 'Profile Details' },
  { id: 'avatar', num: 2, title: 'Avatar', route: '/subscriber/onboarding/avatar', label: 'Add a Profile Photo' },
  { id: 'preferences', num: 3, title: 'Languages & Preferences', route: '/subscriber/onboarding/preferences', label: 'Notification Preferences' },
  { id: 'interests', num: 4, title: 'Interests', route: '/subscriber/onboarding/interests', label: 'Select Interests' },
  { id: 'username', num: 5, title: 'Username', route: '/subscriber/onboarding/userflow', label: 'Claim Your @username' }
]

export const SUBSCRIBER_STEP_BY_ROUTE = Object.fromEntries(SUBSCRIBER_STEPS.map((s) => [s.route, s]))

export const CREATOR_STEPS = [
  { id: 'profile', num: 1, title: 'Creator Profile', route: '/creator/onboarding/profile', label: 'Creator Profile' },
  { id: 'avatar-banner', num: 2, title: 'Visual Identity', route: '/creator/onboarding/avatar-banner', label: 'Avatar & Banner' },
  { id: 'identity', num: 3, title: 'Identity Verification', route: '/creator/onboarding/identity', label: 'KYC & Identity' },
  { id: 'payouts', num: 4, title: 'Payout Settings', route: '/creator/onboarding/payouts', label: 'Banking & Tax' },
  { id: 'pricing', num: 5, title: 'Subscription Pricing', route: '/creator/onboarding/pricing', label: 'Subscription Tiers' }
]

export const CREATOR_STEP_BY_ROUTE = Object.fromEntries(CREATOR_STEPS.map((s) => [s.route, s]))

export const LANGUAGES = [
  { code: 'hi', native: 'हिन्दी', name: 'Hindi' },
  { code: 'en', native: 'English', name: 'English' },
  { code: 'ta', native: 'தமிழ்', name: 'Tamil' },
  { code: 'te', native: 'తెలుగు', name: 'Telugu' },
  { code: 'ml', native: 'മലയാളം', name: 'Malayalam' },
  { code: 'bn', native: 'বাংলা', name: 'Bengali' },
  { code: 'kn', native: 'ಕನ್ನಡ', name: 'Kannada' },
  { code: 'mr', native: 'मराठी', name: 'Marathi' }
]

export const INTERESTS = [
  { id: 'comedy', label: 'Stand-up & Sketches', desc: 'Zakir, Samay, Munawar & rising voices', count: 1400, users: '1.4k' },
  { id: 'tech', label: 'Tech, AI & Startups', desc: 'Product engineering & founders', count: 980, users: '980' },
  { id: 'journalism', label: 'Journalism & News', desc: 'Independent reports & policy analyses', count: 640, users: '640' },
  { id: 'cinema', label: 'Regional Cinema', desc: 'Malayalam, Tamil, Telugu, Hindi', count: 2100, users: '2.1k' },
  { id: 'music', label: 'Music & Instruments', desc: 'Carnatic, Hindustani & Indie bands', count: 1800, users: '1.8k' },
  { id: 'finance', label: 'Finance & Equities', desc: 'Macro economy, mutual funds & tax', count: 0, users: 'SEBI' },
  { id: 'podcasts', label: 'Podcasts & Deep Dives', desc: 'Long-form interviews, lore & history', count: 740, users: '740' },
  { id: 'gaming', label: 'Gaming & Esports', desc: 'BGMI, Valorant, speedruns & scrims', count: 1200, users: '1.2k' },
  { id: 'wellness', label: 'Yoga, Ayurveda & Health', desc: 'Holistic wellness, nutrition & routines', count: 890, users: '890' }
]

export const CREATOR_CATEGORIES = [
  { id: 'standup', label: 'Stand-Up Comedy', desc: 'Observational satire & storytelling', icon: 'theater_comedy' },
  { id: 'tech', label: 'Tech & AI Reviews', desc: 'Product & engineering deep dives', icon: 'memory' },
  { id: 'news', label: 'Journalism & News', desc: 'Independent reports & analysis', icon: 'newspaper' },
  { id: 'podcasts', label: 'Podcasts & Talk', desc: 'Long-form conversations', icon: 'podcasts' },
  { id: 'classical', label: 'Classical Arts', desc: 'Carnatic, Hindustani & more', icon: 'music_note' },
  { id: 'cinema', label: 'Regional Cinema', desc: 'Bharat-wide film culture', icon: 'movie' },
  { id: 'gaming', label: 'Gaming', desc: 'Esports & playthroughs', icon: 'sports_esports' },
  { id: 'fitness', label: 'Fitness & Health', desc: 'Workouts, nutrition & wellness', icon: 'self_improvement' }
]

export const CREATOR_PRIMARY_DISCIPLINES = [
  { label: 'Journalism', icon: 'newspaper' },
  { label: 'Stand-Up', icon: 'mic' },
  { label: 'Tech & AI', icon: 'memory' },
  { label: 'Classical Arts', icon: 'palette' },
  { label: 'Gaming', icon: 'sports_esports' },
  { label: 'Podcasts', icon: 'podcasts' },
  { label: 'Cinema', icon: 'movie' }
]

export const PRICING_TIERS = [99, 199, 299, 499, 999]

export const PRICING_BENEFITS = [
  { icon: 'check_circle', label: '₹0 Platform Fee' },
  { icon: 'check_circle', label: '1-Click Cancel' },
  { icon: 'check_circle', label: 'UPI AutoPay' },
  { icon: 'check_circle', label: 'No Forex Markup' }
]

export const PRICING_GUARANTEES = [
  { icon: 'tune', label: 'Creator-Controlled Rates', desc: '₹99 to ₹9,999/month set directly by creator' },
  { icon: 'notifications_active', label: '48h Renewal Alerts', desc: 'Pre-debit notice before recurring charges' },
  { icon: 'contactless', label: 'UPI AutoPay & RuPay', desc: 'GPay, PhonePe, Paytm biometric 1-click mandates' }
]

export const STATUS_SERVICES = [
  { icon: 'fingerprint', name: 'Authentication (+91 & Supabase)', sub: 'OTP Gateway & Auth Tokens', latency: '42ms', uptime: '100.0%', status: 'Operational' },
  { icon: 'account_balance_wallet', name: 'UPI AutoPay & Gateway (RBI Mandate)', sub: 'Razorpay & NPCI Recurring Hub', latency: '38ms', uptime: '99.98%', status: 'Operational' },
  { icon: 'play_circle', name: 'Creator Video & Audio CDN', sub: 'HLS Stream Edge • Mumbai & BLR', latency: '—', uptime: '99.99%', status: 'Operational' },
  { icon: 'payments', name: 'Creator Payout Settlements (T+1 Engine)', sub: 'IMPS / NEFT Banking Bridge', latency: '—', uptime: '100.0%', status: 'Operational' },
  { icon: 'database', name: 'Database & Real-time Feeds', sub: 'PostgreSQL Primary & WebSockets', latency: '12ms', uptime: '100.0%', status: 'Operational' },
  { icon: 'mail', name: 'Email Verification Dispatcher', sub: 'Transactional Alerts & Receipts', latency: '—', uptime: '99.95%', status: 'Operational' }
]

export const STATUS_META = {
  overall: 'All Systems Operational',
  avgResponse: '38 ms',
  responseTone: 'Normal response',
  sla30: '100%',
  incidents: { title: 'No incidents reported', desc: 'All systems maintained 100% continuous uptime over the last 30 days.' }
}

export const AUTH_REASSURANCE = 'Protected by end-to-end encrypted session keys'

export const ROLES = {
  subscriber: {
    key: 'subscriber',
    label: 'Subscriber',
    portalLabel: 'Subscriber Portal',
    homePath: '/subscriber',
    loginRoute: '/subscriber/login',
    registerRoute: '/subscriber/register',
    onboardingFirst: '/subscriber/onboarding/profile'
  },
  creator: {
    key: 'creator',
    label: 'Creator',
    portalLabel: 'Creator Studio',
    homePath: '/creator',
    loginRoute: '/creator/login',
    registerRoute: '/creator/register',
    onboardingFirst: '/creator/onboarding/profile'
  },
  admin: {
    key: 'admin',
    label: 'Admin',
    portalLabel: 'Admin Console',
    homePath: '/admin',
    loginRoute: '/admin/login',
    registerRoute: null,
    onboardingFirst: '/admin'
  }
}

export const SUBSCRIBER_TABS = [
  { label: 'Home', route: '/subscriber', icon: 'home' },
  { label: 'Explore', route: '/subscriber/explore', icon: 'explore' },
  { label: 'Messages', route: '/subscriber/messages', icon: 'chat' },
  { label: 'Alerts', route: '/subscriber/notifications', icon: 'notifications' },
  { label: 'Me', route: '/subscriber/settings', icon: 'person' }
]

export const CREATOR_TABS = [
  { label: 'Studio', route: '/creator', icon: 'dashboard' },
  { label: 'Content', route: '/creator/content', icon: 'article' },
  { label: 'Earnings', route: '/creator/earnings', icon: 'currency_rupee' },
  { label: 'Messages', route: '/creator/messages', icon: 'chat' },
  { label: 'Menu', route: '/creator/settings', icon: 'menu' }
]

export const ADMIN_TABS = [
  { label: 'Dashboard', route: '/admin', icon: 'dashboard' },
  { label: 'Users', route: '/admin/users', icon: 'group' },
  { label: 'Verify', route: '/admin/verification', icon: 'verified_user' },
  { label: 'Moderation', route: '/admin/moderation', icon: 'shield' },
  { label: 'More', route: '/admin/settings', icon: 'more_horiz' }
]

export const PAYMENT_PROVIDERS = ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'CRED']

export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  banners: 'banners',
  media: 'media',
  documents: 'documents'
}