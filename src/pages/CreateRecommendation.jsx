import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ImagePlus, Plus, Save, X } from 'lucide-react'

import {
  DEMO_AGENCY_AGENT_ID,
  createRecommendationId,
  getRecommendationById,
  upsertRecommendation,
} from '../data/recommendations'
import { CITIES } from '../data/filters'
import { getSession } from '../utils/session'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const MAX_CONTENT = 3

const CATEGORY_OPTIONS = [
  'All Recommendations',
  'Upcoming Projects',
  'Trending Projects',
  'High-Demand Locations',
  'Investment Opportunities',
  'Market Insights',
]

const EMPTY = {
  image: '',
  title: '',
  projectName: '',
  location: '',
  city: 'Karachi',
  category: 'Market Insights',
  content: [{ heading: '', value: '' }],
}

function Field({ label, children, hint, required }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </label>
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

function normalizeContent(existing) {
  if (Array.isArray(existing?.content) && existing.content.length) {
    return existing.content.slice(0, MAX_CONTENT).map((item) => ({
      heading: item.heading || '',
      value: item.value || '',
    }))
  }
  // Migrate older recommendation fields into content blocks
  const legacy = [
    { heading: 'Why we recommend it', value: existing?.whyRecommend || '' },
    { heading: 'Market insights', value: existing?.marketInsights || '' },
    { heading: 'Future prospects', value: existing?.futureProspects || existing?.description || '' },
  ].filter((item) => item.value.trim())
  return legacy.length ? legacy.slice(0, MAX_CONTENT) : [{ heading: '', value: '' }]
}

/**
 * Create / edit recommendation form —
 * agency panel + `/my-recommendations/new|/:id/edit`.
 */
export default function CreateRecommendation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const inAgencyPanel = pathname.startsWith('/agency')
  const listPath = inAgencyPanel ? '/agency/recommendations' : '/my-recommendations'
  const session = getSession()
  const agencyAgentId = session.agencyId || DEMO_AGENCY_AGENT_ID
  const existing = id ? getRecommendationById(id) : null

  const initial = useMemo(() => {
    if (!existing) return EMPTY
    return {
      image: existing.image || existing.coverImage || '',
      title: existing.title || '',
      projectName: existing.projectName || '',
      location: existing.location || '',
      city: existing.city || 'Karachi',
      category: existing.category || 'Market Insights',
      content: normalizeContent(existing),
    }
  }, [existing])

  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function setContent(index, key, value) {
    setForm((current) => {
      const next = current.content.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      )
      return { ...current, content: next }
    })
  }

  function addContentBlock() {
    if (form.content.length >= MAX_CONTENT) return
    setForm((current) => ({
      ...current,
      content: [...current.content, { heading: '', value: '' }],
    }))
  }

  function removeContentBlock(index) {
    setForm((current) => {
      const next = current.content.filter((_, i) => i !== index)
      return { ...current, content: next.length ? next : [{ heading: '', value: '' }] }
    })
  }

  function buildPayload(status) {
    if (!form.image.trim()) {
      setError('Upload 1 recommendation image.')
      return null
    }
    if (!form.title.trim() || !form.location.trim() || !form.city.trim()) {
      setError('Title, location and city are required.')
      return null
    }

    const content = form.content
      .map((item) => ({
        heading: item.heading.trim(),
        value: item.value.trim(),
      }))
      .filter((item) => item.heading || item.value)
      .slice(0, MAX_CONTENT)

    if (!content.length) {
      setError('Add at least 1 content block (heading + value).')
      return null
    }
    if (content.some((item) => !item.heading || !item.value)) {
      setError('Each content block needs both heading and value.')
      return null
    }

    const now = new Date().toISOString().slice(0, 10)
    const image = form.image.trim()

    return {
      id: existing?.id || createRecommendationId(),
      image,
      coverImage: image,
      gallery: [image],
      title: form.title.trim(),
      projectName: form.projectName.trim(),
      location: form.location.trim(),
      city: form.city.trim(),
      category: form.category,
      content,
      // Keep public detail fallbacks filled from content
      description: content.map((item) => item.value).join('\n\n'),
      whyRecommend: content[0]?.value || '',
      marketInsights: content[1]?.value || '',
      futureProspects: content[2]?.value || '',
      projectType: existing?.projectType || 'Residential',
      demandLevel: existing?.demandLevel || 'Medium',
      agentId: existing?.agentId || agencyAgentId,
      status,
      publishedAt: status === 'published' ? now : existing?.publishedAt || '',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      rejectionReason: status === 'pending' ? '' : existing?.rejectionReason || '',
    }
  }

  function save(status) {
    setError('')
    const payload = buildPayload(status)
    if (!payload) return
    upsertRecommendation(payload)
    navigate(listPath)
  }

  return (
    <section className={inAgencyPanel ? '' : 'min-h-screen bg-offwhite'}>
      <div className={inAgencyPanel ? 'max-w-4xl' : 'mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8'}>
        <Link
          to={listPath}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-brand transition hover:bg-brand-soft"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to recommendations
        </Link>

        <h1 className="mt-6 font-display text-3xl font-extrabold text-slate-900">
          {existing ? 'Edit Recommendation' : 'Create Recommendation'}
        </h1>
        <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" />
        <p className="mt-3 text-sm text-slate-500">
          One image, basic details, and up to 3 content blocks.
        </p>

        <form
          className="mt-8 space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8"
          onSubmit={(e) => {
            e.preventDefault()
            save('published')
          }}
        >
          <div>
            <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Image *</p>
            <p className="mt-1 text-xs text-slate-400">Only 1 image allowed for a recommendation.</p>
            <div className="mt-3 max-w-sm">
              {form.image ? (
                <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-brand-soft">
                  <img src={form.image} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => set('image', '')}
                    className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-rose-600 shadow"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 text-brand transition hover:bg-brand-soft">
                  <ImagePlus className="h-7 w-7" />
                  <span className="text-xs font-bold">Upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      readImageFile(file, (dataUrl) => set('image', dataUrl))
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          <Field label="Title" required>
            <input
              className={FIELD}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Project name">
              <input
                className={FIELD}
                value={form.projectName}
                onChange={(e) => set('projectName', e.target.value)}
              />
            </Field>
            <Field label="Category" required>
              <select
                className={FIELD}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Content</p>
                <p className="mt-1 text-xs text-slate-400">
                  Up to {MAX_CONTENT} blocks · heading + value each · {form.content.length}/{MAX_CONTENT}
                </p>
              </div>
              {form.content.length < MAX_CONTENT && (
                <button
                  type="button"
                  onClick={addContentBlock}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-brand-soft px-3 py-2 text-xs font-bold text-brand transition hover:bg-brand hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add block
                </button>
              )}
            </div>

            {form.content.map((block, index) => (
              <div
                key={index}
                className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold tracking-wide text-brand uppercase">
                    Block {index + 1}
                  </p>
                  {form.content.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContentBlock(index)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  )}
                </div>
                <Field label="Heading">
                  <input
                    className={FIELD}
                    value={block.heading}
                    onChange={(e) => setContent(index, 'heading', e.target.value)}
                    placeholder="e.g. Why we recommend it"
                  />
                </Field>
                <Field label="Value">
                  <textarea
                    rows={3}
                    className={FIELD}
                    value={block.value}
                    onChange={(e) => setContent(index, 'value', e.target.value)}
                    placeholder="Write the content for this heading"
                  />
                </Field>
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => save('draft')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
            >
              <CheckCircle2 className="h-4 w-4" />
              Publish
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
