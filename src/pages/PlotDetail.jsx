import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlignLeft,
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Hash,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  SearchX,
  Send,
  ShieldCheck,
  SquareStack,
  UserRound,
  Wallet,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import FavoriteButton from '../components/FavoriteButton'
import PlotCard from '../components/PlotCard'
import SectionHeading from '../components/ui/SectionHeading'
import { getOtherPlots, getPlotById } from '../data/plots'
import { getAgentById } from '../data/agents'
import { FAVORITE_KINDS } from '../utils/favorites'
import { formatMonthYear, formatPKR } from '../utils/format'

/**
 * Plot detail screen — `/plots/:id`.
 *
 * Opened by tapping any card in the home page "Exclusive Featured Plots"
 * section. The layout follows the brief for that flow:
 *
 *   1. plot information down the left (gallery, summary, specs, highlights)
 *   2. a query form for the listing agency pinned alongside it on the right
 *   3. "Explore More Plots" as the final block of the page
 *
 * The shared Navbar and Footer render around this screen like any other route.
 */

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none'

const PANEL_CLASS =
  'rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-7'

const CONTACT_TIMES = [
  'Any time',
  'Morning (9 AM - 12 PM)',
  'Afternoon (12 PM - 4 PM)',
  'Evening (4 PM - 8 PM)',
]

