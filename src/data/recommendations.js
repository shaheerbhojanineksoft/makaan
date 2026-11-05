/**
 * Agent recommendations — public insights, agency drafts and admin moderation.
 * Persisted mutations live in localStorage for UI-only demo flows.
 */

import { featuredAgents } from './agents'
import { bookingProjects } from './projects'
import { freshProperties } from './properties'

export const RECOMMENDATION_CATEGORIES = [
  'Upcoming Projects',
  'Trending Projects',
  'High-Demand Locations',
  'Investment Opportunities',
  'Market Insights',
]

export const DEMAND_LEVELS = ['High', 'Medium', 'Emerging']

export const PROJECT_TYPES = ['Residential', 'Commercial', 'Mixed Use', 'Plots', 'Apartments']

const STORAGE_KEY = 'makaan-recommendations-v1'

function agentBrief(id) {
  const agent = featuredAgents.find((item) => item.id === id)
  if (!agent) return null
  return {
    id: agent.id,
    name: agent.name,
    agency: agent.agency,
    city: agent.city,
    verified: agent.verified,
    avatar: agent.avatar,
    phone: agent.phone,
    email: agent.email,
    responseTime: agent.responseTime,
  }
}

function projectBrief(id) {
  const project = bookingProjects.find((item) => item.id === id)
  if (!project) return null
  return {
    id: project.id,
    name: project.name,
    city: project.city,
    location: project.location,
    startingPrice: project.startingPrice,
    bookingStatus: project.bookingStatus,
    image: project.image,
  }
}

