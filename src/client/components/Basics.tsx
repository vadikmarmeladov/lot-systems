/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 — BASIC (RATION) MODULE, MONTH 1: OPEN TAB.
 * Public, read-only ledger. No enrollment, no billing, no requisition —
 * those arrive Month 2 (UPGRADE + ROSTER) and Month 3 (ISSUE + FULFILLMENT).
 * House style: white ground / black ink, inversion-only hierarchy, 2px
 * rules, square corners, fixed character grid, IBM 3270 register.
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { cn } from '#client/utils'
import { UserTag } from '#shared/types'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  type RationItem,
  type RationCadence,
  type RationCategory,
} from './basics/doctrine'

const CATEGORY_ORDER: RationCategory[] = ['NUTRITION', 'HEALTH', 'HYGIENE', 'EQUIPMENT']

const LEDGER_GRID = '28px 1fr auto auto'

const HeavyRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t-2 border-acc w-full', className)} />
)

const ThinRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t border-acc/30 w-full', className)} />
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[11px] tracking-widest uppercase text-acc/50 py-8">
    {children}
  </div>
)

const cadenceClass = (cadence: RationCadence) =>
  cadence === 'MONTHLY' ? 'text-acc' : cadence === 'QUARTERLY' ? 'text-acc/60' : 'text-acc/40'

const LedgerRow: React.FC<{ item: RationItem; isLast: boolean }> = ({ item, isLast }) => (
  <div
    className={cn(
      'grid text-[12px] phone:text-[13px] py-[5px] gap-x-8',
      !isLast && 'border-b border-acc/10'
    )}
    style={{ gridTemplateColumns: LEDGER_GRID }}
  >
    <span className="text-acc/40 tabular-nums">{item.line}</span>
    <span className="text-acc uppercase tracking-wide leading-snug">{item.nomenclature}</span>
    <span className="text-acc/50 text-right whitespace-nowrap">{item.spec}</span>
    <span className={cn('text-right w-[80px] phone:w-[90px] text-[11px]', cadenceClass(item.cadence))}>
      {item.cadence}
    </span>
  </div>
)

const CategoryGroup: React.FC<{ category: RationCategory }> = ({ category }) => {
  const items = React.useMemo(
    () => RATION_MANIFEST.filter((i) => i.category === category),
    [category]
  )
  if (items.length === 0) return null
  return (
    <div className="mb-12">
      <div className="text-[10px] uppercase tracking-widest text-acc/30 pb-4">
        {category} ({items.length})
      </div>
      {items.map((item, idx) => (
        <LedgerRow key={item.line} item={item} isLast={idx === items.length - 1} />
      ))}
    </div>
  )
}

const StatusLine: React.FC<{ plan: string; ration: string }> = ({ plan, ration }) => (
  <div className="text-[12px] phone:text-[13px] flex flex-col gap-y-4">
    <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
      <span className="text-acc/50 uppercase tracking-wider">PLAN</span>
      <span className="text-acc uppercase">{plan}</span>
    </div>
    <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
      <span className="text-acc/50 uppercase tracking-wider">RATION</span>
      <span className="text-acc/60 uppercase">{ration}</span>
    </div>
  </div>
)

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isMirrorOn = useStore(stores.isMirrorOn)

  const isOnStrength = me?.tags?.includes('Basic') ?? false
  const isUsership = me?.tags?.includes(UserTag.Usership) ?? false

  const planLabel = isOnStrength ? 'BASIC / ON STRENGTH' : isUsership ? 'USERSHIP / AI' : 'NONE'
  const rationLabel = isOnStrength ? 'ACTIVE — NEXT ISSUE PENDING' : 'NOT ON STRENGTH'

  return (
    <div
      className={cn(
        'font-terminal font-bold min-h-[100dvh] flex flex-col',
        'px-16 phone:px-32 tablet:px-48 desktop:px-64',
        'pt-24 phone:pt-32 pb-[120px]',
        isMirrorOn && 'text-white'
      )}
    >
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-[13px] phone:text-[14px] uppercase tracking-[0.15em] text-acc">
          BASICS
        </h1>
        <span className="text-[11px] text-acc/40 tracking-widest">{MANUAL_REF}</span>
      </div>
      <HeavyRule className="mb-16" />

      {/* ── DOCTRINE + PRICE ───────────────────────────────────────── */}
      <div className="mb-16 flex flex-col gap-y-4">
        {DOCTRINE_LINES.map((line, i) => (
          <p key={i} className="text-[12px] phone:text-[13px] text-acc leading-snug">
            {line}
          </p>
        ))}
        <p className="text-[13px] phone:text-[15px] text-acc mt-8 tracking-wide">{PRICE_LINE}</p>
      </div>

      <ThinRule className="mb-16" />

      {/* ── SECTION 1 — RATION MANIFEST ────────────────────────────── */}
      <SectionLabel>SECTION 1 — RATION MANIFEST ({RATION_COUNT} ITEMS)</SectionLabel>

      <div
        className="grid text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
        style={{ gridTemplateColumns: LEDGER_GRID }}
      >
        <span>NO.</span>
        <span>NOMENCLATURE</span>
        <span className="text-right">SPEC</span>
        <span className="text-right w-[80px] phone:w-[90px]">CADENCE</span>
      </div>

      {CATEGORY_ORDER.map((category) => (
        <CategoryGroup key={category} category={category} />
      ))}

      <ThinRule className="mb-16 mt-8" />

      {/* ── SECTION 2 — STATUS ─────────────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16">
        <StatusLine plan={planLabel} ration={rationLabel} />
      </div>

      {/* ── UPGRADE PATH — control ships Month 2 ───────────────────── */}
      {!isOnStrength && (
        <div className="mt-4 border-2 border-acc/20 p-16 flex flex-col gap-y-8 text-[12px]">
          <div className="text-acc/50 uppercase tracking-widest text-[10px]">
            UPGRADE PATH — USERSHIP → BASIC
          </div>
          <div className="text-acc leading-snug">
            {isUsership
              ? 'USERSHIP AI confirmed. BASIC ration available as additive layer (+USD 100.00/MO).'
              : 'Requires USERSHIP / AI plan as base layer.'}
          </div>
          <div className="text-acc/40 text-[11px] mt-4">ENROLLMENT OPENS — M2 BUILD CYCLE</div>
        </div>
      )}
    </div>
  )
}
