import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SearchX } from 'lucide-react'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RoleGate from './components/RoleGate'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import ContactUs from './pages/ContactUs'
import AgentProfile from './pages/AgentProfile'
import Agents from './pages/Agents'
import PlotDetail from './pages/PlotDetail'
import PropertyDetail from './pages/PropertyDetail'
import Properties from './pages/Properties'
import Plots from './pages/Plots'
import AdvanceBooking from './pages/AdvanceBooking'
import AdvanceBookingDetail from './pages/AdvanceBookingDetail'
import ComingSoon from './pages/ComingSoon'
import WorkInProgress from './pages/WorkInProgress'

/**
 * Application shell.
 *
 * On first load a role-selection gate (RoleGate) is layered over the app: the
 * seeker path dismisses it into the user-side flow below, while the agency path
 * is advertised but not yet available.
 *
 * The Home, About and Contact screens are fully implemented. Every other screen
 * listed in the project brief is already wired to a route so it can be dropped
 * in later as a dedicated page component without touching this file's structure:
 *
 *   src/pages/About.jsx           ->  /about
 *   src/pages/ContactUs.jsx       ->  /contact
 *   src/pages/Properties.jsx      ->  /properties
 *   src/pages/PropertyDetails.jsx ->  /properties/:id
 *   src/pages/AdvancedBooking.jsx ->  /advanced-booking
 *
 * /plots and /plots/:id are live: Plots is the scrollable card-only inventory
 * that every "Browse all plots" action opens, and PlotDetail (reachable from
 * every "Exclusive Featured Plots" card) is the single-plot screen. Neither
 * renders the shared Footer, and the /plots inventory screen drops the Navbar
 * as well so the cards are the only thing on it.
 *
 * /properties and /properties/:id follow the same card-only inventory and
 * detail flow for freshly added properties.
 *
 * /agents, /properties, /plots and their :id detail routes drop the shared
 * Navbar / Footer (each detail page keeps its own back control).
 * /advanced-booking (+ :id detail) mirrors plots/properties inventory (no shell).
 * /agents-recommend remains a standalone work-in-progress screen.
 */
const AGENT_PROFILE_ROUTE = /^\/agents\/[^/]+\/?$/
/* The card-only agents inventory — no Navbar, no Footer. */
const AGENTS_INDEX_ROUTE = /^\/agents\/?$/
/* The card-only plots inventory — no Navbar, no Footer. */
const PLOTS_INDEX_ROUTE = /^\/plots\/?$/
/* The card-only properties inventory — no Navbar, no Footer. */
const PROPERTIES_INDEX_ROUTE = /^\/properties\/?$/
/* A single plot — no Navbar, no Footer (own back control on the page). */
const PLOT_DETAIL_ROUTE = /^\/plots\/[^/]+\/?$/
/* A single property — no Navbar, no Footer (own back control on the page). */
const PROPERTY_DETAIL_ROUTE = /^\/properties\/[^/]+\/?$/
const ADVANCED_BOOKING_ROUTE = /^\/advanced-booking\/?$/
const ADVANCED_BOOKING_DETAIL_ROUTE = /^\/advanced-booking\/[^/]+\/?$/
const AGENTS_RECOMMEND_ROUTE = /^\/agents-recommend\/?$/

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [isHomeSearchResults, setIsHomeSearchResults] = useState(false)
  const { pathname } = useLocation()
  const isAgentProfile = AGENT_PROFILE_ROUTE.test(pathname)
  const isAgentsIndex = AGENTS_INDEX_ROUTE.test(pathname)
  const isPlotsIndex = PLOTS_INDEX_ROUTE.test(pathname)
  const isPropertiesIndex = PROPERTIES_INDEX_ROUTE.test(pathname)
  const isPlotDetail = PLOT_DETAIL_ROUTE.test(pathname)
  const isPropertyDetail = PROPERTY_DETAIL_ROUTE.test(pathname)
  const isAdvancedBooking = ADVANCED_BOOKING_ROUTE.test(pathname)
  const isAdvancedBookingDetail = ADVANCED_BOOKING_DETAIL_ROUTE.test(pathname)
  const isAgentsRecommend = AGENTS_RECOMMEND_ROUTE.test(pathname)
  const showShell =
    !isAgentProfile &&
    !isAgentsIndex &&
    !isPlotsIndex &&
    !isPropertiesIndex &&
    !isPropertyDetail &&
    !isPlotDetail &&
    !isAdvancedBooking &&
    !isAdvancedBookingDetail &&
    !isAgentsRecommend

  useEffect(() => {
    if (pathname !== '/') setIsHomeSearchResults(false)
  }, [pathname])

  return (
    <>
      <RoleGate open={!hasEntered} onEnter={() => setHasEntered(true)} />

      {/* While the gate is open the shell stays inert — visible behind it, but
          not clickable, focusable or exposed to assistive technology. */}
      <div inert={!hasEntered} className="flex min-h-screen flex-col bg-offwhite">
        <ScrollToTop />
        {showShell && <Navbar />}

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<Home onSearchResultsVisibilityChange={setIsHomeSearchResults} />}
            />

            <Route path="/about" element={<About />} />

            <Route path="/contact" element={<ContactUs />} />

            <Route path="/properties" element={<Properties />} />

            <Route
              path="/properties/:id"
              element={<PropertyDetail />}
            />

            <Route path="/plots" element={<Plots />} />

            <Route path="/plots/:id" element={<PlotDetail />} />

            <Route path="/agents" element={<Agents />} />

            <Route path="/agents/:id" element={<AgentProfile />} />

            <Route path="/advanced-booking" element={<AdvanceBooking />} />

            <Route path="/advanced-booking/:id" element={<AdvanceBookingDetail />} />

            <Route
              path="/agents-recommend"
              element={
                <WorkInProgress
                  title="Work Under Progress"
                  description="Agent recommendations are being built. Soon you will see curated picks from our star-marked partners here."
                />
              }
            />

            <Route
              path="*"
              element={
                <ComingSoon
                  badge="Error 404"
                  title="Page Not Found"
                  icon={SearchX}
                  description="The page you are looking for has been moved, sold or never existed. Let's get you back to the listings."
                />
              }
            />
          </Routes>
        </main>

        {showShell && !isHomeSearchResults && <Footer />}
      </div>
    </>
  )
}
