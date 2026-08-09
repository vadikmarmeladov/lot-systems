/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'

/**
 * BASICS — OPEN TAB (LOT-FM-001, Month 1: LEDGER & DOCTRINE)
 *
 * The hardware/physical layer of the LOT System: a standing ration of
 * 23 physical items, issued monthly to operators ON STRENGTH. This tab
 * is the public manifest — read-only, no login required, no COGS shown.
 * The ledger is the marketing; there is no separate sales layer.
 *
 * Visual register is a deliberate departure from the rest of the app:
 * fixed-width grid, square corners, inversion-only hierarchy, forced
 * white-ground/black-ink regardless of theme — a printed field manual,
 * not a themed widget. Month 2 adds the UPGRADE control (Usership AI ->
 * BASIC ration) and roster intake. Month 3 adds the fulfillment engine.
 * This build is read-only by design — see EXIT criteria, LOT-FM-001 M1.
 */

type RationItem = {
  no: string
  nomenclature: string
  category: string
  cadence: string
}

const RATION_LOAD: RationItem[] = [
  { no: '01', nomenclature: 'FIELD LOG', category: 'JOURNAL', cadence: 'EVERY ISSUE' },
  { no: '02', nomenclature: 'QM PEN', category: 'JOURNAL', cadence: 'EVERY ISSUE' },
  { no: '03', nomenclature: 'STATUS CARD', category: 'SYSTEM', cadence: 'EVERY ISSUE' },
  { no: '04', nomenclature: 'FIELD LOG REFILL PAD', category: 'JOURNAL', cadence: 'ROTATING' },
  { no: '05', nomenclature: 'INK CARTRIDGE, ×3', category: 'JOURNAL', cadence: 'ROTATING' },
  { no: '06', nomenclature: 'SLEEP MASK, BLACKOUT', category: 'RECOVERY', cadence: 'ROTATING' },
  { no: '07', nomenclature: 'RECOVERY BALM, TRAVEL TIN', category: 'RECOVERY', cadence: 'ROTATING' },
  { no: '08', nomenclature: 'HERBAL RATION, ×10', category: 'RECOVERY', cadence: 'ROTATING' },
  { no: '09', nomenclature: 'HYDRATION TABS, ×14', category: 'RECOVERY', cadence: 'ROTATING' },
  { no: '10', nomenclature: 'WEIGHTED SLEEVE, 0.5LB', category: 'RECOVERY', cadence: 'ROTATING' },
  { no: '11', nomenclature: 'BREATH CARD', category: 'FOCUS', cadence: 'ROTATING' },
  { no: '12', nomenclature: 'FOCUS TIMER CARD', category: 'FOCUS', cadence: 'ROTATING' },
  { no: '13', nomenclature: 'RESISTANCE BAND, MEDIUM', category: 'FOCUS', cadence: 'ROTATING' },
  { no: '14', nomenclature: 'COLD CARD', category: 'FOCUS', cadence: 'ROTATING' },
  { no: '15', nomenclature: 'GROUNDING KIT', category: 'GROUND', cadence: 'ROTATING' },
  { no: '16', nomenclature: 'DESK COMPASS', category: 'GROUND', cadence: 'ROTATING' },
  { no: '17', nomenclature: 'ASTRO CARD', category: 'GROUND', cadence: 'ROTATING' },
  { no: '18', nomenclature: 'FIELD PATCH', category: 'ISSUE', cadence: 'QUARTERLY' },
  { no: '19', nomenclature: 'KIT BAG, CANVAS', category: 'ISSUE', cadence: 'QUARTERLY' },
  { no: '20', nomenclature: 'FM BOOKLET, PRINTED', category: 'ISSUE', cadence: 'QUARTERLY' },
  { no: '21', nomenclature: 'RANK PIN, ENAMEL', category: 'ISSUE', cadence: 'SEMI-ANNUAL' },
  { no: '22', nomenclature: 'DOG TAG, STAMPED', category: 'ISSUE', cadence: 'ON ENROLLMENT' },
  { no: '23', nomenclature: 'ANNIVERSARY PATCH SET', category: 'ISSUE', cadence: 'ON ANNIVERSARY' },
]

