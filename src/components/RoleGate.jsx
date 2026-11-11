import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Building2, UserRound } from 'lucide-react'

import Logo from './ui/Logo'

function GoogleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

/**
 * Full-screen entry gate — pick User or Agency, then Google sign-in for that path only.
 * User and agency accounts stay separate.
 *
 * @param {boolean} open
 * @param {() => void} onEnterUser
 * @param {() => void} onEnterAgency
 */
export default function RoleGate({ open, onEnterUser, onEnterAgency }) {
  const enterRef = useRef(null)
  /** @type {null | 'user' | 'agency'} */
  const [path, setPath] = useState(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    if (!open) {
      setPath(null)
      setSigningIn(false)
      return undefined
    }

    const { documentElement, body } = document
    const previous = { html: documentElement.style.overflow, body: body.style.overflow }

    documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    enterRef.current?.focus()

    return () => {
      documentElement.style.overflow = previous.html
      body.style.overflow = previous.body
    }
  }, [open])

  function handleGoogleSignIn() {
    if (!path || signingIn) return
    setSigningIn(true)
    window.setTimeout(() => {
      setSigningIn(false)
      if (path === 'user') onEnterUser()
      else onEnterAgency()
    }, 700)
  }

  if (!open) return null

  const isUserPath = path === 'user'
  const isAgencyPath = path === 'agency'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-gate-title"
      data-role-gate
      className="fixed inset-0 z-[100] flex flex-col justify-center overflow-hidden bg-brand/85 px-4 py-5 backdrop-blur-xl sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-light/25 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="animate-fade-up mx-auto w-full max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <Logo variant="dark" link={false} />

          <h1
            id="role-gate-title"
            className="mt-4 font-display text-2xl leading-tight font-extrabold text-balance text-white sm:mt-8 sm:text-4xl"
          >
            {!path
              ? 'Choose how you’d like to continue'
              : isUserPath
                ? 'Sign in as User'
                : 'Sign in as Agency'}
          </h1>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-brand-soft/80 sm:mt-4 sm:text-base">
            {!path
              ? 'Welcome to Makaan — User and Agency accounts are separate. Pick a path, then sign in with Google for that account.'
              : isUserPath
                ? 'This Google sign-in is for seekers only. It does not create or open an agency account.'
                : 'This Google sign-in is for agencies only. It does not create or open a user/seeker account.'}
          </p>
        </div>

        {!path ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5">
              <button
                ref={enterRef}
                type="button"
                onClick={() => setPath('user')}
                className="group flex flex-col rounded-2xl bg-white p-3.5 text-left shadow-xl shadow-brand-dark/25 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl sm:p-7"
              >
                <span className="flex w-full flex-wrap items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white sm:h-11 sm:w-11">
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-brand transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>

                <span className="mt-3 block font-display text-sm leading-snug font-bold text-slate-900 sm:mt-5 sm:text-lg">
                  Sign in as User
                </span>
                <span className="mt-1.5 block line-clamp-3 text-[11px] leading-relaxed text-slate-600 sm:mt-2 sm:text-sm sm:line-clamp-none">
                  Search verified listings, book viewings and save the properties you like.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPath('agency')}
                className="group flex flex-col rounded-2xl bg-white p-3.5 text-left shadow-xl shadow-brand-dark/25 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl sm:p-7"
              >
                <span className="flex w-full flex-wrap items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white sm:h-11 sm:w-11">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-brand transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>

                <span className="mt-3 block font-display text-sm leading-snug font-bold text-slate-900 sm:mt-5 sm:text-lg">
                  Sign in as Agency
                </span>
                <span className="mt-1.5 block line-clamp-3 text-[11px] leading-relaxed text-slate-600 sm:mt-2 sm:text-sm sm:line-clamp-none">
                  Manage your brand, listings, recommendations and reach buyers across Pakistan.
                </span>
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] text-brand-soft/60 sm:mt-8 sm:text-xs">
              User and agency databases stay separate — each path creates its own Google-linked account.
            </p>
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center sm:mt-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/20 sm:text-xs">
              {isUserPath ? (
                <UserRound className="h-3.5 w-3.5" />
              ) : (
                <Building2 className="h-3.5 w-3.5" />
              )}
              {isUserPath ? 'User account path' : 'Agency account path'}
            </div>

            <button
              ref={enterRef}
              type="button"
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="inline-flex min-w-[260px] items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-800 shadow-xl shadow-brand-dark/25 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-wait disabled:opacity-80 sm:min-w-[300px] sm:text-base"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-slate-200">
                <GoogleIcon className="h-5 w-5" />
              </span>
              {signingIn
                ? 'Signing in…'
                : isUserPath
                  ? 'Continue with Google as User'
                  : 'Continue with Google as Agency'}
            </button>

            <button
              type="button"
              onClick={() => {
                setPath(null)
                setSigningIn(false)
              }}
              disabled={signingIn}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-soft/80 transition hover:text-white disabled:opacity-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to account type
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
