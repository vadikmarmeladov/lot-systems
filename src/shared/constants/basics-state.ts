/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE
 * SECTION 2 — UPGRADE STATE MACHINE (M2)
 *
 * USERSHIP/AI ---UPGRADE---> PENDING ---(auth confirmed)---> ON STRENGTH
 *   ON STRENGTH ---(first issue dispatched)---> STEADY STATE
 *   ON STRENGTH / STEADY STATE ---STAND DOWN---> STAND DOWN (drops ration, keeps AI)
 */

import type { BasicStatus } from '#shared/types'

export const BASIC_STATUS_LABEL: Record<BasicStatus, string> = {
  NONE: 'NONE',
  PENDING: 'PENDING — AWAITING CONFIRMATION',
  ON_STRENGTH: 'ON STRENGTH',
  STEADY_STATE: 'ON STRENGTH — STEADY STATE',
  STAND_DOWN: 'STAND DOWN — RATION SECURED',
}

export function canUpgrade(status: BasicStatus): boolean {
  return status === 'NONE' || status === 'STAND_DOWN'
}

export function canStandDown(status: BasicStatus): boolean {
  return status === 'ON_STRENGTH' || status === 'STEADY_STATE' || status === 'PENDING'
}

export function isOnStrength(status: BasicStatus): boolean {
  return status === 'ON_STRENGTH' || status === 'STEADY_STATE'
}
