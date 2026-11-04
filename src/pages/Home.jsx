import { useCallback, useEffect, useState } from 'react'

import HeroSearch from '../components/HeroSearch'
import HomeSearchResults from '../components/HomeSearchResults'
import FeaturedAgents from '../components/FeaturedAgents'
import FeaturedPlots from '../components/FeaturedPlots'
import FreshProperties from '../components/FreshProperties'

/**
 * Home screen — the sequential scroll flow:
 *
 *   Navbar (App shell)
 *    1. HeroSearch        — landmark hero + multi-tab glass search
 *    2. FreshProperties   — newest listings, light green tint
 *    3. FeaturedPlots     — exclusive plots, clean white surface
 *    4. FeaturedAgents    — top 8 experts, off-white surface
 *   Footer (App shell)
 *
 * Each block is an independent component, so any section can be reordered,
 * reused on another page, or swapped for an API-driven version in isolation.
 */
export default function Home({ onSearchResultsVisibilityChange }) {
  const [searchFilters, setSearchFilters] = useState(null)

  useEffect(() => {
    if (!searchFilters) return undefined
    const frame = requestAnimationFrame(() => {
      document.getElementById('home-search-results')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [searchFilters])

  /**
   * Show local matching listings below the hero without leaving the home page.
   */
  const handleSearch = useCallback(
    (filters) => {
      setSearchFilters(filters)
      onSearchResultsVisibilityChange?.(true)
    },
    [onSearchResultsVisibilityChange],
  )

  const clearSearch = useCallback(() => {
    setSearchFilters(null)
    onSearchResultsVisibilityChange?.(false)
  }, [onSearchResultsVisibilityChange])

  return (
    <>
      <HeroSearch onSearch={handleSearch} showTrustStrip={!searchFilters} />
      {searchFilters ? (
        <HomeSearchResults filters={searchFilters} onClear={clearSearch} />
      ) : (
        <>
          <FreshProperties />
          <FeaturedPlots />
          <FeaturedAgents />
        </>
      )}
    </>
  )
}
