import { Link } from 'react-router-dom'
import { BadgeCheck, CalendarDays, MapPin } from 'lucide-react'

import Badge from './ui/Badge'
import { formatMonthYear } from '../utils/format'

const DEMAND_VARIANT = {
  High: 'solid',
  Medium: 'amber',
  Emerging: 'green',
}

/**
 * Public recommendation card → `/agents-recommend/:id`.
 */
export default function RecommendationCard({ recommendation }) {
  const agent = recommendation.agent
  const project = recommendation.relatedProject

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
      <Link
        to={`/agents-recommend/${recommendation.id}`}
        aria-label={`Read insight: ${recommendation.title}`}
        className="absolute inset-0 z-10 rounded-2xl"
      />

      <div className="relative aspect-16/10 overflow-hidden rounded-t-2xl bg-brand-soft">
        <img
          src={recommendation.coverImage}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand/55 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-start justify-between gap-2">
          <Badge variant="green" className="bg-white/95">
            {recommendation.category}
          </Badge>
          <Badge variant={DEMAND_VARIANT[recommendation.demandLevel] ?? 'green'}>
            {recommendation.demandLevel} Demand
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base leading-snug font-bold text-slate-900 transition group-hover:text-brand">
          {recommendation.title}
        </h3>

        {agent && (
          <div className="mt-3 flex items-center gap-2.5">
            <img
              src={agent.avatar}
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-soft"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <span className="truncate">{agent.name}</span>
                {agent.verified && (
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                )}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-500">{agent.agency}</p>
            </div>
          </div>
        )}

        {project && (
          <p className="mt-3 text-xs font-semibold text-brand">
            Project: <span className="text-slate-700">{project.name}</span>
          </p>
        )}

        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
          {recommendation.city} · {recommendation.location}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {recommendation.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
            {recommendation.publishedAt
              ? formatMonthYear(recommendation.publishedAt)
              : 'Unpublished'}
          </p>
          <span className="rounded-xl bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand ring-1 ring-brand/15 transition group-hover:bg-brand group-hover:text-white">
            Read Full Insight
          </span>
        </div>
      </div>
    </article>
  )
}
