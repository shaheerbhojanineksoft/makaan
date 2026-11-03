import { useState } from 'react'
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react'

import SectionHeading from '../components/ui/SectionHeading'
import Badge from '../components/ui/Badge'
import { CONTACT } from '../data/siteConfig'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80'

const CONTACT_REASONS = ['Buying', 'Renting', 'Selling', 'General Inquiry']

const WHATSAPP_LINK = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  'Hello! I would like to know more about a property on Pakistan Property Portal.',
)}`

const CALL_LINK = `tel:${CONTACT.phone.replace(/\s/g, '')}`

const INFO_CARDS = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT.phone,
    href: CALL_LINK,
  },
  {
    icon: MapPin,
    label: 'Office Location',
    value: `${CONTACT.addressLine1}, ${CONTACT.addressLine2}`,
    href: CONTACT.mapDirectionsUrl,
    external: true,
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: `${CONTACT.hoursDays} · ${CONTACT.hoursTime}`,
  },
]

/** Shared input styling — rounded corners with a subtle green focus ring. */
const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none'

const INFO_CARD_CLASS =
  'flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5'

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

/** Info row used by the "Get in Touch" column — renders as a link when actionable. */
function InfoCard({ icon: Icon, label, value, href, external }) {
  const body = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/10">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-bold tracking-wide text-slate-400 uppercase">
          {label}
        </span>
        <span className="mt-0.5 block text-sm font-semibold break-words text-slate-800">
          {value}
        </span>
      </span>
    </>
  )

  if (!href) {
    return <li className={INFO_CARD_CLASS}>{body}</li>
  }

  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
        className={INFO_CARD_CLASS}
      >
        {body}
      </a>
    </li>
  )
}

/**
 * Left column — the enquiry form.
 *
 * Self-contained: validates with native form constraints, hands the payload to
 * `onSubmit` and shows an inline confirmation. Swap the TODO for a real
 * `POST /api/contact` call once the backend is live.
 */
function ContactForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const payload = Object.fromEntries(new FormData(event.currentTarget))

    /* TODO: POST /api/contact */
    // eslint-disable-next-line no-console
    console.info('[Contact] message submitted:', payload)

    event.currentTarget.reset()
    setSent(true)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8"
    >
      <h2 className="font-display text-2xl font-extrabold text-slate-900">Send Us a Message</h2>
      <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" aria-hidden="true" />
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Tell us what you need and the right consultant will get back to you within 24 hours.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="contact-name">
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Ahmed Raza"
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Email Address" htmlFor="contact-email">
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Phone Number" htmlFor="contact-phone" hint="Optional">
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            pattern="[0-9+\(\)\s\-]{7,20}"
            title="Enter a valid phone number, e.g. +92 300 0000000"
            placeholder="+92 300 0000000"
            className={FIELD_CLASS}
          />
        </Field>

        <Field label="Reason for Contact" htmlFor="contact-reason">
          <span className="relative block">
            <select
              id="contact-reason"
              name="reason"
              required
              defaultValue=""
              className={`${FIELD_CLASS} appearance-none pr-10`}
            >
              <option value="" disabled>
                Select a reason
              </option>
              {CONTACT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </span>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Message" htmlFor="contact-message">
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              placeholder="Share the property type, city and budget you have in mind — or ask us anything."
              className={`${FIELD_CLASS} resize-y`}
            />
          </Field>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Send Message
        </button>

        <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <BadgeCheck className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          Your details stay private and are never shared.
        </p>
      </div>

      {sent && (
        <p
          role="status"
          className="mt-6 flex items-start gap-2.5 rounded-xl bg-brand-soft px-4 py-3 text-xs font-semibold text-brand ring-1 ring-brand/15"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Thanks — your message is on its way. Our team will get back to you within 24 hours.
        </p>
      )}
    </form>
  )
}

/** Right column — direct support channels. */
function ContactDetails() {
  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-slate-900">Get in Touch</h2>
      <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" aria-hidden="true" />
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Prefer to reach us directly? Pick whichever channel suits you — our team is available
        throughout the working week.
      </p>

      <ul className="mt-7 space-y-3">
        {INFO_CARDS.map((card) => (
          <InfoCard key={card.label} {...card} />
        ))}
      </ul>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:-translate-y-0.5 hover:bg-[#1EBE57] hover:shadow-xl"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Chat on WhatsApp
      </a>
    </div>
  )
}

/**
 * Contact Us — support channels for the portal.
 *
 *  1. We're Here to Help  — gateway hero, support promise + visual
 *  2. Send Us a Message   — enquiry form beside direct contact channels
 *  3. Visit Us            — Karachi head office and an embedded map
 */
export default function ContactUs() {
  return (
    <>
      {/* -------------------------------------------- 1. We're Here to Help */}
      <section id="how-we-help" className="relative isolate overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute -top-32 -left-24 -z-10 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-brand-light/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <Badge variant="green" icon={Sparkles}>
              Contact Us
            </Badge>

            <h1 className="mt-6 font-display text-4xl leading-[1.08] font-extrabold text-balance text-slate-900 sm:text-5xl">
              We&rsquo;re Here to Help
            </h1>
            <span className="mt-5 block h-1.5 w-24 rounded-full bg-brand" aria-hidden="true" />

            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              Have a question, need help with a listing, or want to get in touch with our team in
              Pakistan? We&rsquo;d love to hear from you.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Send Us a Message
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-white px-6 py-3.5 text-sm font-bold text-brand transition hover:bg-brand-soft"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-600">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                Replies within 24 hours
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                Head office in Karachi
              </li>
            </ul>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -top-6 -right-6 hidden h-full w-full rounded-[2rem] border-2 border-brand/15 sm:block"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[2rem] shadow-glass ring-1 ring-slate-900/10">
              <img
                src={HERO_IMAGE}
                alt="Property consultants meeting a client at the Pakistan Property Portal office"
                className="aspect-4/5 w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand/50 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>

            <div className="absolute -top-4 left-4 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[11px] font-bold text-brand shadow-lg ring-1 ring-brand/10 backdrop-blur sm:left-6">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              We reply within 24 hours
            </div>

            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur sm:-left-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm leading-none font-extrabold text-brand">
                  {CONTACT.hoursDays}
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  {CONTACT.hoursTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------- 2. Form + contact information */}
      <section id="contact" className="scroll-mt-20 bg-offwhite py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            <div className="lg:col-span-5">
              <ContactDetails />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- 3. Visit Us */}
      <section id="visit-us" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Office"
            title="Visit Us"
            description="Drop by for a face-to-face consultation, document review or a walkthrough of the projects we represent across Pakistan."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Address */}
            <div className="lg:col-span-1">
              <div className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-offwhite p-6 shadow-card sm:p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand ring-1 ring-brand/10">
                  <Building2 className="h-6 w-6" aria-hidden="true" />
                </span>

                <h3 className="mt-5 font-display text-lg font-bold text-slate-900">
                  {CONTACT.officeName}
                </h3>

                <address className="mt-3 text-sm leading-relaxed not-italic text-slate-600">
                  {CONTACT.addressLine1}
                  <br />
                  {CONTACT.addressLine2}
                </address>

                <ul className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
                  <li className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    <span className="font-semibold text-slate-800">
                      {CONTACT.hoursDays} · {CONTACT.hoursTime}
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    <a href={CALL_LINK} className="font-semibold text-slate-800 hover:text-brand">
                      {CONTACT.phone}
                    </a>
                  </li>
                </ul>

                <div className="mt-6 sm:mt-auto sm:pt-6">
                  <a
                    href={CONTACT.mapDirectionsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand/20 bg-white px-5 py-3 text-sm font-bold text-brand transition hover:bg-brand-soft"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-3xl border border-brand/15 bg-brand-dark shadow-card">
                <div className="flex items-center gap-2.5 px-5 py-4">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-soft" aria-hidden="true" />
                  <p className="text-xs font-bold tracking-wide text-brand-soft uppercase">
                    {CONTACT.addressLine1}, {CONTACT.addressLine2}
                  </p>
                </div>

                <iframe
                  src={CONTACT.mapEmbedUrl}
                  title={`Map showing ${CONTACT.officeName} in ${CONTACT.addressLine1}, ${CONTACT.addressLine2}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-[320px] w-full sm:h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
