import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SearchX } from 'lucide-react'

import Navbar from './components/Navbar'
import GetTheApp from './components/GetTheApp'
import Footer from './components/Footer'
import RoleGate from './components/RoleGate'
import BuyerGuidePopup from './components/BuyerGuidePopup'
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
import BeforeYouBuy from './pages/BeforeYouBuy'
import TrustedLawyers from './pages/TrustedLawyers'
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
import {
  clearBuyerGuidePending,
  consumeBuyerGuideSkipOnce,
  isBuyerGuidePending,
  markBuyerGuideSkipOnce,
  syncBuyerGuideOnPageLoad,
} from './utils/buyerGuidePopup'

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
  const isUser = session.role === 'user'
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [buyerGuideOpen, setBuyerGuideOpen] = useState(false)
  const loadSyncedRef = useRef(false)

  useEffect(() => {
    function onPopState() {
      // Soft/hard browser back should not reopen guidance on dashboard.
      markBuyerGuideSkipOnce()
      setBuyerGuideOpen(false)
    }
    function onPageShow(event) {
      // Back-forward cache restore should not force the splash again.
      if (event.persisted) {
        markBuyerGuideSkipOnce()
        setBuyerGuideOpen(false)
      }
    }
    window.addEventListener('popstate', onPopState)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  useEffect(() => {
    if (loadSyncedRef.current) return
    loadSyncedRef.current = true
    syncBuyerGuideOnPageLoad(isUser, pathname)

    // Hard refresh on dashboard must open guidance even if RR reports POP.
    if (
      isUser &&
      hasEntered &&
      (pathname === '/' || pathname === '') &&
      !consumeBuyerGuideSkipOnce() &&
      isBuyerGuidePending()
    ) {
      setBuyerGuideOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isUser || !hasEntered || pathname !== '/') {
      setBuyerGuideOpen(false)
      return
    }
    if (consumeBuyerGuideSkipOnce()) {
      setBuyerGuideOpen(false)
      return
    }
    if (isBuyerGuidePending()) setBuyerGuideOpen(true)
  }, [isUser, hasEntered, pathname])

  const handleCloseBuyerGuide = useCallback(() => {
    clearBuyerGuidePending()
    setBuyerGuideOpen(false)
  }, [])

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

      <BuyerGuidePopup open={buyerGuideOpen} onClose={handleCloseBuyerGuide} />

      <div inert={!hasEntered ? true : undefined} className="flex min-h-screen flex-col bg-offwhite">
        <ScrollToTop />
        {showNavbar && <Navbar onSignOut={handleSignOut} />}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/before-you-buy" element={<BeforeYouBuy />} />
            <Route path="/trusted-lawyers" element={<TrustedLawyers />} />
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
