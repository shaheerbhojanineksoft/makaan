import { Link, useLocation } from 'react-router-dom'
import { SITE } from '../../data/siteConfig'

/**
 * Brand lockup: house mark + “Makaan” wordmark.
 *
 * @param {'light' | 'dark'} variant - `light` for white surfaces, `dark` for
 *   the forest-green footer / dark backgrounds.
 * @param {boolean} link - when false the lockup renders as a plain block.
 */
export default function Logo({ variant = 'light', link = true, className = '' }) {
  const isLight = variant === 'light'
  const { pathname } = useLocation()

  const classes = `group flex items-center gap-3 ${className}`

  const content = (
    <>
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14 ${
          isLight
            ? 'bg-brand text-white shadow-brand/25'
            : 'bg-white text-brand shadow-brand-dark/30'
        }`}
      >
        <svg viewBox="0 0 40 40" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" fill="none">
          {/* Roof */}
          <path
            d="M7 19.5 L20 8.5 L33 19.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* House body */}
          <path
            d="M10.5 18.5 V31.5 H29.5 V18.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Door */}
          <path
            d="M17.5 31.5 V23.5 H22.5 V31.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Window accent */}
          <circle cx="26.5" cy="23.5" r="1.5" fill="currentColor" />
        </svg>
      </span>

      <span className="leading-none">
        <span
          className={`font-display block text-2xl font-extrabold tracking-tight sm:text-[1.7rem] ${
            isLight ? 'text-brand' : 'text-white'
          }`}
        >
          Makaan
        </span>
        <span
          className={`mt-1.5 block text-[10px] font-bold tracking-[0.28em] uppercase ${
            isLight ? 'text-brand-light' : 'text-brand-soft/75'
          }`}
        >
          Property Portal
        </span>
      </span>
    </>
  )

  if (!link) {
    return <div className={classes}>{content}</div>
  }

  function handleClick(event) {
    if (pathname === '/') {
      event.preventDefault()
      window.location.reload()
    }
  }

  return (
    <Link to="/" onClick={handleClick} className={classes} aria-label={`${SITE.name} — Home`}>
      {content}
    </Link>
  )
}
