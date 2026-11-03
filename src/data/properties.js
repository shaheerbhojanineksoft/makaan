/**
 * Dummy data for the "Freshly Added Properties" section.
 * Shape mirrors `GET /api/properties?sort=newest&limit=8`.
 * `purpose` is 'sale' | 'rent'.
 */
export const freshProperties = [
  {
    id: 'prop-001',
    title: 'Brand New 300 Sq. Yd Villa',
    location: 'DHA Phase 8, Karachi',
    city: 'Karachi',
    purpose: 'sale',
    propertyType: 'Villa',
    price: 95000000,
    beds: 6,
    baths: 7,
    area: '300 Sq. Yd',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    listedAt: '2026-10-02T09:00:00Z',
    description:
      'A spacious, newly built villa in DHA Phase 8, designed for comfortable family living with generous bedrooms, multiple bathrooms and a 300 Sq. Yd footprint.',
    agentId: 'ag-001',
    highlights: [
      'Brand-new villa in DHA Phase 8',
      'Six bedrooms and seven bathrooms',
      '300 Sq. Yd residential area',
      'Listed for sale in Karachi',
    ],
    agent: {
      name: 'Ahmed Raza',
      agency: 'Raza Estates & Builders',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    id: 'prop-002',
    title: 'Luxury 10 Marla Designer House',
    location: 'Bahria Town, Lahore',
    city: 'Lahore',
    purpose: 'sale',
    propertyType: 'House',
    price: 43500000,
    beds: 5,
    baths: 6,
    area: '10 Marla',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    listedAt: '2026-10-01T11:30:00Z',
    description:
      'A designer 10 Marla home in Bahria Town, Lahore, with five bedrooms and spacious family areas in a well-connected residential community.',
    agentId: 'ag-002',
    highlights: [
      'Designer home in Bahria Town',
      'Five bedrooms and six bathrooms',
      '10 Marla residential area',
      'Listed for sale in Lahore',
    ],
    agent: {
      name: 'Fatima Malik',
      agency: 'Malik Property Hub',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
  {
    id: 'prop-003',
    title: 'Sea-Facing 3 Bed Luxury Apartment',
    location: 'Emaar Crescent Bay, Karachi',
    city: 'Karachi',
    purpose: 'rent',
    propertyType: 'Apartment',
    price: 450000,
    beds: 3,
    baths: 4,
    area: '2,400 Sq. Ft',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
    listedAt: '2026-09-30T08:15:00Z',
    description:
      'A sea-facing three-bedroom apartment at Emaar Crescent Bay, offering 2,400 Sq. Ft of living space and four bathrooms for rent.',
    agentId: 'ag-006',
    highlights: [
      'Sea-facing apartment at Emaar Crescent Bay',
      'Three bedrooms and four bathrooms',
      '2,400 Sq. Ft of living space',
      'Available for rent in Karachi',
    ],
    agent: {
      name: 'Hina Khan',
      agency: 'Zameen Link Realty',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
  },
  {
    id: 'prop-004',
    title: 'Newly Built 1 Kanal Modern House',
    location: 'DHA Phase 5, Islamabad',
    city: 'Islamabad',
    purpose: 'sale',
    propertyType: 'House',
    price: 78500000,
    beds: 6,
    baths: 7,
    area: '1 Kanal',
    image:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
    listedAt: '2026-09-29T14:45:00Z',
    description:
      'A newly built modern house in DHA Phase 5, Islamabad, set on a 1 Kanal plot with six bedrooms and generous family space.',
    agentId: 'ag-003',
    highlights: [
      'Newly built modern house in DHA Phase 5',
      'Six bedrooms and seven bathrooms',
      '1 Kanal residential area',
      'Listed for sale in Islamabad',
    ],
    agent: {
      name: 'Bilal Hussain',
      agency: 'Hussain Builders & Estate',
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    },
  },
  {
    id: 'prop-005',
    title: 'Family Flat with Lift & Parking',
    location: 'Askari Towers, Rawalpindi',
    city: 'Rawalpindi',
    purpose: 'rent',
    propertyType: 'Apartment',
    price: 145000,
    beds: 3,
    baths: 3,
    area: '1,650 Sq. Ft',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    listedAt: '2026-09-28T10:00:00Z',
    description:
      'A family-friendly flat at Askari Towers, Rawalpindi, with lift access, parking, three bedrooms and 1,650 Sq. Ft of space.',
    agentId: 'ag-004',
    highlights: [
      'Located at Askari Towers',
      'Lift access and parking',
      'Three bedrooms and three bathrooms',
      'Available for rent in Rawalpindi',
    ],
    agent: {
      name: 'Ayesha Siddiqui',
      agency: 'SRS Realtors',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
  },
  {
    id: 'prop-006',
    title: 'Corner 5 Marla Double-Storey Home',
    location: 'Gulberg Residencia, Faisalabad',
    city: 'Faisalabad',
    purpose: 'sale',
    propertyType: 'House',
    price: 19800000,
    beds: 4,
    baths: 5,
    area: '5 Marla',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    listedAt: '2026-09-27T16:20:00Z',
    description:
      'A corner double-storey home in Gulberg Residencia, Faisalabad, with four bedrooms and a 5 Marla residential area.',
    agentId: 'ag-005',
    highlights: [
      'Corner double-storey home',
      'Four bedrooms and five bathrooms',
      '5 Marla residential area',
      'Listed for sale in Faisalabad',
    ],
    agent: {
      name: 'Usman Tariq',
      agency: 'Tariq Associates',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
  },
  {
    id: 'prop-007',
    title: 'Furnished Commercial Office Floor',
    location: 'Business District, Multan',
    city: 'Multan',
    purpose: 'rent',
    propertyType: 'Commercial Office',
    price: 325000,
    beds: 0,
    baths: 2,
    area: '3,000 Sq. Ft',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    listedAt: '2026-09-26T09:10:00Z',
    description:
      'A furnished commercial office floor in Multan’s Business District, offering 3,000 Sq. Ft of workspace and two bathrooms for rent.',
    agentId: 'ag-007',
    highlights: [
      'Furnished commercial office floor',
      'Located in Multan Business District',
      '3,000 Sq. Ft of workspace',
      'Available for rent',
    ],
    agent: {
      name: 'Saad Iqbal',
      agency: 'Iqbal Estate Advisors',
      avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    },
  },
  {
    id: 'prop-008',
    title: 'Farm House with Orchard & Pool',
    location: 'Bedian Road, Lahore',
    city: 'Lahore',
    purpose: 'sale',
    propertyType: 'Farm House',
    price: 132000000,
    beds: 5,
    baths: 6,
    area: '4 Kanal',
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    listedAt: '2026-09-25T12:00:00Z',
    description:
      'A farmhouse on Bedian Road, Lahore, with an orchard, pool and 4 Kanal of land, offering a spacious setting for country living.',
    agentId: 'ag-008',
    highlights: [
      'Farmhouse with orchard and pool',
      'Located on Bedian Road, Lahore',
      '4 Kanal of land',
      'Listed for sale',
    ],
    agent: {
      name: 'Zainab Ahmed',
      agency: 'Ahmed Homes & Co.',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    },
  },
]

export function getPropertyById(id) {
  return freshProperties.find((property) => property.id === id)
}

export function getOtherProperties(id, limit = 3) {
  return freshProperties.filter((property) => property.id !== id).slice(0, limit)
}
