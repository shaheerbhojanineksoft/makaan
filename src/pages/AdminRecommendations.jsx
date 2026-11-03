import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Eye,
  MessageSquareWarning,
  ShieldCheck,
  XCircle,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import {
  getPendingRecommendations,
  hydrateRecommendation,
  updateRecommendationStatus,
} from '../data/recommendations'
import { formatMonthYear } from '../utils/format'

/**
 * Simple admin moderation UI — `/admin/recommendations`.
 */
export default function AdminRecommendations() {
  const [tick, setTick] = useState(0)
  const [previewId, setPreviewId] = useState(null)
  const [reason, setReason] = useState('')
  const [actionError, setActionError] = useState('')

  const pending = useMemo(
    () => getPendingRecommendations().map(hydrateRecommendation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  )

  const preview = pending.find((item) => item.id === previewId) || pending[0] || null

  const refresh = () => {
    setTick((value) => value + 1)
    setReason('')
    setActionError('')
  }

  const approve = (id) => {
    updateRecommendationStatus(id, 'published')
    setPreviewId(null)
    refresh()
  }

  const reject = (id) => {
    if (!reason.trim()) {
      setActionError('Add a rejection reason before rejecting.')
      return
    }
    updateRecommendationStatus(id, 'rejected', reason.trim())
    setPreviewId(null)
    refresh()
  }

  const requestChanges = (id) => {
    if (!reason.trim()) {
      setActionError('Add notes describing the required changes.')
      return
    }
    updateRecommendationStatus(id, 'changes_requested', reason.trim())
    setPreviewId(null)
    refresh()
  }

  return (
    <section className="min-h-screen bg-offwhite">
      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin moderation
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
              Pending Recommendations
            </h1>
            <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" />
            <p className="mt-3 max-w-xl text-sm text-slate-500">
              Preview agency submissions, approve for the public feed, reject, or request changes.
            </p>
          </div>
          <Link
            to="/agents-recommend"
            className="inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-white px-4 py-2.5 text-xs font-bold text-brand"
          >
            View public page
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-display text-base font-bold text-slate-900">
                  Queue ({pending.length})
                </h2>
              </div>
              {pending.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-brand" />
                  <p className="mt-3 font-display text-lg font-bold text-slate-900">All clear</p>
                  <p className="mt-2 text-sm text-slate-500">No pending recommendations right now.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {pending.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewId(item.id)
                          setReason(item.rejectionReason || '')
                          setActionError('')
                        }}
                        className={`flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-brand-soft/40 ${
                          preview?.id === item.id ? 'bg-brand-soft/60' : ''
                        }`}
                      >
                        <img
                          src={item.coverImage}
                          alt=""
                          className="h-14 w-20 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <Badge variant="amber">
                            {item.status === 'changes_requested'
                              ? 'Changes requested'
                              : 'Pending'}
                          </Badge>
                          <p className="mt-1 truncate text-sm font-bold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.agent?.agency || 'Agency'} · {formatMonthYear(item.updatedAt)}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            {!preview ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center">
                <Eye className="mx-auto h-8 w-8 text-brand" />
                <p className="mt-3 font-display text-lg font-bold text-slate-900">
                  Select a submission to preview
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-7">
                <img
                  src={preview.coverImage}
                  alt=""
                  className="aspect-16/9 w-full rounded-2xl object-cover"
                />
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="green">{preview.category}</Badge>
                  <Badge variant="amber">{preview.demandLevel} Demand</Badge>
                  <Badge variant="green">{preview.city}</Badge>
                </div>
                <h2 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
                  {preview.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {preview.agent?.name} · {preview.agent?.agency}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{preview.description}</p>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p>
                    <span className="font-bold text-slate-800">Why recommend:</span>{' '}
                    {preview.whyRecommend || '—'}
                  </p>
                  <p>
                    <span className="font-bold text-slate-800">Market:</span>{' '}
                    {preview.marketInsights || '—'}
                  </p>
                </div>

                <label className="mt-6 block">
                  <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                    Reject / request-changes reason
                  </span>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                    placeholder="Explain what needs fixing or why it was rejected…"
                  />
                </label>

                {actionError && (
                  <p className="mt-3 text-sm font-semibold text-red-600">{actionError}</p>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => approve(preview.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => requestChanges(preview.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800"
                  >
                    <MessageSquareWarning className="h-4 w-4" />
                    Request Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => reject(preview.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
