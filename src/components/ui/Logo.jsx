import { Link } from 'react-router-dom'
import { SITE } from '../../data/siteConfig'

/**
 * Brand lockup: green crescent-and-star mark + wordmark.
 *
 * @param {'light' | 'dark'} variant - `light` for white surfaces, `dark` for
 *   the forest-green footer / dark backgrounds.
 * @param {boolean} link - when false the lockup renders as a plain block, for
 *   decorative use inside modals where navigating is not wanted.
 */
export default function Logo({ variant = 'light', link = true, className = '' }) {
  const isLight = variant === 'light'

  const classes = `group flex items-center gap-2.5 ${className}`

  const content = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand shadow-lg shadow-brand/25 transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden="true">
          {/* Crescent */}
          <circle cx="18" cy="20" r="13" fill="#FFFFFF" />
          <circle cx="26" cy="16" r="11" fill="#01411C" />
          {/* Star */}
          <polygon
            points="30,22.5 31.06,25.54 34.28,25.61 31.71,27.56 32.65,30.64 30,28.8 27.35,30.64 28.29,27.56 25.72,25.61 28.94,25.54"
            fill="#FFFFFF"
          />
        </svg>
      </span>

      <span className="leading-none">
        <span
          className={`block text-[12.5px] font-extrabold uppercase tracking-tight sm:text-sm ${
            isLight ? 'text-brand' : 'text-white'
          }`}
        >
          Pakistan Property
        </span>
        <span
          className={`mt-1 block text-[9px] font-bold uppercase tracking-[0.32em] ${
            isLight ? 'text-brand-light' : 'text-brand-soft/70'
          }`}
        >
          Portal
        </span>
      </span>
    </>
  )

  if (!link) {
    return <div className={classes}>{content}</div>
  }

  return (
    <Link to="/" className={classes} aria-label={`${SITE.name} — Home`}>
      {content}
    </Link>
  )
}
