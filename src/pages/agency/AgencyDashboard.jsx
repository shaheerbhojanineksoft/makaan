import { Link, useOutletContext } from 'react-router-dom'
import {
  Headphones,
  Home,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { getAgencyListings, useAgencyStore } from '../../utils/agencyStore'
import { getRecommendationsByAgent } from '../../data/recommendations'

const GUIDES = [
  {
    id: 'seo',
    icon: Search,
    label: 'Visibility & SEO',
    title: 'How to improve your reach',
    points: [
      'Use real city and area names clients search for — avoid vague locations like “near city”.',
      'Keep titles unique; do not copy-paste the same headline across every listing.',
      'Add amenities and property type so search filters can surface your inventory.',
      'Publish recommendations for hot pockets you cover — they reinforce local SEO signals.',
    ],
    cta: { to: '/agency/listings', text: 'Review listings' },
  },
  {
    id: 'recommendations',
    icon: Sparkles,
    label: 'Recommendations',
    title: 'Benefits of strong recommendations',
    points: [
      'Recommendations position your agency as a market expert, not just a listing poster.',
      'Buyers trust short, clear opinions with project name, location and a sharp headline.',
      'Published tips appear alongside public browsing and help clients shortlist areas faster.',
      'Draft first, refine your 2–3 content blocks, then publish when the story feels solid.',
    ],
    cta: { to: '/agency/recommendations', text: 'Open recommendations' },
  },
]

export default function AgencyDashboard() {
  useAgencyStore()
  const { agencyId, profile } = useOutletContext()
  const listings = getAgencyListings(agencyId)
  const recommendations = getRecommendationsByAgent(agencyId)

  const stats = [
    { label: 'Active listings', value: listings.length, icon: Home },
    { label: 'Recommendations', value: recommendations.length, icon: Sparkles },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Overview</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
          Welcome, {profile?.name}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage {profile?.agency} — brand, inventory and recommendations from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-4 text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
            <p className="mt-1 font-display text-2xl font-extrabold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
              Grow with Makaan
            </p>
            <h2 className="mt-1.5 font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
              Tips to get more enquiries
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
              Practical guidance for support, recommendations, listing quality and search visibility —
              all tuned for how clients browse Makaan.
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-brand-soft px-3 py-2 text-xs font-bold text-brand sm:inline-flex">
            <TrendingUp className="h-3.5 w-3.5" />
            Agency playbook
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {GUIDES.map(({ id, icon: Icon, label, title, points, cta }) => (
            <article
              key={id}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
                  <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900">{title}</h3>
                </div>
              </div>

              <ol className="mt-4 flex-1 space-y-3">
                {points.map((point, index) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-offwhite text-[11px] font-extrabold text-brand">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ol>

              <Link
                to={cta.to}
                className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-brand transition hover:text-brand-dark"
              >
                {cta.text}
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-brand/15 bg-gradient-to-br from-brand-soft/80 via-white to-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
            <Headphones className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-extrabold text-slate-900">Need help & support?</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Our Makaan help & support team usually replies within <span className="font-bold text-slate-800">2–4 working hours</span> during business days (9 AM – 6 PM). For urgent listing or account issues we aim to respond even faster.
            </p>
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-600">
              We treat every agency request as a first priority — profile corrections, stuck drafts, publishing problems, or anything that affects how clients see your brand. Our goal is to resolve your issue in the first contact whenever possible, with clear follow-ups until it’s fully fixed.
            </p>
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-600">
              When you reach out, share your agency name and listing or recommendation ID so we can look up the case quickly and get you back to helping clients without delay.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
