import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  MessageCircle,
  Phone,
  SearchX,
  Share2,
} from 'lucide-react'

import RecommendationCard from '../components/RecommendationCard'
import SectionHeading from '../components/ui/SectionHeading'
import {
  getRecommendationById,
  getRelatedRecommendations,
  hydrateRecommendation,
} from '../data/recommendations'
import { formatMonthYear } from '../utils/format'

const PANEL =
  'rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-7'

function CoverImage({ src, title }) {
  if (!src) return null

  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-soft shadow-glass ring-1 ring-slate-900/10">
      <img src={src} alt={title} className="aspect-16/10 w-full object-cover" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand/50 via-transparent to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}

function NotFound({ id }) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold text-slate-900">
        Insight unavailable
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        We could not find a recommendation with id {id}.
      </p>
      <Link
        to="/agents-recommend"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to recommendations
      </Link>
    </section>
  )
}

export default function RecommendationDetail() {
  const { id } = useParams()
  const rec = useMemo(() => hydrateRecommendation(getRecommendationById(id)), [id])
  const related = useMemo(
    () => getRelatedRecommendations(id, 3).map(hydrateRecommendation),
    [id],
  )
  const [shareNote, setShareNote] = useState('')

  if (!rec || rec.status !== 'published') return <NotFound id={id} />

  const agent = rec.agent

  const onShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: rec.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setShareNote('Link copied')
        window.setTimeout(() => setShareNote(''), 2000)
      }
    } catch {
      setShareNote('Unable to share')
      window.setTimeout(() => setShareNote(''), 2000)
    }
  }

  return (
    <>
      <section className="bg-white pb-12">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/agents-recommend"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-brand transition hover:bg-brand-soft"
            >
              <ArrowLeft className="h-4 w-4" />
              All recommendations
            </Link>

            <div className="ml-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {shareNote && (
                <span className="self-center text-[11px] font-bold text-brand">{shareNote}</span>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-6 lg:col-span-8">
              <CoverImage src={rec.coverImage} title={rec.title} />

              <div>
                <h1 className="mt-4 font-display text-3xl font-extrabold text-balance text-slate-900 sm:text-4xl">
                  {rec.title}
                </h1>
                {rec.publishedAt && (
                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Published {formatMonthYear(rec.publishedAt)}
                  </p>
                )}
              </div>

              <article className={PANEL}>
                <div className="space-y-8">
                  <section>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Why the agent recommends it
                    </h2>
                    <span className="mt-3 block h-1 w-14 rounded-full bg-brand" aria-hidden="true" />
                    <p className="mt-5 text-sm leading-relaxed text-slate-600">{rec.whyRecommend}</p>
                  </section>

                  <section className="border-t border-slate-100 pt-8">
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Market perspective & demand
                    </h2>
                    <span className="mt-3 block h-1 w-14 rounded-full bg-brand" aria-hidden="true" />
                    <p className="mt-5 text-sm leading-relaxed text-slate-600">{rec.marketInsights}</p>
                  </section>

                  <section className="border-t border-slate-100 pt-8">
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Future development prospects
                    </h2>
                    <span className="mt-3 block h-1 w-14 rounded-full bg-brand" aria-hidden="true" />
                    <p className="mt-5 text-sm leading-relaxed text-slate-600">{rec.futureProspects}</p>
                  </section>
                </div>
              </article>

            </div>

            <aside className="space-y-6 lg:col-span-4">
              <div className={`lg:sticky lg:top-24 space-y-6`}>
                {agent && (
                  <div className={PANEL}>
                    <h2 className="font-display text-lg font-bold text-slate-900">Contact agent</h2>
                    <span className="mt-3 block h-1 w-14 rounded-full bg-brand" />
                    <div className="mt-5 flex items-center gap-3">
                      <img
                        src={agent.avatar}
                        alt=""
                        className="h-14 w-14 rounded-full object-cover ring-4 ring-brand-soft"
                      />
                      <div>
                        <p className="flex items-center gap-1.5 font-bold text-slate-900">
                          {agent.name}
                          {agent.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
                        </p>
                        <p className="text-xs font-medium text-slate-500">{agent.agency}</p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                          {agent.city} · {agent.responseTime}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-2">
                      <a
                        href={`tel:${agent.phone}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-bold text-brand transition hover:bg-brand-soft"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                      <a
                        href={`mailto:${agent.email}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
                      >
                        <Mail className="h-4 w-4" />
                        Email agent
                      </a>
                      <Link
                        to={`/agents/${agent.id}`}
                        className="text-center text-xs font-bold text-brand hover:underline"
                      >
                        View full agency profile
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-brand-soft py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Related recommendations"
              description="More expert insights from similar categories and cities."
            />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RecommendationCard key={item.id} recommendation={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
