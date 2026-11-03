import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Building2,
  CalendarClock,
  ChevronDown,
  KeyRound,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { CITIES, PRICE, PROJECT_TYPES, PROPERTY_TYPES } from '../data/filters'
import { HERO_STATS, SITE } from '../data/siteConfig'
import { formatPKR } from '../utils/format'

const TABS = [
  { id: 'buy', label: 'Buy', icon: Building2, priceLabel: 'Max Budget' },
  { id: 'rent', label: 'Rent', icon: KeyRound, priceLabel: 'Max Monthly Rent' },
  { id: 'booking', label: 'Advanced Booking', icon: CalendarClock, priceLabel: 'Max Booking Value' },
]

function AnimatedStat({ stat }) {
  const [count, setCount] = useState(0)
  const statRef = useRef(null)

  useEffect(() => {
    const element = statRef.current
    if (!element) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setCount(stat.count)
      return undefined
    }

    let animationFrame
    let observer
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const startedAt = performance.now()
        const duration = 4000

        function animate(now) {
          const progress = Math.min((now - startedAt) / duration, 1)
          const easedProgress = 1 - (1 - progress) ** 3
          setCount(Math.round(stat.count * easedProgress))
          if (progress < 1) animationFrame = requestAnimationFrame(animate)
        }

        animationFrame = requestAnimationFrame(animate)
      },
      { threshold: 0.25 },
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [stat.count])

  return (
    <div ref={statRef} className="text-center">
      <dt className="sr-only">{stat.label}</dt>
      <dd className="font-display text-2xl font-extrabold text-white sm:text-3xl">
        {count.toLocaleString('en-US')}+
      </dd>
      <dd className="mt-1 text-[11px] font-semibold tracking-wide text-brand-soft/70 uppercase">
        {stat.label}
      </dd>
    </div>
  )
}

/**
 * Hero + multi-tab glassmorphism search bar.
 *
 * Fully self-contained: it owns its filter state and simply hands the final
 * payload to `onSearch`, so wiring it to a real API or a results route later
 * requires zero changes here.
 *
 * @param {(filters: {purpose: string, city: string, propertyType: string, maxPrice: number}) => void} [onSearch]
 */
export default function HeroSearch({ onSearch, showTrustStrip = true }) {
  const [activeTab, setActiveTab] = useState('buy')
  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [maxPrice, setMaxPrice] = useState(PRICE.buy.defaultValue)
  const [validationMessage, setValidationMessage] = useState('')

  const tab = TABS.find((item) => item.id === activeTab) ?? TABS[0]
  const bounds = PRICE[activeTab]
  const typeOptions = activeTab === 'booking' ? PROJECT_TYPES : PROPERTY_TYPES

  const sliderPercent = useMemo(() => {
    const { min, max } = bounds
    return Math.min(100, Math.max(0, ((maxPrice - min) / (max - min)) * 100))
  }, [bounds, maxPrice])

  function handleTabChange(nextTab) {
    if (nextTab === activeTab) return
    setActiveTab(nextTab)
    setPropertyType('')
    setMaxPrice(PRICE[nextTab].defaultValue)
    setValidationMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!city || !propertyType) {
      setValidationMessage('Please select a city and property type before searching.')
      return
    }

    setValidationMessage('')
    const filters = { purpose: activeTab, city, propertyType, maxPrice }

    /* TODO: replace with `navigate('/properties?' + new URLSearchParams(filters))`
       or POST to your Node.js backend once the listings API is live. */
    onSearch?.(filters)
  }

  return (
    <section className="relative isolate overflow-hidden">
      {/* Landmark background + Pakistan-green translucent overlay */}
      <div
        className="absolute inset-0 -z-20 bg-brand bg-cover bg-bottom"
        style={{ backgroundImage: `url(${SITE.heroImage})` }}
        aria-hidden="true"
      />
      {/* Translucent forest-green wash: keeps white copy legible without
          flattening the landmark skyline underneath. Heaviest behind the
          headline, lightest over the silhouette horizon. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand/70 via-brand/10 to-brand/35"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 -right-16 -z-10 h-80 w-80 rounded-full bg-brand-light/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="animate-fade-up text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] text-brand-soft uppercase ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Pakistan&apos;s #1 Verified Property Marketplace
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl leading-[1.1] font-extrabold text-balance text-white sm:text-5xl lg:text-6xl">
            {SITE.tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-brand-soft/85 sm:text-base">
            Search verified plots, houses, apartments and upcoming projects across all of Pakistan
            — powered by licensed agents and transparent pricing in PKR.
          </p>
        </div>

        {/* ------------------------------------------------ Search card */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-up mx-auto mt-10 max-w-5xl rounded-3xl border border-white/25 bg-white/10 p-3 shadow-glass backdrop-blur-xl sm:p-4"
        >
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Search purpose"
            className="mb-3 flex gap-1 overflow-x-auto rounded-2xl bg-brand-dark/50 p-1 no-scrollbar sm:w-fit"
          >
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = id === activeTab
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition sm:flex-none sm:text-sm ${
                    isActive
                      ? 'bg-white text-brand shadow-md'
                      : 'text-brand-soft/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Fields */}
          <div className="grid items-stretch gap-3 lg:grid-cols-12">
            {/* City */}
            <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-brand-light/50 lg:col-span-3">
              <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              <span className="sr-only">City</span>
              <select
                aria-required="true"
                aria-invalid={Boolean(validationMessage && !city)}
                value={city}
                onChange={(event) => {
                  setCity(event.target.value)
                  setValidationMessage('')
                }}
                className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-slate-800 outline-none"
              >
                <option value="">All Cities</option>
                {CITIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            </label>

            {/* Property / Project type */}
            <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-brand-light/50 lg:col-span-3">
              <Building2 className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              <span className="sr-only">Property type</span>
              <select
                aria-required="true"
                aria-invalid={Boolean(validationMessage && !propertyType)}
                value={propertyType}
                onChange={(event) => {
                  setPropertyType(event.target.value)
                  setValidationMessage('')
                }}
                className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-slate-800 outline-none"
              >
                <option value="">
                  {activeTab === 'booking' ? 'All Project Types' : 'All Property Types'}
                </option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            </label>

            {/* Price range slider */}
            <div className="flex flex-col justify-center rounded-xl bg-white px-3 py-2.5 shadow-sm lg:col-span-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                  {tab.priceLabel}
                </span>
                <span className="text-xs font-extrabold text-brand">{formatPKR(maxPrice)}</span>
              </div>
              <input
                type="range"
                className="price-range mt-2"
                min={bounds.min}
                max={bounds.max}
                step={bounds.step}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                aria-label={tab.priceLabel}
                style={{
                  background: `linear-gradient(90deg, #01411C ${sliderPercent}%, #E5E7EB ${sliderPercent}%)`,
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl lg:col-span-2"
            >
              <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
              Search
            </button>
          </div>
          {validationMessage && (
            <p role="alert" className="mt-3 text-center text-sm font-semibold text-white">
              {validationMessage}
            </p>
          )}
        </form>

        {showTrustStrip && (
          <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-10">
            {HERO_STATS.map((stat) => (
              <AnimatedStat key={stat.label} stat={stat} />
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
