import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Headphones, ImagePlus, X } from 'lucide-react'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

const MAX_ATTACHMENTS = 2

const TOPICS = [
  'Profile / account',
  'My listings',
  'Recommendations',
  'Publishing / draft',
  'Payments / billing',
  'Other',
]

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  )
}

function readImageFiles(files, onReady, onReject) {
  const incoming = [...files]
  const rejected = incoming.filter((file) => !file.type.startsWith('image/'))
  if (rejected.length) onReject?.('Only pictures are allowed — videos and other files cannot be attached.')
  const list = incoming.filter((file) => file.type.startsWith('image/'))
  if (!list.length) return
  Promise.all(
    list.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
          reader.readAsDataURL(file)
        }),
    ),
  ).then((urls) => onReady(urls.filter(Boolean)))
}

function AttachmentUpload({ images, onChange }) {
  const [localError, setLocalError] = useState('')

  function addFiles(fileList) {
    const room = MAX_ATTACHMENTS - images.length
    if (room <= 0) {
      setLocalError(`Maximum ${MAX_ATTACHMENTS} pictures allowed.`)
      return
    }
    readImageFiles(
      fileList,
      (urls) => {
        const next = [...images, ...urls.slice(0, room)]
        onChange(next.slice(0, MAX_ATTACHMENTS))
        setLocalError('')
      },
      (message) => setLocalError(message),
    )
  }

  return (
    <div className="space-y-3">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        Attachments (optional)
      </span>
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        {images.map((url, index) => (
          <div
            key={`${url.slice(0, 48)}-${index}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200/80 bg-brand-soft shadow-sm"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-rose-600 opacity-0 shadow transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {images.length < MAX_ATTACHMENTS && (
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-brand/30 bg-brand-soft/40 text-brand transition hover:bg-brand-soft">
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs font-bold">Add picture</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files || [])
                e.target.value = ''
              }}
            />
          </label>
        )}
      </div>
      <p className="text-[11px] text-slate-400">
        Up to {MAX_ATTACHMENTS} pictures · videos not allowed · {images.length}/{MAX_ATTACHMENTS}
      </p>
      {localError ? <p className="text-xs font-bold text-rose-600">{localError}</p> : null}
    </div>
  )
}

export default function AgencyHelpSupport() {
  const { profile } = useOutletContext()
  const [form, setForm] = useState({
    subject: '',
    topic: '',
    relatedId: '',
    message: '',
    attachments: [],
    phone: profile?.phone || '',
  })
  const [sent, setSent] = useState(false)

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSent(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setForm({
      subject: '',
      topic: '',
      relatedId: '',
      message: '',
      attachments: [],
      phone: profile?.phone || '',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Support</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Help & support</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          We’re here to keep your agency running smoothly on Makaan — from profile and listings to
          recommendations and publishing.
        </p>
      </div>

      <section className="rounded-2xl border border-brand/15 bg-gradient-to-br from-brand-soft/80 via-white to-white p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
            <Headphones className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-extrabold text-slate-900">Need help & support?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Our Makaan help & support team usually replies within{' '}
              <span className="font-bold text-slate-800">2–4 working hours</span> during business days
              (9 AM – 6 PM). For urgent listing or account issues we aim to respond even faster.
            </p>
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-600">
              We treat every agency request as a first priority — profile corrections, stuck drafts,
              publishing problems, or anything that affects how clients see your brand. Our goal is to
              resolve your issue in the first contact whenever possible, with clear follow-ups until
              it’s fully fixed.
            </p>
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-600">
              When you reach out, share your agency name and listing or recommendation ID so we can look
              up the case quickly and get you back to helping clients without delay.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          <p className="text-sm text-slate-500">
            Describe your issue below. Your request will be sent to the Makaan admin team for review.
            {profile?.agency ? (
              <>
                {' '}
                Sending as <span className="font-bold text-slate-700">{profile.agency}</span>.
              </>
            ) : null}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subject">
              <input
                className={FIELD}
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                placeholder="Short summary of your issue"
                required
              />
            </Field>
            <Field label="Topic">
              <select
                className={FIELD}
                value={form.topic}
                onChange={(e) => set('topic', e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a topic
                </option>
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Listing / recommendation ID (optional)">
            <input
              className={FIELD}
              value={form.relatedId}
              onChange={(e) => set('relatedId', e.target.value)}
              placeholder="e.g. prop-012 or rec-101"
            />
          </Field>

          <Field label="Describe your issue">
            <textarea
              className={`${FIELD} min-h-[140px] resize-y`}
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder="Tell us what went wrong, what you expected, and any steps you already tried…"
              required
            />
          </Field>

          <AttachmentUpload
            images={form.attachments}
            onChange={(attachments) => set('attachments', attachments)}
          />

          <Field label="Phone number">
            <input
              className={FIELD}
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="Your contact number"
              required
            />
          </Field>

          {sent ? (
            <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm font-semibold text-brand">
              Query submitted. Our admin team will review it and get back to you.
            </p>
          ) : null}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
            >
              Submit query
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
