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
import { goTo } from '#client/stores/router'
import { cn } from '#client/utils'
import { UserTag } from '#shared/types'
import { useEnrollBasics, useStandDownBasics, getMe } from '#client/queries'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  BASICS_STATE_LABEL,
  type RationItem,
  type RationCadence,
  type BasicsRoster,
} from './basics/doctrine'

// ─── terminal grid sub-components ─────────────────────────────────────────────

const HeavyRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t-2 border-acc w-full', className)} />
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
  const cls =
    cadence === 'MONTHLY' ? 'text-acc' : cadence === 'QUARTERLY' ? 'text-acc/60' : 'text-acc/40'
  return <span className={cn('font-mono text-[11px]', cls)}>{cadence}</span>
}

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

// ─── main component ───────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isMirrorOn = useStore(stores.isMirrorOn)

  const isUsership = me?.tags?.includes(UserTag.Usership) ?? false
  const isOnStrength = me?.tags?.includes(UserTag.Basic) ?? false
  const roster = (me?.metadata as any)?.basics as BasicsRoster | undefined

  const [operators, setOperators] = React.useState(1)
  const [cadenceDay, setCadenceDay] = React.useState(1)
  const [formError, setFormError] = React.useState<string | null>(null)

  const enroll = useEnrollBasics()
  const standDown = useStandDownBasics()

  const refreshMe = React.useCallback(() => {
    getMe().then((user) => stores.me.set(user)).catch(() => {})
  }, [])

  const handleEnroll = () => {
    setFormError(null)
    enroll.mutate(
      { operators, cadenceDay },
      {
        onSuccess: refreshMe,
        onError: (err) =>
          setFormError((err.response?.data as any)?.message || 'ENROLLMENT REJECTED'),
      }
    )
  }

  const handleStandDown = () => {
    setFormError(null)
    standDown.mutate(undefined, {
      onSuccess: refreshMe,
      onError: (err) =>
        setFormError((err.response?.data as any)?.message || 'STAND DOWN REJECTED'),
    })
  }

  const planLabel = isOnStrength ? 'BASIC / ON STRENGTH' : isUsership ? 'USERSHIP / AI' : 'NONE'
  const rationStatus = roster?.state
    ? BASICS_STATE_LABEL[roster.state]
    : BASICS_STATE_LABEL.NONE
  const hasShipTo = !!(me?.address && me?.city && me?.country)

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
        <span className="font-mono text-[11px] text-acc/40 tracking-widest">{MANUAL_REF}</span>
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

      <LedgerCategory category="NUTRITION" />
      <LedgerCategory category="HEALTH" />
      <LedgerCategory category="HYGIENE" />
      <LedgerCategory category="EQUIPMENT" />

      <ThinRule className="mb-16 mt-8" />

      {/* ── STATUS LINE ───────────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16 font-mono text-[12px] phone:text-[13px] flex flex-col gap-y-4">
        <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
          <span className="text-acc/50 uppercase tracking-wider">PLAN</span>
          <span className="text-acc uppercase">{planLabel}</span>
        </div>
        <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
          <span className="text-acc/50 uppercase tracking-wider">RATION</span>
          <span className="text-acc/60 uppercase">{rationStatus}</span>
        </div>
        {roster?.state === 'ON_STRENGTH' || roster?.state === 'STEADY_STATE' ? (
          <>
            <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
              <span className="text-acc/50 uppercase tracking-wider">OPERATORS</span>
              <span className="text-acc/60 uppercase">{roster.operators}</span>
            </div>
            <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
              <span className="text-acc/50 uppercase tracking-wider">CADENCE</span>
              <span className="text-acc/60 uppercase">DAY {roster.cadenceDay} OF MONTH</span>
            </div>
          </>
        ) : null}
      </div>

      <ThinRule className="mb-16" />

      {/* ── SECTION 3 — UPGRADE / STAND DOWN ──────────────── */}
      <SectionLabel>SECTION 3 — UPGRADE</SectionLabel>

      <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-8">
        {!isUsership && (
          <div className="text-acc/50 uppercase tracking-widest text-[11px]">
            REQUIRES USERSHIP / AI AS BASE LAYER.
          </div>
        )}

        {isUsership && !isOnStrength && (
          <>
            <div className="text-acc/50 uppercase tracking-widest text-[10px]">
              UPGRADE PATH — USERSHIP → BASIC
            </div>
            <div className="text-acc leading-snug">
              USERSHIP AI confirmed. BASIC ration available as additive layer (+{PRICE_LINE}).
            </div>
            {!hasShipTo ? (
              <div className="flex flex-col gap-y-8">
                <div className="text-acc/60 text-[11px]">
                  SHIP-TO ADDRESS ON FILE REQUIRED BEFORE ENLISTMENT.
                </div>
                <button
                  onClick={() => goTo('settings')}
                  className="font-mono text-[11px] uppercase tracking-widest border-2 border-acc px-16 py-8 self-start hover:bg-acc hover:text-bac"
                >
                  COMPLETE SETTINGS
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-y-12 mt-4">
                <div className="grid gap-x-16 items-center" style={{ gridTemplateColumns: '160px 1fr' }}>
                  <label className="text-acc/50 uppercase tracking-wider text-[11px]">
                    OPERATORS ON STRENGTH
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={operators}
                    onChange={(e) => setOperators(Number(e.target.value) || 1)}
                    className="bg-transparent border-2 border-acc/30 px-8 py-4 font-mono text-acc w-[80px]"
                  />
                </div>
                <div className="grid gap-x-16 items-center" style={{ gridTemplateColumns: '160px 1fr' }}>
                  <label className="text-acc/50 uppercase tracking-wider text-[11px]">
                    CADENCE START (DAY OF MONTH)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={28}
                    value={cadenceDay}
                    onChange={(e) => setCadenceDay(Number(e.target.value) || 1)}
                    className="bg-transparent border-2 border-acc/30 px-8 py-4 font-mono text-acc w-[80px]"
                  />
                </div>
                {formError && (
                  <div className="text-acc/70 text-[11px] uppercase">{formError}</div>
                )}
                <button
                  onClick={handleEnroll}
                  disabled={enroll.isLoading}
                  className="font-mono text-[11px] uppercase tracking-widest border-2 border-acc bg-acc text-bac px-16 py-8 self-start disabled:opacity-40"
                >
                  {enroll.isLoading ? 'ENLISTING…' : 'ENLIST — GO ON STRENGTH'}
                </button>
              </div>
            )}
          </>
        )}

        {isOnStrength && (
          <>
            <div className="text-acc/50 uppercase tracking-widest text-[10px]">
              ON STRENGTH — RATION ACTIVE
            </div>
            <div className="text-acc leading-snug">
              BASIC ration is live. NEXT ISSUE arrives on the roster cadence day.
              STAND DOWN drops the ration and retains USERSHIP / AI.
            </div>
            {formError && <div className="text-acc/70 text-[11px] uppercase">{formError}</div>}
            <button
              onClick={handleStandDown}
              disabled={standDown.isLoading}
              className="font-mono text-[11px] uppercase tracking-widest border-2 border-acc/40 px-16 py-8 self-start hover:border-acc disabled:opacity-40"
            >
              {standDown.isLoading ? 'STANDING DOWN…' : 'STAND DOWN'}
            </button>
          </>
        )}
      </div>

      {/* ── SECTION 4 — ISSUE LOG ──────────────────────────── */}
      {roster?.issueLog && roster.issueLog.length > 0 && (
        <>
          <SectionLabel>SECTION 4 — ISSUE LOG</SectionLabel>
          <div className="font-mono text-[11px] flex flex-col gap-y-4 mb-16">
            {[...roster.issueLog].reverse().map((entry, i) => (
              <div key={i} className="grid gap-x-16" style={{ gridTemplateColumns: '180px 1fr' }}>
                <span className="text-acc/40 tabular-nums">{entry.at}</span>
                <span className="text-acc/70 uppercase">{entry.event}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
