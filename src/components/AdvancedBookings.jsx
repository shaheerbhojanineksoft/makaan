import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  ChevronRight,
  MapPin,
  TrendingUp,
} from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import { trendingProjects } from '../data/projects'
import { formatMonthYear, formatPKR } from '../utils/format'

function ProjectCard({ project }) {
  return (
    <article className="group flex w-[19rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/10 sm:w-[21rem]">
      {/* Media */}
      <div className="relative aspect-16/9 overflow-hidden bg-brand-dark">
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand via-brand/30 to-transparent"
          aria-hidden="true"
        />

        <span className="absolute top-3 left-3 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-brand uppercase">
          {project.status}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-soft/70">
          <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{project.developer}</span>
        </p>

        <h3 className="mt-2 font-display text-lg leading-snug font-bold text-white transition group-hover:text-brand-soft">
          {project.name}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-soft/70">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {project.location}
        </p>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-soft/70">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Expected completion: <span className="font-bold text-white">{formatMonthYear(project.completion)}</span>
        </p>

        {/* Booking progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-wide uppercase">
            <span className="flex items-center gap-1.5 text-brand-soft/70">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Units Booked
            </span>
            <span className="text-brand-soft">{project.bookingProgress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-brand-soft transition-all duration-700"
              style={{ width: `${project.bookingProgress}%` }}
            />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-5">
          <p className="text-[10px] font-bold tracking-wider text-brand-soft/60 uppercase">
            Starting From
          </p>
          <p className="font-display text-xl font-extrabold text-white">
            {formatPKR(project.startingPrice)}
          </p>

          <div className="mt-4 flex gap-2">
            <Link
              to="/advanced-booking"
              className="flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-brand shadow-lg shadow-brand-dark/40 transition hover:-translate-y-0.5 hover:bg-brand-soft"
            >
              Book Now
            </Link>
            <Link
              to="/advanced-booking"
              aria-label={`View details for ${project.name}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/20 text-brand-soft transition hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function AdvancedBookings() {
  const scrollerRef = useRef(null)

  const scrollByCards = (direction) => {
    scrollerRef.current?.scrollBy({ left: direction * 352, behavior: 'smooth' })
  }

  return (
    <section id="advanced-bookings" className="bg-brand py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          align="left"
          eyebrow="Trending Now"
          title="Trending Advanced Bookings / Upcoming Projects"
          description="Reserve your unit before construction completes. Transparent payment plans, verified developers and milestone-based possession timelines."
          action={
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                aria-label="Scroll projects left"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 text-brand-soft transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                aria-label="Scroll projects right"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 text-brand-soft transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          }
        />
      </div>

      {/* Horizontal snap carousel — bleeds to the viewport edge on mobile */}
      <div
        ref={scrollerRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8"
      >
        {trendingProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {/* Trailing spacer so the last card can fully snap on wide screens */}
        <span className="w-1 shrink-0 sm:w-8" aria-hidden="true" />
      </div>
    </section>
  )
}
