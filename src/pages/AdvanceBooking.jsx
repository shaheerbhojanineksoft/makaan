import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import BookingProjectCard from '../components/BookingProjectCard'
import { getBookingProjects } from '../data/projects'

const INITIAL_FILTERS = {
  city: '',
  area: '',
}

function citiesFrom(projects) {
  return [...new Set(projects.map((project) => project.city).filter(Boolean))].sort()
}

function areasForCity(city, projects) {
  const source = city ? projects.filter((project) => project.city === city) : projects
  return [...new Set(source.map((project) => project.area).filter(Boolean))].sort()
}

function matchesFilters(project, filters) {
  if (filters.city && project.city !== filters.city) return false
  if (filters.area && project.area !== filters.area) return false
  return true
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
      {Icon ? (
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-brand"
          aria-hidden="true"
        />
      ) : null}
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

function BookingFilters({
  filters,
  onChange,
  onReset,
  resultCount,
  inventoryCount,
  cities,
  areas,
  mobileOpen,
  onCloseMobile,
}) {
  const hasActiveFilters = Boolean(filters.city || filters.area)

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
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-brand transition hover:bg-brand-soft"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          ) : null}
          {onCloseMobile ? (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close filters"
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <FilterField label="City">
          <SelectInput
            icon={MapPin}
            value={filters.city}
            onChange={(city) => onChange({ ...filters, city, area: '' })}
            options={cities}
            placeholder="All cities"
          />
        </FilterField>

        <FilterField label="Area / Society">
          <SelectInput
            value={filters.area}
            onChange={(area) => onChange({ ...filters, area })}
            options={areas}
            placeholder="All areas"
          />
        </FilterField>
      </div>

      <p className="mt-8 text-xs font-semibold text-slate-500">
        Showing <span className="font-extrabold text-slate-800">{resultCount}</span> of{' '}
        {inventoryCount} projects
      </p>
    </>
  )

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-slate-50/80 p-5 lg:block xl:w-80">
        <div className="sticky top-24">{content}</div>
      </aside>

      {mobileOpen ? (
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
      ) : null}
    </>
  )
}

export default function AdvanceBooking() {
  const catalog = useMemo(() => getBookingProjects(), [])
  const cities = useMemo(() => citiesFrom(catalog), [catalog])
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(
    () => catalog.filter((project) => matchesFilters(project, filters)),
    [catalog, filters],
  )
  const areas = useMemo(() => areasForCity(filters.city, catalog), [catalog, filters.city])

  return (
    <section className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <BookingFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(INITIAL_FILTERS)}
          resultCount={filtered.length}
          inventoryCount={catalog.length}
          cities={cities}
          areas={areas}
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
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Advanced Booking
          </h1>
          <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" aria-hidden="true" />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Browse buildings and projects with price ranges, payment facilities, unit counts and
            builder details.
          </p>

          {filtered.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => (
                <BookingProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <p className="font-semibold text-slate-700">No projects match these filters</p>
              <p className="mt-1 text-sm text-slate-500">Try another city or area.</p>
              <button
                type="button"
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
