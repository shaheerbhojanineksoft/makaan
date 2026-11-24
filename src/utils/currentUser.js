import { useSyncExternalStore } from 'react'
import { CURRENT_USER as DEFAULT_USER } from '../data/siteConfig'

const STORAGE_KEY = 'makan-current-user-v1'
const listeners = new Set()

const EMPTY_USER = {
  id: '',
  name: '',
  email: '',
  phone: '',
  profilePicture: '',
  avatar: '',
  isProfileCompleted: false,
}

function readRaw() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') return { ...EMPTY_USER }
    const profilePicture = parsed.profilePicture || parsed.avatar || ''
    return {
      ...EMPTY_USER,
      ...parsed,
      profilePicture,
      avatar: profilePicture,
    }
  } catch {
    return { ...EMPTY_USER }
  }
}

function writeRaw(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  listeners.forEach((listener) => listener())
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || JSON.stringify(EMPTY_USER)
}

function getServerSnapshot() {
  return JSON.stringify(EMPTY_USER)
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

export function getCurrentUser() {
  return readRaw()
}

export function syncCurrentUserFromAccount(account = {}) {
  const profilePicture = account.profilePicture || account.avatar || ''
  const next = {
    id: account._id ? String(account._id) : '',
    name: account.fullname || account.name || '',
    email: account.email || '',
    phone: account.phoneNumber || account.phone || '',
    profilePicture,
    avatar: profilePicture,
    isProfileCompleted: Boolean(account.isProfileCompleted),
  }
  writeRaw(next)
  return next
}

export function updateCurrentUser(patch) {
  const current = readRaw()
  const profilePicture =
    patch.profilePicture !== undefined
      ? patch.profilePicture
      : patch.avatar !== undefined
        ? patch.avatar
        : current.profilePicture
  const next = {
    ...current,
    ...patch,
    profilePicture,
    avatar: profilePicture,
  }
  writeRaw(next)
  return next
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY)
  listeners.forEach((listener) => listener())
}

export function useCurrentUser() {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return readRaw()
}

// Keep DEFAULT_USER available for any legacy demo fallbacks
export { DEFAULT_USER }
