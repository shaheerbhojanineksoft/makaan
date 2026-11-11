import { Link, useOutletContext } from 'react-router-dom'
import {
  Ban,
  Bath,
  BedDouble,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Maximize,
  Pencil,
  PlusCircle,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
  deleteAgencyListing,
  formatSizeLabel,
  getAgencyListings,
  getListingImages,
  propertyTypeLabel,
  setAgencyListingDisabled,
  useAgencyStore,
} from '../../utils/agencyStore'
import { formatPKR } from '../../utils/format'

function DetailItem({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div>
      <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function ListingImageSwiper({ images }) {
  const slides = images.length ? images : []
  const [index, setIndex] = useState(0)
  const total = slides.length
  const current = slides[Math.min(index, Math.max(total - 1, 0))] || ''

  useEffect(() => {
    setIndex(0)
  }, [total, slides[0]])

  if (!total) {
    return <div className="aspect-[16/9] bg-brand-soft" />
  }

  function go(delta) {
    setIndex((value) => (value + delta + total) % total)
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-brand-soft">
      <img
        key={current}
        src={current}
        alt=""
        className="h-full w-full object-cover transition duration-300"
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand shadow-md transition hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand shadow-md transition hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((url, slideIndex) => (
              <button
                key={`${url}-${slideIndex}`}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Go to image ${slideIndex + 1}`}
                className={`h-2 rounded-full transition ${
                  slideIndex === index ? 'w-5 bg-white' : 'w-2 bg-white/55 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <span className="absolute right-14 bottom-3 rounded-full bg-slate-900/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            {index + 1} / {total}
          </span>
        </>
      )}
    </div>
  )
}

function ListingDetailModal({ listing, onClose }) {
  const isDisabled = Boolean(listing.disabled)
  const isPlot = listing.kind === 'plot' || String(listing.propertyType || '').toLowerCase().includes('plot')
  const images = useMemo(() => getListingImages(listing), [listing])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close listing details"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="relative">
          <ListingImageSwiper images={images} />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-slate-600 shadow-sm transition hover:bg-white hover:text-brand"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-extrabold text-white uppercase">
              {listing.purpose === 'rent' ? 'For Rent' : 'For Buy'}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                isDisabled ? 'bg-slate-200 text-slate-600' : 'bg-white text-brand'
              }`}
            >
              {isDisabled ? 'Disabled' : 'Active'}
            </span>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-brand uppercase">
              {propertyTypeLabel(listing.propertyType) || listing.propertyType}
            </p>
            <h2
              id="listing-detail-title"
              className="mt-1 font-display text-2xl font-extrabold text-slate-900"
            >
              {listing.title}
            </h2>
            {listing.projectName && (
              <p className="mt-1 text-sm font-semibold text-slate-500">{listing.projectName}</p>
            )}
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-brand" />
              {listing.location}
              {listing.city ? `, ${listing.city}` : ''}
            </p>
            <p className="mt-3 font-display text-2xl font-extrabold text-brand">
              {formatPKR(listing.price)}
              {listing.purpose === 'rent' && (
                <span className="text-sm font-bold text-slate-400"> /month</span>
              )}
            </p>
          </div>

          <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2">
            <DetailItem label="Type" value={propertyTypeLabel(listing.propertyType) || listing.propertyType} />
            <DetailItem label="Purpose" value={listing.purpose === 'rent' ? 'Rent' : 'Buy'} />
            <DetailItem label="City" value={listing.city} />
            <DetailItem label="Size" value={formatSizeLabel(listing.size) || listing.area} />
            {!isPlot && (
              <>
                <DetailItem
                  label="Bedrooms"
                  value={listing.bedrooms != null || listing.beds != null ? String(listing.bedrooms ?? listing.beds) : ''}
                />
                <DetailItem
                  label="Bathrooms"
                  value={listing.bathrooms != null || listing.baths != null ? String(listing.bathrooms ?? listing.baths) : ''}
                />
                <DetailItem
                  label="Parking"
                  value={listing.parking != null ? String(listing.parking) : ''}
                />
                <DetailItem
                  label="Amenities"
                  value={Array.isArray(listing.amenities) ? listing.amenities.join(', ') : listing.amenities}
                />
              </>
            )}
            {isPlot && (
              <>
                <DetailItem label="Plot no" value={listing.plotNo || listing.plotNumber} />
                <DetailItem label="Dimensions" value={listing.dimensions} />
                <DetailItem label="Ownership" value={listing.ownership} />
                <DetailItem
                  label="Possession"
                  value={
                    listing.possession === true
                      ? 'Yes'
                      : listing.possession === false
                        ? 'No'
                        : listing.possession
                  }
                />
              </>
            )}
          </div>

          {!isPlot && ((listing.bedrooms ?? listing.beds) > 0 || (listing.bathrooms ?? listing.baths) > 0) && (
            <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
              {(listing.bedrooms ?? listing.beds) > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4 text-brand" />
                  {listing.bedrooms ?? listing.beds} Beds
                </span>
              )}
              {(listing.bathrooms ?? listing.baths) > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-brand" />
                  {listing.bathrooms ?? listing.baths} Baths
                </span>
              )}
              {(formatSizeLabel(listing.size) || listing.area) && (
                <span className="inline-flex items-center gap-1.5">
                  <Maximize className="h-4 w-4 text-brand" />
                  {formatSizeLabel(listing.size) || listing.area}
                </span>
              )}
            </div>
          )}

          {(listing.about || listing.description) && (
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
                {isPlot ? 'About this plot' : 'About this property'}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {listing.about || listing.description}
              </p>
            </div>
          )}

          {Array.isArray(listing.highlights) && listing.highlights.length > 0 && (
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">Highlights</p>
              <ul className="mt-2 space-y-1.5">
                {listing.highlights.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Link
              to={`/agency/listings/${listing.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark"
            >
              <Pencil className="h-4 w-4" />
              Edit listing
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AgencyListings() {
  useAgencyStore()
  const { agencyId } = useOutletContext()
  const [tick, setTick] = useState(0)
  const [selected, setSelected] = useState(null)
  const listings = getAgencyListings(agencyId)
  void tick

  function refresh() {
    setTick((value) => value + 1)
  }

  function onDelete(id) {
    if (!window.confirm('Delete this listing?')) return
    deleteAgencyListing(agencyId, id)
    if (selected?.id === id) setSelected(null)
    refresh()
  }

  function onToggleDisabled(item) {
    const nextDisabled = !item.disabled
    const message = nextDisabled
      ? 'Disable this listing temporarily? It will hide from the public site.'
      : 'Enable this listing again on the public site?'
    if (!window.confirm(message)) return
    setAgencyListingDisabled(agencyId, item.id, nextDisabled)
    refresh()
    if (selected?.id === item.id) {
      setSelected({ ...item, disabled: nextDisabled })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Inventory</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">My listings</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create and update houses, villas, apartments, plots and more.
          </p>
        </div>
        <Link
          to="/agency/listings/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
        >
          <PlusCircle className="h-4 w-4" />
          Add listing
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-soft/60 text-sm font-extrabold tracking-wide text-brand uppercase">
              <tr>
                <th className="px-4 py-3.5">Listing</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">City</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map((item) => {
                const isDisabled = Boolean(item.disabled)
                const kind = item.kind === 'plot' ? 'Plot' : 'Property'
                const typeLabel = propertyTypeLabel(item.propertyType) || item.propertyType || '—'
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 ${isDisabled ? 'bg-slate-50/60 opacity-80' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || item.images?.[0]}
                          alt=""
                          className={`h-16 w-[4.75rem] rounded-lg object-cover ${isDisabled ? 'grayscale' : ''}`}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">{item.title}</p>
                          <p className="truncate text-xs text-slate-500">{item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{kind}</td>
                    <td className="px-4 py-3 text-slate-600">{typeLabel}</td>
                    <td className="px-4 py-3 text-slate-600">{item.city}</td>
                    <td className="px-4 py-3 font-bold text-brand">{formatPKR(item.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                          isDisabled
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-brand-soft text-brand'
                        }`}
                      >
                        {isDisabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <Link
                          to={`/agency/listings/${item.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-brand hover:bg-brand-soft"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => onToggleDisabled(item)}
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
                          onClick={() => onDelete(item.id)}
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
              {listings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No listings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ListingDetailModal listing={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
