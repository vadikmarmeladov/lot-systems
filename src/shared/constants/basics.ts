/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE
 * 23-ITEM CIVILIAN RATION — DOCTRINE, MANIFEST, TYPES
 */

export type RationCadence = 'MO' | 'Q2' | 'Q3'
export type RationCategory = 'SUBSISTENCE' | 'HYGIENE' | 'UTILITY' | 'DOCTRINE'

export type RationItem = {
  id: number
  nomenclature: string
  qty: string
  cadence: RationCadence
  category: RationCategory
}

export const RATION_MANIFEST: RationItem[] = [
  // SUBSISTENCE
  { id: 1,  nomenclature: 'BAR, ENERGY, COMPRESSED, CHOCOLATE', qty: '× 6',  cadence: 'MO', category: 'SUBSISTENCE' },
  { id: 2,  nomenclature: 'OATS, INSTANT, PLAIN, SINGLE-SERVE',  qty: '× 30', cadence: 'MO', category: 'SUBSISTENCE' },
  { id: 3,  nomenclature: 'COFFEE, INSTANT, DARK ROAST, SACHET', qty: '× 20', cadence: 'MO', category: 'SUBSISTENCE' },
  { id: 4,  nomenclature: 'TAB, ELECTROLYTE, CITRUS',             qty: '× 30', cadence: 'MO', category: 'SUBSISTENCE' },
  { id: 5,  nomenclature: 'JERKY, BEEF, ORIGINAL, PKT',           qty: '× 2',  cadence: 'MO', category: 'SUBSISTENCE' },
  { id: 6,  nomenclature: 'BUTTER, PEANUT, SINGLE-SERVE PKT',     qty: '× 6',  cadence: 'MO', category: 'SUBSISTENCE' },
  { id: 7,  nomenclature: 'HONEY, WILDFLOWER, PKT',               qty: '× 12', cadence: 'MO', category: 'SUBSISTENCE' },
  { id: 8,  nomenclature: 'MIX, NUT, SALTED, PKT',                qty: '× 4',  cadence: 'MO', category: 'SUBSISTENCE' },
  { id: 9,  nomenclature: 'TEA, PLAIN, SACHET',                   qty: '× 20', cadence: 'MO', category: 'SUBSISTENCE' },
  // HYGIENE
  { id: 10, nomenclature: 'SOAP, BAR, UNSCENTED',                  qty: '× 1',  cadence: 'MO', category: 'HYGIENE' },
  { id: 11, nomenclature: 'TOOTHPASTE, FLUORIDE, 1 OZ',            qty: '× 1',  cadence: 'MO', category: 'HYGIENE' },
  { id: 12, nomenclature: 'FLOSS, DENTAL, 50M SPOOL',              qty: '× 1',  cadence: 'Q2', category: 'HYGIENE' },
  { id: 13, nomenclature: 'RAZOR, DISPOSABLE, TRIPLE',             qty: '× 4',  cadence: 'MO', category: 'HYGIENE' },
  { id: 14, nomenclature: 'BANDAGE, ADHESIVE, ASSORTED',           qty: '× 10', cadence: 'MO', category: 'HYGIENE' },
  // UTILITY
  { id: 15, nomenclature: 'SANITIZER, HAND, UNSCENTED, 1 OZ',      qty: '× 1',  cadence: 'MO', category: 'UTILITY' },
  { id: 16, nomenclature: 'TAPE, DUCT, 1 IN × 6 FT STRIP',         qty: '× 1',  cadence: 'Q2', category: 'UTILITY' },
  { id: 17, nomenclature: 'BATTERY, AA, ALKALINE',                  qty: '× 4',  cadence: 'Q2', category: 'UTILITY' },
  { id: 18, nomenclature: 'NOTEPAD, POCKET, PLAIN',                 qty: '× 1',  cadence: 'Q3', category: 'UTILITY' },
  { id: 19, nomenclature: 'PEN, BALLPOINT, BLACK',                  qty: '× 2',  cadence: 'Q3', category: 'UTILITY' },
  { id: 20, nomenclature: 'BALM, LIP, PLAIN',                       qty: '× 1',  cadence: 'Q2', category: 'UTILITY' },
  { id: 21, nomenclature: 'TIE, CABLE, NYLON',                      qty: '× 10', cadence: 'Q3', category: 'UTILITY' },
  // DOCTRINE
  { id: 22, nomenclature: 'BANDANA, COTTON, OLIVE DRAB',            qty: '× 1',  cadence: 'Q3', category: 'DOCTRINE' },
  { id: 23, nomenclature: 'CARD, MANIFEST, PRINTED',                qty: '× 1',  cadence: 'MO', category: 'DOCTRINE' },
]

export const BASICS_DOCTRINE_LINES = [
  'ISSUE ONE CIVILIAN RATION MONTHLY.',
  'THE LEDGER IS THE MARKETING.',
  'NO LAYER BETWEEN PUBLIC AND MANIFEST.',
]

export const BASICS_PRICE_USD = 100
export const BASICS_COGS_CEILING_USD = 40
export const BASICS_MARGIN_TARGET_PCT = 60

export type BasicsStatus =
  | 'PENDING'
  | 'ON_STRENGTH'
  | 'STEADY_STATE'
  | 'STAND_DOWN'

export type BasicsSize = 'S' | 'M' | 'L' | 'XL'

export type BasicsRoster = {
  size: BasicsSize
  firstName: string
  lastName: string
  address: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
  cadenceStart: string
}

export type BasicsIssue = {
  issueNumber: number
  month: number
  year: number
  shippedAt: string | null
  deliveredAt: string | null
  itemIds: number[]
}

export type BasicsMetadata = {
  status: BasicsStatus
  roster?: BasicsRoster
  upgradedAt?: string
  standDownAt?: string
  issues: BasicsIssue[]
  nextIssueDate?: string
}

export function shipsThisIssue(cadence: RationCadence, issueNumber: number): boolean {
  if (cadence === 'MO') return true
  if (cadence === 'Q2') return issueNumber % 2 === 1
  if (cadence === 'Q3') return (issueNumber - 1) % 3 === 0
  return false
}

export function getIssueItemIds(issueNumber: number): number[] {
  return RATION_MANIFEST
    .filter((item) => shipsThisIssue(item.cadence, issueNumber))
    .map((item) => item.id)
}

export function calcNextIssueDate(cadenceStart: string, fromDate?: Date): Date {
  const start = new Date(cadenceStart)
  const ref = fromDate || new Date()
  let d = new Date(start)
  while (d <= ref) {
    d = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
  }
  return d
}

export function calcIssueNumber(cadenceStart: string, issueDate: Date): number {
  const start = new Date(cadenceStart)
  const diffMonths =
    (issueDate.getFullYear() - start.getFullYear()) * 12 +
    (issueDate.getMonth() - start.getMonth())
  return Math.max(1, diffMonths + 1)
}

export const MONTH_NAMES = [
  'JAN','FEB','MAR','APR','MAY','JUN',
  'JUL','AUG','SEP','OCT','NOV','DEC',
]
