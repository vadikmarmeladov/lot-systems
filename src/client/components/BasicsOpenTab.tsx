/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * PUBLIC SURFACE — LOT-FM-001 "OPEN TAB". Read-only. No authentication.
 * A stranger can read what LOT issues and on what terms. The ledger is
 * the marketing — no layer between public and manifest, so this renders
 * the same 23-item ration constants used by the in-app BASIC tab.
 */

import * as React from 'react'
import { Page } from '#client/components/ui/Page'
import { useDocumentTitle } from '#client/utils/hooks'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  type RationItem,
  type RationCadence,
} from './basics/doctrine'

const cadenceBadge = (cadence: RationCadence) => {
  const cls =
    cadence === 'MONTHLY' ? 'text-acc' : cadence === 'QUARTERLY' ? 'text-acc/60' : 'text-acc/40'
  return <span className={`font-mono text-[11px] ${cls}`}>{cadence}</span>
}

const LedgerRow: React.FC<{ item: RationItem; isLast: boolean }> = ({ item, isLast }) => (
  <div
    className={`grid font-mono text-[12px] phone:text-[13px] py-[5px] gap-x-8 ${
      !isLast ? 'border-b border-acc/10' : ''
    }`}
    style={{ gridTemplateColumns: '28px 1fr auto auto' }}
  >
    <span className="text-acc/40 tabular-nums">{item.line}</span>
    <span className="text-acc uppercase tracking-wide leading-snug">{item.nomenclature}</span>
    <span className="text-acc/50 text-right whitespace-nowrap">{item.spec}</span>
    <span className="text-right w-[80px] phone:w-[90px]">{cadenceBadge(item.cadence)}</span>
  </div>
)

const LedgerCategory: React.FC<{ category: RationItem['category'] }> = ({ category }) => {
  const items = RATION_MANIFEST.filter((i) => i.category === category)
  return (
    <div className="mb-12">
      <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
        {category} ({items.length})
      </div>
      {items.map((item, idx) => (
        <LedgerRow key={item.line} item={item} isLast={idx === items.length - 1} />
      ))}
    </div>
  )
}

export const BasicsOpenTab: React.FC = () => {
  useDocumentTitle('Basics — LOT-FM-001')

  return (
    <Page className="max-w-[640px]">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="font-mono text-[13px] phone:text-[14px] uppercase tracking-[0.15em] text-acc font-bold">
          BASICS — OPEN TAB
        </h1>
        <span className="font-mono text-[11px] text-acc/40 tracking-widest">{MANUAL_REF}</span>
      </div>
      <div className="border-t-2 border-acc w-full mb-16" />

      {/* ── DOCTRINE + PRICE ──────────────────────────────── */}
      <div className="mb-16 flex flex-col gap-y-4">
        {DOCTRINE_LINES.map((line, i) => (
          <p key={i} className="font-mono text-[12px] phone:text-[13px] text-acc leading-snug">
            {line}
          </p>
        ))}
        <p className="font-mono text-[13px] phone:text-[15px] text-acc font-bold mt-8 tracking-wide">
          {PRICE_LINE}
        </p>
      </div>

      <div className="border-t border-acc/30 w-full mb-16" />

      {/* ── MANIFEST LEDGER ───────────────────────────────── */}
      <div className="font-mono text-[11px] tracking-widest uppercase text-acc/50 py-8">
        SECTION 1 — RATION MANIFEST ({RATION_COUNT} ITEMS)
      </div>

      <div
        className="grid font-mono text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
        style={{ gridTemplateColumns: '28px 1fr auto auto' }}
      >
        <span>NO.</span>
        <span>NOMENCLATURE</span>
        <span className="text-right">SPEC</span>
        <span className="text-right w-[80px] phone:w-[90px]">CADENCE</span>
      </div>

      <LedgerCategory category="NUTRITION" />
      <LedgerCategory category="HEALTH" />
      <LedgerCategory category="HYGIENE" />
      <LedgerCategory category="EQUIPMENT" />

      <div className="border-t border-acc/30 w-full mb-16 mt-8" />

      {/* ── TERMS ─────────────────────────────────────────── */}
      <div className="font-mono text-[11px] tracking-widest uppercase text-acc/50 py-8">
        SECTION 2 — TERMS
      </div>
      <div className="font-mono text-[12px] phone:text-[13px] text-acc/70 leading-snug mb-16">
        BASIC is an additive layer on USERSHIP / AI. USD 100.00 / MO, billed monthly.
        COGS ceiling USD 40.00 landed. Margin floor 60%, never breached. No public
        checkout — enrollment runs through the roster after USERSHIP is on file.
      </div>

      <div className="border-t-2 border-acc w-full mb-16" />
      <p className="font-mono text-[11px] text-acc/40 tracking-widest uppercase">
        MEMBERS — SIGN IN TO VIEW STATUS AND ENLIST.
      </p>
    </Page>
  )
}
