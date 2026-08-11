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
import { COUNTRIES } from '#shared/constants'
import {
  useBasics,
  useEnrollBasics,
  useConfirmBasics,
  useStandDownBasics,
  useDispatchBasicsIssue,
} from '#client/queries'
import {
  RATION_MANIFEST,
  DOCTRINE_LINES,
  PRICE_LINE,
  MANUAL_REF,
  RATION_COUNT,
  type RationItem,
  type RationCadence,
  type BasicsState,
} from './basics/doctrine'

// ─── terminal grid constants ──────────────────────────────────────────────────
const RULE = '─'
const heavyOf = (n: number) => Array(n).fill('━').join('')

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toISOString().slice(0, 10).replace(/-/g, '.') : '—'

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

// Square, borderless-fill inversion buttons — no radius, no color, per house style.
const TermButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  primary?: boolean
  children: React.ReactNode
}> = ({ onClick, disabled, primary, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'font-mono text-[11px] uppercase tracking-widest px-16 py-8 border-2 border-acc',
      'disabled:opacity-30 disabled:cursor-not-allowed',
      primary ? 'bg-acc text-bac' : 'text-acc bg-transparent hover:bg-acc/10'
    )}
  >
    {children}
  </button>
)

const TermField: React.FC<{
  label: string
  children: React.ReactNode
}> = ({ label, children }) => (
  <label className="flex flex-col gap-y-4">
    <span className="font-mono text-[10px] uppercase tracking-widest text-acc/50">{label}</span>
    {children}
  </label>
)

const inputCls =
  'font-mono text-[12px] phone:text-[13px] bg-transparent border-2 border-acc/30 text-acc px-8 py-6 focus:outline-none focus:border-acc'

// ─── roster intake (Month 2) ───────────────────────────────────────────────────

