/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import dayjs from '#client/utils/dayjs'

/**
 * BASICS — LOT-FM-001 / BASIC RATION MODULE
 *
 * The hardware/physical layer of the LOT System. Where System.tsx is the
 * intelligence applied to the mind, Basics is the same intelligence applied
 * to material need — a fixed physical ration, issued monthly, accounted on
 * a public ledger.
 *
 * House style is a deliberate, self-contained register: LiberationMono-Bold,
 * white ground / black ink, inversion-only hierarchy (no color, no radius,
 * no icons — emphasis comes from swapping fg/bg, nothing else), 2px rules,
 * square corners, fixed character grid. This does not follow the app theme
 * (light/dark/mirror) — a printed manifest reads the same regardless of what
 * mode the reader's screen is in.
 *
 * MONTH 1 (this file): OPEN TAB — the public ledger + doctrine. Read-only.
 * MONTH 2 (planned):    UPGRADE control + roster + recurring billing.
 * MONTH 3 (planned):    Issue & fulfillment engine, printed manifest card.
 * See docs/technical/LOT-FM-001-BASIC-RATION-BUILD-PLAN.md for the full plan.
 */

const MONO: React.CSSProperties = {
  fontFamily: '"Liberation Mono", "Courier New", monospace',
  fontWeight: 700,
  letterSpacing: '0.01em',
}

type RationItem = {
  no: string
  nomenclature: string
  category: string
  cadence: string
}

// 23-item load. Nomenclature + cadence only — landed COGS is withheld from
// this public surface by design (LOT-FM-001: "the ledger is the marketing,
// no layer between public and manifest" — but COGS itself is not the
// manifest, it's the internal cost sheet). Ceiling: ≤ USD 40.00 landed,
// ≥ 60% margin on the USD 100/mo price. Never breach it.
const RATION_LOAD: RationItem[] = [
  { no: '01', nomenclature: 'Water Purification Tablets, 30ct', category: 'HYDRATION', cadence: 'MONTHLY' },
  { no: '02', nomenclature: 'Electrolyte Sachets, 14ct', category: 'HYDRATION', cadence: 'MONTHLY' },
  { no: '03', nomenclature: 'Long-Shelf Ration Bar, 6ct', category: 'NUTRITION', cadence: 'MONTHLY' },
  { no: '04', nomenclature: 'Freeze-Dried Meal Pouch, 4ct', category: 'NUTRITION', cadence: 'MONTHLY' },
  { no: '05', nomenclature: 'Multivitamin Strip, 30ct', category: 'MED', cadence: 'MONTHLY' },
  { no: '06', nomenclature: 'First-Aid Refresh Kit', category: 'MED', cadence: 'QUARTERLY' },
  { no: '07', nomenclature: 'Toothbrush, Field-Grade', category: 'HYGIENE', cadence: 'QUARTERLY' },
  { no: '08', nomenclature: 'Toothpaste, Travel Tube', category: 'HYGIENE', cadence: 'BI-MONTHLY' },
  { no: '09', nomenclature: 'Soap Bar, Unscented', category: 'HYGIENE', cadence: 'MONTHLY' },
  { no: '10', nomenclature: 'Undergarments, Set of 3', category: 'HYGIENE', cadence: 'QUARTERLY' },
  { no: '11', nomenclature: 'Socks, Merino Blend, Pair', category: 'HYGIENE', cadence: 'QUARTERLY' },
  { no: '12', nomenclature: 'Field Towel, Microfiber', category: 'HYGIENE', cadence: 'ANNUAL' },
  { no: '13', nomenclature: 'Fire-Starter, Weatherproof, 3ct', category: 'TOOLS', cadence: 'QUARTERLY' },
  { no: '14', nomenclature: 'Multi-Tool, Compact', category: 'TOOLS', cadence: 'ANNUAL' },
  { no: '15', nomenclature: 'Headlamp, Rechargeable', category: 'TOOLS', cadence: 'ANNUAL' },
  { no: '16', nomenclature: 'Battery Bank, 10,000mAh', category: 'COMMS', cadence: 'ANNUAL' },
  { no: '17', nomenclature: 'Charging Cable, USB-C', category: 'COMMS', cadence: 'BI-MONTHLY' },
  { no: '18', nomenclature: 'Notepad, Weatherproof + Pencil', category: 'ADMIN', cadence: 'QUARTERLY' },
  { no: '19', nomenclature: 'Field Manual Card, Current Printing', category: 'ADMIN', cadence: 'MONTHLY' },
  { no: '20', nomenclature: 'Duct Tape, Micro Roll', category: 'TOOLS', cadence: 'QUARTERLY' },
  { no: '21', nomenclature: 'Paracord, 25FT', category: 'TOOLS', cadence: 'ANNUAL' },
  { no: '22', nomenclature: 'Emergency Blanket, Mylar', category: 'ADMIN', cadence: 'ANNUAL' },
  { no: '23', nomenclature: 'Repair Kit, Compact', category: 'ADMIN', cadence: 'ANNUAL' },
]

