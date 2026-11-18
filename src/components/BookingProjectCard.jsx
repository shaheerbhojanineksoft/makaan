import { Link } from 'react-router-dom'
import {
  Building2,
  Check,
  MapPin,
  Store,
  X,
} from 'lucide-react'

import Badge from './ui/Badge'
import FavoriteButton from './FavoriteButton'
import { enrichBookingProject } from '../data/projects'
import { FAVORITE_KINDS } from '../utils/favorites'
import { formatPKR } from '../utils/format'

const STATUS_VARIANT = {
  'Booking Open': 'solid',
  'Pre-Launch': 'amber',
  'Coming Soon': 'green',
}

const UNIT_LABELS = [
  { key: 'flats', label: 'Flats' },
  { key: 'villas', label: 'Villas' },
  { key: 'shops', label: 'Shops' },
  { key: 'offices', label: 'Offices' },
  { key: 'plots', label: 'Plots' },
]

function FacilityChip({ allowed, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        allowed
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
      }`}
    >
      {allowed ? <Check className="h-3 w-3" aria-hidden="true" /> : <X className="h-3 w-3" aria-hidden="true" />}
      {label}
    </span>
  )
}

/**
 * Advance Booking inventory card — links to `/advanced-booking/:id`.
 */
export default function BookingProjectCard({ project: rawProject }) {
  const project = enrichBookingProject(rawProject) || rawProject
  const unitLines = UNIT_LABELS.filter(({ key }) => (project.unitCounts?.[key] || 0) > 0)

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
      <Link
        to={`/advanced-booking/${project.id}`}
        state={{ from: '/advanced-booking' }}
        aria-label={`View details for ${project.name}`}
        className="absolute inset-0 z-10 rounded-2xl"
      />

      <div className="relative aspect-4/3 overflow-hidden rounded-t-2xl bg-brand-soft">
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand/55 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="absolute top-3 left-3">
          <Badge variant={STATUS_VARIANT[project.bookingStatus] ?? 'green'}>
            {project.bookingStatus}
          </Badge>
        </div>
        <FavoriteButton
          kind={FAVORITE_KINDS.project}
          id={project.id}
          size="sm"
          className="absolute top-3 right-3"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-bold text-slate-900 transition group-hover:text-brand">
            {project.name}
          </h3>
          <Badge variant="green" className="shrink-0">
            {project.projectType}
          </Badge>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          {project.city} · {project.area}
        </p>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          Builder: {project.developer}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-extrabold text-brand ring-1 ring-brand/15">
            {formatPKR(project.minPrice)} – {formatPKR(project.maxPrice)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <FacilityChip allowed={project.installmentsAllowed} label="Installments" />
          <FacilityChip allowed={project.bankTransferAllowed} label="Bank transfer" />
        </div>

        {unitLines.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-2 border-y border-dashed border-slate-200 py-3">
            {unitLines.map(({ key, label }) => (
              <li
                key={key}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"
              >
                <Store className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                {project.unitCounts[key]} {label}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Starting From
            </p>
            <p className="font-display text-xl font-extrabold text-brand">
              {formatPKR(project.startingPrice)}
            </p>
          </div>
          <span className="rounded-xl bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand ring-1 ring-brand/15 transition group-hover:bg-brand group-hover:text-white">
            View Details
          </span>
        </div>
      </div>
    </article>
  )
}
