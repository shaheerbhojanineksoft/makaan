import { useSyncExternalStore } from 'react'
import { DEMO_AGENCY_ID } from './session'

const STORAGE_KEY = 'makan-agency-deals-v4'
const listeners = new Set()

const SEED = [
  {
    id: 'deal-001',
    agencyId: DEMO_AGENCY_ID,
    dealType: 'buy',
    dealDate: '2026-11-02',
    client1Name: 'Ali Hassan',
    client2Name: 'Sara Khan',
    dealOn: 'Plot no 3, Street 2, DHA Phase 6',
    brokerageAmount: 450000,
    dealAmount: 85000000,
    brokers: [
      { name: 'Imran Broker', commission: 80000 },
      { name: 'Nida Associates', commission: 50000 },
    ],
    expenses: [
      { key: 'Society transfer fee', value: 25000 },
      { key: 'Documentation', value: 12000 },
    ],
    createdAt: '2026-11-02',
    updatedAt: '2026-11-02',
  },
  {
    id: 'deal-002',
    agencyId: DEMO_AGENCY_ID,
    dealType: 'rental',
    dealDate: '2026-10-18',
    client1Name: 'Omar Farooq',
    client2Name: 'Blue Ocean Traders',
    dealOn: 'COM-3 Building, Clifton Block 4',
    brokerageAmount: 120000,
    dealAmount: 2400000,
    brokers: [{ name: 'Karachi Rent Desk', commission: 25000 }],
    expenses: [{ key: 'Agreement stamp', value: 5000 }],
    createdAt: '2026-10-18',
    updatedAt: '2026-10-18',
  },
]

function emit() {
  listeners.forEach((listener) => listener())
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED))
      return [...SEED]
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [...SEED]
  } catch {
    return [...SEED]
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
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

export function useAgencyDealsStore() {
  useSyncExternalStore(subscribe, getSnapshot, () => '')
}

export function getExpenseTotal(deal) {
  return (Array.isArray(deal?.expenses) ? deal.expenses : []).reduce(
    (sum, item) => sum + (Number(item.value) || 0),
    0,
  )
}

export function getAgencyDeals(agencyId = DEMO_AGENCY_ID) {
  return readAll()
    .filter((deal) => deal.agencyId === agencyId)
    .sort((a, b) =>
      String(b.dealDate || b.createdAt || '').localeCompare(String(a.dealDate || a.createdAt || '')),
    )
}

export function getAgencyDeal(agencyId, dealId) {
  return getAgencyDeals(agencyId).find((deal) => deal.id === dealId) || null
}

export function getAgencyDealsSummary(agencyId = DEMO_AGENCY_ID) {
  const deals = getAgencyDeals(agencyId)
  return deals.reduce(
    (acc, deal) => {
      acc.dealsCount += 1
      acc.dealAmountTotal += Number(deal.dealAmount) || 0
      acc.brokerageTotal += Number(deal.brokerageAmount) || 0
      acc.expenseTotal += getExpenseTotal(deal)
      return acc
    },
    { dealsCount: 0, dealAmountTotal: 0, brokerageTotal: 0, expenseTotal: 0 },
  )
}

export function createAgencyDeal(agencyId, payload) {
  const now = new Date().toISOString().slice(0, 10)
  const deal = {
    id: `deal-${Date.now()}`,
    agencyId,
    dealType: payload.dealType === 'rental' ? 'rental' : 'buy',
    dealDate: payload.dealDate || now,
    client1Name: String(payload.client1Name || '').trim(),
    client2Name: String(payload.client2Name || '').trim(),
    dealOn: String(payload.dealOn || '').trim(),
    brokerageAmount: Number(payload.brokerageAmount) || 0,
    dealAmount: Number(payload.dealAmount) || 0,
    brokers: (payload.brokers || [])
      .map((item) => ({
        name: String(item.name || '').trim(),
        commission: Number(item.commission) || 0,
      }))
      .filter((item) => item.name),
    expenses: (payload.expenses || [])
      .map((item) => ({
        key: String(item.key || '').trim(),
        value: Number(item.value) || 0,
      }))
      .filter((item) => item.key),
    createdAt: now,
    updatedAt: now,
  }
  writeAll([deal, ...readAll()])
  return deal
}

export function deleteAgencyDeal(agencyId, dealId) {
  writeAll(readAll().filter((deal) => !(deal.id === dealId && deal.agencyId === agencyId)))
}
