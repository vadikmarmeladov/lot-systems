/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT-FM-001 / BASIC RATION — 23-item civilian ration load.
 * Nomenclature + cadence only. COGS withheld from this file by design —
 * it is never bundled to the client (LOT-FM-001: "the ledger is the
 * marketing; no layer between public and manifest," but cost is not
 * the manifest).
 */

export type RationCadence = 'MONTHLY' | 'QUARTERLY' | 'ISSUE'

export type RationCategory = 'DOCTRINE' | 'FIELD KIT' | 'RECOVERY' | 'IDENTITY'

export type RationItem = {
  no: number
  nomenclature: string
  category: RationCategory
  cadence: RationCadence
}

export const BASIC_RATION: RationItem[] = [
  { no: 1, nomenclature: 'FIELD MANUAL, LOT-FM-001', category: 'DOCTRINE', cadence: 'ISSUE' },
  { no: 2, nomenclature: 'RATION CARD, PRINTED MANIFEST', category: 'DOCTRINE', cadence: 'MONTHLY' },
  { no: 3, nomenclature: 'NOTEBOOK, FIELD, POCKET, 96PG', category: 'FIELD KIT', cadence: 'MONTHLY' },
  { no: 4, nomenclature: 'PEN, ALL-WEATHER', category: 'FIELD KIT', cadence: 'QUARTERLY' },
  { no: 5, nomenclature: 'MULTITOOL, COMPACT, 5-FUNCTION', category: 'FIELD KIT', cadence: 'ISSUE' },
  { no: 6, nomenclature: 'FLASHLIGHT, EDC, RECHARGEABLE', category: 'FIELD KIT', cadence: 'ISSUE' },
  { no: 7, nomenclature: 'COMPASS, ANALOG, BASEPLATE', category: 'FIELD KIT', cadence: 'ISSUE' },
  { no: 8, nomenclature: 'CORD, PARACORD, 10FT', category: 'FIELD KIT', cadence: 'QUARTERLY' },
  { no: 9, nomenclature: 'MATCHES, WATERPROOF, BOX', category: 'FIELD KIT', cadence: 'QUARTERLY' },
  { no: 10, nomenclature: 'CHALK, GRIP, ANTI-SLIP, 2OZ', category: 'FIELD KIT', cadence: 'MONTHLY' },
  { no: 11, nomenclature: 'SALT, SEA, BATH, 8OZ', category: 'RECOVERY', cadence: 'MONTHLY' },
  { no: 12, nomenclature: 'CANDLE, BEESWAX, UNSCENTED, 4OZ', category: 'RECOVERY', cadence: 'MONTHLY' },
  { no: 13, nomenclature: 'MASK, SLEEP, COTTON', category: 'RECOVERY', cadence: 'QUARTERLY' },
  { no: 14, nomenclature: 'EARPLUGS, FOAM, PAIR X3', category: 'RECOVERY', cadence: 'MONTHLY' },
  { no: 15, nomenclature: 'TEA, HERBAL, LOOSE, 2OZ', category: 'RECOVERY', cadence: 'MONTHLY' },
  { no: 16, nomenclature: 'MAGNESIUM, GLYCINATE, 30CT', category: 'RECOVERY', cadence: 'MONTHLY' },
  { no: 17, nomenclature: 'ELECTROLYTE, PACKET, UNFLAVORED, X10', category: 'RECOVERY', cadence: 'MONTHLY' },
  { no: 18, nomenclature: 'BANDAGE, ADHESIVE, X10', category: 'RECOVERY', cadence: 'QUARTERLY' },
  { no: 19, nomenclature: 'PACK, COLD, INSTANT, SINGLE-USE', category: 'RECOVERY', cadence: 'QUARTERLY' },
  { no: 20, nomenclature: 'TOWEL, MICROFIBER, COMPACT', category: 'IDENTITY', cadence: 'ISSUE' },
  { no: 21, nomenclature: 'BOTTLE, WATER, STEEL, 20OZ', category: 'IDENTITY', cadence: 'ISSUE' },
  { no: 22, nomenclature: 'PATCH, LOT INSIGNIA, WOVEN', category: 'IDENTITY', cadence: 'ISSUE' },
  { no: 23, nomenclature: 'CARD, ID, LOT OPERATOR, LAMINATED', category: 'IDENTITY', cadence: 'ISSUE' },
]

export const BASIC_RATION_PRICE_USD = 100

export function getRationsByCategory(category: RationCategory): RationItem[] {
  return BASIC_RATION.filter(r => r.category === category)
}

export function getRationCadenceCounts(): Record<RationCadence, number> {
  return BASIC_RATION.reduce(
    (acc, r) => {
      acc[r.cadence] += 1
      return acc
    },
    { MONTHLY: 0, QUARTERLY: 0, ISSUE: 0 } as Record<RationCadence, number>
  )
}
