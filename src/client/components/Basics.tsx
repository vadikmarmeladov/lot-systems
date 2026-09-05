/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { cn } from '#client/utils'

/**
 * LOT-FM-001 / BASIC RATION — MONTH 1: LEDGER & DOCTRINE.
 * Public OPEN TAB surface. Read-only. No auth gate, no upgrade control —
 * those are Month 2 (roster intake, billing) and Month 3 (fulfillment).
 * COGS is intentionally withheld per doctrine: "the ledger is the marketing."
 */

const MONOSPACE = "'Liberation Mono', 'Courier New', monospace"

type Cadence = 'M' | 'Q' | '1x'

const CADENCE_LABEL: Record<Cadence, string> = {
  M: 'EVERY ISSUE',
  Q: 'QUARTERLY',
  '1x': 'FIRST ISSUE ONLY',
}

type RationLine = {
  no: number
  nomenclature: string
  cadence: Cadence
}

// LOT-FM-001 SECTION 2 — 23-ITEM RATION LOAD. Nomenclature + cadence only.
export const BASIC_RATION_LOAD: RationLine[] = [
  { no: 1, nomenclature: 'FIELD NOTEBOOK, POCKET, GRID', cadence: '1x' },
  { no: 2, nomenclature: 'NOTEBOOK REFILL, GRID PAPER', cadence: 'M' },
  { no: 3, nomenclature: 'PENCIL, MECHANICAL, 0.5MM', cadence: 'Q' },
  { no: 4, nomenclature: 'LEAD REFILL, 0.5MM, TUBE', cadence: 'Q' },
  { no: 5, nomenclature: 'ERASER, REPLACEMENT', cadence: 'Q' },
  { no: 6, nomenclature: 'INK CARTRIDGE, BLACK, 3-PACK', cadence: 'M' },
  { no: 7, nomenclature: 'ISSUE CARD, PRINTED MANIFEST', cadence: 'M' },
  { no: 8, nomenclature: 'SEAL, TAMPER-EVIDENT, ISSUE BOX', cadence: 'M' },
  { no: 9, nomenclature: 'WRIST BAND, SIGNAL, ADJUSTABLE', cadence: '1x' },
  { no: 10, nomenclature: 'WRIST BAND STRAP, REPLACEMENT', cadence: 'Q' },
  { no: 11, nomenclature: 'CHARGING BRICK, USB-C, 20W', cadence: '1x' },
  { no: 12, nomenclature: 'CHARGING CABLE, USB-C, 1M', cadence: 'Q' },
  { no: 13, nomenclature: 'BATTERY, CR2032, 2-PACK', cadence: 'Q' },
  { no: 14, nomenclature: 'SENSOR PATCH, ADHESIVE, 10-PACK', cadence: 'M' },
  { no: 15, nomenclature: 'CLEANING WIPE, ALCOHOL, 10-PACK', cadence: 'M' },
  { no: 16, nomenclature: 'LABEL SHEET, ASSET TAGS', cadence: 'Q' },
  { no: 17, nomenclature: 'STICKER SHEET, BADGE INSIGNIA', cadence: 'M' },
  { no: 18, nomenclature: 'DECAL, LOT MARK, SMALL', cadence: 'Q' },
  { no: 19, nomenclature: 'CARD SLEEVE, MANIFEST PROTECTION', cadence: '1x' },
  { no: 20, nomenclature: 'LANYARD, ISSUE, BLACK', cadence: '1x' },
  { no: 21, nomenclature: 'PIN, PHASE INDICATOR', cadence: 'Q' },
  { no: 22, nomenclature: 'STORAGE POUCH, FIELD, WATER-RESISTANT', cadence: '1x' },
  { no: 23, nomenclature: 'QUICK-REFERENCE CARD, LAMINATED', cadence: 'Q' },
]

const Rule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('h-[2px] bg-acc w-full', className)} />
)

