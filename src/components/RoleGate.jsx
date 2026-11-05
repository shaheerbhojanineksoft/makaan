import { useEffect, useRef } from 'react'
import { ArrowRight, Building2, UserRound } from 'lucide-react'

import Logo from './ui/Logo'

/**
 * Full-screen entry gate — User (seeker) or Agency paths.
 *
 * @param {boolean} open
 * @param {() => void} onEnterUser
 * @param {() => void} onEnterAgency
 */
export default function RoleGate({ open, onEnterUser, onEnterAgency }) {
  const enterRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

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

  if (!open) return null

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
            Choose how you&rsquo;d like to continue
          </h1>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-brand-soft/80 sm:mt-4 sm:text-base">
            Welcome to Makaan — Pakistan ka Apna Trusted Property Portal. Pick an account type to get
            started.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5">
          <button
            ref={enterRef}
            type="button"
            onClick={onEnterUser}
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
            onClick={onEnterAgency}
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
          You can switch between seeker and agency access anytime via Sign out.
        </p>
      </div>
    </div>
  )
}
