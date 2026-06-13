/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { cn } from '#client/utils'

// ─── LOT-FM-001 / BASIC (RATION) ─────────────────────────────────────────────
// Month 1: OPEN TAB — ledger, doctrine, status line. Read-only.
// Month 2: UPGRADE path (USERSHIP AI → ON STRENGTH). Billing + roster.
// Month 3: Issue engine, supplier quotes, printed manifest card, first ship.
// ─────────────────────────────────────────────────────────────────────────────

type RationItem = {
  id: number
  section: string
  nomenclature: string
  unit: string
  qty: number
  cadence: string
}

const MANIFEST: RationItem[] = [
  // SUSTENANCE — 9 items — base macros and caloric load
  { id: 1,  section: 'SUSTENANCE', nomenclature: 'OATS, ROLLED',                unit: '1.5 LB', qty: 1, cadence: 'MONTHLY'   },
  { id: 2,  section: 'SUSTENANCE', nomenclature: 'RICE, WHITE LONG-GRAIN',      unit: '2 LB',   qty: 1, cadence: 'MONTHLY'   },
  { id: 3,  section: 'SUSTENANCE', nomenclature: 'LENTILS, GREEN',              unit: '1 LB',   qty: 1, cadence: 'MONTHLY'   },
  { id: 4,  section: 'SUSTENANCE', nomenclature: 'CHICKPEAS, DRIED',            unit: '1 LB',   qty: 1, cadence: 'MONTHLY'   },
  { id: 5,  section: 'SUSTENANCE', nomenclature: 'PEANUT BUTTER, NATURAL',      unit: '16 OZ',  qty: 1, cadence: 'MONTHLY'   },
  { id: 6,  section: 'SUSTENANCE', nomenclature: 'SARDINES, CANNED IN OIL',     unit: '4.4 OZ', qty: 4, cadence: 'MONTHLY'   },
  { id: 7,  section: 'SUSTENANCE', nomenclature: 'TUNA, SOLID WHITE ALBACORE',  unit: '5 OZ',   qty: 4, cadence: 'MONTHLY'   },
  { id: 8,  section: 'SUSTENANCE', nomenclature: 'OLIVE OIL, EXTRA VIRGIN',     unit: '8.5 OZ', qty: 1, cadence: 'MONTHLY'   },
  { id: 9,  section: 'SUSTENANCE', nomenclature: 'HONEY, RAW',                  unit: '8 OZ',   qty: 1, cadence: '2-MONTH'   },
  // PROTOCOL — 8 items — daily supplement regimen
  { id: 10, section: 'PROTOCOL',   nomenclature: 'MULTIVITAMIN, ONE-DAILY',     unit: '30 CT',  qty: 1, cadence: 'MONTHLY'   },
  { id: 11, section: 'PROTOCOL',   nomenclature: 'OMEGA-3, FISH OIL 1000MG',    unit: '30 CT',  qty: 1, cadence: 'MONTHLY'   },
  { id: 12, section: 'PROTOCOL',   nomenclature: 'VITAMIN D3, 2000 IU',         unit: '30 CT',  qty: 1, cadence: 'MONTHLY'   },
  { id: 13, section: 'PROTOCOL',   nomenclature: 'MAGNESIUM GLYCINATE, 200MG',  unit: '30 CT',  qty: 1, cadence: 'MONTHLY'   },
  { id: 14, section: 'PROTOCOL',   nomenclature: 'VITAMIN C, 500MG',            unit: '30 CT',  qty: 1, cadence: 'MONTHLY'   },
  { id: 15, section: 'PROTOCOL',   nomenclature: 'ZINC PICOLINATE, 15MG',       unit: '30 CT',  qty: 1, cadence: 'MONTHLY'   },
  { id: 16, section: 'PROTOCOL',   nomenclature: 'CREATINE MONOHYDRATE',        unit: '150 G',  qty: 1, cadence: 'MONTHLY'   },
  { id: 17, section: 'PROTOCOL',   nomenclature: 'ELECTROLYTES, ZERO-SUGAR',    unit: '10 CT',  qty: 1, cadence: 'MONTHLY'   },
  // PROVISIONS — 5 items — operational beverages and field snacks
  { id: 18, section: 'PROVISIONS', nomenclature: 'TEA, GREEN LOOSE LEAF',       unit: '2 OZ',   qty: 1, cadence: '2-MONTH'   },
  { id: 19, section: 'PROVISIONS', nomenclature: 'COFFEE, DARK ROAST INSTANT',  unit: '3.5 OZ', qty: 1, cadence: 'MONTHLY'   },
  { id: 20, section: 'PROVISIONS', nomenclature: 'FRUIT, DRIED MIXED',          unit: '6 OZ',   qty: 1, cadence: 'MONTHLY'   },
  { id: 21, section: 'PROVISIONS', nomenclature: 'NUTS, MIXED UNSALTED',        unit: '8 OZ',   qty: 1, cadence: 'MONTHLY'   },
  { id: 22, section: 'PROVISIONS', nomenclature: 'SALT, SEA IODIZED',           unit: '8 OZ',   qty: 1, cadence: 'QUARTERLY' },
  // LOGISTICS — 1 item — system artifact issued with every box
  { id: 23, section: 'LOGISTICS',  nomenclature: 'MANIFEST CARD, PRINTED',      unit: '1 CT',   qty: 1, cadence: 'MONTHLY'   },
]

