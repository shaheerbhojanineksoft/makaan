import { useSyncExternalStore } from 'react'

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
  email: '',
  registered: false,
  isProfileCompleted: false,
}

export function mapAccountToLawyerForm(account = {}) {
  return {
    name: account.fullname || account.name || '',
    city: account.location || account.city || '',
    specialty: account.SpecialistIn || account.specialty || '',
    bio: account.Bio || account.bio || '',
    phone: account.phonenumber || account.phone || '',
    whatsapp: account.whatsappNumber || account.whatsapp || '',
    avatar: account.profilePicture || account.avatar || '',
    email: account.email || '',
    registered: Boolean(account.isProfileCompleted || account.registered),
    isProfileCompleted: Boolean(account.isProfileCompleted),
  }
}

export function isLawyerRegistered(lawyerId) {
  if (!lawyerId) return false
  return Boolean(getLawyerProfile(lawyerId).registered)
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

export function getLawyerProfile(lawyerId) {
  if (!lawyerId) return { ...EMPTY_PROFILE }
  const all = readAll()
  return { ...EMPTY_PROFILE, ...(all[lawyerId] || {}) }
}

export function syncLawyerProfileFromAccount(lawyerId, account = {}) {
  if (!lawyerId) return { ...EMPTY_PROFILE }
  const mapped = mapAccountToLawyerForm(account)
  const patch = {
    registered: mapped.registered,
    isProfileCompleted: mapped.isProfileCompleted,
  }
  // Only apply sign-in values that arrived; keep local defaults for the rest
  for (const key of ['name', 'city', 'specialty', 'bio', 'phone', 'whatsapp', 'avatar', 'email']) {
    if (mapped[key]) patch[key] = mapped[key]
  }
  return saveLawyerProfile(lawyerId, patch)
}

export function saveLawyerProfile(lawyerId, patch) {
  if (!lawyerId) return { ...EMPTY_PROFILE }
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