const RosterForm: React.FC<{ onSubmit: (v: { householdSize: number; country: string; city: string; address: string }) => void; pending: boolean }> = ({
  onSubmit,
  pending,
}) => {
  const [householdSize, setHouseholdSize] = React.useState(1)
  const [country, setCountry] = React.useState('')
  const [city, setCity] = React.useState('')
  const [address, setAddress] = React.useState('')

  const canSubmit = country.length === 3 && city.trim() && address.trim() && !pending

  return (
    <div className="flex flex-col gap-y-12">
      <div className="text-acc leading-snug font-mono text-[12px]">
        USERSHIP AI confirmed. BASIC ration available as additive layer (+USD 100.00/MO).
      </div>
      <div className="grid grid-cols-2 gap-8">
        <TermField label="OPERATORS IN HOUSEHOLD">
          <input
            type="number"
            min={1}
            max={12}
            value={householdSize}
            onChange={(e) => setHouseholdSize(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
            className={inputCls}
          />
        </TermField>
        <TermField label="COUNTRY (ISO ALPHA-3)">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={cn(inputCls, 'appearance-none')}
          >
            <option value="">— SELECT —</option>
            {COUNTRIES.map((c) => (
              <option key={c.alpha3} value={c.alpha3}>
                {c.alpha3} — {c.name}
              </option>
            ))}
          </select>
        </TermField>
      </div>
      <TermField label="SHIP-TO CITY">
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
      </TermField>
      <TermField label="SHIP-TO ADDRESS">
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
      </TermField>
      <div className="mt-4">
        <TermButton
          primary
          disabled={!canSubmit}
          onClick={() => onSubmit({ householdSize, country, city, address })}
        >
          SUBMIT ROSTER
        </TermButton>
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const isMirrorOn = useStore(stores.isMirrorOn)

  const { data: basicsData, refetch } = useBasics()
  const [basics, setBasics] = React.useState<BasicsState | null>(null)
  const [lastIssue, setLastIssue] = React.useState<{ issueNumber: number; dispatchedAt: string; items: RationItem[] } | null>(null)

  React.useEffect(() => {
    if (basicsData) setBasics(basicsData.basics)
  }, [basicsData])

  const isUsership = basicsData?.isUsership ?? false
  const status = basics?.status ?? 'NONE'

  const { mutate: enroll, isLoading: enrolling } = useEnrollBasics({
    onSuccess: (res) => setBasics(res.basics),
  })
  const { mutate: confirm, isLoading: confirming } = useConfirmBasics({
    onSuccess: (res) => setBasics(res.basics),
  })
  const { mutate: standDown, isLoading: standingDown } = useStandDownBasics({
    onSuccess: (res) => setBasics(res.basics),
  })
  const { mutate: dispatchIssue, isLoading: dispatching } = useDispatchBasicsIssue({
    onSuccess: (res) => {
      setBasics(res.basics)
      setLastIssue(res.issue)
    },
  })

  const planLabel =
    status === 'ON_STRENGTH' ? 'BASIC / ON STRENGTH'
    : status === 'STEADY_STATE' ? 'BASIC / STEADY STATE'
    : status === 'PENDING' ? 'USERSHIP / AI — BASIC PENDING'
    : status === 'STAND_DOWN' ? 'USERSHIP / AI — STAND DOWN'
    : isUsership ? 'USERSHIP / AI'
    : 'NONE'

  const rationStatus =
    status === 'ON_STRENGTH' || status === 'STEADY_STATE'
      ? `ACTIVE — NEXT ISSUE ${fmtDate(basics?.nextIssueAt ?? null)}`
    : status === 'PENDING' ? 'PENDING — AUTHORIZATION REQUIRED'
    : status === 'STAND_DOWN' ? `STOOD DOWN — ${fmtDate(basics?.standDownAt ?? null)}`
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

      <div
        className="grid font-mono text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
        style={{ gridTemplateColumns: '28px 1fr auto auto' }}
      >
        <span>NO.</span>
        <span>NOMENCLATURE</span>
        <span className="text-right">SPEC</span>
        <span className="text-right w-[80px] phone:w-[90px]">CADENCE</span>
      </div>

      {(['NUTRITION', 'HEALTH', 'HYGIENE', 'EQUIPMENT'] as const).map((cat) => {
        const items = RATION_MANIFEST.filter((i) => i.category === cat)
        return (
          <div key={cat} className="mb-12">
            <div className="font-mono text-[10px] uppercase tracking-widest text-acc/30 pb-4">
              {cat} ({items.length})
            </div>
            {items.map((item, idx, arr) => (
              <LedgerRow key={item.line} item={item} isLast={idx === arr.length - 1} />
            ))}
          </div>
        )
      })}

      <ThinRule className="mb-16 mt-8" />

      {/* ── STATUS LINE ───────────────────────────────────── */}
      <SectionLabel>SECTION 2 — STATUS</SectionLabel>
      <div className="mb-16">
        <StatusLine rows={[['PLAN', planLabel], ['RATION', rationStatus]]} />
      </div>

      <ThinRule className="mb-16" />

      {/* ── UPGRADE / ROSTER (Month 2) ─────────────────────── */}
      <SectionLabel>SECTION 3 — UPGRADE / ROSTER</SectionLabel>
      <div className="mb-16">
        <div className={cn('border-2 border-acc/20 p-16', 'flex flex-col gap-y-12')}>
          {status === 'NONE' && !isUsership && (
            <>
              <div className="text-acc/50 uppercase tracking-widest text-[10px]">
                UPGRADE PATH — USERSHIP → BASIC
              </div>
              <div className="text-acc leading-snug font-mono text-[12px]">
                Requires USERSHIP / AI plan as base layer.
              </div>
            </>
          )}

          {(status === 'NONE' || status === 'STAND_DOWN') && isUsership && (
            <>
              {status === 'STAND_DOWN' && (
                <div className="text-acc/50 font-mono text-[11px] uppercase tracking-widest">
                  RE-ENROLLMENT AVAILABLE — AI RETAINED THROUGHOUT
                </div>
              )}
              <RosterForm onSubmit={(v) => enroll(v)} pending={enrolling} />
            </>
          )}

          {status === 'PENDING' && basics?.roster && (
            <>
              <div className="text-acc/50 uppercase tracking-widest text-[10px]">
                ROSTER SUBMITTED — AUTHORIZATION PENDING
              </div>
              <StatusLine
                rows={[
                  ['OPERATORS', String(basics.roster.householdSize)],
                  ['SHIP TO', `${basics.roster.city}, ${basics.roster.country}`],
                  ['ADDRESS', basics.roster.address],
                ]}
              />
              <div className="text-acc/60 font-mono text-[11px] leading-snug">
                Confirming authorizes recurring {PRICE_LINE} additive charge and opens the
                cadence clock.
              </div>
              <div>
                <TermButton primary disabled={confirming} onClick={() => confirm()}>
                  CONFIRM &amp; AUTHORIZE ({PRICE_LINE})
                </TermButton>
              </div>
            </>
          )}

          {(status === 'ON_STRENGTH' || status === 'STEADY_STATE') && basics && (
            <>
              <StatusLine
                rows={[
                  ['STATUS', status === 'STEADY_STATE' ? 'STEADY STATE' : 'ON STRENGTH'],
                  ['ON STRENGTH SINCE', fmtDate(basics.onStrengthAt)],
                  ['NEXT CHARGE', fmtDate(basics.nextChargeAt)],
                  ['NEXT ISSUE', fmtDate(basics.nextIssueAt)],
                  ['ISSUES SHIPPED', String(basics.issueLog.length)],
                ]}
              />
              <div className="flex gap-8 flex-wrap mt-4">
                <TermButton primary disabled={dispatching} onClick={() => dispatchIssue()}>
                  DISPATCH ISSUE
                </TermButton>
                <TermButton disabled={standingDown} onClick={() => standDown()}>
                  STAND DOWN
                </TermButton>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── ISSUE LOG (Month 3) ─────────────────────────────── */}
      {basics && basics.issueLog.length > 0 && (
        <>
          <ThinRule className="mb-16" />
          <SectionLabel>SECTION 4 — ISSUE LOG</SectionLabel>
          <div className="mb-16">
            <div
              className="grid font-mono text-[10px] uppercase tracking-widest text-acc/40 pb-6 border-b-2 border-acc/20 mb-4 gap-x-8"
              style={{ gridTemplateColumns: '48px 1fr auto' }}
            >
              <span>NO.</span>
              <span>DISPATCHED</span>
              <span className="text-right">LINES</span>
            </div>
            {basics.issueLog.map((issue, idx, arr) => (
              <div
                key={issue.issueNumber}
                className={cn(
                  'grid font-mono text-[12px] py-[5px] gap-x-8',
                  idx !== arr.length - 1 && 'border-b border-acc/10'
                )}
                style={{ gridTemplateColumns: '48px 1fr auto' }}
              >
                <span className="text-acc/40 tabular-nums">{issue.issueNumber}</span>
                <span className="text-acc uppercase">{fmtDate(issue.dispatchedAt)}</span>
                <span className="text-acc/50 text-right">{issue.lines.length}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── PRINTED MANIFEST CARD (Month 3) ──────────────────── */}
      {lastIssue && (
        <>
          <ThinRule className="mb-16" />
          <SectionLabel>MANIFEST CARD — ISSUE {lastIssue.issueNumber}</SectionLabel>
          <div id="lot-manifest-card" className="border-2 border-acc p-16 mb-16 font-mono text-[12px]">
            <div className="flex justify-between mb-8">
              <span className="text-acc font-bold uppercase tracking-widest">
                {MANUAL_REF} — ISSUE {String(lastIssue.issueNumber).padStart(3, '0')}
              </span>
              <span className="text-acc/50">{fmtDate(lastIssue.dispatchedAt)}</span>
            </div>
            <ThinRule className="mb-8" />
            {lastIssue.items.map((item) => (
              <div key={item.line} className="grid gap-x-8 py-2" style={{ gridTemplateColumns: '28px 1fr auto' }}>
                <span className="text-acc/40">{item.line}</span>
                <span className="text-acc uppercase">{item.nomenclature}</span>
                <span className="text-acc/50 text-right">{item.spec}</span>
              </div>
            ))}
            <ThinRule className="mt-8 mb-4" />
            <div className="text-acc/40 text-[10px] uppercase tracking-widest">
              {lastIssue.items.length} LINE ITEMS — ISSUED, NOT SOLD
            </div>
          </div>
          <div className="mb-16">
            <TermButton onClick={() => window.print()}>PRINT MANIFEST CARD</TermButton>
          </div>
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #lot-manifest-card, #lot-manifest-card * { visibility: visible; }
              #lot-manifest-card { position: absolute; top: 0; left: 0; width: 100%; border-width: 2px; }
            }
          `}</style>
        </>
      )}
    </div>
  )
}
