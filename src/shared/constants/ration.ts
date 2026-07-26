/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// LOT-FM-001 / BASIC RATION — the 23-item physical issue load.
// Doctrine: issue, do not sell. Nomenclature and cadence are public.
// Landed cost is never rendered here — it lives in the internal COGS
// worksheet, checked against the ceiling in LOT-FM-001 §OPERATING RULES.

export type RationCadence = 'M' | 'Q' | 'A' | 'ISSUE'

export const RATION_CADENCE_LABEL: Record<RationCadence, string> = {
  M: 'MONTHLY',
  Q: 'QUARTERLY',
  A: 'ANNUAL',
  ISSUE: 'ON ENROLLMENT',
}

export type RationCategory = 'HYGIENE' | 'APPAREL' | 'SUSTAINMENT' | 'HOME' | 'FIELD GEAR'

export interface RationItem {
  line: number
  nomenclature: string
  category: RationCategory
  cadence: RationCadence
  unit: string
}

// 23 items. Ordered by category, line-numbered for the printed manifest card
// (Month 3). Quantities are per-issue, not per-month.
export const RATION_ITEMS: RationItem[] = [
  { line: 1, nomenclature: 'Soap, Bar, Unscented', category: 'HYGIENE', cadence: 'M', unit: '1 bar' },
  { line: 2, nomenclature: 'Toothpaste, Fluoride, Travel', category: 'HYGIENE', cadence: 'M', unit: '1 tube' },
  { line: 3, nomenclature: 'Toothbrush, Soft Bristle', category: 'HYGIENE', cadence: 'Q', unit: '1 ea' },
  { line: 4, nomenclature: 'Deodorant, Unscented', category: 'HYGIENE', cadence: 'M', unit: '1 ea' },
  { line: 5, nomenclature: 'Razor, Safety, Cartridge', category: 'HYGIENE', cadence: 'M', unit: '1 ea' },
  { line: 6, nomenclature: 'Shaving Cream, Unscented', category: 'HYGIENE', cadence: 'M', unit: '1 tube' },
  { line: 7, nomenclature: 'Shampoo/Body Wash, 2-in-1', category: 'HYGIENE', cadence: 'M', unit: '1 bottle' },
  { line: 8, nomenclature: 'Socks, Crew, Cotton Blend', category: 'APPAREL', cadence: 'Q', unit: '1 pair' },
  { line: 9, nomenclature: 'T-Shirt, Cotton, Undyed', category: 'APPAREL', cadence: 'Q', unit: '1 ea' },
  { line: 10, nomenclature: 'Underwear, Cotton Blend', category: 'APPAREL', cadence: 'Q', unit: '1 ea' },
  { line: 11, nomenclature: 'Towel, Bath, Cotton', category: 'APPAREL', cadence: 'A', unit: '1 ea' },
  { line: 12, nomenclature: 'Multivitamin, 30-Count', category: 'SUSTAINMENT', cadence: 'M', unit: '1 bottle' },
  { line: 13, nomenclature: 'Electrolyte Packets', category: 'SUSTAINMENT', cadence: 'M', unit: '10-count' },
  { line: 14, nomenclature: 'First Aid Kit, Basic', category: 'SUSTAINMENT', cadence: 'A', unit: '1 kit' },
  { line: 15, nomenclature: 'Laundry Detergent, Concentrate Pods', category: 'HOME', cadence: 'M', unit: '20-count' },
  { line: 16, nomenclature: 'Dish Soap, Concentrate', category: 'HOME', cadence: 'Q', unit: '1 bottle' },
  { line: 17, nomenclature: 'All-Purpose Cleaner, Concentrate', category: 'HOME', cadence: 'Q', unit: '1 bottle' },
  { line: 18, nomenclature: 'Trash Bags, 13-Gallon', category: 'HOME', cadence: 'M', unit: '20-count' },
  { line: 19, nomenclature: 'Batteries, AA', category: 'HOME', cadence: 'Q', unit: '4-pack' },
  { line: 20, nomenclature: 'Notebook, Ruled, Pocket', category: 'FIELD GEAR', cadence: 'Q', unit: '1 ea' },
  { line: 21, nomenclature: 'Pen, Ballpoint, Black', category: 'FIELD GEAR', cadence: 'M', unit: '2 ea' },
  { line: 22, nomenclature: 'Sewing Kit, Travel', category: 'FIELD GEAR', cadence: 'ISSUE', unit: '1 kit' },
  { line: 23, nomenclature: 'Flashlight, LED, Compact', category: 'FIELD GEAR', cadence: 'ISSUE', unit: '1 ea' },
]

export const RATION_ITEM_COUNT = RATION_ITEMS.length

export const RATION_PRICE_USD = 100

export const RATION_MARGIN_FLOOR_PCT = 60

export const RATION_COGS_CEILING_USD = 40

// Doctrine statement — verbatim public copy, quartermaster voice.
export const RATION_DOCTRINE_LINES: string[] = [
  'ISSUE, NOT SALE. THE SUBSCRIBER IS ON STRENGTH — CARRIED ON THE ROSTER, NOT BILLED AS A CUSTOMER.',
  'ONE RATE. USD 100 PER MONTH. NO TIERS. NO UPSELL.',
  'THE LEDGER BELOW IS THE ENTIRE OFFER. NOMENCLATURE AND CADENCE, PUBLIC. LANDED COST, WITHHELD.',
  'CADENCE GOVERNS ISSUE, NOT PRICE. THE RATE DOES NOT MOVE WHEN THE LOAD DOES.',
]

export const RATION_STATUS_LINE =
  'STATUS: OPEN TAB — LIVE // READ-ONLY // NO ACCOUNT REQUIRED'
