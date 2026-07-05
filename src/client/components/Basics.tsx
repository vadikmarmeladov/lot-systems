/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE — 90-DAY BUILD
 * Month 1: OPEN TAB ledger + doctrine (read-only, public register)
 * Month 2: UPGRADE control + roster intake state machine
 * Month 3: issue load engine + issue log + printed manifest card
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { goTo } from '#client/stores/router'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import { UserTag, type BasicsState } from '#shared/types'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  type RationItem,
  type RationCadence,
} from '#shared/constants/basics'
import {
  useBasicsRoster,
  useBasicsConfirm,
  useBasicsStandDown,
} from '#client/queries'
import { RosterForm } from './basics/RosterForm'
import { ManifestPrint, printManifest } from './basics/ManifestPrint'

// ─── terminal grid primitives ─────────────────────────────────────────────────

const HeavyRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('select-none', className)}>
    <div className="border-t-2 border-acc w-full" />
  </div>
)

const ThinRule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('border-t border-acc/30 w-full', className)} />
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[11px] tracking-widest uppercase text-acc/50 py-8">
    {children}
  </div>
)

const cadenceBadge = (cadence: RationCadence) => {
  const cls =
    cadence === 'MONTHLY' ? 'text-acc' : cadence === 'QUARTERLY' ? 'text-acc/60' : 'text-acc/40'
  return <span className={cn('text-[11px]', cls)}>{cadence}</span>
}

const LedgerRow: React.FC<{ item: RationItem; isLast: boolean; highlighted: boolean }> = ({
  item,
  isLast,
  highlighted,
}) => (
  <div
    className={cn(
      'grid text-[12px] phone:text-[13px] py-[5px] gap-x-8',
      !isLast && 'border-b border-acc/10',
      highlighted && 'bg-acc/5'
    )}
    style={{ gridTemplateColumns: '28px 1fr auto auto' }}
  >
    <span className="text-acc/40 tabular-nums">{item.line}</span>
    <span className="text-acc uppercase tracking-wide leading-snug">{item.nomenclature}</span>
    <span className="text-acc/50 text-right whitespace-nowrap">{item.spec}</span>
    <span className="text-right w-[80px] phone:w-[90px]">{cadenceBadge(item.cadence)}</span>
  </div>
)

const CATEGORIES: RationItem['category'][] = ['NUTRITION', 'HEALTH', 'HYGIENE', 'EQUIPMENT']

