import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Mail, Phone, UserRound } from 'lucide-react'

import Toast from '../components/ui/Toast'
import { webApi } from '../utils/api'
import {
  getSession,
  isUserProfileCompleted,
  updateSessionAccount,
  useSession,
} from '../utils/session'

const FIELD_CLASS =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const PHONE_PATTERN = /^\+?[0-9][0-9\s\-()]*[0-9]$/

function Field({ label, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  )
}

function displayOrDash(value) {
  const text = (value ?? '').toString().trim()
  return text || '-'
}

function fromFormValue(value) {
  const text = (value ?? '').toString().trim()
  if (!text || text === '-') return ''
  return text
}

function sanitizePhoneInput(value) {
  return value.replace(/[^\d+\-\s()]/g, '')
}

function isValidPhone(value) {
  const phone = fromFormValue(value)
  if (!phone || !PHONE_PATTERN.test(phone)) return false
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

function buildForm(account = {}) {
  return {
    name: displayOrDash(account.fullname || account.name),
    email: displayOrDash(account.email),
    phone: displayOrDash(account.phoneNumber || account.phone),
    profilePicture: (account.profilePicture || account.avatar || '').trim(),
  }
}

function compressImageFile(file, onReady) {
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result !== 'string') return
    const img = new Image()
    img.onload = () => {
      const maxSize = 512
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const width = Math.max(1, Math.round(img.width * scale))
      const height = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        onReady(reader.result)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      onReady(canvas.toDataURL('image/jpeg', 0.72))
    }
    img.onerror = () => onReady(reader.result)
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

export default function Profile() {
  const navigate = useNavigate()
  const session = useSession()
  const photoInputRef = useRef(null)
  const [form, setForm] = useState(() => buildForm(session.account))
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [toastVariant, setToastVariant] = useState('error')

  const clearToast = useCallback(() => setToast(''), [])
  const accountKey = JSON.stringify(session.account || {})

  useEffect(() => {
    setForm(buildForm(JSON.parse(accountKey)))
  }, [accountKey])

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      name: fromFormValue(form.name),
      phone: fromFormValue(form.phone),
      profilePicture: fromFormValue(form.profilePicture),
      isProfileCompleted: true,
    }

    if (!payload.name || !payload.phone) {
      setToastVariant('error')
      setToast('Name and phone are required.')
      return
    }

    if (!isValidPhone(payload.phone)) {
      setToastVariant('error')
      setToast('Enter a valid phone number (digits only).')
      return
    }

    setLoading(true)
    setToast('')

    try {
      const updated = await webApi('/profile/user', {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
      })
      updateSessionAccount(updated || { ...session.account, ...payload, fullname: payload.name, phoneNumber: payload.phone })
      setToastVariant('success')
      setToast('Profile updated successfully.')
      window.setTimeout(() => {
        navigate('/', { replace: true })
      }, 600)
    } catch (err) {
      setToastVariant('error')
      setToast(err?.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const forcingCompletion =
    session.role === 'user' && !isUserProfileCompleted(getSession())

  return (
    <section className="bg-offwhite py-12 sm:py-16">
      <Toast
        open={Boolean(toast)}
        message={toast}
        variant={toastVariant}
        duration={3000}
        onClose={clearToast}
      />

      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="group relative block h-24 w-24 overflow-hidden rounded-full bg-brand-soft ring-4 ring-brand-soft"
              aria-label="Change profile picture"
            >
              {form.profilePicture && form.profilePicture !== '-' ? (
                <img
                  src={form.profilePicture}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="grid h-full place-items-center text-brand">
                  <UserRound className="h-8 w-8" />
                </span>
              )}
              <span className="absolute inset-0 grid place-items-center bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </span>
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                compressImageFile(file, (dataUrl) => set('profilePicture', dataUrl))
                e.target.value = ''
              }}
            />
            <p className="mt-2 text-xs font-semibold text-slate-400">
              Tap the photo to upload a new profile picture
            </p>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
              {forcingCompletion ? 'Complete your profile' : 'My Profile'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {forcingCompletion
                ? 'Fill your details once before using Makaan.'
                : 'Update your basic account details.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field label="Full name" htmlFor="profile-name">
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                  aria-hidden="true"
                />
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => set('name', event.target.value)}
                  className={`${FIELD_CLASS} pl-10`}
                  placeholder="Your full name"
                />
              </div>
            </Field>

            <Field label="Email" htmlFor="profile-email">
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                  aria-hidden="true"
                />
                <input
                  id="profile-email"
                  type="email"
                  value={form.email}
                  disabled
                  readOnly
                  className={`${FIELD_CLASS} cursor-not-allowed bg-slate-50 pl-10 text-slate-500`}
                />
              </div>
            </Field>

            <Field label="Phone number" htmlFor="profile-phone">
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                  aria-hidden="true"
                />
                <input
                  id="profile-phone"
                  type="tel"
                  inputMode="tel"
                  required
                  value={form.phone}
                  onChange={(event) => set('phone', sanitizePhoneInput(event.target.value))}
                  className={`${FIELD_CLASS} pl-10`}
                  placeholder="03XXXXXXXXX"
                />
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading || Boolean(toast)}
              className="mt-2 w-full rounded-xl bg-brand px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Updating…' : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
