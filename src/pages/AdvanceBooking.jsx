import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import BookingProjectCard from '../components/BookingProjectCard'
import { bookingProjects } from '../data/projects'
import { formatPKR } from '../utils/format'

const PROJECT_TYPES = [
  { value: '', label: 'All' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Mixed Use', label: 'Mixed Use' },
]

const PAYMENT_PLANS = [
  { value: '', label: 'All' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Half-Yearly', label: 'Half-Yearly' },
  { value: 'Full Payment', label: 'Full Payment' },
]

const PROJECT_STATUSES = [
  { value: '', label: 'All' },
  { value: 'Pre-Launch', label: 'Pre-Launch' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Under Construction', label: 'Under Construction' },
]

const COMPLETION_YEARS = [
  { value: '', label: 'Any' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
  { value: '2029', label: '2029' },
  { value: '2030+', label: '2030+' },
]

const AMENITIES = ['Parking', 'Gym', 'Swimming Pool', 'Security']

const INITIAL_FILTERS = {
  keyword: '',
  city: '',
  area: '',
  projectType: '',
  minPrice: '',
  maxPrice: '',
  paymentPlan: '',
  projectStatus: '',
  expectedCompletion: '',
  amenities: [],
}

const CITIES = [...new Set(bookingProjects.map((p) => p.city))].sort()

function areasForCity(city) {
  const source = city
    ? bookingProjects.filter((p) => p.city === city)
    : bookingProjects
  return [...new Set(source.map((p) => p.area))].sort()
}

function parsePriceInput(value) {
  if (value === '' || value == null) return null
  const n = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

function matchesFilters(project, filters) {
  const keyword = filters.keyword.trim().toLowerCase()
  if (keyword) {
    const haystack = [project.name, project.developer, project.agency, project.location, project.area]
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (filters.city && project.city !== filters.city) return false
  if (filters.area && project.area !== filters.area) return false
  if (filters.projectType && project.projectType !== filters.projectType) return false
  if (filters.paymentPlan && project.paymentPlan !== filters.paymentPlan) return false
  if (filters.projectStatus && project.projectStatus !== filters.projectStatus) return false
  if (filters.expectedCompletion && project.expectedCompletion !== filters.expectedCompletion) {
    return false
  }

  const minPrice = parsePriceInput(filters.minPrice)
  const maxPrice = parsePriceInput(filters.maxPrice)
  if (minPrice != null && project.startingPrice < minPrice) return false
  if (maxPrice != null && project.startingPrice > maxPrice) return false

  if (filters.amenities.length > 0) {
    const hasAll = filters.amenities.every((amenity) => project.amenities.includes(amenity))
    if (!hasAll) return false
  }

  return true
}

function buildActiveChips(filters) {
  const chips = []
  if (filters.keyword.trim()) {
    chips.push({ key: 'keyword', label: `Search: ${filters.keyword.trim()}` })
  }
  if (filters.city) chips.push({ key: 'city', label: filters.city })
  if (filters.area) chips.push({ key: 'area', label: filters.area })
  if (filters.projectType) chips.push({ key: 'projectType', label: filters.projectType })
  if (filters.minPrice) chips.push({ key: 'minPrice', label: `Min ${formatPKR(filters.minPrice)}` })
  if (filters.maxPrice) chips.push({ key: 'maxPrice', label: `Max ${formatPKR(filters.maxPrice)}` })
  if (filters.paymentPlan) chips.push({ key: 'paymentPlan', label: filters.paymentPlan })
  if (filters.projectStatus) chips.push({ key: 'projectStatus', label: filters.projectStatus })
  if (filters.expectedCompletion) {
    chips.push({ key: 'expectedCompletion', label: filters.expectedCompletion })
  }
  filters.amenities.forEach((amenity) => {
    chips.push({ key: `amenity:${amenity}`, label: amenity })
  })
  return chips
}

function clearChip(filters, chipKey) {
  if (chipKey.startsWith('amenity:')) {
    const amenity = chipKey.slice('amenity:'.length)
    return { ...filters, amenities: filters.amenities.filter((item) => item !== amenity) }
  }
  if (chipKey === 'keyword') return { ...filters, keyword: '' }
  return { ...filters, [chipKey]: '' }
}

function FilterField({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      {children}
    </div>
  )
}

function ChipGroup({ options, value, onChange, name }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={name}>
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value || 'any'}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
              selected
                ? 'bg-brand text-white shadow-sm shadow-brand/20'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-brand/30 hover:bg-brand-soft hover:text-brand'
            }`}
          >
            {option.label}
          </button>
        )
      })}
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

function PriceInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min="0"
      step="1000"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
    />
  )
}

function BookingFilters({
  draft,
  onDraftChange,
  onApply,
  onClear,
  resultCount,
  mobileOpen,
  onCloseMobile,
}) {
  const areas = areasForCity(draft.city)

  const toggleAmenity = (amenity) => {
    const next = draft.amenities.includes(amenity)
      ? draft.amenities.filter((item) => item !== amenity)
      : [...draft.amenities, amenity]
    onDraftChange({ ...draft, amenities: next })
  }

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
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-brand transition hover:bg-brand-soft"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear All
          </button>
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
        <FilterField label="City">
          <SelectInput
            icon={MapPin}
            value={draft.city}
            onChange={(city) => onDraftChange({ ...draft, city, area: '' })}
            options={CITIES}
            placeholder="All cities"
          />
        </FilterField>

        <FilterField label="Area / Location">
          <SelectInput
            value={draft.area}
            onChange={(area) => onDraftChange({ ...draft, area })}
            options={areas}
            placeholder="All areas"
          />
        </FilterField>

        <FilterField label="Project Type">
          <ChipGroup
            name="Project Type"
            options={PROJECT_TYPES}
            value={draft.projectType}
            onChange={(projectType) => onDraftChange({ ...draft, projectType })}
          />
        </FilterField>

        <FilterField label="Budget Range (PKR)">
          <div className="grid grid-cols-2 gap-2">
            <PriceInput
              value={draft.minPrice}
              onChange={(minPrice) => onDraftChange({ ...draft, minPrice })}
              placeholder="Min"
            />
            <PriceInput
              value={draft.maxPrice}
              onChange={(maxPrice) => onDraftChange({ ...draft, maxPrice })}
              placeholder="Max"
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            e.g. {formatPKR(3_000_000)} – {formatPKR(25_000_000)}
          </p>
        </FilterField>

        <FilterField label="Payment Plan">
          <ChipGroup
            name="Payment Plan"
            options={PAYMENT_PLANS}
            value={draft.paymentPlan}
            onChange={(paymentPlan) => onDraftChange({ ...draft, paymentPlan })}
          />
        </FilterField>

        <FilterField label="Project Status">
          <ChipGroup
            name="Project Status"
            options={PROJECT_STATUSES}
            value={draft.projectStatus}
            onChange={(projectStatus) => onDraftChange({ ...draft, projectStatus })}
          />
        </FilterField>

        <FilterField label="Expected Completion">
          <ChipGroup
            name="Expected Completion"
            options={COMPLETION_YEARS}
            value={draft.expectedCompletion}
            onChange={(expectedCompletion) => onDraftChange({ ...draft, expectedCompletion })}
          />
        </FilterField>

        <FilterField label="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((amenity) => {
              const selected = draft.amenities.includes(amenity)
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                    selected
                      ? 'bg-brand text-white shadow-sm shadow-brand/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-brand/30 hover:bg-brand-soft hover:text-brand'
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  {amenity}
                </button>
              )
            })}
          </div>
        </FilterField>
      </div>

      <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onApply}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          Apply Filters
        </button>
        <p className="text-center text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-brand">{resultCount}</span> of{' '}
          {bookingProjects.length} projects
        </p>
      </div>
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
 * Advance Booking inventory — `/advanced-booking`.
 *
 * Filter rail + searchable project grid. Navbar / Footer are not rendered
 * around this route (same shell pattern as `/plots` and `/properties`).
 */
export default function AdvanceBooking() {
  const [draft, setDraft] = useState(INITIAL_FILTERS)
  const [applied, setApplied] = useState(INITIAL_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(
    () => bookingProjects.filter((project) => matchesFilters(project, applied)),
    [applied],
  )

  const chips = useMemo(() => buildActiveChips(applied), [applied])

  const applyFilters = () => {
    setApplied(draft)
    setMobileFiltersOpen(false)
  }

  const clearAll = () => {
    setDraft(INITIAL_FILTERS)
    setApplied(INITIAL_FILTERS)
  }

  const removeChip = (chipKey) => {
    const next = clearChip(applied, chipKey)
    setApplied(next)
    setDraft(next)
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <BookingFilters
          draft={draft}
          onDraftChange={setDraft}
          onApply={applyFilters}
          onClear={clearAll}
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
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Advance Booking
          </h1>
          <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" aria-hidden="true" />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Explore upcoming projects and secure your property before possession.
          </p>

          <label className="relative mt-6 block max-w-xl">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
              aria-hidden="true"
            />
            <input
              type="search"
              value={draft.keyword}
              onChange={(e) => setDraft({ ...draft, keyword: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applyFilters()
                }
              }}
              placeholder="Search project, building or developer…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-28 pl-10 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
            />
            <button
              type="button"
              onClick={applyFilters}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-dark"
            >
              Search
            </button>
          </label>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => removeChip(chip.key)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-bold text-brand ring-1 ring-brand/15 transition hover:bg-brand hover:text-white"
                >
                  {chip.label}
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] font-bold text-slate-500 underline-offset-2 hover:text-brand hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="mt-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((project) => (
                  <BookingProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
                  No projects match
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Try another city, widen the budget, or clear filters to see all advance booking
                  projects.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
