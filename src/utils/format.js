/**
 * Formatting helpers — South Asian numbering (Lac / Crore) as expected by
 * Pakistani property buyers.
 */

const LAKH = 100_000
const CRORE = 10_000_000

function trimDecimal(value, digits = 2) {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '')
}

/**
 * Full price label, e.g. `PKR 6.5 Crore`, `PKR 85 Lac`, `PKR 45,000`.
 */
export function formatPKR(value) {
  const amount = Number(value) || 0

  if (amount >= CRORE) return `PKR ${trimDecimal(amount / CRORE)} Crore`
  if (amount >= LAKH) return `PKR ${trimDecimal(amount / LAKH)} Lac`
  return `PKR ${amount.toLocaleString('en-PK')}`
}

/**
 * Compact label for tight card layouts, e.g. `PKR 6.5 Cr` / `PKR 85 Lac`.
 */
export function formatPKRShort(value) {
  const amount = Number(value) || 0

  if (amount >= CRORE) return `PKR ${trimDecimal(amount / CRORE)} Cr`
  if (amount >= LAKH) return `PKR ${trimDecimal(amount / LAKH)} Lac`
  return `PKR ${amount.toLocaleString('en-PK')}`
}

/** `1 Kanal 10 Marla` style plot sizes are stored pre-formatted in the data. */
export function formatArea(size) {
  return typeof size === 'string' ? size : `${size} Sq. Yd`
}

/** Builds a readable relative timestamp from an ISO date string. */
export function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86_400_000)

  if (days <= 0) return 'Added today'
  if (days === 1) return 'Added yesterday'
  if (days < 30) return `Added ${days} days ago`

  const months = Math.floor(days / 30)
  return months === 1 ? 'Added 1 month ago' : `Added ${months} months ago`
}

/** Formats an ISO date as `Dec 2027`. */
export function formatMonthYear(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
