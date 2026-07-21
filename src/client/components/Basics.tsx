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
 * BASICS — OPEN TAB
 * LOT-FM-001 / BASIC (RATION) MODULE — MONTH 1: LEDGER & DOCTRINE
 *
 * Public, read-only. No auth required, no data layer between this screen
 * and the manifest below — the ledger IS the marketing. House terminal
 * spec: LiberationMono-Bold, white ground / black ink, inversion-only
 * hierarchy, 2px rules, square corners, fixed character grid, IBM 3270
 * register. Voice: quartermaster, imperative, terse.
 *
 * TERMINAL TOKENS — reused by Month 2 (UPGRADE/ROSTER) and Month 3
 * (ISSUE/FULFILLMENT) builds. Keep this the single source for the grid.
 */
export const TERMINAL = {
  rule: 'border-black',
  ruleWidth: 'border-2',
  ground: 'bg-white text-black',
  invert: 'bg-black text-white',
  font: 'font-mono font-bold uppercase tracking-tight',
  corner: 'rounded-none',
}

const CADENCE_LEGEND: Record<string, string> = {
  M: 'MONTHLY',
  Q: 'QUARTERLY',
  A: 'ANNUAL',
}

type RationItem = {
  no: number
  code: string
  nomenclature: string
  qty: string
  cadence: keyof typeof CADENCE_LEGEND
}

// 23-ITEM RATION LOAD — nomenclature + cadence only. COGS withheld per
// doctrine (ceiling <= USD 40.00 landed, target >= 60% margin at
// USD 100.00/mo — never published on the public ledger).
const RATION_LOAD: RationItem[] = [
  { no: 1, code: 'FM-01', nomenclature: 'FIELD NOTEBOOK, POCKET, 96-LEAF', qty: '1 EA', cadence: 'M' },
  { no: 2, code: 'FM-02', nomenclature: 'PEN, ALL-WEATHER, BLACK INK', qty: '1 EA', cadence: 'M' },
  { no: 3, code: 'FM-03', nomenclature: 'PENCIL, MECHANICAL, 0.5MM', qty: '1 EA', cadence: 'Q' },
  { no: 4, code: 'FM-04', nomenclature: 'INDEX CARD, RULED, 50-CT', qty: '1 PK', cadence: 'M' },
  { no: 5, code: 'FM-05', nomenclature: 'INK REFILL, CARTRIDGE, 3-PK', qty: '1 PK', cadence: 'Q' },
  { no: 6, code: 'FM-06', nomenclature: 'MARKER, STATUS, SHEET', qty: '1 EA', cadence: 'M' },
  { no: 7, code: 'FM-07', nomenclature: 'TAPE, FILAMENT, 1IN', qty: '1 RL', cadence: 'Q' },
  { no: 8, code: 'FM-08', nomenclature: 'BATTERY, AA, 4-PK', qty: '1 PK', cadence: 'Q' },
  { no: 9, code: 'FM-09', nomenclature: 'BATTERY, AAA, 4-PK', qty: '1 PK', cadence: 'Q' },
  { no: 10, code: 'FM-10', nomenclature: 'CABLE, USB-C, 1M', qty: '1 EA', cadence: 'Q' },
  { no: 11, code: 'FM-11', nomenclature: 'CLOTH, MICROFIBER, SCREEN', qty: '1 EA', cadence: 'M' },
  { no: 12, code: 'FM-12', nomenclature: 'EARPLUG, FOAM, 6-PAIR', qty: '1 PK', cadence: 'M' },
  { no: 13, code: 'FM-13', nomenclature: 'MASK, SLEEP, STANDARD ISSUE', qty: '1 EA', cadence: 'Q' },
  { no: 14, code: 'FM-14', nomenclature: 'FILTER, WATER BOTTLE INSERT', qty: '1 EA', cadence: 'Q' },
  { no: 15, code: 'FM-15', nomenclature: 'ELECTROLYTE, PACKET, 10-CT', qty: '1 BX', cadence: 'M' },
  { no: 16, code: 'FM-16', nomenclature: 'COFFEE, GROUND, FIELD PACK', qty: '1 EA', cadence: 'M' },
  { no: 17, code: 'FM-17', nomenclature: 'TEA, LOOSE, FIELD PACK', qty: '1 EA', cadence: 'M' },
  { no: 18, code: 'FM-18', nomenclature: 'RATION BAR, 3-PK', qty: '1 PK', cadence: 'M' },
  { no: 19, code: 'FM-19', nomenclature: 'FIRST AID, MINI KIT', qty: '1 EA', cadence: 'Q' },
  { no: 20, code: 'FM-20', nomenclature: 'TOOL, MULTI, POCKET', qty: '1 EA', cadence: 'A' },
  { no: 21, code: 'FM-21', nomenclature: 'PATCH, LOT INSIGNIA', qty: '1 EA', cadence: 'Q' },
  { no: 22, code: 'FM-22', nomenclature: 'DECAL, LOT WORDMARK', qty: '2 EA', cadence: 'Q' },
  { no: 23, code: 'FM-23', nomenclature: 'MANIFEST CARD, PRINTED, CURRENT ISSUE', qty: '1 EA', cadence: 'M' },
]

function Rule({ className }: { className?: string }) {
  return <div className={cn('border-t-2 border-black', className)} />
}

