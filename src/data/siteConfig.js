/**
 * Global site configuration.
 *
 * `heroImage` ships with a locally authored, licence-free illustrated skyline
 * of real Pakistani landmarks (Badshahi Mosque, Minar-e-Pakistan,
 * Mazar-e-Quaid, Faisal Mosque) at /public/hero-pakistan.svg, so the hero never
 * depends on an external host.
 *
 * To swap in a licensed photograph instead, drop the file into /public and set
 * e.g. `heroImage: '/minar-e-pakistan.jpg'` (or import it from /src/assets).
 */
export const SITE = {
  name: 'Pakistan Property Portal',
  shortName: 'PPP',
  tagline: 'Pakistan ka Apna Trusted Property Portal',
  heroImage: '/hero-pakistan.svg',
  supportPhone: '+92 21 111 000 111',
  supportEmail: 'help@pakistanpropertyportal.pk',
  offices: ['Karachi', 'Lahore', 'Islamabad'],
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
