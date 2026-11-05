import { useOutletContext } from 'react-router-dom'
import { Home, Sparkles } from 'lucide-react'

import { getAgencyListings, useAgencyStore } from '../../utils/agencyStore'
import { getRecommendationsByAgent } from '../../data/recommendations'

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
    </div>
  )
}
