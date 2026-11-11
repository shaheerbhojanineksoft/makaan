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
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="buyer-guide-popup-title"
    >
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[1.75rem] shadow-[0_30px_80px_rgb(0_0_0/0.5)] ring-1 ring-amber-400/20">
        <div className="relative aspect-[16/10] min-h-[420px] w-full sm:min-h-[480px]">
          <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {/* Caution / fraud-protection atmosphere */}
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-amber-950/40" />
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
            className="absolute top-4 right-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25"
            aria-label="Close guidance"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-amber-500/20 px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-amber-100 uppercase backdrop-blur-md">
              <ShieldAlert className="h-3.5 w-3.5" />
              Stay safe from property fraud
            </span>

            <h2
              id="buyer-guide-popup-title"
              className="mt-3 max-w-xl font-display text-3xl font-extrabold text-balance text-white sm:text-4xl lg:text-5xl"
            >
              Before You Buy / Rent
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
              Scams hide in rushed deals. Pause, verify papers, and protect your money before you
              commit.
            </p>

            <ul className="mt-5 max-w-xl space-y-2">
              {BULLETS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm font-semibold text-white/90">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-slate-900 shadow-lg transition hover:bg-brand-soft"
              >
                Continue to dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/before-you-buy"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/35 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <Scale className="h-4 w-4" />
                Read full guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
