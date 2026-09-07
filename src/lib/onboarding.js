import { SUBSCRIBER_STEPS, CREATOR_STEPS } from './constants'

export const stepsFor = (role) => (role === 'creator' ? CREATOR_STEPS : SUBSCRIBER_STEPS)

// Given the current onboarding route, returns step metadata + prev/next routes.
// The final step's `next` points to the standalone /complete route.
export function stepNeighbors(role, route) {
  const steps = stepsFor(role)
  const index = steps.findIndex((s) => s.route === route)
  const step = index >= 0 ? steps[index] : null
  const completeRoute = `/${role}/onboarding/complete`
  return {
    step,
    index,
    total: steps.length,
    prev: index > 0 ? steps[index - 1].route : null,
    next: step && index < steps.length - 1 ? steps[index + 1].route : (step ? completeRoute : null)
  }
}

const IMG_RE = /^image\/(png|jpe?g|webp)$/
const DOC_RE = /^(application\/pdf|image\/(png|jpe?g|webp))$/

export function pickImageFile(file, maxBytes = 6 * 1024 * 1024, label = 'image') {
  if (!file) return { error: 'Choose a file to continue.' }
  if (!IMG_RE.test(file.type)) return { error: `${label} must be a PNG, JPEG or WebP.` }
  if (file.size > maxBytes) return { error: `${label} must be under ${Math.round(maxBytes / 1024 / 1024)} MB.` }
  return { file }
}

export function pickDocFile(file, maxBytes = 8 * 1024 * 1024) {
  if (!file) return { error: 'Choose a document to continue.' }
  if (!DOC_RE.test(file.type)) return { error: 'Documents must be a PDF, PNG, JPEG or WebP.' }
  if (file.size > maxBytes) return { error: 'Each document must be under 8 MB.' }
  return { file }
}

export function extOf(name = '') {
  const e = name.split('.').pop()?.toLowerCase()
  return e && e !== name ? e : 'jpg'
}

export const avatarKey = (uid, name) => `${uid}/avatar.${extOf(name)}`
export const bannerKey = (uid, name) => `${uid}/banner.${extOf(name)}`