/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// LOT-FM-001 / BASIC RATION MODULE — shared manifest + state machine.
// Single source of truth for client (public ledger, roster UI) and
// server (issue engine, roster persistence). COGS withheld — see
// docs/corporate/LOT-FM-001-COGS-LEDGER.md (not shipped to client bundle).

export const RATION_PRICE_USD = 100
export const RATION_MARGIN_FLOOR = 0.6
export const RATION_COGS_CEILING_USD = RATION_PRICE_USD * (1 - RATION_MARGIN_FLOOR) // 40

export type RationCadence = 'MONTHLY' | 'QUARTERLY' | 'SEMI-ANNUAL' | 'ANNUAL'

export type RationItem = {
  code: string
  nomenclature: string
  category: 'HYGIENE' | 'APPAREL' | 'SUSTENANCE' | 'FIELD'
  cadence: RationCadence
}

// Section 2 — 23-item load. Nomenclature + cadence only. No cost figures here.
export const RATION_MANIFEST: RationItem[] = [
  { code: 'FM001-01', nomenclature: 'TOOTHBRUSH, SOFT BRISTLE', category: 'HYGIENE', cadence: 'MONTHLY' },
  { code: 'FM001-02', nomenclature: 'TOOTHPASTE, FLUORIDE, 3OZ', category: 'HYGIENE', cadence: 'MONTHLY' },
  { code: 'FM001-03', nomenclature: 'FLOSS, WAXED, 50M SPOOL', category: 'HYGIENE', cadence: 'MONTHLY' },
  { code: 'FM001-04', nomenclature: 'SOAP, BAR, UNSCENTED', category: 'HYGIENE', cadence: 'MONTHLY' },
  { code: 'FM001-05', nomenclature: 'SHAMPOO, 3OZ TRAVEL', category: 'HYGIENE', cadence: 'MONTHLY' },
  { code: 'FM001-06', nomenclature: 'DEODORANT, ALUMINUM-FREE', category: 'HYGIENE', cadence: 'MONTHLY' },
  { code: 'FM001-07', nomenclature: 'RAZOR CARTRIDGE, 4-PACK', category: 'HYGIENE', cadence: 'MONTHLY' },
  { code: 'FM001-08', nomenclature: 'HAND SANITIZER, 2OZ', category: 'HYGIENE', cadence: 'MONTHLY' },
  { code: 'FM001-09', nomenclature: 'MULTIVITAMIN, 30-DAY SUPPLY', category: 'SUSTENANCE', cadence: 'MONTHLY' },
  { code: 'FM001-10', nomenclature: 'ELECTROLYTE PACKET, 10-COUNT', category: 'SUSTENANCE', cadence: 'MONTHLY' },
  { code: 'FM001-11', nomenclature: 'PEN, BLACK INK, RETRACTABLE', category: 'FIELD', cadence: 'MONTHLY' },
  { code: 'FM001-12', nomenclature: 'LIP BALM, SPF 15', category: 'HYGIENE', cadence: 'QUARTERLY' },
  { code: 'FM001-13', nomenclature: 'NAIL CLIPPER, STEEL', category: 'HYGIENE', cadence: 'QUARTERLY' },
  { code: 'FM001-14', nomenclature: 'COTTON SWAB, 100-COUNT', category: 'HYGIENE', cadence: 'QUARTERLY' },
  { code: 'FM001-15', nomenclature: 'UNDERSHIRT, COTTON, CREW', category: 'APPAREL', cadence: 'QUARTERLY' },
  { code: 'FM001-16', nomenclature: 'BRIEF, COTTON, 3-PACK', category: 'APPAREL', cadence: 'QUARTERLY' },
  { code: 'FM001-17', nomenclature: 'SOCK, WOOL-BLEND, 3-PACK', category: 'APPAREL', cadence: 'QUARTERLY' },
  { code: 'FM001-18', nomenclature: 'NOTEBOOK, POCKET 3.5X5.5', category: 'FIELD', cadence: 'QUARTERLY' },
  { code: 'FM001-19', nomenclature: 'BATTERY, AA, 4-PACK', category: 'FIELD', cadence: 'QUARTERLY' },
  { code: 'FM001-20', nomenclature: 'LIGHTER, WATERPROOF', category: 'FIELD', cadence: 'QUARTERLY' },
  { code: 'FM001-21', nomenclature: 'SUNSCREEN, SPF 30, TRAVEL', category: 'HYGIENE', cadence: 'SEMI-ANNUAL' },
  { code: 'FM001-22', nomenclature: 'FIRST-AID KIT, COMPACT', category: 'FIELD', cadence: 'SEMI-ANNUAL' },
  { code: 'FM001-23', nomenclature: 'SEWING KIT, TRAVEL', category: 'FIELD', cadence: 'ANNUAL' },
]

