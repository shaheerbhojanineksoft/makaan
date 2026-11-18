import { useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Newspaper,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
  X,
} from 'lucide-react'

import BookingProjectCard from '../components/BookingProjectCard'
import Badge from '../components/ui/Badge'
import FavoriteButton from '../components/FavoriteButton'
import { getOtherProjects, getProjectById } from '../data/projects'
import { FAVORITE_KINDS } from '../utils/favorites'
import { formatMonthYear, formatPKR } from '../utils/format'

const PANEL =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-6'
const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const UNIT_LABELS = [
  { key: 'flats', label: 'Flats' },
  { key: 'villas', label: 'Villas' },
  { key: 'shops', label: 'Shops' },
  { key: 'offices', label: 'Offices' },
  { key: 'plots', label: 'Plots' },
]

const TIMELINE_DOT = {
  done: 'bg-brand ring-brand/20',
  current: 'bg-amber-500 ring-amber-200',
  upcoming: 'bg-slate-300 ring-slate-200',
}

function FacilityRow({ allowed, label }) {
  return (
    <li
      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
        allowed ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'
      }`}
    >
      {allowed ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
      ) : (
        <X className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      {label}
      <span className="ml-auto text-xs font-bold tracking-wide uppercase">
        {allowed ? 'Allowed' : 'Not available'}
      </span>
    </li>
  )
}

function EnquiryForm({ project }) {
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    event.currentTarget.reset()
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className={PANEL}>
      <input type="hidden" name="projectId" value={project.id} />
      <h2 className="font-display text-xl font-extrabold text-slate-900">Submit Your Query</h2>
      <span className="mt-3 block h-1.5 w-16 rounded-full bg-brand" aria-hidden="true" />
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Leave your details and {project.agency || project.developer} will get back to you about this
        project.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Full Name
          </span>
          <input name="name" type="text" required autoComplete="name" className={FIELD} />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Phone Number
          </span>
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern="[0-9+()\s-]{7,20}"
            className={FIELD}
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Email <span className="font-medium normal-case text-slate-400">Optional</span>
          </span>
          <input name="email" type="email" autoComplete="email" className={FIELD} />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Message <span className="font-medium normal-case text-slate-400">Optional</span>
          </span>
          <textarea
            name="message"
            rows={4}
            placeholder="Ask about booking, payment plan or a site visit."
            className={`${FIELD} resize-y`}
          />
        </label>
        <label className="flex items-start gap-3 text-xs leading-relaxed font-medium text-slate-600">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand"
          />
          I agree to be contacted about this project.
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Submit Query
      </button>

      {sent ? (
        <p
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-xl bg-brand-soft px-4 py-3 text-xs font-semibold text-brand ring-1 ring-brand/15"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Thanks — your query has been submitted.
        </p>
      ) : null}
    </form>
  )
}

export default function AdvanceBookingDetail() {
  const { id } = useParams()
  const location = useLocation()
  const project = useMemo(() => getProjectById(id), [id])
  const others = useMemo(() => getOtherProjects(id, 3), [id])
  const backTo = location.state?.from || '/advanced-booking'

  if (!project) {
    return <Navigate to="/advanced-booking" replace />
  }

  const phoneDigits = String(project.phone || '').replace(/\D/g, '')
  const whatsappLink = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
        `I would like more information about ${project.name}.`,
      )}`
    : null
  const callLink = phoneDigits ? `tel:${project.phone}` : null
  const unitLines = UNIT_LABELS.filter(({ key }) => (project.unitCounts?.[key] || 0) > 0)
  const media = project.media?.length ? project.media : [project.image].filter(Boolean)

  return (
    <section className="min-h-screen bg-offwhite pb-16">
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-brand transition hover:bg-brand-soft"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Advanced Booking
          </Link>
          <FavoriteButton kind={FAVORITE_KINDS.project} id={project.id} size="md" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="relative aspect-[16/9] max-h-[28rem] bg-brand-soft sm:aspect-[21/9]">
            <img
              src={project.image}
              alt={project.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge variant="solid">{project.bookingStatus}</Badge>
                <Badge variant="green">{project.projectType}</Badge>
              </div>
              <h1 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-4xl">
                {project.name}
              </h1>
              <p className="mt-2 text-sm font-semibold text-white/85">
                {project.city} · {project.area}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-8">
            <section className={PANEL}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
                    Builder
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold text-slate-900">
                    {project.developer}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{project.agency}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                    Price range
                  </p>
                  <p className="mt-1 font-display text-lg font-extrabold text-brand">
                    {formatPKR(project.minPrice)} – {formatPKR(project.maxPrice)}
                  </p>
                </div>
              </div>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                <FacilityRow allowed={project.installmentsAllowed} label="Installments" />
                <FacilityRow allowed={project.bankTransferAllowed} label="Bank transfer" />
              </ul>

              {unitLines.length > 0 ? (
                <div className="mt-5">
                  <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                    Unit inventory
                  </p>
                  <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {unitLines.map(({ key, label }) => (
                      <li
                        key={key}
                        className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3"
                      >
                        <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
                          <Store className="h-3.5 w-3.5 text-brand" />
                          {label}
                        </p>
                        <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                          {project.unitCounts[key]}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <section className={PANEL}>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <Sparkles className="h-5 w-5 text-brand" />
                Project amenities
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(project.amenities || []).map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand ring-1 ring-brand/15"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {item}
                  </li>
                ))}
              </ul>
              {project.highlights?.length ? (
                <ul className="mt-5 space-y-2.5 border-t border-dashed border-slate-200 pt-5">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className={PANEL}>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <CalendarClock className="h-5 w-5 text-brand" />
                Project timeline
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Expected completion {formatMonthYear(project.completionDate)}
                {project.possessionDate
                  ? ` · possession ${formatMonthYear(project.possessionDate)}`
                  : ''}
              </p>
              <ol className="relative mt-6 space-y-5 border-l border-slate-200 pl-5">
                {(project.timeline || []).map((step) => (
                  <li key={`${step.label}-${step.date}`} className="relative">
                    <span
                      className={`absolute top-1 -left-[1.55rem] h-3 w-3 rounded-full ring-4 ${
                        TIMELINE_DOT[step.status] || TIMELINE_DOT.upcoming
                      }`}
                    />
                    <p className="text-sm font-bold text-slate-900">{step.label}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock3 className="h-3.5 w-3.5 text-brand" />
                      {formatMonthYear(step.date)}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize text-slate-600">
                        {step.status}
                      </span>
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {project.blog ? (
              <section className={PANEL}>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <Newspaper className="h-5 w-5 text-brand" />
                  Blog on this project
                </h2>
                <p className="mt-4 font-display text-xl font-extrabold text-slate-900">
                  {project.blog.title}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {formatMonthYear(project.blog.publishedAt)}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{project.blog.body}</p>
              </section>
            ) : null}

            <section className={PANEL}>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <Building2 className="h-5 w-5 text-brand" />
                Project media
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {media.map((src) => (
                  <div
                    key={src}
                    className="aspect-[4/3] overflow-hidden rounded-xl bg-brand-soft"
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>

            {project.installmentPlan?.length ? (
              <section className={PANEL}>
                <h2 className="font-display text-lg font-bold text-slate-900">Payment plan</h2>
                <ul className="mt-4 divide-y divide-slate-100">
                  {project.installmentPlan.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-3 py-3 text-sm"
                    >
                      <span className="font-semibold text-slate-600">{row.label}</span>
                      <span className="font-bold text-slate-900">
                        {row.amount ? formatPKR(row.amount) : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message on WhatsApp
                </a>
              ) : null}
              {callLink ? (
                <a
                  href={callLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-white px-4 py-3.5 text-sm font-bold text-brand transition hover:bg-brand-soft"
                >
                  <Phone className="h-4 w-4" />
                  Call for more info
                </a>
              ) : null}
            </div>

            <EnquiryForm project={project} />

            <div className={`${PANEL} space-y-3`}>
              <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <UserRound className="h-4 w-4 text-brand" />
                Sales desk
              </p>
              <p className="text-sm font-semibold text-slate-700">{project.agency}</p>
              <p className="text-xs text-slate-500">{project.email}</p>
              <p className="text-xs font-semibold text-slate-600">{project.phone}</p>
            </div>
          </aside>
        </div>

        {others.length > 0 ? (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              More booking projects
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {others.map((item) => (
                <BookingProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
