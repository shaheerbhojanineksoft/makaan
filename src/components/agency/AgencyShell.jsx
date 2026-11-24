import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Building2,
  Clapperboard,
  Headphones,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react'

import Logo from '../ui/Logo'
import { getAgencyProfile, useAgencyStore } from '../../utils/agencyStore'
import {
  DEMO_AGENCY_ID,
  isAgencyProfileCompleted,
  useSession,
} from '../../utils/session'

const NAV = [
  { to: '/agency', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/agency/profile', label: 'Agency Profile', icon: Building2 },
  { to: '/agency/listings', label: 'My Listings', icon: Home },
  { to: '/agency/recommendations', label: 'Recommendations', icon: Sparkles },
  { to: '/agency/reels', label: 'Reels', icon: Clapperboard },
  { to: '/agency/deals', label: 'Deals history', icon: Wallet },
  { to: '/agency/client-queries', label: 'Client queries', icon: Inbox },
  { to: '/agency/help-support', label: 'Help & support', icon: Headphones },
]

function linkClass({ isActive }) {
  return `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
    isActive
      ? 'bg-brand text-white shadow-md shadow-brand/20'
      : 'text-slate-600 hover:bg-brand-soft hover:text-brand'
  }`
}

function SideNav({ profile, onNavigate, onSignOut, showLogo = true, items = NAV }) {
  const avatarSrc = profile?.avatar || profile?.profilePicture || ''
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      {showLogo ? (
        <div className="border-b border-slate-100 px-4 py-4">
          <Logo />
        </div>
      ) : null}

      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt=""
            className="h-11 w-11 rounded-full object-cover ring-2 ring-brand/15"
          />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand ring-2 ring-brand/15">
            <Building2 className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-slate-900">
            {profile?.agency || 'Your agency'}
          </p>
          <p className="truncate text-[11px] font-medium text-slate-500">
            {profile?.name || 'Complete profile'}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={linkClass}
            onClick={onNavigate}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function AgencyShell({ onSignOut }) {
  useAgencyStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const session = useSession()
  const agencyId = session.agencyId || DEMO_AGENCY_ID
  const profile = getAgencyProfile(agencyId)
  const profileCompleted = isAgencyProfileCompleted(session)
  const navItems = profileCompleted
    ? NAV
    : NAV.filter((item) => item.to === '/agency/profile')
  const [menuOpen, setMenuOpen] = useState(false)
  const avatarSrc = profile?.avatar || profile?.profilePicture || ''

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = previous
    }
  }, [menuOpen])

  function handleSignOut() {
    setMenuOpen(false)
    if (onSignOut) onSignOut()
    else navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-offwhite lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-200/80 bg-white lg:flex">
        <SideNav profile={profile} onSignOut={handleSignOut} items={navItems} />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt=""
                className="h-9 w-9 rounded-full object-cover ring-2 ring-brand/15"
              />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand ring-2 ring-brand/15">
                <Building2 className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-900">
                {profile?.agency || 'Your agency'}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-500">
                {profileCompleted ? 'Agency panel' : 'Complete profile'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-brand"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-extrabold text-slate-900">Menu</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SideNav
              profile={profile}
              showLogo={false}
              items={navItems}
              onNavigate={() => setMenuOpen(false)}
              onSignOut={handleSignOut}
            />
          </aside>
        </div>
      ) : null}

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Outlet context={{ agencyId, profile }} />
      </main>
    </div>
  )
}