function Rule() {
  return <div className="h-[2px] bg-black" />
}

function StatusLine() {
  const fields: [string, string][] = [
    ['MODE', 'OPEN TAB'],
    ['ACCESS', 'READ ONLY'],
    ['ROSTER', 'CLOSED'],
    ['NEXT ISSUE', '—'],
  ]
  return (
    <div className="bg-black text-white font-mono font-bold text-[13px] tracking-wide">
      <div className="flex flex-wrap gap-x-24 gap-y-4 px-12 py-8">
        {fields.map(([label, value]) => (
          <div key={label}>
            {label}: {value}
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white font-mono font-bold text-[13px] tracking-wide px-12 py-4">
      {children}
    </div>
  )
}

export function BasicsPage() {
  return (
    <div className="bg-white text-black font-mono">
      <div className="border-2 border-black">
        {/* Masthead */}
        <div className="px-12 py-12">
          <div className="font-bold text-[15px] tracking-wide">LOT® BASIC RATION</div>
          <div className="text-[13px] mt-2">DOCUMENT: LOT-FM-001 // SELF-ASSEMBLY DIRECTIVE, MODULE: BASIC</div>
          <div className="text-[13px]">CLASS: OPEN TAB — PUBLIC MANIFEST</div>
        </div>

        <Rule />
        <StatusLine />
        <Rule />

        {/* Doctrine */}
        <SectionLabel>DOCTRINE</SectionLabel>
        <div className="px-12 py-12 text-[13px] leading-[1.6] flex flex-col gap-8">
          <div>LOT ISSUES. LOT DOES NOT SELL.</div>
          <div>
            The Basic ration is standard issue, not a purchase. On enrollment
            the operator goes ON STRENGTH — carried on the roster, resupplied
            on a fixed cadence, accountable for the return of non-consumable
            issue on STAND DOWN.
          </div>
          <div>
            The ledger below is the complete public manifest. Nomenclature and
            cadence are shown in full. Landed cost is withheld — it is not a
            marketing input.
          </div>
        </div>

        <Rule />

        {/* Price line */}
        <SectionLabel>ISSUE RATE</SectionLabel>
        <div className="px-12 py-12 text-[13px] flex flex-col gap-4">
          <div className="font-bold text-[15px]">USD 100.00 / MONTH</div>
          <div>BILLED ON ENROLLMENT ANNIVERSARY. ADDITIVE TO USERSHIP.</div>
        </div>

        <Rule />

        {/* 23-item manifest */}
        <SectionLabel>RATION LOAD — 23 ITEMS</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left font-bold px-12 py-6 w-[48px]">NO.</th>
                <th className="text-left font-bold px-12 py-6">NOMENCLATURE</th>
                <th className="text-left font-bold px-12 py-6 w-[110px]">CATEGORY</th>
                <th className="text-left font-bold px-12 py-6 w-[150px]">CADENCE</th>
              </tr>
            </thead>
            <tbody>
              {RATION_LOAD.map((item) => (
                <tr key={item.no} className="border-b border-black/30">
                  <td className="px-12 py-6 opacity-60">{item.no}</td>
                  <td className="px-12 py-6">{item.nomenclature}</td>
                  <td className="px-12 py-6 opacity-60">{item.category}</td>
                  <td className="px-12 py-6 opacity-60">{item.cadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Rule />

        {/* Footer / build state */}
        <div className="px-12 py-12 text-[13px] leading-[1.6] flex flex-col gap-4">
          <div>BUILD: MONTH 1 OF 3 — LEDGER &amp; DOCTRINE. UPGRADE and ROSTER land Month 2. ISSUE and FULFILLMENT land Month 3.</div>
          <div className="opacity-60">AUTHORIZED BY: S-2 // VADIK MARMELADOV</div>
        </div>
      </div>
    </div>
  )
}
