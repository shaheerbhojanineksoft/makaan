import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Camera,
  LogOut,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Scale,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import Logo from '../../components/ui/Logo'
import Toast from '../../components/ui/Toast'
import { webApi } from '../../utils/api'
import {
  getLawyerProfile,
  mapAccountToLawyerForm,
  saveLawyerProfile,
  useLawyerProfileStore,
} from '../../utils/lawyerProfileStore'
import {
  DEMO_LAWYER_ID,
  isLawyerProfileCompleted,
  updateSessionAccount,
  useSession,
} from '../../utils/session'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const MIN_BIO_CHARS = 50
const MAX_BIO_CHARS = 500

const SPECIALTY_SUGGESTIONS = [
  'Title verification & society transfers',
  'Plot disputes & registry checks',
  'Apartment allotments & POA review',
  'Rent agreements & deposit protection',
  'Commercial property & due diligence',
  'First-time buyer advisory',
  'Fraud-risk screening & document audit',
  'Local transfers & family property',
]

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  )
}

function DetailRow({ label, value }) {
  if (!value) return null
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
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

function buildInitialForm(lawyerId, account) {
  const fromAccount = mapAccountToLawyerForm(account || {})
  const saved = getLawyerProfile(lawyerId)
  return {
    ...saved,
    // Prefer Google/sign-in values when present; keep local defaults otherwise
    name: fromAccount.name || saved.name || '',
    email: fromAccount.email || saved.email || '',
    avatar: fromAccount.avatar || saved.avatar || '',
    city: saved.city || fromAccount.city || '',
    specialty: saved.specialty || fromAccount.specialty || '',
    bio: saved.bio || fromAccount.bio || '',
    phone: saved.phone || fromAccount.phone || '',
    whatsapp: saved.whatsapp || fromAccount.whatsapp || '',
    registered: Boolean(fromAccount.isProfileCompleted || saved.registered),
    isProfileCompleted: Boolean(
      fromAccount.isProfileCompleted || saved.isProfileCompleted,
    ),
  }
}

export default function LawyerProfile({ onSignOut }) {
  useLawyerProfileStore()
  const session = useSession()
  const lawyerId = session.lawyerId || session.accountId || DEMO_LAWYER_ID
  const profileCompleted = isLawyerProfileCompleted(session)
  const avatarInputRef = useRef(null)

  const accountKey = JSON.stringify(session.account || {})

  const [editing, setEditing] = useState(() => !profileCompleted)
  const [form, setForm] = useState(() => buildInitialForm(lawyerId, session.account))
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [toastVariant, setToastVariant] = useState('error')
  const clearToast = useCallback(() => setToast(''), [])

  // Re-hydrate only when stored account JSON actually changes (not on every render)
  useEffect(() => {
    const account = JSON.parse(accountKey)
    const next = buildInitialForm(lawyerId, account)
    setForm(next)
    setEditing(!Boolean(account?.isProfileCompleted || next.registered))
  }, [lawyerId, accountKey])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const bioChars = String(form.bio || '').length
  const profile = {
    ...getLawyerProfile(lawyerId),
    ...mapAccountToLawyerForm(session.account || {}),
    ...form,
  }

  function handleBioChange(value) {
    set('bio', String(value || '').slice(0, MAX_BIO_CHARS))
  }

  function validateForm() {
    const name = form.name.trim()
    const city = form.city.trim()
    const specialty = form.specialty.trim()
    const bio = form.bio.trim()
    const phone = form.phone.trim()
    const whatsapp = form.whatsapp.trim()
    const avatar = (form.avatar || '').trim()

    if (!avatar) return 'Profile picture is required.'
    if (!name) return 'Full name is required.'
    if (!city) return 'Location is required.'
    if (!specialty) return 'Specialist in is required.'
    if (!bio) return 'Bio is required.'
    if (bio.length < MIN_BIO_CHARS) {
      return `Bio must be at least ${MIN_BIO_CHARS} characters (including spaces).`
    }
    if (bio.length > MAX_BIO_CHARS) return `Bio must be ${MAX_BIO_CHARS} characters or less.`
    if (!phone) return 'Phone number for calling is required.'
    if (!whatsapp) return 'Phone number for WhatsApp is required.'

    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return

    const errorMessage = validateForm()
    if (errorMessage) {
      setToastVariant('error')
      setToast(errorMessage)
      return
    }

    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      specialty: form.specialty.trim(),
      bio: form.bio.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      avatar: form.avatar.trim(),
      registered: true,
      isProfileCompleted: true,
    }

    setLoading(true)
    setToast('')
    try {
      const updated = await webApi('/profile/lawyer', {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
      })
      const nextAccount = updateSessionAccount(
        updated || {
          ...session.account,
          fullname: payload.name,
          location: payload.city,
          SpecialistIn: payload.specialty,
          Bio: payload.bio,
          phonenumber: payload.phone,
          whatsappNumber: payload.whatsapp,
          profilePicture: payload.avatar,
          registered: true,
          isProfileCompleted: true,
        },
      )
      saveLawyerProfile(lawyerId, {
        ...payload,
        email: nextAccount?.email || session.account?.email || form.email || '',
      })
      setEditing(false)
      setToastVariant('success')
      setToast('Profile saved successfully.')
    } catch (error) {
      setToastVariant('error')
      setToast(error?.message || 'Could not save profile.')
    } finally {
      setLoading(false)
    }
  }

  function startUpdate() {
    setForm(buildInitialForm(lawyerId, session.account))
    setEditing(true)
  }

  const showDetails = profileCompleted && !editing

  return (
    <div className="min-h-screen bg-offwhite">
      <Toast
        open={Boolean(toast)}
        message={toast}
        variant={toastVariant}
        onClose={clearToast}
      />
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Logo link={false} />
          <div className="flex flex-wrap items-center justify-end gap-2">
            {showDetails ? (
              <button
                type="button"
                onClick={startUpdate}
                className="inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-brand-soft px-3 py-2 text-sm font-bold text-brand transition hover:bg-brand/10 sm:px-3.5"
              >
                <Pencil className="h-4 w-4" />
                Update your info
              </button>
            ) : null}
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-50 sm:px-3.5"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-8">
        {showDetails ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-brand-soft/40 px-3.5 py-2.5 shadow-sm sm:px-4 sm:py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold tracking-[0.14em] text-emerald-700 uppercase">
                    Registration complete
                  </p>
                  <h1 className="mt-0.5 font-display text-base font-extrabold text-slate-900 sm:text-lg">
                    You are successfully registered as lawyer
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Your details are saved. Use Update your info anytime to edit them.
                  </p>
                </div>
              </div>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
                  <Scale className="h-3.5 w-3.5" />
                  Your submitted details
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-brand/15 bg-brand-soft">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full place-items-center text-brand">
                        <Scale className="h-8 w-8" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 text-center sm:text-left">
                    <h2 className="font-display text-xl font-extrabold text-slate-900">
                      {profile.name || '—'}
                    </h2>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-brand" />
                      {profile.city || '—'}
                    </p>
                    <p className="mt-2 text-sm font-bold text-brand">{profile.specialty || '—'}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/60 px-4">
                  <DetailRow label="Full name" value={profile.name} />
                  <DetailRow label="Email" value={profile.email} />
                  <DetailRow label="Location" value={profile.city} />
                  <DetailRow label="Specialist in" value={profile.specialty} />
                  <DetailRow label="Bio" value={profile.bio} />
                  <DetailRow label="Phone (call)" value={profile.phone} />
                  <DetailRow label="Phone (WhatsApp)" value={profile.whatsapp} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.phone ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand">
                      <Phone className="h-3.5 w-3.5" />
                      {profile.phone}
                    </span>
                  ) : null}
                  {profile.whatsapp ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {profile.whatsapp}
                    </span>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <>
            <div className="mb-5 sm:mb-6">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
                <Scale className="h-3.5 w-3.5" />
                Lawyer profile
              </p>
              <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {profileCompleted ? 'Update your info' : 'Complete your registration'}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {profileCompleted
                  ? 'Edit your details below, then submit to save the changes.'
                  : 'Fill the same details that appear on your trusted lawyer card, then submit.'}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-7"
            >
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="group relative block h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-brand/15 bg-brand-soft shadow-sm"
                  aria-label="Upload profile picture"
                >
                  {form.avatar ? (
                    <img src={form.avatar} alt="" className="h-full w-full object-cover" />
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
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    compressImageFile(file, (dataUrl) => set('avatar', dataUrl))
                    e.target.value = ''
                  }}
                />
                <div className="text-center sm:pt-2 sm:text-left">
                  <p className="text-sm font-bold text-slate-800">
                    Profile picture <span className="text-rose-500">*</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Tap the photo to upload. Shown on your lawyer card.
                  </p>
                </div>
              </div>

              <Field label="Full name *">
                <input
                  className={FIELD}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Adv. Bilal Ahmed"
                  required
                />
              </Field>

              <Field label="Location *">
                <input
                  className={FIELD}
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="e.g. Lahore"
                  required
                />
              </Field>

              <div>
                <Field label="Specialist in *">
                  <input
                    className={FIELD}
                    value={form.specialty}
                    onChange={(e) => set('specialty', e.target.value)}
                    placeholder="e.g. Plot disputes & registry checks"
                    required
                  />
                </Field>
                <p className="mt-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                  Suggestions — tap one to fill
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SPECIALTY_SUGGESTIONS.map((option) => {
                    const active = form.specialty === option
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => set('specialty', option)}
                        className={`rounded-full px-3 py-1.5 text-left text-xs font-bold transition ${
                          active
                            ? 'bg-brand text-white shadow-sm shadow-brand/20'
                            : 'bg-brand-soft text-brand ring-1 ring-brand/15 hover:bg-brand/10'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Field label="Bio *">
                  <textarea
                    className={`${FIELD} min-h-[140px] resize-y`}
                    value={form.bio}
                    onChange={(e) => handleBioChange(e.target.value)}
                    maxLength={MAX_BIO_CHARS}
                    placeholder="Short description of how you help property buyers and sellers…"
                    required
                  />
                </Field>
                <p
                  className={`mt-1.5 text-right text-[11px] font-semibold ${
                    bioChars > 0 && bioChars < MIN_BIO_CHARS
                      ? 'text-amber-600'
                      : bioChars >= MAX_BIO_CHARS
                        ? 'text-rose-600'
                        : 'text-slate-400'
                  }`}
                >
                  {bioChars}/{MAX_BIO_CHARS} · min {MIN_BIO_CHARS} characters
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone number for calling *">
                  <input
                    className={FIELD}
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="+92 42 3567 0202"
                    required
                  />
                </Field>
                <Field label="Phone number for WhatsApp *">
                  <input
                    className={FIELD}
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => set('whatsapp', e.target.value)}
                    placeholder="0323 2910307"
                    required
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {profileCompleted ? (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(buildInitialForm(lawyerId, session.account))
                      setEditing(false)
                    }}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                  >
                    Cancel
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full flex-1 items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? 'Saving…'
                    : profileCompleted
                      ? 'Save changes'
                      : 'Submit'}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
