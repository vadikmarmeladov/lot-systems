/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// LOT-FM-001 / BASIC RATION — canonical manifest.
// Source of truth for the OPEN TAB ledger (public), the roster intake (Month 2),
// and the fulfillment load engine (Month 3). COGS is tracked internally against
// the ceiling below but is never rendered on any public surface — the ledger is
// the marketing, not the margin.

export const RATION_MODULE_ID = 'LOT-FM-001'
export const RATION_MODULE_NAME = 'BASIC'

export const RATION_PRICE_USD = 100
export const RATION_BILLING_CADENCE = 'MONTHLY'

// Internal ceiling only. Never surfaced on OPEN TAB or any public endpoint.
export const RATION_COGS_CEILING_USD = 40
export const RATION_MARGIN_FLOOR_PCT = 60

export type RationCadence = 'MONTHLY' | 'QUARTERLY' | 'SEMI-ANNUAL'

export interface RationItem {
  code: string
  category: string
  nomenclature: string
  cadence: RationCadence
}

// 23-item load. Category groupings mirror a standard-issue kit list:
// hygiene first, then consumables, apparel, field maintenance.
export const RATION_MANIFEST: RationItem[] = [
  // FIELD HYGIENE
  { code: 'FH-01', category: 'FIELD HYGIENE', nomenclature: 'Toothbrush, soft bristle', cadence: 'QUARTERLY' },
  { code: 'FH-02', category: 'FIELD HYGIENE', nomenclature: 'Toothpaste, travel tube', cadence: 'MONTHLY' },
  { code: 'FH-03', category: 'FIELD HYGIENE', nomenclature: 'Soap, bar, unscented', cadence: 'MONTHLY' },
  { code: 'FH-04', category: 'FIELD HYGIENE', nomenclature: 'Deodorant, unscented', cadence: 'MONTHLY' },
  { code: 'FH-05', category: 'FIELD HYGIENE', nomenclature: 'Razor, disposable, 3-pack', cadence: 'MONTHLY' },
  { code: 'FH-06', category: 'FIELD HYGIENE', nomenclature: 'Nail clipper', cadence: 'SEMI-ANNUAL' },
  { code: 'FH-07', category: 'FIELD HYGIENE', nomenclature: 'Cotton swabs, 100 ct', cadence: 'QUARTERLY' },

  // CONSUMABLES
  { code: 'CN-01', category: 'CONSUMABLES', nomenclature: 'Coffee, instant, single-origin, 10-pack', cadence: 'MONTHLY' },
  { code: 'CN-02', category: 'CONSUMABLES', nomenclature: 'Electrolyte tablets, 10-pack', cadence: 'MONTHLY' },
  { code: 'CN-03', category: 'CONSUMABLES', nomenclature: 'Multivitamin, 30 ct', cadence: 'MONTHLY' },
  { code: 'CN-04', category: 'CONSUMABLES', nomenclature: 'Field notebook, pocket, 96 pg', cadence: 'MONTHLY' },
  { code: 'CN-05', category: 'CONSUMABLES', nomenclature: 'Pen, black ink, retractable', cadence: 'MONTHLY' },
  { code: 'CN-06', category: 'CONSUMABLES', nomenclature: 'Duct tape, mini roll', cadence: 'QUARTERLY' },

  // APPAREL, BASIC
  { code: 'AB-01', category: 'APPAREL, BASIC', nomenclature: 'Undershirt, crew, black', cadence: 'QUARTERLY' },
  { code: 'AB-02', category: 'APPAREL, BASIC', nomenclature: 'Socks, crew, 3-pack, black', cadence: 'QUARTERLY' },
  { code: 'AB-03', category: 'APPAREL, BASIC', nomenclature: 'Undergarment, brief, 3-pack, black', cadence: 'QUARTERLY' },
  { code: 'AB-04', category: 'APPAREL, BASIC', nomenclature: 'Bandana, black', cadence: 'SEMI-ANNUAL' },
  { code: 'AB-05', category: 'APPAREL, BASIC', nomenclature: 'Sleep mask', cadence: 'SEMI-ANNUAL' },

  // FIELD MAINTENANCE
  { code: 'FM-01', category: 'FIELD MAINTENANCE', nomenclature: 'Batteries, AA, 4-pack', cadence: 'MONTHLY' },
  { code: 'FM-02', category: 'FIELD MAINTENANCE', nomenclature: 'Cloth, microfiber', cadence: 'QUARTERLY' },
  { code: 'FM-03', category: 'FIELD MAINTENANCE', nomenclature: 'Zip ties, 20-pack', cadence: 'SEMI-ANNUAL' },
  { code: 'FM-04', category: 'FIELD MAINTENANCE', nomenclature: 'Adhesive, single-use', cadence: 'QUARTERLY' },
  { code: 'FM-05', category: 'FIELD MAINTENANCE', nomenclature: 'Fire starter, waterproof', cadence: 'SEMI-ANNUAL' },
]

if (RATION_MANIFEST.length !== 23) {
  throw new Error(`RATION_MANIFEST must carry exactly 23 items, has ${RATION_MANIFEST.length}`)
}

export const RATION_DOCTRINE = [
  'LOT does not sell consumables. LOT issues them.',
  'ON STRENGTH means the ration is on the books — not a subscription, a manifest entry.',
  '$100/month holds you on the roster. It is not a purchase you evaluate item by item.',
  'The System already tracks what the operator runs on. The ration puts the physical layer on the same schedule as the digital one.',
  'No upsell. No SKU browsing. Read the ledger. Do not shop it.',
]

// Upgrade / roster status. Month 1 ships only NONE and OPEN — the rest
// (PENDING, ON_STRENGTH, STEADY_STATE, STAND_DOWN) activate in Month 2.
export type RationStrengthStatus =
  | 'NONE'
  | 'PENDING'
  | 'ON_STRENGTH'
  | 'STEADY_STATE'
  | 'STAND_DOWN'