// ─── main component ───────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isMirrorOn = useStore(stores.isMirrorOn)
  const [shippingNotes, setShippingNotes] = React.useState('')

  const isUsership = me?.tags?.some((t) => t.toLowerCase() === UserTag.Usership.toLowerCase()) ?? false
  const isOnStrength = me?.tags?.some((t) => t.toLowerCase() === 'basic') ?? false
  const basics: BasicsState | undefined = me?.metadata?.basics

  const { mutate: submitRoster, isLoading: rosterSubmitting } = useBasicsRoster({
    onSuccess: (updated) => stores.me.set(updated),
  })
  const { mutate: confirmEnrollment, isLoading: confirming } = useBasicsConfirm({
    onSuccess: (updated) => stores.me.set(updated),
  })
  const { mutate: standDown, isLoading: standingDown } = useBasicsStandDown({
    onSuccess: (updated) => stores.me.set(updated),
  })

  const planLabel = isOnStrength
    ? (basics?.issueCount ?? 0) >= 1
      ? 'BASIC / STEADY STATE'
      : 'BASIC / ON STRENGTH'
    : basics?.status === 'PENDING'
    ? 'BASIC / PENDING'
    : isUsership
    ? 'USERSHIP / AI'
    : 'NONE'

  const currentIssue = basics?.issueLog?.find((e) => e.status === 'SCHEDULED')
  const rationStatus = isOnStrength
    ? currentIssue
      ? `ACTIVE — NEXT ISSUE ${dayjs(currentIssue.scheduledAt).format('YYYY-MM-DD')}`
      : 'ACTIVE — NEXT ISSUE PENDING'
    : basics?.status === 'PENDING'
    ? 'ROSTER INTAKE SUBMITTED — AWAITING CONFIRMATION'
    : basics?.status === 'STAND_DOWN'
    ? `STOOD DOWN ${basics.standDownAt ? dayjs(basics.standDownAt).format('YYYY-MM-DD') : ''}`
    : 'NOT ON STRENGTH'

  const operatorName = [me?.firstName, me?.lastName].filter(Boolean).join(' ')

  return (
    <div
      className={cn(
        'lot-basics-terminal min-h-[100dvh] flex flex-col',
        'px-16 phone:px-32 tablet:px-48 desktop:px-64',
        'pt-24 phone:pt-32 pb-[120px]',
        isMirrorOn && 'text-white'
      )}
    >
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-[13px] phone:text-[14px] uppercase tracking-[0.15em] text-acc font-bold">
          BASICS
        </h1>
        <span className="text-[11px] text-acc/40 tracking-widest">{MANUAL_REF}</span>
      </div>
      <HeavyRule className="mb-16" />

      {/* ── DOCTRINE + PRICE ──────────────────────────────── */}
      <div className="mb-16 flex flex-col gap-y-4">
        {DOCTRINE_LINES.map((line, i) => (
          <p key={i} className="text-[12px] phone:text-[13px] text-acc leading-snug">
            {line}
          </p>
        ))}
        <p className="text-[13px] phone:text-[15px] text-acc font-bold mt-8 tracking-wide">
          {PRICE_LINE}
        </p>
      </div>

      <ThinRule className="mb-16" />

      {/* ── SECTION 1 — MANIFEST LEDGER ───────────────────── */}
      <SectionLabel>SECTION 1 — RATION MANIFEST ({RATION_COUNT} ITEMS)</SectionLabel>

      <div
        className="grid text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
        style={{ gridTemplateColumns: '28px 1fr auto auto' }}
      >
        <span>NO.</span>
        <span>NOMENCLATURE</span>
        <span className="text-right">SPEC</span>
        <span className="text-right w-[80px] phone:w-[90px]">CADENCE</span>
      </div>

      {CATEGORIES.map((category) => {
        const items = RATION_MANIFEST.filter((i) => i.category === category)
        return (
          <div key={category} className="mb-12">
            <div className="text-[10px] uppercase tracking-widest text-acc/30 pb-4">
              {category} ({items.length})
            </div>
            {items.map((item, idx) => (
              <LedgerRow
                key={item.line}
                item={item}
                isLast={idx === items.length - 1}
                highlighted={!!currentIssue?.itemLines.includes(item.line)}
              />
            ))}
          </div>
        )
      })}

      <ThinRule className="mb-16 mt-4" />

      {/* ── SECTION 2 — STATUS ────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16 text-[12px] phone:text-[13px] flex flex-col gap-y-4">
        <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
          <span className="text-acc/50 uppercase tracking-wider">PLAN</span>
          <span className="text-acc uppercase">{planLabel}</span>
        </div>
        <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
          <span className="text-acc/50 uppercase tracking-wider">RATION</span>
          <span className="text-acc/60 uppercase">{rationStatus}</span>
        </div>
      </div>

      <ThinRule className="mb-16" />

      {/* ── SECTION 3 — UPGRADE / ROSTER (Month 2) ────────── */}
      <SectionLabel>SECTION 3 — UPGRADE</SectionLabel>
      <div className="mb-16">
        {!isUsership && (
          <div className="border-2 border-acc/20 p-16 text-[12px] flex flex-col gap-y-8">
            <div className="text-acc/50 uppercase tracking-widest text-[10px]">
              UPGRADE PATH — USERSHIP → BASIC
            </div>
            <div className="text-acc leading-snug">
              Requires USERSHIP / AI plan as base layer.
            </div>
          </div>
        )}

        {isUsership && !isOnStrength && basics?.status !== 'PENDING' && (
          <RosterForm
            address={me?.address ?? null}
            city={me?.city ?? null}
            country={me?.country ?? null}
            phone={me?.phone ?? null}
            shippingNotes={shippingNotes}
            onShippingNotesChange={setShippingNotes}
            onGoToSettings={() => goTo('settings')}
            onSubmit={() => submitRoster({ shippingNotes })}
            isSubmitting={rosterSubmitting}
          />
        )}

        {isUsership && !isOnStrength && basics?.status === 'PENDING' && (
          <div className="flex flex-col gap-y-8 text-[12px]">
            <div className="text-acc/60">
              ROSTER INTAKE ON FILE
              {basics.shippingNotes ? ` — "${basics.shippingNotes}"` : ''}
            </div>
            <button
              type="button"
              disabled={confirming}
              onClick={() => confirmEnrollment()}
              className={cn(
                'border-2 border-acc py-8 uppercase tracking-widest text-[12px]',
                'hover:bg-acc hover:text-bac transition-colors',
                confirming && 'opacity-30 pointer-events-none'
              )}
            >
              {confirming ? 'CONFIRMING…' : `CONFIRM ENROLLMENT — ${PRICE_LINE}`}
            </button>
          </div>
        )}

        {isOnStrength && (
          <div className="flex flex-col gap-y-8 text-[12px]">
            <div className="text-acc/60">
              CADENCE START: {basics?.cadenceStartAt ? dayjs(basics.cadenceStartAt).format('YYYY-MM-DD') : '—'}
            </div>
            <div className="flex gap-x-8">
              <button
                type="button"
                onClick={() =>
                  currentIssue &&
                  printManifest()
                }
                disabled={!currentIssue}
                className={cn(
                  'border-2 border-acc/40 py-8 px-16 uppercase tracking-widest text-[11px]',
                  'hover:bg-acc hover:text-bac transition-colors',
                  !currentIssue && 'opacity-30 pointer-events-none'
                )}
              >
                PRINT MANIFEST
              </button>
              <button
                type="button"
                disabled={standingDown}
                onClick={() => standDown()}
                className={cn(
                  'border-2 border-acc/20 py-8 px-16 uppercase tracking-widest text-[11px]',
                  'hover:bg-acc/10 transition-colors',
                  standingDown && 'opacity-30 pointer-events-none'
                )}
              >
                {standingDown ? 'STANDING DOWN…' : 'STAND DOWN'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 4 — ISSUE LOG (Month 3) ───────────────── */}
      {isOnStrength && !!basics?.issueLog?.length && (
        <>
          <ThinRule className="mb-16" />
          <SectionLabel>SECTION 4 — ISSUE LOG</SectionLabel>
          <div className="mb-16 flex flex-col">
            <div
              className="grid text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
              style={{ gridTemplateColumns: '48px 1fr auto auto' }}
            >
              <span>NO.</span>
              <span>SCHEDULED</span>
              <span className="text-right">ITEMS</span>
              <span className="text-right w-[100px]">STATUS</span>
            </div>
            {[...basics.issueLog]
              .sort((a, b) => b.issueNumber - a.issueNumber)
              .map((entry) => (
                <div
                  key={entry.issueNumber}
                  className="grid text-[12px] py-[5px] border-b border-acc/10 gap-x-8"
                  style={{ gridTemplateColumns: '48px 1fr auto auto' }}
                >
                  <span className="text-acc/40 tabular-nums">
                    {String(entry.issueNumber).padStart(3, '0')}
                  </span>
                  <span className="text-acc/70">
                    {dayjs(entry.scheduledAt).format('YYYY-MM-DD')}
                  </span>
                  <span className="text-acc/50 text-right">{entry.itemLines.length}</span>
                  <span
                    className={cn(
                      'text-right w-[100px]',
                      entry.status === 'DISPATCHED' ? 'text-acc' : 'text-acc/40'
                    )}
                  >
                    {entry.status}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}

      {currentIssue && (
        <ManifestPrint
          operatorName={operatorName}
          issueNumber={currentIssue.issueNumber}
          scheduledAt={currentIssue.scheduledAt}
          itemLines={currentIssue.itemLines}
        />
      )}
    </div>
  )
}
