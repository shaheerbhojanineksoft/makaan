import { Link, useOutletContext } from 'react-router-dom'
import { Home, PlusCircle, Sparkles } from 'lucide-react'

import { getAgencyListings, useAgencyStore } from '../../utils/agencyStore'
import { getRecommendationsByAgent } from '../../data/recommendations'
import { formatPKR } from '../../utils/format'

export default function AgencyDashboard() {
  useAgencyStore()
  const { agencyId, profile } = useOutletContext()
  const listings = getAgencyListings(agencyId)
  const recommendations = getRecommendationsByAgent(agencyId)

  const stats = [
    { label: 'Active listings', value: listings.length, icon: Home },
    { label: 'Recommendations', value: recommendations.length, icon: Sparkles },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Overview</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
          Welcome, {profile?.name}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage {profile?.agency} — brand, inventory and recommendations from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-4 text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/agency/listings/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          <PlusCircle className="h-4 w-4" />
          Add listing
        </Link>
        <Link
          to="/agency/profile"
          className="inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-white px-5 py-3 text-sm font-bold text-brand transition hover:bg-brand-soft"
        >
          Edit agency profile
        </Link>
        <Link
          to="/agency/recommendations"
          className="inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-white px-5 py-3 text-sm font-bold text-brand transition hover:bg-brand-soft"
        >
          Recommendations
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold text-slate-900">Recent listings</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {listings.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.propertyType} · {item.city} · {formatPKR(item.price)}
                </p>
              </div>
              <Link
                to={`/agency/listings/${item.id}/edit`}
                className="shrink-0 text-xs font-bold text-brand hover:underline"
              >
                Edit
              </Link>
            </div>
          ))}
          {listings.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No listings yet. Add your first one.</p>
          )}
        </div>
      </section>
    </div>
  )
}
