/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { cn } from '#client/utils'

// ─── RATION LOAD ────────────────────────────────────────────────────────────
// LOT-FM-001 / 23-ITEM CIVILIAN RATION SUBSCRIPTION
// Nomenclature follows NATO stock-item naming conventions.
// COGS withheld from public ledger per Month 1 doctrine.
// ─────────────────────────────────────────────────────────────────────────────

type Cadence = 'MONTHLY' | 'QUARTERLY'

type RationItem = {
  id: string
  category: string
  nomenclature: string
  unit: string
  qty: number
  cadence: Cadence
}

const RATION_LOAD: RationItem[] = [
  // NUTRITION
  { id: '001', category: 'NUTRITION', nomenclature: 'PROTEIN BAR, WHEY-BASED, 40G', unit: 'EA', qty: 4, cadence: 'MONTHLY' },
  { id: '002', category: 'NUTRITION', nomenclature: 'COFFEE, GROUND, MEDIUM ROAST, 12OZ', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '003', category: 'NUTRITION', nomenclature: 'ELECTROLYTE TABLET', unit: 'EA', qty: 10, cadence: 'MONTHLY' },
  // SUPPLEMENTATION
  { id: '004', category: 'SUPPLEMENTATION', nomenclature: 'MULTIVITAMIN, COMPLETE (30-CT)', unit: 'PK', qty: 1, cadence: 'MONTHLY' },
  { id: '005', category: 'SUPPLEMENTATION', nomenclature: 'VITAMIN D3, 2000IU (30-CT)', unit: 'PK', qty: 1, cadence: 'MONTHLY' },
  { id: '006', category: 'SUPPLEMENTATION', nomenclature: 'OMEGA-3 FISH OIL, 1000MG (30-CT)', unit: 'PK', qty: 1, cadence: 'MONTHLY' },
  { id: '007', category: 'SUPPLEMENTATION', nomenclature: 'MAGNESIUM, GLYCINATE, 400MG (30-CT)', unit: 'PK', qty: 1, cadence: 'MONTHLY' },
  { id: '008', category: 'SUPPLEMENTATION', nomenclature: 'ZINC, 15MG (30-CT)', unit: 'PK', qty: 1, cadence: 'MONTHLY' },
  // HYGIENE
  { id: '009', category: 'HYGIENE', nomenclature: 'SOAP, BAR, UNSCENTED, 4OZ', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '010', category: 'HYGIENE', nomenclature: 'TOOTHBRUSH, MEDIUM BRISTLE', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '011', category: 'HYGIENE', nomenclature: 'TOOTHPASTE, FLUORIDE, 2.4OZ', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '012', category: 'HYGIENE', nomenclature: 'FLOSS, WAXED, 50M', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '013', category: 'HYGIENE', nomenclature: 'SUNSCREEN, SPF 50, BROAD SPECTRUM, 1OZ', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '014', category: 'HYGIENE', nomenclature: 'HAND LOTION, FRAGRANCE-FREE, 1OZ', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '015', category: 'HYGIENE', nomenclature: 'LIP BALM, SPF 15', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '016', category: 'HYGIENE', nomenclature: 'WET WIPES, TRAVEL PACK (10-CT)', unit: 'PK', qty: 1, cadence: 'MONTHLY' },
  // FIELD EQUIPMENT
  { id: '017', category: 'FIELD EQUIPMENT', nomenclature: 'NOTEBOOK, RULED, A6, 80PG', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  { id: '018', category: 'FIELD EQUIPMENT', nomenclature: 'PEN, BALLPOINT, BLACK INK', unit: 'EA', qty: 2, cadence: 'MONTHLY' },
  { id: '019', category: 'FIELD EQUIPMENT', nomenclature: 'ADHESIVE BANDAGE, ASSORTED', unit: 'EA', qty: 10, cadence: 'MONTHLY' },
  { id: '020', category: 'FIELD EQUIPMENT', nomenclature: 'SAFETY PIN', unit: 'EA', qty: 6, cadence: 'MONTHLY' },
  { id: '021', category: 'FIELD EQUIPMENT', nomenclature: 'ZIPLOCK BAG, QUART SIZE', unit: 'EA', qty: 6, cadence: 'MONTHLY' },
  // FIELD SUPPORT
  { id: '022', category: 'FIELD SUPPORT', nomenclature: 'LIGHTER, DISPOSABLE', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
  // REFERENCE
  { id: '023', category: 'REFERENCE', nomenclature: 'MANIFEST CARD, PRINTED, CURRENT ISSUE', unit: 'EA', qty: 1, cadence: 'MONTHLY' },
]

const DOCTRINE_LINES = [
  'ISSUE, DO NOT SELL. THE SUBSCRIBER IS ON STRENGTH.',
  'USD 100.00 / MONTH. MARGIN ≥ 60%. LANDED COST ≤ USD 40.00. CEILING IS NON-NEGOTIABLE.',
  'THE LEDGER IS THE MARKETING. NO LAYER BETWEEN PUBLIC AND MANIFEST.',
  'SHIP WORKING INCREMENTS MONTHLY. EACH MONTH ENDS IN A DEMONSTRABLE STATE.',
]

function getNextIssueDate(): string {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return next.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

function getCurrentIssueLabel(): string {
  const now = new Date()
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

// Section header row within the manifest — printed only when category changes
function CategoryRow({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={5} className="pl-16 pr-16 pt-8 pb-2 opacity-40 text-[10px] tracking-widest">
        — {label} —
      </td>
    </tr>
  )
}

export function Basics() {
  const nextIssue = React.useMemo(() => getNextIssueDate(), [])
  const currentIssue = React.useMemo(() => getCurrentIssueLabel(), [])

  return (
    <div className="flex flex-col font-mono text-xs leading-[1.5rem]">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="border-2 border-acc">
        <div className="bg-acc text-bac px-16 py-8 flex items-baseline justify-between gap-x-16 flex-wrap">
          <span className="font-bold tracking-widest">LOT® BASIC RATION</span>
          <span className="tracking-widest">OPEN TAB / READ-ONLY</span>
          <span className="ml-auto font-bold">USD 100.00 / MONTH</span>
        </div>
        <div className="border-t border-acc/40 px-16 py-4 flex justify-between gap-x-16 flex-wrap opacity-60">
          <span>LOT-FM-001 / CIVILIAN RATION SUBSCRIPTION</span>
          <span>ISSUE: {currentIssue}</span>
        </div>
      </div>

      {/* ── MANIFEST TABLE ─────────────────────────────────────────────────── */}
      <div className="border-2 border-t-0 border-acc overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-acc text-bac">
              <th className="pl-16 pr-8 py-4 font-bold whitespace-nowrap">ITEM</th>
              <th className="px-8 py-4 font-bold w-full">NOMENCLATURE</th>
              <th className="px-8 py-4 font-bold whitespace-nowrap">UNIT</th>
              <th className="px-8 py-4 font-bold whitespace-nowrap text-right">QTY</th>
              <th className="pl-8 pr-16 py-4 font-bold whitespace-nowrap text-right">CADENCE</th>
            </tr>
          </thead>
          <tbody>
            {RATION_LOAD.reduce<React.ReactNode[]>((rows, item, i) => {
              const prev = RATION_LOAD[i - 1]
              if (!prev || prev.category !== item.category) {
                rows.push(<CategoryRow key={`cat-${item.category}`} label={item.category} />)
              }
              rows.push(
                <tr
                  key={item.id}
                  className={cn(
                    'border-t border-acc/10',
                    i % 2 === 1 ? 'bg-acc/[0.03]' : ''
                  )}
                >
                  <td className="pl-16 pr-8 py-2 opacity-40 whitespace-nowrap">{item.id}</td>
                  <td className="px-8 py-2 whitespace-nowrap">{item.nomenclature}</td>
                  <td className="px-8 py-2 whitespace-nowrap opacity-60">{item.unit}</td>
                  <td className="px-8 py-2 text-right whitespace-nowrap">{item.qty}</td>
                  <td className="pl-8 pr-16 py-2 text-right whitespace-nowrap opacity-60">
                    {item.cadence}
                  </td>
                </tr>
              )
              return rows
            }, [])}
          </tbody>
        </table>

        {/* Table footer */}
        <div className="border-t-2 border-acc px-16 py-4 flex justify-between gap-x-16 flex-wrap opacity-60">
          <span>23 ITEMS / ALL CADENCE MONTHLY</span>
          <span>COGS CEILING: USD 40.00 — TARGET MARGIN: ≥60%</span>
        </div>
      </div>

      {/* ── DOCTRINE ───────────────────────────────────────────────────────── */}
      <div className="border-2 border-t-0 border-acc">
        <div className="bg-acc text-bac px-16 py-4 font-bold tracking-widest">
          DOCTRINE
        </div>
        <div className="px-16 py-8 flex flex-col gap-y-4">
          {DOCTRINE_LINES.map((line, i) => (
            <div key={i} className={i === 0 ? 'font-bold' : 'opacity-70'}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* ── STATUS LINE ────────────────────────────────────────────────────── */}
      <div className="border-2 border-t-0 border-acc">
        <div className="bg-acc text-bac px-16 py-8 flex justify-between gap-x-16 flex-wrap text-[10px] tracking-widest">
          <span>STATUS: OPEN STRENGTH</span>
          <span>SUBSCRIPTION: USD 100.00 / MO</span>
          <span>NEXT ISSUE: {nextIssue}</span>
        </div>
      </div>

      {/* ── UPGRADE PROMPT (Month 2 — pending) ─────────────────────────────── */}
      <div className="border-2 border-t-0 border-acc opacity-30 px-16 py-8 text-[10px] tracking-widest">
        UPGRADE PATH (USERSHIP / AI → BASIC): AVAILABLE MONTH 2
      </div>

    </div>
  )
}
