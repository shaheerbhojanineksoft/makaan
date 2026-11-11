/**
 * Trusted property lawyers listed on `/trusted-lawyers`.
 */

export const LAWYERS = [
  {
    id: 'law-001',
    name: 'Adv. Sara Khan',
    city: 'Karachi',
    phone: '+922134560101',
    whatsapp: '03232910307',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    specialty: 'Title verification & society transfers',
    bio: `Karachi property lawyer with 12+ years helping first-time buyers and overseas Pakistanis verify ownership, society NOCs and transfer files before payment. Reviews title chain, dues and POA papers in plain language, and guides renters on deposit and notice clauses. Call or WhatsApp to share document photos for a quick risk check.`,
  },
  {
    id: 'law-002',
    name: 'Adv. Bilal Ahmed',
    city: 'Lahore',
    phone: '+924235670202',
    whatsapp: '03232910307',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    specialty: 'Plot disputes & registry checks',
    bio: `Lahore-based lawyer focused on plot verification, registry coordination and early dispute detection across Gulberg, DHA and Johar Town. Helps confirm seller authority, dues clearance and registry paperwork before bayana. Also reviews rent agreements for shops and homes. Reach by call or WhatsApp for a fast document check.`,
  },
  {
    id: 'law-003',
    name: 'Adv. Hina Malik',
    city: 'Islamabad',
    phone: '+925128760303',
    whatsapp: '03232910307',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    specialty: 'Apartment allotments & POA review',
    bio: `Islamabad lawyer for apartment allotments, possession papers and power-of-attorney deals involving overseas buyers. Checks allotment letters, developer NOCs and POA scope so clients do not sign vague authority. Also guides renters on inventory and meter clauses. Contact by call or WhatsApp with document scans.`,
  },
  {
    id: 'law-004',
    name: 'Adv. Usman Raza',
    city: 'Rawalpindi',
    phone: '+925158760404',
    whatsapp: '03232910307',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    specialty: 'Rent agreements & deposit protection',
    bio: `Rawalpindi lawyer known for clear rent agreements and deposit protection for tenants and landlords. Covers rent, notice, utilities and damage deductions in writing, and advises photo meter readings on move-in. Also gives second opinions on local transfer files. Call or WhatsApp before paying advance.`,
  },
  {
    id: 'law-005',
    name: 'Adv. Ayesha Siddiqui',
    city: 'Karachi',
    phone: '+922134560505',
    whatsapp: '03232910307',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    specialty: 'Commercial property & due diligence',
    bio: `Karachi commercial due-diligence lawyer for shops, offices and premium homes. Reviews landlord authority, lease terms, parking/fit-out rules and sale title risks before money moves. Flags rushed cash deals and incomplete NOCs early. Available on call and WhatsApp for a structured first risk note.`,
  },
  {
    id: 'law-006',
    name: 'Adv. Hamza Sheikh',
    city: 'Lahore',
    phone: '+924235670606',
    whatsapp: '03232910307',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    specialty: 'First-time buyer advisory',
    bio: `Lahore advisor for first-time buyers who need a simple checklist more than complex theory. Explains what to ask sellers, how to word token/bayana, and when to pause a rushed deal. Helps spot mismatched papers and unpaid dues before non-refundable payment. Call or WhatsApp with basic questions anytime.`,
  },
  {
    id: 'law-007',
    name: 'Adv. Nadia Rehman',
    city: 'Islamabad',
    phone: '+925128760707',
    whatsapp: '03232910307',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    specialty: 'Fraud-risk screening & document audit',
    bio: `Islamabad lawyer focused on fraud-risk screening for online property deals. Checks identity consistency, payment authority and fake-document red flags before token. Gives clear green/yellow/stop signals so clients can proceed or walk away. Reach quickly by call or WhatsApp when a listing feels off.`,
  },
  {
    id: 'law-008',
    name: 'Adv. Omar Farooq',
    city: 'Multan',
    phone: '+926128760808',
    whatsapp: '03232910307',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    specialty: 'Local transfers & family property',
    bio: `Multan property lawyer for residential transfers and family ownership paperwork. Helps confirm all co-owners are properly represented and that receipts, identity and dues files are complete before signing. Also supports fair written rent terms. Contact by call or WhatsApp for a local document check.`,
  },
]

export function getLawyerCities() {
  return [...new Set(LAWYERS.map((lawyer) => lawyer.city))].sort()
}

export function getLawyersByCity(city) {
  if (!city || city === 'All') return LAWYERS
  return LAWYERS.filter((lawyer) => lawyer.city === city)
}
