import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  AlignLeft,
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  SearchX,
  Send,
  ShieldCheck,
  Wallet,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import BookingProjectCard from '../components/BookingProjectCard'
import SectionHeading from '../components/ui/SectionHeading'
import { getOtherProjects, getProjectById } from '../data/projects'
import { formatMonthYear, formatPKR } from '../utils/format'

const PANEL_CLASS =
  'rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-7'

const FIELD_CLASS =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const STATUS_VARIANT = {
  'Booking Open': 'solid',
  'Pre-Launch': 'amber',
  'Coming Soon': 'green',
}

function DetailSection({ icon: Icon, title, children }) {
  return (
    <section className={PANEL_CLASS}>
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        {title}
      </h2>
      <span className="mt-3 block h-1 w-14 rounded-full bg-brand" aria-hidden="true" />
      <div className="mt-5">{children}</div>
    </section>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </li>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
      <div>
        <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </li>
  )
}

function ProjectGallery({ project }) {
  const images = project.gallery?.length ? project.gallery : [project.image]
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-brand-soft shadow-glass ring-1 ring-slate-900/10">
        <img
          src={images[active]}
          alt={`${project.name} — image ${active + 1} of ${images.length}`}
          className="aspect-16/10 w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand/60 via-brand/5 to-transparent"
          aria-hidden="true"
        />

        <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-700 backdrop-blur">
          {active + 1} / {images.length}
        </span>

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
          <Badge variant={STATUS_VARIANT[project.bookingStatus] ?? 'green'}>
            {project.bookingStatus}
          </Badge>
          {project.verified && (
            <Badge variant="green" icon={BadgeCheck} className="bg-white/95">
              Verified
            </Badge>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((image, index) => (
            <li key={image}>
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

function ProjectSummary({ project }) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-2">
        {project.verified && (
          <Badge variant="green" icon={BadgeCheck}>
            Verified Project
          </Badge>
        )}
        <Badge variant="green" icon={Building2}>
          {project.projectType}
        </Badge>
        <Badge variant="amber">{project.projectStatus}</Badge>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
          Ref {project.id}
        </span>
      </div>

      <h1 className="mt-4 font-display text-3xl leading-tight font-extrabold text-balance text-slate-900 sm:text-4xl">
        {project.name}
      </h1>

      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        {project.location}
      </p>

      <div className="mt-6 grid gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:grid-cols-[1.1fr_1fr] sm:items-center">
        <div>
          <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
            Starting From
          </p>
          <p className="font-display text-3xl font-extrabold text-brand">
            {formatPKR(project.startingPrice)}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Booking {formatPKR(project.bookingAmount)} · {project.paymentPlan} plan
          </p>
        </div>

        <ul className="grid gap-4 border-t border-dashed border-slate-200 pt-5 sm:grid-cols-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          <Stat icon={Wallet} label="Down Payment" value={formatPKR(project.downPayment)} />
          <Stat
            icon={CalendarCheck}
            label="Completion"
            value={formatMonthYear(project.completionDate)}
          />
          <Stat icon={Clock3} label="Possession" value={formatMonthYear(project.possessionDate)} />
          <Stat icon={Building2} label="Developer" value={project.developer} />
        </ul>
      </div>
    </div>
  )
}

function ProjectInformation({ project }) {
  return (
    <div className="mt-6 space-y-6">
      <DetailSection icon={AlignLeft} title="Project Overview">
        <p className="text-sm leading-relaxed text-slate-600">{project.description}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {project.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection icon={Building2} title="Developer / Agency">
        <ul className="grid gap-4 sm:grid-cols-2">
          <DetailRow icon={Building2} label="Developer" value={project.developer} />
          <DetailRow icon={ShieldCheck} label="Agency" value={project.agency} />
          <DetailRow icon={Phone} label="Phone" value={project.phone} />
          <DetailRow icon={Mail} label="Email" value={project.email} />
        </ul>
      </DetailSection>

      <DetailSection icon={MapPin} title="Location">
        <p className="mb-4 text-sm font-semibold text-slate-600">{project.location}</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
          <iframe
            title={`${project.name} map`}
            src={project.mapEmbedUrl}
            className="h-56 w-full border-0 sm:h-64"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </DetailSection>

      <DetailSection icon={ListChecks} title="Available Property Types & Sizes">
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80">
          {project.unitOptions.map((unit) => (
            <li
              key={`${unit.type}-${unit.size}`}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-sm"
            >
              <div>
                <p className="font-bold text-slate-800">{unit.type}</p>
                <p className="text-xs font-semibold text-slate-500">{unit.size}</p>
              </div>
              <p className="font-display text-base font-extrabold text-brand">
                {formatPKR(unit.price)}
              </p>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection icon={Wallet} title="Pricing & Payment Plan">
        <ul className="mb-5 grid gap-4 sm:grid-cols-2">
          <DetailRow icon={Wallet} label="Starting Price" value={formatPKR(project.startingPrice)} />
          <DetailRow icon={Wallet} label="Booking Amount" value={formatPKR(project.bookingAmount)} />
          <DetailRow icon={Wallet} label="Down Payment" value={formatPKR(project.downPayment)} />
          <DetailRow
            icon={CalendarCheck}
            label="Plan"
            value={`${project.paymentPlan} · ${project.paymentPlanDuration}`}
          />
        </ul>
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80">
          {project.installmentPlan.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <span className="font-semibold text-slate-600">{row.label}</span>
              <span className="font-bold text-slate-900">
                {row.amount > 0 ? formatPKR(row.amount) : '—'}
              </span>
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection icon={FileText} title="Project Specifications">
        <ul className="grid gap-4 sm:grid-cols-2">
          {project.specifications.map((spec) => (
            <DetailRow key={spec.label} icon={FileText} label={spec.label} value={spec.value} />
          ))}
          <DetailRow
            icon={CalendarCheck}
            label="Expected Completion"
            value={formatMonthYear(project.completionDate)}
          />
          <DetailRow
            icon={Clock3}
            label="Possession"
            value={formatMonthYear(project.possessionDate)}
          />
        </ul>
      </DetailSection>

      <DetailSection icon={ShieldCheck} title="Amenities & Facilities">
        <ul className="grid gap-3 sm:grid-cols-2">
          {project.amenities.map((amenity) => (
            <li
              key={amenity}
              className="flex items-center gap-2.5 text-sm font-medium text-slate-700"
            >
              <Check className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              {amenity}
            </li>
          ))}
        </ul>
      </DetailSection>
    </div>
  )
}

function BookingForm({ project }) {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    /* TODO: POST /api/projects/:id/bookings */
    setSent(true)
  }

  if (sent) {
    return (
      <div className={`${PANEL_CLASS} bg-brand-soft`}>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand shadow-sm">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-slate-900">Request received</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {project.agency} will contact you about {project.name} shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={PANEL_CLASS}>
      <h2 className="font-display text-xl font-bold text-slate-900">Book Now</h2>
      <span className="mt-3 block h-1 w-14 rounded-full bg-brand" aria-hidden="true" />
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        Share your details and {project.agency} will confirm booking steps for this project.
      </p>

      <div className="mt-5 rounded-2xl border border-brand/15 bg-brand-soft/60 px-4 py-3">
        <p className="text-[11px] font-bold tracking-wide text-brand uppercase">Booking amount</p>
        <p className="font-display text-2xl font-extrabold text-brand">
          {formatPKR(project.bookingAmount)}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
            Full name
          </span>
          <input required name="name" className={FIELD_CLASS} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Phone</span>
          <input
            required
            name="phone"
            type="tel"
            className={FIELD_CLASS}
            placeholder="+92 3XX XXXXXXX"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Email</span>
          <input
            required
            name="email"
            type="email"
            className={FIELD_CLASS}
            placeholder="you@email.com"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
            Message
          </span>
          <textarea
            name="message"
            rows={3}
            className={FIELD_CLASS}
            defaultValue={`I am interested in advance booking for ${project.name}.`}
          />
        </label>
        <label className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
          <input
            required
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/30"
          />
          I agree to be contacted by {project.agency} about this project.
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        Submit Booking Interest
      </button>
    </form>
  )
}

function AgencyContact({ project }) {
  const whatsapp = project.phone.replace(/\D/g, '')
  return (
    <div className={PANEL_CLASS}>
      <h2 className="font-display text-lg font-bold text-slate-900">Contact Agency</h2>
      <span className="mt-3 block h-1 w-14 rounded-full bg-brand" aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold text-slate-700">{project.agency}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{project.developer}</p>

      <div className="mt-5 grid gap-2">
        <a
          href={`tel:${project.phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-bold text-brand transition hover:bg-brand-soft"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Agency
        </a>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition hover:brightness-95"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}

function ProjectNotFound({ id }) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-offwhite px-4 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold text-slate-900">
        Project Unavailable
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        We could not find an advance booking project with the reference {id}.
      </p>
      <Link
        to="/advanced-booking"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Advance Booking
      </Link>
    </section>
  )
}

/**
 * Advance Booking project detail — `/advanced-booking/:id`.
 */
export default function AdvanceBookingDetail() {
  const { id } = useParams()
  const location = useLocation()
  const project = getProjectById(id)
  const related = getOtherProjects(id, 3)
  const backTo = location.state?.from || '/advanced-booking'

  if (!project) return <ProjectNotFound id={id} />

  return (
    <>
      <section className="relative bg-white pb-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-soft/80 to-transparent"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-brand transition hover:bg-brand-soft"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Advance Booking
            </Link>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-7 xl:col-span-8">
              <ProjectGallery project={project} />
              <ProjectSummary project={project} />
              <ProjectInformation project={project} />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-24">
                <BookingForm project={project} />
                <AgencyContact project={project} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-brand-soft py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Related Projects"
              description="Other advance booking opportunities from verified developers across Pakistan."
              action={
                <Link
                  to="/advanced-booking"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
                >
                  Browse all projects
                </Link>
              }
            />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BookingProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
