/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * BASICS TAB — LOT-FM-001 / CIVILIAN RATION SUPPLY
 *
 * Month 1 of 3: OPEN TAB / LEDGER & DOCTRINE
 * Public surface. 23-item manifest. Read-only. Live.
 *
 * Month 2 (pending): UPGRADE & ROSTER — Usership/AI → ON STRENGTH state machine
 * Month 3 (pending): ISSUE & FULFILLMENT — box ships, margin verified
 */

import React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { cn } from '#client/utils'

// ─── MANIFEST DATA ────────────────────────────────────────────────────────────
// LOT-FM-001, Section 2 — 23-item civilian ration load
// Nomenclature follows military register: NOUN, MODIFIER
// COGS withheld from public ledger per doctrine
// Cadence: MONTHLY unless noted (Section 2 load engine, Month 3)

type RationItem = {
  seq: string
  nomenclature: string
  cadence: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
}

const RATION_MANIFEST: RationItem[] = [
  { seq: '01', nomenclature: 'PROTEIN RATION, TUNA CANNED',         cadence: 'MONTHLY' },
  { seq: '02', nomenclature: 'PROTEIN RATION, SARDINE CANNED',      cadence: 'MONTHLY' },
  { seq: '03', nomenclature: 'GRAIN RATION, ROLLED OAT 500G',       cadence: 'MONTHLY' },
  { seq: '04', nomenclature: 'PULSE RATION, RED LENTIL 500G',       cadence: 'MONTHLY' },
  { seq: '05', nomenclature: 'SEED ALLOTMENT, MIXED BULK',          cadence: 'MONTHLY' },
  { seq: '06', nomenclature: 'ENERGY BAR, PROTEIN/CARB (5X)',       cadence: 'MONTHLY' },
  { seq: '07', nomenclature: 'ELECTROLYTE PACK, POWDER (10X)',      cadence: 'MONTHLY' },
  { seq: '08', nomenclature: 'COFFEE ALLOTMENT, GROUND DARK 250G',  cadence: 'MONTHLY' },
  { seq: '09', nomenclature: 'TEA ALLOTMENT, GREEN (20X)',          cadence: 'MONTHLY' },
  { seq: '10', nomenclature: 'HONEY ISSUE, RAW UNFILTERED 250ML',   cadence: 'MONTHLY' },
  { seq: '11', nomenclature: 'SALT ISSUE, HIMALAYAN COARSE 250G',   cadence: 'MONTHLY' },
  { seq: '12', nomenclature: 'OIL RATION, COLD-PRESS OLIVE 250ML',  cadence: 'MONTHLY' },
  { seq: '13', nomenclature: 'VITAMIN ISSUE, MULTI 30-DAY',         cadence: 'MONTHLY' },
  { seq: '14', nomenclature: 'FIBER PACK, PSYLLIUM HUSK 150G',      cadence: 'MONTHLY' },
  { seq: '15', nomenclature: 'SOAP ISSUE, BAR UNSCENTED (2X)',      cadence: 'MONTHLY' },
  { seq: '16', nomenclature: 'DENTAL ISSUE, PASTE + FLOSS',         cadence: 'MONTHLY' },
  { seq: '17', nomenclature: 'RAZOR ISSUE, SINGLE-BLADE (5X)',      cadence: 'MONTHLY' },
  { seq: '18', nomenclature: 'FIRST AID, BANDAGE ASSORTMENT',       cadence: 'MONTHLY' },
  { seq: '19', nomenclature: 'BALM ISSUE, BEESWAX FORMULA',         cadence: 'MONTHLY' },
  { seq: '20', nomenclature: 'IGNITION TOOL, STRIKE-ANYWHERE',      cadence: 'MONTHLY' },
  { seq: '21', nomenclature: 'FIELD NOTES, POCKET RULED',           cadence: 'MONTHLY' },
  { seq: '22', nomenclature: 'WRITING IMPLEMENT, BALLPOINT (2X)',   cadence: 'MONTHLY' },
  { seq: '23', nomenclature: 'MANIFEST CARD, PRINTED LAMINATED',    cadence: 'MONTHLY' },
]

// ─── TERMINAL STYLE TOKENS ────────────────────────────────────────────────────
// IBM 3270 register. White ground / black ink. Inversion-only hierarchy.
// 2px rules. Square corners. Fixed character grid.

