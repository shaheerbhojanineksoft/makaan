import { Link } from 'react-router-dom'
import { Bath, BedDouble, Clock3, MapPin, Maximize } from 'lucide-react'

import Badge from './ui/Badge'
import FavoriteButton from './FavoriteButton'
import { FAVORITE_KINDS } from '../utils/favorites'
import { formatPKR, timeAgo } from '../utils/format'

function SpecItem({ icon: Icon, label }) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <Icon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
      {label}
    </span>
  )
}

export default function PropertyCard({ property }) {
  const isRent = property.purpose === 'rent'

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
      <Link
        to={`/properties/${property.id}`}
        aria-label={`View details for ${property.title}`}
        className="absolute inset-0 z-10 rounded-2xl"
      />

      <div className="relative aspect-4/3 overflow-hidden rounded-t-2xl bg-brand-soft">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <FavoriteButton
          kind={FAVORITE_KINDS.property}
          id={property.id}
          size="sm"
          className="absolute top-3 left-3"
        />
        <span className="absolute top-3 right-3 rounded-full bg-brand/90 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase backdrop-blur">
          For {isRent ? 'Rent' : 'Sale'}
        </span>
        <p className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-600 backdrop-blur">
          <Clock3 className="h-3 w-3 text-brand" aria-hidden="true" />
          {timeAgo(property.listedAt)}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[15px] leading-snug font-bold text-slate-900 transition group-hover:text-brand">
            {property.title}
          </h3>
          <Badge variant="green" className="shrink-0">
            {property.propertyType}
          </Badge>
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          {property.location}
        </p>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-dashed border-slate-200 py-3 text-[11px] font-semibold text-slate-600">
          {property.beds > 0 && (
            <SpecItem icon={BedDouble} label={`${property.beds} Beds`} />
          )}
          <SpecItem icon={Bath} label={`${property.baths} Baths`} />
          <SpecItem icon={Maximize} label={property.area} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p className="font-display text-lg font-extrabold text-brand">
              {formatPKR(property.price)}
              {isRent && <span className="text-xs font-bold text-slate-400"> /month</span>}
            </p>
            <p className="mt-1 truncate text-[10px] font-medium text-slate-400">
              {property.agent.name} · {property.agent.agency}
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand ring-1 ring-brand/15 transition group-hover:bg-brand group-hover:text-white">
            View Details
          </span>
        </div>
      </div>
    </article>
  )
}
