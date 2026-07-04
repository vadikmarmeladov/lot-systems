/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE
 * SECTION 3 — MONTH-BY-MONTH LOAD ENGINE (M3)
 *
 * Cadence rule: MONTHLY items ship every issue. QUARTERLY items ship on
 * issue numbers 3, 6, 9, 12, ... ANNUALLY items ship on issue 12, 24, ...
 * Issue numbers are 1-indexed from an operator's cadence start.
 */

import {
  RATION_MANIFEST,
  COGS_CEILING_CENTS,
  PRICE_CENTS,
  MARGIN_FLOOR,
  type RationItem,
} from './basics-doctrine'

export function itemsForIssue(issueNumber: number): RationItem[] {
  return RATION_MANIFEST.filter((item) => {
    if (item.cadence === 'MONTHLY') return true
    if (item.cadence === 'QUARTERLY') return issueNumber % 3 === 0
    if (item.cadence === 'ANNUALLY') return issueNumber % 12 === 0
    return false
  })
}

export type MarginReport = {
  issueNumber: number
  cogsCents: number
  ceilingCents: number
  withinCeiling: boolean
  marginRatio: number
  meetsMarginFloor: boolean
}

// Verifies a given issue's landed cost never breaches the COGS ceiling
// and that the resulting margin never drops below the 60% floor.
export function verifyMargin(issueNumber: number): MarginReport {
  const cogsCents = itemsForIssue(issueNumber).reduce(
    (sum, item) => sum + item.landedCostCents,
    0
  )
  const marginRatio = (PRICE_CENTS - cogsCents) / PRICE_CENTS
  return {
    issueNumber,
    cogsCents,
    ceilingCents: COGS_CEILING_CENTS,
    withinCeiling: cogsCents <= COGS_CEILING_CENTS,
    marginRatio,
    meetsMarginFloor: marginRatio >= MARGIN_FLOOR,
  }
}

// Self-check across a full 12-issue cycle. Throws if doctrine is ever breached —
// a broken ceiling is a build failure, not a warning.
export function verifyAnnualCycle(): MarginReport[] {
  const reports = Array.from({ length: 12 }, (_, i) => verifyMargin(i + 1))
  const breach = reports.find((r) => !r.withinCeiling || !r.meetsMarginFloor)
  if (breach) {
    throw new Error(
      `LOT-FM-001 doctrine breach at issue ${breach.issueNumber}: ` +
      `COGS ${breach.cogsCents}¢ / ceiling ${breach.ceilingCents}¢, ` +
      `margin ${(breach.marginRatio * 100).toFixed(1)}% / floor ${MARGIN_FLOOR * 100}%`
    )
  }
  return reports
}

export function nextCadenceDate(from: Date = new Date()): Date {
  const next = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1))
  return next
}
