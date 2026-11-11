import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Scale, Youtube } from 'lucide-react'
import Logo from './ui/Logo'
import { SITE } from '../data/siteConfig'

const SOCIALS = [
  { label: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { label: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
]

function ContactRow({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-soft ring-1 ring-white/10">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 pt-1.5 text-sm leading-snug font-medium text-brand-soft/90">
        {children}
      </div>
    </li>
  )
}

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-brand text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden="true"
      />

      <div className="relative grid w-full grid-cols-1 gap-8 px-4 py-10 sm:px-5 sm:py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:px-6 lg:py-12 xl:px-8">
        {/* Column 1 — Brand */}
        <div className="pl-5 sm:pl-6 lg:pl-8">
          <Logo variant="dark" className="origin-left scale-100" />

          <p className="mt-5 max-w-sm font-display text-lg leading-snug font-bold text-balance text-white sm:text-xl">
            Pakistan ka Apna Trusted Property Portal
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-soft/80">
            Verified listings, licensed agents and transparent advanced booking — from Karachi to
            Gwadar.
          </p>
        </div>

        {/* Column 2 — Contact */}
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.22em] text-brand-soft/70 uppercase">
            Contact
          </p>
          <h3 className="mt-1.5 font-display text-xl font-extrabold text-white sm:text-2xl">
            Get in touch
          </h3>

          <ul className="mt-5 space-y-3">
            <ContactRow icon={Phone}>
              <a
                href={`tel:${SITE.supportPhone.replace(/\s/g, '')}`}
                className="transition hover:text-white"
              >
                {SITE.supportPhone}
              </a>
            </ContactRow>
            <ContactRow icon={Mail}>
              <a href={`mailto:${SITE.supportEmail}`} className="break-all transition hover:text-white">
                {SITE.supportEmail}
              </a>
            </ContactRow>
            <ContactRow icon={MapPin}>
              <span>Head Office: Shahrah-e-Faisal, Karachi, Pakistan</span>
            </ContactRow>
            <ContactRow icon={Scale}>
              <Link to="/trusted-lawyers" className="transition hover:text-white">
                Talk to our trusted lawyers
              </Link>
            </ContactRow>
          </ul>

          <div className="mt-5 flex gap-2.5">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-brand-soft ring-1 ring-white/10 transition hover:bg-white hover:text-brand hover:ring-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 — Newsletter */}
        <div className="md:col-span-2 lg:col-span-1">
          <p className="text-[11px] font-extrabold tracking-[0.22em] text-brand-soft/70 uppercase">
            Stay updated
          </p>
          <h3 className="mt-1.5 font-display text-xl font-extrabold text-white sm:text-2xl">
            Property Alerts
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-soft/80">
            New listings and project launches, straight to your inbox. No spam.
          </p>

          <form
            className="mt-5 flex max-w-[16.5rem] flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              /* TODO: POST /api/newsletter */
            }}
          >
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm leading-none text-white placeholder:text-brand-soft/50 outline-none transition focus:border-white/40 focus:bg-white/15"
            />
            <button
              type="submit"
              className="h-10 w-full rounded-lg bg-white px-4 text-sm font-extrabold text-brand shadow-md shadow-brand-dark/25 transition hover:bg-brand-soft"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="relative border-t border-white/15">
        <div className="flex w-full flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-brand-soft/75 sm:flex-row sm:px-5 lg:px-6 xl:px-8">
          <p className="font-medium">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2 font-medium">
            Made in Pakistan <span aria-hidden="true">🇵🇰</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
