import { useSyncExternalStore } from 'react'
import { CURRENT_USER as DEFAULT_USER } from '../data/siteConfig'

const STORAGE_KEY = 'makan-current-user-v1'
const listeners = new Set()

function readRaw() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_USER }
    return {
      ...DEFAULT_USER,
      ...parsed,
      id: DEFAULT_USER.id,
      avatar: parsed.avatar || DEFAULT_USER.avatar,
    }
  } catch {
    return { ...DEFAULT_USER }
  }
}

function writeRaw(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  listeners.forEach((listener) => listener())
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || JSON.stringify(DEFAULT_USER)
}

function getServerSnapshot() {
  return JSON.stringify(DEFAULT_USER)
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

export function updateCurrentUser(patch) {
  const next = {
    ...readRaw(),
    ...patch,
    id: DEFAULT_USER.id,
  }
  writeRaw(next)
  return next
}

export function useCurrentUser() {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return readRaw()
}
