/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT-FM-001 / BASICS TAB
 *
 * MONTH 1  — LEDGER & DOCTRINE  — OPEN TAB, read-only, 23-item manifest
 * MONTH 2  — UPGRADE & ROSTER   — state machine, billing, enlistment
 * MONTH 3  — ISSUE & FULFILLMENT — load engine, shipping, first box out
 */

import * as React from 'react'

// ─── 23-ITEM RATION LOAD — LOT-FM-001 § 2 ──────────────────────────────────

const RATION_LOAD = [
  { id: '01', nomenclature: 'OATS, ROLLED',               cadence: 'MONTHLY'   },
  { id: '02', nomenclature: 'RICE, LONG-GRAIN DRY',       cadence: 'MONTHLY'   },
  { id: '03', nomenclature: 'LENTILS, GREEN DRY',         cadence: 'MONTHLY'   },
  { id: '04', nomenclature: 'PASTA, DURUM WHEAT',         cadence: 'MONTHLY'   },
  { id: '05', nomenclature: 'FLOUR, WHOLE WHEAT',         cadence: 'MONTHLY'   },
  { id: '06', nomenclature: 'OIL, OLIVE EXTRA-VIRGIN',    cadence: 'MONTHLY'   },
  { id: '07', nomenclature: 'SARDINES, IN OIL (TIN×4)',   cadence: 'MONTHLY'   },
  { id: '08', nomenclature: 'EGGS, DOZEN',                cadence: 'MONTHLY'   },
  { id: '09', nomenclature: 'ALMONDS, RAW',               cadence: 'MONTHLY'   },
  { id: '10', nomenclature: 'CHIA SEEDS',                 cadence: 'MONTHLY'   },
  { id: '11', nomenclature: 'PEANUT BUTTER, NATURAL',     cadence: 'MONTHLY'   },
  { id: '12', nomenclature: 'RAISINS, ORGANIC',           cadence: 'MONTHLY'   },
  { id: '13', nomenclature: 'COFFEE, WHOLE BEAN',         cadence: 'MONTHLY'   },
  { id: '14', nomenclature: 'MULTIVITAMIN (30-COUNT)',     cadence: 'MONTHLY'   },
  { id: '15', nomenclature: 'BEANS, BLACK DRY',           cadence: 'QUARTERLY' },
  { id: '16', nomenclature: 'SALT, SEA IODIZED',          cadence: 'QUARTERLY' },
  { id: '17', nomenclature: 'HONEY, RAW',                 cadence: 'QUARTERLY' },
  { id: '18', nomenclature: 'VINEGAR, APPLE CIDER',       cadence: 'QUARTERLY' },
  { id: '19', nomenclature: 'TURMERIC, GROUND',           cadence: 'QUARTERLY' },
  { id: '20', nomenclature: 'PEPPER, BLACK WHOLE',        cadence: 'QUARTERLY' },
  { id: '21', nomenclature: 'TEA, GREEN LOOSE LEAF',      cadence: 'QUARTERLY' },
  { id: '22', nomenclature: 'MAPLE SYRUP, GRADE A',       cadence: 'QUARTERLY' },
  { id: '23', nomenclature: 'SOY SAUCE',                  cadence: 'QUARTERLY' },
] as const

// ─── SECTION LABEL — inverted inline tag ─────────────────────────────────────

const SectionLabel: React.FC<{ children: string }> = ({ children }) => (
  <span className="inline-block bg-acc text-bac font-mono font-bold text-xs tracking-widest px-8 py-2">
    {children}
  </span>
)

// ─── BASICS TAB — M-1: OPEN TAB (read-only) ─────────────────────────────────

export const Basics: React.FC = React.memo(function BasicsInner() {
  return (
    <div className="font-mono text-acc">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="bg-acc text-bac border-b-2 border-acc py-8 flex items-center justify-between">
        <span className="font-bold tracking-widest text-sm">LOT® BASIC RATION</span>
        <span className="text-xs tracking-widest opacity-60">LOT-FM-001</span>
      </div>

      {/* ── DOCTRINE ────────────────────────────────────────────────────── */}
      <div className="border-b-2 border-acc py-16">
        <SectionLabel>DOCTRINE</SectionLabel>
        <div className="mt-12 text-sm leading-[1.8]">
          <p>YOU ARE ON STRENGTH. THIS IS YOUR LOAD.</p>
          <p>USD 100.00 PER CYCLE. MARGIN: ≥60%. COGS: WITHHELD.</p>
          <p>THE LEDGER IS THE MARKETING.</p>
          <p>ISSUE, DO NOT SELL.</p>
        </div>
      </div>

      {/* ── RATE LINE ───────────────────────────────────────────────────── */}
      <div className="border-b-2 border-acc py-8 flex items-baseline justify-between">
        <span className="text-xs tracking-widest opacity-50">RATE</span>
        <span className="font-bold tracking-[0.1em]">USD 100.00 / CYCLE</span>
      </div>

      {/* ── RATION LEDGER ───────────────────────────────────────────────── */}
      <div className="border-b-2 border-acc">
        <SectionLabel>RATION LOAD — 23 ITEMS</SectionLabel>

        {/* Ledger header — inverted */}
        <div
          className="mt-8 bg-acc text-bac grid text-xs font-bold tracking-widest py-4"
          style={{ gridTemplateColumns: '2.5rem 1fr 7rem' }}
        >
          <span>№</span>
          <span>NOMENCLATURE</span>
          <span className="text-right">CADENCE</span>
        </div>

        {/* 23 items */}
        {RATION_LOAD.map((item) => (
          <div
            key={item.id}
            className="grid py-4 border-t border-acc/10 text-sm"
            style={{ gridTemplateColumns: '2.5rem 1fr 7rem' }}
          >
            <span className="text-xs text-acc/40 self-center">{item.id}</span>
            <span>{item.nomenclature}</span>
            <span className="text-right text-xs text-acc/60 self-center">{item.cadence}</span>
          </div>
        ))}

        {/* Ledger footer */}
        <div className="py-4 border-t border-acc/20 text-xs text-acc/40">
          14 MONTHLY — 9 QUARTERLY — COGS NOT PUBLISHED
        </div>
      </div>

      {/* ── UPGRADE PATH — M-2 STUB ─────────────────────────────────────── */}
      <div className="border-b-2 border-acc py-16">
        <SectionLabel>UPGRADE PATH</SectionLabel>
        <div className="mt-12 flex items-start justify-between gap-16">
          <div className="text-sm">
            <p>CURRENT PLAN: USERSHIP — AI</p>
            <p className="text-xs text-acc/40 mt-4">
              ENLIST INTO BASIC: AVAILABLE M-2 // 2026-Q3
            </p>
          </div>
          {/* M-2: replace with active state machine */}
          <button
            disabled
            className="border-2 border-acc/20 text-acc/20 px-16 py-8 text-xs tracking-widest font-bold cursor-not-allowed whitespace-nowrap"
          >
            ENLIST →
          </button>
        </div>
      </div>

      {/* ── STATUS LINE ─────────────────────────────────────────────────── */}
      <div className="py-8 flex items-center justify-between text-xs text-acc/40">
        <span>TAB: OPEN // READ-ONLY // M-1 ASSEMBLED</span>
        <span>LOT-FM-001 // REV A</span>
      </div>

    </div>
  )
})
