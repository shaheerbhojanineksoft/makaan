import { useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { ImagePlus, X } from 'lucide-react'

import { CITIES } from '../../data/filters'
import {
  LISTING_KINDS,
  MAX_ABOUT_WORDS,
  MAX_HIGHLIGHT_TAGS,
  MAX_LISTING_IMAGES,
  MIN_HIGHLIGHT_CHARS,
  MIN_LISTING_IMAGES,
  PLOT_PROPERTY_TYPE,
  PROPERTY_AMENITIES,
  PROPERTY_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  SIZE_AREA_OPTIONS,
  createListingId,
  getAgencyListingById,
  getListingImages,
  upsertAgencyListing,
  useAgencyStore,
} from '../../utils/agencyStore'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

function Field({ label, children, hint, required }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </label>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-4 border-t border-slate-100 pt-5">
      <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </div>
  )
}

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function countLetters(text) {
  return String(text || '').replace(/[^a-zA-Z]/g, '').length
}

function HighlightTagsInput({ tags, onChange }) {
  const [draft, setDraft] = useState('')
  const [localError, setLocalError] = useState('')

  function addTag() {
    const value = draft.trim()
    if (!value) return
    if (tags.length >= MAX_HIGHLIGHT_TAGS) {
      setLocalError(`Maximum ${MAX_HIGHLIGHT_TAGS} highlights allowed.`)
      return
    }
    if (countLetters(value) < MIN_HIGHLIGHT_CHARS) {
      setLocalError(`Each highlight needs at least ${MIN_HIGHLIGHT_CHARS} letters.`)
      return
    }
    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      setLocalError('This highlight is already added.')
      return
    }
    onChange([...tags, value])
    setDraft('')
    setLocalError('')
  }

  return (
    <div>
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
              aria-label="Remove highlight"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className={FIELD + ' mt-0'}
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
          placeholder={`Type highlight and press Enter (min ${MIN_HIGHLIGHT_CHARS} letters)`}
          disabled={tags.length >= MAX_HIGHLIGHT_TAGS}
        />
        <button
          type="button"
          onClick={addTag}
          className="mt-0 shrink-0 rounded-xl border border-brand/20 bg-brand-soft px-4 text-sm font-bold text-brand hover:bg-brand hover:text-white"
        >
          Add
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">
        {tags.length}/{MAX_HIGHLIGHT_TAGS} tags · press Enter to save
      </p>
      {localError && <p className="mt-1 text-xs font-bold text-rose-600">{localError}</p>}
    </div>
  )
}

function readImageFiles(files, onReady) {
  const list = [...files].filter((file) => file.type.startsWith('image/'))
  if (!list.length) return
  Promise.all(
    list.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
          reader.readAsDataURL(file)
        }),
    ),
  ).then((urls) => onReady(urls.filter(Boolean)))
}

