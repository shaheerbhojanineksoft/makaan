import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Camera, ImagePlus, X } from 'lucide-react'

import Toast from '../../components/ui/Toast'
import { AGENCY_SERVICES, AGENCY_SPECIALIZATIONS } from '../../data/agents'
import { CITIES } from '../../data/filters'
import { webApi } from '../../utils/api'
import { getAgencyProfile, updateAgencyProfile, useAgencyStore } from '../../utils/agencyStore'
import {
  isAgencyProfileCompleted,
  updateSessionAccount,
  useSession,
} from '../../utils/session'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const MIN_BIO_CHARS = 50
const MAX_BIO_CHARS = 500

const RESPONSE_TIME_OPTIONS = ['Within 1 hour', 'Within 2 hours', 'Within 24 hours']

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  )
}

function AreasServedTagsInput({ tags, onChange }) {
  const [draft, setDraft] = useState('')
  const [localError, setLocalError] = useState('')

  function addTag() {
    const value = draft.trim()
    if (!value) return
    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      setLocalError('This area is already added.')
      return
    }
    onChange([...tags, value])
    setDraft('')
    setLocalError('')
  }

  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        Areas served *
      </p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              onClick={() => onChange(tags.filter((item) => item !== tag))}
              className="grid h-4 w-4 place-items-center rounded-full hover:bg-brand/15"
              aria-label="Remove area"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className={`${FIELD} mt-0`}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            if (localError) setLocalError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag()
            }
          }}
          placeholder="Type area and press Enter"
        />
        <button
          type="button"
          onClick={addTag}
          className="mt-0 shrink-0 rounded-xl border border-brand/20 bg-brand-soft px-4 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
        >
          Add
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">Press Enter to save each area as a tag</p>
      {localError && <p className="mt-1 text-xs font-bold text-rose-600">{localError}</p>}
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
      const maxSize = 1280
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

function pickText(...values) {
  for (const value of values) {
    const text = (value ?? '').toString().trim()
    if (text) return text
  }
  return ''
}

function pickPositiveNumber(accountValue, savedValue) {
  const fromAccount = Number(accountValue)
  if (Number.isFinite(fromAccount) && fromAccount > 0) return fromAccount
  const fromSaved = Number(savedValue)
  if (Number.isFinite(fromSaved) && fromSaved > 0) return fromSaved
  return ''
}

function pickList(accountList, savedList) {
  if (Array.isArray(accountList) && accountList.length) return [...accountList]
  if (Array.isArray(savedList) && savedList.length) return [...savedList]
  return []
}

/** Prefill only sign-in + locally saved values — never inject demo agency fake data. */
function buildForm(agencyId, account = {}) {
  const saved = getAgencyProfile(agencyId) || {}
  const picture = pickText(account.profilePicture, saved.profilePicture, saved.avatar)
  return {
    name: pickText(account.name, saved.name),
    agency: pickText(account.agency, saved.agency),
    city: pickText(account.city, saved.city),
    phone: pickText(account.phone, saved.phone),
    whatsapp: pickText(account.whatsapp, saved.whatsapp),
    email: pickText(account.email, saved.email),
    officeAddress: pickText(account.officeAddress, saved.officeAddress),
    bio: pickText(account.bio, saved.bio),
    profilePicture: picture,
    coverImage: pickText(account.coverImage, saved.coverImage),
    licenseNumber: pickText(account.licenseNumber, saved.licenseNumber),
    responseTime: RESPONSE_TIME_OPTIONS.includes(
      pickText(account.responseTime, saved.responseTime),
    )
      ? pickText(account.responseTime, saved.responseTime)
      : '',
    experienceYears: pickPositiveNumber(account.experienceYears, saved.experienceYears),
    teamSize: pickPositiveNumber(account.teamSize, saved.teamSize),
    specializations: pickList(account.specializations, saved.specializations),
    customSpecializations: '',
    areasServed: pickList(account.areasServed, saved.areasServed),
    services: pickList(account.services, saved.services),
    customServices: '',
  }
}

