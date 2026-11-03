import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Handshake,
  KeyRound,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
} from 'lucide-react'

import SectionHeading from '../components/ui/SectionHeading'
import Badge from '../components/ui/Badge'
import { HERO_STATS } from '../data/siteConfig'

/** Curated marketplace photography, matched to the listing imagery style. */
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  buyers: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1000&q=80',
  sellers: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
}

const HERO_PROMISES = ['Verified listings', 'Trusted local agents', 'Transparent PKR pricing']

const BUYERS = {
  eyebrow: 'For Buyers & Renters',
  title: 'Search with confidence, decide with clarity',
  blurb:
    'Everything a property seeker needs — one clean search, real information and a straight line to the people who can answer your questions.',
  icon: KeyRound,
  image: IMAGES.buyers,
  imageAlt: 'Modern family home with a landscaped lawn',
  items: [
    'Make property discovery easier',
    'Find relevant properties faster',
    'Get clearer property information',
    'Explore properties in one place',
    'Easily connect with sellers or agents',
  ],
}

const SELLERS = {
  eyebrow: 'For Sellers & Property Owners',
  title: 'List once, reach the right audience',
  blurb:
    'Put your property in front of buyers and renters who are already searching — with the tools to present it properly and keep it current.',
  icon: Store,
  image: IMAGES.sellers,
  imageAlt: 'Newly built villa ready to be listed',
  items: [
    'Make property listing simple',
    'Reach more potential buyers and renters',
    'Showcase properties with rich, accurate details',
    'Receive enquiries from serious, verified buyers',
    'Manage and update your listings with ease',
  ],
}

const STANDARDS = [
  {
    icon: BadgeCheck,
    title: 'Verified agents',
    description:
      'Every agent and agency profile is reviewed before it goes live, so you always know who you are dealing with.',
  },
  {
    icon: ShieldCheck,
    title: 'Reviewed listings',
    description:
      'Property details, ownership documents and pricing are checked so each listing matches what is on the ground.',
  },
  {
    icon: ReceiptText,
    title: 'Transparent PKR pricing',
    description:
      'Prices are always shown in PKR with per-square-yard rates — clear numbers, no hidden markups.',
  },
  {
    icon: MapPin,
    title: 'Local market expertise',
    description:
      'From Karachi to Gwadar, with desks in Karachi, Lahore and Islamabad and agents who know their own streets.',
  },
]

/**
 * Audience card — the light and dark halves of the "What We're Trying to Do
 * Better" section. `tone="dark"` renders the forest-green treatment so the two
 * sides of the marketplace read as visually distinct at a glance.
 */
function AudienceCard({ tone = 'light', eyebrow, title, blurb, items, icon: Icon, image, imageAlt }) {
  const isDark = tone === 'dark'

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1.5 ${
        isDark
          ? 'border border-brand-dark/50 bg-brand text-white shadow-glass hover:shadow-glass'
          : 'border border-slate-200/80 bg-white shadow-card hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10'
      }`}
    >
      {/* Media */}
      <div className="relative aspect-16/9 overflow-hidden bg-brand-soft">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-t from-brand via-brand/35 to-transparent'
              : 'bg-gradient-to-t from-slate-900/65 via-slate-900/10 to-transparent'
          }`}
          aria-hidden="true"
        />

        <span
          className={`absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold tracking-wide uppercase ${
            isDark ? 'bg-brand-soft text-brand' : 'bg-white/95 text-brand'
          }`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {eyebrow}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3
          className={`font-display text-xl leading-snug font-bold text-balance ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {title}
        </h3>

        <p
          className={`mt-3 text-sm leading-relaxed ${
            isDark ? 'text-brand-soft/80' : 'text-slate-600'
          }`}
        >
          {blurb}
        </p>

        <ul
          className={`mt-6 space-y-3.5 border-t pt-6 ${
            isDark ? 'border-white/12' : 'border-slate-100'
          }`}
        >
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                  isDark ? 'bg-white/15 text-brand-soft' : 'bg-brand-soft text-brand'
                }`}
              >
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              <span
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-brand-soft/85' : 'text-slate-600'
                }`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/**
 * About Us — the story behind the portal.
 *
 *  1. How We Are              — gateway hero, brand story + Explore Properties
 *  2. What We're Trying to Do Better — the two sides of the marketplace
 *  3. Built to Be Trusted     — verification and pricing standards
 */
export default function About() {
  return (
    <>
      {/* ---------------------------------------------------------- 1. How We Are */}
      <section id="how-we-are" className="relative isolate overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute -top-32 -left-24 -z-10 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-brand-light/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <Badge variant="green" icon={Sparkles}>
              Our Story
            </Badge>

            <h1 className="mt-6 font-display text-4xl leading-[1.08] font-extrabold text-balance text-slate-900 sm:text-5xl">
              How We Are
            </h1>
            <span className="mt-5 block h-1.5 w-24 rounded-full bg-brand" aria-hidden="true" />

            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              We&rsquo;re building a simpler way for people to discover, buy, rent and list
              properties — bringing property seekers and property owners together in one easy-to-use
              marketplace.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
              From a family hunting for its first home in Karachi to a developer launching a new
              society near Islamabad, our job stays the same: make property decisions clearer,
              faster and more transparent — with real prices in PKR and real people who know the
              local market.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl"
              >
                Explore Properties
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand/20 bg-white px-6 py-3.5 text-sm font-bold text-brand transition hover:bg-brand-soft"
              >
                Talk to Our Team
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {HERO_PROMISES.map((promise) => (
                <li
                  key={promise}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-600"
                >
                  <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={3} aria-hidden="true" />
                  {promise}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -top-6 -right-6 hidden h-full w-full rounded-[2rem] border-2 border-brand/15 sm:block"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[2rem] shadow-glass ring-1 ring-slate-900/10">
              <img
                src={IMAGES.hero}
                alt="Contemporary Pakistani home with a landscaped entrance"
                className="aspect-4/5 w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand/50 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>

            <div className="absolute -top-4 left-4 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[11px] font-bold text-brand shadow-lg ring-1 ring-brand/10 backdrop-blur sm:left-6">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              Verified Marketplace
            </div>

            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur sm:-left-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg leading-none font-extrabold text-brand">
                  {HERO_STATS[0].value}
                </p>
                <p className="mt-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                  {HERO_STATS[0].label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------- 2. What We're Trying to Do Better */}
      <section id="do-better" className="bg-offwhite py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Focus"
            title="What We're Trying to Do Better"
            description="Property search and listing still feels harder than it should be. So we're working on both sides of the marketplace at once — making it easier to find a property, and easier to be found."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            <AudienceCard {...BUYERS} tone="light" />
            <AudienceCard {...SELLERS} tone="dark" />
          </div>

          <p className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 text-center text-xs font-semibold text-slate-500">
            <Handshake className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            Two sides, one marketplace — the better it works for seekers, the better it works for
            owners.
          </p>
        </div>
      </section>

      {/* --------------------------------------------- 3. Built to Be Trusted */}
      <section id="trust" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Trust & Standards"
            title="Built to Be Trusted"
            description="A marketplace only works when both sides can rely on it. These are the standards we hold every listing and every agent to."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARDS.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand ring-1 ring-brand/10 transition group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
