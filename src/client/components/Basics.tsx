/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { useQueryClient } from 'react-query'
import * as stores from '#client/stores'
import { cn } from '#client/utils'
import { useBasicsStatus, useBasicsUpgrade, useBasicsStandDown } from '#client/queries'
import type { BasicsShipping } from '#shared/types'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  type RationItem,
  type RationCadence,
} from './basics/doctrine'

const BASICS_STATUS_QUERY_KEY = '/api/basics/status'
const RATION_SIZES = ['S', 'M', 'L', 'XL']

const fieldClass = cn(
  'bg-transparent border border-acc/40 focus:border-acc outline-none',
  'font-mono text-[12px] px-8 py-6 uppercase placeholder:text-acc/30 w-full'
)

const ledgerButtonClass = cn(
  'border-2 border-acc font-mono text-[11px] uppercase tracking-widest',
  'px-16 py-8 hover:bg-acc hover:text-bac transition-colors',
  'disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-acc disabled:cursor-not-allowed'
)

// ─── terminal grid constants ──────────────────────────────────────────────────
const RULE = '─'
const HEAVY = '━'
const ruleOf = (n: number) => Array(n).fill(RULE).join('')
const heavyOf = (n: number) => Array(n).fill(HEAVY).join('')

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

const IssueLogRow: React.FC<{ at: string; event: string; isLast: boolean }> = ({ at, event, isLast }) => (
  <div
    className={cn(
      'grid font-mono text-[11px] phone:text-[12px] py-[5px] gap-x-8',
      !isLast && 'border-b border-acc/10'
    )}
    style={{ gridTemplateColumns: '140px 1fr' }}
  >
    <span className="text-acc/40 tabular-nums whitespace-nowrap">
      {new Date(at).toISOString().slice(0, 16).replace('T', ' ')}
    </span>
    <span className="text-acc uppercase tracking-wide">{event}</span>
  </div>
)

type IntakeFields = BasicsShipping & { size: string; cadenceStart: string }

const RosterIntakeForm: React.FC<{ onCancel: () => void; onSubmit: (fields: IntakeFields) => void; isSubmitting: boolean; error?: string }> = ({
  onCancel,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [fields, setFields] = React.useState<IntakeFields>({
    size: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    cadenceStart: '',
  })

  const set = (k: keyof IntakeFields) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [k]: ev.target.value }))

  const isComplete = Object.values(fields).every((v) => v.trim().length > 0)

  return (
    <div className="border-2 border-acc p-16 font-mono flex flex-col gap-y-12">
      <div className="text-acc/50 uppercase tracking-widest text-[10px]">
        ROSTER INTAKE — REQUIRED BEFORE ENLISTMENT
      </div>

      <div className="flex flex-col gap-y-4">
        <label className="text-acc/50 text-[10px] uppercase tracking-widest">SIZE</label>
        <select value={fields.size} onChange={set('size')} className={fieldClass}>
          <option value="" disabled>SELECT</option>
          {RATION_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-y-4">
        <label className="text-acc/50 text-[10px] uppercase tracking-widest">SHIPPING ADDRESS</label>
        <input placeholder="ADDRESS" value={fields.address} onChange={set('address')} className={fieldClass} />
        <div className="grid grid-cols-2 gap-8">
          <input placeholder="CITY" value={fields.city} onChange={set('city')} className={fieldClass} />
          <input placeholder="COUNTRY" value={fields.country} onChange={set('country')} className={fieldClass} />
        </div>
        <input placeholder="PHONE" value={fields.phone} onChange={set('phone')} className={fieldClass} />
      </div>

      <div className="flex flex-col gap-y-4">
        <label className="text-acc/50 text-[10px] uppercase tracking-widest">CADENCE START</label>
        <input type="date" value={fields.cadenceStart} onChange={set('cadenceStart')} className={fieldClass} />
      </div>

      {error && (
        <div className="text-acc text-[11px] border border-acc/40 p-8">{error}</div>
      )}

      <div className="flex gap-8 mt-4">
        <button
          type="button"
          disabled={!isComplete || isSubmitting}
          onClick={() => onSubmit(fields)}
          className={ledgerButtonClass}
        >
          {isSubmitting ? 'SUBMITTING…' : 'CONFIRM — GO ON STRENGTH'}
        </button>
        <button type="button" onClick={onCancel} className={cn(ledgerButtonClass, 'border-acc/40 text-acc/60')}>
          CANCEL
        </button>
      </div>
    </div>
  )
}

