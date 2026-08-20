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
import { Button, Select } from '#client/components/ui'
import { getMe, useEnrollBasics, useStandDownBasics } from '#client/queries'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  type RationCadence,
} from './basics/doctrine'
import {
  SIZING_OPTIONS,
  STATUS_LABEL,
  type BasicsRecord,
  type BasicsSizing,
} from './basics/state'

// ─── terminal grid constants ──────────────────────────────────────────────────

const HeavyRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('text-acc tracking-[0] leading-none select-none overflow-hidden', className)}>
    <div className="border-t-2 border-acc w-full" />
  </div>
)

const ThinRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t border-acc/30 w-full', className)} />
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="font-mono text-[11px] tracking-widest uppercase text-acc/50 py-8">
    {children}
  </div>
)

const cadenceBadge = (cadence: RationCadence) => {
  const cls = cadence === 'MONTHLY'
    ? 'text-acc'
    : cadence === 'QUARTERLY'
    ? 'text-acc/60'
    : 'text-acc/40'
  return <span className={cn('font-mono text-[11px]', cls)}>{cadence}</span>
}

const LedgerRow: React.FC<{ item: (typeof RATION_MANIFEST)[number]; isLast: boolean }> = ({ item, isLast }) => (
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
    <span className="text-right w-[80px] phone:w-[90px]">{cadenceBadge(item.cadence)}</span>
  </div>
)

const StatusLine: React.FC<{ rows: [string, string][] }> = ({ rows }) => (
  <div className="font-mono text-[12px] phone:text-[13px] flex flex-col gap-y-4">
    {rows.map(([label, value]) => (
      <div key={label} className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
        <span className="text-acc/50 uppercase tracking-wider">{label}</span>
        <span className="text-acc/80 uppercase">{value}</span>
      </div>
    ))}
  </div>
)

const Frame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-8', className)}>
    {children}
  </div>
)

// ─── M2 — enrollment intake ───────────────────────────────────────────────────

const EnrollForm: React.FC<{ canShip: boolean }> = ({ canShip }) => {
  const [sizing, setSizing] = React.useState<BasicsSizing>('M')
  const { mutate: enroll, isLoading } = useEnrollBasics({
    onSuccess: () => {
      getMe().then((user) => stores.me.set(user)).catch(() => {})
    },
  })

  return (
    <Frame>
      <div className="text-acc/50 uppercase tracking-widest text-[10px]">
        ENROLLMENT — GO ON STRENGTH (+USD 100.00/MO)
      </div>
      {!canShip && (
        <div className="text-acc/60 leading-snug">
          SHIPPING ADDRESS AND PHONE REQUIRED. COMPLETE SETTINGS FIRST.
        </div>
      )}
      <div className="grid gap-x-16 items-center" style={{ gridTemplateColumns: '120px 1fr' }}>
        <span className="text-acc/50 uppercase tracking-wider">SIZING</span>
        <Select
          value={sizing}
          onChange={(v) => setSizing(v as BasicsSizing)}
          options={SIZING_OPTIONS.map((s) => ({ label: s, value: s }))}
          disabled={!canShip || isLoading}
        />
      </div>
      <Button
        kind="primary"
        disabled={!canShip || isLoading}
        onClick={() => enroll({ sizing })}
      >
        ENROLL
      </Button>
    </Frame>
  )
}

