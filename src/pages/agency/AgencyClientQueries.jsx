import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Eye, Inbox, X } from 'lucide-react'

import {
  getClientQueries,
  useClientQueriesStore,
} from '../../utils/clientQueriesStore'

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800 whitespace-pre-wrap">
        {value == null || value === '' ? '—' : value}
      </p>
    </div>
  )
}

function QueryDetailModal({ query, onClose }) {
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
      aria-labelledby="client-query-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close query details"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-brand uppercase">
              Client query
            </p>
            <h2
              id="client-query-title"
              className="mt-1 font-display text-2xl font-extrabold text-slate-900"
            >
              {query.name}
            </h2>
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
            <DetailItem label="Full name" value={query.name} />
            <DetailItem label="Phone number" value={query.phone} />
            <DetailItem label="Email" value={query.email} />
          </div>
          <DetailItem label="Message" value={query.message} />
        </div>
      </div>
    </div>
  )
}

export default function AgencyClientQueries() {
  const { agencyId } = useOutletContext()
  const storeTick = useClientQueriesStore()
  const [selected, setSelected] = useState(null)

  const rows = useMemo(() => getClientQueries(agencyId), [agencyId, storeTick])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Leads</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Client queries</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Full name, email, phone and message from clients who submitted a query on your listings.
        </p>
      </div>

      <section className="rounded-2xl border border-brand/15 bg-gradient-to-br from-brand-soft/80 via-white to-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
            <Inbox className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-extrabold text-slate-900">Inbox</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              You have <span className="font-bold text-slate-800">{rows.length}</span> client
              {rows.length === 1 ? ' query' : ' queries'}.
            </p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Full name</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Message</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="font-semibold text-slate-700">No client queries yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                      When a buyer submits a query on one of your listings, it will show up here.
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-slate-900">{row.name || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.email || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.phone || '—'}</td>
                    <td className="max-w-xs px-4 py-3 text-slate-600">
                      <p className="line-clamp-2">{row.message || '—'}</p>
                    </td>
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
        <QueryDetailModal query={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  )
}
