import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlignLeft,
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  ListChecks,
  MapPin,
  Maximize,
  Mail,
  MessageCircle,
  Phone,
  SearchX,
  Send,
  UserRound,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import SectionHeading from '../components/ui/SectionHeading'
import { formatMonthYear, formatPKR } from '../utils/format'
import { getOtherProperties, getPropertyById } from '../data/properties'
import { getAgentById } from '../data/agents'

const PANEL_CLASS =
  'rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-7'
const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none'

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

function PropertyInformation({ property }) {
  return (
    <div className="mt-6 space-y-6">
      <DetailSection icon={AlignLeft} title="About This Property">
        <p className="text-sm leading-relaxed text-slate-600">{property.description}</p>
      </DetailSection>

      <DetailSection icon={FileText} title="Property Specifications">
        <ul className="grid gap-4 sm:grid-cols-2">
          <DetailRow icon={Building2} label="Property Type" value={property.propertyType} />
          {property.beds > 0 && (
            <DetailRow icon={BedDouble} label="Bedrooms" value={property.beds} />
          )}
          <DetailRow icon={Bath} label="Bathrooms" value={property.baths} />
          <DetailRow icon={Maximize} label="Area" value={property.area} />
          <DetailRow
            icon={Building2}
            label="Purpose"
            value={property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
          />
          <DetailRow
            icon={CalendarCheck}
            label="Listed"
            value={formatMonthYear(property.listedAt)}
          />
        </ul>
      </DetailSection>

      <DetailSection icon={ListChecks} title="Property Highlights">
        <ul className="grid gap-3 sm:grid-cols-2">
          {property.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2.5 text-sm font-medium text-slate-700"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      </DetailSection>
    </div>
  )
}

function EnquiryForm({ property }) {
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    event.currentTarget.reset()
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className={PANEL_CLASS}>
      <input type="hidden" name="propertyId" value={property.id} />
      <input type="hidden" name="propertyTitle" value={property.title} />

      <h2 className="font-display text-xl font-extrabold text-slate-900">Submit Your Query</h2>
      <span className="mt-3 block h-1.5 w-16 rounded-full bg-brand" aria-hidden="true" />
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Leave your details and {property.agent.agency} will get back to you about this property.
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-soft p-3.5 ring-1 ring-brand/10">
        <img
          src={property.agent.avatar}
          alt={property.agent.name}
          loading="lazy"
          className="h-11 w-11 shrink-0 rounded-full bg-white object-cover ring-2 ring-white"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{property.agent.name}</p>
          <p className="truncate text-[11px] font-medium text-slate-500">
            {property.agent.agency}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Full Name
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Ahmed Raza"
            className={FIELD_CLASS}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Phone Number
          </span>
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern="[0-9+()\s-]{7,20}"
            title="Enter a valid phone number"
            placeholder="+92 300 0000000"
            className={FIELD_CLASS}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Email Address <span className="font-medium normal-case text-slate-400">Optional</span>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={FIELD_CLASS}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-slate-600 uppercase">
            Message <span className="font-medium normal-case text-slate-400">Optional</span>
          </span>
          <textarea
            name="message"
            rows={4}
            placeholder="Ask about the property or request a visit."
            className={`${FIELD_CLASS} resize-y`}
          />
        </label>
        <label className="flex items-start gap-3 text-xs leading-relaxed font-medium text-slate-600">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-brand"
          />
          I agree to be contacted by {property.agent.agency} about this property.
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Submit Query
      </button>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-slate-500">
        <UserRound className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        Your details stay private.
      </p>
      {sent && (
        <p
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-xl bg-brand-soft px-4 py-3 text-xs font-semibold text-brand ring-1 ring-brand/15"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Thanks — your query has been submitted.
        </p>
      )}
    </form>
  )
}

function AgencyPanel({ agent, property }) {
  if (!agent) return null

  const whatsappLink = `https://wa.me/${agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `I would like more details about ${property.title}.`,
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

function PropertyNotFound({ id }) {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-brand-soft px-4 py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white shadow-xl shadow-brand/25">
          <SearchX className="h-8 w-8" />
        </span>
        <p className="mt-6 text-xs font-extrabold tracking-wider text-brand uppercase">
          Property Unavailable
        </p>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
          This Property Is No Longer Listed
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We could not find a property with the reference {id}.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </section>
  )
}

export default function PropertyDetail() {
  const { id } = useParams()
  const property = getPropertyById(id)

  if (!property) return <PropertyNotFound id={id} />

  const moreProperties = getOtherProperties(property.id, 3)
  const agent = getAgentById(property.agentId)
  const isRent = property.purpose === 'rent'

  return (
    <>
      <section className="relative isolate overflow-hidden bg-white pb-16 sm:pb-20 lg:pb-24">
        <div
          className="pointer-events-none absolute -top-32 -left-24 -z-10 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-brand transition hover:bg-brand-soft"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Fresh Properties
            </Link>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="relative overflow-hidden rounded-3xl bg-brand-soft shadow-glass ring-1 ring-slate-900/10">
                <img
                  src={property.image}
                  alt={property.title}
                  className="aspect-16/10 w-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-brand/50 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-brand backdrop-blur">
                  {property.propertyType}
                </span>
                <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-700 backdrop-blur">
                  Added {formatMonthYear(property.listedAt)}
                </span>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="green" icon={Building2}>
                    {property.propertyType}
                  </Badge>
                  <Badge variant="green">{isRent ? 'For Rent' : 'For Sale'}</Badge>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    Ref {property.id}
                  </span>
                </div>
                <h1 className="mt-4 font-display text-3xl leading-tight font-extrabold text-balance text-slate-900 sm:text-4xl">
                  {property.title}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  {property.location}
                </p>

                <div className="mt-6 grid gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:grid-cols-[1.1fr_1fr] sm:items-center">
                  <div>
                    <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                      {isRent ? 'Monthly Rent' : 'Demand Price'}
                    </p>
                    <p className="font-display text-3xl font-extrabold text-brand">
                      {formatPKR(property.price)}
                      {isRent && (
                        <span className="ml-1 text-sm font-bold text-slate-400">/month</span>
                      )}
                    </p>
                  </div>
                  <ul className="grid grid-cols-2 gap-4 border-t border-dashed border-slate-200 pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                    {property.beds > 0 && (
                      <li className="text-sm font-bold text-slate-800">
                        <BedDouble className="mr-1.5 inline h-4 w-4 text-brand" aria-hidden="true" />
                        {property.beds} Beds
                      </li>
                    )}
                    <li className="text-sm font-bold text-slate-800">
                      <Bath className="mr-1.5 inline h-4 w-4 text-brand" aria-hidden="true" />
                      {property.baths} Baths
                    </li>
                    <li className="text-sm font-bold text-slate-800">
                      <Maximize className="mr-1.5 inline h-4 w-4 text-brand" aria-hidden="true" />
                      {property.area}
                    </li>
                    <li className="text-sm font-bold text-slate-800">
                      <Clock3 className="mr-1.5 inline h-4 w-4 text-brand" aria-hidden="true" />
                      New Listing
                    </li>
                  </ul>
                </div>
              </div>

              <PropertyInformation property={property} />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-24">
                <EnquiryForm property={property} />
                <AgencyPanel agent={agent} property={property} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Keep Exploring"
            title="More Fresh Properties"
            description="Explore other recently added homes and properties."
            action={
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
              >
                Browse all properties
              </Link>
            }
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreProperties.map((other) => (
              <article
                key={other.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card transition hover:-translate-y-1"
              >
                <Link to={`/properties/${other.id}`} className="block">
                  <img
                    src={other.image}
                    alt={other.title}
                    loading="lazy"
                    className="aspect-16/10 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="p-5">
                    <p className="text-xs font-bold text-brand">{other.propertyType}</p>
                    <h3 className="mt-2 font-display font-bold text-slate-900 group-hover:text-brand">
                      {other.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-slate-500">{other.location}</p>
                    <p className="mt-4 font-display text-lg font-extrabold text-brand">
                      {formatPKR(other.price)}
                      {other.purpose === 'rent' && (
                        <span className="text-xs font-bold text-slate-400"> /month</span>
                      )}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
