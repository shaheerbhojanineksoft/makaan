import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Building2, Scale, UserRound } from 'lucide-react'

import Logo from './ui/Logo'

const ROLE_OPTIONS = [
  { id: 'user', label: 'Sign in as User', Icon: UserRound },
  { id: 'agency', label: 'Sign in as Agency', Icon: Building2 },
  { id: 'lawyer', label: 'Sign in as Lawyer', Icon: Scale },
]

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
 * Full-screen entry gate — pick User, Agency, or Lawyer, then Google sign-in.
 *
 * @param {boolean} open
 * @param {() => void} onEnterUser
 * @param {() => void} onEnterAgency
 * @param {() => void} onEnterLawyer
 */
export default function RoleGate({ open, onEnterUser, onEnterAgency, onEnterLawyer }) {
  const enterRef = useRef(null)
  /** @type {null | 'user' | 'agency' | 'lawyer'} */
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
      else if (path === 'agency') onEnterAgency()
      else onEnterLawyer?.()
    }, 700)
  }

  if (!open) return null

  const isUserPath = path === 'user'
  const isAgencyPath = path === 'agency'
  const isLawyerPath = path === 'lawyer'

  const title = !path
    ? 'Choose how you’d like to continue'
    : isUserPath
      ? 'Sign in as User'
      : isAgencyPath
        ? 'Sign in as Agency'
        : 'Sign in as Lawyer'

  const subtitle = !path
    ? 'Welcome to Makaan — User, Agency and Lawyer accounts are separate. Pick a path, then sign in with Google for that account.'
    : isUserPath
      ? 'This Google sign-in is for seekers only. It does not create or open an agency account.'
      : isAgencyPath
        ? 'This Google sign-in is for agencies only. It does not create or open a user/seeker account.'
        : 'This Google sign-in is for lawyers only. After login you’ll manage your profile details.'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-gate-title"
      data-role-gate
      className="fixed inset-0 z-[100] flex flex-col justify-center overflow-y-auto overscroll-contain bg-brand/85 px-4 py-6 backdrop-blur-xl sm:px-6 sm:py-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-light/25 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="animate-fade-up relative mx-auto w-full max-w-3xl py-2">
        <div className="flex flex-col items-center text-center">
          <Logo variant="dark" link={false} />

          <h1
            id="role-gate-title"
            className="mt-4 font-display text-[1.65rem] leading-tight font-extrabold text-balance text-white sm:mt-8 sm:text-4xl"
          >
            {title}
          </h1>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-brand-soft/80 sm:mt-4 sm:text-base">
            {subtitle}
          </p>
        </div>

        {!path ? (
          <>
            <div className="mt-8 flex items-start justify-center gap-3 sm:mt-10 sm:gap-8">
              {ROLE_OPTIONS.map(({ id, label, Icon }, index) => (
                <button
                  key={id}
                  ref={index === 0 ? enterRef : undefined}
                  type="button"
                  onClick={() => setPath(id)}
                  className="group flex w-[6.5rem] flex-col items-center gap-3 rounded-2xl px-1 py-2 text-center transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:w-32 sm:gap-3.5"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-brand shadow-lg shadow-brand-dark/25 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-brand-dark/35 group-active:translate-y-0 group-active:scale-95 sm:h-16 sm:w-16">
                    <Icon
                      className="h-6 w-6 transition duration-300 group-hover:rotate-6 group-active:rotate-0 sm:h-7 sm:w-7"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-[11px] leading-snug font-bold text-white/95 transition duration-300 group-hover:text-white sm:text-sm">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-[11px] text-brand-soft/60 sm:mt-8 sm:text-xs">
              User, agency and lawyer databases stay separate — each path creates its own Google-linked
              account.
            </p>
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center sm:mt-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/20 sm:text-xs">
              {isUserPath ? (
                <UserRound className="h-3.5 w-3.5" />
              ) : isAgencyPath ? (
                <Building2 className="h-3.5 w-3.5" />
              ) : (
                <Scale className="h-3.5 w-3.5" />
              )}
              {isUserPath
                ? 'User account path'
                : isAgencyPath
                  ? 'Agency account path'
                  : 'Lawyer account path'}
            </div>

            <button
              ref={enterRef}
              type="button"
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="inline-flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-800 shadow-xl shadow-brand-dark/25 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-wait disabled:opacity-80 sm:max-w-none sm:min-w-[300px] sm:px-6 sm:text-base"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white ring-1 ring-slate-200">
                <GoogleIcon className="h-5 w-5" />
              </span>
              <span className="text-left leading-snug">
                {signingIn
                  ? 'Signing in…'
                  : isUserPath
                    ? 'Continue with Google as User'
                    : isAgencyPath
                      ? 'Continue with Google as Agency'
                      : 'Continue with Google as Lawyer'}
              </span>
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
