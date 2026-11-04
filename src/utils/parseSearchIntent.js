/**
 * Rule-based natural-language → search filters.
 * Ready to swap for an LLM /api/search/intent call later without changing callers.
 */

import { CITIES, PRICE, PROJECT_TYPES, PROPERTY_TYPES } from '../data/filters'

const LAKH = 100_000
const CRORE = 10_000_000

const PURPOSE_PATTERNS = [
  {
    purpose: 'rent',
    pattern:
      /\b(rent|rental|lease|kiraya|kiraye|کرایہ|for\s+rent|to\s+rent|monthly)\b/i,
  },
  {
    purpose: 'booking',
    pattern:
      /\b(booking|book|advance\s+booking|installment|under\s+construction|project|overseas\s+block)\b/i,
  },
  {
    purpose: 'buy',
    pattern: /\b(buy|purchase|sale|sell|own|investment|for\s+sale|to\s+buy|kharid)\b/i,
  },
]

const TYPE_ALIASES = [
  { type: 'Flat / Apartment', pattern: /\b(flat|apartment|appart?ment|appartment|studio)\b/i },
  { type: 'House', pattern: /\b(house|home|villa|bangla|bungalow|makan|makaan)\b/i },
  { type: 'Farm House', pattern: /\b(farm\s*house|farmhouse)\b/i },
  { type: 'Residential Plot', pattern: /\b(residential\s+plot|plot\s+residential)\b/i },
  { type: 'Commercial Plot', pattern: /\b(commercial\s+plot|plot\s+commercial)\b/i },
  { type: 'Shop', pattern: /\b(shop|store|dukaan)\b/i },
  { type: 'Office', pattern: /\b(office|workspace)\b/i },
  { type: 'Building', pattern: /\b(building|plaza)\b/i },
  {
    type: 'Residential Project',
    pattern: /\b(residential\s+project|housing\s+project|housing\s+society)\b/i,
  },
  { type: 'Commercial Project', pattern: /\b(commercial\s+project)\b/i },
  { type: 'Mixed-Use Project', pattern: /\b(mixed[\s-]?use)\b/i },
  { type: 'Farmhouse Project', pattern: /\b(farmhouse\s+project)\b/i },
  { type: 'Overseas Block', pattern: /\b(overseas\s+block|overseas)\b/i },
]

/** Loose area / society tokens kept as free-text keyword when detected. */
const AREA_HINTS = [
  'dha',
  'bahria',
  'gulberg',
  'clifton',
  'defence',
  'model town',
  'johar',
  'gulshan',
  'north nazimabad',
  'f-6',
  'f-7',
  'f-8',
  'f-10',
  'f-11',
  'g-11',
  'i-8',
  'phase',
  'sector',
  'enclave',
  'town',
  'scheme',
  'free zone',
  'crescent bay',
  'emaar',
]

function detectPurpose(text) {
  for (const { purpose, pattern } of PURPOSE_PATTERNS) {
    if (pattern.test(text)) return purpose
  }
  return 'buy'
}

function detectCity(text) {
  const lower = text.toLowerCase()
  return CITIES.find((city) => lower.includes(city.toLowerCase())) ?? ''
}

function detectPropertyType(text, purpose) {
  const pool = purpose === 'booking' ? PROJECT_TYPES : PROPERTY_TYPES
  for (const { type, pattern } of TYPE_ALIASES) {
    if (!pool.includes(type)) continue
    if (pattern.test(text)) return type
  }
  if (/\bplots?\b/i.test(text) && purpose !== 'booking') return 'Residential Plot'
  return ''
}

function detectBeds(text) {
  const match =
    text.match(/\b(\d+)\s*(?:bed(?:room)?s?|br|bhk)\b/i) ||
    text.match(/\b(\d+)\s*bed\b/i)
  if (!match) return null
  const beds = Number(match[1])
  return Number.isFinite(beds) && beds > 0 ? beds : null
}

/**
 * Parses amounts like "2 crore", "85 lac", "1.5 cr", "150000", "under 50k".
 */
function detectMaxPrice(text, purpose) {
  const lower = text.toLowerCase()

  const crore = lower.match(
    /(?:under|below|upto|up\s+to|max|budget|within|se\s+kam|tak)?\s*([\d.]+)\s*(crore|cr)\b/,
  )
  if (crore) return Math.round(Number(crore[1]) * CRORE)

  const lac = lower.match(
    /(?:under|below|upto|up\s+to|max|budget|within|se\s+kam|tak)?\s*([\d.]+)\s*(lac|lakh|lacs|lakhs)\b/,
  )
  if (lac) return Math.round(Number(lac[1]) * LAKH)

  const thousand = lower.match(
    /(?:under|below|upto|up\s+to|max|budget|within)?\s*([\d.]+)\s*k\b/,
  )
  if (thousand) return Math.round(Number(thousand[1]) * 1_000)

  const raw = lower.match(
    /(?:under|below|upto|up\s+to|max|budget|within)\s*([\d,]+)\b/,
  )
  if (raw) {
    const amount = Number(raw[1].replace(/,/g, ''))
    if (Number.isFinite(amount) && amount > 0) return amount
  }

  return PRICE[purpose]?.defaultValue ?? PRICE.buy.defaultValue
}

function detectKeyword(text, city, propertyType) {
  let leftover = text

  if (city) leftover = leftover.replace(new RegExp(city, 'ig'), ' ')
  for (const { pattern } of PURPOSE_PATTERNS) leftover = leftover.replace(pattern, ' ')
  for (const { pattern } of TYPE_ALIASES) leftover = leftover.replace(pattern, ' ')
  leftover = leftover
    .replace(/\b\d+\s*(?:bed(?:room)?s?|br|bhk)\b/gi, ' ')
    .replace(/\b(?:under|below|upto|up\s+to|max|budget|within|se\s+kam|tak)\s*[\d.,]+\s*(?:crore|cr|lac|lakh|lacs|lakhs|k)?\b/gi, ' ')
    .replace(/\b(?:mein|main|in|for|the|a|an|of|and|or|with|near|paas|ke|ki|ka)\b/gi, ' ')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const lower = leftover.toLowerCase()
  const hinted = AREA_HINTS.find((hint) => lower.includes(hint))
  if (hinted) {
    const start = lower.indexOf(hinted)
    const slice = leftover.slice(Math.max(0, start - 2), start + hinted.length + 12).trim()
    return slice.replace(/\s+/g, ' ').slice(0, 40)
  }

  if (leftover.length >= 3 && leftover.toLowerCase() !== propertyType.toLowerCase()) {
    return leftover.slice(0, 48)
  }
  return ''
}

/**
 * @param {string} query
 * @returns {{
 *   purpose: 'buy'|'rent'|'booking',
 *   city: string,
 *   propertyType: string,
 *   maxPrice: number,
 *   beds: number|null,
 *   keyword: string,
 *   query: string,
 *   source: 'ask',
 * }}
 */
export function parseSearchIntent(query) {
  const text = String(query || '').trim()
  const purpose = detectPurpose(text)
  const city = detectCity(text)
  const propertyType = detectPropertyType(text, purpose)
  const maxPrice = detectMaxPrice(text, purpose)
  const beds = detectBeds(text)
  const keyword = detectKeyword(text, city, propertyType)

  return {
    purpose,
    city,
    propertyType,
    maxPrice,
    beds,
    keyword,
    query: text,
    source: 'ask',
  }
}

export const ASK_MAKAN_EXAMPLES = [
  'Lahore mein 3 bed house under 2 crore',
  'Karachi DHA flat for rent under 1 lac',
  'Islamabad residential plot buy',
  'Bahria Town booking project',
]
