/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 — SECTION 2: RATION LOAD
 * 23-item civilian ration manifest.
 * COGS withheld from public ledger. Margin floor: 60%. COGS ceiling: $40.
 */

import type { RationItem, Cadence } from './types'

export const MANIFEST: RationItem[] = [
  // ── CONSUMABLES — MONTHLY ─────────────────────────────────────────────────
  { id: '001', nomenclature: 'ELECTROLYTE COMPLEX 30-PKT',    cadence: 'monthly',     cogs: 4.20 },
  { id: '002', nomenclature: 'PROTEIN RATION BAR x4',         cadence: 'monthly',     cogs: 3.60 },
  { id: '003', nomenclature: 'MAGNESIUM GLYCINATE 60ct',      cadence: 'monthly',     cogs: 2.80 },
  { id: '004', nomenclature: 'ZINC BISGLYCINATE 30ct',        cadence: 'monthly',     cogs: 1.40 },
  { id: '005', nomenclature: 'VITAMIN D3+K2 5000IU 30ct',     cadence: 'monthly',     cogs: 1.60 },
  { id: '006', nomenclature: 'OMEGA-3 CONCENTRATE 60ct',      cadence: 'monthly',     cogs: 3.20 },
  { id: '007', nomenclature: 'PROBIOTIC COMPLEX 30ct',        cadence: 'monthly',     cogs: 3.80 },
  { id: '008', nomenclature: 'COLLAGEN PEPTIDES 30-SVG',      cadence: 'monthly',     cogs: 4.00 },
  { id: '009', nomenclature: 'ASHWAGANDHA EXTRACT 60ct',      cadence: 'monthly',     cogs: 2.40 },
  { id: '010', nomenclature: 'SLEEP FORMULA 30ct',            cadence: 'monthly',     cogs: 2.60 },
  { id: '011', nomenclature: 'FOCUS STACK 30ct',              cadence: 'monthly',     cogs: 3.00 },
  // ── DURABLE — QUARTERLY ───────────────────────────────────────────────────
  { id: '012', nomenclature: 'ATHLETIC TAPE 1.5IN × 15YD',    cadence: 'quarterly',   cogs: 2.20 },
  { id: '013', nomenclature: 'NITRILE GLOVES 10pk',           cadence: 'quarterly',   cogs: 1.80 },
  { id: '014', nomenclature: 'N95 RESPIRATOR 2pk',            cadence: 'quarterly',   cogs: 3.40 },
  { id: '015', nomenclature: 'EMERGENCY MYLAR BLANKET',       cadence: 'quarterly',   cogs: 1.20 },
  // ── DURABLE — SEMI-ANNUAL ─────────────────────────────────────────────────
  { id: '016', nomenclature: 'WATER PURIFICATION TABS 50ct',  cadence: 'semi-annual', cogs: 1.60 },
  { id: '017', nomenclature: 'HEMOSTATIC DRESSING',           cadence: 'semi-annual', cogs: 4.80 },
  { id: '018', nomenclature: 'FIRE STARTER KIT',              cadence: 'semi-annual', cogs: 2.40 },
  { id: '019', nomenclature: 'PARACORD 550 10FT',             cadence: 'semi-annual', cogs: 1.20 },
  // ── DURABLE — ANNUAL ──────────────────────────────────────────────────────
  { id: '020', nomenclature: 'CAT TOURNIQUET',                cadence: 'annual',      cogs: 9.60 },
  { id: '021', nomenclature: 'SIGNAL WHISTLE',                cadence: 'annual',      cogs: 0.80 },
  { id: '022', nomenclature: 'MULTI-TOOL COMPACT',            cadence: 'annual',      cogs: 8.40 },
  // ── ALWAYS INCLUDED ───────────────────────────────────────────────────────
  { id: '023', nomenclature: 'PRINTED MANIFEST CARD',         cadence: 'always',      cogs: 0.60 },
]

export const CADENCE_LABELS: Record<Cadence, string> = {
  monthly:     'MONTHLY',
  quarterly:   'QUARTERLY',
  'semi-annual': 'SEMI-ANNUAL',
  annual:      'ANNUAL',
  always:      'EVERY ISSUE',
}

// Prorated monthly COGS (average cost per month over 12-month cycle)
export const MONTHLY_COGS_PRORATED = MANIFEST.reduce((acc, item) => {
  const divisor: Record<Cadence, number> = {
    monthly: 1, quarterly: 3, 'semi-annual': 6, annual: 12, always: 1,
  }
  return acc + item.cogs / divisor[item.cadence]
}, 0)

// Items issued in a given month number (1-indexed, 1 = first issue month)
export function getMonthLoad(monthNumber: number): RationItem[] {
  return MANIFEST.filter((item) => {
    switch (item.cadence) {
      case 'monthly':     return true
      case 'quarterly':   return monthNumber % 3 === 1
      case 'semi-annual': return monthNumber % 6 === 1
      case 'annual':      return monthNumber % 12 === 1
      case 'always':      return true
    }
  })
}

// Month COGS for a specific issue month
export function getMonthCogs(monthNumber: number): number {
  return getMonthLoad(monthNumber).reduce((sum, item) => sum + item.cogs, 0)
}

export const DOCTRINE = `LOT BASIC is a standing civilian ration.
Issued monthly. $100 per issue. ≥60% margin held.
The ledger is the marketing. No layer between subscriber and manifest.
You are ON STRENGTH or you are not. There is no trial.`

export const PRICE_LINE = '$100 / ISSUE — USD — RECURRING MONTHLY'
