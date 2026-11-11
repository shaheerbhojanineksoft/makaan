import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Ban, CheckCircle2, Clapperboard, PlusCircle, Trash2 } from 'lucide-react'

import {
  deleteAgencyReel,
  getAgencyReels,
  setAgencyReelDisabled,
  useAgencyReelsStore,
} from '../../utils/agencyReelsStore'

export default function AgencyReels() {
  useAgencyReelsStore()
  const { agencyId } = useOutletContext()
  const [, refresh] = useState(0)
  const reels = getAgencyReels(agencyId)

  function bump() {
    refresh((n) => n + 1)
  }

  function onToggleDisabled(reel) {
    const nextDisabled = !reel.disabled
    const message = nextDisabled
      ? 'Disable this reel from public Reels feed?'
      : 'Enable this reel again on public Reels?'
    if (!window.confirm(message)) return
    setAgencyReelDisabled(agencyId, reel.id, nextDisabled)
    bump()
  }

  function onDelete(reel) {
    if (!window.confirm(`Delete reel “${reel.title}”? This cannot be undone.`)) return
    deleteAgencyReel(agencyId, reel.id)
    bump()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Content</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">My reels</h1>
          <p className="mt-2 text-sm text-slate-500">
            Upload short property videos (10–60 seconds) for the Makaan Reels feed.
          </p>
        </div>
        <Link
          to="/agency/reels/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          <PlusCircle className="h-4 w-4" />
          Create reel
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Reel</th>
                <th className="px-4 py-3.5">City</th>
                <th className="px-4 py-3.5">Area</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reels.map((reel) => {
                const isDisabled = Boolean(reel.disabled)
                return (
                  <tr
                    key={reel.id}
                    className={`hover:bg-slate-50/80 ${isDisabled ? 'bg-slate-50/60 opacity-80' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-10 overflow-hidden rounded-lg bg-brand-soft">
                          {reel.poster || reel.video ? (
                            <img
                              src={reel.poster || reel.video}
                              alt=""
                              className={`h-full w-full object-cover ${isDisabled ? 'grayscale' : ''}`}
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-brand">
                              <Clapperboard className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">{reel.title}</p>
                          <p className="truncate text-xs text-slate-500">{reel.purpose}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{reel.city}</td>
                    <td className="px-4 py-3 text-slate-600">{reel.area}</td>
                    <td className="px-4 py-3 text-slate-600">{reel.projectType}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {reel.durationSec ? `${Math.round(reel.durationSec)}s` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                          isDisabled ? 'bg-slate-200 text-slate-600' : 'bg-brand-soft text-brand'
                        }`}
                      >
                        {isDisabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleDisabled(reel)}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold ${
                            isDisabled
                              ? 'border-brand/20 text-brand hover:bg-brand-soft'
                              : 'border-amber-200 text-amber-700 hover:bg-amber-50'
                          }`}
                        >
                          {isDisabled ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Enable
                            </>
                          ) : (
                            <>
                              <Ban className="h-3.5 w-3.5" />
                              Disable
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(reel)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {reels.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No reels yet. Create your first property reel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
