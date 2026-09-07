import { supabase } from './supabase'
import { PLATFORM, STORAGE_BUCKETS } from './constants'

// Typed data layer. Every function returns { data, error }; never throws.
// All queries respect RLS. Table/column names follow docs/DATA_MODELS.md.

const F = (fn) => async (...args) => {
  try {
    return await fn(...args)
  } catch (e) {
    return { data: null, error: { message: e.message } }
  }
}

const list = (r) => ({ data: r.data ?? [], error: r.error })

// ---------- profiles ----------

export const getProfile = F(async (uid) => {
  const r = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
  return r
})

export const getCreatorById = F(async (uid) => {
  const r = await supabase
    .from('profiles')
    .select('*, creator_profiles(*)')
    .eq('id', uid)
    .maybeSingle()
  return r
})

export const getProfileByUsername = F(async (username) => {
  const r = await supabase
    .from('profiles')
    .select('*, creator_profiles(*)')
    .eq('username', String(username).toLowerCase())
    .maybeSingle()
  return r
})

export const createProfile = F(async (profile) => {
  const r = await supabase.from('profiles').upsert(profile).select().maybeSingle()
  return r
})

export const updateProfile = F(async (uid, patch) => {
  const r = await supabase
    .from('profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', uid)
    .select()
    .maybeSingle()
  return r
})

export const checkUsernameAvailable = F(async (username) => {
  const r = await supabase
    .from('profiles')
    .select('username')
    .eq('username', String(username).toLowerCase())
    .maybeSingle()
  return { data: { available: !r.data }, error: r.error }
})

// RLS-aware uniqueness check (definer RPC) used by the onboarding username step.
export const isUsernameAvailable = F(async (username) => {
  const r = await supabase.rpc('check_username_available', { p_username: String(username).toLowerCase() })
  return { data: Boolean(r.data), error: r.error }
})

// ---------- creators (public discovery) ----------

export const listCreators = F(async ({ category, limit = 20, page = 0, q } = {}) => {
  let b = supabase
    .from('profiles')
    .select('*, creator_profiles(*)')
    .eq('role', 'creator')
    .eq('status', 'active')
    .eq('onboarded', true)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1)
  if (category) b = b.eq('creator_profiles.category', category)
  if (q) b = b.or(`display_name.ilike.%${q}%,username.ilike.%${q}%`)
  const r = await b
  return list(r)
})

export const searchCreators = F(async ({ q, category, sort = 'popular', page = 0, limit = 20 } = {}) => {
  let b = supabase
    .from('profiles')
    .select('*, creator_profiles(*)')
    .eq('role', 'creator')
    .eq('status', 'active')
  if (q) b = b.or(`display_name.ilike.%${q}%,username.ilike.%${q}%,bio.ilike.%${q}%`)
  if (category) b = b.eq('creator_profiles.category', category)
  if (sort === 'price_low') b = b.order('creator_profiles.subscription_price', { ascending: true })
  else if (sort === 'price_high') b = b.order('creator_profiles.subscription_price', { ascending: false })
  else b = b.order('created_at', { ascending: false })
  const r = await b.range(page * limit, page * limit + limit - 1)
  return list(r)
})

