/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | Made in the USA | brand.lot-systems.com
 */

// BASICS TAB — LOT-FM-001 / MONTH 1
// OPEN TAB: Read-only manifest ledger. Doctrine. Price. Status.
// EXIT CONDITION: A stranger can read what LOT issues and on what terms.

import * as React from 'react'
import { cn } from '#client/utils'
import {
  MANIFEST,
  DOCTRINE_LINES,
  SECTIONS_ORDER,
  RationItem,
  RationSection,
  RATION_PRICE_USD,
  RATION_ITEM_COUNT,
} from './basics/tokens'

// ── PRIMITIVES ───────────────────────────────────────────────────────────────

const Rule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t-2 border-acc w-full', className)} />
)

const SectionHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('font-mono font-bold uppercase tracking-widest text-[11px] opacity-40 mb-8', className)}>
    {children}
  </div>
)

// ── DOCTRINE BLOCK ───────────────────────────────────────────────────────────

const DoctrineBlock: React.FC = () => (
  <section className="mb-48">
    <SectionHeader>Doctrine</SectionHeader>
    <Rule className="mb-16" />
    <div className="font-mono uppercase leading-[1.8] text-[13px] tracking-wide">
      {DOCTRINE_LINES.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
    <Rule className="mt-16" />
  </section>
)

// ── RATION LEDGER ────────────────────────────────────────────────────────────

const CADENCE_OPACITY: Record<string, string> = {
  MONTHLY:   'opacity-90',
  QUARTERLY: 'opacity-50',
  BIANNUAL:  'opacity-30',
}

function groupBySection(items: RationItem[]): Record<RationSection, RationItem[]> {
  const groups: Record<string, RationItem[]> = {}
  for (const item of items) {
    if (!groups[item.section]) groups[item.section] = []
    groups[item.section].push(item)
  }
  return groups as Record<RationSection, RationItem[]>
}

const LedgerRow: React.FC<{ item: RationItem; isLast: boolean }> = ({ item, isLast }) => (
  <div
    className={cn(
      'flex items-baseline gap-16 py-8 font-mono text-[13px] uppercase',
      !isLast && 'border-b border-acc/10'
    )}
  >
    <span className="w-24 flex-shrink-0 opacity-30 text-right tabular-nums">{item.id}</span>
    <span className="flex-1 tracking-wide leading-snug">{item.nomenclature}</span>
    <span className={cn('flex-shrink-0 text-[11px] tracking-widest', CADENCE_OPACITY[item.cadence])}>
      {item.cadence}
    </span>
  </div>
)

const RationLedger: React.FC = () => {
  const grouped = React.useMemo(() => groupBySection(MANIFEST), [])

  return (
    <section className="mb-48">
      <SectionHeader>
        Manifest — {RATION_ITEM_COUNT} items
      </SectionHeader>
      <Rule className="mb-0" />

      {/* Column headers */}
      <div className="flex items-baseline gap-16 py-8 font-mono text-[10px] uppercase tracking-widest opacity-30">
        <span className="w-24 flex-shrink-0 text-right">#</span>
        <span className="flex-1">Nomenclature</span>
        <span className="flex-shrink-0">Cadence</span>
      </div>
      <Rule className="mb-0" />

      {SECTIONS_ORDER.map((section, si) => {
        const items = grouped[section] ?? []
        return (
          <React.Fragment key={section}>
            {/* section divider */}
            {si > 0 && (
              <div className="flex items-baseline gap-16 py-8 font-mono text-[10px] uppercase tracking-widest opacity-20 border-b border-acc/10">
                <span className="w-24 flex-shrink-0" />
                <span className="flex-1">── {section}</span>
              </div>
            )}
            {si === 0 && (
              <div className="flex items-baseline gap-16 pt-4 pb-8 font-mono text-[10px] uppercase tracking-widest opacity-20">
                <span className="w-24 flex-shrink-0" />
                <span className="flex-1">── {section}</span>
              </div>
            )}
            {items.map((item, idx) => (
              <LedgerRow key={item.id} item={item} isLast={idx === items.length - 1 && si === SECTIONS_ORDER.length - 1} />
            ))}
          </React.Fragment>
        )
      })}

      <Rule className="mt-0" />
    </section>
  )
}

// ── PRICE LINE ───────────────────────────────────────────────────────────────

const PriceLine: React.FC = () => (
  <section className="mb-48">
    <SectionHeader>Price</SectionHeader>
    <Rule className="mb-16" />
    <div className="font-mono uppercase leading-[1.8] text-[13px] tracking-wide">
      <div>BASIC RATION — USD {RATION_PRICE_USD}.00 / MONTH</div>
      <div className="opacity-40">ADDITIVE TO USERSHIP AI PLAN. CANCEL ANYTIME.</div>
      <div className="opacity-40">COGS WITHHELD. LEDGER IS THE PRODUCT.</div>
    </div>
    <Rule className="mt-16" />
  </section>
)

// ── STATUS LINE ──────────────────────────────────────────────────────────────

const StatusLine: React.FC = () => (
  <section className="mb-16">
    <SectionHeader>Status</SectionHeader>
    <Rule className="mb-16" />
    <div className="font-mono uppercase leading-[1.8] text-[13px] tracking-wide">
      <div className="flex items-center gap-16">
        <span className="opacity-40">RATION</span>
        <span>OPEN.</span>
      </div>
      <div className="flex items-center gap-16">
        <span className="opacity-40">STRENGTH</span>
        <span className="opacity-40">NOT ON STRENGTH.</span>
      </div>
      <div className="flex items-center gap-16">
        <span className="opacity-40">UPGRADE</span>
        <span className="opacity-40">AVAILABLE — MONTH 2.</span>
      </div>
    </div>
    <Rule className="mt-16" />
  </section>
)

// ── BASICS PAGE ──────────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  return (
    <div className="pt-0">
      {/* Page header */}
      <div className="mb-48">
        <div className="flex items-baseline justify-between mb-8">
          <div className="font-mono font-bold uppercase tracking-widest text-[18px]">
            Basic Ration
          </div>
          <div className="font-mono uppercase text-[13px] opacity-40 tracking-widest">
            USD {RATION_PRICE_USD} / MO
          </div>
        </div>
        <div className="font-mono uppercase text-[11px] opacity-30 tracking-widest mb-16">
          LOT-FM-001 — RATION SUBSCRIPTION
        </div>
        <Rule />
      </div>

      <DoctrineBlock />
      <RationLedger />
      <PriceLine />
      <StatusLine />
    </div>
  )
}