const SECTIONS = ['SUSTENANCE', 'PROTOCOL', 'PROVISIONS', 'LOGISTICS'] as const

// Breaks out of Page component padding for full-bleed section headers.
const fullBleed =
  '-mx-16 px-16 phone:-mx-32 phone:px-32 tablet:-mx-48 tablet:px-48 desktop:-mx-64 desktop:px-64'

const COL_TEMPLATE = '2.5rem 1fr 6rem 3rem 7.5rem'

export const Basics: React.FC = () => {
  const isMirrorOn = useStore(stores.isMirrorOn)

  const inv      = isMirrorOn ? 'bg-white/10 text-white' : 'bg-acc text-bac'
  const border2  = isMirrorOn ? 'border-white/40'        : 'border-acc'
  const borderDim = isMirrorOn ? 'border-white/15'       : 'border-acc/20'

  return (
    <div className="font-mono text-xs uppercase leading-[1.4]">

      {/* ── HEADER — full-bleed inverted ── */}
      <div className={cn(inv, fullBleed, 'py-16 border-b-2', border2)}>
        <div className="opacity-50 text-[10px] tracking-[0.18em] mb-6">
          LOT-FM-001 // MODULE: BASIC (RATION) // ISSUE 1
        </div>
        <div className="text-base font-bold tracking-tight">
          OPEN TAB — READ-ONLY
        </div>
        <div className="opacity-50 text-[10px] tracking-[0.12em] mt-6">
          CIVILIAN RATION SUBSCRIPTION // 90-DAY BUILD CYCLE
        </div>
      </div>

      {/* ── PRICE LINE — full-bleed ── */}
      <div className={cn(fullBleed, 'py-8 border-b-2', border2, 'flex flex-wrap gap-x-24 gap-y-4')}>
        <span className="font-bold">USD 100.00 / MO</span>
        <span className="opacity-40">MARGIN ≥ 60%</span>
        <span className="opacity-40">COGS CEILING USD 40.00</span>
        <span className="opacity-40">STATUS: OPEN</span>
        <span className="opacity-40">ON STRENGTH: 0</span>
      </div>

      {/* ── DOCTRINE ── */}
      <div className={cn('py-16 border-b-2', border2)}>
        <div className="opacity-40 text-[10px] tracking-[0.2em] mb-10">
          DOCTRINE // LOT-FM-001 § 1
        </div>
        <div className="space-y-6 text-[11px] leading-[1.7]">
          <div>ISSUE, DO NOT SELL. THE USER IS ON STRENGTH.</div>
          <div>THE LEDGER IS THE MARKETING. NO LAYER BETWEEN PUBLIC AND MANIFEST.</div>
          <div>USD 100/MO. ≥ 60% MARGIN. ≤ USD 40 LANDED. NEVER BREACH THE CEILING.</div>
          <div>SHIP WORKING INCREMENTS MONTHLY. EACH MONTH ENDS IN A DEMONSTRABLE STATE.</div>
        </div>
      </div>

      {/* ── RATION MANIFEST ── */}
      <div className={cn('py-16 border-b-2', border2)}>
        <div className="opacity-40 text-[10px] tracking-[0.2em] mb-10">
          RATION MANIFEST // 23 ITEMS // COGS WITHHELD
        </div>

        {/* Table column header */}
        <div
          className={cn(inv, 'grid py-6 px-4 text-[10px] tracking-[0.12em] font-bold')}
          style={{ gridTemplateColumns: COL_TEMPLATE }}
        >
          <span>NO</span>
          <span>NOMENCLATURE</span>
          <span>UNIT</span>
          <span>QTY</span>
          <span>CADENCE</span>
        </div>

        {/* Rows grouped by section */}
        {SECTIONS.map((section) => {
          const items = MANIFEST.filter((i) => i.section === section)
          return (
            <React.Fragment key={section}>
              <div
                className={cn(
                  'py-4 px-4 mt-4 text-[9px] tracking-[0.25em] opacity-40 border-t',
                  border2
                )}
              >
                {section}
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn('grid py-[5px] px-4 text-[11px] border-b', borderDim)}
                  style={{ gridTemplateColumns: COL_TEMPLATE }}
                >
                  <span className="opacity-40">{String(item.id).padStart(2, '0')}</span>
                  <span className="font-bold">{item.nomenclature}</span>
                  <span>{item.unit}</span>
                  <span>{item.qty}</span>
                  <span
                    className={
                      item.cadence !== 'MONTHLY' ? 'font-bold' : 'opacity-40'
                    }
                  >
                    {item.cadence}
                  </span>
                </div>
              ))}
            </React.Fragment>
          )
        })}
      </div>

      {/* ── BUILD STATUS — 3-month pipeline ── */}
      <div className="py-16">
        <div className="opacity-40 text-[10px] tracking-[0.2em] mb-10">
          BUILD STATUS // LOT-FM-001
        </div>
        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>

          {/* M1 — LIVE */}
          <div className={cn(inv, 'p-12 border-2', border2)}>
            <div className="opacity-50 text-[9px] tracking-[0.2em] mb-6">M1 // 30 DAYS</div>
            <div className="font-bold text-[11px] mb-4">LEDGER &amp; DOCTRINE</div>
            <div className="text-[10px] opacity-70">OPEN TAB LIVE</div>
            <div className="text-[10px] mt-8">▶ LIVE</div>
          </div>

          {/* M2 — PENDING */}
          <div className={cn('p-12 border-2 opacity-30', border2)}>
            <div className="text-[9px] tracking-[0.2em] mb-6">M2 // 60 DAYS</div>
            <div className="font-bold text-[11px] mb-4">UPGRADE &amp; ROSTER</div>
            <div className="text-[10px]">USERSHIP → ON STRENGTH</div>
            <div className="text-[10px] mt-8">◯ PENDING</div>
          </div>

          {/* M3 — PENDING */}
          <div className={cn('p-12 border-2 opacity-30', border2)}>
            <div className="text-[9px] tracking-[0.2em] mb-6">M3 // 90 DAYS</div>
            <div className="font-bold text-[11px] mb-4">ISSUE &amp; FULFILLMENT</div>
            <div className="text-[10px]">FIRST RATION SHIPS</div>
            <div className="text-[10px] mt-8">◯ PENDING</div>
          </div>

        </div>
      </div>

    </div>
  )
}
