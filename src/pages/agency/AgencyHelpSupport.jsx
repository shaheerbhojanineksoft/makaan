import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Eye, Headphones, PlusCircle, X } from 'lucide-react'

import Badge from '../../components/ui/Badge'
import AgencyHelpSupportForm from './AgencyHelpSupportForm'
import {
  SUPPORT_STATUSES,
  getSupportRequests,
  useSupportRequestsStore,
} from '../../utils/supportRequestsStore'

const STATUS_VARIANT = {
  pending: 'amber',
  in_review: 'green',
  responded: 'solid',
}

function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function DetailItem({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800 whitespace-pre-wrap">{value}</p>
    </div>
  )
}

function RequestDetailModal({ request, onClose }) {
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

  const attachments = Array.isArray(request.attachments) ? request.attachments.filter(Boolean) : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-request-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close request details"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-brand uppercase">
              {request.topic || 'Support'}
            </p>
            <h2
              id="support-request-title"
              className="mt-1 font-display text-2xl font-extrabold text-slate-900"
            >
              {request.subject}
            </h2>
            <div className="mt-3">
              <Badge variant={STATUS_VARIANT[request.status] || 'green'}>
                {SUPPORT_STATUSES[request.status] || request.status}
              </Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-brand"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2">
            <DetailItem label="Request ID" value={request.id} />
            <DetailItem label="Related ID" value={request.relatedId || '—'} />
            <DetailItem label="Phone" value={request.phone} />
            <DetailItem label="Submitted" value={formatDateTime(request.createdAt)} />
            <DetailItem label="Last updated" value={formatDateTime(request.updatedAt)} />
          </div>

          <DetailItem label="Your message" value={request.message} />

          {attachments.length ? (
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                Attachments
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:max-w-md">
                {attachments.map((url, index) => (
                  <img
                    key={`${url.slice(0, 40)}-${index}`}
                    src={url}
                    alt=""
                    className="aspect-[4/3] w-full rounded-xl object-cover border border-slate-200"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {request.response ? (
            <div className="rounded-xl border border-brand/15 bg-brand-soft/50 p-4">
              <p className="text-[11px] font-bold tracking-wide text-brand uppercase">
                Admin response
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800 whitespace-pre-wrap">
                {request.response}
              </p>
            </div>
          ) : (
            <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              No response yet — our team will update this request once it’s reviewed.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AgencyHelpSupport() {
  const { agencyId } = useOutletContext()
  const storeTick = useSupportRequestsStore()
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const requests = useMemo(() => getSupportRequests(agencyId), [agencyId, storeTick])

  const counts = useMemo(() => {
    const base = { pending: 0, in_review: 0, responded: 0, total: requests.length }
    requests.forEach((item) => {
      if (item.status in base) base[item.status] += 1
    })
    return base
  }, [requests])

  if (showForm) {
    return <AgencyHelpSupportForm onBack={() => setShowForm(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Support</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Help & support</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Track every issue you’ve raised with Makaan — pending, in review, or responded.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          <PlusCircle className="h-4 w-4" />
          New request
        </button>
      </div>

      <section className="rounded-2xl border border-brand/15 bg-gradient-to-br from-brand-soft/80 via-white to-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
            <Headphones className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-extrabold text-slate-900">Your support requests</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Our team usually replies within{' '}
              <span className="font-bold text-slate-800">2–4 working hours</span> on business days
              (9 AM – 6 PM). Open a request below to see status and any admin reply.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200/80">
                Total · {counts.total}
              </span>
              <span className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                Pending · {counts.pending}
              </span>
              <span className="rounded-xl bg-brand-soft px-3 py-2 text-xs font-bold text-brand ring-1 ring-brand/15">
                In review · {counts.in_review}
              </span>
              <span className="rounded-xl bg-brand px-3 py-2 text-xs font-bold text-white">
                Responded · {counts.responded}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Subject</th>
                <th className="px-4 py-3.5">Topic</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Submitted</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="font-semibold text-slate-700">No support requests yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Raise your first issue and we’ll track it here until it’s resolved.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white"
                    >
                      <PlusCircle className="h-4 w-4" />
                      New request
                    </button>
                  </td>
                </tr>
              ) : (
                requests.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{row.subject}</p>
                      {row.relatedId ? (
                        <p className="mt-0.5 text-xs text-slate-500">Ref: {row.relatedId}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.topic || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[row.status] || 'green'}>
                        {SUPPORT_STATUSES[row.status] || row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <RequestDetailModal request={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  )
}