const UpgradeControl: React.FC = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useBasicsStatus()
  const upgrade = useBasicsUpgrade()
  const standDown = useBasicsStandDown()
  const [showIntake, setShowIntake] = React.useState(false)

  const invalidate = () => queryClient.invalidateQueries([BASICS_STATUS_QUERY_KEY])

  if (isLoading || !data) {
    return <div className="font-mono text-[12px] text-acc/40">LOADING ROSTER STATUS…</div>
  }

  const { status, isUsership, issueLog } = data

  if (status === 'ON_STRENGTH' || status === 'STEADY_STATE') {
    return (
      <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-8">
        <div className="text-acc/50 uppercase tracking-widest text-[10px]">
          ON STRENGTH — BASIC RATION ACTIVE
        </div>
        <div className="text-acc leading-snug">
          Additive layer +USD 100.00/MO recorded to roster. Next issue: {data.nextIssueAt ? new Date(data.nextIssueAt).toISOString().slice(0, 10) : 'PENDING'}.
        </div>
        <button
          type="button"
          disabled={standDown.isLoading}
          onClick={() => standDown.mutate(undefined, { onSuccess: invalidate })}
          className={cn(ledgerButtonClass, 'self-start')}
        >
          {standDown.isLoading ? 'PROCESSING…' : 'STAND DOWN — DROP RATION'}
        </button>
      </div>
    )
  }

  if (showIntake) {
    return (
      <RosterIntakeForm
        isSubmitting={upgrade.isLoading}
        error={(upgrade.error as any)?.response?.data?.message}
        onCancel={() => setShowIntake(false)}
        onSubmit={(fields) => {
          const { size, cadenceStart, ...shipping } = fields
          upgrade.mutate(
            { size, cadenceStart, shipping },
            { onSuccess: () => { invalidate(); setShowIntake(false) } }
          )
        }}
      />
    )
  }

  return (
    <div className="border-2 border-acc/20 p-16 font-mono text-[12px] flex flex-col gap-y-8">
      <div className="text-acc/50 uppercase tracking-widest text-[10px]">
        UPGRADE PATH — USERSHIP → BASIC
      </div>
      <div className="text-acc leading-snug">
        {isUsership
          ? 'USERSHIP AI confirmed. BASIC ration available as additive layer (+USD 100.00/MO).'
          : 'Requires USERSHIP / AI plan as base layer.'}
      </div>
      {status === 'STAND_DOWN' && (
        <div className="text-acc/40 text-[11px]">PREVIOUSLY ON STRENGTH — STOOD DOWN.</div>
      )}
      {isUsership && (
        <button type="button" onClick={() => setShowIntake(true)} className={cn(ledgerButtonClass, 'self-start')}>
          {status === 'STAND_DOWN' ? 'RE-ENLIST' : 'ENLIST — GO ON STRENGTH'}
        </button>
      )}
      {issueLog.length > 0 && (
        <div className="mt-8 pt-8 border-t border-acc/10 flex flex-col">
          {issueLog.slice().reverse().slice(0, 3).map((e, i, arr) => (
            <IssueLogRow key={`${e.at}-${i}`} at={e.at} event={e.event} isLast={i === arr.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const isMirrorOn = useStore(stores.isMirrorOn)
  const { data: basicsStatus } = useBasicsStatus()

  const status = basicsStatus?.status ?? 'NONE'
  const isUsership = basicsStatus?.isUsership ?? false
  const isOnStrength = status === 'ON_STRENGTH' || status === 'STEADY_STATE'

  const planLabel = isOnStrength
    ? 'BASIC / ON STRENGTH'
    : isUsership
    ? 'USERSHIP / AI'
    : 'NONE'

  const rationStatus = isOnStrength
    ? `ACTIVE — NEXT ISSUE ${basicsStatus?.nextIssueAt ? new Date(basicsStatus.nextIssueAt).toISOString().slice(0, 10) : 'PENDING'}`
    : status === 'STAND_DOWN'
    ? 'STOOD DOWN'
    : 'NOT ON STRENGTH'

  const monthlyItems = RATION_MANIFEST.filter((i) => i.cadence === 'MONTHLY')
  const quarterlyItems = RATION_MANIFEST.filter((i) => i.cadence === 'QUARTERLY')
  const annualItems = RATION_MANIFEST.filter((i) => i.cadence === 'ANNUALLY')

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

      {/* ── UPGRADE CONTROL (Month 2) ─────────────────────── */}
      <div className="mt-4">
        <UpgradeControl />
      </div>

      {/* ── ISSUE LOG ──────────────────────────────────────── */}
      {isOnStrength && (basicsStatus?.issueLog?.length ?? 0) > 0 && (
        <>
          <ThinRule className="mb-16 mt-24" />
          <SectionLabel>SECTION 3 — ISSUE LOG</SectionLabel>
          <div>
            {basicsStatus!.issueLog.slice().reverse().map((e, i, arr) => (
              <IssueLogRow key={`${e.at}-${i}`} at={e.at} event={e.event} isLast={i === arr.length - 1} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
