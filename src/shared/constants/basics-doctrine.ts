/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE
 * SECTION 1 — RATION MANIFEST + DOCTRINE
 */

export type RationCadence = 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY'
export type RationCategory = 'NUTRITION' | 'HEALTH' | 'HYGIENE' | 'EQUIPMENT'

export type RationItem = {
  line: string
  nomenclature: string
  spec: string
  cadence: RationCadence
  category: RationCategory
  // Landed cost, cents. Quartermaster estimate pending supplier quote confirmation (M3).
  landedCostCents: number
}

// 23-item civilian ration load per LOT-FM-001.
// COGS ceiling: USD 40.00 landed per issue. Margin floor: 60%. Never breached — see cadence.ts.
export const RATION_MANIFEST: RationItem[] = [
  { line: '01', nomenclature: 'ROLLED OATS',                  spec: '40 OZ',           cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 220 },
  { line: '02', nomenclature: 'LENTILS, RED',                  spec: '2 LB',            cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 150 },
  { line: '03', nomenclature: 'RICE, BROWN LONG GRAIN',        spec: '3 LB',            cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 190 },
  { line: '04', nomenclature: 'COFFEE, DARK ROAST GROUND',     spec: '12 OZ',           cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 380 },
  { line: '05', nomenclature: 'HONEY, RAW WILDFLOWER',         spec: '12 OZ',           cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 300 },
  { line: '06', nomenclature: 'OLIVE OIL, COLD-PRESSED EVOO',  spec: '750 ML',          cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 390 },
  { line: '07', nomenclature: 'SALT, KOSHER',                  spec: '1 LB',            cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 70  },
  { line: '08', nomenclature: 'BLACK PEPPER, WHOLE',           spec: '2 OZ',            cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 90  },
  { line: '09', nomenclature: 'APPLE CIDER VINEGAR, RAW',      spec: '16 OZ',           cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 160 },
  { line: '10', nomenclature: 'SEEDS, MIXED (HEMP/CHIA/FLAX)', spec: '12 OZ',           cadence: 'MONTHLY',   category: 'NUTRITION', landedCostCents: 220 },
  { line: '11', nomenclature: 'VITAMIN D3',                    spec: '2000 IU / 90 CT', cadence: 'MONTHLY',   category: 'HEALTH',    landedCostCents: 120 },
  { line: '12', nomenclature: 'VITAMIN C',                     spec: '500 MG / 90 CT',  cadence: 'MONTHLY',   category: 'HEALTH',    landedCostCents: 100 },
  { line: '13', nomenclature: 'ELECTROLYTE POWDER',            spec: '30 SRV',          cadence: 'MONTHLY',   category: 'HEALTH',    landedCostCents: 150 },
  { line: '14', nomenclature: 'OMEGA-3, FISH OIL',             spec: '1000 MG / 60 CT', cadence: 'MONTHLY',   category: 'HEALTH',    landedCostCents: 180 },
  { line: '15', nomenclature: 'PROBIOTIC, MULTI-STRAIN',       spec: '30 CT',           cadence: 'MONTHLY',   category: 'HEALTH',    landedCostCents: 210 },
  { line: '16', nomenclature: 'MAGNESIUM GLYCINATE',           spec: '400 MG / 60 CT',  cadence: 'MONTHLY',   category: 'HEALTH',    landedCostCents: 130 },
  { line: '17', nomenclature: 'ZINC, CHELATED',                spec: '15 MG / 60 CT',   cadence: 'MONTHLY',   category: 'HEALTH',    landedCostCents: 90  },
  { line: '18', nomenclature: 'SOAP, CASTILE UNSCENTED',       spec: '2 BAR',           cadence: 'MONTHLY',   category: 'HYGIENE',   landedCostCents: 90  },
  { line: '19', nomenclature: 'RAZOR, SAFETY + BLADES',        spec: '1 HDL / 10 BL',   cadence: 'MONTHLY',   category: 'HYGIENE',   landedCostCents: 160 },
  { line: '20', nomenclature: 'FLOSS, UNWAXED',                spec: '2 CT',            cadence: 'MONTHLY',   category: 'HYGIENE',   landedCostCents: 40  },
  { line: '21', nomenclature: 'TOOTHPASTE, FLUORIDE-FREE',     spec: '4 OZ',            cadence: 'QUARTERLY', category: 'HYGIENE',   landedCostCents: 150 },
  { line: '22', nomenclature: 'DEODORANT, CRYSTAL MINERAL',    spec: '3.5 OZ',          cadence: 'QUARTERLY', category: 'HYGIENE',   landedCostCents: 180 },
  { line: '23', nomenclature: 'JOURNAL, FIELD (LOT-FM)',       spec: '1 EA',            cadence: 'QUARTERLY', category: 'EQUIPMENT', landedCostCents: 220 },
]

export const DOCTRINE_LINES = [
  'BASIC is the physical layer of the LOT® System.',
  'One ration per operator per month. Issued. Not sold.',
  'The ledger is the marketing. No layer between public and manifest.',
  'COGS ceiling: USD 40.00 landed. Margin floor: 60%. Never breached.',
]

export const PRICE_LINE = 'USD 100.00 / MO.'
export const PRICE_CENTS = 10000
export const COGS_CEILING_CENTS = 4000
export const MARGIN_FLOOR = 0.60
export const MANUAL_REF = 'LOT-FM-001'
export const RATION_COUNT = 23
