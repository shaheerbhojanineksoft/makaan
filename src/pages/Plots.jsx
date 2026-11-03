import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Maximize,
  RotateCcw,
  Search,
  SlidersHorizontal,
  SquareStack,
  X,
} from 'lucide-react'

import PlotCard from '../components/PlotCard'
import { featuredPlots } from '../data/plots'
import { formatPKR } from '../utils/format'

const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Farmhouse', label: 'Farmhouse' },
]

const SIZE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'Marla', label: 'Marla' },
  { value: 'Kanal', label: 'Kanal' },
  { value: 'Sq. Yd', label: 'Sq. Yards' },
]

const POSSESSION_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'ready', label: 'Possession Ready' },
  { value: 'balloted', label: 'Balloted / File' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

const FEATURE_TAGS = [...new Set(featuredPlots.flatMap((plot) => plot.tags ?? []))].sort()

const INITIAL_FILTERS = {
  keyword: '',
  plotType: 'all',
  city: '',
  area: '',
  minPrice: '',
  maxPrice: '',
  sizeUnit: '',
  possession: '',
  features: [],
  sort: 'newest',
}

const CITIES = [...new Set(featuredPlots.map((p) => p.city))].sort()

function areasForCity(city) {
  const source = city ? featuredPlots.filter((p) => p.city === city) : featuredPlots
  return [...new Set(source.map((p) => p.location))].sort()
}

function parsePriceInput(value) {
  if (value === '' || value == null) return null
  const n = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

function matchesPossession(plot, possession) {
  if (!possession) return true
  const value = (plot.possession ?? '').toLowerCase()
  if (possession === 'ready') return value.includes('possession granted') || value.includes('ready')
  if (possession === 'balloted') return value.includes('ballot') || value.includes('file')
  return true
}

function matchesFilters(plot, filters) {
  const keyword = filters.keyword.trim().toLowerCase()
  if (keyword) {
    const haystack = [plot.title, plot.location, plot.city, plot.block, plot.plotNumber, ...(plot.tags ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(keyword)) return false
  }

  if (filters.plotType !== 'all' && plot.plotType !== filters.plotType) return false
  if (filters.city && plot.city !== filters.city) return false
  if (filters.area && plot.location !== filters.area) return false

  const minPrice = parsePriceInput(filters.minPrice)
  const maxPrice = parsePriceInput(filters.maxPrice)
  if (minPrice != null && plot.price < minPrice) return false
  if (maxPrice != null && plot.price > maxPrice) return false

  if (filters.sizeUnit && !plot.size.toLowerCase().includes(filters.sizeUnit.toLowerCase())) {
    return false
  }

  if (!matchesPossession(plot, filters.possession)) return false

  if (filters.features.length > 0) {
    const tags = plot.tags ?? []
    if (!filters.features.every((feature) => tags.includes(feature))) return false
  }

  return true
}

function sortPlots(plots, sort) {
  const next = [...plots]
  if (sort === 'price-asc') next.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') next.sort((a, b) => b.price - a.price)
  else next.sort((a, b) => new Date(b.listedOn) - new Date(a.listedOn))
  return next
}

function buildActiveChips(filters) {
  const chips = []
  if (filters.keyword.trim()) chips.push({ key: 'keyword', label: `Search: ${filters.keyword.trim()}` })
  if (filters.plotType !== 'all') chips.push({ key: 'plotType', label: filters.plotType })
  if (filters.city) chips.push({ key: 'city', label: filters.city })
  if (filters.area) chips.push({ key: 'area', label: filters.area })
  if (filters.minPrice) chips.push({ key: 'minPrice', label: `Min ${formatPKR(filters.minPrice)}` })
  if (filters.maxPrice) chips.push({ key: 'maxPrice', label: `Max ${formatPKR(filters.maxPrice)}` })
  if (filters.sizeUnit) chips.push({ key: 'sizeUnit', label: filters.sizeUnit })
  if (filters.possession) {
    const label = POSSESSION_OPTIONS.find((o) => o.value === filters.possession)?.label
    chips.push({ key: 'possession', label })
  }
  filters.features.forEach((feature) => {
    chips.push({ key: `feature:${feature}`, label: feature })
  })
  return chips
}

function clearChip(filters, chipKey) {
  if (chipKey.startsWith('feature:')) {
    const feature = chipKey.slice('feature:'.length)
    return { ...filters, features: filters.features.filter((item) => item !== feature) }
  }
  if (chipKey === 'keyword') return { ...filters, keyword: '' }
  if (chipKey === 'plotType') return { ...filters, plotType: 'all' }
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

function PlotFilters({ filters, onChange, onReset, resultCount, mobileOpen, onCloseMobile }) {
  const areas = areasForCity(filters.city)
  const hasActiveFilters = buildActiveChips(filters).length > 0

  const toggleFeature = (feature) => {
    const next = filters.features.includes(feature)
      ? filters.features.filter((item) => item !== feature)
      : [...filters.features, feature]
    onChange({ ...filters, features: next })
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
        <FilterField label="Plot Type">
          <ChipGroup
            name="Plot Type"
            options={TYPE_OPTIONS}
            value={filters.plotType}
            onChange={(plotType) => onChange({ ...filters, plotType })}
          />
        </FilterField>

        <FilterField label="City">
          <SelectInput
            icon={MapPin}
            value={filters.city}
            onChange={(city) => onChange({ ...filters, city, area: '' })}
            options={CITIES}
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
            e.g. {formatPKR(10_000_000)} – {formatPKR(50_000_000)}
          </p>
        </FilterField>

        <FilterField label="Size unit">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <SquareStack className="h-4 w-4" aria-hidden="true" />
            </span>
            <ChipGroup
              name="Size unit"
              options={SIZE_OPTIONS}
              value={filters.sizeUnit}
              onChange={(sizeUnit) => onChange({ ...filters, sizeUnit })}
            />
          </div>
        </FilterField>

        <FilterField label="Possession">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
            </span>
            <ChipGroup
              name="Possession"
              options={POSSESSION_OPTIONS}
              value={filters.possession}
              onChange={(possession) => onChange({ ...filters, possession })}
            />
          </div>
        </FilterField>

        {FEATURE_TAGS.length > 0 && (
          <FilterField label="Features">
            <div className="flex flex-wrap gap-2">
              {FEATURE_TAGS.map((feature) => {
                const selected = filters.features.includes(feature)
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                      selected
                        ? 'bg-brand text-white shadow-sm shadow-brand/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-brand/30 hover:bg-brand-soft hover:text-brand'
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    {feature}
                  </button>
                )
              })}
            </div>
          </FilterField>
        )}
      </div>

      <p className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        Showing <span className="font-bold text-brand">{resultCount}</span> of {featuredPlots.length}{' '}
        plots
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
 * All featured plots — `/plots`.
 *
 * Left filter rail + searchable / sortable card grid. Navbar / Footer are not
 * rendered around this route.
 */
export default function Plots() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(
    () => sortPlots(featuredPlots.filter((plot) => matchesFilters(plot, filters)), filters.sort),
    [filters],
  )

  const chips = useMemo(() => buildActiveChips(filters), [filters])

  const clearAll = () => setFilters(INITIAL_FILTERS)

  const removeChip = (chipKey) => {
    setFilters((current) => clearChip(current, chipKey))
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <PlotFilters
          filters={filters}
          onChange={setFilters}
          onReset={clearAll}
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
            Browse Plots
          </h1>
          <span className="mt-3 block h-1.5 w-20 rounded-full bg-brand" aria-hidden="true" />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Filter by city, society, budget, size, possession and plot features.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block min-w-0 flex-1 max-w-xl">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                aria-hidden="true"
              />
              <input
                type="search"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                placeholder="Search plot, society or block…"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-3 pl-10 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
              />
            </label>

            <label className="shrink-0">
              <span className="sr-only">Sort plots</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15 sm:w-48"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

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

          <div className="mt-8 origin-top [zoom:0.9] sm:[zoom:0.92]">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((plot) => (
                  <PlotCard key={plot.id} plot={plot} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Maximize className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900">No plots match</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Try widening the price range, changing the city, or clearing filters.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
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
