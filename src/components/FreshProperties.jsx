import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import PropertyCard from './PropertyCard'
import { freshProperties } from '../data/properties'

export default function FreshProperties() {
  return (
    <section id="fresh-properties" className="bg-brand-soft py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Just Listed"
          description="The newest homes, apartments and commercial spaces uploaded to the portal — most added within the last seven days."
          action={
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
            >
              See all new listings
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {freshProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}
