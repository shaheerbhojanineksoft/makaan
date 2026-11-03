import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import PlotCard from './PlotCard'
import { featuredPlots } from '../data/plots'

export default function FeaturedPlots() {
  return (
    <section id="featured-plots" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Discover Your Plots"
          description="Corner, park-facing and commercial plots in Pakistan's most in-demand societies — verified ownership, transparent per-square-yard pricing."
          action={
            <Link
              to="/plots"
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
            >
              Browse all plots
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPlots.map((plot) => (
            <PlotCard key={plot.id} plot={plot} />
          ))}
        </div>
      </div>
    </section>
  )
}
