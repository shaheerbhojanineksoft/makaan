/**
 * Local favourites store — listings (property / plot / project) and agencies.
 * Swap for a user API later without changing FavoriteButton callers.
 */

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'makan-favorites-v1'
const listeners = new Set()

export const FAVORITE_KINDS = {
  property: 'property',
  plot: 'plot',
  project: 'project',
  agent: 'agent',
}

const LISTING_KINDS = new Set([
  FAVORITE_KINDS.property,
  FAVORITE_KINDS.plot,
  FAVORITE_KINDS.project,
])

function readRaw() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRaw(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  listeners.forEach((listener) => listener())
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || '[]'
}

function getServerSnapshot() {
  return '[]'
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

/** @returns {{ kind: string, id: string, savedAt: string }[]} */
export function getFavorites() {
  return readRaw().filter((item) => item && item.kind && item.id)
}

export function isFavorite(kind, id) {
  return getFavorites().some((item) => item.kind === kind && item.id === id)
}

export function toggleFavorite(kind, id) {
  const current = getFavorites()
  const exists = current.some((item) => item.kind === kind && item.id === id)
  const next = exists
    ? current.filter((item) => !(item.kind === kind && item.id === id))
    : [...current, { kind, id, savedAt: new Date().toISOString() }]
  writeRaw(next)
  return !exists
}

export function removeFavorite(kind, id) {
  writeRaw(getFavorites().filter((item) => !(item.kind === kind && item.id === id)))
}

export function getFavoriteListingEntries() {
  return getFavorites().filter((item) => LISTING_KINDS.has(item.kind))
}

export function getFavoriteAgencyEntries() {
  return getFavorites().filter((item) => item.kind === FAVORITE_KINDS.agent)
}

/** Live favourites list for React components. */
export function useFavorites() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  try {
    const parsed = JSON.parse(snapshot)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useIsFavorite(kind, id) {
  const favorites = useFavorites()
  return favorites.some((item) => item.kind === kind && item.id === id)
}