export default function AgencyProfileEdit() {
  useAgencyStore()
  const navigate = useNavigate()
  const session = useSession()
  const { agencyId } = useOutletContext()
  const profileCompleted = isAgencyProfileCompleted(session)
  const coverInputRef = useRef(null)
  const avatarInputRef = useRef(null)

  const accountKey = JSON.stringify(session.account || {})
  const [form, setForm] = useState(() => buildForm(agencyId, session.account))
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [toastVariant, setToastVariant] = useState('error')
  const clearToast = useCallback(() => setToast(''), [])

  useEffect(() => {
    setForm(buildForm(agencyId, JSON.parse(accountKey)))
  }, [agencyId, accountKey])

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function toggleListItem(key, value) {
    setForm((current) => {
      const list = current[key]
      const has = list.includes(value)
      return {
        ...current,
        [key]: has ? list.filter((item) => item !== value) : [...list, value],
      }
    })
  }

  function resolveLists() {
    const specializations = [
      ...form.specializations,
      ...form.customSpecializations
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ].filter((item, index, list) => list.indexOf(item) === index)

    const services = [
      ...form.services,
      ...form.customServices
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ].filter((item, index, list) => list.indexOf(item) === index)

    return { specializations, services, areasServed: form.areasServed }
  }

  function validateForm() {
    const name = form.name.trim()
    const agency = form.agency.trim()
    const city = form.city.trim()
    const phone = form.phone.trim()
    const whatsapp = form.whatsapp.trim()
    const email = form.email.trim()
    const officeAddress = form.officeAddress.trim()
    const bio = form.bio.trim()
    const profilePicture = (form.profilePicture || '').trim()
    const coverImage = (form.coverImage || '').trim()
    const licenseNumber = form.licenseNumber.trim()
    const responseTime = form.responseTime.trim()
    const experienceYears = String(form.experienceYears ?? '').trim()
    const teamSize = String(form.teamSize ?? '').trim()
    const { specializations, services, areasServed } = resolveLists()

    if (!coverImage) return 'Cover photo is required.'
    if (!profilePicture) return 'Profile picture is required.'
    if (!name) return 'Contact person is required.'
    if (!agency) return 'Brand / agency name is required.'
    if (!city) return 'City is required.'
    if (!licenseNumber) return 'Licence number is required.'
    if (!phone) return 'Phone number is required.'
    if (!whatsapp) return 'WhatsApp number is required.'
    if (!email) return 'Email is required.'
    if (!officeAddress) return 'Office address is required.'
    if (!responseTime) return 'Select a typical response time.'
    if (!RESPONSE_TIME_OPTIONS.includes(responseTime)) {
      return 'Select a typical response time from the suggestions.'
    }
    if (!experienceYears) return 'Experience (years) is required.'
    if (!teamSize) return 'Team size is required.'
    if (!bio) return 'About the agency is required.'
    if (bio.length < MIN_BIO_CHARS) {
      return `About the agency must be at least ${MIN_BIO_CHARS} characters (including spaces).`
    }
    if (bio.length > MAX_BIO_CHARS) {
      return `About the agency must be ${MAX_BIO_CHARS} characters or less.`
    }
    if (!areasServed.length) return 'Add at least one area served.'
    if (!specializations.length) return 'Select at least one specialization.'
    if (!services.length) return 'Select at least one service.'
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

    const { specializations, services, areasServed } = resolveLists()
    const payload = {
      name: form.name.trim(),
      agency: form.agency.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      officeAddress: form.officeAddress.trim(),
      bio: form.bio.trim(),
      profilePicture: form.profilePicture.trim(),
      coverImage: form.coverImage.trim(),
      licenseNumber: form.licenseNumber.trim(),
      responseTime: form.responseTime.trim(),
      experienceYears: Number(form.experienceYears) || 0,
      teamSize: Number(form.teamSize) || 0,
      specializations,
      areasServed,
      services,
      isProfileCompleted: true,
    }

    setLoading(true)
    setToast('')
    try {
      const updated = await webApi('/profile/agency', {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify(payload),
      })
      updateSessionAccount(updated || { ...session.account, ...payload })
      updateAgencyProfile(agencyId, {
        ...payload,
        avatar: payload.profilePicture,
      })
      setForm((current) => ({
        ...current,
        specializations: [...specializations],
        customSpecializations: '',
        areasServed: [...areasServed],
        services: [...services],
        customServices: '',
      }))
      setToastVariant('success')
      setToast('Profile saved successfully.')
      navigate('/agency', { replace: true })
    } catch (error) {
      setToastVariant('error')
      setToast(error?.message || 'Could not save profile.')
    } finally {
      setLoading(false)
    }
  }

  const extraSpecializations = form.specializations.filter(
    (item) => !AGENCY_SPECIALIZATIONS.includes(item),
  )
  const extraServices = form.services.filter((service) => !AGENCY_SERVICES.includes(service))
  const bioChars = String(form.bio || '').length

  return (
    <div className="space-y-6">
      <Toast
        open={Boolean(toast)}
        message={toast}
        variant={toastVariant}
        onClose={clearToast}
      />

      <div>
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Brand</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
          {profileCompleted ? 'Agency profile' : 'Complete your agency profile'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {profileCompleted
            ? 'These details appear on your public agency page and listing cards.'
            : 'Fill in your agency details before opening the dashboard. Only your Google sign-in name, email and photo are prefilled.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="group relative block h-44 w-full overflow-hidden bg-brand-soft sm:h-56"
            aria-label="Change cover photo"
          >
            {form.coverImage ? (
              <img src={form.coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand">
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm font-bold">Add cover photo *</span>
              </div>
            )}
            <span className="absolute inset-0 bg-slate-900/0 transition group-hover:bg-slate-900/35" />
            <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-brand shadow-sm opacity-90 transition group-hover:opacity-100">
              <Camera className="h-3.5 w-3.5" />
              Change cover
            </span>
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              compressImageFile(file, (dataUrl) => set('coverImage', dataUrl))
              e.target.value = ''
            }}
          />

          <div className="absolute -bottom-12 left-5 sm:left-7">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="group relative block h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-brand-soft shadow-md sm:h-28 sm:w-28"
              aria-label="Change profile photo"
            >
              {form.profilePicture ? (
                <img src={form.profilePicture} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full place-items-center text-brand">
                  <Camera className="h-7 w-7" />
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
                compressImageFile(file, (dataUrl) => set('profilePicture', dataUrl))
                e.target.value = ''
              }}
            />
          </div>
        </div>

        <div className="space-y-5 px-5 pt-16 pb-5 sm:px-7 sm:pb-7">
          <p className="text-xs font-semibold text-slate-400">
            Click the cover or profile photo to upload. All fields are required.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact person *">
              <input
                className={FIELD}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                required
              />
            </Field>
            <Field label="Brand / agency name *">
              <input
                className={FIELD}
                value={form.agency}
                onChange={(e) => set('agency', e.target.value)}
                required
              />
            </Field>
            <Field label="City *">
              <select
                className={FIELD}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                required
              >
                <option value="">Select city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Licence number *">
              <input
                className={FIELD}
                value={form.licenseNumber}
                onChange={(e) => set('licenseNumber', e.target.value)}
                required
              />
            </Field>
            <Field label="Phone number *">
              <input
                className={FIELD}
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+92 300 0000000"
                required
              />
            </Field>
            <Field label="Phone number (WhatsApp) *">
              <input
                className={FIELD}
                type="tel"
                value={form.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
                placeholder="0323 2910307"
                required
              />
            </Field>
            <Field label="Email *">
              <input
                type="email"
                className={`${FIELD} bg-slate-50`}
                value={form.email}
                readOnly
                required
              />
            </Field>
            <Field label="Office address *">
              <input
                className={FIELD}
                value={form.officeAddress}
                onChange={(e) => set('officeAddress', e.target.value)}
                required
              />
            </Field>
            <Field label="Experience (years) *">
              <input
                type="number"
                min="0"
                step="1"
                className={FIELD}
                value={form.experienceYears}
                onChange={(e) => set('experienceYears', e.target.value)}
                placeholder="e.g. 10"
                required
              />
            </Field>
            <Field label="Team size *">
              <input
                type="number"
                min="1"
                step="1"
                className={FIELD}
                value={form.teamSize}
                onChange={(e) => set('teamSize', e.target.value)}
                placeholder="e.g. 15"
                required
              />
            </Field>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
              Typical response time *
            </p>
            <div
              className={`${FIELD} mt-1.5 bg-slate-50 text-slate-700 ${
                form.responseTime ? '' : 'text-slate-400'
              }`}
            >
              {form.responseTime || 'Select one option below'}
            </div>
            <p className="mt-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
              Suggestions — tap one to select
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {RESPONSE_TIME_OPTIONS.map((option) => {
                const active = form.responseTime === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => set('responseTime', option)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
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
            <Field label="About the agency *">
              <textarea
                rows={4}
                className={FIELD}
                value={form.bio}
                onChange={(e) => set('bio', String(e.target.value || '').slice(0, MAX_BIO_CHARS))}
                maxLength={MAX_BIO_CHARS}
                placeholder="Short description of your agency…"
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
          <AreasServedTagsInput
            tags={form.areasServed}
            onChange={(areasServed) => set('areasServed', areasServed)}
          />

          <div>
            <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
              Specializations *
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {[...AGENCY_SPECIALIZATIONS, ...extraSpecializations].map((item) => {
                const checked = form.specializations.includes(item)
                return (
                  <label
                    key={item}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold transition ${
                      checked
                        ? 'border-brand/30 bg-brand-soft text-brand'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-brand/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleListItem('specializations', item)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                    />
                    <span>{item}</span>
                  </label>
                )
              })}
            </div>
            <Field label="Additional specializations (comma separated)">
              <input
                className={FIELD}
                value={form.customSpecializations}
                onChange={(e) => set('customSpecializations', e.target.value)}
                placeholder="e.g. DHA & Bahria Town, Gwadar Free Zone"
              />
            </Field>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
              Services offered *
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {[...AGENCY_SERVICES, ...extraServices].map((service) => {
                const checked = form.services.includes(service)
                return (
                  <label
                    key={service}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold transition ${
                      checked
                        ? 'border-brand/30 bg-brand-soft text-brand'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-brand/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleListItem('services', service)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                    />
                    <span>{service}</span>
                  </label>
                )
              })}
            </div>
            <Field label="Additional services (comma separated)">
              <input
                className={FIELD}
                value={form.customServices}
                onChange={(e) => set('customServices', e.target.value)}
                placeholder="e.g. Legal advisory, Project launches"
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Saving…'
                : profileCompleted
                  ? 'Save profile'
                  : 'Save & continue to dashboard'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