const SEED = [
  {
    id: 'rec-001',
    title: 'Why DHA Phase Extension Files Are Heating Up in Multan',
    category: 'Investment Opportunities',
    city: 'Multan',
    location: 'DHA Multan Phase Extension',
    projectType: 'Plots',
    projectStatus: 'Pre-Launch',
    demandLevel: 'High',
    expectedLaunch: '2026-12-01',
    priceMin: 5_000_000,
    priceMax: 12_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'DHA Multan’s phase extension is drawing steady enquiry from local and overseas buyers looking for long-horizon plot holdings with structured quarterly payments.',
    whyRecommend:
      'We are seeing consistent site-visit requests and cleaner paperwork compared with unregulated societies in the same price band. Early files still price below mature DHA sectors.',
    marketInsights:
      'Demand is concentrated on 5–10 Marla residential plots. Weekly enquiry volume has risen for three consecutive months among Multan and Gulf-based clients.',
    futureProspects:
      'Road connectivity and DHA-managed infrastructure should support gradual appreciation toward the 2030 possession window, assuming development milestones stay on track.',
    projectOverview:
      'A DHA-managed residential extension with gated planning, long payment horizon and authority-backed transfers.',
    agentOpinionNote:
      'This is an agency market view, not a guaranteed return. Always verify allotment documents independently.',
    relatedProjectId: 'prj-008',
    relatedPropertyIds: ['prop-006', 'prop-002'],
    agentId: 'ag-006',
    status: 'published',
    publishedAt: '2026-10-12',
    createdAt: '2026-10-08',
    updatedAt: '2026-10-12',
    rejectionReason: '',
  },
  {
    id: 'rec-002',
    title: 'Clifton High-Rise Residences: Who Should Book Now',
    category: 'Trending Projects',
    city: 'Karachi',
    location: 'Block 4, Clifton',
    projectType: 'Apartments',
    projectStatus: 'Under Construction',
    demandLevel: 'High',
    expectedLaunch: '2026-06-01',
    priceMin: 22_000_000,
    priceMax: 42_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Sea-facing floors in Clifton are moving faster than mid-tower inventory. Buyers who need possession within 24–30 months are shortlisting verified towers with clear instalment plans.',
    whyRecommend:
      'Transparent booking amounts, covered parking and a known builder track record make this segment easier to underwrite for end-users and overseas families.',
    marketInsights:
      '2–3 bed units between PKR 2.2–3.2 Cr are seeing the strongest walk-in interest. Fit-out ready floors command a premium over shell units.',
    futureProspects:
      'Limited new cliff-facing launches keep replacement inventory tight. Resale liquidity remains stronger here than in peripheral high-rises.',
    projectOverview:
      'Under-construction residential tower with concierge lobby, pool and gym amenities in Clifton Block 4.',
    agentOpinionNote:
      'Agent opinion based on current enquiries. Project facts should be confirmed with the developer NOCs.',
    relatedProjectId: 'prj-009',
    relatedPropertyIds: ['prop-001', 'prop-003'],
    agentId: 'ag-001',
    status: 'published',
    publishedAt: '2026-10-18',
    createdAt: '2026-10-15',
    updatedAt: '2026-10-18',
    rejectionReason: '',
  },
  {
    id: 'rec-003',
    title: 'Capital Smart City Overseas Block — Who It Fits',
    category: 'Upcoming Projects',
    city: 'Rawalpindi',
    location: 'M-2 Motorway / Chakri',
    projectType: 'Mixed Use',
    projectStatus: 'Booking Open',
    demandLevel: 'Medium',
    expectedLaunch: '2026-04-01',
    priceMin: 11_000_000,
    priceMax: 25_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Overseas Block continues to attract non-resident buyers who prefer quarterly payments and a dedicated investor desk rather than spot cash deals.',
    whyRecommend:
      'For NRPs comfortable with a multi-year horizon, quarterly instalments and motorway access make diligence simpler than scattered private societies.',
    marketInsights:
      '10 Marla residential files lead enquiry. Commercial corners are thinner but ask higher ticket sizes.',
    futureProspects:
      'Infra milestones along the M-2 corridor will influence absorption more than short-term price noise.',
    projectOverview:
      'Mixed-use overseas-focused block with residential and commercial plot inventory.',
    agentOpinionNote:
      'Recommendation reflects agency client mix. Development timelines can shift.',
    relatedProjectId: 'prj-002',
    relatedPropertyIds: ['prop-005'],
    agentId: 'ag-003',
    status: 'published',
    publishedAt: '2026-09-28',
    createdAt: '2026-09-20',
    updatedAt: '2026-09-28',
    rejectionReason: '',
  },
  {
    id: 'rec-004',
    title: 'Lahore Gulberg Commercial: Retail vs Office Demand',
    category: 'High-Demand Locations',
    city: 'Lahore',
    location: 'Main Boulevard Gulberg',
    projectType: 'Commercial',
    projectStatus: 'Under Construction',
    demandLevel: 'High',
    expectedLaunch: '2026-08-01',
    priceMin: 15_000_000,
    priceMax: 35_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Gulberg frontage retail still outpaces upper-floor offices on footfall-driven demand, while full-payment buyers negotiate stronger early-handover terms.',
    whyRecommend:
      'Prime boulevard addresses remain scarce. Clients who can settle early often secure better fit-out windows than instalment buyers.',
    marketInsights:
      'Ground-floor shops absorb faster. Offices lease more slowly unless parking ratios are strong.',
    futureProspects:
      'Limited new boulevard frontage suggests rents stay firm for well-managed retail podiums.',
    projectOverview:
      'Commercial tower with retail podium and upper-floor offices on Gulberg Main Boulevard.',
    agentOpinionNote:
      'Market commentary from agency deal flow — not a rental guarantee.',
    relatedProjectId: 'prj-007',
    relatedPropertyIds: ['prop-007', 'prop-002'],
    agentId: 'ag-002',
    status: 'published',
    publishedAt: '2026-10-05',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-05',
    rejectionReason: '',
  },
  {
    id: 'rec-005',
    title: 'Gwadar Pre-Launch Plots: Patience Required',
    category: 'Market Insights',
    city: 'Gwadar',
    location: 'New Gwadar City',
    projectType: 'Plots',
    projectStatus: 'Pre-Launch',
    demandLevel: 'Emerging',
    expectedLaunch: '2027-01-01',
    priceMin: 2_000_000,
    priceMax: 6_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Pre-launch Gwadar inventory suits speculative investors with long horizons — not buyers needing near-term possession or rental yield.',
    whyRecommend:
      'Entry tickets are still accessible, but we only introduce clients who accept multi-year uncertainty and verify developer paperwork carefully.',
    marketInsights:
      'Enquiry is curiosity-led more than conversion-led. Conversion improves when payment plans stretch beyond 48 months.',
    futureProspects:
      'Upside depends on city-grid delivery. Treat this as an emerging, higher-risk pocket.',
    projectOverview:
      'Pre-launch mixed residential/commercial plot society targeting first-time coastal investors.',
    agentOpinionNote:
      'Emerging-market opinion. Facts and NOCs must be verified before booking.',
    relatedProjectId: 'prj-005',
    relatedPropertyIds: [],
    agentId: 'ag-009',
    status: 'published',
    publishedAt: '2026-09-15',
    createdAt: '2026-09-10',
    updatedAt: '2026-09-15',
    rejectionReason: '',
  },
  {
    id: 'rec-006',
    title: 'Park View City Hills Estate for Half-Yearly Buyers',
    category: 'Upcoming Projects',
    city: 'Lahore',
    location: 'Malot Road',
    projectType: 'Residential',
    projectStatus: 'Upcoming',
    demandLevel: 'Medium',
    expectedLaunch: '2026-11-01',
    priceMin: 6_500_000,
    priceMax: 15_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Half-yearly instalments are attracting salaried buyers who find monthly plot payments harder to cash-flow.',
    whyRecommend:
      'Payment comfort plus hill-facing blocks give a clearer pitch than generic ring-road societies at a similar ticket.',
    marketInsights:
      '5 Marla leads volume; park-facing asks a premium that still clears when documents are clean.',
    futureProspects:
      'Absorption should track Lahore’s outer-ring infra. Watch development charge clarity at booking.',
    projectOverview:
      'Residential estate with plot and apartment options under a half-yearly payment structure.',
    agentOpinionNote:
      'Agency recommendation based on recent shortlists — confirm developer schedule separately.',
    relatedProjectId: 'prj-004',
    relatedPropertyIds: ['prop-008', 'prop-002'],
    agentId: 'ag-002',
    status: 'published',
    publishedAt: '2026-10-22',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-22',
    rejectionReason: '',
  },
  {
    id: 'rec-007',
    title: 'Bahria Karachi Sector A: End-User Villa Demand',
    category: 'Trending Projects',
    city: 'Karachi',
    location: 'Super Highway / Bahria Town',
    projectType: 'Residential',
    projectStatus: 'Booking Open',
    demandLevel: 'High',
    expectedLaunch: '2026-05-01',
    priceMin: 8_500_000,
    priceMax: 32_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'End-users wanting community amenities before possession continue to prefer Sector A villa plots over raw land on the same corridor.',
    whyRecommend:
      'Club access, boulevard planning and a familiar brand reduce diligence friction for families relocating within Karachi.',
    marketInsights:
      '120–200 Sq. Yd villa plots clear faster than larger 500 Sq. Yd tickets.',
    futureProspects:
      'Mature community services should support livability premiums vs newer highway societies.',
    projectOverview:
      'Villa-focused residential sector inside Bahria Town Karachi with booking still open on select sizes.',
    agentOpinionNote:
      'Opinion from recent family-buyer consultations. Always reconfirm development charges.',
    relatedProjectId: 'prj-003',
    relatedPropertyIds: ['prop-001'],
    agentId: 'ag-001',
    status: 'published',
    publishedAt: '2026-10-01',
    createdAt: '2026-09-25',
    updatedAt: '2026-10-01',
    rejectionReason: '',
  },
  {
    id: 'rec-008',
    title: 'Islamabad Waterfront Living: Kingdom Valley Snapshot',
    category: 'Investment Opportunities',
    city: 'Islamabad',
    location: 'Islamabad Expressway',
    projectType: 'Residential',
    projectStatus: 'Under Construction',
    demandLevel: 'Medium',
    expectedLaunch: '2026-03-01',
    priceMin: 4_500_000,
    priceMax: 20_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
    ],
    description:
      'Waterfront-facing apartments and villa plots appeal to buyers who want lifestyle amenities with a 48-month instalment runway.',
    whyRecommend:
      'Clear booking + confirmation structure and gated planning make conversations with first-time Islamabad buyers easier.',
    marketInsights:
      'Apartment tickets lead volume; villa plots attract higher-budget end-users.',
    futureProspects:
      'Lifestyle amenities should support occupancy once possession windows open in late 2027–2028.',
    projectOverview:
      'Gated residential enclave with apartments, villas and residential plots along Islamabad Expressway.',
    agentOpinionNote:
      'Agency insight only. Possession dates remain developer-dependent.',
    relatedProjectId: 'prj-001',
    relatedPropertyIds: ['prop-004'],
    agentId: 'ag-003',
    status: 'published',
    publishedAt: '2026-10-09',
    createdAt: '2026-10-04',
    updatedAt: '2026-10-09',
    rejectionReason: '',
  },
  /* Agency / admin moderation samples */
  {
    id: 'rec-101',
    title: 'Draft: Rawalpindi Askari Apartment Yield Notes',
    category: 'Market Insights',
    city: 'Rawalpindi',
    location: 'Askari Towers',
    projectType: 'Apartments',
    projectStatus: 'Ready',
    demandLevel: 'Medium',
    expectedLaunch: '',
    priceMin: 80_000,
    priceMax: 180_000,
    coverImage:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
    ],
    description: 'Working draft on rental yields for furnished Askari apartments.',
    whyRecommend: 'Stable tenant demand from officers and corporate staff.',
    marketInsights: '3-bed furnished units lease faster than unfurnished.',
    futureProspects: 'Yields may compress if new supply arrives nearby.',
    projectOverview: 'Established residential towers with steady rental enquiry.',
    agentOpinionNote: 'Draft — not published.',
    relatedProjectId: '',
    relatedPropertyIds: ['prop-005'],
    agentId: 'ag-004',
    status: 'draft',
    publishedAt: '',
    createdAt: '2026-10-25',
    updatedAt: '2026-10-26',
    rejectionReason: '',
  },
  {
    id: 'rec-102',
    title: 'Pending: Blue World City Awami Villa Waitlist',
    category: 'Upcoming Projects',
    city: 'Rawalpindi',
    location: 'Chakri Interchange',
    projectType: 'Residential',
    projectStatus: 'Coming Soon',
    demandLevel: 'Emerging',
    expectedLaunch: '2026-09-01',
    priceMin: 3_000_000,
    priceMax: 5_500_000,
    coverImage:
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80',
    ],
    description: 'Affordable villa waitlist interest ahead of formal booking.',
    whyRecommend: 'Useful for first-time buyers priced out of DHA tickets.',
    marketInsights: 'Waitlist sign-ups rose after the last open house.',
    futureProspects: 'Conversion depends on final payment plan clarity.',
    projectOverview: 'Upcoming affordable villa product near Chakri Interchange.',
    agentOpinionNote: 'Submitted for portal review.',
    relatedProjectId: 'prj-006',
    relatedPropertyIds: [],
    agentId: 'ag-004',
    status: 'pending',
    publishedAt: '',
    createdAt: '2026-10-27',
    updatedAt: '2026-10-27',
    rejectionReason: '',
  },
  {
    id: 'rec-103',
    title: 'Changes Requested: Faisalabad 5 Marla Investor Note',
    category: 'Investment Opportunities',
    city: 'Faisalabad',
    location: 'Gulberg Residencia',
    projectType: 'Residential',
    projectStatus: 'Booking Open',
    demandLevel: 'Medium',
    expectedLaunch: '2026-07-01',
    priceMin: 8_000_000,
    priceMax: 14_000_000,
    coverImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    ],
    description: 'Investor note on 5 Marla homes in Gulberg Residencia.',
    whyRecommend: 'End-user demand supports resale liquidity.',
    marketInsights: 'Needs clearer comparable sales table.',
    futureProspects: 'Stable if industrial employment stays firm.',
    projectOverview: 'Established housing society with family home inventory.',
    agentOpinionNote: 'Admin requested stronger comps before approval.',
    relatedProjectId: '',
    relatedPropertyIds: ['prop-006'],
    agentId: 'ag-005',
    status: 'changes_requested',
    publishedAt: '',
    createdAt: '2026-10-20',
    updatedAt: '2026-10-24',
    rejectionReason: 'Please add recent comparable sale prices and clarify possession timeline.',
  },
]

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(SEED)
    return JSON.parse(raw)
  } catch {
    return structuredClone(SEED)
  }
}

