import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  UserRound,
  X,
} from 'lucide-react'

import Badge from '../components/ui/Badge'
import { featuredAgents } from '../data/agents'

const INITIAL_FILTERS = {
  city: '',
  keyword: '',
}

const CITIES = [...new Set(featuredAgents.map((agent) => agent.city))].sort()

function matchesFilters(agent, filters) {
  if (filters.city && agent.city !== filters.city) return false

  const keyword = filters.keyword.trim().toLowerCase()
  if (!keyword) return true

  const haystack = [
    agent.name,
    agent.agency,
    agent.city,
    agent.officeAddress,
    ...(agent.specializations ?? []),
    ...(agent.areasServed ?? []),
    ...(agent.languages ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(keyword)
}

function FilterField({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      {children}
    </div>
  )
}

function SelectInput({ value, onChange, options, placeholder, icon: Icon }) {
  return (
    <label className="relative block">
      {Icon && (
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brand"
          aria-hidden="true"
        />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15 ${
          Icon ? 'pl-9' : 'pl-3'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

/**
 * Expert card for the `/agents` inventory. One stretched link opens
 * `/agents/:id` with `from: '/agents'` so the profile can return here.
 */
function AgentCard({ agent }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
      <Link
        to={`/agents/${agent.id}`}
        state={{ from: '/agents' }}
        aria-label={`View profile for ${agent.name}`}
        className="absolute inset-0 z-10 rounded-2xl"
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
      <p className="mt-3 text-[11px] font-semibold text-slate-400">
        {agent.experienceYears} yrs exp
      </p>

      <span className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand ring-1 ring-brand/15 transition group-hover:bg-brand group-hover:text-white">
        View Agent Detail
      </span>
    </article>
  )
}

function AgentFilters({ filters, onChange, onReset, resultCount, mobileOpen, onCloseMobile }) {
  const hasActiveFilters = filters.city !== '' || filters.keyword.trim() !== ''

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </span>
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-brand transition hover:bg-brand-soft"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          )}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close filters"
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <FilterField label="Search">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brand"
              aria-hidden="true"
            />
            <input
              type="search"
              value={filters.keyword}
              onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
              placeholder="Name, agency, area…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3 pl-9 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
            />
          </label>
        </FilterField>

        <FilterField label="City">
          <SelectInput
            icon={MapPin}
            value={filters.city}
            onChange={(city) => onChange({ ...filters, city })}
            options={CITIES}
            placeholder="All cities"
          />
        </FilterField>
      </div>

      <p className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        Showing <span className="font-bold text-brand">{resultCount}</span> of {featuredAgents.length}{' '}
        agents
      </p>
    </>
  )

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-200/80 bg-slate-50/80 px-5 py-8 lg:flex xl:w-80">
        <div className="w-full">{content}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Dismiss filters"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col overflow-y-auto bg-white p-5 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  )
}

/**
 * All verified property experts — `/agents`.
 *
 * Left filter rail (city + keyword) + card grid. Navbar / Footer are not
 * rendered around this route. Each card opens `/agents/:id`.
 */
export default function Agents() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(
    () => featuredAgents.filter((agent) => matchesFilters(agent, filters)),
    [filters],
  )

  return (
    <section className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <AgentFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(INITIAL_FILTERS)}
          resultCount={filtered.length}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />

        <div className="min-w-0 flex-1 px-4 py-6 sm:px-5 sm:py-8 lg:px-6 xl:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-brand transition hover:bg-brand-soft"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>

            <Badge variant="green" icon={UserRound} className="ml-auto">
              {filtered.length} Verified Agents
            </Badge>
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Explore Real Estate Partners
          </h1>
          <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" aria-hidden="true" />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            ⭐ Star-marked agencies are our featured partners, highlighted for your convenience.
          </p>

          <div className="mt-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900">No agents match</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Try another city, a different keyword, or clear the filters.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
