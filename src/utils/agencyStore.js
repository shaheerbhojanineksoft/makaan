import { useSyncExternalStore } from 'react'
import { featuredAgents } from '../data/agents'
import { freshProperties } from '../data/properties'
import { featuredPlots } from '../data/plots'
import { bookingProjects } from '../data/projects'
import { DEMO_AGENCY_ID } from './session'

const PROFILE_KEY = 'makan-agency-profiles-v1'
const LISTINGS_KEY = 'makan-agency-listings-v1'
const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

function readJson(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null')
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  emit()
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key === PROFILE_KEY || event.key === LISTINGS_KEY || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function getSnapshot() {
  return `${localStorage.getItem(PROFILE_KEY) || ''}|${localStorage.getItem(LISTINGS_KEY) || ''}`
}

/** Merge base agent with any agency-panel overrides. */
export function getAgencyProfile(agencyId = DEMO_AGENCY_ID) {
  const base = featuredAgents.find((agent) => agent.id === agencyId)
  if (!base) return null
  const overrides = readJson(PROFILE_KEY, {})
  return { ...base, ...(overrides[agencyId] || {}) }
}

/** All agents with agency-panel profile overrides applied. */
export function getMergedAgents() {
  const overrides = readJson(PROFILE_KEY, {})
  return featuredAgents.map((agent) =>
    overrides[agent.id] ? { ...agent, ...overrides[agent.id] } : agent,
  )
}

export function updateAgencyProfile(agencyId, patch) {
  const overrides = readJson(PROFILE_KEY, {})
  overrides[agencyId] = { ...(overrides[agencyId] || {}), ...patch }
  writeJson(PROFILE_KEY, overrides)
  return getAgencyProfile(agencyId)
}

const EXTRA_GALLERY = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cd00?auto=format&fit=crop&w=900&q=80',
]

function buildGallery(cover, offset = 0) {
  const extras = EXTRA_GALLERY.filter((url) => url !== cover)
  const picked = [
    extras[offset % extras.length],
    extras[(offset + 1) % extras.length],
    extras[(offset + 2) % extras.length],
  ].filter(Boolean)
  return [cover, ...picked].filter((url, index, list) => url && list.indexOf(url) === index)
}

/** Normalize listing media — cover + optional gallery. */
export function getListingImages(listing) {
  if (!listing) return []
  const fromGallery = Array.isArray(listing.images) ? listing.images.filter(Boolean) : []
  const cover = listing.image
  const merged = [...(cover ? [cover] : []), ...fromGallery]
  return merged.filter((url, index, list) => list.indexOf(url) === index)
}

function seedListingsForAgency(agencyId) {
  const agent = featuredAgents.find((item) => item.id === agencyId)
  const props = freshProperties
    .filter((item) => item.agentId === agencyId)
    .map((item, index) => ({
      ...item,
      kind: 'property',
      ownedByAgency: true,
      images: item.images?.length ? item.images : buildGallery(item.image, index),
    }))
  const plots = featuredPlots
    .filter((item) => item.agentId === agencyId)
    .map((item, index) => ({
      id: item.id,
      kind: 'plot',
      title: item.title,
      location: item.location,
      city: item.city,
      purpose: 'sale',
      propertyType: `${item.plotType} Plot`,
      price: item.price,
      beds: 0,
      baths: 0,
      area: item.size,
      image: item.image,
      images: buildGallery(item.image, index + 2),
      listedAt: item.listedOn || new Date().toISOString(),
      description: item.description,
      highlights: item.highlights || [],
      agentId: agencyId,
      agent: agent
        ? { name: agent.name, agency: agent.agency, avatar: agent.avatar }
        : undefined,
      ownedByAgency: true,
      plotType: item.plotType,
      size: item.size,
      tags: item.tags || [],
    }))
  return [...props, ...plots]
}

function readAllListings() {
  return readJson(LISTINGS_KEY, {})
}

