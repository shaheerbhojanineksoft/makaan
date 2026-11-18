import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Scale, ShieldAlert, ShieldCheck, X } from 'lucide-react'

/** Dark, serious visual — paperwork / verification mood for anti-fraud guidance. */
const POSTER =
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80'

const BULLETS = [
  'Check ownership, title and society papers before you pay',
  'Use a written rent / sale agreement — never blank forms',
  'Verify every deal with a trusted property lawyer',
  'Prefer bank transfers and keep every receipt',
]

/**
 * Splash / poster-style guidance shown after login or dashboard restart.
 */
export default function BuyerGuidePopup({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'

    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="buyer-guide-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
        aria-label="Close guidance"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[min(100dvh,920px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.5rem] bg-slate-950 shadow-[0_30px_80px_rgb(0_0_0/0.5)] ring-1 ring-amber-400/20 sm:max-h-[90dvh] sm:rounded-[1.75rem]">
        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="relative min-h-0 sm:min-h-[min(420px,70dvh)]">
            <img
              src={POSTER}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-amber-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-950/45 via-transparent to-brand/20" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(-45deg, rgba(251,191,36,0.35) 0 2px, transparent 2px 14px)',
              }}
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 sm:top-4 sm:right-4 sm:h-11 sm:w-11"
              aria-label="Close guidance"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10 flex flex-col justify-end px-4 pt-14 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-20 sm:pb-8 lg:px-10 lg:pb-10">
              <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/20 px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-amber-100 uppercase backdrop-blur-md sm:text-[11px]">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Stay safe from property fraud</span>
              </span>

              <h2
                id="buyer-guide-popup-title"
                className="mt-2.5 max-w-xl font-display text-[1.45rem] leading-tight font-extrabold text-balance text-white sm:mt-3 sm:text-4xl lg:text-5xl"
              >
                Before You Buy / Rent
              </h2>
              <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-white/85 sm:mt-3 sm:text-base">
                Scams hide in rushed deals. Pause, verify papers, and protect your money before you
                commit.
              </p>

              <ul className="mt-3 max-w-xl space-y-1.5 sm:mt-5 sm:space-y-2">
                {BULLETS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[12px] font-semibold text-white/90 sm:text-sm"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-slate-900 shadow-lg transition hover:bg-brand-soft sm:w-auto sm:px-6"
                >
                  Continue to dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/before-you-buy"
                  onClick={onClose}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/35 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto"
                >
                  <Scale className="h-4 w-4" />
                  Read full guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
