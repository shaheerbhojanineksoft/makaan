import { Heart } from 'lucide-react'
import { toggleFavorite, useIsFavorite } from '../utils/favorites'

const SIZE = {
  sm: {
    button: 'h-9 w-9',
    icon: 'h-4 w-4',
  },
  md: {
    button: 'h-10 w-10',
    icon: 'h-5 w-5',
  },
  lg: {
    button: 'h-11 w-11',
    icon: 'h-5 w-5',
  },
}

/**
 * Heart toggle for listings / agencies.
 * Stops navigation when placed over card links.
 *
 * @param {{ kind: string, id: string, size?: 'sm'|'md'|'lg', className?: string, label?: string }} props
 */
export default function FavoriteButton({
  kind,
  id,
  size = 'md',
  className = '',
  label,
}) {
  const active = useIsFavorite(kind, id)
  const dims = SIZE[size] ?? SIZE.md
  const aria = label || (active ? 'Remove from favourites' : 'Save to favourites')

  return (
    <button
      type="button"
      aria-label={aria}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFavorite(kind, id)
      }}
      className={`z-20 grid shrink-0 ${dims.button} place-items-center rounded-full bg-white shadow-md ring-1 ring-slate-200/90 backdrop-blur transition hover:scale-105 ${
        active
          ? 'text-rose-500 ring-rose-200'
          : 'text-slate-400 hover:text-rose-500'
      } ${className}`}
    >
      <Heart
        className={`${dims.icon} ${active ? 'fill-rose-500 text-rose-500' : ''}`}
        aria-hidden="true"
      />
    </button>
  )
}