if (RATION_MANIFEST.length !== 23) {
  throw new Error(`RATION_MANIFEST must carry 23 items, has ${RATION_MANIFEST.length}`)
}

export type RationStatus =
  | 'NONE'
  | 'PENDING'
  | 'ON_STRENGTH'
  | 'STEADY_STATE'
  | 'STAND_DOWN'

export const STEADY_STATE_ISSUE_THRESHOLD = 3

export type RationRoster = {
  shirtSize: string
  sockSize: string
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingCountry: string
}

export type RationIssueLogEntry = {
  issuedAt: string // ISO date
  monthIndex: number // 0-based month count since cadenceStart
  items: string[] // RationItem codes shipped this issue
}

export type RationRecord = {
  status: RationStatus
  roster: RationRoster | null
  cadenceStart: string | null // ISO date — set on PENDING -> ON_STRENGTH
  nextIssue: string | null // ISO date
  issueLog: RationIssueLogEntry[]
  enrolledAt: string | null
  standDownAt: string | null
}

export const NO_RATION_RECORD: RationRecord = {
  status: 'NONE',
  roster: null,
  cadenceStart: null,
  nextIssue: null,
  issueLog: [],
  enrolledAt: null,
  standDownAt: null,
}

// Month-by-month load engine (Section 2 cadence). Returns the item codes
// due for issue at the given monthIndex (0 = first issue).
export function getLoadForMonth(monthIndex: number): RationItem[] {
  return RATION_MANIFEST.filter((item) => {
    switch (item.cadence) {
      case 'MONTHLY':
        return true
      case 'QUARTERLY':
        return monthIndex % 3 === 0
      case 'SEMI-ANNUAL':
        return monthIndex % 6 === 0
      case 'ANNUAL':
        return monthIndex % 12 === 0
      default:
        return false
    }
  })
}

export function nextStatusAfterIssue(issueCount: number): RationStatus {
  return issueCount >= STEADY_STATE_ISSUE_THRESHOLD ? 'STEADY_STATE' : 'ON_STRENGTH'
}

export function addMonthsIso(iso: string, months: number): string {
  const d = new Date(iso)
  d.setUTCMonth(d.getUTCMonth() + months)
  return d.toISOString()
}

const pad = (s: string, n: number) => (s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length))

// Printed manifest card — plain text, fixed-width, LOT-FM-001 register.
// One card per issue. Rendered in a <pre> block and offered as a text
// download; also suitable for direct printing (monospace, 40-col width).
export function generateManifestCard(params: {
  operatorName: string
  monthIndex: number
  issuedAt: string
  itemCodes: string[]
}): string {
  const { operatorName, monthIndex, issuedAt, itemCodes } = params
  const items = RATION_MANIFEST.filter((i) => itemCodes.includes(i.code))
  const date = new Date(issuedAt).toISOString().slice(0, 10)
  const lines: string[] = []
  const W = 40
  const rule = '='.repeat(W)
  lines.push(rule)
  lines.push('LOT-FM-001 // MANIFEST CARD')
  lines.push(rule)
  lines.push(`OPERATOR:  ${operatorName.toUpperCase()}`)
  lines.push(`ISSUE NO:  ${String(monthIndex + 1).padStart(3, '0')}`)
  lines.push(`DATE:      ${date}`)
  lines.push('-'.repeat(W))
  for (const item of items) {
    lines.push(pad(item.code, 10) + item.nomenclature)
  }
  lines.push('-'.repeat(W))
  lines.push(`${items.length} ITEM(S) ISSUED. NOT FOR RESALE.`)
  lines.push(rule)
  return lines.join('\n')
}
