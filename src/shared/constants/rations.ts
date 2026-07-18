/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT-FM-001 / BASICS — surprise-box physical subscription.
 *
 * Plan shape (per S-2 intake 2026-07-18):
 *   AI (digital only)      $99/mo
 *   BASICS (physical)      $399/mo, AI included — first physical module.
 *                           A smart-curated surprise box: the operator does
 *                           not know contents in advance. Pool is sampled
 *                           from WARDROBE (native to Basics) plus preview
 *                           items representing modules not yet subscribed
 *                           to (SELF-CARE, HOME) — including the LOT®
 *                           BioStation constructor shipping part-by-part.
 *   Module upgrades        +$99/mo each. Swaps a module's "preview" sample
 *                           for its full, dedicated, more granular stream.
 *
 * COGS withheld from this file by design — it is bundled to the client and
 * must never carry cost data.
 */

export type RationCadence = 'MONTHLY' | 'QUARTERLY' | 'ISSUE'

export type RationModule = 'WARDROBE' | 'SELF-CARE' | 'HOME'

export type RationItem = {
  no: number
  nomenclature: string
  module: RationModule
  cadence: RationCadence
  /**
   * True if this item can surprise-appear in the default BASICS box as a
   * preview/representative of its module, even without that module's
   * upgrade. WARDROBE items are always true (Basics IS the wardrobe
   * stream). SELF-CARE/HOME items are a deliberately small representative
   * subset — the rest only ship once the operator upgrades that module.
   */
  previewInBasics: boolean
}

export const RATION_POOL: RationItem[] = [
  // WARDROBE — native to Basics, always in rotation
  { no: 1, nomenclature: 'SOCKS, PAIR', module: 'WARDROBE', cadence: 'MONTHLY', previewInBasics: true },
  { no: 2, nomenclature: 'UNDERWEAR, PAIR', module: 'WARDROBE', cadence: 'MONTHLY', previewInBasics: true },
  { no: 3, nomenclature: 'T-SHIRT, LOT® UNIFORM', module: 'WARDROBE', cadence: 'MONTHLY', previewInBasics: true },
  { no: 4, nomenclature: 'BACKPACK, LOT® ISSUE', module: 'WARDROBE', cadence: 'ISSUE', previewInBasics: true },
  { no: 5, nomenclature: 'CAP, LOT® INSIGNIA', module: 'WARDROBE', cadence: 'QUARTERLY', previewInBasics: true },

  // SELF-CARE — small preview set ships inside Basics; full stream requires
  // the Self-care module upgrade (+$99/mo)
  { no: 6, nomenclature: 'TOOTHBRUSH', module: 'SELF-CARE', cadence: 'MONTHLY', previewInBasics: true },
  { no: 7, nomenclature: 'SOAP BAR, UNSCENTED', module: 'SELF-CARE', cadence: 'MONTHLY', previewInBasics: true },
  { no: 8, nomenclature: 'TEA, HERBAL, LOOSE, 2OZ', module: 'SELF-CARE', cadence: 'MONTHLY', previewInBasics: false },
  { no: 9, nomenclature: 'MAGNESIUM, GLYCINATE, 30CT', module: 'SELF-CARE', cadence: 'MONTHLY', previewInBasics: false },
  { no: 10, nomenclature: 'ELECTROLYTE, PACKET, UNFLAVORED, X10', module: 'SELF-CARE', cadence: 'MONTHLY', previewInBasics: false },
  { no: 11, nomenclature: 'SLEEP MASK, COTTON', module: 'SELF-CARE', cadence: 'QUARTERLY', previewInBasics: false },
  { no: 12, nomenclature: 'EARPLUGS, FOAM, PAIR X3', module: 'SELF-CARE', cadence: 'MONTHLY', previewInBasics: false },
  { no: 13, nomenclature: 'BANDAGE, ADHESIVE, X10', module: 'SELF-CARE', cadence: 'QUARTERLY', previewInBasics: false },

  // HOME — candle previews in Basics ahead of the Home module launching;
  // the BioStation constructor (below) is this module's flagship line
  { no: 14, nomenclature: 'CANDLE, BEESWAX, UNSCENTED, 4OZ', module: 'HOME', cadence: 'MONTHLY', previewInBasics: true },
]

export function getRationPoolByModule(module: RationModule): RationItem[] {
  return RATION_POOL.filter(r => r.module === module)
}

export function getBasicsPreviewPool(): RationItem[] {
  return RATION_POOL.filter(r => r.previewInBasics)
}

