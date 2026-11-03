import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BedDouble,
  Building2,
  MapPin,
  Maximize,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import PropertyCard from '../components/PropertyCard'
import { freshProperties } from '../data/properties'
import { formatPKR } from '../utils/format'

const PURPOSE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'sale', label: 'Buy / Sale' },
  { value: 'rent', label: 'Rent' },
]

const SIZE_OPTIONS = [
  { value: '', label: 'Any size' },
  { value: 'Marla', label: 'Marla' },
  { value: 'Kanal', label: 'Kanal' },
  { value: 'Sq. Yd', label: 'Sq. Yards' },
  { value: 'Sq. Ft', label: 'Sq. Feet' },
]

const BEDS_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
]

const INITIAL_FILTERS = {
  purpose: 'all',
  city: '',
  propertyType: '',
  minPrice: '',
  maxPrice: '',
  sizeUnit: '',
  beds: '',
}

const CITIES = [...new Set(freshProperties.map((p) => p.city))].sort()
const PROPERTY_TYPES = [...new Set(freshProperties.map((p) => p.propertyType))].sort()

function parsePriceInput(value) {
  if (value === '' || value == null) return null
  const n = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

function matchesFilters(property, filters) {
  if (filters.purpose !== 'all' && property.purpose !== filters.purpose) return false
  if (filters.city && property.city !== filters.city) return false
  if (filters.propertyType && property.propertyType !== filters.propertyType) return false

  const minPrice = parsePriceInput(filters.minPrice)
  const maxPrice = parsePriceInput(filters.maxPrice)
  if (minPrice != null && property.price < minPrice) return false
  if (maxPrice != null && property.price > maxPrice) return false

  if (filters.sizeUnit && !property.area.toLowerCase().includes(filters.sizeUnit.toLowerCase())) {
    return false
  }

  const minBeds = parsePriceInput(filters.beds)
  if (minBeds != null && property.beds < minBeds) return false

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

function PropertyFilters({ filters, onChange, onReset, resultCount, mobileOpen, onCloseMobile }) {
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'purpose') return value !== 'all'
    return value !== ''
  })

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
        <FilterField label="Purpose">
          <ChipGroup
            name="Purpose"
            options={PURPOSE_OPTIONS}
            value={filters.purpose}
            onChange={(purpose) => onChange({ ...filters, purpose })}
          />
        </FilterField>

        <FilterField label="City / Area">
          <SelectInput
            icon={MapPin}
            value={filters.city}
            onChange={(city) => onChange({ ...filters, city })}
            options={CITIES}
            placeholder="All cities"
          />
        </FilterField>

        <FilterField label="Property Type">
          <SelectInput
            icon={Building2}
            value={filters.propertyType}
            onChange={(propertyType) => onChange({ ...filters, propertyType })}
            options={PROPERTY_TYPES}
            placeholder="All types"
          />
        </FilterField>

        <FilterField label="Price Range (PKR)">
          <div className="grid grid-cols-2 gap-2">
            <PriceInput
              value={filters.minPrice}
              onChange={(minPrice) => onChange({ ...filters, minPrice })}
              placeholder="Min"
            />
            <PriceInput
              value={filters.maxPrice}
              onChange={(maxPrice) => onChange({ ...filters, maxPrice })}
              placeholder="Max"
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            Tip: sale listings use full price; rent is monthly. e.g. {formatPKR(5_000_000)} or{' '}
            {formatPKR(150_000)}.
          </p>
        </FilterField>

        <FilterField label="Size unit">
          <ChipGroup
            name="Size unit"
            options={SIZE_OPTIONS}
            value={filters.sizeUnit}
            onChange={(sizeUnit) => onChange({ ...filters, sizeUnit })}
          />
        </FilterField>

        <FilterField label="Bedrooms">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <BedDouble className="h-4 w-4" aria-hidden="true" />
            </span>
            <ChipGroup
              name="Bedrooms"
              options={BEDS_OPTIONS}
              value={filters.beds}
              onChange={(beds) => onChange({ ...filters, beds })}
            />
          </div>
        </FilterField>
      </div>

      <p className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        Showing <span className="font-bold text-brand">{resultCount}</span> of{' '}
        {freshProperties.length} properties
      </p>
    </>
  )

  return (
    <>
      {/* Desktop — flush left rail; filter block vertically centered */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col justify-center overflow-y-auto border-r border-slate-200/80 bg-slate-50/80 px-5 lg:flex xl:w-80">
        <div className="my-auto w-full py-8">{content}</div>
      </aside>

      {/* Mobile drawer */}
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
 * All freshly added properties — `/properties`.
 *
 * Filters sit in a full-height left rail on desktop; listings fill the rest.
 */
export default function Properties() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(
    () => freshProperties.filter((property) => matchesFilters(property, filters)),
    [filters],
  )

  return (
    <section className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <PropertyFilters
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
          </div>

          <div className="mt-6 origin-top [zoom:0.9] sm:[zoom:0.92]">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Maximize className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
                  No properties match
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Try widening the price range, changing the city, or clearing filters.
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
