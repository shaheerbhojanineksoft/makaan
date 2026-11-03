import { Building2, CalendarClock, MapPin } from 'lucide-react'

import PropertyCard from './PropertyCard'
import PlotCard from './PlotCard'
import SectionHeading from './ui/SectionHeading'
import { featuredPlots } from '../data/plots'
import { freshProperties } from '../data/properties'
import { trendingProjects } from '../data/projects'
import { formatMonthYear, formatPKR } from '../utils/format'

function matchesPropertyType(property, selectedType) {
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
  if (filters.purpose === 'booking') {
    return {
      kind: 'projects',
      items: trendingProjects.filter(
        (project) =>
          project.city === filters.city &&
          project.projectType === filters.propertyType &&
          project.startingPrice <= filters.maxPrice,
      ),
    }
  }

  const properties = freshProperties.filter(
    (property) =>
      property.city === filters.city &&
      property.purpose === (filters.purpose === 'rent' ? 'rent' : 'sale') &&
      matchesPropertyType(property, filters.propertyType) &&
      property.price <= filters.maxPrice,
  )

  const plots =
    filters.purpose === 'buy' &&
    ['Residential Plot', 'Commercial Plot'].includes(filters.propertyType)
      ? featuredPlots.filter(
          (plot) =>
            plot.city === filters.city &&
            `${plot.plotType} Plot` === filters.propertyType &&
            plot.price <= filters.maxPrice,
        )
      : []

  return { kind: 'listings', properties, plots, items: [...properties, ...plots] }
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
          description={`${filters.city} · ${filters.propertyType} · Up to ${formatPKR(filters.maxPrice)}`}
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
