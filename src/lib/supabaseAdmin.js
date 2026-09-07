/**
 * SERVER-SIDE ONLY — DO NOT IMPORT FROM BROWSER CODE.
 *
 * This client uses the Supabase service role key which bypasses Row Level
 * Security. It MUST NOT be bundled into the client. Keep it in .env.service-role
 * (not a VITE_* prefixed variable) and only use it inside:
 *   - Supabase Edge Functions
 *   - Node.js scripts / cron jobs
 *   - A backend API server
 *
 * On the frontend always use `@/lib/supabase` (anon key + RLS).
 */

const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  throw new Error(
    'supabaseAdmin: service role key would be exposed in the browser. Use this module server-side only.'
  )
}

import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

function readEnvVar(file, name) {
  try {
    const raw = readFileSync(new URL(file, import.meta.url), 'utf8')
    const line = raw.split('\n').find((l) => l.startsWith(`${name}=`))
    if (!line) return undefined
    return line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '')
  } catch {
    return undefined
  }
}

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || readEnvVar('../../.env', 'VITE_SUPABASE_URL')

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  readEnvVar('../../.env.service-role', 'SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing service role configuration. Set SUPABASE_SERVICE_ROLE_KEY in .env.service-role (see .env.example).'
  )
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})