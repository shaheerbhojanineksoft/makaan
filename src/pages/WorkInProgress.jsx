import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'

/**
 * Lightweight placeholder for flows that are not built yet
 * (e.g. Advanced Booking "Book Now").
 *
 * No Navbar / Footer — only a back control and a short status message.
 */
export default function WorkInProgress({
  title = 'Work Under Progress',
  description = 'This booking flow is being built. Please check back soon.',
  backTo = '/',
  backLabel = 'Back to Home',
}) {
  return (
    <section className="relative flex min-h-screen flex-col bg-offwhite">
      <Link
        to={backTo}
        aria-label={backLabel}
        className="absolute top-4 left-4 z-10 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-brand shadow-sm transition hover:bg-brand-soft sm:top-5 sm:left-5 lg:left-6"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand ring-1 ring-brand/15">
          <Construction className="h-8 w-8" aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
    </section>
  )
}
