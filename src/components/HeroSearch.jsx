import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Building2,
  ChevronDown,
  KeyRound,
  LandPlot,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { areasForCity, CITIES, PRICE, PROPERTY_TYPES } from '../data/filters'
import { HERO_STATS, SITE } from '../data/siteConfig'
import { formatPKR } from '../utils/format'
import { ASK_MAKAN_EXAMPLES, parseSearchIntent } from '../utils/parseSearchIntent'

const TABS = [
  { id: 'buy', label: 'Buy', icon: Building2, priceLabel: 'Max Budget' },
  { id: 'rent', label: 'Rent', icon: KeyRound, priceLabel: 'Max Monthly Rent' },
]

const SEARCH_MODES = [
  { id: 'filters', label: 'Filters', icon: SlidersHorizontal },
  { id: 'ask', label: 'Ask Makan', icon: Wand2 },
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
 * Supports two modes:
 * - Filters: classic city / type / budget controls
 * - Ask Makan: natural-language intent → same filter payload
 *
 * @param {(filters: object) => void} [onSearch]
 */
export default function HeroSearch({ onSearch, showTrustStrip = true }) {
  const [searchMode, setSearchMode] = useState('filters')
  const [activeTab, setActiveTab] = useState('buy')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [maxPrice, setMaxPrice] = useState(PRICE.buy.defaultValue)
  const [askQuery, setAskQuery] = useState('')
  const [isUnderstanding, setIsUnderstanding] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const understandTimer = useRef(null)

  const tab = TABS.find((item) => item.id === activeTab) ?? TABS[0]
  const bounds = PRICE[activeTab]
  const typeOptions = PROPERTY_TYPES
  const areaOptions = useMemo(() => areasForCity(city), [city])

  const sliderPercent = useMemo(() => {
    const { min, max } = bounds
    return Math.min(100, Math.max(0, ((maxPrice - min) / (max - min)) * 100))
  }, [bounds, maxPrice])

  useEffect(() => {
    return () => {
      if (understandTimer.current) clearTimeout(understandTimer.current)
    }
  }, [])

  function handleModeChange(nextMode) {
    if (nextMode === searchMode) return
    setSearchMode(nextMode)
    setValidationMessage('')
  }

  function handleTabChange(nextTab) {
    if (nextTab === activeTab) return
    setActiveTab(nextTab)
    setPropertyType('')
    setMaxPrice(PRICE[nextTab].defaultValue)
    setValidationMessage('')
  }

  function handleFilterSubmit(event) {
    event.preventDefault()
    if (!city || !propertyType) {
      setValidationMessage('Please select a city and property type before searching.')
      return
    }

    setValidationMessage('')
    onSearch?.({
      purpose: activeTab,
      city,
      area,
      propertyType,
      maxPrice,
      source: 'filters',
    })
  }

  function runAskSearch(rawQuery) {
    const query = String(rawQuery || '').trim()
    if (query.length < 4) {
      setValidationMessage('Describe what you need — city, type, budget, or area.')
      return
    }

    setValidationMessage('')
    setIsUnderstanding(true)

    if (understandTimer.current) clearTimeout(understandTimer.current)
    understandTimer.current = setTimeout(() => {
      const filters = parseSearchIntent(query)
      setIsUnderstanding(false)
      onSearch?.(filters)
    }, 420)
  }

  function handleAskSubmit(event) {
    event.preventDefault()
    runAskSearch(askQuery)
  }

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-brand" aria-hidden="true">
        <img
          src={SITE.heroImage}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      {/* Light brand wash — marketplace art stays clear, white copy stays readable */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand/55 via-brand/25 to-brand/55"
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

        <div className="animate-fade-up mx-auto mt-10 max-w-5xl rounded-3xl border border-white/25 bg-white/10 p-3 shadow-glass backdrop-blur-xl sm:p-4">
          {/* Search mode: Filters vs Ask Makan */}
          <div
            role="tablist"
            aria-label="Search mode"
            className="mx-auto mb-3 flex w-full max-w-sm gap-1 rounded-2xl bg-brand-dark/50 p-1 sm:w-fit"
          >
            {SEARCH_MODES.map(({ id, label, icon: Icon }) => {
              const isActive = searchMode === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleModeChange(id)}
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

          {searchMode === 'filters' ? (
            <form onSubmit={handleFilterSubmit}>
              <div
                role="tablist"
                aria-label="Search purpose"
                className="mb-3 flex gap-1 overflow-x-auto rounded-2xl bg-brand-dark/40 p-1 no-scrollbar sm:w-fit"
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
                          ? 'bg-brand text-white shadow-md'
                          : 'text-brand-soft/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  )
                })}
              </div>

              <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-12">
                <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-brand-light/50 lg:col-span-2">
                  <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="sr-only">City</span>
                  <select
                    aria-required="true"
                    aria-invalid={Boolean(validationMessage && !city)}
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value)
                      setArea('')
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
                  <ChevronDown
                    className="pointer-events-none h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                </label>

                <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-brand-light/50 lg:col-span-3">
                  <LandPlot className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="sr-only">Area</span>
                  <select
                    value={area}
                    onChange={(event) => {
                      setArea(event.target.value)
                      setValidationMessage('')
                    }}
                    className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-slate-800 outline-none"
                  >
                    <option value="">All Areas</option>
                    {areaOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                </label>

                <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm transition focus-within:ring-2 focus-within:ring-brand-light/50 lg:col-span-2">
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
                    <option value="">All Property Types</option>
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                </label>

                <div className="flex flex-col justify-center rounded-xl bg-white px-3 py-2.5 shadow-sm sm:col-span-2 lg:col-span-3">
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

                <button
                  type="submit"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl sm:col-span-2 lg:col-span-2"
                >
                  <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Search
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAskSubmit}>
              <p className="mb-3 text-center text-xs font-medium text-brand-soft/85 sm:text-left">
                Describe your search in plain words — we&apos;ll turn it into filters automatically.
              </p>

              <div className="grid items-stretch gap-3 lg:grid-cols-12">
                <label className="relative flex items-start gap-2 rounded-xl bg-white px-3 py-3 shadow-sm transition focus-within:ring-2 focus-within:ring-brand-light/50 lg:col-span-10">
                  <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="sr-only">Ask Makan</span>
                  <textarea
                    rows={2}
                    value={askQuery}
                    onChange={(event) => {
                      setAskQuery(event.target.value)
                      setValidationMessage('')
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        runAskSearch(askQuery)
                      }
                    }}
                    placeholder='e.g. "Lahore mein 3 bed house under 2 crore"'
                    className="w-full resize-none bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-slate-400"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isUnderstanding}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl disabled:cursor-wait disabled:opacity-80 lg:col-span-2"
                >
                  {isUnderstanding ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Reading…
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                      Ask
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {ASK_MAKAN_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setAskQuery(example)
                      setValidationMessage('')
                      runAskSearch(example)
                    }}
                    className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/25"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </form>
          )}

          {validationMessage && (
            <p role="alert" className="mt-3 text-center text-sm font-semibold text-white">
              {validationMessage}
            </p>
          )}
        </div>

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
