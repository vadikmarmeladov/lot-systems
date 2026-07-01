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
import type { BasicsState } from '#shared/types'
import {
  useBasicsState,
  useBasicsEnroll,
  useBasicsConfirm,
  useBasicsStandDown,
} from '#client/queries'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  BASICS_STATUS_LABEL,
  UPGRADE_LINE,
  STAND_DOWN_NOTICE,
  type RationItem,
  type RationCadence,
} from './basics/doctrine'

// ─── terminal grid constants ──────────────────────────────────────────────────
const RULE = '─'
const HEAVY = '━'
const ruleOf = (n: number) => Array(n).fill(RULE).join('')
const heavyOf = (n: number) => Array(n).fill(HEAVY).join('')

const hasTag = (tags: string[] | undefined, tag: string) =>
  (tags ?? []).some((t) => t.toLowerCase() === tag.toLowerCase())

const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toISOString().slice(0, 10)
}

// ─── sub-components ───────────────────────────────────────────────────────────

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

const LedgerRow: React.FC<{ item: RationItem; isLast: boolean }> = ({ item, isLast }) => (
  <div
    className={cn(
      'grid font-mono text-[12px] phone:text-[13px] py-[5px] gap-x-8',
      'grid-cols-[28px_1fr_auto_auto]',
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

const StatusLine: React.FC<{ plan: string; rationsStatus: string }> = ({ plan, rationsStatus }) => (
  <div className="font-mono text-[12px] phone:text-[13px] flex flex-col gap-y-4">
    <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
      <span className="text-acc/50 uppercase tracking-wider">PLAN</span>
      <span className="text-acc uppercase">{plan}</span>
    </div>
    <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
      <span className="text-acc/50 uppercase tracking-wider">RATION</span>
      <span className="text-acc/60 uppercase">{rationsStatus}</span>
    </div>
  </div>
)

const FieldRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid gap-x-16" style={{ gridTemplateColumns: '120px 1fr' }}>
    <span className="text-acc/50 uppercase tracking-wider">{label}</span>
    <span className="text-acc">{value}</span>
  </div>
)

const TerminalInput: React.FC<{
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
}> = ({ label, value, onChange, placeholder, maxLength }) => (
  <label className="flex flex-col gap-y-4 font-mono text-[12px]">
    <span className="text-acc/50 uppercase tracking-widest text-[10px]">{label}</span>
    <input
      className={cn(
        'bg-transparent border-2 border-acc/30 focus:border-acc',
        'px-8 py-8 text-acc placeholder:text-acc/30',
        'font-mono text-[12px] outline-none rounded-none'
      )}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
)

const TerminalButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}> = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'font-mono text-[11px] uppercase tracking-widest',
      'border-2 border-acc px-16 py-8 rounded-none',
      'text-acc hover:bg-acc hover:text-white transition-colors',
      'disabled:opacity-30 disabled:pointer-events-none',
      'self-start'
    )}
  >
    {children}
  </button>
)

// ─── upgrade / roster panels (Month 2) ────────────────────────────────────────

const EnrollPanel: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [size, setSize] = React.useState('')
  const [shippingAddress, setShippingAddress] = React.useState('')
  const enroll = useBasicsEnroll()

  const canSubmit = size.trim().length > 0 && shippingAddress.trim().length > 0 && !enroll.isLoading

  return (
    <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-16">
      <div className="text-acc/50 uppercase tracking-widest text-[10px]">
        ROSTER INTAKE — SIZING + SHIPPING
      </div>
      <TerminalInput label="SIZE" value={size} onChange={setSize} placeholder="S / M / L / XL" maxLength={40} />
      <TerminalInput
        label="SHIPPING ADDRESS"
        value={shippingAddress}
        onChange={setShippingAddress}
        placeholder="STREET, CITY, STATE, ZIP, COUNTRY"
        maxLength={500}
      />
      <div className="text-acc/40 text-[11px]">{UPGRADE_LINE}</div>
      {enroll.isError && (
        <div className="text-acc text-[11px]">
          REJECTED — {(enroll.error?.response?.data as any)?.message ?? 'TRY AGAIN'}
        </div>
      )}
      <TerminalButton
        disabled={!canSubmit}
        onClick={() =>
          enroll.mutate(
            { size: size.trim(), shippingAddress: shippingAddress.trim() },
            { onSuccess: onDone }
          )
        }
      >
        {enroll.isLoading ? 'SUBMITTING…' : 'SUBMIT ROSTER'}
      </TerminalButton>
    </div>
  )
}

