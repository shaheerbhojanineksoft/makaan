import { ArrowRight } from 'lucide-react'

const STORE_LINKS = {
  apple: 'https://apps.apple.com',
  google: 'https://play.google.com/store',
}

function AppleStoreBadge() {
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-auto" aria-hidden="true">
      <path
        fill="currentColor"
        d="M24.7 20.3c0-3.4 2.8-5.1 2.9-5.2-1.6-2.3-4-2.6-4.9-2.7-2.1-.2-4 1.2-5.1 1.2-1.1 0-2.7-1.2-4.4-1.2-2.3 0-4.4 1.3-5.5 3.4-2.4 4.1-.6 10.2 1.7 13.5 1.1 1.6 2.5 3.5 4.2 3.4 1.7-.1 2.3-1.1 4.4-1.1s2.6 1.1 4.4 1c1.8-.1 3-1.7 4.1-3.3 1.3-1.9 1.8-3.7 1.8-3.8-.1 0-3.5-1.3-3.6-5.2zm-3.4-9.8c.9-1.1 1.5-2.7 1.4-4.2-1.3.1-2.9.9-3.9 2-0.9 1-1.6 2.6-1.4 4.1 1.5.1 3-.8 3.9-1.9z"
      />
      <text x="38" y="15" fill="currentColor" fontSize="7" fontFamily="system-ui,sans-serif">
        Download on the
      </text>
      <text x="38" y="28" fill="currentColor" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">
        App Store
      </text>
    </svg>
  )
}

function GooglePlayBadge() {
  return (
    <svg viewBox="0 0 135 40" className="h-10 w-auto" aria-hidden="true">
      <path fill="#EA4335" d="M8.5 6.2 22.8 20 8.5 33.8c-.7-.4-1.1-1.1-1.1-2V8.2c0-.9.4-1.6 1.1-2z" />
      <path fill="#FBBC04" d="M22.8 20 27.4 15.6 8.5 6.2c.3-.2.7-.3 1.1-.3.5 0 1 .1 1.5.4L22.8 20z" />
      <path fill="#4285F4" d="M22.8 20 11.1 33.5c-.5.3-1 .4-1.5.4-.4 0-.8-.1-1.1-.3L22.8 20z" />
      <path fill="#34A853" d="M27.4 15.6 22.8 20l4.6 4.4c1.1-.7 1.8-1.9 1.8-3.2s-.7-2.5-1.8-3.2z" />
      <text x="36" y="15" fill="currentColor" fontSize="7" fontFamily="system-ui,sans-serif">
        GET IT ON
      </text>
      <text x="36" y="28" fill="currentColor" fontSize="13" fontWeight="700" fontFamily="system-ui,sans-serif">
        Google Play
      </text>
    </svg>
  )
}

/**
 * Pre-footer app download strip — shown above Footer on every screen.
 * One continuous soft brand surface (no patched photo plates).
 */
export default function GetTheApp() {
  return (
    <section className="relative isolate overflow-hidden border-t border-brand/10 bg-gradient-to-b from-brand-soft to-white">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr_1fr] lg:gap-4 lg:px-8 lg:py-10">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <p className="text-[11px] font-extrabold tracking-[0.22em] text-brand uppercase">
            Mobile app
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-brand sm:text-4xl">
            Get the Makaan App
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 lg:mx-0 sm:text-base">
            Buy, rent and explore verified properties faster — homes, plots and villas in your pocket.
          </p>
        </div>

        {/* Phone cutout — light plate blends into the section */}
        <div className="relative mx-auto flex max-w-[210px] justify-center sm:max-w-[240px]">
          <img
            src="/makaan-app-phone.jpg"
            alt="Makaan mobile app preview"
            className="w-full mix-blend-darken"
          />
        </div>

        {/* Stores + QR */}
        <div className="flex flex-col items-center gap-5 lg:items-start">
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href={STORE_LINKS.apple}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Download Makaan on the App Store"
              className="inline-flex items-center rounded-xl bg-slate-950 px-3.5 py-2 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black"
            >
              <AppleStoreBadge />
            </a>
            <a
              href={STORE_LINKS.google}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Get Makaan on Google Play"
              className="inline-flex items-center rounded-xl bg-slate-950 px-3.5 py-2 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-black"
            >
              <GooglePlayBadge />
            </a>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
            <p className="max-w-[9.5rem] text-left text-xs font-semibold leading-snug text-slate-700 sm:text-sm">
              Scan the QR code to get the app
            </p>
            <ArrowRight className="hidden h-4 w-4 shrink-0 text-brand sm:block" aria-hidden="true" />
            <img
              src="/makaan-app-qr.png"
              alt="QR code to download Makaan app"
              className="h-20 w-20 rounded-lg bg-white p-1 ring-1 ring-slate-200"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