function writeStore(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getAllRecommendations() {
  return readStore()
}

export function getPublishedRecommendations() {
  return readStore()
    .filter((item) => item.status === 'published')
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
}

export function getRecommendationById(id) {
  return readStore().find((item) => item.id === id)
}

export function getRecommendationsByAgent(agentId) {
  return readStore()
    .filter((item) => item.agentId === agentId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function getPendingRecommendations() {
  return readStore()
    .filter((item) => item.status === 'pending' || item.status === 'changes_requested')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function getRelatedRecommendations(id, limit = 3) {
  const current = getRecommendationById(id)
  if (!current) return []
  return getPublishedRecommendations()
    .filter((item) => item.id !== id)
    .filter((item) => item.category === current.category || item.city === current.city)
    .slice(0, limit)
}

export function hydrateRecommendation(rec) {
  if (!rec) return null
  return {
    ...rec,
    agent: agentBrief(rec.agentId),
    relatedProject: rec.relatedProjectId ? projectBrief(rec.relatedProjectId) : null,
    relatedProperties: (rec.relatedPropertyIds ?? [])
      .map((propertyId) => freshProperties.find((property) => property.id === propertyId))
      .filter(Boolean),
  }
}

export function upsertRecommendation(payload) {
  const list = readStore()
  const index = list.findIndex((item) => item.id === payload.id)
  if (index >= 0) list[index] = { ...list[index], ...payload }
  else list.unshift(payload)
  writeStore(list)
  return payload
}

export function deleteRecommendation(id) {
  writeStore(readStore().filter((item) => item.id !== id))
}

export function updateRecommendationStatus(id, status, rejectionReason = '') {
  const list = readStore()
  const index = list.findIndex((item) => item.id === id)
  if (index < 0) return null
  const now = new Date().toISOString().slice(0, 10)
  list[index] = {
    ...list[index],
    status,
    rejectionReason,
    updatedAt: now,
    publishedAt: status === 'published' ? now : list[index].publishedAt,
  }
  writeStore(list)
  return list[index]
}

export function createRecommendationId() {
  return `rec-${Date.now()}`
}

/** Demo agency session — Raza Estates (matches session.DEMO_AGENCY_ID). */
export const DEMO_AGENCY_AGENT_ID = 'ag-001'

const SAVED_KEY = 'makaan-saved-recommendations'

export function getSavedRecommendationIds() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
  } catch {
    return []
  }
}

export function toggleSavedRecommendation(id) {
  const current = getSavedRecommendationIds()
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  localStorage.setItem(SAVED_KEY, JSON.stringify(next))
  return next
}
