import { Building2, CalendarClock, MapPin, Sparkles } from 'lucide-react'

import PropertyCard from './PropertyCard'
import PlotCard from './PlotCard'
import FavoriteButton from './FavoriteButton'
import SectionHeading from './ui/SectionHeading'
import { FAVORITE_KINDS } from '../utils/favorites'
import { trendingProjects } from '../data/projects'
import { getMergedPlots, getMergedProperties } from '../utils/agencyStore'
import { formatMonthYear, formatPKR } from '../utils/format'

function matchesPropertyType(property, selectedType) {
  if (!selectedType) return true
  if (selectedType === 'Flat / Apartment') {
    return property.propertyType === 'Apartment' || property.propertyType === 'Flat'
  }
  if (selectedType === 'House') {
    return property.propertyType === 'House' || property.propertyType === 'Villa'
  }
  if (selectedType === 'Office') return property.propertyType.includes('Office')
  if (selectedType === 'Shop') return property.propertyType.includes('Shop')
  return property.propertyType === selectedType
}

function matchesKeyword(haystackParts, keyword) {
  if (!keyword) return true
  const needle = keyword.trim().toLowerCase()
  if (!needle) return true
  return haystackParts.filter(Boolean).join(' ').toLowerCase().includes(needle)
}

function ProjectResultCard({ project }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card transition hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
      <div className="relative aspect-16/10 overflow-hidden bg-brand-soft">
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-brand">
          {project.status}
        </span>
        <FavoriteButton
          kind={FAVORITE_KINDS.project}
          id={project.id}
          size="sm"
          className="absolute top-3 right-3"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-bold text-brand">{project.projectType}</p>
        <h3 className="mt-2 font-display text-base font-bold text-slate-900">{project.name}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          {project.location}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <CalendarClock className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          Expected completion: {formatMonthYear(project.completion)}
        </p>
        <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
          <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">Starting From</p>
          <p className="mt-1 font-display text-lg font-extrabold text-brand">
            {formatPKR(project.startingPrice)}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {project.bookingProgress}% units booked
          </p>
        </div>
      </div>
    </article>
  )
}

function getMatches(filters) {
  const city = filters.city || ''
  const area = filters.area || ''
  const propertyType = filters.propertyType || ''
  const maxPrice = filters.maxPrice
  const keyword = filters.keyword || ''
  const beds = filters.beds ?? null

  if (filters.purpose === 'booking') {
    return {
      kind: 'projects',
      items: trendingProjects.filter((project) => {
        if (city && project.city !== city) return false
        if (area && project.location !== area) return false
        if (propertyType && project.projectType !== propertyType) return false
        if (maxPrice != null && project.startingPrice > maxPrice) return false
        if (
          !matchesKeyword(
            [project.name, project.location, project.city, project.projectType],
            keyword,
          )
        ) {
          return false
        }
        return true
      }),
    }
  }

  const purpose = filters.purpose === 'rent' ? 'rent' : 'sale'

  const properties = getMergedProperties().filter((property) => {
    if (city && property.city !== city) return false
    if (area && property.location !== area) return false
    if (property.purpose !== purpose) return false
    if (!matchesPropertyType(property, propertyType)) return false
    if (maxPrice != null && property.price > maxPrice) return false
    if (beds != null && property.beds < beds) return false
    if (
      !matchesKeyword(
        [property.title, property.location, property.city, property.propertyType],
        keyword,
      )
    ) {
      return false
    }
    return true
  })

  const wantsPlots =
    filters.purpose === 'buy' &&
    (!propertyType ||
      propertyType === 'Residential Plot' ||
      propertyType === 'Commercial Plot')

  const plots = wantsPlots
    ? getMergedPlots().filter((plot) => {
        if (city && plot.city !== city) return false
        if (area && plot.location !== area) return false
        if (propertyType && `${plot.plotType} Plot` !== propertyType) return false
        if (maxPrice != null && plot.price > maxPrice) return false
        if (!matchesKeyword([plot.title, plot.location, plot.city, plot.plotType], keyword)) {
          return false
        }
        return true
      })
    : []

  return { kind: 'listings', properties, plots, items: [...properties, ...plots] }
}

function buildFilterSummary(filters) {
  const parts = []
  if (filters.city) parts.push(filters.city)
  if (filters.area) parts.push(filters.area)
  if (filters.propertyType) parts.push(filters.propertyType)
  if (filters.beds) parts.push(`${filters.beds}+ beds`)
  if (filters.keyword) parts.push(`“${filters.keyword}”`)
  if (filters.maxPrice != null) parts.push(`Up to ${formatPKR(filters.maxPrice)}`)
  return parts.length > 0 ? parts.join(' · ') : 'All matching listings'
}

function InterpretedChips({ filters }) {
  if (filters.source !== 'ask') return null

  const chips = [
    { label: 'Purpose', value: filters.purpose },
    filters.city && { label: 'City', value: filters.city },
    filters.propertyType && { label: 'Type', value: filters.propertyType },
    filters.beds && { label: 'Beds', value: `${filters.beds}+` },
    filters.keyword && { label: 'Area', value: filters.keyword },
    filters.maxPrice != null && { label: 'Budget', value: formatPKR(filters.maxPrice) },
  ].filter(Boolean)

  return (
    <div className="mt-6 rounded-2xl border border-brand/15 bg-brand-soft/40 px-4 py-4 sm:px-5">
      <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-brand uppercase">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Ask Makan understood
      </p>
      {filters.query && (
        <p className="mt-2 text-sm font-medium text-slate-600">
          “{filters.query}”
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={`${chip.label}-${chip.value}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            <span className="text-slate-400">{chip.label}</span>
            <span className="text-brand">{chip.value}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HomeSearchResults({ filters, onClear }) {
  const matches = getMatches(filters)
  const isBooking = matches.kind === 'projects'

  return (
    <section id="home-search-results" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Search Results"
          title={`${matches.items.length} Matching ${isBooking ? 'Projects' : 'Listings'} Found`}
          description={buildFilterSummary(filters)}
          action={
            matches.items.length === 0 && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
              >
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Show Home Sections
              </button>
            )
          }
        />

        <InterpretedChips filters={filters} />

        {matches.items.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isBooking
              ? matches.items.map((project) => (
                  <ProjectResultCard key={project.id} project={project} />
                ))
              : [
                  ...matches.properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  )),
                  ...matches.plots.map((plot) => <PlotCard key={plot.id} plot={plot} />),
                ]}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm font-medium text-slate-600">
            No matching {isBooking ? 'projects' : 'listings'} found. Try a different city,
            property type or budget.
          </p>
        )}
      </div>
    </section>
  )
}