// Reusable status line — the one persistent readout across Month 1/2/3.
// Month 2 flips READ-ONLY to a live enrollment state (PENDING / ON STRENGTH).
export function RationStatusLine({ status = 'READ-ONLY' }: { status?: string }) {
  return (
    <div
      className="bg-black text-white px-8 py-4 text-[11px] uppercase flex flex-wrap justify-between gap-x-16"
      style={MONO}
    >
      <span>LOT-FM-001 // BASIC RATION // OPEN TAB</span>
      <span>{dayjs().format('YYYY-MM-DD')} // STATUS: {status}</span>
    </div>
  )
}

function Bar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white px-8 py-4 text-[11px] uppercase tracking-widest" style={MONO}>
      {children}
    </div>
  )
}

function Rule() {
  return <div className="border-t-2 border-black" />
}

export function Basics() {
  return (
    <div className="border-2 border-black bg-white text-black" style={MONO}>
      <RationStatusLine />
      <Rule />

      {/* DOCTRINE */}
      <Bar>Doctrine</Bar>
      <div className="p-12 flex flex-col gap-y-8 text-[13px] leading-[1.5]">
        <div>LOT issues. LOT does not sell.</div>
        <div>
          Enrollment places the operator ON STRENGTH: issued a fixed physical
          load, accounted on a ledger, re-supplied on a fixed cadence.
        </div>
        <div>
          The System is the intelligence layer for the mind. The Ration is
          the same intelligence layer applied to material need — what the
          operator uses, LOT issues.
        </div>
        <div>
          Twenty-three items. Fixed load. Fixed price. No upsell. No bundles.
          No reorder friction.
        </div>
        <div>
          The ledger below is the manifest. Nothing stands between this tab
          and what LOT actually issues.
        </div>
      </div>
      <Rule />

      {/* ISSUE TERMS */}
      <Bar>Issue Terms</Bar>
      <div className="p-12 flex flex-col gap-y-4 text-[13px]">
        <div className="flex justify-between">
          <span>PRICE</span>
          <span>USD 100.00 / MONTH — FLAT</span>
        </div>
        <div className="flex justify-between">
          <span>BILLING</span>
          <span>MONTHLY, RECURRING — MONTH 2 BUILD</span>
        </div>
        <div className="flex justify-between">
          <span>CONTRACT</span>
          <span>NONE. STAND DOWN ANY TIME — MONTH 2 BUILD</span>
        </div>
        <div className="flex justify-between">
          <span>ADDITIVE TO</span>
          <span>LOT USERSHIP (AI PLAN)</span>
        </div>
        <div className="flex justify-between opacity-60">
          <span>UPGRADE CONTROL</span>
          <span>NOT YET ISSUED — MONTH 2 BUILD</span>
        </div>
      </div>
      <Rule />

      {/* RATION LEDGER */}
      <Bar>Ration Ledger — 23 Items Issued Monthly</Bar>
      <div className="overflow-x-auto">
        <div className="min-w-[480px] text-[12px]">
          <div
            className="grid grid-cols-[3ch_1fr_11ch_11ch] gap-x-8 px-12 py-4 bg-black text-white uppercase"
          >
            <span>No.</span>
            <span>Nomenclature</span>
            <span>Category</span>
            <span>Cadence</span>
          </div>
          {RATION_LOAD.map((item, i) => (
            <div
              key={item.no}
              className={
                'grid grid-cols-[3ch_1fr_11ch_11ch] gap-x-8 px-12 py-4 border-t-2 border-black' +
                (i % 2 === 1 ? ' bg-black/[0.04]' : '')
              }
            >
              <span>{item.no}</span>
              <span>{item.nomenclature}</span>
              <span>{item.category}</span>
              <span>{item.cadence}</span>
            </div>
          ))}
        </div>
      </div>
      <Rule />
      <div className="p-12 text-[11px] uppercase opacity-70">
        COGS: withheld. Landed cost held ≤ USD 40.00. Margin ≥ 60%. Internal
        ledger only.
      </div>
      <Rule />

      {/* BUILD STATUS */}
      <Bar>Build Status — LOT-FM-001 / 90-Day Self-Assembly</Bar>
      <div className="p-12 flex flex-col gap-y-4 text-[12px]">
        <div className="flex justify-between">
          <span>MONTH 1 — LEDGER &amp; DOCTRINE</span>
          <span>LIVE</span>
        </div>
        <div className="flex justify-between opacity-50">
          <span>MONTH 2 — UPGRADE &amp; ROSTER</span>
          <span>PENDING</span>
        </div>
        <div className="flex justify-between opacity-50">
          <span>MONTH 3 — ISSUE &amp; FULFILLMENT</span>
          <span>PENDING</span>
        </div>
      </div>
    </div>
  )
}
