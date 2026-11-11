import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  Building2,
  FileSearch,
  Handshake,
  KeyRound,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Wallet,
} from 'lucide-react'

const SECTIONS = [
  {
    id: 'mindset',
    icon: ShieldAlert,
    title: 'Before you start',
    intro: 'First-time buyers and renters should slow down and verify — never rush a property decision.',
    points: [
      'Decide your real budget including transfer fees, agent commission, stamp duty and moving costs.',
      'Prefer written communication for offers, rents and promises — verbal deals are hard to prove later.',
      'Do not hand over original documents or large cash without a proper receipt and witness.',
      'If anything feels rushed or “today only”, pause and get a second opinion.',
    ],
  },
  {
    id: 'buy',
    icon: Building2,
    title: 'If you are buying',
    intro: 'Ownership transfers are permanent. Check title and paperwork before you pay.',
    points: [
      'Confirm the seller is the legal owner (or has a valid power of attorney).',
      'Ask for the latest fard / title extract and match names, khasra / plot numbers and measurements.',
      'Check for mortgages, liens, court cases or society dues outstanding on the property.',
      'Verify approved building plan and that construction matches what society / authority allows.',
      'Prefer payments through bank transfer or cheque with clear narration — keep every challan.',
      'Never rely only on an agent brochure; visit the site and neighbouring units yourself.',
    ],
  },
  {
    id: 'rent',
    icon: KeyRound,
    title: 'If you are renting',
    intro: 'A clear rent agreement protects both tenant and landlord.',
    points: [
      'Sign a written rent agreement with monthly rent, deposit, notice period and utility responsibility.',
      'Take meter readings (electricity, gas, water) on move-in and keep photos of the property condition.',
      'Confirm who pays society maintenance, parking and minor repairs before you move in.',
      'Get a stamped receipt for every advance / security deposit payment.',
      'Ask how many months notice is needed to vacate and whether deposit is refundable with deductions listed.',
      'Meet the actual owner or authorised landlord — avoid paying someone who cannot prove authority.',
    ],
  },
  {
    id: 'docs',
    icon: FileSearch,
    title: 'Documents worth checking',
    intro: 'Ask for copies early. Missing paperwork is a red flag.',
    points: [
      'Ownership / title papers and previous transfer deeds where available.',
      'CNIC copies of seller or landlord (and attorney, if dealing via POA).',
      'Society / authority NOC, allotment letter, or transfer letter for plots and society homes.',
      'Tax / property tax receipts and utility bill history in the owner’s name.',
      'Approved map / completion certificate for constructed homes where applicable.',
      'For apartments: developer allotment, floor plan and possession letter.',
    ],
  },
  {
    id: 'lawyer',
    icon: Scale,
    title: 'Verify with a lawyer',
    intro: 'A short legal review is cheaper than a bad deal. Use a property lawyer you trust.',
    points: [
      'Have a lawyer review title chain, POA validity and any pending litigation.',
      'Ask them to confirm that the person signing can legally sell or rent the unit.',
      'Do not sign blank forms, incomplete agreements or papers you do not understand.',
      'For larger purchases, request an independent title search before token money becomes non-refundable.',
      'Keep certified copies of everything you sign — including annexures and payment schedules.',
    ],
  },
  {
    id: 'money',
    icon: Wallet,
    title: 'Money & safety habits',
    intro: 'Protect your funds the same way you protect the property choice.',
    points: [
      'Avoid full cash deals; use traceable banking channels whenever possible.',
      'Token / bayana amounts should be written with refund conditions and deadlines.',
      'Do not share OTPs, banking passwords or CNIC scans with unverified contacts.',
      'Meet agents and owners in public or society offices for first meetings when possible.',
      'If a listing price is far below market with pressure to pay instantly, walk away.',
    ],
  },
]

export default function BeforeYouBuy() {
  return (
    <div className="bg-offwhite">
      <section className="border-b border-slate-200/80 bg-gradient-to-br from-brand-soft via-white to-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">
            First-time guidance
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Before You Buy / Rent
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A practical checklist for buyers and renters who are dealing for the first time —
            precautions, documents and legal habits that reduce risk before you commit.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { icon: ShieldCheck, label: 'Stay cautious' },
              { icon: BadgeCheck, label: 'Check papers' },
              { icon: Handshake, label: 'Verify people' },
              { icon: Scale, label: 'Ask a lawyer' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand ring-1 ring-brand/15"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-4 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {SECTIONS.map(({ id, icon: Icon, title, intro, points }) => (
          <article
            key={id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04)] sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-extrabold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm text-slate-500">{intro}</p>
              </div>
            </div>

            <ol className="mt-5 space-y-3">
              {points.map((point, index) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-offwhite text-[11px] font-extrabold text-brand">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}

        <div className="rounded-2xl border border-brand/15 bg-gradient-to-br from-brand-soft/80 via-white to-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-extrabold text-slate-900">Need help choosing?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Makaan helps you discover listings and agencies — but final legal and financial checks
            remain your responsibility. When in doubt, pause the deal and consult a qualified property
            lawyer in your city.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
            >
              Browse properties
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-brand/20 bg-white px-5 py-3 text-sm font-bold text-brand transition hover:bg-brand-soft"
            >
              Contact Makaan
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
