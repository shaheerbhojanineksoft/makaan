import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SearchX } from 'lucide-react'

import Navbar from './components/Navbar'
import GetTheApp from './components/GetTheApp'
import Footer from './components/Footer'
import RoleGate from './components/RoleGate'
import ScrollToTop from './components/ScrollToTop'
import AgencyShell from './components/agency/AgencyShell'
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
import Reels from './pages/Reels'
import AgentRecommendations from './pages/AgentRecommendations'
import RecommendationDetail from './pages/RecommendationDetail'
import MyRecommendations from './pages/MyRecommendations'
import CreateRecommendation from './pages/CreateRecommendation'
import AdminRecommendations from './pages/AdminRecommendations'
import Favourites from './pages/Favourites'
import Profile from './pages/Profile'
import ComingSoon from './pages/ComingSoon'
import AgencyDashboard from './pages/agency/AgencyDashboard'
import AgencyProfileEdit from './pages/agency/AgencyProfileEdit'
import AgencyListings from './pages/agency/AgencyListings'
import AgencyListingForm from './pages/agency/AgencyListingForm'
import AgencyRecommendations from './pages/agency/AgencyRecommendations'
import AgencyHelpSupport from './pages/agency/AgencyHelpSupport'
import AgencyReels from './pages/agency/AgencyReels'
import AgencyReelForm from './pages/agency/AgencyReelForm'
import {
  clearSession,
  enterAsAgency,
  enterAsUser,
  useSession,
} from './utils/session'

const AGENT_PROFILE_ROUTE = /^\/agents\/[^/]+\/?$/
const AGENTS_INDEX_ROUTE = /^\/agents\/?$/
const PLOTS_INDEX_ROUTE = /^\/plots\/?$/
const PROPERTIES_INDEX_ROUTE = /^\/properties\/?$/
const PLOT_DETAIL_ROUTE = /^\/plots\/[^/]+\/?$/
const PROPERTY_DETAIL_ROUTE = /^\/properties\/[^/]+\/?$/
export default function App() {
  const session = useSession()
  const hasEntered = Boolean(session.role)
  const isAgency = session.role === 'agency'
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isAgentProfile = AGENT_PROFILE_ROUTE.test(pathname)
  const isAgentsIndex = AGENTS_INDEX_ROUTE.test(pathname)
  const isPlotsIndex = PLOTS_INDEX_ROUTE.test(pathname)
  const isPropertiesIndex = PROPERTIES_INDEX_ROUTE.test(pathname)
  const isPlotDetail = PLOT_DETAIL_ROUTE.test(pathname)
  const isPropertyDetail = PROPERTY_DETAIL_ROUTE.test(pathname)
  const isReels = pathname === '/reels' || pathname.startsWith('/reels/')
  const showNavbar =
    !isReels &&
    !isAgentProfile &&
    !isAgentsIndex &&
    !isPlotsIndex &&
    !isPropertiesIndex &&
    !isPropertyDetail &&
    !isPlotDetail
  const showChrome = !isReels

  function handleSignOut() {
    clearSession()
    navigate('/', { replace: true })
  }

  function handleEnterUser() {
    enterAsUser()
    navigate('/', { replace: true })
  }

  function handleEnterAgency() {
    enterAsAgency()
    navigate('/agency', { replace: true })
  }

  if (isAgency) {
    return (
      <>
        <RoleGate
          open={!hasEntered}
          onEnterUser={handleEnterUser}
          onEnterAgency={handleEnterAgency}
        />
        <div className="min-h-screen bg-offwhite">
          <ScrollToTop />
          <Routes>
            <Route path="/agency" element={<AgencyShell onSignOut={handleSignOut} />}>
              <Route index element={<AgencyDashboard />} />
              <Route path="profile" element={<AgencyProfileEdit />} />
              <Route path="listings" element={<AgencyListings />} />
              <Route path="listings/new" element={<AgencyListingForm />} />
              <Route path="listings/:id/edit" element={<AgencyListingForm />} />
              <Route path="recommendations" element={<AgencyRecommendations />} />
              <Route path="recommendations/new" element={<CreateRecommendation />} />
              <Route path="recommendations/:id/edit" element={<CreateRecommendation />} />
              <Route path="reels" element={<AgencyReels />} />
              <Route path="reels/new" element={<AgencyReelForm />} />
              <Route path="help-support" element={<AgencyHelpSupport />} />
            </Route>
            <Route path="*" element={<Navigate to="/agency" replace />} />
          </Routes>
        </div>
      </>
    )
  }

  return (
    <>
      <RoleGate
        open={!hasEntered}
        onEnterUser={handleEnterUser}
        onEnterAgency={handleEnterAgency}
      />

      <div inert={!hasEntered ? true : undefined} className="flex min-h-screen flex-col bg-offwhite">
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
            <Route path="/reels" element={<Reels />} />
            <Route path="/agents-recommend" element={<AgentRecommendations />} />
            <Route path="/agents-recommend/:id" element={<RecommendationDetail />} />
            <Route path="/my-recommendations" element={<MyRecommendations />} />
            <Route path="/my-recommendations/new" element={<CreateRecommendation />} />
            <Route path="/my-recommendations/:id/edit" element={<CreateRecommendation />} />
            <Route path="/admin/recommendations" element={<AdminRecommendations />} />
            <Route path="/agency/*" element={<Navigate to="/" replace />} />
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

        {showChrome && <GetTheApp />}
        {showChrome && <Footer />}
      </div>
    </>
  )
}