const StatusLine: React.FC = () => {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const stamp = now.toISOString().replace('T', ' ').slice(0, 19) + 'Z'

  return (
    <div
      className="flex flex-wrap justify-between gap-x-16 gap-y-4 bg-acc text-bac px-8 py-4 text-[13px] tracking-[0.04em]"
      style={{ fontFamily: MONOSPACE }}
    >
      <span>OPEN TAB // PUBLIC // READ-ONLY</span>
      <span>MODULE: BASIC (RATION) // PHASE: MONTH 1 — LEDGER &amp; DOCTRINE</span>
      <span>{stamp}</span>
    </div>
  )
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="text-[13px] tracking-[0.08em]"
    style={{ fontFamily: MONOSPACE }}
  >
    {children}
  </div>
)

export const Basics = React.memo(function BasicsInner() {
  return (
    <div
      className="flex flex-col gap-y-16 text-acc"
      style={{ fontFamily: MONOSPACE }}
    >
      <StatusLine />

      {/* -------------------------------------------------------------- */}
      {/* DOCTRINE                                                        */}
      {/* -------------------------------------------------------------- */}
      <div className="flex flex-col gap-y-8">
        <SectionLabel>LOT-FM-001 // BASIC RATION — DOCTRINE</SectionLabel>
        <Rule />
        <div className="flex flex-col gap-y-8 text-[14px] leading-[1.5] max-w-[640px]">
          <div>LOT BASIC IS ISSUED. IT IS NOT SOLD.</div>
          <div>
            ON ENROLLMENT YOU ARE PLACED ON STRENGTH. A FIXED RATION OF
            PHYSICAL MATERIEL ARRIVES ON A MONTHLY CADENCE, SUPPORTING THE
            HARDWARE SIDE OF THE LOT PRACTICE — LOG, SYNC, SELF-CARE, HOME.
          </div>
          <div>
            THE MANIFEST BELOW IS THE ENTIRE OFFER. NO HIDDEN TIER. NO UPSELL
            INSIDE THE BOX. THE LEDGER IS THE MARKETING.
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* PRICE LINE                                                      */}
      {/* -------------------------------------------------------------- */}
      <div className="flex flex-col gap-y-8">
        <Rule />
        <div className="flex flex-wrap items-baseline justify-between gap-x-16 text-[14px]">
          <span>RATE</span>
          <span className="text-[20px] font-bold">USD 100.00 / MONTH</span>
        </div>
        <div className="text-[12px] opacity-60 max-w-[640px]">
          RECURRING. CANCEL ANY TIME — STAND DOWN RETURNS YOU TO USERSHIP
          (AI PLAN) AND DROPS THE RATION. NO PARTIAL-MONTH REFUND.
        </div>
        <Rule />
      </div>

      {/* -------------------------------------------------------------- */}
      {/* 23-ITEM RATION LOAD                                             */}
      {/* -------------------------------------------------------------- */}
      <div className="flex flex-col gap-y-8">
        <SectionLabel>SECTION 2 // RATION LOAD — 23 LINE ITEMS</SectionLabel>
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse text-[13px]"
            style={{ fontFamily: MONOSPACE }}
          >
            <thead>
              <tr className="border-b-[2px] border-acc">
                <th className="text-left font-normal px-4 py-4 w-[40px]">NO.</th>
                <th className="text-left font-normal px-4 py-4">NOMENCLATURE</th>
                <th className="text-left font-normal px-4 py-4 w-[160px]">CADENCE</th>
              </tr>
            </thead>
            <tbody>
              {BASIC_RATION_LOAD.map((line) => (
                <tr key={line.no} className="border-b border-acc/30">
                  <td className="px-4 py-4 align-top opacity-60">
                    {String(line.no).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-4 align-top">{line.nomenclature}</td>
                  <td className="px-4 py-4 align-top opacity-60">
                    {CADENCE_LABEL[line.cadence]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[12px] opacity-60">
          LINES: 23. COST OF GOODS WITHHELD. MARGIN HELD ≥60% AT ISSUE.
        </div>
      </div>

      <Rule />
      <div className="text-[12px] opacity-60 pb-16">
        UPGRADE PATH (USERSHIP/AI → BASIC) AND ISSUE FULFILLMENT ARE NOT YET
        LIVE ON THIS TAB. THIS IS A READ-ONLY MANIFEST.
      </div>
    </div>
  )
})
