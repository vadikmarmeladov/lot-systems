/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE — SERVER-ONLY
 *
 * Landed unit cost ESTIMATE per ration line, by manifest line number.
 * ESTIMATE: bulk/wholesale consumer-grade pricing, not confirmed supplier quotes.
 * Withheld from every client-facing surface. Used only to gate dispatch
 * against the COGS ceiling before an issue is recorded.
 */

import { computeIssueLoad } from '#shared/constants/basics'

export const COGS_CEILING_USD = 40.0
export const PRICE_USD = 100.0
export const MARGIN_FLOOR_PCT = 60

// keyed by manifest line number — ESTIMATE, wholesale/bulk landed cost per unit
const UNIT_COST_USD: Record<string, number> = {
  '01': 1.40, // ROLLED OATS
  '02': 1.10, // LENTILS, RED
  '03': 1.60, // RICE, BROWN LONG GRAIN
  '04': 2.80, // COFFEE, DARK ROAST GROUND
  '05': 2.20, // HONEY, RAW WILDFLOWER
  '06': 3.60, // OLIVE OIL, COLD-PRESSED EVOO
  '07': 0.40, // SALT, KOSHER
  '08': 0.70, // BLACK PEPPER, WHOLE
  '09': 1.00, // APPLE CIDER VINEGAR, RAW
  '10': 2.10, // SEEDS, MIXED
  '11': 0.60, // VITAMIN D3
  '12': 0.55, // VITAMIN C
  '13': 1.40, // ELECTROLYTE POWDER
  '14': 1.30, // OMEGA-3, FISH OIL
  '15': 1.60, // PROBIOTIC
  '16': 0.90, // MAGNESIUM GLYCINATE
  '17': 0.50, // ZINC, CHELATED
  '18': 1.10, // SOAP, CASTILE
  '19': 2.20, // RAZOR + BLADES
  '20': 0.50, // FLOSS
  '21': 0.90, // TOOTHPASTE
  '22': 1.60, // DEODORANT
  '23': 2.20, // JOURNAL, FIELD
}

export type IssueQuote = {
  cycleNumber: number
  itemLines: string[]
  cogsTotalUsd: number
  marginPct: number
  withinCeiling: boolean
}

// Supplier quote for the items due at a given cycle, confirmed against ceiling.
export function quoteIssue(cycleNumber: number): IssueQuote {
  const items = computeIssueLoad(cycleNumber)
  const cogsTotalUsd = Math.round(
    items.reduce((sum, item) => sum + (UNIT_COST_USD[item.line] || 0), 0) * 100
  ) / 100
  const marginPct = Math.round(((PRICE_USD - cogsTotalUsd) / PRICE_USD) * 1000) / 10
  return {
    cycleNumber,
    itemLines: items.map((i) => i.line),
    cogsTotalUsd,
    marginPct,
    withinCeiling: cogsTotalUsd <= COGS_CEILING_USD && marginPct >= MARGIN_FLOOR_PCT,
  }
}
