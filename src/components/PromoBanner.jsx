import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Full-bleed promotional poster carousel at the bottom of the home page.
 *
 * Slides auto-advance in a loop. The whole banner is a link to the advanced
 * booking work-in-progress screen.
 */
const SLIDES = [
  {
    id: 'promo-1',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    eyebrow: 'Advanced Booking',
    title: 'Reserve your unit before launch',
    subtitle: 'Transparent payment plans with verified developers across Pakistan.',
  },
  {
    id: 'promo-2',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80',
    eyebrow: 'New Projects',
    title: 'Upcoming societies & overseas blocks',
    subtitle: 'Book early, track instalments, and lock your plot before prices rise.',
  },
  {
    id: 'promo-3',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    eyebrow: 'Featured Launch',
    title: 'Premium living, milestone possession',
    subtitle: 'From Karachi to Islamabad — book now, move later with confidence.',
  },
]

const INTERVAL_MS = 4500

export default function PromoBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length)
    }, INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  const goTo = (next) => {
    setIndex((next + SLIDES.length) % SLIDES.length)
  }

  const slide = SLIDES[index]

  return (
    <section
      aria-label="Promotional banners"
      className="bg-offwhite px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14"
    >
      <div className="relative isolate mx-auto max-w-[90rem] overflow-hidden rounded-2xl bg-brand shadow-[0_8px_30px_rgb(15_23_42/0.12)] ring-1 ring-brand/20">
      <Link
        to="/advanced-booking"
        className="group relative block min-h-[18rem] w-full sm:min-h-[22rem] lg:min-h-[26rem]"
        aria-label={`${slide.title} — open advanced booking`}
      >
        {SLIDES.map((item, i) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={i !== index}
          >
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-brand via-brand/75 to-brand/25"
              aria-hidden="true"
            />
          </div>
        ))}

        <div className="relative z-10 flex h-full min-h-[18rem] max-w-3xl flex-col justify-end px-6 py-10 sm:min-h-[22rem] sm:px-10 sm:py-12 lg:min-h-[26rem] lg:px-14 lg:py-14">
          <p className="text-[11px] font-extrabold tracking-[0.2em] text-brand-soft uppercase">
            {slide.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-balance text-white sm:text-4xl lg:text-5xl">
            {slide.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-soft/85 sm:text-base">
            {slide.subtitle}
          </p>
          <span className="mt-6 inline-flex w-fit items-center rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-brand shadow-lg shadow-brand-dark/30 transition group-hover:-translate-y-0.5">
            Learn more
          </span>
        </div>
      </Link>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="pointer-events-auto flex gap-2">
          {SLIDES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition ${
                i === index ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <div className="pointer-events-auto hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/25 bg-brand/40 text-white backdrop-blur transition hover:bg-white/15"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/25 bg-brand/40 text-white backdrop-blur transition hover:bg-white/15"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      </div>
    </section>
  )
}