function ImageUploadCards({ images, onChange }) {
  const [localError, setLocalError] = useState('')

  function addFiles(fileList) {
    const room = MAX_LISTING_IMAGES - images.length
    if (room <= 0) {
      setLocalError(`Maximum ${MAX_LISTING_IMAGES} images allowed.`)
      return
    }
    readImageFiles(fileList, (urls) => {
      const next = [...images, ...urls.slice(0, room)].filter(
        (url, index, list) => list.indexOf(url) === index,
      )
      onChange(next.slice(0, MAX_LISTING_IMAGES))
      setLocalError('')
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((url, index) => (
          <div
            key={`${url.slice(0, 48)}-${index}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200/80 bg-brand-soft shadow-sm"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute top-2 left-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-extrabold text-white">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-rose-600 opacity-0 shadow transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {images.length < MAX_LISTING_IMAGES && (
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand/30 bg-brand-soft/40 text-brand transition hover:bg-brand-soft">
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs font-bold">Upload photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files || [])
                e.target.value = ''
              }}
            />
          </label>
        )}
      </div>
      <p className="text-[11px] text-slate-400">
        Upload photos · {images.length}/{MAX_LISTING_IMAGES} · minimum {MIN_LISTING_IMAGES}
      </p>
      {localError && <p className="text-xs font-bold text-rose-600">{localError}</p>}
    </div>
  )
}

function emptyForm(kind = 'property') {
  return {
    kind,
    images: [],
    title: '',
    projectName: '',
    location: '',
    city: 'Karachi',
    propertyType: kind === 'plot' ? PLOT_PROPERTY_TYPE : 'apartment',
    purpose: kind === 'plot' ? 'buy' : 'buy',
    price: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    sizeArea: 'marla',
    sizeUnit: '',
    amenities: [],
    customAmenities: '',
    highlights: [],
    about: '',
    plotNo: '',
    possession: false,
    dimensions: '',
    ownership: '',
  }
}

function fromListing(listing) {
  const kind =
    listing.kind === 'plot' || listing.propertyType === PLOT_PROPERTY_TYPE ? 'plot' : 'property'
  const size =
    listing.size && typeof listing.size === 'object'
      ? listing.size
      : { area: 'marla', unit: '' }
  return {
    ...emptyForm(kind),
    kind,
    images: getListingImages(listing),
    title: listing.title || '',
    projectName: listing.projectName || '',
    location: listing.location || '',
    city: listing.city || 'Karachi',
    propertyType: kind === 'plot' ? PLOT_PROPERTY_TYPE : listing.propertyType || 'apartment',
    purpose: listing.purpose === 'sale' ? 'buy' : listing.purpose || 'buy',
    price: listing.price ?? '',
    bedrooms: listing.bedrooms ?? listing.beds ?? '',
    bathrooms: listing.bathrooms ?? listing.baths ?? '',
    parking: listing.parking ?? '',
    sizeArea: size.area || 'marla',
    sizeUnit: size.unit ?? '',
    amenities: Array.isArray(listing.amenities)
      ? [...listing.amenities]
      : String(listing.amenities || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
    customAmenities: '',
    highlights: listing.highlights || [],
    about: listing.about || listing.description || '',
    plotNo: listing.plotNo || listing.plotNumber || '',
    possession: listing.possession === true || listing.possession === 'Possession granted',
    dimensions: listing.dimensions || '',
    ownership: listing.ownership || '',
  }
}

export default function AgencyListingForm() {
  useAgencyStore()
  const navigate = useNavigate()
  const { id } = useParams()
  const { agencyId, profile } = useOutletContext()
  const existing = id ? getAgencyListingById(agencyId, id) : null
  const isEdit = Boolean(existing)

  const [form, setForm] = useState(() => (existing ? fromListing(existing) : emptyForm('property')))
  const [error, setError] = useState('')

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function toggleAmenity(value) {
    setForm((current) => {
      const has = current.amenities.includes(value)
      return {
        ...current,
        amenities: has
          ? current.amenities.filter((item) => item !== value)
          : [...current.amenities, value],
      }
    })
  }

  function changeKind(kind) {
    setForm((current) => ({
      ...emptyForm(kind),
      images: current.images,
      title: current.title,
      location: current.location,
      city: current.city,
      price: current.price,
      sizeArea: current.sizeArea,
      sizeUnit: current.sizeUnit,
      highlights: current.highlights,
      about: current.about,
      kind,
      propertyType: kind === 'plot' ? PLOT_PROPERTY_TYPE : 'apartment',
      purpose: 'buy',
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (form.images.length < MIN_LISTING_IMAGES) {
      setError(`Upload at least ${MIN_LISTING_IMAGES} image.`)
      return
    }
    if (form.images.length > MAX_LISTING_IMAGES) {
      setError(`Maximum ${MAX_LISTING_IMAGES} images allowed.`)
      return
    }
    if (!form.title.trim() || !form.location.trim() || !form.city) {
      setError('Title, location and city are required.')
      return
    }
    if (!form.sizeUnit || Number(form.sizeUnit) <= 0) {
      setError('Enter a valid size unit value.')
      return
    }
    if (!form.price || Number(form.price) < 0) {
      setError('Enter a valid price.')
      return
    }
    const aboutWords = countWords(form.about)
    if (!form.about.trim()) {
      setError(form.kind === 'plot' ? 'About this plot is required.' : 'About this property is required.')
      return
    }
    if (aboutWords > MAX_ABOUT_WORDS) {
      setError(`About text allows maximum ${MAX_ABOUT_WORDS} words (currently ${aboutWords}).`)
      return
    }
    if (form.highlights.length > MAX_HIGHLIGHT_TAGS) {
      setError(`Maximum ${MAX_HIGHLIGHT_TAGS} highlights allowed.`)
      return
    }
    for (const tag of form.highlights) {
      if (countLetters(tag) < MIN_HIGHLIGHT_CHARS) {
        setError(`Each highlight needs at least ${MIN_HIGHLIGHT_CHARS} letters.`)
        return
      }
    }

    const size = { area: form.sizeArea, unit: Number(form.sizeUnit) }
    const images = form.images.slice(0, MAX_LISTING_IMAGES)
    const base = {
      id: existing?.id || createListingId(form.kind),
      kind: form.kind,
      title: form.title.trim(),
      location: form.location.trim(),
      city: form.city,
      size,
      price: Number(form.price) || 0,
      images,
      image: images[0],
      highlights: form.highlights,
      about: form.about.trim(),
      description: form.about.trim(),
      listedAt: existing?.listedAt || new Date().toISOString(),
      disabled: existing?.disabled || false,
      agent: profile
        ? { name: profile.name, agency: profile.agency, avatar: profile.avatar }
        : existing?.agent,
    }

    let payload
    if (form.kind === 'plot') {
      payload = {
        ...base,
        propertyType: PLOT_PROPERTY_TYPE,
        purpose: 'buy',
        plotNo: form.plotNo.trim(),
        possession: Boolean(form.possession),
        dimensions: form.dimensions.trim(),
        ownership: form.ownership.trim(),
        area: `${size.unit} ${size.area}`,
      }
    } else {
      if (form.bedrooms === '' || form.bedrooms == null) {
        setError('Bedrooms is required.')
        return
      }
      payload = {
        ...base,
        projectName: form.projectName.trim(),
        propertyType: form.propertyType,
        purpose: form.purpose,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: form.bathrooms === '' ? undefined : Number(form.bathrooms) || 0,
        parking: form.parking === '' ? undefined : Number(form.parking) || 0,
        beds: Number(form.bedrooms) || 0,
        baths: form.bathrooms === '' ? 0 : Number(form.bathrooms) || 0,
        amenities: [
          ...form.amenities,
          ...form.customAmenities
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        ].filter((item, index, list) => list.indexOf(item) === index),
        area: `${size.unit} ${size.area}`,
      }
    }

    upsertAgencyListing(agencyId, payload)
    navigate('/agency/listings')
  }

  if (id && !existing) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-display text-lg font-bold text-slate-900">Listing not found</p>
        <Link to="/agency/listings" className="mt-4 inline-block text-sm font-bold text-brand">
          Back to listings
        </Link>
      </div>
    )
  }

  const aboutWords = countWords(form.about)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Inventory</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
          {isEdit ? 'Update listing' : 'Add listing'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">Create a property or plot listing for the public Makaan site.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
      >
        <div>
          <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Listing category</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {LISTING_KINDS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => changeKind(item.value)}
                className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                  form.kind === item.value
                    ? 'border-brand bg-brand text-white shadow-md shadow-brand/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand/30 hover:bg-brand-soft'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <Section title="Images">
          <ImageUploadCards images={form.images} onChange={(images) => set('images', images)} />
        </Section>

        <Section title={form.kind === 'plot' ? 'Plot details' : 'Property details'}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <input className={FIELD} value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </Field>

            {form.kind === 'property' && (
              <Field label="Project name">
                <input
                  className={FIELD}
                  value={form.projectName}
                  onChange={(e) => set('projectName', e.target.value)}
                />
              </Field>
            )}

            <Field label="Location" required>
              <input
                className={FIELD}
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                required
              />
            </Field>

            <Field label="City" required>
              <select className={FIELD} value={form.city} onChange={(e) => set('city', e.target.value)}>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Property type" required>
              {form.kind === 'plot' ? (
                <input className={FIELD} value="plot" disabled />
              ) : (
                <select
                  className={FIELD}
                  value={form.propertyType}
                  onChange={(e) => set('propertyType', e.target.value)}
                >
                  {PROPERTY_TYPE_OPTIONS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="Purpose" required>
              {form.kind === 'plot' ? (
                <input className={FIELD} value="buy" disabled />
              ) : (
                <select className={FIELD} value={form.purpose} onChange={(e) => set('purpose', e.target.value)}>
                  {PURPOSE_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            {form.kind === 'property' ? (
              <>
                <Field label="Price" required>
                  <input
                    type="number"
                    min="0"
                    className={FIELD}
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Parking" hint="Optional">
                  <input
                    type="number"
                    min="0"
                    className={FIELD}
                    value={form.parking}
                    onChange={(e) => set('parking', e.target.value)}
                  />
                </Field>
              </>
            ) : (
              <Field label="Price" required>
                <input
                  type="number"
                  min="0"
                  className={FIELD}
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  required
                />
              </Field>
            )}

            <div className="sm:col-span-2">
              <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Size *</p>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="sr-only">Size area</span>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                    value={form.sizeArea}
                    onChange={(e) => set('sizeArea', e.target.value)}
                  >
                    {SIZE_AREA_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="sr-only">Size unit value</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                    value={form.sizeUnit}
                    onChange={(e) => set('sizeUnit', e.target.value)}
                    placeholder="e.g. 1, 10, 120"
                    required
                  />
                </label>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">Area first, then unit value</p>
            </div>

            {form.kind === 'property' && (
              <>
                <Field label="Bedrooms" required>
                  <input
                    type="number"
                    min="0"
                    className={FIELD}
                    value={form.bedrooms}
                    onChange={(e) => set('bedrooms', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Bathrooms" hint="Optional">
                  <input
                    type="number"
                    min="0"
                    className={FIELD}
                    value={form.bathrooms}
                    onChange={(e) => set('bathrooms', e.target.value)}
                  />
                </Field>
              </>
            )}

            {form.kind === 'plot' && (
              <>
                <Field label="Plot no">
                  <input className={FIELD} value={form.plotNo} onChange={(e) => set('plotNo', e.target.value)} />
                </Field>
                <Field label="Dimensions">
                  <input
                    className={FIELD}
                    value={form.dimensions}
                    onChange={(e) => set('dimensions', e.target.value)}
                  />
                </Field>
                <Field label="Ownership">
                  <input className={FIELD} value={form.ownership} onChange={(e) => set('ownership', e.target.value)} />
                </Field>
                <div className="flex items-end">
                  <label className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.possession}
                      onChange={(e) => set('possession', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                    />
                    <span className="text-sm font-bold text-slate-700">Possession ready</span>
                  </label>
                </div>
              </>
            )}
          </div>

          {form.kind === 'property' && (
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Amenities</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {[
                  ...PROPERTY_AMENITIES,
                  ...form.amenities.filter((item) => !PROPERTY_AMENITIES.includes(item)),
                ].map((item) => {
                  const checked = form.amenities.includes(item)
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
                        onChange={() => toggleAmenity(item)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
                      />
                      <span>{item}</span>
                    </label>
                  )
                })}
              </div>
              <Field label="Additional amenities (comma separated)">
                <input
                  className={FIELD}
                  value={form.customAmenities}
                  onChange={(e) => set('customAmenities', e.target.value)}
                  placeholder="e.g. Kids play area, Solar panels"
                />
              </Field>
            </div>
          )}
        </Section>

        <Section title="Highlights">
          <HighlightTagsInput tags={form.highlights} onChange={(highlights) => set('highlights', highlights)} />
        </Section>

        <Section title={form.kind === 'plot' ? 'About this plot' : 'About this property'}>
          <textarea
            rows={6}
            className={FIELD}
            value={form.about}
            onChange={(e) => set('about', e.target.value)}
            required
          />
          <p
            className={`mt-1.5 text-[11px] font-semibold ${
              aboutWords > MAX_ABOUT_WORDS ? 'text-rose-600' : 'text-slate-400'
            }`}
          >
            {aboutWords}/{MAX_ABOUT_WORDS} words
          </p>
        </Section>

        {error && <p className="text-sm font-bold text-rose-600">{error}</p>}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
          >
            {isEdit ? 'Update listing' : 'Create listing'}
          </button>
          <Link
            to="/agency/listings"
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
