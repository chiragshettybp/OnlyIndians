import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
  window.scrollTo = vi.fn()
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

// ---- Mutable auth/session/db state that tests can drive (mirrors rpcQueue) ----
const routeState = { session: null, profileRow: null, files: new Map() }
export const authMocks = {
  setSession(s) { routeState.session = s },
  getSession() { return routeState.session },
  sets (s) { routeState.session = s },
  setProfileRow(p) { routeState.profileRow = p },
  queue: { signUp: [], signInWithPassword: [], verifyOtp: [], updateUser: [], resetPasswordForEmail: [], resend: [], signOut: [] },
  lastSignUpArgs: null,
  lastSignInArgs: null,
  lastUpdateArgs: null,
  emitAuthCbs: [],
  emitAuth(event, session) {
    routeState.session = session ?? routeState.session
    this.emitAuthCbs.forEach((cb) => cb(event, routeState.session))
  }
}

function queryResult() {
  if (routeState.profileRow) return { data: routeState.profileRow, error: null, count: null }
  return { data: [], error: null }
}

// Chainable stub: every chained method returns the same awaitable so any query
// shape resolves to the current profileRow / empty result.
function makeQueryStub() {
  const callable = function q() { return stub }
  const stub = new Proxy(callable, {
    get: (target, prop) => {
      if (prop === 'then') {
        return (onF, onR) => Promise.resolve(queryResult()).then(onF, onR)
      }
      if (prop === 'catch' || prop === 'finally') return undefined
      return callable
    },
    apply: () => stub
  })
  return stub
}

function popKey(key) {
  return authMocks.queue[key].length ? authMocks.queue[key].shift() : null
}

function createAuthStub() {
  return {
    getSession: async () => ({ data: { session: routeState.session }, error: null }),
    onAuthStateChange: (cb) => {
      authMocks.emitAuthCbs.push(cb)
      return { data: { subscription: { unsubscribe: () => { authMocks.emitAuthCbs = authMocks.emitAuthCbs.filter((l) => l !== cb) } } } }
    },
    signUp: async (args) => {
      authMocks.lastSignUpArgs = args
      return popKey('signUp') ?? { data: { user: null }, error: null }
    },
    signInWithPassword: async ({ email, password }) => {
      authMocks.lastSignInArgs = { email, password }
      const r = popKey('signInWithPassword')
      return r ?? { data: { user: null }, error: null }
    },
    signOut: async () => {
      routeState.session = null
      return popKey('signOut') ?? { error: null }
    },
    resetPasswordForEmail: async () => popKey('resetPasswordForEmail') ?? { error: null },
    updateUser: async (args) => {
      authMocks.lastUpdateArgs = args
      return popKey('updateUser') ?? { data: { user: null }, error: null }
    },
    verifyOtp: async () => popKey('verifyOtp') ?? { data: { session: null }, error: null },
    resend: async () => popKey('resend') ?? { error: null }
  }
}

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn(() => ({
      auth: createAuthStub(),
      from: () => makeQueryStub(),
      rpc: () => (rpcQueue.length ? rpcQueue.shift() : makeQueryStub()),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: 'mock/uploaded' }, error: null }),
          createSignedUrl: async () => ({ data: { signedUrl: 'https://mock/signed' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: 'https://mock/public' } })
        })
      },
      channel: () => ({ on: () => ({ subscribe: () => ({}) }) })
    }))
  }
})

// Tests can push RPC results one-shot (public contact tests drive error paths).
export const rpcQueue = []

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  document.title = ''
  routeState.session = null
  routeState.profileRow = null
  routeState.files.clear()
  authMocks.emitAuthCbs = []
  authMocks.lastSignUpArgs = null
  authMocks.lastSignInArgs = null
  authMocks.lastUpdateArgs = null
  Object.values(authMocks.queue).forEach((q) => q.length = 0)
})