/**
 * LOT SYSTEMS CORPORATION
 * LOT-FM-001 / BASIC RATION MODULE — INTERNAL COGS LEDGER
 *
 * RESTRICTED. Doctrine: "the ledger is the marketing — COGS withheld."
 * This module is server-only and must never be imported from client code
 * or exposed through a public/authenticated API response. It exists to
 * verify the margin floor (>=60%) at issue-dispatch time and for the
 * quartermaster session report, not to price anything shown to operators.
 */

import { RATION_PRICE_USD, itemsForIssue, type RationItem } from '#shared/constants/basics'

// Wholesale/bulk landed unit cost estimates, USD. Line numbers match RATION_MANIFEST.
const UNIT_COGS_USD: Record<string, number> = {
  '01': 1.80, '02': 1.60, '03': 2.00, '04': 2.80, '05': 2.50,
  '06': 3.60, '07': 0.50, '08': 0.90, '09': 1.20, '10': 2.40,
  '11': 1.00, '12': 0.90, '13': 2.20, '14': 1.90, '15': 2.60,
  '16': 1.40, '17': 0.80,
  '18': 1.30, '19': 1.80, '20': 0.70,
  '21': 1.20, '22': 1.80, '23': 3.00,
}

const PACK_AND_PICK_USD = 1.50
const FREIGHT_USD = 2.00

export type IssueCogsReport = {
  issueNumber: number
  itemCount: number
  itemsCogsUsd: number
  packAndPickUsd: number
  freightUsd: number
  totalLandedUsd: number
  priceUsd: number
  marginPct: number
  underCeiling: boolean
  meetsMarginFloor: boolean
}

export function costIssue(issueNumber: number, items: RationItem[] = itemsForIssue(issueNumber)): IssueCogsReport {
  const itemsCogsUsd = items.reduce((sum, item) => sum + (UNIT_COGS_USD[item.line] ?? 0), 0)
  const totalLandedUsd = itemsCogsUsd + PACK_AND_PICK_USD + FREIGHT_USD
  const marginPct = ((RATION_PRICE_USD - totalLandedUsd) / RATION_PRICE_USD) * 100

  return {
    issueNumber,
    itemCount: items.length,
    itemsCogsUsd: round2(itemsCogsUsd),
    packAndPickUsd: PACK_AND_PICK_USD,
    freightUsd: FREIGHT_USD,
    totalLandedUsd: round2(totalLandedUsd),
    priceUsd: RATION_PRICE_USD,
    marginPct: round2(marginPct),
    underCeiling: totalLandedUsd <= 40,
    meetsMarginFloor: marginPct >= 60,
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
