import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'

/**
 * Placeholder shell rendered by every not-yet-built route.
 *
 * Replace the matching <Route element={...}> in App.jsx with a real page
 * component when that screen ships — nothing else needs to change.
 */
export default function ComingSoon({
  title,
  description = 'This screen is scaffolded and ready to be built on top of the existing layout, theme and data layer.',
  icon: Icon = Compass,
  badge = 'Coming Soon',
}) {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-brand-soft px-4 py-20 sm:px-6">
      <div
        className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-brand-light/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white shadow-xl shadow-brand/25">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>

        <span className="mt-6 inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-extrabold tracking-wider text-brand uppercase ring-1 ring-brand/15">
          {badge}
        </span>

        <h1 className="mt-4 font-display text-3xl font-extrabold text-balance text-slate-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </section>
  )
}
