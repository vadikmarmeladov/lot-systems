/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE
 * Shared read-only ledger + doctrine surface.
 * Rendered by both the public OPEN TAB and the in-app Basics tab —
 * the ledger is the marketing, so it must read identically everywhere.
 */

import * as React from 'react'
import { cn } from '#client/utils'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  type RationItem,
  type RationCadence,
  type RationCategory,
} from '#shared/constants/basics-doctrine'

export const HeavyRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t-2 border-acc w-full', className)} />
)

export const ThinRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t border-acc/30 w-full', className)} />
)

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="font-mono text-[11px] tracking-widest uppercase text-acc/50 py-8">
    {children}
  </div>
)

const cadenceClass = (cadence: RationCadence) =>
  cadence === 'MONTHLY' ? 'text-acc' : cadence === 'QUARTERLY' ? 'text-acc/60' : 'text-acc/40'

const LedgerRow: React.FC<{ item: RationItem; isLast: boolean }> = ({ item, isLast }) => (
  <div
    className={cn(
      'grid font-mono text-[12px] phone:text-[13px] py-[5px] gap-x-8',
      !isLast && 'border-b border-acc/10'
    )}
    style={{ gridTemplateColumns: '28px 1fr auto auto' }}
  >
    <span className="text-acc/40 tabular-nums">{item.line}</span>
    <span className="text-acc uppercase tracking-wide leading-snug">{item.nomenclature}</span>
    <span className="text-acc/50 text-right whitespace-nowrap">{item.spec}</span>
    <span className={cn('text-right w-[80px] phone:w-[90px] font-mono text-[11px]', cadenceClass(item.cadence))}>
      {item.cadence}
    </span>
  </div>
)

const CATEGORIES: RationCategory[] = ['NUTRITION', 'HEALTH', 'HYGIENE', 'EQUIPMENT']

export const RationLedger: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <SectionLabel>SECTION 1 — RATION MANIFEST ({RATION_COUNT} ITEMS)</SectionLabel>
    <div
      className="grid font-mono text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
      style={{ gridTemplateColumns: '28px 1fr auto auto' }}
    >
      <span>NO.</span>
      <span>NOMENCLATURE</span>
      <span className="text-right">SPEC</span>
      <span className="text-right w-[80px] phone:w-[90px]">CADENCE</span>
    </div>
    {CATEGORIES.map((category) => {
      const items = RATION_MANIFEST.filter((i) => i.category === category)
      if (items.length === 0) return null
      return (
        <div key={category} className="mb-12 last:mb-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
            {category} ({items.length})
          </div>
          {items.map((item, idx, arr) => (
            <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
          ))}
        </div>
      )
    })}
  </div>
)

export const DoctrineBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex flex-col gap-y-4', className)}>
    {DOCTRINE_LINES.map((line, i) => (
      <p key={i} className="font-mono text-[12px] phone:text-[13px] text-acc leading-snug">
        {line}
      </p>
    ))}
    <p className="font-mono text-[13px] phone:text-[15px] text-acc font-bold mt-8 tracking-wide">
      {PRICE_LINE}
    </p>
  </div>
)

export const BasicsHeader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <div className="flex items-baseline justify-between mb-2">
      <h1 className="font-mono text-[13px] phone:text-[14px] uppercase tracking-[0.15em] text-acc font-bold">
        BASICS
      </h1>
      <span className="font-mono text-[11px] text-acc/40 tracking-widest">{MANUAL_REF}</span>
    </div>
    <HeavyRule />
  </div>
)
