/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE
 * SECTION 2 — RATION STATE MACHINE
 */

// USERSHIP/AI -> PENDING -> ON_STRENGTH -> STEADY_STATE, with STAND DOWN
// returning an operator from ON_STRENGTH/STEADY_STATE back to NONE (ration
// dropped, AI/Usership base layer untouched).
export type BasicsState = 'NONE' | 'PENDING' | 'ON_STRENGTH' | 'STEADY_STATE'

export const BASICS_MONTHLY_USD = 100

// Days continuously ON_STRENGTH before the scheduled job promotes an operator
// to STEADY_STATE (cadence proven).
export const BASICS_STEADY_STATE_DAYS = 30

export type BasicsHistoryEntry = { state: BasicsState; at: string }

export type BasicsShipping = {
  name: string
  address1: string
  address2: string
  city: string
  region: string
  postal: string
  country: string
}

export type BasicsRoster = {
  shipping: BasicsShipping
  householdSize: number
  cadenceStartDay: number
}

export type BasicsBilling = {
  plan: 'BASIC'
  amountUsd: number
  additive: true
  startedAt: string | null
  standDownAt: string | null
}

export type BasicsIssueLogEntry = {
  at: string
  summary: string
}

export type BasicsRecord = {
  state: BasicsState
  history: BasicsHistoryEntry[]
  roster: BasicsRoster | null
  billing: BasicsBilling
  issueLog: BasicsIssueLogEntry[]
}

export const BASICS_EMPTY: BasicsRecord = {
  state: 'NONE',
  history: [],
  roster: null,
  billing: {
    plan: 'BASIC',
    amountUsd: BASICS_MONTHLY_USD,
    additive: true,
    startedAt: null,
    standDownAt: null,
  },
  issueLog: [],
}

export const isUsershipTag = (tags: string[] | undefined | null): boolean =>
  (tags || []).some((t) => t.toLowerCase() === 'usership')

export const isOnStrength = (state: BasicsState | undefined | null): boolean =>
  state === 'ON_STRENGTH' || state === 'STEADY_STATE'
