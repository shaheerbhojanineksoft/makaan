import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Eye, FilePlus2, Pencil, Trash2 } from 'lucide-react'

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

export default function AgencyRecommendations() {
  const { agencyId } = useOutletContext()
  const [tick, setTick] = useState(0)
  const rows = useMemo(
    () => getRecommendationsByAgent(agencyId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [agencyId, tick],
  )

  function onDelete(id) {
    if (!window.confirm('Delete this recommendation?')) return
    deleteRecommendation(id)
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
                  <td className="px-4 py-3 font-bold text-slate-900">{row.title}</td>
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
                      {row.status === 'published' && (
                        <Link
                          to={`/agents-recommend/${row.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      )}
                      <Link
                        to={`/agency/recommendations/${row.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
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
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No recommendations yet. Create your first insight.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