const StandDownControl: React.FC = () => {
  const { mutate: standDown, isLoading } = useStandDownBasics({
    onSuccess: () => {
      getMe().then((user) => stores.me.set(user)).catch(() => {})
    },
  })
  return (
    <Button kind="secondary" disabled={isLoading} onClick={() => standDown()}>
      STAND DOWN
    </Button>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isMirrorOn = useStore(stores.isMirrorOn)

  const isUsership = (me?.tags ?? []).some((t) => t.toLowerCase() === 'usership')
  const isOnStrength = (me?.tags ?? []).some((t) => t.toLowerCase() === 'basic')
  const basics = (me?.metadata?.basics ?? null) as BasicsRecord | null
  const status = basics?.status ?? null
  const canShip = Boolean(me?.address && me?.phone)

  const planLabel = isOnStrength
    ? 'BASIC / ON STRENGTH'
    : isUsership
    ? 'USERSHIP / AI'
    : 'NONE'

  return (
    <div
      className={cn(
        'min-h-[100dvh] flex flex-col',
        'px-16 phone:px-32 tablet:px-48 desktop:px-64',
        'pt-24 phone:pt-32 pb-[120px]',
        isMirrorOn && 'text-white'
      )}
    >
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="font-mono text-[13px] phone:text-[14px] uppercase tracking-[0.15em] text-acc font-bold">
          BASICS
        </h1>
        <span className="font-mono text-[11px] text-acc/40 tracking-widest">
          {MANUAL_REF}
        </span>
      </div>
      <HeavyRule className="mb-16" />

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

      <ThinRule className="mb-16" />

      {/* ── MANIFEST LEDGER ───────────────────────────────── */}
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

      {(['NUTRITION', 'HEALTH', 'HYGIENE', 'EQUIPMENT'] as const).map((cat) => (
        <div key={cat} className="mb-12">
          <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
            {cat} ({RATION_MANIFEST.filter((i) => i.category === cat).length})
          </div>
          {RATION_MANIFEST.filter((i) => i.category === cat).map((item, idx, arr) => (
            <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
          ))}
        </div>
      ))}

      <ThinRule className="mb-16 mt-8" />

      {/* ── STATUS LINE ───────────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16">
        <StatusLine
          rows={[
            ['PLAN', planLabel],
            ['RATION', status ? STATUS_LABEL[status] : 'NOT ON STRENGTH'],
            ...(status && status !== 'STAND_DOWN' && basics
              ? ([['NEXT ISSUE', basics.cadenceStart]] as [string, string][])
              : []),
          ]}
        />
      </div>

      {/* ── SECTION 3 — UPGRADE / ROSTER ──────────────────── */}
      <SectionLabel>SECTION 3 — UPGRADE</SectionLabel>
      <div className="mb-16">
        {!isUsership && (
          <Frame>
            <div className="text-acc/50 uppercase tracking-widest text-[10px]">
              UPGRADE PATH — USERSHIP → BASIC
            </div>
            <div className="text-acc leading-snug">
              REQUIRES USERSHIP / AI PLAN AS BASE LAYER.
            </div>
          </Frame>
        )}

        {isUsership && (status === null || status === 'STAND_DOWN') && (
          <EnrollForm canShip={canShip} />
        )}

        {isUsership && status === 'PENDING' && (
          <Frame>
            <div className="text-acc leading-snug">
              ENROLLMENT RECEIVED. AWAITING QUARTERMASTER CONFIRMATION.
            </div>
            <div className="text-acc/40 text-[11px]">
              SIZING: {basics?.sizing} · FIRST ISSUE: {basics?.cadenceStart}
            </div>
            <StandDownControl />
          </Frame>
        )}

        {isUsership && (status === 'ON_STRENGTH' || status === 'STEADY_STATE') && (
          <Frame>
            <div className="text-acc leading-snug">
              {STATUS_LABEL[status]}
            </div>
            <div className="text-acc/40 text-[11px]">
              SIZING: {basics?.sizing} · NEXT ISSUE: {basics?.cadenceStart}
            </div>
            <SectionLabel>ISSUE LOG</SectionLabel>
            {basics && basics.issueLog.length > 0 ? (
              basics.issueLog.map((entry) => (
                <div key={entry.cycle} className="grid gap-x-16 text-[11px]" style={{ gridTemplateColumns: '80px 1fr' }}>
                  <span className="text-acc/50">{entry.cycle}</span>
                  <span className="text-acc/70">{entry.status}</span>
                </div>
              ))
            ) : (
              <div className="text-acc/30 text-[11px]">NO ISSUES RECORDED</div>
            )}
            <StandDownControl />
          </Frame>
        )}
      </div>
    </div>
  )
}
