/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT-FM-001 / BASICS TAB — OPEN TAB
 * MONTH 1: LEDGER & DOCTRINE (read-only)
 *
 * Renders the public manifest of the LOT® BASIC ration:
 * 23-item load, doctrine, price line, status line.
 * COGS withheld. Upgrade path wired in Month 2.
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { cn } from '#client/utils'

// ─── MANIFEST ──────────────────────────────────────────────────────────────
// 23-item BASIC ration load. Cadence drives box composition.
// COGS ceiling: ≤ USD 40.00 landed. Margin: ≥ 60%.
// COGS column is withheld from the public ledger.
// ───────────────────────────────────────────────────────────────────────────
type ManifestItem = {
  line: string
  nomenclature: string
  qty: string
  cadence: 'MONTHLY' | 'QUARTERLY'
}

const MANIFEST: ManifestItem[] = [
  { line: '001', nomenclature: 'ROLLED OATS, WHOLE GRAIN',             qty: '2 LB',   cadence: 'MONTHLY'   },
  { line: '002', nomenclature: 'WHITE RICE, LONG GRAIN',               qty: '2 LB',   cadence: 'MONTHLY'   },
  { line: '003', nomenclature: 'RED LENTILS, SPLIT',                   qty: '1 LB',   cadence: 'MONTHLY'   },
  { line: '004', nomenclature: 'BLACK BEANS, DRIED',                   qty: '1 LB',   cadence: 'MONTHLY'   },
  { line: '005', nomenclature: 'OLIVE OIL, EXTRA VIRGIN',              qty: '250 ML', cadence: 'MONTHLY'   },
  { line: '006', nomenclature: 'HIMALAYAN SALT, FINE',                 qty: '1 LB',   cadence: 'QUARTERLY' },
  { line: '007', nomenclature: 'COFFEE, GROUND, DARK ROAST',           qty: '4 OZ',   cadence: 'MONTHLY'   },
  { line: '008', nomenclature: 'MULTIVITAMIN, COMPLETE DAILY',         qty: '30 CT',  cadence: 'MONTHLY'   },
  { line: '009', nomenclature: 'VITAMIN C, 500 MG',                    qty: '30 CT',  cadence: 'MONTHLY'   },
  { line: '010', nomenclature: 'ZINC, 15 MG',                          qty: '30 CT',  cadence: 'MONTHLY'   },
  { line: '011', nomenclature: 'MAGNESIUM, 250 MG',                    qty: '30 CT',  cadence: 'MONTHLY'   },
  { line: '012', nomenclature: 'VITAMIN D3, 2000 IU',                  qty: '30 CT',  cadence: 'MONTHLY'   },
  { line: '013', nomenclature: 'GREEN TEA BAGS',                       qty: '20 CT',  cadence: 'MONTHLY'   },
  { line: '014', nomenclature: 'ELECTROLYTE POWDER, PLAIN',            qty: '30 PKT', cadence: 'MONTHLY'   },
  { line: '015', nomenclature: 'CHIA SEEDS, WHOLE',                    qty: '8 OZ',   cadence: 'MONTHLY'   },
  { line: '016', nomenclature: 'APPLE CIDER VINEGAR, RAW',             qty: '8 OZ',   cadence: 'MONTHLY'   },
  { line: '017', nomenclature: 'PEANUT BUTTER, NATURAL',               qty: '8 OZ',   cadence: 'MONTHLY'   },
  { line: '018', nomenclature: 'OAT CRACKERS, PLAIN',                  qty: '4 OZ',   cadence: 'MONTHLY'   },
  { line: '019', nomenclature: 'MIXED SEEDS, FLAX / HEMP / PUMPKIN',  qty: '4 OZ',   cadence: 'MONTHLY'   },
  { line: '020', nomenclature: 'TURMERIC, GROUND',                     qty: '25 G',   cadence: 'QUARTERLY' },
  { line: '021', nomenclature: 'BLACK PEPPER, GROUND',                 qty: '25 G',   cadence: 'QUARTERLY' },
  { line: '022', nomenclature: 'COCONUT OIL, REFINED',                 qty: '4 OZ',   cadence: 'QUARTERLY' },
  { line: '023', nomenclature: 'MANIFEST CARD, PRINTED',               qty: '1 CT',   cadence: 'MONTHLY'   },
]

