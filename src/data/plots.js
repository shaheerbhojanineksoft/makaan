/**
 * Dummy data for the "Exclusive Featured Plots" section and the plot detail
 * screen (`/plots/:id`).
 *
 * Shape mirrors `GET /api/plots?featured=true`, extended with the marketing
 * copy, specification, document and agency fields the detail screen renders.
 * `plotType` accepts 'Residential' | 'Commercial' | 'Farmhouse' and `agentId`
 * points at the verified agency in `src/data/agents.js` that answers enquiries
 * for the plot.
 */
export const featuredPlots = [
  {
    id: 'plot-001',
    title: 'Prime Corner Kanal Plot — Sector J',
    location: 'DHA Phase 6, Karachi',
    city: 'Karachi',
    size: '1 Kanal',
    plotType: 'Residential',
    price: 65000000,
    pricePerUnit: 'PKR 130,000 / Sq. Yd',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
    tags: ['Corner', 'Possession'],
    agentId: 'ag-001',
    plotNumber: 'Plot 412-J',
    block: 'Sector J',
    dimensions: "90' x 50'",
    possession: 'Possession granted',
    ownership: 'Original allotment file in the seller name',
    developmentCharges: 'Fully cleared',
    verifiedOn: '2026-09-20',
    listedOn: '2026-09-18',
    updatedOn: '2026-10-09',
    description:
      'A true corner plot in the settled part of DHA Phase 6, with 50 ft and 90 ft road frontage on two sides and an open view across the sector green belt. All development charges and utility dues are cleared, and the file transfers directly from the original allottee, so construction can start as soon as the transfer is signed.',
    highlights: [
      'Corner plot with access from two streets',
      'Open green-belt view on the northern boundary',
      'Development and utility dues fully cleared',
      'Immediate possession with transfer-ready documents',
    ],
    features: [
      'Carpeted roads with street lighting',
      'Underground electrification',
      'Sui gas pipeline available',
      'Boundary wall ready for construction',
      'Gated sector with 24/7 security',
      'Green belts on both streets',
    ],
    nearby: [
      { label: 'Sector J Park', distance: '300 m' },
      { label: 'Main Boulevard', distance: '450 m' },
      { label: 'Ittehad Commercial Area', distance: '1.1 km' },
      { label: 'DHA Montessori and School', distance: '700 m' },
    ],
    documents: [
      'Original allotment file',
      'No-dues certificate',
      'Transfer letter format',
      'Demarcation and site report',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'plot-002',
    title: 'Overseas Block Plot — Near Main Boulevard',
    location: 'Bahria Town, Lahore',
    city: 'Lahore',
    size: '10 Marla',
    plotType: 'Residential',
    price: 28500000,
    pricePerUnit: 'PKR 71,250 / Sq. Yd',
    image:
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=900&q=80',
    tags: ['Overseas', 'On Ground'],
    agentId: 'ag-002',
    plotNumber: 'Plot 1187-C',
    block: 'Overseas Block, Sector C',
    dimensions: "35' x 70'",
    possession: 'Possession granted',
    ownership: 'Transferred to the current owner in 2023',
    developmentCharges: 'Fully cleared',
    verifiedOn: '2026-09-26',
    listedOn: '2026-09-24',
    updatedOn: '2026-10-06',
    description:
      'Two streets behind the main boulevard in the Overseas Block, this 10 Marla plot pairs a quiet residential setting with quick access to the commercial market. The plot is on ground with a low boundary wall in place, and the file has already been transferred into the current owner name, keeping the sale process short.',
    highlights: [
      'Two streets from the main boulevard',
      'On ground with boundary wall in place',
      'Water and sewerage lines already laid',
      '35 ft frontage, ideal for a modern house plan',
    ],
    features: [
      'Carpeted roads and street lights',
      'Sui gas and water connections',
      'Community mosque within walking distance',
      'Gated block with round-the-clock security',
      'Landscaped green belts',
      'Sewerage and drainage on the street',
    ],
    nearby: [
      { label: 'Main Boulevard', distance: '400 m' },
      { label: 'Overseas Block Commercial Market', distance: '650 m' },
      { label: 'Bahria Town Grand Mosque', distance: '500 m' },
      { label: 'International Hospital', distance: '2.4 km' },
    ],
    documents: [
      'Transfer letter in owner name',
      'Allotment file copy',
      'No-dues certificate',
      'Approved site plan',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'plot-003',
    title: 'Park-Facing Plot — Sector C',
    location: 'DHA Phase 2, Islamabad',
    city: 'Islamabad',
    size: '5 Marla',
    plotType: 'Residential',
    price: 21000000,
    pricePerUnit: 'PKR 105,000 / Sq. Yd',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    tags: ['Park Facing'],
    agentId: 'ag-004',
    plotNumber: 'Plot 76-C',
    block: 'Sector C',
    dimensions: "25' x 50'",
    possession: 'Possession granted',
    ownership: 'Allotment letter in owner name',
    developmentCharges: 'Fully cleared',
    verifiedOn: '2026-09-15',
    listedOn: '2026-09-12',
    updatedOn: '2026-10-04',
    description:
      'A park-facing 5 Marla plot on a fully developed street, with nothing built on the land behind it so the open outlook stays. Suited to a compact family home or a patient long-hold investment, the plot is in the established Sector C of DHA Phase 2 and comes with all utilities already on the street.',
    highlights: [
      'Park-facing with no construction to the rear',
      'Fully developed street, utilities in place',
      'Approved for a 5 Marla residential build',
      'Strong resale demand across Sector C',
    ],
    features: [
      'Water supply on the street',
      'Sui gas connection available',
      'Underground electricity',
      'Motorable 25 ft street frontage',
      'Street lighting and paved walkways',
      'Park and playground next door',
    ],
    nearby: [
      { label: 'Sector C Park', distance: '50 m' },
      { label: 'DHA Phase 2 Main Entrance', distance: '1.3 km' },
      { label: 'Commercial Market', distance: '900 m' },
      { label: 'Islamabad Expressway', distance: '3.2 km' },
    ],
    documents: [
      'Allotment letter',
      'No-dues certificate',
      'Transfer order format',
      'Site demarcation plan',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'plot-004',
    title: 'Commercial Boulevard Plot',
    location: 'Gulberg Greens, Islamabad',
    city: 'Islamabad',
    size: '2 Kanal',
    plotType: 'Commercial',
    price: 115000000,
    pricePerUnit: 'PKR 115,000 / Sq. Yd',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80',
    tags: ['Commercial', 'High ROI'],
    agentId: 'ag-003',
    plotNumber: 'Plot 24-B',
    block: 'Boulevard Block',
    dimensions: "120' x 75'",
    possession: 'Possession granted',
    ownership: 'Single owner, already transferred',
    developmentCharges: 'Fully cleared',
    verifiedOn: '2026-09-03',
    listedOn: '2026-08-30',
    updatedOn: '2026-10-02',
    description:
      'A 2 Kanal commercial plot on the main boulevard of Gulberg Greens, zoned for a multi-storey plaza, clinic or restaurant. The 120 ft frontage faces the boulevard traffic directly, the plot is already transferred with all dues cleared, and the depth comfortably supports a basement level.',
    highlights: [
      '120 ft frontage on the main boulevard',
      'Zoned for commercial construction',
      'High traffic count on both carriageways',
      'Depth suited to a basement level development',
    ],
    features: [
      'Approved commercial zoning',
      'Utility services available on the street',
      'Ample client parking in front',
      'Access from the service road as well',
      'Gated society with 24/7 security',
      'Well-lit boulevard with median plantation',
    ],
    nearby: [
      { label: 'Gulberg Greens Main Entrance', distance: '1.2 km' },
      { label: 'Islamabad Expressway', distance: '2.5 km' },
      { label: 'Farmhouse Commercial Belt', distance: '800 m' },
      { label: 'CBR Town Interchange', distance: '3.4 km' },
    ],
    documents: [
      'Transfer letter in owner name',
      'Commercial zoning approval',
      'No-dues certificate',
      'Approved building plan guidelines',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'plot-005',
    title: 'Lakeside Residential Plot',
    location: 'Bahria Orchard, Lahore',
    city: 'Lahore',
    size: '1 Kanal',
    plotType: 'Residential',
    price: 42000000,
    pricePerUnit: 'PKR 84,000 / Sq. Yd',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    tags: ['Lakeside', 'Investor Deal'],
    agentId: 'ag-002',
    plotNumber: 'Plot 903-A',
    block: 'Lakeside Block, Sector B',
    dimensions: "90' x 55'",
    possession: 'Possession granted',
    ownership: 'Complete file, ready for transfer',
    developmentCharges: 'Fully cleared',
    verifiedOn: '2026-09-09',
    listedOn: '2026-09-05',
    updatedOn: '2026-09-28',
    description:
      'One of the last unsold Kanal plots on the lakeside belt of Bahria Orchard, looking straight over the water towards the jogging track. The plot is on ground with a low boundary wall, sits on a fully developed street, and the file is complete and ready for an immediate transfer.',
    highlights: [
      'Unobstructed view over the lake',
      'Jogging track and open park next door',
      'On ground with a low boundary wall',
      'Consistent price growth across the lakeside belt',
    ],
    features: [
      'Water and Sui gas connections',
      'Carpeted roads with street lighting',
      'Lakeside walking and jogging track',
      'Gated society with 24/7 security',
      'Commercial market within 1 km',
      'Sewerage and drainage in place',
    ],
    nearby: [
      { label: 'Bahria Orchard Lake', distance: '120 m' },
      { label: 'Lakeside Jogging Track', distance: '150 m' },
      { label: 'Sector B Commercial Market', distance: '950 m' },
      { label: 'Main Orchard Boulevard', distance: '1.6 km' },
    ],
    documents: [
      'Complete allotment file',
      'Transfer letter format',
      'No-dues certificate',
      'Approved site plan',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'plot-006',
    title: 'Gwadar Free Zone Investment Plot',
    location: 'Gwadar New City, Gwadar',
    city: 'Gwadar',
    size: '120 Sq. Yd',
    plotType: 'Commercial',
    price: 8500000,
    pricePerUnit: 'PKR 70,833 / Sq. Yd',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
    tags: ['CPEC', 'Free Zone'],
    agentId: 'ag-009',
    plotNumber: 'Plot 55-C',
    block: 'Free Zone Commercial Belt',
    dimensions: "30' x 36'",
    possession: 'Balloted, possession file issued',
    ownership: 'Allotment file in owner name',
    developmentCharges: 'Paid in full',
    verifiedOn: '2026-08-26',
    listedOn: '2026-08-22',
    updatedOn: '2026-09-30',
    description:
      'A compact 120 Sq. Yd commercial plot inside the notified Free Zone commercial belt of New Gwadar City, with a 30 ft road frontage. Positioned for CPEC-driven commercial demand, the file is fully paid up and available for immediate transfer to local or overseas buyers.',
    highlights: [
      'Inside the notified Free Zone commercial belt',
      'CPEC corridor investment with a long horizon',
      'All dues paid, transfer-ready file',
      'Direct entry from the Free Zone main road',
    ],
    features: [
      'Main road frontage',
      'Planned water and power infrastructure',
      'Declared commercial land use',
      'Security-controlled zone with checkpoints',
      'Close to the Gwadar Port approach road',
      'Metalled internal roads',
    ],
    nearby: [
      { label: 'Gwadar Port Approach Road', distance: '1.4 km' },
      { label: 'Free Zone Main Gate', distance: '600 m' },
      { label: 'New Gwadar International Airport', distance: '22 km' },
      { label: 'Marine Drive', distance: '3.1 km' },
    ],
    documents: [
      'Allotment file and ballot slip',
      'Payment and dues receipts',
      'Possession file',
      'Transfer application guidelines',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
  },
]

/**
 * Looks up a single featured plot by id — the data source for the `/plots/:id`
 * detail screen. Returns `undefined` when the id is unknown so the screen can
 * render its own not-found state.
 */
export function getPlotById(id) {
  const base = featuredPlots.find((plot) => plot.id === id)
  if (typeof window === 'undefined') return base
  try {
    const all = JSON.parse(localStorage.getItem('makan-agency-listings-v1') || '{}')
    for (const list of Object.values(all)) {
      const match = (list || []).find((item) => item.id === id && item.kind === 'plot')
      if (match) {
        if (match.disabled) return undefined
        return {
          id: match.id,
          title: match.title,
          location: match.location,
          city: match.city,
          size: match.area || match.size,
          plotType: match.plotType || 'Residential',
          price: match.price,
          pricePerUnit: match.pricePerUnit || '',
          image: match.image,
          tags: match.tags || [],
          agentId: match.agentId,
          description: match.description,
          highlights: match.highlights || [],
          listedOn: match.listedAt,
          updatedOn: match.updatedAt || match.listedAt,
        }
      }
    }
  } catch {
    /* ignore */
  }
  return base
}

/**
 * The plots shown in the "Explore More Plots" rail beneath a detail screen.
 * Excludes the plot currently being viewed and wraps around the inventory so
 * the rail keeps a consistent length on smaller data sets.
 */
export function getOtherPlots(id, limit = 3) {
  const others = featuredPlots.filter((plot) => plot.id !== id)
  const count = Math.min(limit, others.length)

  return Array.from({ length: count }, (_, index) => others[index % others.length])
}