function StatusLine() {
  return (
    <div
      className={cn(
        TERMINAL.font,
        TERMINAL.invert,
        TERMINAL.ruleWidth,
        TERMINAL.rule,
        TERMINAL.corner,
        'text-[11px] phone:text-[12px] px-8 py-4 flex flex-wrap gap-x-16 gap-y-2 justify-between'
      )}
    >
      <span>LOT-FM-001 // BASIC RATION</span>
      <span>TAB: OPEN</span>
      <span>LEDGER: LIVE</span>
      <span>ROSTER: CLOSED</span>
      <span>ISSUE: OFFLINE</span>
      <span>BUILD: M1/M3</span>
    </div>
  )
}

export function Basics() {
  return (
    <div className={cn(TERMINAL.font, TERMINAL.ground, 'text-[13px] leading-[1.4] normal-case')}>
      <div className={cn(TERMINAL.font, 'text-[13px]')}>
        <StatusLine />

        <div className="mt-16 mb-24">
          <div className="text-[20px] phone:text-[24px]">BASIC</div>
          <div className="opacity-70 text-[11px] mt-2">
            THE PHYSICAL LAYER OF THE LOT SYSTEM — ISSUED, NOT SOLD
          </div>
        </div>

        <Rule className="mb-16" />

        {/* DOCTRINE */}
        <div className="mb-24">
          <div className={cn(TERMINAL.invert, 'inline-block px-8 py-2 mb-8')}>DOCTRINE</div>
          <div className="normal-case font-normal opacity-90 flex flex-col gap-y-8 max-w-[64ch]">
            <p>
              LOT BASIC is not a curated box of lifestyle goods. It is the
              minimum hardware load required to run the LOT system in the
              physical world — the analog layer under the software.
            </p>
            <p>
              Subscribers are not customers. They are carried ON STRENGTH —
              issued a standing ration against unit strength, the way any
              operator draws equipment. What is issued is tracked. What is
              tracked is real.
            </p>
            <p>
              Every item on this ledger earns its place through recurrence,
              not novelty. Nothing is added for the sake of the box looking
              full. The ledger is the marketing — there is no layer of
              packaging language between this screen and what actually
              ships.
            </p>
          </div>
        </div>

        <Rule className="mb-16" />

        {/* PRICE LINE */}
        <div className="mb-24">
          <div className={cn(TERMINAL.invert, 'inline-block px-8 py-2 mb-8')}>ISSUE TERMS</div>
          <div className="flex flex-col gap-y-4 max-w-[64ch]">
            <div className="flex justify-between border-b-2 border-black py-4">
              <span>BASIC RATION</span>
              <span>USD 100.00 / MONTH</span>
            </div>
            <div className="flex justify-between border-b-2 border-black py-4 opacity-70 font-normal normal-case">
              <span>Billing</span>
              <span>Monthly, recurring</span>
            </div>
            <div className="flex justify-between border-b-2 border-black py-4 opacity-70 font-normal normal-case">
              <span>Downgrade</span>
              <span>STAND DOWN — drops ration, retains AI</span>
            </div>
            <div className="flex justify-between py-4 opacity-70 font-normal normal-case">
              <span>Enlistment</span>
              <span>Closed — see ROSTER status above</span>
            </div>
          </div>
        </div>

        <Rule className="mb-16" />

        {/* 23-ITEM RATION LEDGER */}
        <div className="mb-24">
          <div className={cn(TERMINAL.invert, 'inline-block px-8 py-2 mb-8')}>
            RATION LOAD — 23 ITEMS
          </div>
          <div className="overflow-x-auto">
            <table className={cn('w-full border-collapse', TERMINAL.corner)}>
              <thead>
                <tr className={cn(TERMINAL.invert)}>
                  <th className="text-left px-8 py-4 border-2 border-black w-[4ch]">NO</th>
                  <th className="text-left px-8 py-4 border-2 border-black w-[8ch]">CODE</th>
                  <th className="text-left px-8 py-4 border-2 border-black">NOMENCLATURE</th>
                  <th className="text-left px-8 py-4 border-2 border-black w-[7ch]">QTY</th>
                  <th className="text-left px-8 py-4 border-2 border-black w-[11ch]">CADENCE</th>
                </tr>
              </thead>
              <tbody>
                {RATION_LOAD.map((item) => (
                  <tr key={item.code}>
                    <td className="px-8 py-4 border-2 border-black opacity-70">{item.no}</td>
                    <td className="px-8 py-4 border-2 border-black opacity-70">{item.code}</td>
                    <td className="px-8 py-4 border-2 border-black">{item.nomenclature}</td>
                    <td className="px-8 py-4 border-2 border-black opacity-70">{item.qty}</td>
                    <td className="px-8 py-4 border-2 border-black opacity-70">
                      {CADENCE_LEGEND[item.cadence]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="opacity-60 font-normal normal-case text-[11px] mt-8">
            COGS withheld. Landed cost held under ceiling; margin held above
            floor. Neither is published — the ledger states what is issued
            and how often, not what it costs LOT to issue it.
          </div>
        </div>

        <Rule className="mb-16" />

        {/* FOOTER / BUILD STATUS */}
        <div className="opacity-60 font-normal normal-case text-[11px] flex flex-col gap-y-2">
          <div>MONTH 1 — LEDGER &amp; DOCTRINE. Read-only. The system exists.</div>
          <div>MONTH 2 — UPGRADE &amp; ROSTER. Not yet built.</div>
          <div>MONTH 3 — ISSUE &amp; FULFILLMENT. Not yet built.</div>
        </div>
      </div>
    </div>
  )
}