export const listTrendingCreators = F(async (limit = 6) => {
  const r = await supabase
    .from('profiles')
    .select('*, creator_profiles(*)')
    .eq('role', 'creator')
    .eq('status', 'active')
    .eq('onboarded', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return list(r)
})

// ---------- posts / content ----------

export const getPost = F(async (id) => {
  const r = await supabase.from('posts').select('*, creator:profiles(*, creator_profiles(*))').eq('id', id).maybeSingle()
  return r
})

export const listPosts = F(async ({ creatorId, status, page = 0, limit = 20 } = {}) => {
  let b = supabase.from('posts').select('*, creator:profiles(*, creator_profiles(*))').order('created_at', { ascending: false })
  if (creatorId) b = b.eq('creator_id', creatorId)
  if (status) b = b.eq('status', status)
  const r = await b.range(page * limit, page * limit + limit - 1)
  return list(r)
})

// Posts visible to a subscriber: published, public OR by creators they subscribe to.
export const getFeed = F(async ({ creatorIds, page = 0, limit = 20 } = {}) => {
  let b = supabase
    .from('posts')
    .select('*, creator:profiles(*, creator_profiles(*))')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (creatorIds && creatorIds.length) {
    b = b.in('creator_id', creatorIds)
  } else {
    b = b.eq('visibility', 'public')
  }
  const r = await b.range(page * limit, page * limit + limit - 1)
  return list(r)
})

export const createPost = F(async (payload) => {
  const r = await supabase.from('posts').insert(payload).select('*').maybeSingle()
  return r
})

export const updatePost = F(async (id, patch) => {
  const r = await supabase.from('posts').update(patch).eq('id', id).select('*').maybeSingle()
  return r
})

export const deletePost = F(async (id) => {
  const r = await supabase.from('posts').delete().eq('id', id)
  return { data: true, error: r.error }
})

// ---------- subscriptions & checkout ----------

export const getSubscriptions = F(async (uid) => {
  const r = await supabase.from('subscriptions').select('*, creator:creator_profiles(*, profiles(*))').eq('subscriber_id', uid)
  return list(r)
})

export const getActiveSubscription = F(async ({ subscriberId, creatorId }) => {
  const r = await supabase
    .from('subscriptions')
    .select('*')
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .in('status', ['active', 'trial'])
    .maybeSingle()
  return r
})

export const isSubscribed = F(async ({ subscriberId, creatorId }) => {
  const { data, error } = await getActiveSubscription({ subscriberId, creatorId })
  return { data: Boolean(data), error }
})

export const listSubscribers = F(async ({ creatorId, page = 0, limit = 20 } = {}) => {
  const r = await supabase
    .from('subscriptions')
    .select('*, subscriber:profiles(*)')
    .eq('creator_id', creatorId)
    .in('status', ['active', 'trial'])
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1)
  return list(r)
})

// Non-atomic best-effort: insert transaction + subscription.
export const subscribe = F(async ({ subscriberId, creatorId, price, planName = 'Monthly' }) => {
  const now = new Date().toISOString()
  const renewsAt = new Date(Date.now() + 30 * 864e5).toISOString()
  await supabase.from('transactions').insert({
      user_id: subscriberId,
      type: 'subscription',
      amount: price,
      currency: 'INR',
      status: 'paid',
      ref: `sub_${Date.now()}`,
      meta: { creator_id: creatorId, plan: planName }
    })
  const r = await supabase
    .from('subscriptions')
    .upsert(
      { subscriber_id: subscriberId, creator_id: creatorId, plan_name: planName, price, status: 'active', auto_renew: true, started_at: now, renews_at: renewsAt },
      { onConflict: 'subscriber_id,creator_id' }
    )
    .select()
    .maybeSingle()
  return r
})

export const cancelSubscription = F(async (id) => {
  const r = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), auto_renew: false })
    .eq('id', id)
    .select()
    .maybeSingle()
  return r
})

// ---------- earnings & payouts ----------

export const getEarningsSummary = F(async (creatorId) => {
  const r = await supabase.from('transactions').select('amount,type,status,created_at').eq('meta->>creator_id', creatorId)
  return r
})

export const listTransactions = F(async ({ userId, page = 0, limit = 20 } = {}) => {
  let b = supabase.from('transactions').select('*').order('created_at', { ascending: false })
  if (userId) b = b.eq('user_id', userId)
  const r = await b.range(page * limit, page * limit + limit - 1)
  return list(r)
})

export const listPayouts = F(async ({ creatorId } = {}) => {
  let b = supabase.from('payouts').select('*').order('created_at', { ascending: false })
  if (creatorId) b = b.eq('creator_id', creatorId)
  return list(await b)
})

export const requestPayout = F(async ({ creatorId, amount, method = 'UPI' }) => {
  const r = await supabase.from('payouts').insert({ creator_id: creatorId, amount, method, status: 'requested' }).select('*').maybeSingle()
  return r
})

// ---------- messaging ----------

export const getOrCreateConversation = F(async ({ a, b }) => {
  const pair = await supabase
    .from('conversations')
    .select('*')
    .or(`and(user_a.eq.${a},user_b.eq.${b}),and(user_a.eq.${b},user_b.eq.${a})`)
    .maybeSingle()
  if (pair.data) return pair
  const created = await supabase.from('conversations').insert({ user_a: a, user_b: b }).select('*').maybeSingle()
  return created
})

export const getConversations = F(async (uid) => {
  const r = await supabase
    .from('conversations')
    .select('*, messages(id, body, created_at, read_at, sender_id)')
    .or(`user_a.eq.${uid},user_b.eq.${uid}`)
    .order('last_message_at', { ascending: false })
  return list(r)
})

export const getMessages = F(async (conversationId) => {
  const r = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })
  return list(r)
})

export const sendMessage = F(async ({ conversationId, senderId, body, attachment }) => {
  const r = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, body, attachment }).select('*').maybeSingle()
  if (!r.error) {
    await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversationId)
  }
  return r
})