const T = {
  // layout
  page:      'font-mono text-[13px] leading-[1.5] tracking-tight',
  rule:      'border-t-2 border-black my-0',
  // status bar — inverted (black ground / white ink)
  statusBar: 'bg-black text-white font-mono text-[12px] leading-none px-16 py-8 flex flex-wrap gap-x-32 gap-y-4 items-center border-b-2 border-black',
  statusSep: 'opacity-40',
  // section header — inverted block
  header:    'bg-black text-white font-mono text-[12px] tracking-widest uppercase px-16 py-6 border-b-2 border-black',
  // ledger rows
  ledger:    'px-16',
  row:       'flex items-baseline border-b border-black/10 py-4',
  rowSeq:    'w-[3ch] flex-shrink-0 opacity-40 select-none',
  rowName:   'flex-1 uppercase tracking-tight',
  rowCad:    'w-[10ch] flex-shrink-0 text-right opacity-60',
  // doctrine block
  doctrine:  'px-16 py-16 font-mono text-[13px] leading-[1.7]',
  // upgrade footer
  footer:    'px-16 py-12 border-t-2 border-black',
  upgradeCta:'border-2 border-black px-16 py-8 font-mono text-[12px] uppercase tracking-widest inline-block opacity-30 cursor-not-allowed select-none',
  upgradeNote: 'mt-8 font-mono text-[11px] opacity-40 uppercase tracking-wider',
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Rule() {
  return <hr className={T.rule} />
}

function StatusBar() {
  return (
    <div className={T.statusBar}>
      <span>LOT® BASICS</span>
      <span className={T.statusSep}>│</span>
      <span>STATUS: OPEN TAB</span>
      <span className={T.statusSep}>│</span>
      <span>RATION: USD 100/MO</span>
      <span className={T.statusSep}>│</span>
      <span>NEXT ISSUE: AWAITING SUBSCRIBERS</span>
      <span className={T.statusSep}>│</span>
      <span>LOT-FM-001</span>
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <div className={T.header}>{children}</div>
}

function Doctrine() {
  return (
    <div className={T.doctrine}>
      <p>
        LOT ISSUES A CIVILIAN RATION TO MEMBERS ON STRENGTH.<br />
        ONE BOX. MONTHLY. TWENTY-THREE ITEMS. NO SUBSTITUTIONS.<br />
        THE LEDGER IS PUBLIC. COGS IS NOT.<br />
        USD 100 PER MONTH. SIXTY PERCENT MARGIN TARGET.<br />
        FORTY DOLLARS LANDED. THE BOX ARRIVES.
      </p>
      <p className="mt-12 opacity-50 text-[11px]">
        LOT-FM-001 REV A — 2026-06-25 — S-2 MARMELADOV V.
      </p>
    </div>
  )
}

function ManifestLedger() {
  return (
    <div className={T.ledger}>
      {/* Column headers */}
      <div className={cn(T.row, 'border-b-2 border-black opacity-40 text-[11px] tracking-widest uppercase')}>
        <span className={T.rowSeq}>#</span>
        <span className={T.rowName}>NOMENCLATURE</span>
        <span className={T.rowCad}>CADENCE</span>
      </div>

      {/* Manifest rows */}
      {RATION_MANIFEST.map((item) => (
        <div key={item.seq} className={T.row}>
          <span className={T.rowSeq}>{item.seq}</span>
          <span className={T.rowName}>{item.nomenclature}</span>
          <span className={T.rowCad}>{item.cadence}</span>
        </div>
      ))}

      {/* Totals line */}
      <div className={cn(T.row, 'border-t-2 border-black border-b-0 mt-4 pt-8 opacity-40 text-[11px]')}>
        <span className={T.rowSeq}></span>
        <span className={T.rowName}>23 ITEMS TOTAL — COGS WITHHELD</span>
        <span className={T.rowCad}></span>
      </div>
    </div>
  )
}

function UpgradeFooter({ isUsership }: { isUsership: boolean }) {
  return (
    <div className={T.footer}>
      {isUsership ? (
        <>
          {/* Month 2: upgrade control will be enabled here */}
          <div className={T.upgradeCta}>
            UPGRADE TO BASIC RATION — USD 100/MO
          </div>
          <p className={T.upgradeNote}>
            UPGRADE PATH AVAILABLE IN NEXT RELEASE — MONTH 2
          </p>
        </>
      ) : (
        <>
          <div className={T.upgradeCta}>
            UPGRADE TO BASIC RATION — REQUIRES USERSHIP
          </div>
          <p className={T.upgradeNote}>
            USERSHIP (AI PLAN) REQUIRED TO GO ON STRENGTH
          </p>
        </>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function Basics() {
  const me = useStore(stores.me)

  const isUsership = React.useMemo(
    () => (me?.tags ?? []).includes('Usership' as any),
    [me]
  )

  return (
    <div className={cn(T.page, 'border-2 border-black bg-white text-black')}>
      <StatusBar />

      <SectionHeader>DOCTRINE — LOT-FM-001</SectionHeader>
      <Doctrine />

      <Rule />

      <SectionHeader>
        LOT-FM-001 / RATION LOAD — 23 ITEMS — {new Date().getFullYear()}
      </SectionHeader>
      <ManifestLedger />

      <Rule />

      <UpgradeFooter isUsership={isUsership} />
    </div>
  )
}
