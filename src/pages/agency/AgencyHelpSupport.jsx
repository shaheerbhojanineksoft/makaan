import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Clock3,
  Eye,
  Hash,
  Headphones,
  ImageOff,
  MessageSquareText,
  Phone,
  PlusCircle,
  RefreshCw,
  Tag,
  X,
} from 'lucide-react'

import Badge from '../../components/ui/Badge'
import { webApi } from '../../utils/api'
import AgencyHelpSupportForm from './AgencyHelpSupportForm'
import {
  SUPPORT_STATUSES,
  getSupportRequests,
  replaceSupportRequests,
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

function MetaChip({ icon: Icon, label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 px-3.5 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
        {Icon ? <Icon className="h-3.5 w-3.5 text-brand" /> : null}
        {label}
      </div>
      <p className="mt-1.5 text-sm font-bold break-all text-slate-800">{value}</p>
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

  const attachments = Array.isArray(request.attachments)
    ? request.attachments.filter(Boolean)
    : []
  const waiting = !request.response

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
        <div className="relative overflow-hidden border-b border-brand/10 bg-gradient-to-br from-brand-soft via-white to-emerald-50/40 px-5 py-6 sm:px-7">
          <div className="pointer-events-none absolute -top-10 -right-8 h-36 w-36 rounded-full bg-brand/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-emerald-200/30 blur-2xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
                  Help & support
                </p>
                <Badge variant={STATUS_VARIANT[request.status] || 'green'}>
                  {SUPPORT_STATUSES[request.status] || request.status}
                </Badge>
              </div>
              <h2
                id="support-request-title"
                className="mt-3 font-display text-2xl font-extrabold leading-tight text-slate-900 sm:text-[1.75rem]"
              >
                {request.subject}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Submitted {formatDateTime(request.createdAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/50 bg-white/90 text-slate-600 shadow-sm transition hover:bg-white hover:text-brand"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetaChip icon={Tag} label="Topic" value={request.topic} />
            <MetaChip icon={Phone} label="Phone" value={request.phone} />
            <MetaChip icon={Hash} label="Request ID" value={request._id} />
            <MetaChip icon={Clock3} label="Submitted" value={formatDateTime(request.createdAt)} />
            <MetaChip
              icon={RefreshCw}
              label="Last updated"
              value={formatDateTime(request.updatedAt)}
            />
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
              <MessageSquareText className="h-4 w-4 text-brand" />
              <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
                Your message
              </p>
            </div>
            <div className="border-l-4 border-brand/70 px-4 py-4 sm:px-5">
              <p className="text-sm font-semibold leading-relaxed whitespace-pre-wrap text-slate-800">
                {request.message || '—'}
              </p>
            </div>
          </section>

          <section>
            <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
              Attachments
            </p>
            {attachments.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {attachments.map((url, index) => (
                  <a
                    key={`${url.slice(0, 40)}-${index}`}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={url}
                      alt=""
                      className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-500">
                <ImageOff className="h-4 w-4" />
                No pictures attached.
              </div>
            )}
          </section>

          {waiting ? (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-4">
              <p className="text-[11px] font-extrabold tracking-wide text-amber-700 uppercase">
                Awaiting reply
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-amber-900/80">
                No response yet — our Makaan team will update this request once it’s reviewed.
              </p>
            </div>
          ) : (
            <section className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft/80 via-white to-white p-4 sm:p-5">
              <p className="text-[11px] font-extrabold tracking-wide text-brand uppercase">
                Admin response
              </p>
              <p className="mt-3 text-sm font-semibold leading-relaxed whitespace-pre-wrap text-slate-800">
                {request.response}
              </p>
            </section>
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
  const [loadingList, setLoadingList] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingList(true)
      try {
        const rows = await webApi('/support/requests', { auth: true })
        if (!cancelled) replaceSupportRequests(agencyId, Array.isArray(rows) ? rows : [])
      } catch {
        // Keep local/demo cache if API is unavailable
      } finally {
        if (!cancelled) setLoadingList(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [agencyId])

  const requests = useMemo(() => getSupportRequests(agencyId), [agencyId, storeTick])

  const counts = useMemo(() => {
    const base = { pending: 0, in_review: 0, responded: 0, total: requests.length }
    requests.forEach((item) => {
      if (item.status in base) base[item.status] += 1
    })
    return base
  }, [requests])

  if (showForm) {
    return (
      <AgencyHelpSupportForm
        onBack={() => setShowForm(false)}
        onCreated={() => setShowForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Support</p>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Help & support
          </h1>
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

      <div className="space-y-3 md:hidden">
        {loadingList ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm font-semibold text-slate-500">
            Loading requests…
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
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
          </div>
        ) : (
          requests.map((row) => (
            <article
              key={row._id}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
            >
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="font-bold text-slate-900">{row.subject}</h2>
                  <Badge variant={STATUS_VARIANT[row.status] || 'green'}>
                    {SUPPORT_STATUSES[row.status] || row.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{row.topic || '—'}</p>
                <p className="text-xs text-slate-500">{formatDateTime(row.createdAt)}</p>
              </div>
              <div className="border-t border-slate-100 p-3">
                <button
                  type="button"
                  onClick={() => setSelected(row)}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-bold text-brand hover:bg-brand-soft"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm md:block">
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
              {loadingList ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm font-semibold text-slate-500">
                    Loading requests…
                  </td>
                </tr>
              ) : requests.length === 0 ? (
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
                  <tr key={row._id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{row.subject}</p>
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
