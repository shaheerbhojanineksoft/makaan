import { Link } from 'react-router-dom'
import {
  Building2,
  CalendarClock,
  MapPin,
  Wallet,
} from 'lucide-react'

import Badge from './ui/Badge'
import FavoriteButton from './FavoriteButton'
import { FAVORITE_KINDS } from '../utils/favorites'
import { formatMonthYear, formatPKR } from '../utils/format'

const STATUS_VARIANT = {
  'Booking Open': 'solid',
  'Pre-Launch': 'amber',
  'Coming Soon': 'green',
}

/**
 * Advance Booking inventory card — links to `/advanced-booking/:id`.
 */
export default function BookingProjectCard({ project }) {
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

        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          {project.developer}
        </p>

        <div className="mt-4 space-y-2 border-y border-dashed border-slate-200 py-3 text-xs font-semibold text-slate-600">
          <p className="flex items-center justify-between gap-2">
            <span className="text-slate-400">Booking</span>
            <span>{formatPKR(project.bookingAmount)}</span>
          </p>
          <p className="flex items-center justify-between gap-2">
            <span className="text-slate-400">
              {project.monthlyInstallment > 0 ? 'Monthly' : project.paymentPlan}
            </span>
            <span>
              {project.monthlyInstallment > 0
                ? formatPKR(project.monthlyInstallment)
                : project.paymentPlanDuration}
            </span>
          </p>
          <p className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <CalendarClock className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              Completion
            </span>
            <span>{formatMonthYear(project.completionDate)}</span>
          </p>
          <p className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Wallet className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              Plan
            </span>
            <span>
              {project.paymentPlan} · {project.paymentPlanDuration}
            </span>
          </p>
        </div>

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
