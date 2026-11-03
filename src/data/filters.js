/**
 * Search filter option sets for the HeroSearch component.
 * Swap these arrays for values fetched from your Node.js backend
 * (e.g. GET /api/meta/cities) without changing any component code.
 */

export const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gwadar',
  'Hyderabad',
  'Sialkot',
  'Bahawalpur',
]

export const PROPERTY_TYPES = [
  'House',
  'Flat / Apartment',
  'Residential Plot',
  'Commercial Plot',
  'Farm House',
  'Shop',
  'Office',
  'Building',
]

export const PROJECT_TYPES = [
  'Residential Project',
  'Commercial Project',
  'Mixed-Use Project',
  'Farmhouse Project',
  'Overseas Block',
]

/** Slider bounds + defaults per search tab. */
export const PRICE = {
  buy: { min: 2_000_000, max: 500_000_000, step: 1_000_000, defaultValue: 50_000_000 },
  rent: { min: 10_000, max: 1_000_000, step: 5_000, defaultValue: 150_000 },
  booking: { min: 500_000, max: 200_000_000, step: 500_000, defaultValue: 20_000_000 },
}

export const SORT_OPTIONS = ['Newest First', 'Price: Low to High', 'Price: High to Low', 'Most Popular']
