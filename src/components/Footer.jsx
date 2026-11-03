import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'
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
    <li className="flex items-start gap-3.5">
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-soft ring-1 ring-white/10">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 pt-1.5 text-[15px] leading-snug font-medium text-brand-soft/90">
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

      <div className="relative flex w-full flex-col gap-12 px-4 py-16 sm:px-5 sm:py-20 lg:flex-row lg:items-start lg:justify-between lg:gap-20 lg:px-6 lg:py-20 xl:px-8">
        {/* Brand + contact — left edge */}
        <div className="max-w-lg shrink-0">
          <Logo variant="dark" className="scale-110 origin-left" />

          <p className="mt-7 max-w-md font-display text-xl leading-snug font-bold text-balance text-white sm:text-2xl">
            Pakistan ka Apna Trusted Property Portal
          </p>
          <p className="mt-3 max-w-md text-base leading-relaxed text-brand-soft/80">
            Verified listings, licensed agents and transparent advanced booking — from Karachi to
            Gwadar.
          </p>

          <ul className="mt-8 space-y-4">
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
          </ul>
        </div>

        {/* Newsletter — right edge */}
        <div className="w-full max-w-md shrink-0 lg:ml-auto">
          <p className="text-xs font-extrabold tracking-[0.22em] text-brand-soft/70 uppercase">
            Stay updated
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">
            Property Alerts
          </h3>
          <p className="mt-3 text-base leading-relaxed text-brand-soft/80">
            New listings and project launches, straight to your inbox. No spam.
          </p>

          <form
            className="mt-7 space-y-3"
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
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-base text-white placeholder:text-brand-soft/50 outline-none transition focus:border-white/40 focus:bg-white/15"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-white px-5 py-3.5 text-base font-extrabold text-brand shadow-lg shadow-brand-dark/30 transition hover:-translate-y-0.5 hover:bg-brand-soft"
            >
              Subscribe
            </button>
          </form>

          <div className="mt-8 flex gap-3">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-brand-soft ring-1 ring-white/10 transition hover:bg-white hover:text-brand hover:ring-white"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/15">
        <div className="flex w-full flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-brand-soft/75 sm:flex-row sm:px-5 lg:px-6 xl:px-8">
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