function ensureAgencyListings(agencyId) {
  const all = readAllListings()
  if (!all[agencyId]) {
    all[agencyId] = seedListingsForAgency(agencyId)
    writeJson(LISTINGS_KEY, all)
  }
  return all[agencyId]
}

export function getAgencyListings(agencyId = DEMO_AGENCY_ID) {
  const list = ensureAgencyListings(agencyId)
  let changed = false
  const next = list.map((item, index) => {
    if (item.images != null) return item
    changed = true
    return {
      ...item,
      images: item.image ? buildGallery(item.image, index) : [],
    }
  })
  if (changed) {
    const all = readAllListings()
    all[agencyId] = next
    writeJson(LISTINGS_KEY, all)
    return next
  }
  return list
}

export function getAgencyListingById(agencyId, id) {
  return getAgencyListings(agencyId).find((item) => item.id === id) || null
}

export function upsertAgencyListing(agencyId, listing) {
  const all = readAllListings()
  const list = ensureAgencyListings(agencyId)
  const index = list.findIndex((item) => item.id === listing.id)
  const agent = getAgencyProfile(agencyId)
  const next = {
    ...listing,
    agentId: agencyId,
    ownedByAgency: true,
    agent: agent
      ? { name: agent.name, agency: agent.agency, avatar: agent.avatar }
      : listing.agent,
    updatedAt: new Date().toISOString(),
  }
  if (index >= 0) list[index] = { ...list[index], ...next }
  else list.unshift({ ...next, listedAt: next.listedAt || new Date().toISOString() })
  all[agencyId] = list
  writeJson(LISTINGS_KEY, all)
  return next
}

export function deleteAgencyListing(agencyId, id) {
  const all = readAllListings()
  const list = ensureAgencyListings(agencyId).filter((item) => item.id !== id)
  all[agencyId] = list
  writeJson(LISTINGS_KEY, all)
}

/** Temporarily hide a listing from the public site without deleting it. */
export function setAgencyListingDisabled(agencyId, id, disabled) {
  const all = readAllListings()
  const list = ensureAgencyListings(agencyId)
  const index = list.findIndex((item) => item.id === id)
  if (index < 0) return null
  list[index] = {
    ...list[index],
    disabled: Boolean(disabled),
    updatedAt: new Date().toISOString(),
  }
  all[agencyId] = list
  writeJson(LISTINGS_KEY, all)
  return list[index]
}

/** Public catalog merge — agency-owned overrides + extra listings. */
export function getMergedProperties() {
  const byId = new Map(freshProperties.map((item) => [item.id, item]))
  const all = readAllListings()
  Object.values(all).forEach((list) => {
    list.forEach((item) => {
      if (item.kind === 'plot' || item.kind === 'booking') return
      if (item.disabled) {
        byId.delete(item.id)
        return
      }
      const sizeLabel = formatSizeLabel(item.size) || item.area || ''
      byId.set(item.id, {
        ...item,
        purpose: item.purpose === 'buy' ? 'sale' : item.purpose,
        propertyType: propertyTypeLabel(item.propertyType) || item.propertyType,
        area: sizeLabel,
        beds: item.bedrooms ?? item.beds ?? 0,
        baths: item.bathrooms ?? item.baths ?? 0,
        image: item.image || item.images?.[0],
      })
    })
  })
  return [...byId.values()]
}

