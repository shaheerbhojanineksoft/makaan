import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Save, Send } from 'lucide-react'

import {
  DEMAND_LEVELS,
  DEMO_AGENCY_AGENT_ID,
  PROJECT_TYPES,
  RECOMMENDATION_CATEGORIES,
  createRecommendationId,
  getRecommendationById,
  upsertRecommendation,
} from '../data/recommendations'
import { bookingProjects } from '../data/projects'
import { getSession } from '../utils/session'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const EMPTY = {
  title: '',
  category: RECOMMENDATION_CATEGORIES[0],
  relatedProjectId: '',
  city: '',
  location: '',
  projectType: PROJECT_TYPES[0],
  coverImage: '',
  galleryText: '',
  projectStatus: 'Upcoming',
  demandLevel: 'Medium',
  expectedLaunch: '',
  priceMin: '',
  priceMax: '',
  description: '',
  whyRecommend: '',
  marketInsights: '',
  futureProspects: '',
  projectOverview: '',
  agentOpinionNote:
    'This is an agency market view, not a guaranteed return. Always verify documents independently.',
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</span>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>}
    </label>
  )
}

/**
 * Create / edit recommendation form —
 * `/my-recommendations/new` and `/my-recommendations/:id/edit`.
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
      title: existing.title,
      category: existing.category,
      relatedProjectId: existing.relatedProjectId || '',
      city: existing.city,
      location: existing.location,
      projectType: existing.projectType,
      coverImage: existing.coverImage,
      galleryText: (existing.gallery || []).join('\n'),
      projectStatus: existing.projectStatus || 'Upcoming',
      demandLevel: existing.demandLevel,
      expectedLaunch: existing.expectedLaunch || '',
      priceMin: existing.priceMin ? String(existing.priceMin) : '',
      priceMax: existing.priceMax ? String(existing.priceMax) : '',
      description: existing.description,
      whyRecommend: existing.whyRecommend,
      marketInsights: existing.marketInsights,
      futureProspects: existing.futureProspects,
      projectOverview: existing.projectOverview || '',
      agentOpinionNote: existing.agentOpinionNote || EMPTY.agentOpinionNote,
    }
  }, [existing])

  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const onCoverFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    set('coverImage', URL.createObjectURL(file))
  }

  const onGalleryFiles = (event) => {
    const files = [...(event.target.files || [])]
    if (!files.length) return
    const urls = files.map((file) => URL.createObjectURL(file))
    set('galleryText', [...(form.galleryText ? form.galleryText.split('\n') : []), ...urls].join('\n'))
  }

  const buildPayload = (status) => {
    if (!form.title.trim() || !form.city.trim() || !form.location.trim() || !form.description.trim()) {
      setError('Title, city, location and description are required.')
      return null
    }
    if (!form.coverImage.trim()) {
      setError('Add a cover image URL or upload a cover file.')
      return null
    }

    const now = new Date().toISOString().slice(0, 10)
    const gallery = form.galleryText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    return {
      id: existing?.id || createRecommendationId(),
      title: form.title.trim(),
      category: form.category,
      city: form.city.trim(),
      location: form.location.trim(),
      projectType: form.projectType,
      projectStatus: form.projectStatus,
      demandLevel: form.demandLevel,
      expectedLaunch: form.expectedLaunch,
      priceMin: form.priceMin ? Number(form.priceMin) : null,
      priceMax: form.priceMax ? Number(form.priceMax) : null,
      coverImage: form.coverImage.trim(),
      gallery: gallery.length ? gallery : [form.coverImage.trim()],
      description: form.description.trim(),
      whyRecommend: form.whyRecommend.trim(),
      marketInsights: form.marketInsights.trim(),
      futureProspects: form.futureProspects.trim(),
      projectOverview: form.projectOverview.trim(),
      agentOpinionNote: form.agentOpinionNote.trim(),
      relatedProjectId: form.relatedProjectId,
      relatedPropertyIds: existing?.relatedPropertyIds || [],
      agentId: existing?.agentId || agencyAgentId,
      status,
      publishedAt: status === 'published' ? now : existing?.publishedAt || '',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      rejectionReason: status === 'pending' ? '' : existing?.rejectionReason || '',
    }
  }

  const save = (status) => {
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
          Share a market insight for review. Clearly separate opinions from verified project facts.
        </p>

        <form
          className="mt-8 space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8"
          onSubmit={(e) => {
            e.preventDefault()
            save('pending')
          }}
        >
          <Field label="Recommendation title">
            <input
              className={FIELD}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Why Clifton high-rises are heating up"
              required
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category">
              <select
                className={FIELD}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {RECOMMENDATION_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Related project (optional)">
              <select
                className={FIELD}
                value={form.relatedProjectId}
                onChange={(e) => set('relatedProjectId', e.target.value)}
              >
                <option value="">None</option>
                {bookingProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City">
              <input
                className={FIELD}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="Karachi"
                required
              />
            </Field>
            <Field label="Location">
              <input
                className={FIELD}
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="DHA Phase 8"
                required
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Project type">
              <select
                className={FIELD}
                value={form.projectType}
                onChange={(e) => set('projectType', e.target.value)}
              >
                {PROJECT_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Demand level">
              <select
                className={FIELD}
                value={form.demandLevel}
                onChange={(e) => set('demandLevel', e.target.value)}
              >
                {DEMAND_LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Project status">
              <input
                className={FIELD}
                value={form.projectStatus}
                onChange={(e) => set('projectStatus', e.target.value)}
                placeholder="Upcoming / Booking Open"
              />
            </Field>
            <Field label="Expected launch date">
              <input
                type="date"
                className={FIELD}
                value={form.expectedLaunch}
                onChange={(e) => set('expectedLaunch', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Price min (optional)">
              <input
                type="number"
                className={FIELD}
                value={form.priceMin}
                onChange={(e) => set('priceMin', e.target.value)}
                placeholder="5000000"
              />
            </Field>
            <Field label="Price max (optional)">
              <input
                type="number"
                className={FIELD}
                value={form.priceMax}
                onChange={(e) => set('priceMax', e.target.value)}
                placeholder="20000000"
              />
            </Field>
          </div>

          <Field
            label="Cover image"
            hint="Upload a file or paste an image URL."
          >
            <input
              className={FIELD}
              value={form.coverImage}
              onChange={(e) => set('coverImage', e.target.value)}
              placeholder="https://…"
            />
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
              <ImagePlus className="h-4 w-4 text-brand" />
              Upload cover
              <input type="file" accept="image/*" className="hidden" onChange={onCoverFile} />
            </label>
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt=""
                className="mt-3 aspect-video w-full max-w-md rounded-2xl object-cover"
              />
            )}
          </Field>

          <Field
            label="Image gallery"
            hint="One image URL per line, or upload multiple files."
          >
            <textarea
              className={FIELD}
              rows={3}
              value={form.galleryText}
              onChange={(e) => set('galleryText', e.target.value)}
              placeholder="https://image-1…&#10;https://image-2…"
            />
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
              <ImagePlus className="h-4 w-4 text-brand" />
              Upload gallery
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onGalleryFiles}
              />
            </label>
          </Field>

          <Field label="Recommendation description">
            <textarea
              className={FIELD}
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </Field>

          <Field label="Project overview (facts)">
            <textarea
              className={FIELD}
              rows={3}
              value={form.projectOverview}
              onChange={(e) => set('projectOverview', e.target.value)}
            />
          </Field>

          <Field label="Why we recommend it (opinion)">
            <textarea
              className={FIELD}
              rows={3}
              value={form.whyRecommend}
              onChange={(e) => set('whyRecommend', e.target.value)}
            />
          </Field>

          <Field label="Market insights (opinion)">
            <textarea
              className={FIELD}
              rows={3}
              value={form.marketInsights}
              onChange={(e) => set('marketInsights', e.target.value)}
            />
          </Field>

          <Field label="Future prospects (opinion)">
            <textarea
              className={FIELD}
              rows={3}
              value={form.futureProspects}
              onChange={(e) => set('futureProspects', e.target.value)}
            />
          </Field>

          <Field label="Disclaimer shown to readers">
            <textarea
              className={FIELD}
              rows={2}
              value={form.agentOpinionNote}
              onChange={(e) => set('agentOpinionNote', e.target.value)}
            />
          </Field>

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
              <Send className="h-4 w-4" />
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
