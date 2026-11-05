import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Eye, FilePlus2, MapPin, Pencil, Trash2, X } from 'lucide-react'

import Badge from '../../components/ui/Badge'
import {
  deleteRecommendation,
  getRecommendationsByAgent,
} from '../../data/recommendations'
import { formatMonthYear } from '../../utils/format'

const STATUS_VARIANT = {
  published: 'solid',
  pending: 'amber',
  draft: 'green',
  changes_requested: 'amber',
  rejected: 'amber',
}

const STATUS_LABEL = {
  published: 'Published',
  pending: 'Pending',
  draft: 'Draft',
  changes_requested: 'Changes requested',
  rejected: 'Rejected',
}

function DetailItem({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function RecommendationDetailModal({ recommendation, onClose }) {
  const image = recommendation.image || recommendation.coverImage
  const content =
    Array.isArray(recommendation.content) && recommendation.content.length
      ? recommendation.content
      : [
          recommendation.whyRecommend && {
            heading: 'Why we recommend it',
            value: recommendation.whyRecommend,
          },
          recommendation.marketInsights && {
            heading: 'Market insights',
            value: recommendation.marketInsights,
          },
          recommendation.futureProspects && {
            heading: 'Future prospects',
            value: recommendation.futureProspects,
          },
        ].filter(Boolean)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recommendation-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close recommendation details"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="relative aspect-[16/9] overflow-hidden bg-brand-soft">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-sm font-bold text-brand">No image</div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-slate-600 shadow-sm transition hover:bg-white hover:text-brand"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <Badge variant={STATUS_VARIANT[recommendation.status] || 'green'}>
              {STATUS_LABEL[recommendation.status] || recommendation.status}
            </Badge>
            {recommendation.category && (
              <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-brand">
                {recommendation.category}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <h2
              id="recommendation-detail-title"
              className="font-display text-2xl font-extrabold text-slate-900"
            >
              {recommendation.title}
            </h2>
            {recommendation.projectName && (
              <p className="mt-1 text-sm font-semibold text-slate-500">{recommendation.projectName}</p>
            )}
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-brand" />
              {[recommendation.location, recommendation.city].filter(Boolean).join(', ')}
            </p>
          </div>

          <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2">
            <DetailItem label="Category" value={recommendation.category} />
            <DetailItem
              label="Updated"
              value={recommendation.updatedAt ? formatMonthYear(recommendation.updatedAt) : ''}
            />
            <DetailItem label="City" value={recommendation.city} />
            <DetailItem label="Location" value={recommendation.location} />
          </div>

          {content.length > 0 && (
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Content</p>
              {content.map((block, index) => (
                <div
                  key={`${block.heading}-${index}`}
                  className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <h3 className="font-display text-base font-bold text-slate-900">{block.heading}</h3>
                  <span className="mt-2 block h-1 w-12 rounded-full bg-brand" />
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{block.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {recommendation.status === 'draft' && (
              <Link
                to={`/agency/recommendations/${recommendation.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AgencyRecommendations() {
  const { agencyId } = useOutletContext()
  const [tick, setTick] = useState(0)
  const [selected, setSelected] = useState(null)
  const rows = useMemo(
    () => getRecommendationsByAgent(agencyId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [agencyId, tick],
  )

  function onDelete(id) {
    if (!window.confirm('Delete this recommendation?')) return
    deleteRecommendation(id)
    if (selected?.id === id) setSelected(null)
    setTick((value) => value + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Insights</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
            Recommendations
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Publish market insights for seekers on What Our Agents Recommend.
          </p>
        </div>
        <Link
          to="/agency/recommendations/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          <FilePlus2 className="h-4 w-4" />
          Add recommendation
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <img
                      src={row.image || row.coverImage}
                      alt=""
                      className="h-14 w-[4.5rem] rounded-lg object-cover bg-brand-soft"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{row.title}</p>
                    {row.projectName && (
                      <p className="mt-0.5 text-xs text-slate-500">{row.projectName}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[row.status] || 'green'}>
                      {STATUS_LABEL[row.status] || row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {row.updatedAt ? formatMonthYear(row.updatedAt) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      {row.status === 'draft' && (
                        <Link
                          to={`/agency/recommendations/${row.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No recommendations yet. Create your first insight.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <RecommendationDetailModal
          recommendation={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
