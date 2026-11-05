import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin, Star } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import FavoriteButton from './FavoriteButton'
import { getMergedAgents, useAgencyStore } from '../utils/agencyStore'
import { FAVORITE_KINDS } from '../utils/favorites'

/**
 * Expert card for the home page "Meet Our Trusted Property Experts" section.
 *
 * One stretched link covers the whole card so tapping anywhere opens
 * `/agents/:id`. The CTA label makes the profile action obvious.
 */
function AgentCard({ agent }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
      <Link
        to={`/agents/${agent.id}`}
        aria-label={`View profile for ${agent.name}`}
        className="absolute inset-0 z-10 rounded-2xl"
      />

      <FavoriteButton
        kind={FAVORITE_KINDS.agent}
        id={agent.id}
        size="sm"
        className="absolute top-3 left-3"
      />

      {agent.starPartner && (
        <span
          className="absolute top-3 right-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-amber-50 text-amber-500 ring-1 ring-amber-200/80"
          title="Featured partner"
        >
          <Star className="h-4 w-4 fill-current" aria-hidden="true" />
          <span className="sr-only">Featured partner</span>
        </span>
      )}

      <div className="relative mx-auto mt-2">
        <img
          src={agent.avatar}
          alt={`${agent.name}, ${agent.agency}`}
          loading="lazy"
          className="h-20 w-20 rounded-full bg-brand-soft object-cover ring-4 ring-brand-soft transition group-hover:ring-brand/15"
        />
        {agent.verified && (
          <span className="absolute -right-1 -bottom-1 grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm">
            <BadgeCheck className="h-5 w-5 text-brand" aria-hidden="true" />
            <span className="sr-only">Verified agent</span>
          </span>
        )}
      </div>

      <h3 className="mt-4 whitespace-nowrap font-display text-base font-bold text-slate-900 transition group-hover:text-brand">
        {agent.name}
        <span className="font-sans text-[11px] font-semibold text-slate-400">
          {' '}
          | {agent.activeListings} listings
        </span>
      </h3>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{agent.agency}</p>
      <p className="mt-1.5 flex items-center justify-center gap-1 text-[11px] font-medium text-slate-400">
        <MapPin className="h-3 w-3" aria-hidden="true" />
        {agent.city}
      </p>

      <span className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand ring-1 ring-brand/15 transition group-hover:bg-brand group-hover:text-white">
        View Agent Detail
      </span>
    </article>
  )
}

export default function FeaturedAgents() {
  useAgencyStore()
  const agents = getMergedAgents().slice(0, 8)

  return (
    <section id="featured-agents" className="bg-offwhite py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Meet Our Trusted Property Experts"
          description="Every expert below is licence-verified and rated by real buyers across Pakistan."
          action={
            <Link
              to="/agents"
              className="inline-flex items-center rounded-xl border border-brand/20 bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand-soft"
            >
              Browse all agents
            </Link>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </section>
  )
}
