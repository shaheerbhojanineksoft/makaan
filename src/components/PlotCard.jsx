import { Link } from 'react-router-dom'
import { MapPin, Ruler, SquareStack } from 'lucide-react'

import Badge from './ui/Badge'
import { formatPKR } from '../utils/format'

/**
 * Card for a single featured plot.
 *
 * The whole card is one stretched link to the plot detail screen (`/plots/:id`),
 * so the media, the title and the "View Details" affordance all open the same
 * page.
 *
 * @param {{ plot: object }} props - a record from `src/data/plots.js`
 */
export default function PlotCard({ plot }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
      <Link
        to={`/plots/${plot.id}`}
        aria-label={`View details for ${plot.title}`}
        className="absolute inset-0 z-10 rounded-2xl"
      />

      {/* Media */}
      <div className="relative aspect-4/3 overflow-hidden rounded-t-2xl bg-brand-soft">
        <img
          src={plot.image}
          alt={plot.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand/55 via-transparent to-transparent"
          aria-hidden="true"
        />

        {/* Tags */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {plot.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-brand uppercase backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-bold text-slate-900 transition group-hover:text-brand">
            {plot.title}
          </h3>
          <Badge variant="green" className="shrink-0">
            {plot.plotType}
          </Badge>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          {plot.location}
        </p>

        <div className="mt-4 flex items-center gap-4 border-y border-dashed border-slate-200 py-3 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <SquareStack className="h-4 w-4 text-brand" aria-hidden="true" />
            {plot.size}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-brand" aria-hidden="true" />
            {plot.pricePerUnit}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Demand</p>
            <p className="font-display text-xl font-extrabold text-brand">{formatPKR(plot.price)}</p>
          </div>
          <span className="rounded-xl bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand ring-1 ring-brand/15 transition group-hover:bg-brand group-hover:text-white">
            View Details
          </span>
        </div>
      </div>
    </article>
  )
}
