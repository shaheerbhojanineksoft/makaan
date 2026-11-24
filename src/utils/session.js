import { useSyncExternalStore } from 'react'

import { syncAgencyProfileFromAccount } from './agencyStore'
import { clearBuyerGuidePending, markBuyerGuidePending } from './buyerGuidePopup'
import { syncCurrentUserFromAccount, clearCurrentUser } from './currentUser'
import { syncLawyerProfileFromAccount } from './lawyerProfileStore'

const STORAGE_KEY = 'makan-session-v1'
const listeners = new Set()

/** Demo agency account — Ahmed Raza / Raza Estates */
export const DEMO_AGENCY_ID = 'ag-001'

/** Demo lawyer account after Google sign-in */
export const DEMO_LAWYER_ID = 'law-google-001'

const DEFAULT = {
  role: null,
  agencyId: null,
  lawyerId: null,
  accessToken: '',
  expiresIn: '',
  accountId: null,
  account: null,
}

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

export function getAccessToken() {
  return read().accessToken || ''
}

export function isUserProfileCompleted(session = read()) {
  if (session.role !== 'user') return true
  return Boolean(session.account?.isProfileCompleted)
}

export function isLawyerProfileCompleted(session = read()) {
  if (session.role !== 'lawyer') return true
  return Boolean(session.account?.isProfileCompleted)
}

export function isAgencyProfileCompleted(session = read()) {
  if (session.role !== 'agency') return true
  return Boolean(session.account?.isProfileCompleted)
}

export function enterAsUser(extra = {}) {
  markBuyerGuidePending()
  write({
    ...DEFAULT,
    role: 'user',
    agencyId: null,
    lawyerId: null,
    ...extra,
  })
}

export function enterAsAgency(agencyId = DEMO_AGENCY_ID, extra = {}) {
  clearBuyerGuidePending()
  write({
    ...DEFAULT,
    role: 'agency',
    agencyId,
    lawyerId: null,
    ...extra,
  })
}

export function enterAsLawyer(lawyerId = DEMO_LAWYER_ID, extra = {}) {
  clearBuyerGuidePending()
  write({
    ...DEFAULT,
    role: 'lawyer',
    agencyId: null,
    lawyerId,
    ...extra,
  })
}

/**
 * Persist Google auth result and enter the matching role shell.
 * @param {{ accessToken: string, expiresIn?: string, account: object }} data
 */
export function enterFromGoogleAuth(data) {
  const account = data?.account || {}
  const type = account.type
  const accountId = account._id ? String(account._id) : null
  const auth = {
    accessToken: data?.accessToken || '',
    expiresIn: data?.expiresIn || '',
    accountId,
    account,
  }

  if (type === 'agency') {
    enterAsAgency(accountId || DEMO_AGENCY_ID, auth)
    syncAgencyProfileFromAccount(accountId || DEMO_AGENCY_ID, account)
    return 'agency'
  }
  if (type === 'lawyer') {
    enterAsLawyer(accountId || DEMO_LAWYER_ID, auth)
    syncLawyerProfileFromAccount(accountId || DEMO_LAWYER_ID, account)
    return 'lawyer'
  }

  enterAsUser(auth)
  syncCurrentUserFromAccount(account)
  return 'user'
}

export function updateSessionAccount(accountPatch = {}) {
  const current = read()
  const account = { ...(current.account || {}), ...accountPatch }
  write({
    ...current,
    accountId: account._id ? String(account._id) : current.accountId,
    account,
  })
  if (current.role === 'user') {
    syncCurrentUserFromAccount(account)
  }
  if (current.role === 'lawyer') {
    syncLawyerProfileFromAccount(
      current.lawyerId || current.accountId || DEMO_LAWYER_ID,
      account,
    )
  }
  if (current.role === 'agency') {
    syncAgencyProfileFromAccount(
      current.agencyId || current.accountId || DEMO_AGENCY_ID,
      account,
    )
  }
  return account
}

export function clearSession() {
  clearBuyerGuidePending()
  clearCurrentUser()
  write({ ...DEFAULT })
}

export function useSession() {
  useSyncExternalStore(subscribe, getSnapshot, () => JSON.stringify(DEFAULT))
  return read()
}