const DOCTRINE = [
  'LOT BASIC IS A RATION, NOT A SUBSCRIPTION BOX.',
  'ONE BOX. ONE LOAD. EVERY 30 DAYS. NO SUBSTITUTIONS.',
  'THE LEDGER IS OPEN. THE PRICE IS FIXED.',
  'YOU ARE ON STRENGTH OR YOU ARE NOT.',
  'NO TRIAL. NO DISCOUNT. NO UPSELL. NO MARKETING.',
  'ISSUE, NOT SALE. THE USER IS ON STRENGTH.',
]

// ─── GRID COLUMNS ──────────────────────────────────────────────────────────
// Fixed character-grid columns matching IBM 3270 register proportions.
// ───────────────────────────────────────────────────────────────────────────
const COL_GRID = '3.5rem 1fr 5.5rem 7rem'

export const Basics = () => {
  const me = useStore(stores.me)

  // Month 2 replaces these constants with the subscription state machine.
  const rationStatus: string = 'OPEN'
  const isOnStrength = rationStatus === 'ON STRENGTH'

  return (
    <div className="font-mono text-acc leading-normal">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between border-b-2 border-acc pb-8">
        <span className="text-sm font-bold tracking-widest">LOT® BASIC RATION</span>
        <span className="text-sm font-bold tracking-widest">OPEN TAB</span>
      </div>
      <div className="text-xs py-8 border-b border-acc/30" style={{ opacity: 0.45 }}>
        LOT-FM-001 &nbsp;&middot;&nbsp; CIVILIAN ISSUE &nbsp;&middot;&nbsp; USD 100.00 / MO &nbsp;&middot;&nbsp; {MANIFEST.length} LINE ITEMS
      </div>

      {/* ── STATUS LINE ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-12 py-12 border-b-2 border-acc">
        <span className={cn(
          'text-xs font-bold px-6 py-1 tracking-widest',
          isOnStrength ? 'bg-acc text-bac' : 'border border-acc text-acc'
        )}>
          {rationStatus}
        </span>
        <span className="text-xs tracking-widest" style={{ opacity: 0.45 }}>
          {isOnStrength ? 'RATION ACTIVE' : 'NOT ON STRENGTH'}
        </span>
      </div>

      {/* ── DOCTRINE ───────────────────────────────────────────────────── */}
      <div className="py-16 border-b-2 border-acc">
        <div className="text-xs font-bold mb-8 tracking-widest">DOCTRINE</div>
        <div className="text-xs" style={{ opacity: 0.65 }}>
          {DOCTRINE.map((line, i) => (
            <div key={i} className="leading-loose">{line}</div>
          ))}
        </div>
      </div>

      {/* ── MANIFEST ───────────────────────────────────────────────────── */}
      <div className="py-16 border-b-2 border-acc">
        <div className="text-xs font-bold mb-12 tracking-widest">
          MANIFEST — BASIC RATION — {MANIFEST.length} LINE ITEMS — CURRENT LOAD
        </div>

        {/* Column headers */}
        <div
          className="grid text-xs font-bold pb-6 border-b border-acc tracking-widest"
          style={{ gridTemplateColumns: COL_GRID }}
        >
          <span style={{ opacity: 0.45 }}>LINE</span>
          <span>NOMENCLATURE</span>
          <span>QTY</span>
          <span>CADENCE</span>
        </div>

        {/* Manifest rows */}
        {MANIFEST.map((item) => (
          <div
            key={item.line}
            className="grid text-xs py-[5px] border-b border-acc/20"
            style={{ gridTemplateColumns: COL_GRID }}
          >
            <span style={{ opacity: 0.3 }}>{item.line}</span>
            <span>{item.nomenclature}</span>
            <span style={{ opacity: 0.55 }}>{item.qty}</span>
            <span style={{ opacity: item.cadence === 'QUARTERLY' ? 0.35 : 1 }}>
              {item.cadence}
            </span>
          </div>
        ))}
      </div>

      {/* ── TERMS ──────────────────────────────────────────────────────── */}
      <div className="py-16">
        <div className="text-xs tracking-wide leading-loose" style={{ opacity: 0.45 }}>
          <div>USD 100.00 / MONTH &nbsp;&middot;&nbsp; AUTO-RENEWS &nbsp;&middot;&nbsp; CANCEL ANYTIME</div>
          <div>SHIPS CONTINENTAL US &nbsp;&middot;&nbsp; ALLOW 5–7 DAYS FROM ISSUE DATE</div>
          <div>UPGRADE: LOT USERSHIP (AI PLAN) → LOT BASIC (RATION + AI)</div>
          <div>COGS: WITHHELD FROM PUBLIC LEDGER &nbsp;&middot;&nbsp; MARGIN ≥ 60%</div>
        </div>
      </div>

    </div>
  )
}