// ---------- notifications ----------

export const getNotifications = F(async ({ uid, page = 0, limit = 20 } = {}) => {
  const r = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1)
  return list(r)
})

export const markNotificationsRead = F(async (uid) => {
  const r = await supabase.from('notifications').update({ read: true }).eq('user_id', uid).eq('read', false)
  return { data: true, error: r.error }
})

export const getUnreadCount = F(async (uid) => {
  const r = await supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', uid).eq('read', false)
  return { data: r.count ?? 0, error: r.error }
})

// ---------- interactions ----------

export const setInteraction = F(async ({ userId, postId, type, on }) => {
  if (!on) {
    const r = await supabase.from('interactions').delete().eq('user_id', userId).eq('post_id', postId).eq('type', type)
    return { data: { on: false }, error: r.error }
  }
  const r = await supabase.from('interactions').upsert({ user_id: userId, post_id: postId, type }).select().maybeSingle()
  return { data: { on: true }, error: r.error }
})

export const getInteractions = F(async ({ userId, postId }) => {
  const r = await supabase
    .from('interactions')
    .select('type')
    .eq('user_id', userId)
    .eq('post_id', postId)
  return { data: (r.data ?? []).map((i) => i.type), error: r.error }
})

// ---------- media / storage ----------

export async function uploadFile(bucket = STORAGE_BUCKETS.media, path, file, { upsert = true } = {}) {
  const r = await supabase.storage.from(bucket).upload(path, file, { upsert, cacheControl: '3600' })
  if (r.error) return { data: null, error: r.error }
  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(r.data.path).data
  return { data: { path: r.data.path, url: publicUrl }, error: null }
}

export const getMediaLibrary = F(async (ownerId) => {
  const r = await supabase.from('media_library').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false })
  return list(r)
})

export const addMediaItem = F(async (item) => {
  const r = await supabase.from('media_library').insert(item).select('*').maybeSingle()
  return r
})

export const deleteMediaItem = F(async (id) => {
  const r = await supabase.from('media_library').delete().eq('id', id)
  return { data: true, error: r.error }
})

// ---------- reports ----------

export const createReport = F(async (payload) => {
  const r = await supabase.from('reports').insert(payload).select('*').maybeSingle()
  return r
})

export const listReports = F(async ({ status, page = 0, limit = 20 } = {}) => {
  let b = supabase.from('reports').select('*').order('created_at', { ascending: false })
  if (status) b = b.eq('status', status)
  const r = await b.range(page * limit, page * limit + limit - 1)
  return list(r)
})

// ---------- admin ----------

export const adminListUsers = F(async ({ role, status, q, page = 0, limit = 20 } = {}) => {
  let b = supabase.from('profiles').select('*, creator_profiles(*)').order('created_at', { ascending: false })
  if (role) b = b.eq('role', role)
  if (status) b = b.eq('status', status)
  if (q) b = b.or(`display_name.ilike.%${q}%,username.ilike.%${q}%,id.ilike.%${q}%`)
  const r = await b.range(page * limit, page * limit + limit - 1)
  return list(r)
})

export const adminUpdateUserStatus = F(async (id, status) => {
  const r = await supabase.from('profiles').update({ status }).eq('id', id).select().maybeSingle()
  return r
})

export const adminListVerifications = F(async ({ status = 'pending' } = {}) => {
  const r = await supabase
    .from('identity_verifications')
    .select('*, profiles(*, creator_profiles(*))')
    .eq('status', status)
    .order('submitted_at', { ascending: false })
  return list(r)
})

export const adminGetVerification = F(async (id) => {
  const r = await supabase.from('identity_verifications').select('*, profiles(*, creator_profiles(*))').eq('id', id).maybeSingle()
  return r
})

