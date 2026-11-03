/**
 * Reusable section title block with the signature green accent underline.
 *
 * @param {string}  eyebrow     - small uppercase kicker above the title
 * @param {string}  title       - main section heading
 * @param {string}  description - supporting copy
 * @param {'left'|'center'} align
 * @param {boolean} dark        - true when rendered on the forest-green band
 * @param {React.ReactNode} action - optional trailing CTA (right aligned)
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  dark = false,
  action,
}) {
  const isCentered = align === 'center'

  return (
    <div
      className={`flex flex-col gap-6 ${
        !isCentered && action ? 'sm:flex-row sm:items-end sm:justify-between' : ''
      }`}
    >
      <div className={isCentered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
        {eyebrow && (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
              dark ? 'bg-white/10 text-brand-soft ring-1 ring-white/15' : 'bg-brand-soft text-brand ring-1 ring-brand/15'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-brand-soft' : 'bg-brand'}`} />
            {eyebrow}
          </span>
        )}

        {title && (
          <>
            <h2
              className={`mt-4 font-display text-3xl leading-tight font-extrabold text-balance sm:text-4xl ${
                dark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h2>

            {/* Green accent underline */}
            <span
              className={`mt-4 block h-1.5 w-24 rounded-full ${
                isCentered ? 'mx-auto' : ''
              } ${dark ? 'bg-brand-soft' : 'bg-brand'}`}
              aria-hidden="true"
            />
          </>
        )}

        {description && (
          <p
            className={`mt-5 text-sm leading-relaxed sm:text-base ${
              dark ? 'text-brand-soft/80' : 'text-slate-600'
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {action && <div className={isCentered ? 'mx-auto' : 'shrink-0'}>{action}</div>}
    </div>
  )
}
