import { Link, useLocation, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarCheck,
  Check,
  Clock3,
  Compass,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
  Users,
} from 'lucide-react'

import FavoriteButton from '../components/FavoriteButton'
import { AGENCY_SERVICES, getAgentById } from '../data/agents'
import { getMergedProperties, useAgencyStore } from '../utils/agencyStore'
import { FAVORITE_KINDS } from '../utils/favorites'
import { formatPKR } from '../utils/format'

/**
 * Agent / agency profile screen — `/agents/:id`.
 *
 * Reached from the "View Profile" action in the home page property-expert
 * section. Standalone screen (Navbar is not rendered alongside it).
 * Interactive elements: the back icon overlaid on the cover photo, and the
 * WhatsApp contact action in Agency Details. No sticky header on this screen.
 */

function StatTile({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
      <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-2.5 font-display text-xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
    </div>
  )
}

function InfoSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-7">
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

function ChipList({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/15"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function DetailItem({ icon: Icon, label, value }) {
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

function AgencyDetails({ agent }) {
  const whatsappNumber = (agent.whatsapp || agent.phone || '').replace(/\D/g, '')
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Assalam o Alaikum, I found your profile on Pakistan Property Portal and would like to get in touch.`,
      )}`
    : null

  return (
    <InfoSection icon={ShieldCheck} title="Agency Details">
      <ul className="space-y-4">
        <DetailItem icon={Award} label="Licence Number" value={agent.licenseNumber} />
        <DetailItem icon={MapPin} label="Office Address" value={agent.officeAddress} />
        <DetailItem icon={Clock3} label="Typical Response" value={agent.responseTime} />
        <DetailItem icon={CalendarCheck} label="Member Since" value={String(agent.memberSince)} />
        <DetailItem icon={Languages} label="Languages" value={agent.languages.join(', ')} />
        <DetailItem icon={Phone} label="Phone" value={agent.phone} />
        <DetailItem icon={Mail} label="Email" value={agent.email} />
      </ul>

      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Chat with ${agent.name} on WhatsApp`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/25 transition hover:bg-[#1EBE57]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          WhatsApp
        </a>
      )}
    </InfoSection>
  )
}

function ListingCard({ listing }) {
  const isRent = listing.purpose === 'rent'

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
      <div className="relative aspect-16/10 overflow-hidden bg-brand-soft">
        <img
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute top-3 right-3 rounded-full bg-brand/90 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase">
          For {isRent ? 'Rent' : 'Sale'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-sm leading-snug font-bold text-slate-900">
          {listing.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          {listing.location}
        </p>
        <p className="mt-auto pt-3 font-display text-base font-extrabold text-brand">
          {formatPKR(listing.price)}
          {isRent && <span className="text-[11px] font-bold text-slate-400"> /month</span>}
        </p>
      </div>
    </article>
  )
}

function ProfileContent({ agent, backTo }) {
  useAgencyStore()
  const listings = getMergedProperties().filter(
    (property) =>
      property.agentId === agent.id ||
      property.agent?.name === agent.name ||
      property.agent?.agency === agent.agency,
  )
  const backIsAgents = backTo === '/agents'

  return (
    <>
      {/* Cover + identity */}
      <section className="relative isolate">
        <div className="relative h-72 w-full bg-brand sm:h-[26rem]">
          <div className="absolute inset-0 overflow-hidden">
            <img src={agent.coverImage} alt="" className="h-full w-full object-cover" />
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand via-brand/50 to-brand/10"
              aria-hidden="true"
            />
          </div>
          <Link
            to={backTo}
            aria-label={backIsAgents ? 'Back to all agents' : 'Back to home'}
            className="absolute top-4 left-4 z-20 grid h-10 w-10 place-items-center rounded-xl border border-white/30 bg-white/90 text-brand shadow-sm backdrop-blur-sm transition hover:bg-white sm:top-5 sm:left-5 lg:left-6 xl:left-8"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <FavoriteButton
            kind={FAVORITE_KINDS.agent}
            id={agent.id}
            size="lg"
            className="absolute top-4 right-4 z-20 sm:top-5 sm:right-5 lg:right-6 xl:right-8"
          />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 -mt-14 flex flex-col items-center gap-4 text-center sm:-mt-16 sm:flex-row sm:items-end sm:text-left">
            <img
              src={agent.avatar}
              alt={`${agent.name}, ${agent.agency}`}
              className="h-28 w-28 rounded-2xl border-4 border-white bg-brand-soft object-cover shadow-lg sm:h-32 sm:w-32"
            />

            <div className="pb-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {agent.name}
                </h1>
                {agent.verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-bold text-brand ring-1 ring-brand/15">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-brand">{agent.agency}</p>
              <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500 sm:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                  {agent.city}, Pakistan
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {agent.rating} rating · {agent.reviews} reviews
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key stats */}
      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        <StatTile icon={Briefcase} value={`${agent.experienceYears} yrs`} label="Experience" />
        <StatTile icon={Building2} value={agent.activeListings} label="Active Listings" />
        <StatTile icon={Users} value={agent.teamSize} label="Team Members" />
      </div>

      {/* Detail columns */}
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-6 lg:col-span-2">
          <InfoSection icon={Building2} title="About the Agency">
            <p className="text-sm leading-relaxed text-slate-600">{agent.bio}</p>
          </InfoSection>

          <InfoSection icon={Compass} title="Specializations">
            <ChipList items={agent.specializations} />
          </InfoSection>

          <InfoSection icon={ShieldCheck} title="Services Offered">
            <ul className="grid gap-3 sm:grid-cols-2">
              {(agent.services?.length ? agent.services : AGENCY_SERVICES).map((service) => (
                <li key={service} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </InfoSection>

          <InfoSection icon={MapPin} title="Areas Served">
            <ChipList items={agent.areasServed} />
          </InfoSection>

          {listings.length > 0 && (
            <InfoSection icon={Building2} title="Active Listings">
              <div className="grid gap-4 sm:grid-cols-2">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </InfoSection>
          )}
        </div>

        <aside className="space-y-6">
          <AgencyDetails agent={agent} />

          <div className="flex items-start gap-3 rounded-2xl border border-brand/15 bg-brand-soft p-5">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-xs leading-relaxed font-medium text-brand">
              Reach the agent on WhatsApp from Agency Details, or use the back arrow on the cover
              photo to go back.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}

function ProfileNotFound({ backTo }) {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <Link
        to={backTo}
        aria-label="Go back"
        className="absolute top-6 left-4 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-brand transition hover:bg-brand-soft sm:left-6 lg:left-8"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </Link>
      <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <UserRound className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-slate-900">
          Profile not available
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          We could not find an agent with that id. Use the back arrow to return.
        </p>
      </div>
    </section>
  )
}

export default function AgentProfile() {
  const { id } = useParams()
  const location = useLocation()
  const agent = getAgentById(id)
  const backTo = location.state?.from === '/agents' ? '/agents' : '/'

  return (
    <div className="bg-offwhite pb-4">
      {agent ? (
        <ProfileContent agent={agent} backTo={backTo} />
      ) : (
        <ProfileNotFound backTo={backTo} />
      )}
    </div>
  )
}
