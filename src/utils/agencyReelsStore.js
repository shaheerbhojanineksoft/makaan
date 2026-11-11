import { useSyncExternalStore } from 'react'
import { DEMO_AGENCY_ID } from './session'

const STORAGE_KEY = 'makan-agency-reels-v1'
const listeners = new Set()

export const REEL_PROJECT_TYPES = [
  'Apartments',
  'Villas',
  'Houses',
  'Plots',
  'Commercial',
  'Farmhouses',
]

export const REEL_MIN_SECONDS = 10
export const REEL_MAX_SECONDS = 60

const SEED = [
  {
    id: 'areel-001',
    agencyId: DEMO_AGENCY_ID,
    title: 'DHA Phase 6 Villa Walkthrough',
    city: 'Karachi',
    area: 'DHA Phase 6',
    projectType: 'Villas',
    purpose: 'Sale',
    caption: '4 bed luxury villa with lawn — soft launch inventory.',
    video: '/reels/villa.mp4?v=hd2',
    poster:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    durationSec: 10,
    disabled: false,
    createdAt: '2026-11-01',
    updatedAt: '2026-11-01',
  },
  {
    id: 'areel-002',
    agencyId: DEMO_AGENCY_ID,
    title: 'Bahria Town Apartment Tour',
    city: 'Islamabad',
    area: 'Bahria Town',
    projectType: 'Apartments',
    purpose: 'Rent',
    caption: 'Ready 2 bed with open kitchen and covered parking.',
    video: '/reels/living.mp4?v=hd2',
    poster:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    durationSec: 40,
    disabled: false,
    createdAt: '2026-11-03',
    updatedAt: '2026-11-03',
  },
  {
    id: 'areel-003',
    agencyId: DEMO_AGENCY_ID,
    title: 'Clifton Sea-View Flat',
    city: 'Karachi',
    area: 'Clifton',
    projectType: 'Apartments',
    purpose: 'Rent',
    caption: 'Furnished sea-view floors with steady rental demand.',
    video: '/reels/interior.mp4?v=hd2',
    poster:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
    durationSec: 36,
    disabled: true,
    createdAt: '2026-11-05',
    updatedAt: '2026-11-08',
  },
]

function emit() {
  listeners.forEach((listener) => listener())
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED))
      return [...SEED]
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [...SEED]
  } catch {
    return [...SEED]
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  emit()
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function useAgencyReelsStore() {
  useSyncExternalStore(subscribe, getSnapshot, () => '')
}

export function getAgencyReels(agencyId = DEMO_AGENCY_ID) {
  return readAll()
    .filter((reel) => reel.agencyId === agencyId)
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
}

export function getAgencyReel(agencyId, reelId) {
  return getAgencyReels(agencyId).find((reel) => reel.id === reelId) || null
}

export function createAgencyReel(agencyId, payload) {
  const now = new Date().toISOString().slice(0, 10)
  const reel = {
    id: `areel-${Date.now()}`,
    agencyId,
    title: payload.title.trim(),
    city: payload.city,
    area: payload.area.trim(),
    projectType: payload.projectType,
    purpose: payload.purpose || 'Sale',
    caption: payload.caption.trim().slice(0, 100),
    video: payload.video,
    poster: payload.poster || '',
    durationSec: payload.durationSec || 0,
    disabled: false,
    createdAt: now,
    updatedAt: now,
  }
  writeAll([reel, ...readAll()])
  return reel
}

export function setAgencyReelDisabled(agencyId, reelId, disabled) {
  const all = readAll()
  const index = all.findIndex((reel) => reel.id === reelId && reel.agencyId === agencyId)
  if (index < 0) return null
  all[index] = {
    ...all[index],
    disabled: Boolean(disabled),
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  writeAll(all)
  return all[index]
}

export function deleteAgencyReel(agencyId, reelId) {
  writeAll(readAll().filter((reel) => !(reel.id === reelId && reel.agencyId === agencyId)))
}
