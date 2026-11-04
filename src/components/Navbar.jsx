import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CalendarCheck, Menu, Star, X } from 'lucide-react'
import Logo from './ui/Logo'
import UserAvatarMenu from './UserAvatarMenu'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  {
    label: 'What Our Agents Recommend',
    to: '/agents-recommend',
    highlight: true,
  },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

function highlightClass({ isActive }) {
  return `inline-flex items-center gap-2 rounded-full px-4.5 py-2.5 text-sm font-extrabold tracking-wide transition ${
    isActive
      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-1 ring-amber-600/20'
      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/90 hover:bg-amber-100 hover:text-amber-800'
  }`
}

export default function Navbar({ onSignOut }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { pathname } = useLocation()

  /* Close the mobile drawer whenever the route changes. */
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  /* Elevate the header once the user scrolls past the hero fold. */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `relative rounded-lg px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${
      isActive ? 'text-brand' : 'text-slate-600 hover:text-brand'
    }`

  function handleHomeClick(event) {
    if (pathname === '/') {
      event.preventDefault()
      window.location.reload()
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
        isScrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'
      }`}
    >
      <nav className="flex min-h-[5.75rem] w-full items-center justify-between gap-4 px-4 py-7 sm:min-h-[6.25rem] sm:px-5 lg:px-6 xl:px-8">
        <Logo />

        {/* Desktop navigation — pinned to the right edge */}
        <div className="hidden items-center gap-1.5 lg:flex">
          {NAV_LINKS.map((link) =>
            link.highlight ? (
              <NavLink key={link.to} to={link.to} className={highlightClass}>
                <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                {link.label}
              </NavLink>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                end={link.to === '/'}
                onClick={link.to === '/' ? handleHomeClick : undefined}
              >
                {link.label}
              </NavLink>
            ),
          )}

          <Link
            to="/advanced-booking"
            className="ml-3 inline-flex items-center gap-2.5 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl"
          >
            <CalendarCheck className="h-5 w-5" />
            Advanced Booking
          </Link>

          <div className="ml-2">
            <UserAvatarMenu onSignOut={onSignOut} />
          </div>
        </div>

        {/* Mobile: avatar + menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <UserAvatarMenu compact onSignOut={onSignOut} />
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="grid h-14 w-14 place-items-center rounded-xl border border-slate-200 text-brand transition hover:bg-brand-soft"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-slate-100 bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
          isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-1.5 px-4 py-5 sm:px-6">
          {NAV_LINKS.map((link) =>
            link.highlight ? (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-extrabold transition ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100'
                  }`
                }
              >
                <Star className="h-4.5 w-4.5 fill-current" aria-hidden="true" />
                {link.label}
              </NavLink>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={link.to === '/' ? handleHomeClick : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold transition ${
                    isActive ? 'bg-brand-soft text-brand' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ),
          )}

          <Link
            to="/advanced-booking"
            className="mt-2 flex items-center justify-center gap-2.5 rounded-xl bg-brand px-5 py-4 text-[15px] font-bold text-white shadow-lg shadow-brand/25"
          >
            <CalendarCheck className="h-5 w-5" />
            Advanced Booking
          </Link>
        </div>
      </div>
    </header>
  )
}
