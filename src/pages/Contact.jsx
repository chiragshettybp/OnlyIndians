import { useState } from 'react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Icon from '../components/ui/Icon'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import { usePageTitle } from '../hooks/usePageTitle'
import { submitContact } from '../lib/api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+91[6-9][0-9]{9}$/

const empty = { name: '', phone: '', email: '', subject: '', body: '', website: '' }

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (values.phone.trim() && !PHONE_RE.test(`+91${values.phone.trim()}`)) errors.phone = 'Enter a valid 10-digit Indian mobile number.'
  if (!values.subject.trim() || values.subject.trim().length > 120) errors.subject = 'Please enter a short subject (max 120 characters).'
  if (values.body.trim().length < 10) errors.body = 'Please tell us a little more (at least 10 characters).'
  return errors
}

export default function Contact() {
  usePageTitle('Contact Support')
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [serverError, setServerError] = useState('')
  const [ticketId, setTicketId] = useState('')

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: '' }))
    if (serverError) setServerError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate(values)
    const clean = Object.fromEntries(Object.entries(errs).filter(([, v]) => v))
    setErrors(clean)
    if (Object.keys(clean).length) return

    // Honeypot: bots fill a hidden field. Pretend success, send nothing.
    if (values.website.trim()) {
      setStatus('success')
      return
    }

    setStatus('submitting')
    const { data, error } = await submitContact({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() ? `+91${values.phone.trim()}` : null,
      subject: values.subject.trim(),
      body: values.body.trim()
    })
    if (error) {
      setStatus('idle')
      setServerError(error.message)
      return
    }
    setTicketId(String(data ?? ''))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
        <header>
          <Badge tone="success" icon="check_circle">Message sent</Badge>
          <h1 className="text-title-1 text-[#1a1c20] mt-3">Thanks for reaching out.</h1>
          <p className="text-callout text-[#434655] mt-2">
            Your message is on its way to our 24/7 concierge team. We&apos;ll reply to your verified email address
            shortly.
          </p>
        </header>

        <section className="giant-card overflow-hidden">
          <div className="bg-white px-5 py-4 flex items-center gap-3">
            <span className="w-11 h-11 shrink-0 rounded-2xl bg-[#e6f4e6] text-[#2e7d32] grid place-items-center">
              <Icon name="confirmation_number" size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-footnote text-[#434655]">Ticket reference</p>
              <p className="text-headline text-[#1a1c20] break-all">{ticketId || '—'}</p>
            </div>
          </div>
          <div className="bg-white px-5 py-4 flex items-start gap-3">
            <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#eef0f7] text-[#004ac6] grid place-items-center">
              <Icon name="schedule" size={20} />
            </span>
            <p className="text-footnote text-[#434655]">
              Tickets are acknowledged promptly. For urgent account or payment issues, quote your ticket reference
              when you reply in the same email thread.
            </p>
          </div>
        </section>

        <Button variant="secondary" block onClick={() => { setValues(empty); setStatus('idle') }}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      <header>
        <Badge tone="primary" icon="support_agent">Contact Support</Badge>
        <h1 className="text-title-1 text-[#1a1c20] mt-3">How can we help?</h1>
        <p className="text-callout text-[#434655] mt-2">
          We reply to your verified email. Reports are acknowledged promptly and resolved with written notice
          under the Indian IT Rules (2021).
        </p>
      </header>

      {serverError ? (
        <div role="alert" className="hairline giant-card p-4 flex gap-3 border-[#ba1a1a] bg-[#ffedec]">
          <Icon name="error_outline" size={20} className="text-[#ba1a1a] shrink-0 mt-0.5" />
          <p className="text-footnote font-semibold text-[#ba1a1a]">{serverError}</p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} noValidate className="giant-card p-5 space-y-4">
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={set('website')}
            aria-label="Do not fill this field"
          />
        </div>

        <Field label="Full name" required error={errors.name} id="contact-name">
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            icon="person_outline"
            placeholder="Your full name"
            value={values.name}
            onChange={set('name')}
            invalid={Boolean(errors.name)}
          />
        </Field>

        <Field label="Phone (India, +91)" hint="Optional — required for urgent account/payment issues" error={errors.phone} id="contact-phone">
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            prefix="+91"
            placeholder="9876543210"
            value={values.phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
              setValues((v) => ({ ...v, phone: digits }))
              if (errors.phone) setErrors((er) => ({ ...er, phone: '' }))
            }}
            invalid={Boolean(errors.phone)}
          />
        </Field>

        <Field label="Email" required error={errors.email} id="contact-email">
          <Input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            icon="mail_outline"
            placeholder="you@example.com"
            value={values.email}
            onChange={set('email')}
            invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Subject" required error={errors.subject} id="contact-subject">
          <Input
            id="contact-subject"
            name="subject"
            icon="short_text"
            placeholder="What is this about?"
            value={values.subject}
            onChange={set('subject')}
            invalid={Boolean(errors.subject)}
          />
        </Field>

        <Field label="Message" required error={errors.body} id="contact-body">
          <Textarea
            id="contact-body"
            name="body"
            placeholder="Tell us what happened and how we can help…"
            value={values.body}
            onChange={set('body')}
            invalid={Boolean(errors.body)}
          />
        </Field>

        <Button
          type="submit"
          block
          size="lg"
          loading={status === 'submitting'}
          iconName="send"
        >
          Send message
        </Button>
        <p className="text-center text-caption-1 text-[#737686]">
          Protected by encrypted sessions · No SMS spam, ever.
        </p>
      </form>
    </div>
  )
}