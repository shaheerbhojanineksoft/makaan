import { useEffect, useRef, useState } from 'react'
import {
  Camera,
  LogOut,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Scale,
  ShieldCheck,
} from 'lucide-react'

import Logo from '../../components/ui/Logo'
import {
  getLawyerProfile,
  isLawyerRegistered,
  saveLawyerProfile,
  useLawyerProfileStore,
} from '../../utils/lawyerProfileStore'
import { DEMO_LAWYER_ID, useSession } from '../../utils/session'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

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

function readImageFile(file, onReady) {
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') onReady(reader.result)
  }
  reader.readAsDataURL(file)
}

export default function LawyerProfile({ onSignOut }) {
  useLawyerProfileStore()
  const session = useSession()
  const lawyerId = session.lawyerId || DEMO_LAWYER_ID
  const avatarInputRef = useRef(null)
  const registered = isLawyerRegistered(lawyerId)
  const [editing, setEditing] = useState(() => !isLawyerRegistered(lawyerId))
  const [form, setForm] = useState(() => getLawyerProfile(lawyerId))

  useEffect(() => {
    const next = getLawyerProfile(lawyerId)
    setForm(next)
    setEditing(!Boolean(next.registered))
  }, [lawyerId])

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const bioChars = String(form.bio || '').length
  const profile = getLawyerProfile(lawyerId)

  function handleBioChange(value) {
    set('bio', String(value || '').slice(0, MAX_BIO_CHARS))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (bioChars > MAX_BIO_CHARS) return
    saveLawyerProfile(lawyerId, {
      name: form.name.trim(),
      city: form.city.trim(),
      specialty: form.specialty.trim(),
      bio: form.bio.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      avatar: form.avatar,
      registered: true,
    })
    setEditing(false)
  }

  function startUpdate() {
    setForm(getLawyerProfile(lawyerId))
    setEditing(true)
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Logo link={false} />
          <div className="flex flex-wrap items-center justify-end gap-2">
            {registered && !editing ? (
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
        {!editing && registered ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-brand-soft/40 p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold tracking-[0.16em] text-emerald-700 uppercase">
                    Registration complete
                  </p>
                  <h1 className="mt-1.5 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    You are successfully registered as lawyer
                  </h1>
                  <p className="mt-2 text-sm text-slate-600">
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
                {registered ? 'Update your info' : 'Complete your registration'}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {registered
                  ? 'Edit your details below, then submit to save the changes.'
                  : 'Fill the same details that appear on your trusted lawyer card, then submit.'}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
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
                      <Camera className="h-7 w-7" />
                    </span>
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-slate-900/0 transition group-hover:bg-slate-900/40">
                    <Camera className="h-5 w-5 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100" />
                  </span>
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    readImageFile(file, (dataUrl) => set('avatar', dataUrl))
                    e.target.value = ''
                  }}
                />
                <div className="text-center sm:pt-2 sm:text-left">
                  <p className="text-sm font-bold text-slate-800">Profile picture</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Tap the photo to upload. Shown on your lawyer card.
                  </p>
                </div>
              </div>

              <Field label="Full name">
                <input
                  className={FIELD}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Adv. Bilal Ahmed"
                  required
                />
              </Field>

              <Field label="Location">
                <input
                  className={FIELD}
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="e.g. Lahore"
                  required
                />
              </Field>

              <div>
                <Field label="Specialist in">
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
                <Field label="Bio">
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
                    bioChars >= MAX_BIO_CHARS ? 'text-rose-600' : 'text-slate-400'
                  }`}
                >
                  {bioChars}/{MAX_BIO_CHARS} letters
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone number for calling">
                  <input
                    className={FIELD}
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="+92 42 3567 0202"
                    required
                  />
                </Field>
                <Field label="Phone number for WhatsApp">
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
                {registered ? (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(getLawyerProfile(lawyerId))
                      setEditing(false)
                    }}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                  >
                    Cancel
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="inline-flex w-full flex-1 items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
                >
                  {registered ? 'Save changes' : 'Submit'}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
