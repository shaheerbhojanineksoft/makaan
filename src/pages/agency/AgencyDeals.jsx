import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Eye, PlusCircle, Trash2, Wallet, X } from 'lucide-react'

import {
  deleteAgencyDeal,
  getAgencyDeals,
  getAgencyDealsSummary,
  getExpenseTotal,
  useAgencyDealsStore,
} from '../../utils/agencyDealsStore'
import { formatPKR } from '../../utils/format'

function DetailItem({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div>
      <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function DealDetailModal({ deal, onClose, onDelete }) {
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

  const title = deal.dealOn || deal.client1Name || 'Deal'
  const brokers = Array.isArray(deal.brokers) ? deal.brokers : []
  const expenses = Array.isArray(deal.expenses) ? deal.expenses : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-brand uppercase">
              {deal.dealType === 'rental' ? 'Rental deal' : 'Buy deal'}
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {deal.dealDate ? `Deal date ${deal.dealDate}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2">
            <DetailItem label="Deal type" value={deal.dealType === 'rental' ? 'Rental' : 'Buy'} />
            <DetailItem label="Deal date" value={deal.dealDate} />
            <DetailItem label="Client 1 name" value={deal.client1Name} />
            <DetailItem label="Client 2 name" value={deal.client2Name} />
            <DetailItem label="Deal on" value={deal.dealOn} />
            <DetailItem label="Brokerage amount on deal" value={formatPKR(deal.brokerageAmount)} />
            <DetailItem label="Deal amount" value={formatPKR(deal.dealAmount)} />
          </div>

          <div>
            <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">Brokers</p>
            {brokers.length ? (
              <ul className="mt-2 space-y-2">
                {brokers.map((broker, index) => (
                  <li
                    key={`${broker.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3.5 py-3 text-sm"
                  >
                    <span className="font-semibold text-slate-800">{broker.name}</span>
                    <span className="font-bold text-brand">{formatPKR(broker.commission)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No brokers recorded.</p>
            )}
          </div>

          <div>
            <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">Extra expenses</p>
            {expenses.length ? (
              <ul className="mt-2 space-y-2">
                {expenses.map((expense, index) => (
                  <li
                    key={`${expense.key}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3.5 py-3 text-sm"
                  >
                    <span className="font-semibold text-slate-800">{expense.key}</span>
                    <span className="font-bold text-slate-700">{formatPKR(expense.value)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No extra expenses recorded.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onDelete(deal)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AgencyDeals() {
  useAgencyDealsStore()
  const { agencyId } = useOutletContext()
  const [tick, setTick] = useState(0)
  const [selected, setSelected] = useState(null)
  const deals = useMemo(() => getAgencyDeals(agencyId), [agencyId, tick])
  const summary = useMemo(() => getAgencyDealsSummary(agencyId), [agencyId, tick])

  function bump() {
    setTick((n) => n + 1)
  }

  function onDelete(deal) {
    const label = deal.dealOn || deal.client1Name || deal.dealDate || 'this deal'
    if (!window.confirm(`Delete deal for “${label}”? This cannot be undone.`)) return
    deleteAgencyDeal(agencyId, deal.id)
    if (selected?.id === deal.id) setSelected(null)
    bump()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Revenue</p>
          <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Deals history
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Closed deals with brokerage, deal amount, expenses and brokers.
          </p>
        </div>
        <Link
          to="/agency/deals/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          <PlusCircle className="h-4 w-4" />
          Add new deal
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Closed deals</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {summary.dealsCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Deal amount total</p>
          <p className="mt-2 font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
            {formatPKR(summary.dealAmountTotal)}
          </p>
        </div>
        <div className="rounded-2xl border border-brand/15 bg-brand-soft/50 p-4 shadow-sm sm:p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-brand uppercase">
            <Wallet className="h-3.5 w-3.5" />
            Brokerage total
          </p>
          <p className="mt-2 font-display text-xl font-extrabold text-brand sm:text-2xl">
            {formatPKR(summary.brokerageTotal)}
          </p>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {deals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm font-semibold text-slate-500">
            No deals yet. Add your first closed deal.
          </div>
        ) : (
          deals.map((deal) => (
            <article
              key={deal.id}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
            >
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="font-bold text-slate-900">
                    {deal.dealOn || deal.client1Name || '—'}
                  </h2>
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-extrabold text-brand">
                    {deal.dealType === 'rental' ? 'Rental' : 'Buy'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {[deal.client1Name, deal.client2Name].filter(Boolean).join(' · ') || '—'}
                </p>
                <p className="text-xs text-slate-500">{deal.dealDate || '—'}</p>
                <dl className="grid grid-cols-2 gap-2 pt-1 text-sm">
                  <div>
                    <dt className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                      Deal amount
                    </dt>
                    <dd className="mt-0.5 font-bold text-slate-800">{formatPKR(deal.dealAmount)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                      Brokerage
                    </dt>
                    <dd className="mt-0.5 font-bold text-brand">{formatPKR(deal.brokerageAmount)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                      Expenses
                    </dt>
                    <dd className="mt-0.5 font-semibold text-slate-700">
                      {formatPKR(getExpenseTotal(deal))}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 p-3">
                <button
                  type="button"
                  onClick={() => setSelected(deal)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-bold text-brand hover:bg-brand-soft"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(deal)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
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
                <th className="px-4 py-3.5">Deal on</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Deal amount</th>
                <th className="px-4 py-3.5">Brokerage</th>
                <th className="px-4 py-3.5">Expenses</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                    No deals yet. Add your first closed deal.
                  </td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{deal.dealOn || deal.client1Name || '—'}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {[deal.client1Name, deal.client2Name].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {deal.dealType === 'rental' ? 'Rental' : 'Buy'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {formatPKR(deal.dealAmount)}
                    </td>
                    <td className="px-4 py-3 font-bold text-brand">
                      {formatPKR(deal.brokerageAmount)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatPKR(getExpenseTotal(deal))}</td>
                    <td className="px-4 py-3 text-slate-500">{deal.dealDate || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(deal)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(deal)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <DealDetailModal deal={selected} onClose={() => setSelected(null)} onDelete={onDelete} />
      ) : null}
    </div>
  )
}
