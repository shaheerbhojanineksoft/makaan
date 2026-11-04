/**
 * Global site configuration.
 *
 * `heroImage` is a branded marketplace illustration (homes, villas, plots)
 * stored locally under /public — tuned to the deep-forest green theme.
 */
export const SITE = {
  name: 'Makaan',
  shortName: 'Makaan',
  tagline: 'Pakistan ka Apna Trusted Property Portal',
  heroImage: '/hero-marketplace.jpg',
  supportPhone: '+92 21 111 000 111',
  supportEmail: 'help@pakistanpropertyportal.pk',
  offices: ['Karachi', 'Lahore', 'Islamabad'],
}

/**
 * Demo logged-in seeker — swap for real session/user API later.
 */
export const CURRENT_USER = {
  id: 'user-demo-001',
  name: 'Ali Hassan',
  email: 'ali.hassan@email.com',
  phone: '+92 300 1234567',
  avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
}

/**
 * Contact Us page configuration — single source of truth for the support
 * channels, office address and business hours shown on /contact.
 *
 * `whatsapp` is the international wa.me number in digits only. `mapEmbedUrl`
 * is a key-less Google Maps embed; `mapDirectionsUrl` opens turn-by-turn
 * directions in a new tab.
 */
export const CONTACT = {
  email: 'support@pakistanpropertyportal.pk',
  phone: SITE.supportPhone,
  whatsapp: SITE.supportPhone.replace(/\D/g, ''),
  officeName: 'Head Office',
  addressLine1: 'Clifton / Bath Island',
  addressLine2: 'Karachi, Pakistan',
  hoursDays: 'Monday – Friday',
  hoursTime: '9:00 AM – 6:00 PM',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sClifton+Bath+Island,+Karachi,+Pakistan!6i14',
  mapDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Clifton%20Bath%20Island%2C%20Karachi%2C%20Pakistan',
}

export const HERO_STATS = [
  { value: '25,000+', count: 25_000, label: 'Active Listings' },
  { value: '1,200+', count: 1_200, label: 'Active Agents' },
]

export const POPULAR_SEARCHES = [
  'DHA Lahore',
  'Bahria Town Karachi',
  'Gulberg Islamabad',
  'Bahria Enclave',
  'Gwadar Free Zone',
]
