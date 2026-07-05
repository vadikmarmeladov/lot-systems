/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE — SERVER-ONLY COST SHEET
 *
 * COGS withheld from public. Never import this file from client code —
 * it must not reach the browser bundle. The ledger is the marketing;
 * the cost sheet is not.
 */

import { getIssueLoad } from '#shared/constants/basics'

export const PRICE_USD = 100
export const COGS_CEILING_USD = 40
export const MARGIN_FLOOR = 0.6

// Landed cost per line, USD. Supplier-quote placeholders pending Month 3
// procurement confirmation — see LOT-FM-001 §3 "Supplier quotes confirmed
// against COGS ceiling."
const RATION_COGS_USD: Record<string, number> = {
  '01': 2.20, '02': 1.60, '03': 2.10, '04': 2.40, '05': 2.10,
  '06': 3.60, '07': 0.70, '08': 1.40, '09': 1.70, '10': 2.80,
  '11': 1.00, '12': 1.00, '13': 2.00, '14': 2.00, '15': 2.80,
  '16': 1.40, '17': 1.00,
  '18': 1.00, '19': 1.80, '20': 0.70,
  '21': 1.00, '22': 1.40,
  '23': 1.80,
}

export type MarginCheck = {
  issueNumber: number
  itemCount: number
  costUSD: number
  marginPct: number
  withinCeiling: boolean
  meetsFloor: boolean
}

export function computeLandedCost(issueNumber: number): number {
  const load = getIssueLoad(issueNumber)
  const sum = load.reduce((acc, item) => acc + (RATION_COGS_USD[item.line] ?? 0), 0)
  return Math.round(sum * 100) / 100
}

export function verifyMargin(issueNumber: number): MarginCheck {
  const costUSD = computeLandedCost(issueNumber)
  const marginPct = Math.round(((PRICE_USD - costUSD) / PRICE_USD) * 1000) / 10
  return {
    issueNumber,
    itemCount: getIssueLoad(issueNumber).length,
    costUSD,
    marginPct,
    withinCeiling: costUSD <= COGS_CEILING_USD,
    meetsFloor: marginPct / 100 >= MARGIN_FLOOR,
  }
}

// Worst-case check across a full cadence cycle (12 issues) — called once at
// server boot in non-production so a bad cost edit fails loud, not quiet.
export function assertCadenceCycleWithinEnvelope(): void {
  for (let issue = 1; issue <= 12; issue++) {
    const check = verifyMargin(issue)
    if (!check.withinCeiling || !check.meetsFloor) {
      throw new Error(
        `BASIC ration envelope breached at issue ${issue}: cost=$${check.costUSD} margin=${check.marginPct}% (ceiling=$${COGS_CEILING_USD}, floor=${MARGIN_FLOOR * 100}%)`
      )
    }
  }
}
