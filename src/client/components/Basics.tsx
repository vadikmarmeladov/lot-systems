/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE
 * OPEN TAB — PUBLIC SURFACE
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
  BUILD_CYCLE,
  type RationItem,
  type RationCadence,
  type RationCategory,
  type BuildCyclePhase,
} from './basics/doctrine'

// ─── terminal primitives ──────────────────────────────────────────────────────

const HeavyRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t-2 border-acc w-full', className)} />
)

const ThinRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t border-acc/20 w-full', className)} />
)

const SectionLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'font-mono text-[10px] tracking-[0.2em] uppercase text-acc/40 py-8',
      className
    )}
  >
    {children}
  </div>
)

// ─── ledger sub-components ────────────────────────────────────────────────────

const CADENCE_STYLE: Record<RationCadence, string> = {
  MONTHLY: 'text-acc',
  QUARTERLY: 'text-acc/50',
  ANNUALLY: 'text-acc/30',
}

const CategoryGroup: React.FC<{
  category: RationCategory
  items: RationItem[]
}> = ({ category, items }) => (
  <div className="mb-10">
    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-acc/30 pb-4">
      {category} ({items.length})
    </div>
    {items.map((item, idx) => (
      <div
        key={item.line}
        className={cn(
          'grid font-mono text-[12px] phone:text-[13px] py-[5px] gap-x-8',
          idx < items.length - 1 && 'border-b border-acc/10'
        )}
        style={{ gridTemplateColumns: '28px 1fr auto 90px' }}
      >
        <span className="text-acc/30 tabular-nums">{item.line}</span>
        <span className="text-acc uppercase tracking-wide leading-snug">{item.nomenclature}</span>
        <span className="text-acc/50 text-right whitespace-nowrap tabular-nums">{item.spec}</span>
        <span className={cn('text-right font-mono text-[11px]', CADENCE_STYLE[item.cadence])}>
          {item.cadence}
        </span>
      </div>
    ))}
  </div>
)

// ─── status line ──────────────────────────────────────────────────────────────

const StatusRow: React.FC<{ label: string; value: string; dim?: boolean }> = ({
  label,
  value,
  dim,
}) => (
  <div
    className="grid font-mono text-[12px] phone:text-[13px] gap-x-16 py-[3px]"
    style={{ gridTemplateColumns: '130px 1fr' }}
  >
    <span className="text-acc/40 uppercase tracking-wider">{label}</span>
    <span className={cn('text-acc uppercase', dim && 'text-acc/50')}>{value}</span>
  </div>
)

// ─── build cycle footer ───────────────────────────────────────────────────────

const BuildPhase: React.FC<{ phase: BuildCyclePhase }> = ({ phase }) => {
  const statusGlyph =
    phase.status === 'COMPLETE' ? '■' : phase.status === 'ACTIVE' ? '▶' : '□'
  const statusColor =
    phase.status === 'COMPLETE'
      ? 'text-acc'
      : phase.status === 'ACTIVE'
      ? 'text-acc'
      : 'text-acc/30'

  return (
    <div className="flex gap-x-8 font-mono text-[11px] py-[3px]">
      <span className={cn('w-[12px] flex-shrink-0', statusColor)}>{statusGlyph}</span>
      <span className={cn('text-acc/40 tabular-nums w-[24px] flex-shrink-0')}>M{phase.month}</span>
      <span className={cn('uppercase tracking-wide', statusColor)}>{phase.label}</span>
      <span className="text-acc/25 hidden phone:block ml-4">— {phase.exit}</span>
    </div>
  )
}

// ─── upgrade prompt (M2 scaffold) ─────────────────────────────────────────────

const UpgradePrompt: React.FC<{ isUsership: boolean }> = ({ isUsership }) => (
  <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-8">
    <div className="text-acc/40 uppercase tracking-[0.2em] text-[10px]">
      UPGRADE PATH — USERSHIP → BASIC
    </div>
    <ThinRule />
    <div className="text-acc leading-snug mt-4">
      {isUsership
        ? 'USERSHIP AI confirmed. BASIC ration available as additive layer (+USD 100.00/MO).'
        : 'Requires USERSHIP / AI plan as base layer. Enroll in Usership first.'}
    </div>
    {isUsership && (
      <div className="flex items-center gap-x-8 mt-4">
        <div className="border border-acc/20 px-12 py-6 text-acc/40 uppercase tracking-widest text-[10px]">
          ENROLL — OPENS M2
        </div>
        <span className="text-acc/30 text-[11px]">State machine wired Month 2</span>
      </div>
    )}
    {!isUsership && (
      <div className="text-acc/30 text-[11px] mt-4">
        ENROLLMENT GATED — M2 BUILD CYCLE
      </div>
    )}
  </div>
)

