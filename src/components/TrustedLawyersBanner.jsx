import { Link } from 'react-router-dom'
import { ArrowRight, Scale, ShieldCheck } from 'lucide-react'

/**
 * Compact trust CTA on the home dashboard — points first-time buyers/renters
 * to trusted lawyer help without a heavy section.
 */
export default function TrustedLawyersBanner() {
  return (
    <section className="bg-offwhite px-4 py-6 sm:px-6 sm:py-8 lg:px-8" aria-label="Trusted lawyers">
      <div className="mx-auto max-w-[90rem] overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-white to-brand-soft/60 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800 ring-1 ring-amber-200/80">
              <Scale className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide text-amber-800 uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                Stay safe from property fraud
              </p>
              <h2 className="mt-1 font-display text-lg font-extrabold text-slate-900 sm:text-xl">
                Buying or renting first time? Talk to our trusted lawyers
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Get paperwork and deal checks before you pay token, rent advance, or transfer money.
              </p>
            </div>
          </div>

          <Link
            to="/trusted-lawyers"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark sm:self-center"
          >
            Talk to lawyers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