const PendingPanel: React.FC<{ state: BasicsState; onDone: () => void }> = ({ state, onDone }) => {
  const confirm = useBasicsConfirm()
  return (
    <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-8">
      <div className="text-acc/50 uppercase tracking-widest text-[10px]">
        PENDING — ROSTER ON FILE
      </div>
      <FieldRow label="SIZE" value={state.roster?.size ?? '—'} />
      <FieldRow label="SHIPPING" value={state.roster?.shippingAddress ?? '—'} />
      <FieldRow label="CADENCE START" value={fmtDate(state.roster?.cadenceStart)} />
      <div className="text-acc/40 text-[11px]">{UPGRADE_LINE}</div>
      <TerminalButton disabled={confirm.isLoading} onClick={() => confirm.mutate(undefined, { onSuccess: onDone })}>
        {confirm.isLoading ? 'CONFIRMING…' : 'CONFIRM — GO ON STRENGTH'}
      </TerminalButton>
    </div>
  )
}

const OnStrengthPanel: React.FC<{ state: BasicsState; onDone: () => void }> = ({ state, onDone }) => {
  const [armed, setArmed] = React.useState(false)
  const standDown = useBasicsStandDown()
  const lastEntry = state.issueLog[state.issueLog.length - 1]
  const dispatched = state.issueLog.some((e) => e.status === 'DISPATCHED')

  return (
    <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-8">
      <div className="text-acc/50 uppercase tracking-widest text-[10px]">
        {dispatched ? 'STEADY STATE — RECURRING CADENCE' : 'ON STRENGTH'}
      </div>
      <FieldRow label="SIZE" value={state.roster?.size ?? '—'} />
      <FieldRow label="SHIPPING" value={state.roster?.shippingAddress ?? '—'} />
      <FieldRow label="ENROLLED" value={fmtDate(state.enrolledAt)} />
      <FieldRow label="CADENCE START" value={fmtDate(state.roster?.cadenceStart)} />
      <FieldRow label="NEXT ISSUE" value={lastEntry ? lastEntry.status : 'PENDING'} />

      <ThinRule className="my-4" />
      <div className="text-acc/40 text-[10px] uppercase tracking-widest">ISSUE LOG</div>
      <div className="flex flex-col gap-y-4">
        {state.issueLog.map((entry, i) => (
          <div key={i} className="grid gap-x-16 text-[11px]" style={{ gridTemplateColumns: '90px 90px 1fr' }}>
            <span className="text-acc/40 tabular-nums">{fmtDate(entry.date)}</span>
            <span className="text-acc/60">{entry.status}</span>
            <span className="text-acc/50">{entry.note}</span>
          </div>
        ))}
      </div>

      <ThinRule className="my-4" />
      <div className="text-acc/40 text-[11px]">{STAND_DOWN_NOTICE}</div>
      <TerminalButton
        disabled={standDown.isLoading}
        onClick={() => {
          if (!armed) {
            setArmed(true)
            return
          }
          standDown.mutate(undefined, { onSuccess: onDone })
        }}
      >
        {standDown.isLoading ? 'STANDING DOWN…' : armed ? 'CONFIRM STAND DOWN' : 'STAND DOWN'}
      </TerminalButton>
    </div>
  )
}

