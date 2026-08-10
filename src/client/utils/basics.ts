/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// BASIC — civilian ration subscription. Source: docs/corporate/LOT-FM-001.md
// Month 1 (LEDGER & DOCTRINE): public read-only manifest. No cost fields are
// defined here or anywhere in client code — the COGS ceiling in LOT-FM-001
// section 0.2 is verified in the manual only. The ledger is the marketing;
// nothing withheld from the manual ships hidden in the bundle either.

export type RationCadence = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'

export type RationCategory =
  | 'STATIONERY'
  | 'HYGIENE'
  | 'APPAREL'
  | 'EDC'
  | 'HOME'
  | 'ADMIN'

export interface RationLine {
  line: number
  nomenclature: string
  cadence: RationCadence
  category: RationCategory
}

export const RATION_ITEMS: RationLine[] = [
  { line: 1, nomenclature: 'FIELD NOTEBOOK, 96-LEAF, RULED', cadence: 'MONTHLY', category: 'STATIONERY' },
  { line: 2, nomenclature: 'PEN, BALLPOINT, BLACK, 3-PACK', cadence: 'MONTHLY', category: 'STATIONERY' },
  { line: 3, nomenclature: 'PENCIL, NO. 2, HEXAGONAL, 2-PACK', cadence: 'MONTHLY', category: 'STATIONERY' },
  { line: 4, nomenclature: 'SOAP, BAR, UNSCENTED, 4 OZ', cadence: 'MONTHLY', category: 'HYGIENE' },
  { line: 5, nomenclature: 'TOOTHPASTE, FLUORIDE, TRAVEL SIZE', cadence: 'MONTHLY', category: 'HYGIENE' },
  { line: 6, nomenclature: 'TOOTHBRUSH, MEDIUM BRISTLE', cadence: 'MONTHLY', category: 'HYGIENE' },
  { line: 7, nomenclature: 'RAZOR, DISPOSABLE, 5-BLADE, 2-PACK', cadence: 'MONTHLY', category: 'HYGIENE' },
  { line: 8, nomenclature: 'DEODORANT, UNSCENTED, SOLID', cadence: 'MONTHLY', category: 'HYGIENE' },
  { line: 9, nomenclature: 'SOCKS, CREW, BLACK, 3-PAIR', cadence: 'MONTHLY', category: 'APPAREL' },
  { line: 10, nomenclature: 'UNDERSHIRT, CREW NECK, WHITE, 2-PACK', cadence: 'MONTHLY', category: 'APPAREL' },
  { line: 11, nomenclature: 'HANDKERCHIEF, COTTON, WHITE, 2-PACK', cadence: 'MONTHLY', category: 'APPAREL' },
  { line: 12, nomenclature: 'BATTERY, AA, ALKALINE, 4-PACK', cadence: 'MONTHLY', category: 'EDC' },
  { line: 13, nomenclature: 'USB-C CABLE, 1M, BRAIDED', cadence: 'QUARTERLY', category: 'EDC' },
  { line: 14, nomenclature: 'FLASHLIGHT, EDC, AAA', cadence: 'QUARTERLY', category: 'EDC' },
  { line: 15, nomenclature: 'MULTITOOL, FOLDING, 6-FUNCTION', cadence: 'QUARTERLY', category: 'EDC' },
  { line: 16, nomenclature: 'FIRST AID KIT, POCKET', cadence: 'QUARTERLY', category: 'HOME' },
  { line: 17, nomenclature: 'LIGHTER, REFILLABLE', cadence: 'QUARTERLY', category: 'EDC' },
  { line: 18, nomenclature: 'TOWEL, MICROFIBER, COMPACT', cadence: 'QUARTERLY', category: 'HOME' },
  { line: 19, nomenclature: 'SEWING KIT, TRAVEL', cadence: 'QUARTERLY', category: 'HOME' },
  { line: 20, nomenclature: 'DUFFEL, CANVAS, 30L', cadence: 'ANNUAL', category: 'HOME' },
  { line: 21, nomenclature: 'WATCH CAP, WOOL BLEND, BLACK', cadence: 'ANNUAL', category: 'APPAREL' },
  { line: 22, nomenclature: 'WATER BOTTLE, STEEL, 750 ML', cadence: 'ANNUAL', category: 'HOME' },
  { line: 23, nomenclature: 'LOT MANIFEST CARD, PRINTED, ISSUE-STAMPED', cadence: 'MONTHLY', category: 'ADMIN' },
]

export const BASIC_PRICE_USD = 100

export const BASIC_DOCTRINE = [
  'LOT issues. LOT does not sell.',
  'Enrollment places the operator ON STRENGTH: entitled to draw, on a fixed monthly cadence, against a standing 23-line ration. The ration is not a curated box and not a surprise — it is a manifest, published in full, in the same register a quartermaster reads a supply chit.',
  'What ships this month is what the ledger says ships this month. The ledger is the marketing. There is no other page.',
]

export const BASIC_TERMS = [
  'USD 100.00 / MONTH — FLAT — NO TIERS',
  'NO CONTRACT — STAND DOWN AT WILL',
  '23 LINES STANDING — MONTHLY / QUARTERLY / ANNUAL CADENCE',
]
