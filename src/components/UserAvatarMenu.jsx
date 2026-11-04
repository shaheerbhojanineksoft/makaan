import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Heart, LogOut, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCurrentUser } from '../utils/currentUser'

/**
 * Logged-in user DP in the header — compact avatar + light menu.
 */
export default function UserAvatarMenu({ compact = false, onSignOut }) {
  const menuId = useId()
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const user = useCurrentUser()

  useEffect(() => {
    if (!open) return undefined

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${user.name} account menu`}
        onClick={() => setOpen((value) => !value)}
        className="group inline-flex items-center gap-1.5 rounded-full transition"
      >
        <img
          src={user.avatar}
          alt=""
          className="h-11 w-11 rounded-full object-cover transition group-hover:opacity-90"
        />
        {!compact && (
          <ChevronDown
            className={`hidden h-4 w-4 text-slate-400 transition lg:block ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute top-[calc(100%+0.55rem)] right-0 z-50 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
        >
          <div className="border-b border-slate-100 bg-brand-soft/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt=""
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-900">{user.name}</p>
                <p className="truncate text-[11px] font-medium text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-1.5">
            <Link
              role="menuitem"
              to="/favourites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-brand-soft hover:text-brand"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              Favourites
            </Link>
            <Link
              role="menuitem"
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-brand-soft hover:text-brand"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              onClick={() => {
                setOpen(false)
                onSignOut?.()
              }}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