export const adminReviewVerification = F(async ({ id, verdict, reviewerId }) => {
  const r = await supabase
    .from('identity_verifications')
    .update({ status: verdict, reviewer_id: reviewerId, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle()
  if (!r.error) {
    await supabase
      .from('creator_profiles')
      .update({ verification_status: verdict, verified_at: verdict === 'approved' ? new Date().toISOString() : null })
      .eq('creator_id', r.data.creator_id)
  }
  return r
})

export const adminListPayouts = F(async ({ status, page = 0, limit = 20 } = {}) => {
  let b = supabase.from('payouts').select('*, creator:profiles(*)').order('created_at', { ascending: false })
  if (status) b = b.eq('status', status)
  const r = await b.range(page * limit, page * limit + limit - 1)
  return list(r)
})

export const adminResolvePayout = F(async ({ id, status }) => {
  const r = await supabase
    .from('payouts')
    .update({ status, processed_at: status === 'paid' || status === 'processing' ? new Date().toISOString() : null })
    .eq('id', id)
    .select()
    .maybeSingle()
  return r
})

export const adminListTickets = F(async ({ status, page = 0, limit = 20 } = {}) => {
  let b = supabase.from('support_tickets').select('*, user:profiles(*)').order('created_at', { ascending: false })
  if (status) b = b.eq('status', status)
  const r = await b.range(page * limit, page * limit + limit - 1)
  return list(r)
})

export const adminTicketMessages = F(async (ticketId) => {
  const r = await supabase.from('ticket_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true })
  return list(r)
})

export const adminReplyTicket = F(async ({ ticketId, authorId, body }) => {
  const r = await supabase.from('ticket_messages').insert({ ticket_id: ticketId, author_id: authorId, body }).select('*').maybeSingle()
  if (!r.error) {
    await supabase.from('support_tickets').update({ status: 'assigned' }).eq('id', ticketId)
  }
  return r
})

// ---------- auth tokens helper ----------

export const isEmailVerified = (user) => Boolean(user?.email_confirmed_at)

// ---------- auth & onboarding ----------

// Phone-first login: submits the +91 phone, gets the account email back so we can
// call signInWithPassword. Zero rows on a miss (no enumeration).
export const resolveLoginEmail = F(async (phone) => {
  const r = await supabase.rpc('resolve_login_email', { p_phone: phone })
  return { data: r.data?.[0]?.email ?? null, error: r.error }
})

// Mirrors Supabase's email_confirmed_at onto profiles.email_verified_at.
export const completeEmailVerification = F(async (uid) => {
  const r = await supabase.rpc('complete_email_verification', { p_uid: uid })
  return { data: true, error: r.error ? { message: r.error.message } : null }
})

// Owner-only KYC submission; status always forced to 'pending' server-side.
export const submitIdentityVerification = F(async ({ idType, idLast4, docPaths }) => {
  const r = await supabase.rpc('submit_identity_verification', {
    p_id_type: idType,
    p_id_last4: idLast4,
    p_doc_paths: docPaths
  })
  return r
})

export const upsertCreatorProfile = F(async (uid, patch) => {
  const r = await supabase
    .from('creator_profiles')
    .upsert({ ...patch, id: uid, updated_at: new Date().toISOString() }, { onConflict: 'id' })
    .select()
    .maybeSingle()
  return r
})

export const completeOnboarding = F(async (uid) => {
  const now = new Date().toISOString()
  const r = await supabase
    .from('profiles')
    .update({ onboarded: true, onboarded_at: now, updated_at: now })
    .eq('id', uid)
    .select()
    .maybeSingle()
  return r
})

// Private bucket uploads (avatars/banners/documents). Public URLs are forbidden
// by policy — previews use expiring signed URLs.
export async function uploadPrivateFile(bucket, path, file, { upsert = true } = {}) {
  try {
    const r = await supabase.storage.from(bucket).upload(path, file, { upsert, cacheControl: '3600' })
    if (r.error) return { data: null, error: r.error }
    return { data: { path: r.data.path }, error: null }
  } catch (e) {
    return { data: null, error: { message: e.message } }
  }
}

export const getSignedStorageUrl = F(async (bucket, path, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
    if (error) return { data: null, error }
    return { data: data?.signedUrl ?? null, error: null }
  } catch (e) {
    return { data: null, error: { message: e.message } }
  }
})

// ---------- public contact / support ----------

// Anonymous contact submissions persist through the SECURITY DEFINER RPC
// (RLS blocks direct table access). Validation happens again server-side.
export const submitContact = F(async ({ name, email, phone, subject, body }) => {
  const r = await supabase.rpc('submit_contact_ticket', {
    p_name: name,
    p_email: email,
    p_phone: phone || null,
    p_subject: subject || null,
    p_body: body
  })
  if (r.error) {
    const code = String(r.error.message || '')
    const friendly =
      code.includes('INVALID_NAME') ? 'Please enter your full name.'
      : code.includes('INVALID_EMAIL') ? 'Please enter a valid email address.'
      : code.includes('INVALID_PHONE') ? 'Phone must be a valid +91 Indian mobile number.'
      : code.includes('INVALID_BODY') ? 'Your message must be at least 10 characters.'
      : code.includes('spam') ? 'Submission blocked as spam.'
      : 'We could not send your message. Please try again.'
    return { data: null, error: { message: friendly, code } }
  }
  return { data: r.data, error: null }
})

export { PLATFORM }