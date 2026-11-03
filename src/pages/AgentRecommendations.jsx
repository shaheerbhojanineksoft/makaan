import { useMemo, useState } from 'react'
import {
  Lightbulb,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import RecommendationCard from '../components/RecommendationCard'
import {
  RECOMMENDATION_CATEGORIES,
  getPublishedRecommendations,
  hydrateRecommendation,
} from '../data/recommendations'

const TABS = ['All Recommendations', ...RECOMMENDATION_CATEGORIES]

const INITIAL_FILTERS = {
  keyword: '',
  city: '',
  area: '',
  category: '',
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
 * Public “What Our Agents Recommend” listing — `/agents-recommend`.
 */
export default function AgentRecommendations() {
  const [tab, setTab] = useState('All Recommendations')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [mobileOpen, setMobileOpen] = useState(false)

  const published = useMemo(
    () => getPublishedRecommendations().map(hydrateRecommendation),
    [],
  )

  const cities = useMemo(
    () => [...new Set(published.map((item) => item.city))].sort(),
    [published],
  )

  const areas = useMemo(() => {
    const source = filters.city
      ? published.filter((item) => item.city === filters.city)
      : published
    return [...new Set(source.map((item) => item.location))].sort()
  }, [published, filters.city])

  const filtered = useMemo(() => {
    return published.filter((item) => {
      if (tab !== 'All Recommendations' && item.category !== tab) return false

      const keyword = filters.keyword.trim().toLowerCase()
      if (keyword) {
        const haystack = [
          item.title,
          item.description,
          item.city,
          item.location,
          item.agent?.name,
          item.agent?.agency,
          item.relatedProject?.name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(keyword)) return false
      }

      if (filters.city && item.city !== filters.city) return false
      if (filters.area && item.location !== filters.area) return false
      if (filters.category && item.category !== filters.category) return false
      return true
    })
  }, [published, tab, filters])

  const clearAll = () => setFilters(INITIAL_FILTERS)

  const filterPanel = (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </span>
          Filters
        </h2>
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-brand transition hover:bg-brand-soft"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Clear
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <FilterField label="City">
          <SelectInput
            icon={MapPin}
            value={filters.city}
            onChange={(city) => setFilters({ ...filters, city, area: '' })}
            options={cities}
            placeholder="All cities"
          />
        </FilterField>

        <FilterField label="Area / Location">
          <SelectInput
            value={filters.area}
            onChange={(area) => setFilters({ ...filters, area })}
            options={areas}
            placeholder="All areas"
          />
        </FilterField>

        <FilterField label="Category">
          <SelectInput
            value={filters.category}
            onChange={(category) => setFilters({ ...filters, category })}
            options={RECOMMENDATION_CATEGORIES}
            placeholder="All categories"
          />
        </FilterField>
      </div>

      <p className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        Showing <span className="font-bold text-brand">{filtered.length}</span> insights
      </p>
    </>
  )

  return (
    <section className="min-h-screen bg-white">
      <div className="border-b border-slate-200/80 bg-gradient-to-b from-brand-soft/70 to-white">
        <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            Expert insights
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
            What Our Agents Recommend
          </h1>
          <span className="mt-4 block h-1.5 w-24 rounded-full bg-brand" aria-hidden="true" />
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Discover upcoming projects, trending properties and investment opportunities recommended
            by real estate experts across Pakistan.
          </p>
          <p className="mt-3 max-w-3xl rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-900 sm:text-sm">
            Agent recommendations are professional opinions. Always verify project documents, NOCs
            and payment plans independently before booking.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                tab === item
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-brand/30 hover:text-brand'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

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
              placeholder="Search insights, cities or agencies…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-3 pl-10 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-xs font-bold text-brand lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
          </button>
        </div>

        <div className="mt-8 flex gap-8">
          <aside className="sticky top-24 hidden w-72 shrink-0 self-start rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 lg:block xl:w-80">
            {filterPanel}
          </aside>

          <div className="min-w-0 flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <RecommendationCard key={item.id} recommendation={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Lightbulb className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
                  No recommendations match
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Try another tab, city or clear filters to see more expert insights.
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

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Dismiss filters"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}
    </section>
  )
}
