import { useSyncExternalStore } from 'react'
import { DEMO_LAWYER_ID } from './session'

const STORAGE_KEY = 'makan-lawyer-profiles-v1'
const listeners = new Set()

const EMPTY_PROFILE = {
  name: '',
  city: '',
  specialty: '',
  bio: '',
  phone: '',
  whatsapp: '',
  avatar: '',
}

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

export function getLawyerProfile(lawyerId = DEMO_LAWYER_ID) {
  const all = readAll()
  return { ...EMPTY_PROFILE, ...(all[lawyerId] || {}) }
}

export function saveLawyerProfile(lawyerId, patch) {
  const all = readAll()
  const prev = all[lawyerId] || {}
  const next = {
    ...EMPTY_PROFILE,
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  all[lawyerId] = next
  writeJson(STORAGE_KEY, all)
  return next
}

export function useLawyerProfileStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => '')
}
