import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, MessageCircle, Phone, Scale } from 'lucide-react'

import { getLawyerCities, getLawyersByCity } from '../data/lawyers'

function telHref(phone) {
  return `tel:${String(phone).replace(/\s/g, '')}`
}

function waHref(phone) {
  let digits = String(phone).replace(/\D/g, '')
  // Local PK mobiles starting with 0 → WhatsApp needs 92…
  if (digits.startsWith('0')) digits = `92${digits.slice(1)}`
  return `https://wa.me/${digits}`
}

function LawyerCard({ lawyer }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-6">
      <div className="flex items-start gap-3">
        <img
          src={lawyer.avatar}
          alt=""
          className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-brand/15"
        />
        <div className="min-w-0">
          <h2 className="font-display text-xl font-extrabold text-slate-900">{lawyer.name}</h2>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-brand" />
            {lawyer.city}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-brand">{lawyer.specialty}</p>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed whitespace-pre-line text-slate-600">
        {lawyer.bio}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <a
          href={telHref(lawyer.phone)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <a
          href={waHref(lawyer.whatsapp)}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </article>
  )
}

export default function TrustedLawyers() {
  const cities = useMemo(() => getLawyerCities(), [])
  const [city, setCity] = useState('All')
  const lawyers = useMemo(() => getLawyersByCity(city), [city])

  return (
    <div className="bg-offwhite">
      <section className="border-b border-slate-200/80 bg-gradient-to-br from-brand-soft via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:text-brand-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
                <Scale className="h-3.5 w-3.5" />
                Legal support
              </p>
              <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Talk to our trusted lawyers
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                Filter by city and contact a verified property lawyer by call or WhatsApp before you
                pay token, rent advance, or transfer money.
              </p>
            </div>

            <label className="block w-full max-w-xs">
              <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                Filter by city
              </span>
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="All">All cities</option>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <p className="mb-4 text-sm font-semibold text-slate-500">
          Showing <span className="font-extrabold text-slate-800">{lawyers.length}</span> lawyer
          {lawyers.length === 1 ? '' : 's'}
          {city !== 'All' ? ` in ${city}` : ''}
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {lawyers.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>

        {lawyers.length === 0 && (
          <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-500">
              No lawyers listed for this city yet. Try another city.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
