import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Camera, ImagePlus, X } from 'lucide-react'

import { AGENCY_SERVICES, AGENCY_SPECIALIZATIONS } from '../../data/agents'
import { getAgencyProfile, updateAgencyProfile, useAgencyStore } from '../../utils/agencyStore'
import { CITIES } from '../../data/filters'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

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
      <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Areas served</p>
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

function readImageFile(file, onReady) {
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') onReady(reader.result)
  }
  reader.readAsDataURL(file)
}

export default function AgencyProfileEdit() {
  useAgencyStore()
  const { agencyId } = useOutletContext()
  const saved = getAgencyProfile(agencyId)
  const coverInputRef = useRef(null)
  const avatarInputRef = useRef(null)

  const [form, setForm] = useState({
    name: saved?.name || '',
    agency: saved?.agency || '',
    city: saved?.city || '',
    phone: saved?.phone || '',
    email: saved?.email || '',
    officeAddress: saved?.officeAddress || '',
    bio: saved?.bio || '',
    avatar: saved?.avatar || '',
    coverImage: saved?.coverImage || '',
    licenseNumber: saved?.licenseNumber || '',
    responseTime: saved?.responseTime || '',
    experienceYears: saved?.experienceYears ?? '',
    teamSize: saved?.teamSize ?? '',
    specializations: saved?.specializations?.length
      ? [...saved.specializations]
      : [],
    customSpecializations: '',
    areasServed: saved?.areasServed?.length ? [...saved.areasServed] : [],
    services: saved?.services?.length ? [...saved.services] : [...AGENCY_SERVICES],
    customServices: '',
  })
  const [savedFlash, setSavedFlash] = useState(false)

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

  function handleSubmit(event) {
    event.preventDefault()
    updateAgencyProfile(agencyId, {
      name: form.name.trim(),
      agency: form.agency.trim(),
      city: form.city,
      phone: form.phone.trim(),
      email: form.email.trim(),
      officeAddress: form.officeAddress.trim(),
      bio: form.bio.trim(),
      avatar: form.avatar.trim(),
      coverImage: form.coverImage.trim(),
      licenseNumber: form.licenseNumber.trim(),
      responseTime: form.responseTime.trim(),
      experienceYears: Number(form.experienceYears) || 0,
      teamSize: Number(form.teamSize) || 0,
      specializations: [
        ...form.specializations,
        ...form.customSpecializations
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      ].filter((item, index, list) => list.indexOf(item) === index),
      areasServed: form.areasServed,
      services: [
        ...form.services,
        ...form.customServices
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      ].filter((item, index, list) => list.indexOf(item) === index),
    })
    const next = getAgencyProfile(agencyId)
    setForm((current) => ({
      ...current,
      specializations: next?.specializations?.length ? [...next.specializations] : [],
      customSpecializations: '',
      areasServed: next?.areasServed?.length ? [...next.areasServed] : [],
      services: next?.services?.length ? [...next.services] : [...AGENCY_SERVICES],
      customServices: '',
    }))
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2000)
  }

  const extraSpecializations = form.specializations.filter(
    (item) => !AGENCY_SPECIALIZATIONS.includes(item),
  )
  const extraServices = form.services.filter((service) => !AGENCY_SERVICES.includes(service))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Brand</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Agency profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          These details appear on your public agency page and listing cards.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
      >
        {/* Cover + profile images */}
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
                <span className="text-sm font-bold">Add cover photo</span>
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
              readImageFile(file, (dataUrl) => set('coverImage', dataUrl))
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
              {form.avatar ? (
                <img src={form.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full place-items-center text-brand">
                  <Camera className="h-7 w-7" />
                </span>
              )}
              <span className="absolute inset-0 grid place-items-center bg-slate-900/0 transition group-hover:bg-slate-900/40">
                <Camera className="h-5 w-5 text-white opacity-0 transition group-hover:opacity-100" />
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
          </div>
        </div>

        <div className="space-y-5 px-5 pt-16 pb-5 sm:px-7 sm:pb-7">
          <p className="text-xs font-semibold text-slate-400">
            Click the cover or profile photo to upload a new image.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact person">
              <input className={FIELD} value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </Field>
            <Field label="Brand / agency name">
              <input className={FIELD} value={form.agency} onChange={(e) => set('agency', e.target.value)} required />
            </Field>
            <Field label="City">
              <select className={FIELD} value={form.city} onChange={(e) => set('city', e.target.value)}>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Licence number">
              <input
                className={FIELD}
                value={form.licenseNumber}
                onChange={(e) => set('licenseNumber', e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input className={FIELD} value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className={FIELD}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />
            </Field>
            <Field label="Office address">
              <input
                className={FIELD}
                value={form.officeAddress}
                onChange={(e) => set('officeAddress', e.target.value)}
              />
            </Field>
            <Field label="Typical response time">
              <input
                className={FIELD}
                value={form.responseTime}
                onChange={(e) => set('responseTime', e.target.value)}
              />
            </Field>
            <Field label="Experience (years)">
              <input
                type="number"
                min="0"
                className={FIELD}
                value={form.experienceYears}
                onChange={(e) => set('experienceYears', e.target.value)}
              />
            </Field>
            <Field label="Team size">
              <input
                type="number"
                min="1"
                className={FIELD}
                value={form.teamSize}
                onChange={(e) => set('teamSize', e.target.value)}
              />
            </Field>
          </div>

          <Field label="About the agency">
            <textarea
              rows={4}
              className={FIELD}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
            />
          </Field>
          <AreasServedTagsInput
            tags={form.areasServed}
            onChange={(areasServed) => set('areasServed', areasServed)}
          />

          <div>
            <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Specializations</p>
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
            <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Services offered</p>
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
              className="rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
            >
              Save profile
            </button>
            {savedFlash && <span className="text-sm font-bold text-brand">Saved — public profile updated.</span>}
          </div>
        </div>
      </form>
    </div>
  )
}