// ─── main component ───────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isMirrorOn = useStore(stores.isMirrorOn)

  const isOnStrength = me?.tags?.includes('Basic') ?? false
  const isUsership = me?.tags?.includes(UserTag.Usership) ?? false

  const planLabel = isOnStrength
    ? 'BASIC / ON STRENGTH'
    : isUsership
    ? 'USERSHIP / AI'
    : 'NONE'

  const rationStatus = isOnStrength ? 'ACTIVE — NEXT ISSUE PENDING' : 'NOT ON STRENGTH'

  const byCategory = (cat: RationCategory) => RATION_MANIFEST.filter((i) => i.category === cat)

  return (
    <div
      className={cn(
        'min-h-[100dvh] flex flex-col',
        'px-16 phone:px-32 tablet:px-48 desktop:px-64',
        'pt-24 phone:pt-32 pb-[140px]',
        isMirrorOn && 'text-white'
      )}
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="font-mono text-[13px] phone:text-[14px] uppercase tracking-[0.15em] text-acc font-bold">
          BASICS
        </h1>
        <span className="font-mono text-[11px] text-acc/35 tracking-widest">{MANUAL_REF}</span>
      </div>
      <HeavyRule className="mb-16" />

      {/* ── DOCTRINE ───────────────────────────────────────────── */}
      <div className="mb-12 flex flex-col gap-y-4">
        {DOCTRINE_LINES.map((line, i) => (
          <p key={i} className="font-mono text-[12px] phone:text-[13px] text-acc leading-snug">
            {line}
          </p>
        ))}
      </div>

      <div className="flex items-baseline justify-between mb-16">
        <p className="font-mono text-[14px] phone:text-[16px] text-acc font-bold tracking-wide">
          {PRICE_LINE}
        </p>
        <span className="font-mono text-[10px] text-acc/30 tracking-widest">≥60% MARGIN</span>
      </div>

      <ThinRule className="mb-16" />

      {/* ── MANIFEST LEDGER ────────────────────────────────────── */}
      <SectionLabel>SECTION 1 — RATION MANIFEST ({RATION_COUNT} ITEMS)</SectionLabel>

      {/* Column headers */}
      <div
        className="grid font-mono text-[10px] uppercase tracking-[0.15em] text-acc/35 pb-6 border-b-2 border-acc/20 mb-8 gap-x-8"
        style={{ gridTemplateColumns: '28px 1fr auto 90px' }}
      >
        <span>NO.</span>
        <span>NOMENCLATURE</span>
        <span className="text-right">SPEC</span>
        <span className="text-right">CADENCE</span>
      </div>

      <CategoryGroup category="NUTRITION" items={byCategory('NUTRITION')} />
      <CategoryGroup category="HEALTH" items={byCategory('HEALTH')} />
      <CategoryGroup category="HYGIENE" items={byCategory('HYGIENE')} />
      <CategoryGroup category="EQUIPMENT" items={byCategory('EQUIPMENT')} />

      <ThinRule className="mb-16 mt-4" />

      {/* ── STATUS LINE ────────────────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16">
        <StatusRow label="PLAN" value={planLabel} />
        <StatusRow label="RATION" value={rationStatus} dim={!isOnStrength} />
        <StatusRow label="NEXT ISSUE" value={isOnStrength ? 'TBD — M3 ENGINE' : '—'} dim />
        <StatusRow label="PRICE" value={PRICE_LINE} />
      </div>

      <ThinRule className="mb-16" />

      {/* ── UPGRADE PROMPT ─────────────────────────────────────── */}
      {!isOnStrength && (
        <>
          <SectionLabel>SECTION 3 — UPGRADE PATH</SectionLabel>
          <div className="mb-16">
            <UpgradePrompt isUsership={isUsership} />
          </div>
          <ThinRule className="mb-16" />
        </>
      )}

      {/* ── BUILD CYCLE ────────────────────────────────────────── */}
      <SectionLabel>BUILD CYCLE — LOT-FM-001 / 90 DAY</SectionLabel>
      <div className="mb-4 flex flex-col">
        {BUILD_CYCLE.map((phase) => (
          <BuildPhase key={phase.month} phase={phase} />
        ))}
      </div>
    </div>
  )
}
