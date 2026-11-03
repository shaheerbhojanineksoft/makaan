const VARIANTS = {
  /* Green pill — the signature brand badge */
  green: 'bg-brand-soft text-brand ring-1 ring-brand/15',
  /* Solid forest green */
  solid: 'bg-brand text-white ring-1 ring-brand',
  /* White pill for dark forest-green bands */
  onDark: 'bg-white/10 text-brand-soft ring-1 ring-white/20',
  /* Listing freshness */
  new: 'bg-brand-soft text-brand ring-1 ring-brand/20',
  /* Status / info */
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
}

/**
 * Small pill tag used for badges across every listing card.
 */
export default function Badge({ children, variant = 'green', icon: Icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${VARIANTS[variant] ?? VARIANTS.green} ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </span>
  )
}
