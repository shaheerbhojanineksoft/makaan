import { useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SearchX } from 'lucide-react'

import Navbar from './components/Navbar'
import GetTheApp from './components/GetTheApp'
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
import AgentRecommendations from './pages/AgentRecommendations'
import RecommendationDetail from './pages/RecommendationDetail'
import MyRecommendations from './pages/MyRecommendations'
import CreateRecommendation from './pages/CreateRecommendation'
import AdminRecommendations from './pages/AdminRecommendations'
import Favourites from './pages/Favourites'
import Profile from './pages/Profile'
import ComingSoon from './pages/ComingSoon'

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
 * Footer always renders on every route. Some inventory / detail routes still
 * hide the shared Navbar (they keep their own back controls).
 */
const AGENT_PROFILE_ROUTE = /^\/agents\/[^/]+\/?$/
const AGENTS_INDEX_ROUTE = /^\/agents\/?$/
const PLOTS_INDEX_ROUTE = /^\/plots\/?$/
const PROPERTIES_INDEX_ROUTE = /^\/properties\/?$/
const PLOT_DETAIL_ROUTE = /^\/plots\/[^/]+\/?$/
const PROPERTY_DETAIL_ROUTE = /^\/properties\/[^/]+\/?$/
const ADVANCED_BOOKING_ROUTE = /^\/advanced-booking\/?$/
const ADVANCED_BOOKING_DETAIL_ROUTE = /^\/advanced-booking\/[^/]+\/?$/

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isAgentProfile = AGENT_PROFILE_ROUTE.test(pathname)
  const isAgentsIndex = AGENTS_INDEX_ROUTE.test(pathname)
  const isPlotsIndex = PLOTS_INDEX_ROUTE.test(pathname)
  const isPropertiesIndex = PROPERTIES_INDEX_ROUTE.test(pathname)
  const isPlotDetail = PLOT_DETAIL_ROUTE.test(pathname)
  const isPropertyDetail = PROPERTY_DETAIL_ROUTE.test(pathname)
  const isAdvancedBooking = ADVANCED_BOOKING_ROUTE.test(pathname)
  const isAdvancedBookingDetail = ADVANCED_BOOKING_DETAIL_ROUTE.test(pathname)
  const showNavbar =
    !isAgentProfile &&
    !isAgentsIndex &&
    !isPlotsIndex &&
    !isPropertiesIndex &&
    !isPropertyDetail &&
    !isPlotDetail &&
    !isAdvancedBooking &&
    !isAdvancedBookingDetail

  function handleSignOut() {
    navigate('/', { replace: true })
    setHasEntered(false)
  }

  function handleEnter() {
    navigate('/', { replace: true })
    setHasEntered(true)
  }

  return (
    <>
      <RoleGate open={!hasEntered} onEnter={handleEnter} />

      {/* While the gate is open the shell stays inert — visible behind it, but
          not clickable, focusable or exposed to assistive technology. */}
      <div inert={!hasEntered} className="flex min-h-screen flex-col bg-offwhite">
        <ScrollToTop />
        {showNavbar && <Navbar onSignOut={handleSignOut} />}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route path="/contact" element={<ContactUs />} />

            <Route path="/favourites" element={<Favourites />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/properties" element={<Properties />} />

            <Route path="/properties/:id" element={<PropertyDetail />} />

            <Route path="/plots" element={<Plots />} />

            <Route path="/plots/:id" element={<PlotDetail />} />

            <Route path="/agents" element={<Agents />} />

            <Route path="/agents/:id" element={<AgentProfile />} />

            <Route path="/advanced-booking" element={<AdvanceBooking />} />

            <Route path="/advanced-booking/:id" element={<AdvanceBookingDetail />} />

            <Route path="/agents-recommend" element={<AgentRecommendations />} />

            <Route path="/agents-recommend/:id" element={<RecommendationDetail />} />

            <Route path="/my-recommendations" element={<MyRecommendations />} />

            <Route path="/my-recommendations/new" element={<CreateRecommendation />} />

            <Route path="/my-recommendations/:id/edit" element={<CreateRecommendation />} />

            <Route path="/admin/recommendations" element={<AdminRecommendations />} />

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

        <GetTheApp />
        <Footer />
      </div>
    </>
  )
}
