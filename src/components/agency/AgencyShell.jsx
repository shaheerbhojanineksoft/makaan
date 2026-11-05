import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Building2,
  Home,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from 'lucide-react'

import Logo from '../ui/Logo'
import { getAgencyProfile, useAgencyStore } from '../../utils/agencyStore'
import { DEMO_AGENCY_ID, useSession } from '../../utils/session'

const NAV = [
  { to: '/agency', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/agency/profile', label: 'Agency Profile', icon: Building2 },
  { to: '/agency/listings', label: 'My Listings', icon: Home },
  { to: '/agency/recommendations', label: 'Recommendations', icon: Sparkles },
]

function linkClass({ isActive }) {
  return `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
    isActive
      ? 'bg-brand text-white shadow-md shadow-brand/20'
      : 'text-slate-600 hover:bg-brand-soft hover:text-brand'
  }`
}

export default function AgencyShell({ onSignOut }) {
  useAgencyStore()
  const navigate = useNavigate()
  const session = useSession()
  const agencyId = session.agencyId || DEMO_AGENCY_ID
  const profile = getAgencyProfile(agencyId)

  function handleSignOut() {
    if (onSignOut) onSignOut()
    else navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-offwhite">
      {/* Side menu */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white sm:w-72">
        <div className="border-b border-slate-100 px-4 py-4">
          <Logo />
        </div>

        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
          <img
            src={profile?.avatar}
            alt=""
            className="h-11 w-11 rounded-full object-cover ring-2 ring-brand/15"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-900">{profile?.agency}</p>
            <p className="truncate text-[11px] font-medium text-slate-500">{profile?.name}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet context={{ agencyId, profile }} />
      </main>
    </div>
  )
}
