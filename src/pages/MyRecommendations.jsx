import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  FileEdit,
  FilePlus2,
  Pencil,
  Trash2,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import {
  DEMO_AGENCY_AGENT_ID,
  deleteRecommendation,
  getRecommendationsByAgent,
} from '../data/recommendations'
import { formatMonthYear } from '../utils/format'

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

/**
 * Agency dashboard — `/my-recommendations`.
 */
export default function MyRecommendations() {
  const [tick, setTick] = useState(0)
  const rows = useMemo(
    () => getRecommendationsByAgent(DEMO_AGENCY_AGENT_ID),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick],
  )

  const counts = useMemo(() => {
    return {
      total: rows.length,
      published: rows.filter((r) => r.status === 'published').length,
      pending: rows.filter((r) => r.status === 'pending' || r.status === 'changes_requested').length,
      draft: rows.filter((r) => r.status === 'draft').length,
    }
  }, [rows])

  const onDelete = (id) => {
    if (!window.confirm('Delete this recommendation?')) return
    deleteRecommendation(id)
    setTick((value) => value + 1)
  }

  return (
    <section className="min-h-screen bg-offwhite">
      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
              Agency dashboard
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
              My Recommendations
            </h1>
            <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" />
            <p className="mt-3 max-w-xl text-sm text-slate-500">
              Create, edit and track insights submitted for portal review. Demo agency session:{' '}
              <span className="font-semibold text-slate-700">{DEMO_AGENCY_AGENT_ID}</span>
            </p>
          </div>
          <Link
            to="/my-recommendations/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
          >
            <FilePlus2 className="h-4 w-4" />
            Create Recommendation
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total', value: counts.total },
            { label: 'Published', value: counts.published },
            { label: 'Pending', value: counts.pending },
            { label: 'Draft', value: counts.draft },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]"
            >
              <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-3xl font-extrabold text-brand">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Recommendations management
            </h2>
          </div>

          {rows.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <FileEdit className="mx-auto h-8 w-8 text-brand" />
              <p className="mt-3 font-display text-lg font-bold text-slate-900">No recommendations yet</p>
              <p className="mt-2 text-sm text-slate-500">
                Create your first insight to share with buyers across Pakistan.
              </p>
              <Link
                to="/my-recommendations/new"
                className="mt-5 inline-flex rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white"
              >
                Create Recommendation
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex items-start gap-3">
                    <img
                      src={row.coverImage}
                      alt=""
                      className="h-16 w-24 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={STATUS_VARIANT[row.status] ?? 'green'}>
                          {STATUS_LABEL[row.status] ?? row.status}
                        </Badge>
                        <span className="text-[11px] font-semibold text-slate-400">
                          Updated {formatMonthYear(row.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-1 truncate font-display text-sm font-bold text-slate-900">
                        {row.title}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">
                        {row.category} · {row.city}
                      </p>
                      {row.rejectionReason && (
                        <p className="mt-1 text-xs text-amber-700">{row.rejectionReason}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:shrink-0">
                    {row.status === 'published' && (
                      <Link
                        to={`/agents-recommend/${row.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    )}
                    <Link
                      to={`/my-recommendations/${row.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-brand-soft px-3 py-2 text-xs font-bold text-brand"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