const StoodDownPanel: React.FC<{ state: BasicsState; onDone: () => void }> = ({ state, onDone }) => (
  <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-8">
    <div className="text-acc/50 uppercase tracking-widest text-[10px]">STOOD DOWN</div>
    <FieldRow label="STOOD DOWN" value={fmtDate(state.standDownAt)} />
    <div className="text-acc/40 text-[11px]">
      Ration withdrawn. USERSHIP / AI retained. Re-enroll to resume the ration.
    </div>
    <EnrollPanel onDone={onDone} />
  </div>
)

// ─── main component ───────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isMirrorOn = useStore(stores.isMirrorOn)

  const isUsership = hasTag(me?.tags, 'usership')
  const basicsQuery = useBasicsState({ enabled: !!me })
  const state = basicsQuery.data?.state ?? null
  const isOnStrength = state?.status === 'ON_STRENGTH'

  const planLabel = isOnStrength
    ? 'BASIC / ON STRENGTH'
    : isUsership
    ? 'USERSHIP / AI'
    : 'NONE'

  const rationStatus = state
    ? BASICS_STATUS_LABEL[state.status] ?? state.status
    : 'NOT ON STRENGTH'

  const monthlyItems = RATION_MANIFEST.filter((i) => i.cadence === 'MONTHLY')

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

      {/* Ledger column headers */}
      <div
        className="grid font-mono text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
        style={{ gridTemplateColumns: '28px 1fr auto auto' }}
      >
        <span>NO.</span>
        <span>NOMENCLATURE</span>
        <span className="text-right">SPEC</span>
        <span className="text-right w-[80px] phone:w-[90px]">CADENCE</span>
      </div>

      {/* Monthly items */}
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
          NUTRITION ({monthlyItems.filter(i => i.category === 'NUTRITION').length})
        </div>
        {RATION_MANIFEST.filter(i => i.category === 'NUTRITION').map((item, idx, arr) => (
          <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
        ))}
      </div>

      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
          HEALTH ({RATION_MANIFEST.filter(i => i.category === 'HEALTH').length})
        </div>
        {RATION_MANIFEST.filter(i => i.category === 'HEALTH').map((item, idx, arr) => (
          <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
        ))}
      </div>

      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
          HYGIENE ({RATION_MANIFEST.filter(i => i.category === 'HYGIENE').length})
        </div>
        {RATION_MANIFEST.filter(i => i.category === 'HYGIENE').map((item, idx, arr) => (
          <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
        ))}
      </div>

      <div className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
          EQUIPMENT ({RATION_MANIFEST.filter(i => i.category === 'EQUIPMENT').length})
        </div>
        {RATION_MANIFEST.filter(i => i.category === 'EQUIPMENT').map((item, idx, arr) => (
          <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
        ))}
      </div>

      <ThinRule className="mb-16 mt-8" />

      {/* ── STATUS LINE ───────────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16">
        <StatusLine plan={planLabel} rationsStatus={rationStatus} />
      </div>

      {/* ── UPGRADE / ROSTER (Month 2) ─────────────────────── */}
      <SectionLabel>SECTION 3 — UPGRADE, USERSHIP / AI → BASIC</SectionLabel>
      <div className="mb-16">
        {!isUsership && (
          <div className="border-2 border-acc/20 p-16 font-mono text-[12px] text-acc leading-snug">
            Requires USERSHIP / AI plan as base layer.
          </div>
        )}
        {isUsership && basicsQuery.isLoading && (
          <div className="font-mono text-[12px] text-acc/40">READING ROSTER…</div>
        )}
        {isUsership && !basicsQuery.isLoading && (!state || state.status === 'STOOD_DOWN') && (
          state?.status === 'STOOD_DOWN'
            ? <StoodDownPanel state={state} onDone={() => basicsQuery.refetch()} />
            : <EnrollPanel onDone={() => basicsQuery.refetch()} />
        )}
        {isUsership && state?.status === 'PENDING' && (
          <PendingPanel state={state} onDone={() => basicsQuery.refetch()} />
        )}
        {isUsership && state?.status === 'ON_STRENGTH' && (
          <OnStrengthPanel state={state} onDone={() => basicsQuery.refetch()} />
        )}
      </div>
    </div>
  )
}
