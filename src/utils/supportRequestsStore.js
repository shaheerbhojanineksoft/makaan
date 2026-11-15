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

function seedForAgency(agencyId) {
  const now = Date.now()
  return [
    {
      id: `sup-${agencyId}-001`,
      agencyId,
      subject: 'Listing stuck in draft after publish',
      topic: 'Publishing / draft',
      relatedId: 'prop-012',
      message:
        'Tried publishing a villa listing twice. Status stays on draft and the public site never shows it.',
      attachments: [],
      phone: '+92 300 1234567',
      status: 'in_review',
      response:
        'We are checking your listing publish queue. Expect an update within 2 working hours.',
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: `sup-${agencyId}-002`,
      agencyId,
      subject: 'Agency phone number not updating on profile',
      topic: 'Profile / account',
      relatedId: '',
      message:
        'Updated our contact number in Profile Edit, but the public agent page still shows the old WhatsApp number.',
      attachments: [],
      phone: '+92 321 9876543',
      status: 'responded',
      response:
        'Profile cache was cleared. Please hard-refresh the agent page — your new number should appear now.',
      createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: `sup-${agencyId}-003`,
      agencyId,
      subject: 'Need help editing a recommendation',
      topic: 'Recommendations',
      relatedId: 'rec-101',
      message:
        'Our recommendation was published but we need to correct the possession timeline. Edit is locked.',
      attachments: [],
      phone: '+92 300 1234567',
      status: 'pending',
      response: '',
      createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
    },
  ]
}

function readAll() {
  return readJson(STORAGE_KEY, {})
}

function ensureAgencyRequests(agencyId) {
  const all = readAll()
  if (Array.isArray(all[agencyId])) return all[agencyId]
  const seeded = seedForAgency(agencyId)
  all[agencyId] = seeded
  writeJson(STORAGE_KEY, all)
  return seeded
}

export function getSupportRequests(agencyId = DEMO_AGENCY_ID) {
  const list = ensureAgencyRequests(agencyId)
  return [...list].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export function getSupportRequest(agencyId, id) {
  return getSupportRequests(agencyId).find((item) => item.id === id) || null
}

export function createSupportRequest(agencyId, payload) {
  const all = readAll()
  const list = ensureAgencyRequests(agencyId)
  const now = new Date().toISOString()
  const next = {
    id: `sup-${agencyId}-${Date.now()}`,
    agencyId,
    subject: payload.subject?.trim() || 'Untitled request',
    topic: payload.topic || 'Other',
    relatedId: payload.relatedId?.trim() || '',
    message: payload.message?.trim() || '',
    attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
    phone: payload.phone?.trim() || '',
    status: 'pending',
    response: '',
    createdAt: now,
    updatedAt: now,
  }
  all[agencyId] = [next, ...list]
  writeJson(STORAGE_KEY, all)
  return next
}

export function useSupportRequestsStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => '')
}
