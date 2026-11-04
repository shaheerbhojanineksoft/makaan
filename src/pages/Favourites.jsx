import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Heart, Home, UserRound } from 'lucide-react'

import PropertyCard from '../components/PropertyCard'
import PlotCard from '../components/PlotCard'
import BookingProjectCard from '../components/BookingProjectCard'
import FavoriteButton from '../components/FavoriteButton'
import SectionHeading from '../components/ui/SectionHeading'
import { getAgentById } from '../data/agents'
import { getPlotById } from '../data/plots'
import { getProjectById } from '../data/projects'
import { getPropertyById } from '../data/properties'
import {
  FAVORITE_KINDS,
  useFavorites,
} from '../utils/favorites'

const TABS = [
  { id: 'listings', label: 'Saved Listings', icon: Home },
  { id: 'agencies', label: 'Saved Agencies', icon: UserRound },
]

function resolveListing(entry) {
  if (entry.kind === FAVORITE_KINDS.property) {
    const property = getPropertyById(entry.id)
    return property ? { ...entry, property } : null
  }
  if (entry.kind === FAVORITE_KINDS.plot) {
    const plot = getPlotById(entry.id)
    return plot ? { ...entry, plot } : null
  }
  if (entry.kind === FAVORITE_KINDS.project) {
    const project = getProjectById(entry.id)
    return project ? { ...entry, project } : null
  }
  return null
}

function AgencyFavoriteCard({ agent }) {
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
        className="absolute top-3 right-3"
      />
      <img
        src={agent.avatar}
        alt={`${agent.name}, ${agent.agency}`}
        loading="lazy"
        className="mx-auto h-20 w-20 rounded-full bg-brand-soft object-cover ring-4 ring-brand-soft"
      />
      <h3 className="mt-4 font-display text-base font-bold text-slate-900 transition group-hover:text-brand">
        {agent.name}
      </h3>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{agent.agency}</p>
      <p className="mt-1.5 text-[11px] font-medium text-slate-400">{agent.city}</p>
      <span className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand ring-1 ring-brand/15 transition group-hover:bg-brand group-hover:text-white">
        View Agency
      </span>
    </article>
  )
}

function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
        <Heart className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-lg font-bold text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      <Link
        to={actionTo}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
      >
        <Building2 className="h-4 w-4" aria-hidden="true" />
        {actionLabel}
      </Link>
    </div>
  )
}

export default function Favourites() {
  const favorites = useFavorites()
  const [tab, setTab] = useState('listings')

  const listings = useMemo(
    () =>
      favorites
        .filter((item) => item.kind !== FAVORITE_KINDS.agent)
        .map(resolveListing)
        .filter(Boolean),
    [favorites],
  )

  const agencies = useMemo(
    () =>
      favorites
        .filter((item) => item.kind === FAVORITE_KINDS.agent)
        .map((item) => {
          const agent = getAgentById(item.id)
          return agent ? { ...item, agent } : null
        })
        .filter(Boolean),
    [favorites],
  )

  return (
    <section className="bg-offwhite py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Your saves"
          title="Favourites"
          description="Listings and agencies you hearted — open any card to continue, or tap the heart again to remove."
        />

        <div
          role="tablist"
          aria-label="Favourite type"
          className="mt-8 flex w-full gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200/80 sm:w-fit"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = tab === id
            const count = id === 'listings' ? listings.length : agencies.length
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition sm:flex-none ${
                  isActive
                    ? 'bg-brand text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {tab === 'listings' ? (
          listings.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((item) => {
                if (item.property) {
                  return <PropertyCard key={`property-${item.id}`} property={item.property} />
                }
                if (item.plot) {
                  return <PlotCard key={`plot-${item.id}`} plot={item.plot} />
                }
                return <BookingProjectCard key={`project-${item.id}`} project={item.project} />
              })}
            </div>
          ) : (
            <EmptyState
              title="No saved listings yet"
              description="Tap the heart on any property, plot or booking project to keep it here."
              actionLabel="Browse properties"
              actionTo="/properties"
            />
          )
        ) : agencies.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agencies.map((item) => (
              <AgencyFavoriteCard key={item.id} agent={item.agent} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No saved agencies yet"
            description="Heart an agency on their card or profile to shortlist trusted experts."
            actionLabel="Browse agencies"
            actionTo="/agents"
          />
        )}
      </div>
    </section>
  )
}