/**
 * LOT® BioStation™ — 12-month build-it-yourself weather station,
 * shipping part-by-part inside the Basics box. Dependency-ordered, not
 * alphabetical: the compute/power core ships first (immediately useful —
 * pairs with the dashboard/API on arrival), then the mount, then sensors
 * in ascending complexity, with the personalized data drive slotted in
 * once there's real sensor data worth logging, and the final month closes
 * the build with weatherproofing + calibration.
 *
 * PROVISIONAL: only months 1-4 were specified directly by S-2 (core,
 * tripod, first sensor, personalized hard drive). Months 5-12 are this
 * session's best-effort constructor sequence — supersede once a real
 * BioStation bill of materials exists.
 */
export type BioStationPart = {
  month: number
  nomenclature: string
}

export const BIOSTATION_SEQUENCE: BioStationPart[] = [
  { month: 1, nomenclature: 'BIOSTATION™ CORE, COMPUTE + POWER UNIT' },
  { month: 2, nomenclature: 'BIOSTATION™ MOUNT, TRIPOD, ADJUSTABLE' },
  { month: 3, nomenclature: 'BIOSTATION™ SENSOR, TEMPERATURE + HUMIDITY' },
  { month: 4, nomenclature: 'BIOSTATION™ DRIVE, PERSONALIZED, DATA LOG' },
  { month: 5, nomenclature: 'BIOSTATION™ SENSOR, WIND, ANEMOMETER' },
  { month: 6, nomenclature: 'BIOSTATION™ SENSOR, RAIN GAUGE' },
  { month: 7, nomenclature: 'BIOSTATION™ SENSOR, UV + LIGHT' },
  { month: 8, nomenclature: 'BIOSTATION™ SENSOR, AIR QUALITY' },
  { month: 9, nomenclature: 'BIOSTATION™ POWER, SOLAR PANEL' },
  { month: 10, nomenclature: 'BIOSTATION™ POWER, BATTERY PACK' },
  { month: 11, nomenclature: 'BIOSTATION™ CABLE + CONNECT KIT' },
  { month: 12, nomenclature: 'BIOSTATION™ ENCLOSURE, WEATHERPROOF + CALIBRATION KIT' },
]

export type PlanId = 'AI' | 'BASICS' | 'SELF_CARE' | 'HOME' | 'KIDS'
export type PlanStatus = 'LIVE' | 'COMING'
export type PlanKind = 'DIGITAL' | 'PHYSICAL-DEFAULT' | 'MODULE-UPGRADE'

export type Plan = {
  id: PlanId
  name: string
  priceUsd: number
  kind: PlanKind
  includesAi: boolean
  status: PlanStatus
  description: string
}

export const PLANS: Plan[] = [
  {
    id: 'AI',
    name: 'LOT® AI (Usership)',
    priceUsd: 99,
    kind: 'DIGITAL',
    includesAi: true,
    status: 'LIVE',
    description: 'Digital only. No physical issue.',
  },
  {
    id: 'BASICS',
    name: 'LOT® BASICS',
    priceUsd: 399,
    kind: 'PHYSICAL-DEFAULT',
    includesAi: true,
    status: 'LIVE',
    description:
      'First physical module. Surprise box, smart-curated monthly — wardrobe every issue, plus a preview sample of Self-care and Home (including the BioStation™ build-out, part by part).',
  },
  {
    id: 'SELF_CARE',
    name: 'Self-care Module',
    priceUsd: 99,
    kind: 'MODULE-UPGRADE',
    includesAi: false,
    status: 'LIVE',
    description: 'Deeper, more granular self-care refills beyond the Basics preview.',
  },
  {
    id: 'HOME',
    name: 'Home Module',
    priceUsd: 99,
    kind: 'MODULE-UPGRADE',
    includesAi: false,
    status: 'COMING',
    description: 'Dedicated Home stream — full BioStation™ cadence + home goods. Items preview inside Basics before this module launches.',
  },
  {
    id: 'KIDS',
    name: 'Kids Module',
    priceUsd: 99,
    kind: 'MODULE-UPGRADE',
    includesAi: false,
    status: 'COMING',
    description: 'Kids-specific monthly stream.',
  },
]

export function getRationCadenceCounts(): Record<RationCadence, number> {
  return RATION_POOL.reduce(
    (acc, r) => {
      acc[r.cadence] += 1
      return acc
    },
    { MONTHLY: 0, QUARTERLY: 0, ISSUE: 0 } as Record<RationCadence, number>
  )
}