/** Labelled form control wrapper. */
function Field({ label, htmlFor, hint, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">{label}</span>
        {hint && <span className="text-[11px] font-medium text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

/** Titled panel used for every block of plot information on the left column. */
function DetailSection({ icon: Icon, title, children }) {
  return (
    <section className={PANEL_CLASS}>
      <h2 className="flex items-center gap-3 font-display text-base font-bold text-slate-900">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/** Icon + label + value row shared by the spec list and the agency panel. */
function DetailRow({ icon: Icon, label, value }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
        <p className="mt-0.5 text-sm font-semibold break-words text-slate-800">{value}</p>
      </div>
    </li>
  )
}

/** Compact headline statistic inside the price strip. */
function Stat({ icon: Icon, label, value }) {
  return (
    <li>
      <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
        <Icon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </li>
  )
}

/** Main gallery with a thumbnail strip; falls back to the card image. */
function PlotGallery({ plot }) {
  const [active, setActive] = useState(0)
  const images = plot.gallery?.length ? plot.gallery : [plot.image]

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-brand-soft shadow-glass ring-1 ring-slate-900/10">
        <img
          src={images[active]}
          alt={`${plot.title} — image ${active + 1} of ${images.length}`}
          className="aspect-16/10 w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand/60 via-brand/5 to-transparent"
          aria-hidden="true"
        />

        <FavoriteButton
          kind={FAVORITE_KINDS.plot}
          id={plot.id}
          size="md"
          className="absolute top-4 right-4"
        />

        <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-700 backdrop-blur">
          {active + 1} / {images.length}
        </span>

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
          {plot.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-brand uppercase backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <li key={`${image}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                className={`block w-full overflow-hidden rounded-xl ring-2 transition ${
                  index === active ? 'ring-brand' : 'ring-transparent hover:ring-brand/40'
                }`}
              >
                <img src={image} alt="" loading="lazy" className="aspect-4/3 w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Headline identity of the plot: badges, title, location and the price strip. */
function PlotSummary({ plot }) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="green" icon={BadgeCheck}>
          Verified Listing
        </Badge>
        <Badge variant="green" icon={Building2}>
          {plot.plotType}
        </Badge>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
          Ref {plot.id}
        </span>
      </div>

      <h1 className="mt-4 font-display text-3xl leading-tight font-extrabold text-balance text-slate-900 sm:text-4xl">
        {plot.title}
      </h1>

      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        {plot.location}
      </p>

      <div className="mt-6 grid gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:grid-cols-[1.1fr_1fr] sm:items-center">
        <div>
          <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
            Demand Price
          </p>
          <p className="font-display text-3xl font-extrabold text-brand">
            {formatPKR(plot.price)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Ruler className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
            {plot.pricePerUnit}
          </p>
        </div>

        <ul className="grid gap-4 border-t border-dashed border-slate-200 pt-5 sm:grid-cols-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          <Stat icon={SquareStack} label="Plot Size" value={plot.size} />
          <Stat icon={Building2} label="Plot Type" value={plot.plotType} />
          <Stat icon={Clock3} label="Possession" value={plot.possession} />
          <Stat icon={CalendarCheck} label="Listed" value={formatMonthYear(plot.listedOn)} />
        </ul>
      </div>
    </div>
  )
}

/** Everything the buyer needs to evaluate the plot, stacked on the left. */
function PlotInformation({ plot }) {
  return (
    <div className="mt-6 space-y-6">
      <DetailSection icon={AlignLeft} title="About This Plot">
        <p className="text-sm leading-relaxed text-slate-600">{plot.description}</p>
      </DetailSection>

      <DetailSection icon={FileText} title="Plot Specifications">
        <ul className="grid gap-4 sm:grid-cols-2">
          <DetailRow icon={Hash} label="Plot Number" value={plot.plotNumber} />
          <DetailRow icon={MapPin} label="Block / Sector" value={plot.block} />
          <DetailRow icon={Ruler} label="Dimensions" value={plot.dimensions} />
          <DetailRow icon={SquareStack} label="Plot Size" value={plot.size} />
          <DetailRow icon={Clock3} label="Possession" value={plot.possession} />
          <DetailRow icon={ShieldCheck} label="Ownership" value={plot.ownership} />
          <DetailRow
            icon={Wallet}
            label="Development Charges"
            value={plot.developmentCharges}
          />
          <DetailRow
            icon={CalendarCheck}
            label="Last Updated"
            value={formatMonthYear(plot.updatedOn)}
          />
        </ul>
      </DetailSection>

      <DetailSection icon={ListChecks} title="Plot Highlights">
        <ul className="grid gap-3 sm:grid-cols-2">
          {plot.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      </DetailSection>
    </div>
  )
}

/**
 * Right column — the query the listing agency answers.
 *
 * Self-contained: native form constraints, an inline confirmation and the plot
 * reference carried along in hidden fields, so swapping the TODO for a real
 * `POST /api/plots/:id/enquiries` call needs no markup changes.
 */
function EnquiryForm({ plot, agent }) {
  const [sent, setSent] = useState(false)
  const agency = agent ? agent.agency : 'our team'
  const responseTime = agent ? agent.responseTime.toLowerCase() : 'within 24 hours'

  function handleSubmit(event) {
    event.preventDefault()
    const payload = Object.fromEntries(new FormData(event.currentTarget))

    /* TODO: POST /api/plots/:id/enquiries */
    // eslint-disable-next-line no-console
    console.info('[PlotDetail] query submitted:', payload)

    event.currentTarget.reset()
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className={PANEL_CLASS}>
      <input type="hidden" name="plotId" value={plot.id} />
      <input type="hidden" name="plotTitle" value={plot.title} />

      <h2 className="font-display text-xl font-extrabold text-slate-900">Submit Your Query</h2>
      <span className="mt-3 block h-1.5 w-16 rounded-full bg-brand" aria-hidden="true" />
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Share your details and {agency} will get back to you about this plot — usually{' '}
        {responseTime}.
      </p>

      {agent && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-soft p-3.5 ring-1 ring-brand/10">
          <img
            src={agent.avatar}
            alt={agent.name}
            loading="lazy"
            className="h-11 w-11 shrink-0 rounded-full bg-white object-cover ring-2 ring-white"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{agent.name}</p>
            <p className="truncate text-[11px] font-medium text-slate-500">{agent.agency}</p>
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-brand ring-1 ring-brand/15">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified
          </span>
        </div>
      )}

      <div className="mt-6 space-y-5">
        <Field label="Full Name" htmlFor="plot-name">
          <input
            id="plot-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Ahmed Raza"
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Phone Number" htmlFor="plot-phone">
          <input
            id="plot-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern="[0-9+\(\)\s\-]{7,20}"
            title="Enter a valid phone number, e.g. +92 300 0000000"
            placeholder="+92 300 0000000"
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Email Address" htmlFor="plot-email" hint="Optional">
          <input
            id="plot-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Best Time to Call" htmlFor="plot-time">
          <span className="relative block">
            <select
              id="plot-time"
              name="preferredTime"
              defaultValue={CONTACT_TIMES[0]}
              className={`${FIELD_CLASS} appearance-none pr-10`}
            >
              {CONTACT_TIMES.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </span>
        </Field>

        <Field label="Message" htmlFor="plot-message" hint="Optional">
          <textarea
            id="plot-message"
            name="message"
            rows={4}
            placeholder="Ask about possession, the transfer timeline, a site visit or the payment plan."
            className={`${FIELD_CLASS} resize-y`}
          />
        </Field>

        <label
          htmlFor="plot-consent"
          className="flex items-start gap-3 text-xs leading-relaxed font-medium text-slate-600"
        >
          <input
            id="plot-consent"
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand"
          />
          I agree to be contacted by {agency} about this plot.
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Submit Query
      </button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-slate-500">
        <BadgeCheck className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        Your details stay private and are never shared.
      </p>

      {sent && (
        <p
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-xl bg-brand-soft px-4 py-3 text-xs font-semibold text-brand ring-1 ring-brand/15"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Thanks — your query is with {agency}. Expect a call {responseTime}.
        </p>
      )}
    </form>
  )
}

/** Direct contact channels for buyers who would rather call the agency. */
function AgencyPanel({ agent }) {
  if (!agent) return null

  const whatsappLink = `https://wa.me/${agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    'I would like more details about a featured plot listed on Pakistan Property Portal.',
  )}`

  return (
    <section className={PANEL_CLASS}>
      <h2 className="font-display text-base font-bold text-slate-900">Or Contact the Agency</h2>
      <ul className="mt-4 space-y-4">
        <DetailRow icon={UserRound} label="Listing Agent" value={agent.name} />
        <DetailRow icon={Building2} label="Agency" value={agent.agency} />
        <DetailRow icon={Clock3} label="Typical Response" value={agent.responseTime} />
        <DetailRow icon={Phone} label="Phone" value={agent.phone} />
        <DetailRow icon={Mail} label="Email" value={agent.email} />
      </ul>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={`tel:${agent.phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-bold text-brand transition hover:bg-brand-soft"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Now
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/25 transition hover:bg-[#1EBE57]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </section>
  )
}

/** Shown when `/plots/:id` is opened with an id that is no longer listed. */
function PlotNotFound({ id }) {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-brand-soft px-4 py-20 sm:px-6">
      <div
        className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white shadow-xl shadow-brand/25">
          <SearchX className="h-8 w-8" aria-hidden="true" />
        </span>

        <span className="mt-6 inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-extrabold tracking-wider text-brand uppercase ring-1 ring-brand/15">
          Plot Unavailable
        </span>

        <h1 className="mt-4 font-display text-3xl font-extrabold text-balance text-slate-900 sm:text-4xl">
          This Plot Is No Longer Listed
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          We could not find a featured plot with the reference {id}. It may have been sold,
          reserved or moved to another section of the portal.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Featured Plots
        </Link>
      </div>
    </section>
  )
}

export default function PlotDetail() {
  const { id } = useParams()
  const plot = getPlotById(id)

  if (!plot) return <PlotNotFound id={id} />

  const agent = getAgentById(plot.agentId)
  const morePlots = getOtherPlots(plot.id, 3)

  return (
    <>
      {/* ------------------------------------------- 1. Plot + call-back form */}
      <section className="relative isolate overflow-hidden bg-white pb-16 sm:pb-20 lg:pb-24">
        <div
          className="pointer-events-none absolute -top-32 -left-24 -z-10 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-40 -right-24 -z-10 h-80 w-80 rounded-full bg-brand-light/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-brand transition hover:bg-brand-soft"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Featured Plots
            </Link>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            {/* Plot information */}
            <div className="lg:col-span-7 xl:col-span-8">
              <PlotGallery plot={plot} />
              <PlotSummary plot={plot} />
              <PlotInformation plot={plot} />
            </div>

            {/* Agency call-back rail */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-24">
                <EnquiryForm plot={plot} agent={agent} />
                <AgencyPanel agent={agent} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* --------------------------------------------- 2. Explore more plots */}
      <section id="explore-more-plots" className="bg-brand-soft py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Keep Exploring"
            title="Explore More Plots"
            description="Other hand-picked plots from the same verified inventory — open any card for its full detail page."
            action={
              <Link
                to="/plots"
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
              >
                Browse all plots
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {morePlots.map((other) => (
              <PlotCard key={other.id} plot={other} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
