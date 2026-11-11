import { useSyncExternalStore } from 'react'

import { clearBuyerGuidePending, markBuyerGuidePending } from './buyerGuidePopup'

const STORAGE_KEY = 'makan-session-v1'
const listeners = new Set()

/** Demo agency account — Ahmed Raza / Raza Estates */
export const DEMO_AGENCY_ID = 'ag-001'

const DEFAULT = { role: null, agencyId: null }

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT }
    return { ...DEFAULT, ...parsed }
  } catch {
    return { ...DEFAULT }
  }
}

function write(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || JSON.stringify(DEFAULT)
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

export function getSession() {
  return read()
}

export function enterAsUser() {
  markBuyerGuidePending()
  write({ role: 'user', agencyId: null })
}

export function enterAsAgency(agencyId = DEMO_AGENCY_ID) {
  clearBuyerGuidePending()
  write({ role: 'agency', agencyId })
}

export function clearSession() {
  clearBuyerGuidePending()
  write({ ...DEFAULT })
}

export function useSession() {
  useSyncExternalStore(subscribe, getSnapshot, () => JSON.stringify(DEFAULT))
  return read()
}
