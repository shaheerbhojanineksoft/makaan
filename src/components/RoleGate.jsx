import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Building2, Scale, UserRound } from 'lucide-react'

import Logo from './ui/Logo'
import Toast from './ui/Toast'
import { webApi } from '../utils/api'
import { mountGoogleButton } from '../utils/googleAuth'
import { enterFromGoogleAuth } from '../utils/session'

const ROLE_OPTIONS = [
  { id: 'user', label: 'Sign in as User', Icon: UserRound },
  { id: 'agency', label: 'Sign in as Agency', Icon: Building2 },
  { id: 'lawyer', label: 'Sign in as Lawyer', Icon: Scale },
]

/**
 * Full-screen entry gate — pick User, Agency, or Lawyer, then Google sign-in.
 *
 * @param {boolean} open
 * @param {(role: 'user' | 'agency' | 'lawyer') => void} onSignedIn
 */
export default function RoleGate({ open, onSignedIn }) {
  const enterRef = useRef(null)
  const googleBtnRef = useRef(null)
  const pathRef = useRef(null)
  /** @type {null | 'user' | 'agency' | 'lawyer'} */
  const [path, setPath] = useState(null)
  const [signingIn, setSigningIn] = useState(false)
  const [toast, setToast] = useState('')
  const [googleReady, setGoogleReady] = useState(false)

  const clearToast = useCallback(() => setToast(''), [])

  useEffect(() => {
    pathRef.current = path
  }, [path])

  useEffect(() => {
    if (!open) {
      setPath(null)
      setSigningIn(false)
      setToast('')
      setGoogleReady(false)
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

  useEffect(() => {
    if (!open || !path || !googleBtnRef.current) {
      setGoogleReady(false)
      return undefined
    }

    let cancelled = false
    setGoogleReady(false)
    setToast('')

    ;(async () => {
      try {
        await mountGoogleButton(googleBtnRef.current, {
          onCredential: async (idToken) => {
            const type = pathRef.current
            if (!type || signingIn) return

            setSigningIn(true)
            setToast('')
            try {
              const data = await webApi('/auth/google', {
                method: 'POST',
                body: JSON.stringify({ idToken, type }),
              })
              const role = enterFromGoogleAuth(data)
              onSignedIn?.(role)
            } catch (err) {
              setToast(err?.message || 'Google sign-in failed. Please try again.')
            } finally {
              setSigningIn(false)
            }
          },
          onError: (err) => {
            setToast(err?.message || 'Google sign-in failed.')
          },
        })
        if (!cancelled) setGoogleReady(true)
      } catch (err) {
        if (!cancelled) {
          const message = err?.message || 'Google Sign-In failed to load'
          // Common local-dev cause of 403
          if (/403|origin/i.test(message)) {
            setToast(
              `Google blocked this origin (${window.location.origin}). Add it in Google Cloud → Credentials → Authorized JavaScript origins.`,
            )
          } else {
            setToast(message)
          }
        }
      }
    })()

    return () => {
      cancelled = true
      if (googleBtnRef.current) googleBtnRef.current.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, path, onSignedIn])

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
      <Toast
        open={Boolean(toast)}
        message={toast}
        variant="error"
        duration={4000}
        onClose={clearToast}
      />

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

            <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl shadow-brand-dark/25 sm:max-w-md">
              <p className="mb-3 text-center text-xs font-semibold text-slate-500">
                {signingIn
                  ? 'Signing in with Makaan…'
                  : googleReady
                    ? `Continue with Google as ${isUserPath ? 'User' : isAgencyPath ? 'Agency' : 'Lawyer'}`
                    : 'Loading Google…'}
              </p>
              <div
                ref={googleBtnRef}
                className={`flex min-h-[44px] items-center justify-center ${
                  signingIn || toast ? 'pointer-events-none opacity-60' : ''
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setPath(null)
                setSigningIn(false)
                setGoogleReady(false)
              }}
              disabled={signingIn || Boolean(toast)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-soft/80 transition hover:text-white disabled:opacity-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to account type
            </button>

            <p className="mt-4 max-w-sm text-center text-[10px] leading-relaxed text-brand-soft/55">
              If Google shows 403, add <span className="font-semibold text-white/80">{typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}</span> in
              Google Cloud Console → OAuth Client → Authorized JavaScript origins.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
