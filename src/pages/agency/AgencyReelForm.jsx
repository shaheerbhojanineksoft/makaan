import { useRef, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Film, X } from 'lucide-react'

import { CITIES } from '../../data/filters'
import {
  REEL_MAX_SECONDS,
  REEL_MIN_SECONDS,
  REEL_PROJECT_TYPES,
  createAgencyReel,
} from '../../utils/agencyReelsStore'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
      {hint ? <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p> : null}
    </label>
  )
}

function readVideoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('video/')) {
      reject(new Error('Please upload a video file.'))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      const durationSec = Number(video.duration) || 0
      if (durationSec < REEL_MIN_SECONDS) {
        URL.revokeObjectURL(objectUrl)
        reject(new Error(`Video must be at least ${REEL_MIN_SECONDS} seconds.`))
        return
      }
      if (durationSec > REEL_MAX_SECONDS) {
        URL.revokeObjectURL(objectUrl)
        reject(new Error(`Video cannot be longer than ${REEL_MAX_SECONDS} seconds (1 minute).`))
        return
      }

      // Capture a poster frame near 1s
      video.currentTime = Math.min(1, durationSec / 2)
    }

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 720
        canvas.height = video.videoHeight || 1280
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const poster = canvas.toDataURL('image/jpeg', 0.82)
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            video: typeof reader.result === 'string' ? reader.result : objectUrl,
            poster,
            durationSec: Number(video.duration) || 0,
            objectUrl,
          })
        }
        reader.onerror = () => reject(new Error('Could not read video file.'))
        reader.readAsDataURL(file)
      } catch {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Could not process this video.'))
      }
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not load video metadata.'))
    }

    video.src = objectUrl
  })
}

export default function AgencyReelForm() {
  const navigate = useNavigate()
  const { agencyId } = useOutletContext()
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    city: '',
    area: '',
    projectType: '',
    purpose: 'Sale',
    caption: '',
    video: '',
    poster: '',
    durationSec: 0,
  })

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  async function onPickVideo(fileList) {
    const file = fileList?.[0]
    if (!file) return
    setError('')
    try {
      const result = await readVideoFile(file)
      setForm((prev) => ({
        ...prev,
        video: result.video,
        poster: result.poster,
        durationSec: result.durationSec,
      }))
    } catch (err) {
      setError(err.message || 'Invalid video.')
      setForm((prev) => ({ ...prev, video: '', poster: '', durationSec: 0 }))
    }
  }

  function clearVideo() {
    setForm((prev) => ({ ...prev, video: '', poster: '', durationSec: 0 }))
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.video) {
      setError('Please upload a reel video.')
      return
    }
    if (form.durationSec < REEL_MIN_SECONDS || form.durationSec > REEL_MAX_SECONDS) {
      setError(`Video must be between ${REEL_MIN_SECONDS} and ${REEL_MAX_SECONDS} seconds.`)
      return
    }

    setSaving(true)
    createAgencyReel(agencyId, form)
    navigate('/agency/reels', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Content</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Create reel</h1>
          <p className="mt-2 text-sm text-slate-500">
            Add a short property video with city, area and project details.
          </p>
        </div>
        <Link
          to="/agency/reels"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to reels
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Video</p>
          {form.video ? (
            <div className="relative mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-black">
              <video
                src={form.video}
                poster={form.poster}
                controls
                muted
                playsInline
                className="mx-auto max-h-80 w-full object-contain"
              />
              <button
                type="button"
                onClick={clearVideo}
                className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-rose-600 shadow"
                aria-label="Remove video"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="bg-slate-900/80 px-4 py-2 text-xs font-semibold text-white">
                Duration: {Math.round(form.durationSec)}s (allowed {REEL_MIN_SECONDS}–{REEL_MAX_SECONDS}s)
              </p>
            </div>
          ) : (
            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-brand/30 bg-brand-soft/40 px-4 py-10 text-brand transition hover:bg-brand-soft">
              <Film className="h-7 w-7" />
              <span className="text-sm font-bold">Upload reel video</span>
              <span className="text-xs font-semibold text-brand/70">
                MP4 / MOV · {REEL_MIN_SECONDS}s minimum · {REEL_MAX_SECONDS}s max
              </span>
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  onPickVideo(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input
              className={FIELD}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. DHA Phase 6 Villa Walkthrough"
              required
            />
          </Field>
          <Field label="Purpose">
            <select
              className={FIELD}
              value={form.purpose}
              onChange={(e) => set('purpose', e.target.value)}
              required
            >
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City">
            <select
              className={FIELD}
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              required
            >
              <option value="" disabled>
                Select city
              </option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Area">
            <input
              className={FIELD}
              value={form.area}
              onChange={(e) => set('area', e.target.value)}
              placeholder="e.g. DHA Phase 6, Gulberg, F-7"
              required
            />
          </Field>
        </div>

        <Field label="Project type">
          <select
            className={FIELD}
            value={form.projectType}
            onChange={(e) => set('projectType', e.target.value)}
            required
          >
            <option value="" disabled>
              Select project type
            </option>
            {REEL_PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Caption"
          hint={`${form.caption.length}/100 characters · keep it short for the reel.`}
        >
          <textarea
            className={`${FIELD} min-h-[100px] resize-y`}
            value={form.caption}
            onChange={(e) => set('caption', e.target.value.slice(0, 100))}
            placeholder="Tell buyers what makes this property worth watching…"
            maxLength={100}
            required
          />
        </Field>

        {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}

        <div className="flex justify-end gap-3 pt-1">
          <Link
            to="/agency/reels"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? 'Publishing…' : 'Publish reel'}
          </button>
        </div>
      </form>
    </div>
  )
}
