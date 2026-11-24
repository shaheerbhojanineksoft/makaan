import { useSyncExternalStore } from 'react'
import { DEMO_AGENCY_ID } from './session'

const STORAGE_KEY = 'makan-agency-support-requests-v1'
const listeners = new Set()

export const SUPPORT_STATUSES = {
  pending: 'Pending',
  in_review: 'In review',
  responded: 'Responded',
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

function ensureAgencyRequests(agencyId) {
  const all = readAll()
  if (Array.isArray(all[agencyId])) return all[agencyId]
  all[agencyId] = []
  writeJson(STORAGE_KEY, all)
  return all[agencyId]
}

export function getSupportRequests(agencyId = DEMO_AGENCY_ID) {
  const list = ensureAgencyRequests(agencyId)
  return [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export function getSupportRequest(agencyId, id) {
  return getSupportRequests(agencyId).find((item) => item._id === id) || null
}

export function createSupportRequest(agencyId, payload) {
  const all = readAll()
  const list = ensureAgencyRequests(agencyId)
  const now = new Date().toISOString()
  const next = {
    _id: payload._id || `local-${agencyId}-${Date.now()}`,
    agencyId: payload.agencyId || agencyId,
    subject: payload.subject?.trim() || 'Untitled request',
    topic: payload.topic || 'Other',
    message: payload.message?.trim() || '',
    attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
    phone: payload.phone?.trim() || '',
    status: payload.status || 'pending',
    response: payload.response || '',
    createdAt: payload.createdAt || now,
    updatedAt: payload.updatedAt || now,
  }
  all[agencyId] = [next, ...list.filter((item) => item._id !== next._id)]
  writeJson(STORAGE_KEY, all)
  return next
}

export function replaceSupportRequests(agencyId, rows = []) {
  const all = readAll()
  all[agencyId] = Array.isArray(rows) ? rows : []
  writeJson(STORAGE_KEY, all)
  return all[agencyId]
}

export function useSupportRequestsStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => '')
}