export function getMergedPlots() {
  const byId = new Map(featuredPlots.map((item) => [item.id, item]))
  const all = readAllListings()
  Object.values(all).forEach((list) => {
    list.forEach((item) => {
      if (item.kind !== 'plot') return
      if (item.disabled) {
        byId.delete(item.id)
        return
      }
      const sizeLabel = formatSizeLabel(item.size) || item.area || item.size
      byId.set(item.id, {
        id: item.id,
        title: item.title,
        location: item.location,
        city: item.city,
        size: typeof sizeLabel === 'string' ? sizeLabel : formatSizeLabel(sizeLabel),
        plotType: 'Residential',
        propertyType: 'plot',
        price: item.price,
        pricePerUnit: item.pricePerUnit || '',
        image: item.image || item.images?.[0],
        images: item.images || [],
        gallery: item.images || item.gallery || [],
        tags: item.possession === true ? ['Possession'] : item.tags || [],
        agentId: item.agentId,
        description: item.description || item.about || '',
        highlights: item.highlights || [],
        plotNumber: item.plotNo || item.plotNumber,
        dimensions: item.dimensions,
        possession: item.possession === true ? 'Possession granted' : item.possession === false ? 'Not ready' : item.possession,
        ownership: item.ownership,
        listedOn: item.listedAt,
        updatedOn: item.updatedAt || item.listedAt,
      })
    })
  })
  return [...byId.values()]
}

export function getMergedProjects() {
  const byId = new Map(bookingProjects.map((item) => [item.id, item]))
  const all = readAllListings()
  Object.values(all).forEach((list) => {
    list.forEach((item) => {
      if (item.kind !== 'booking') return
      if (item.disabled) {
        byId.delete(item.id)
        return
      }
      byId.set(item.id, {
        ...item,
        name: item.name || item.title,
        startingPrice: item.startingPrice ?? item.price,
        image: item.image,
        gallery: item.images?.length ? item.images : item.gallery || [item.image].filter(Boolean),
      })
    })
  })
  return [...byId.values()]
}

export function createListingId(kind = 'property') {
  if (kind === 'plot') return `plot-agency-${Date.now()}`
  if (kind === 'booking') return `prj-agency-${Date.now()}`
  return `prop-agency-${Date.now()}`
}

export function useAgencyStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => '|')
}

export const LISTING_KINDS = [
  { value: 'property', label: 'Property' },
  { value: 'plot', label: 'Plot' },
]

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'studio_apartment', label: 'Studio Apartment' },
  { value: 'shop', label: 'Shop' },
  { value: 'office', label: 'Office' },
  { value: 'portion', label: 'Portion' },
  { value: 'farmhouse', label: 'Farmhouse' },
  { value: 'building', label: 'Building' },
]

export const PLOT_PROPERTY_TYPE = 'plot'

export const SIZE_AREA_OPTIONS = [
  { value: 'marla', label: 'Marla' },
  { value: 'kanal', label: 'Kanal' },
  { value: 'sq', label: 'Sq' },
]

export const PURPOSE_OPTIONS = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
]

export const PROPERTY_AMENITIES = [
  'Parking',
  'Gym',
  'Swimming Pool',
  'Security',
  'Park',
  'Mosque',
  'School',
  'Club House',
  'Elevator',
  'Backup Generator',
  'CCTV',
  'Servant Quarter',
  'Terrace',
  'Garden',
  'Furnished',
  'Air Conditioning',
]

/** @deprecated */
export const LISTING_TYPES = PROPERTY_TYPE_OPTIONS.map((item) => item.label)
export const PROPERTY_LISTING_TYPES = LISTING_TYPES

export const MAX_LISTING_IMAGES = 10
export const MIN_LISTING_IMAGES = 1
export const MAX_HIGHLIGHT_TAGS = 8
export const MIN_HIGHLIGHT_CHARS = 25
export const MAX_ABOUT_WORDS = 1000

export function formatSizeLabel(size) {
  if (!size) return ''
  if (typeof size === 'string') return size
  const area = size.area || 'marla'
  const unit = size.unit ?? ''
  const areaLabel = SIZE_AREA_OPTIONS.find((item) => item.value === area)?.label || area
  return `${unit} ${areaLabel}`.trim()
}

export function propertyTypeLabel(value) {
  if (!value) return ''
  if (value === PLOT_PROPERTY_TYPE) return 'Plot'
  return PROPERTY_TYPE_OPTIONS.find((item) => item.value === value)?.label || value
}
