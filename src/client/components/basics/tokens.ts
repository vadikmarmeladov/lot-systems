/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | Made in the USA | brand.lot-systems.com
 */

// LOT-FM-001 — BASIC RATION
// USD 100 / MO | ≥60% MARGIN | ≤USD 40 LANDED

export type Cadence = 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL'

export type RationSection = 'NUTRITION' | 'HYGIENE' | 'HEALTH' | 'UTILITY'

export type RationItem = {
  id: number
  section: RationSection
  nomenclature: string
  cadence: Cadence
}

export const RATION_PRICE_USD = 100
export const RATION_COGS_CEILING_USD = 40
export const RATION_MARGIN_FLOOR_PCT = 60
export const RATION_ITEM_COUNT = 23

export const DOCTRINE_LINES = [
  'ISSUE, DO NOT SELL. THE OPERATOR IS ON STRENGTH.',
  'THE LEDGER IS THE MARKETING.',
  'NO LAYER BETWEEN PUBLIC AND MANIFEST.',
  `USD ${RATION_PRICE_USD} / MO. MARGIN ≥${RATION_MARGIN_FLOOR_PCT}%. LANDED ≤USD ${RATION_COGS_CEILING_USD}.`,
] as const

// 23-ITEM RATION LOAD — LOT-FM-001, SECTION 2
// COGS WITHHELD PER DOCTRINE. CADENCE = ISSUE FREQUENCY.
export const MANIFEST: RationItem[] = [
  // ── NUTRITION (8 ITEMS) ─────────────────────────────────────────────────
  { id: 1,  section: 'NUTRITION', nomenclature: 'PROTEIN BAR / MIXED BERRY / 4-PK',         cadence: 'MONTHLY'   },
  { id: 2,  section: 'NUTRITION', nomenclature: 'ELECTROLYTE TABS / UNFLAVORED / 30-CT',    cadence: 'MONTHLY'   },
  { id: 3,  section: 'NUTRITION', nomenclature: 'MULTIVITAMIN / GENERAL FORMULA / 30-CT',   cadence: 'MONTHLY'   },
  { id: 4,  section: 'NUTRITION', nomenclature: 'VITAMIN D3 / 2000 IU / 30-CT',             cadence: 'MONTHLY'   },
  { id: 5,  section: 'NUTRITION', nomenclature: 'OMEGA-3 / 1000 MG / 30-CT',                cadence: 'MONTHLY'   },
  { id: 6,  section: 'NUTRITION', nomenclature: 'MAGNESIUM GLYCINATE / 200 MG / 30-CT',     cadence: 'MONTHLY'   },
  { id: 7,  section: 'NUTRITION', nomenclature: 'CAFFEINE TAB / 100 MG / 30-CT',            cadence: 'MONTHLY'   },
  { id: 8,  section: 'NUTRITION', nomenclature: 'TRAIL MIX / ALMONDS & RAISINS / 200G',     cadence: 'MONTHLY'   },

  // ── HYGIENE (6 ITEMS) ───────────────────────────────────────────────────
  { id: 9,  section: 'HYGIENE',   nomenclature: 'SOAP BAR / UNSCENTED / 140G',              cadence: 'MONTHLY'   },
  { id: 10, section: 'HYGIENE',   nomenclature: 'TOOTHPASTE / FLUORIDE / 75ML',             cadence: 'MONTHLY'   },
  { id: 11, section: 'HYGIENE',   nomenclature: 'DENTAL FLOSS / WAXED / 50M',              cadence: 'MONTHLY'   },
  { id: 12, section: 'HYGIENE',   nomenclature: 'RAZOR / TWIN BLADE / 2-PK',               cadence: 'MONTHLY'   },
  { id: 13, section: 'HYGIENE',   nomenclature: 'HAND SANITIZER / 70% ETHANOL / 100ML',    cadence: 'MONTHLY'   },
  { id: 14, section: 'HYGIENE',   nomenclature: 'DEODORANT STICK / ALUMINUM-FREE / 60G',   cadence: 'MONTHLY'   },

  // ── HEALTH (5 ITEMS) ────────────────────────────────────────────────────
  { id: 15, section: 'HEALTH',    nomenclature: 'IBUPROFEN / 200 MG / 24-CT',               cadence: 'MONTHLY'   },
  { id: 16, section: 'HEALTH',    nomenclature: 'CETIRIZINE / 10 MG / 10-CT',               cadence: 'MONTHLY'   },
  { id: 17, section: 'HEALTH',    nomenclature: 'ADHESIVE BANDAGE / ASSORTED / 10-CT',      cadence: 'MONTHLY'   },
  { id: 18, section: 'HEALTH',    nomenclature: 'ANTISEPTIC WIPE / BENZALKONIUM / 10-CT',   cadence: 'MONTHLY'   },
  { id: 19, section: 'HEALTH',    nomenclature: 'LIP BALM / SPF 30 / 4G',                  cadence: 'QUARTERLY' },

  // ── UTILITY (4 ITEMS) ───────────────────────────────────────────────────
  { id: 20, section: 'UTILITY',   nomenclature: 'NOTEBOOK / A6 POCKET / RULED',             cadence: 'QUARTERLY' },
  { id: 21, section: 'UTILITY',   nomenclature: 'PENCIL / HB / 3-PK',                       cadence: 'QUARTERLY' },
  { id: 22, section: 'UTILITY',   nomenclature: 'CABLE TIE / 200MM / 10-PK',                cadence: 'QUARTERLY' },
  { id: 23, section: 'UTILITY',   nomenclature: 'MANIFEST CARD / PRINTED / CURRENT ISSUE',  cadence: 'MONTHLY'   },
]

export const SECTIONS_ORDER: RationSection[] = ['NUTRITION', 'HYGIENE', 'HEALTH', 'UTILITY']

export const SECTION_ITEM_COUNTS: Record<RationSection, number> = {
  NUTRITION: 8,
  HYGIENE:   6,
  HEALTH:    5,
  UTILITY:   4,
}
