/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * BASICS — LOT-FM-001 OPEN TAB (hardware / physical issue)
 * Build M1 of 3: ledger + doctrine, read-only. No enrollment, no billing yet.
 * Voice is quartermaster: imperative, terse. Ledger is the offer — no upsell.
 */

import * as React from 'react'
import { cn } from '#client/utils'
import { useDocumentTitle } from '#client/utils/hooks'

type Cadence = 'ONE-TIME' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL'

type RationItem = {
  no: number
  nomenclature: string
  cadence: Cadence
}

const CADENCE_LABEL: Record<Cadence, string> = {
  'ONE-TIME': 'INTAKE ONLY',
  MONTHLY: 'EVERY ISSUE',
  QUARTERLY: 'EVERY 3RD ISSUE',
  SEMIANNUAL: 'EVERY 6TH ISSUE',
  ANNUAL: 'EVERY 12TH ISSUE',
}

// SECTION 2 — RATION LOAD. COGS withheld per doctrine; nomenclature + cadence
// only. Public ledger, not a catalog — this is the entire physical offer.
const RATION_LOAD: RationItem[] = [
  { no: 1, nomenclature: 'LOT ID CARD, LAMINATED', cadence: 'ONE-TIME' },
  { no: 2, nomenclature: 'FIELD MANUAL, POCKET EDITION', cadence: 'ONE-TIME' },
  { no: 3, nomenclature: 'UNIT PATCH, VELCRO BACK', cadence: 'ONE-TIME' },
  { no: 4, nomenclature: 'RATION TIN, STEEL', cadence: 'ONE-TIME' },
  { no: 5, nomenclature: 'INTAKE MANIFEST CARD', cadence: 'ONE-TIME' },
  { no: 6, nomenclature: 'FIELD LOG, A6 DOT-GRID', cadence: 'MONTHLY' },
  { no: 7, nomenclature: 'INK REFILL, LOT-BLACK, 2-PACK', cadence: 'MONTHLY' },
  { no: 8, nomenclature: 'MANIFEST CARD, PRINTED', cadence: 'MONTHLY' },
  { no: 9, nomenclature: 'STATUS DECAL SHEET', cadence: 'MONTHLY' },
  { no: 10, nomenclature: 'INDEX TAB SET, ADHESIVE', cadence: 'MONTHLY' },
  { no: 11, nomenclature: 'FIELD PENCIL, MECHANICAL 0.5MM', cadence: 'MONTHLY' },
  { no: 12, nomenclature: 'GRAPHITE REFILL, 0.5MM TUBE', cadence: 'MONTHLY' },
  { no: 13, nomenclature: 'CLOSURE BAND, ELASTIC', cadence: 'MONTHLY' },
  { no: 14, nomenclature: 'BOOKMARK RIBBON, WOVEN', cadence: 'MONTHLY' },
  { no: 15, nomenclature: 'FIELD PEN, MACHINED ALUMINUM', cadence: 'QUARTERLY' },
  { no: 16, nomenclature: 'QUARTERLY ISSUE PATCH', cadence: 'QUARTERLY' },
  { no: 17, nomenclature: 'CALIBRATION CARD, SELF-ASSESSMENT', cadence: 'QUARTERLY' },
  { no: 18, nomenclature: 'STORAGE POUCH, CANVAS', cadence: 'QUARTERLY' },
  { no: 19, nomenclature: 'PEN MAINTENANCE KIT', cadence: 'QUARTERLY' },
  { no: 20, nomenclature: 'FIELD KNIFE, UTILITY', cadence: 'SEMIANNUAL' },
  { no: 21, nomenclature: 'RANK PATCH SET', cadence: 'SEMIANNUAL' },
  { no: 22, nomenclature: 'FIELD MANUAL, ANNUAL EDITION, HARDBOUND', cadence: 'ANNUAL' },
  { no: 23, nomenclature: 'ISSUE COIN', cadence: 'ANNUAL' },
]

const DOCTRINE = [
  'LOT ISSUES RATION. LOT DOES NOT SELL PRODUCT.',
  'YOU ARE ON STRENGTH THE DAY YOU ENROLL — NOT A CUSTOMER, A UNIT ON THE ROSTER.',
  'THE LEDGER BELOW IS THE ENTIRE OFFER. NO CATALOG. NO UPSELL. NO HIDDEN LINE.',
  'RATE IS FIXED. TERMS DO NOT CHANGE UNDER YOU.',
]

// Fixed character grid — same column widths for the header row and every
// ledger row so nomenclature and cadence stay aligned in the monospace face.
const LEDGER_COLS = 'grid grid-cols-[4ch_1fr_18ch]'

function StatusLine({ rows }: { rows: [string, string][] }) {
  return (
    <div className="border-2 border-acc">
      {rows.map(([label, value], i) => (
        <div
          key={label}
          className={cn(
            'flex justify-between gap-16 px-8 py-4',
            i > 0 && 'border-t-2 border-acc'
          )}
        >
          <span>{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  )
}

export const Basics: React.FC = () => {
  useDocumentTitle('Basics — LOT Systems')

  return (
    <div className="font-mono font-bold uppercase tracking-tight max-w-[720px]">
      <div className="mb-24 bg-acc text-bac px-8 py-4">
        <div className="text-[1.5em]">BASICS</div>
        <div className="normal-case font-normal tracking-normal opacity-70">
          LOT-FM-001 / OPEN TAB — hardware &amp; physical issue
        </div>
      </div>

      <div className="mb-24">
        <StatusLine
          rows={[
            ['BUILD', 'M1 / 3 — LEDGER & DOCTRINE'],
            ['TAB STATUS', 'OPEN — READ ONLY'],
            ['ENROLLMENT', 'CLOSED — OPENS M2'],
          ]}
        />
      </div>

      <div className="mb-24">
        {DOCTRINE.map((line) => (
          <div key={line} className="mb-4">
            {line}
          </div>
        ))}
      </div>

      <div className="mb-24 bg-acc text-bac px-8 py-4">
        RATE: USD 100.00 / MONTH — ISSUED, NOT SOLD
      </div>

      <div className="mb-8">SECTION 2 — RATION LOAD, 23 ITEMS</div>
      <div className="border-2 border-acc mb-24">
        <div className={cn(LEDGER_COLS, 'px-8 py-4 border-b-2 border-acc text-acc/60')}>
          <span>NO</span>
          <span>NOMENCLATURE</span>
          <span>CADENCE</span>
        </div>
        {RATION_LOAD.map((item, i) => (
          <div
            key={item.no}
            className={cn(LEDGER_COLS, 'px-8 py-4', i > 0 && 'border-t-2 border-acc')}
          >
            <span>{String(item.no).padStart(2, '0')}</span>
            <span>{item.nomenclature}</span>
            <span className="text-acc/60">{CADENCE_LABEL[item.cadence]}</span>
          </div>
        ))}
      </div>

      <div className="normal-case font-normal tracking-normal text-acc/40">
        Landed cost withheld. The manifest above is the offer — nothing else is sold.
      </div>
    </div>
  )
}
