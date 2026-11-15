import { useSyncExternalStore } from 'react'
import { DEMO_AGENCY_ID } from './session'

const STORAGE_KEY = 'makan-agency-client-queries-v2'
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

function readAll() {
  return readJson(STORAGE_KEY, {})
}

function seedForAgency(agencyId) {
  const now = Date.now()
  return [
    {
      id: `cq-${agencyId}-001`,
      agencyId,
      listingId: 'prop-001',
      name: 'Sara Khan',
      phone: '+92 300 5551234',
      email: 'sara.khan@email.com',
      message: 'Interested in a weekend viewing. Is the villa available for rent or only sale?',
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: `cq-${agencyId}-002`,
      agencyId,
      listingId: 'plot-001',
      name: 'Bilal Ahmed',
      phone: '+92 321 7778899',
      email: 'bilal.ahmed@email.com',
      message: 'Please share transfer timeline and current dues status.',
      createdAt: new Date(now - 1000 * 60 * 60 * 28).toISOString(),
    },
    {
      id: `cq-${agencyId}-003`,
      agencyId,
      listingId: 'prop-002',
      name: 'Omar Farooq',
      phone: '+92 333 1122334',
      email: 'omar@email.com',
      message: 'Looking for immediate possession. Can we schedule a call tomorrow morning?',
      createdAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
    },
  ]
}

function ensureAgencyQueries(agencyId) {
  const all = readAll()
  if (Array.isArray(all[agencyId])) return all[agencyId]
  const seeded = seedForAgency(agencyId)
  all[agencyId] = seeded
  writeJson(STORAGE_KEY, all)
  return seeded
}

export function getClientQueries(agencyId = DEMO_AGENCY_ID) {
  const list = ensureAgencyQueries(agencyId)
  return [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export function createClientQuery(payload) {
  const agencyId = payload.agencyId || DEMO_AGENCY_ID
  const all = readAll()
  const list = ensureAgencyQueries(agencyId)
  const next = {
    id: `cq-${agencyId}-${Date.now()}`,
    agencyId,
    listingId: payload.listingId || '',
    name: String(payload.name || '').trim(),
    phone: String(payload.phone || '').trim(),
    email: String(payload.email || '').trim(),
    message: String(payload.message || '').trim(),
    createdAt: new Date().toISOString(),
  }
  all[agencyId] = [next, ...list]
  writeJson(STORAGE_KEY, all)
  return next
}

export function useClientQueriesStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => '')
}
