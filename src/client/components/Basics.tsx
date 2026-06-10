/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE
 * OPEN TAB — LEDGER / UPGRADE / ISSUE LOG
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import {
  useBasicsStatus,
  useBasicsStrength,
  useBasicsIssues,
  useBasicsUpgrade,
  useBasicsRoster,
  useBasicsStandDown,
} from '#client/queries'
import {
  RATION_MANIFEST,
  BASICS_DOCTRINE_LINES,
  BASICS_PRICE_USD,
  BASICS_COGS_CEILING_USD,
  BASICS_MARGIN_TARGET_PCT,
  BasicsStatus,
  BasicsRoster,
  BasicsMetadata,
  BasicsIssue,
  MONTH_NAMES,
  getIssueItemIds,
  shipsThisIssue,
} from '#shared/constants/basics'
import { UserTag } from '#shared/types'
import { cn } from '#client/utils'

// ─── TERMINAL PRIMITIVES ─────────────────────────────────────────────────────

const T = {
  root: 'font-mono text-[13px] leading-[1.6] tracking-wide',
  border: 'border-2 border-black',
  rule: 'border-b-2 border-black',
  ruleTop: 'border-t-2 border-black',
  inv: 'bg-black text-white',
  cell: 'px-8 py-4',
  th: 'px-8 py-4 text-left uppercase text-[11px] tracking-widest opacity-60',
  label: 'uppercase text-[11px] tracking-widest opacity-60',
  mono: 'font-mono',
}

function TBox({
  children,
  inverted,
  className,
}: {
  children: React.ReactNode
  inverted?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(T.border, inverted && T.inv, 'p-8', className)}
      style={{ borderRadius: 0 }}
    >
      {children}
    </div>
  )
}

function TRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-baseline gap-16', className)}>{children}</div>
  )
}

function THr({ className }: { className?: string }) {
  return <div className={cn('border-t-2 border-black my-0', className)} />
}

// ─── MONTH 1: OPEN TAB / LEDGER ──────────────────────────────────────────────

function ManifestLedger({ strengthCount }: { strengthCount: number }) {
  const moCount = RATION_MANIFEST.filter((i) => i.cadence === 'MO').length
  const q2Count = RATION_MANIFEST.filter((i) => i.cadence === 'Q2').length
  const q3Count = RATION_MANIFEST.filter((i) => i.cadence === 'Q3').length

  return (
    <div style={{ backgroundColor: '#fff', color: '#000', borderRadius: 0 }}>
      {/* Header */}
      <div
        className={cn(T.border, T.inv, 'px-12 py-8 flex justify-between items-baseline')}
        style={{ borderRadius: 0, borderBottom: 'none' }}
      >
        <span className="text-[18px] font-bold tracking-[0.2em]">LOT // BASIC</span>
        <span className="text-[15px] tracking-widest">
          USD {BASICS_PRICE_USD} / MO
        </span>
      </div>

      {/* Doctrine */}
      <div
        className={cn(T.border, 'px-12 py-8')}
        style={{ borderRadius: 0, borderBottom: 'none' }}
      >
        {BASICS_DOCTRINE_LINES.map((line, i) => (
          <div key={i} className="uppercase text-[11px] tracking-widest leading-loose opacity-70">
            {line}
          </div>
        ))}
      </div>

      {/* Status line */}
      <div
        className={cn(T.border, 'px-12 py-6 flex items-center justify-between')}
        style={{ borderRadius: 0, borderBottom: 'none' }}
      >
        <span className="uppercase text-[11px] tracking-widest">
          <span className="font-bold text-[13px]">{strengthCount}</span>
          {' '}ON STRENGTH
        </span>
        <span className="uppercase text-[11px] tracking-widest opacity-40">
          OPEN TAB — READ-ONLY MANIFEST
        </span>
      </div>

      {/* Manifest table */}
      <div className={cn(T.border)} style={{ borderRadius: 0 }}>
        {/* Table header */}
        <div className={cn('grid px-12 py-4', 'border-b-2 border-black')}
          style={{ gridTemplateColumns: '28px 1fr 56px 52px' }}>
          <span className={T.label}>NO</span>
          <span className={T.label}>NOMENCLATURE</span>
          <span className={T.label}>QTY</span>
          <span className={T.label}>CADEN</span>
        </div>

        {/* Items */}
        {RATION_MANIFEST.map((item, idx) => {
          const isLastInCategory =
            idx === RATION_MANIFEST.length - 1 ||
            RATION_MANIFEST[idx + 1].category !== item.category
          return (
            <div
              key={item.id}
              className={cn(
                'grid px-12 py-[5px]',
                isLastInCategory && idx < RATION_MANIFEST.length - 1
                  ? 'border-b-2 border-black/20'
                  : idx < RATION_MANIFEST.length - 1
                  ? 'border-b border-black/10'
                  : ''
              )}
              style={{ gridTemplateColumns: '28px 1fr 56px 52px' }}
            >
              <span className="opacity-30 text-[11px] tabular-nums">
                {String(item.id).padStart(2, '0')}
              </span>
              <span className="text-[12px] uppercase tracking-wide">{item.nomenclature}</span>
              <span className="text-[12px] opacity-60 tabular-nums">{item.qty}</span>
              <span
                className={cn(
                  'text-[11px] tracking-widest font-bold',
                  item.cadence === 'MO' ? 'opacity-90' : 'opacity-50'
                )}
              >
                {item.cadence}
              </span>
            </div>
          )
        })}

        {/* Footer */}
        <div
          className="border-t-2 border-black px-12 py-6 flex justify-between items-center"
        >
          <span className="text-[11px] uppercase tracking-widest opacity-40">
            COGS WITHHELD — MARGIN ≥ {BASICS_MARGIN_TARGET_PCT}% — LANDED ≤ USD {BASICS_COGS_CEILING_USD}
          </span>
          <span className="text-[11px] uppercase tracking-widest opacity-40">
            {moCount} MO · {q2Count} Q2 · {q3Count} Q3
          </span>
        </div>
      </div>

      {/* Cadence key */}
      <div
        className={cn(T.border, 'border-t-0 px-12 py-4 flex gap-24')}
        style={{ borderRadius: 0 }}
      >
        {(['MO','Q2','Q3'] as const).map((c) => (
          <span key={c} className="text-[11px] uppercase tracking-widest opacity-40">
            {c === 'MO' ? 'MO — MONTHLY' : c === 'Q2' ? 'Q2 — EVERY 2 MO' : 'Q3 — EVERY 3 MO'}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── MONTH 2: ROSTER INTAKE FORM ─────────────────────────────────────────────

const EMPTY_ROSTER: BasicsRoster = {
  size: 'M',
  firstName: '',
  lastName: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  cadenceStart: '',
}

function RosterForm({
  initialRoster,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initialRoster?: BasicsRoster
  onSubmit: (r: BasicsRoster) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [roster, setRoster] = React.useState<BasicsRoster>(
    initialRoster || { ...EMPTY_ROSTER, cadenceStart: getDefaultCadenceStart() }
  )

  function setField(field: keyof BasicsRoster, val: string) {
    setRoster((r) => ({ ...r, [field]: val }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!roster.firstName || !roster.address || !roster.city || !roster.zip || !roster.country) return
    onSubmit(roster)
  }

  const inputClass = cn(
    'w-full border-2 border-black px-8 py-4 font-mono text-[12px] uppercase tracking-wide',
    'bg-white text-black focus:outline-none focus:bg-black focus:text-white',
    'placeholder:opacity-30 placeholder:normal-case'
  )
  const selectClass = cn(inputClass, 'cursor-pointer appearance-none')

  return (
    <form onSubmit={handleSubmit} className="border-2 border-black border-t-0" style={{ borderRadius: 0 }}>
      <div className="bg-black text-white px-12 py-6 uppercase text-[11px] tracking-widest">
        ROSTER INTAKE
      </div>

      <div className="px-12 py-8 grid gap-8">
        {/* Size */}
        <div>
          <div className={cn(T.label, 'mb-4')}>APPAREL SIZE</div>
          <div className="flex gap-8">
            {(['S','M','L','XL'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setField('size', sz)}
                className={cn(
                  'border-2 border-black px-12 py-4 font-mono text-[12px] uppercase tracking-widest',
                  roster.size === sz ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/10'
                )}
                style={{ borderRadius: 0 }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className={cn(T.label, 'mb-4')}>FIRST NAME *</div>
            <input
              className={inputClass}
              value={roster.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              placeholder="First"
              required
              style={{ borderRadius: 0 }}
            />
          </div>
          <div>
            <div className={cn(T.label, 'mb-4')}>LAST NAME</div>
            <input
              className={inputClass}
              value={roster.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              placeholder="Last"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <div className={cn(T.label, 'mb-4')}>STREET ADDRESS *</div>
          <input
            className={inputClass}
            value={roster.address}
            onChange={(e) => setField('address', e.target.value)}
            placeholder="123 Main St"
            required
            style={{ borderRadius: 0 }}
          />
        </div>
        <div>
          <div className={cn(T.label, 'mb-4')}>APT / UNIT / SUITE</div>
          <input
            className={inputClass}
            value={roster.address2}
            onChange={(e) => setField('address2', e.target.value)}
            placeholder="Apt 4B"
            style={{ borderRadius: 0 }}
          />
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className={cn(T.label, 'mb-4')}>CITY *</div>
            <input
              className={inputClass}
              value={roster.city}
              onChange={(e) => setField('city', e.target.value)}
              placeholder="City"
              required
              style={{ borderRadius: 0 }}
            />
          </div>
          <div>
            <div className={cn(T.label, 'mb-4')}>STATE / PROVINCE</div>
            <input
              className={inputClass}
              value={roster.state}
              onChange={(e) => setField('state', e.target.value)}
              placeholder="CA"
              style={{ borderRadius: 0 }}
            />
          </div>
          <div>
            <div className={cn(T.label, 'mb-4')}>ZIP / POSTAL *</div>
            <input
              className={inputClass}
              value={roster.zip}
              onChange={(e) => setField('zip', e.target.value)}
              placeholder="90210"
              required
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>

        <div>
          <div className={cn(T.label, 'mb-4')}>COUNTRY *</div>
          <select
            className={selectClass}
            value={roster.country}
            onChange={(e) => setField('country', e.target.value)}
            required
            style={{ borderRadius: 0 }}
          >
            <option value="US">UNITED STATES</option>
            <option value="CA">CANADA</option>
            <option value="GB">UNITED KINGDOM</option>
            <option value="AU">AUSTRALIA</option>
            <option value="DE">GERMANY</option>
            <option value="FR">FRANCE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        {/* Cadence start */}
        <div>
          <div className={cn(T.label, 'mb-4')}>CADENCE START *</div>
          <input
            type="date"
            className={inputClass}
            value={roster.cadenceStart}
            onChange={(e) => setField('cadenceStart', e.target.value)}
            required
            style={{ borderRadius: 0 }}
          />
          <div className="mt-4 text-[11px] uppercase tracking-widest opacity-40">
            FIRST ISSUE SHIPS THE 1ST OF THE MONTH FOLLOWING ENROLLMENT
          </div>
        </div>

        {/* Billing notice */}
        <div className="border-2 border-black px-8 py-6" style={{ borderRadius: 0 }}>
          <div className="text-[11px] uppercase tracking-widest opacity-60 leading-loose">
            ADDITIVE BILLING: USD {BASICS_PRICE_USD} / MO — CHARGED ON CADENCE START<br />
            RETAINS EXISTING USERSHIP / AI PLAN<br />
            CANCEL ANYTIME VIA STAND DOWN
          </div>
        </div>
      </div>

      <div className="border-t-2 border-black px-12 py-8 flex gap-8">
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'border-2 border-black px-16 py-6 font-mono text-[12px] uppercase tracking-widest',
            'bg-black text-white hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          style={{ borderRadius: 0 }}
        >
          {isLoading ? 'ENROLLING...' : 'CONFIRM ENROLLMENT'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={cn(
            'border-2 border-black px-16 py-6 font-mono text-[12px] uppercase tracking-widest',
            'bg-white text-black hover:bg-black/10 disabled:opacity-40'
          )}
          style={{ borderRadius: 0 }}
        >
          ABORT
        </button>
      </div>
    </form>
  )
}

// ─── MONTH 2: UPGRADE STATE MACHINE ──────────────────────────────────────────

function UpgradeSection({
  basics,
  isUsership,
  onUpgrade,
  onRosterSubmit,
  onStandDown,
  upgradeLoading,
  rosterLoading,
  standDownLoading,
}: {
  basics: BasicsMetadata | null
  isUsership: boolean
  onUpgrade: () => void
  onRosterSubmit: (r: BasicsRoster) => void
  onStandDown: () => void
  upgradeLoading: boolean
  rosterLoading: boolean
  standDownLoading: boolean
}) {
  const [showRosterForm, setShowRosterForm] = React.useState(false)
  const [showStandDownConfirm, setShowStandDownConfirm] = React.useState(false)
  const [standDownInput, setStandDownInput] = React.useState('')

  const status = basics?.status ?? null

  function handleRosterSubmit(r: BasicsRoster) {
    onRosterSubmit(r)
    setShowRosterForm(false)
  }

  function handleStandDown() {
    if (standDownInput.trim().toUpperCase() === 'STAND DOWN') {
      onStandDown()
      setShowStandDownConfirm(false)
      setStandDownInput('')
    }
  }

  const boxClass = 'border-2 border-black border-t-0'
  const btnBase = cn(
    'border-2 border-black px-16 py-6 font-mono text-[12px] uppercase tracking-widest',
    'disabled:opacity-40 disabled:cursor-not-allowed'
  )

  // Not a Usership member
  if (!isUsership) {
    return (
      <div className={boxClass} style={{ borderRadius: 0 }}>
        <div className="bg-black text-white px-12 py-6 uppercase text-[11px] tracking-widest">
          UPGRADE TO BASIC
        </div>
        <div className="px-12 py-8 text-[12px] uppercase tracking-wide opacity-50">
          REQUIRES USERSHIP / AI PLAN
        </div>
      </div>
    )
  }

  // Already stood down — show re-enroll option
  if (status === 'STAND_DOWN') {
    return (
      <div className={boxClass} style={{ borderRadius: 0 }}>
        <div className="bg-black text-white px-12 py-6 uppercase text-[11px] tracking-widest">
          STATUS: STAND DOWN
        </div>
        <div className="px-12 py-8 grid gap-8">
          <div className="text-[11px] uppercase tracking-widest opacity-50">
            SUBSCRIPTION CLOSED {basics?.standDownAt
              ? new Date(basics.standDownAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
              : ''}
            . AI PLAN RETAINED.
          </div>
          {!showRosterForm ? (
            <button
              onClick={() => setShowRosterForm(true)}
              className={cn(btnBase, 'bg-black text-white hover:bg-black/80')}
              style={{ borderRadius: 0 }}
            >
              RE-ENROLL
            </button>
          ) : (
            <RosterForm
              onSubmit={handleRosterSubmit}
              onCancel={() => setShowRosterForm(false)}
              isLoading={rosterLoading}
            />
          )}
        </div>
      </div>
    )
  }

  // No subscription yet — upgrade entry
  if (!status) {
    return (
      <div className={boxClass} style={{ borderRadius: 0 }}>
        {!showRosterForm ? (
          <>
            <div className="bg-black text-white px-12 py-6 uppercase text-[11px] tracking-widest">
              UPGRADE TO BASIC
            </div>
            <div className="px-12 py-8 grid gap-8">
              <div className="text-[11px] uppercase tracking-widest opacity-50 leading-loose">
                USERSHIP / AI PLAN DETECTED.<br />
                BASIC RATION: USD {BASICS_PRICE_USD} / MO ADDITIVE.<br />
                INCLUDES 23-ITEM MONTHLY LOAD.
              </div>
              <button
                onClick={() => { onUpgrade(); setShowRosterForm(true) }}
                disabled={upgradeLoading}
                className={cn(btnBase, 'bg-black text-white hover:bg-black/80 w-fit')}
                style={{ borderRadius: 0 }}
              >
                {upgradeLoading ? 'QUEUING...' : 'UPGRADE TO BASIC'}
              </button>
            </div>
          </>
        ) : (
          <RosterForm
            onSubmit={handleRosterSubmit}
            onCancel={() => setShowRosterForm(false)}
            isLoading={rosterLoading}
          />
        )}
      </div>
    )
  }

  // PENDING state
  if (status === 'PENDING') {
    return (
      <div className={boxClass} style={{ borderRadius: 0 }}>
        {!showRosterForm ? (
          <>
            <div className="bg-black text-white px-12 py-6 uppercase text-[11px] tracking-widest">
              STATUS: PENDING
            </div>
            <div className="px-12 py-8 grid gap-8">
              <div className="text-[11px] uppercase tracking-widest opacity-50">
                ENROLLMENT QUEUED. COMPLETE ROSTER TO CONFIRM.
              </div>
              <button
                onClick={() => setShowRosterForm(true)}
                className={cn(btnBase, 'bg-black text-white hover:bg-black/80 w-fit')}
                style={{ borderRadius: 0 }}
              >
                COMPLETE ROSTER
              </button>
            </div>
          </>
        ) : (
          <RosterForm
            initialRoster={basics?.roster}
            onSubmit={handleRosterSubmit}
            onCancel={() => setShowRosterForm(false)}
            isLoading={rosterLoading}
          />
        )}
      </div>
    )
  }

  // ON_STRENGTH or STEADY_STATE
  const roster = basics?.roster
  const nextIssueDate = basics?.nextIssueDate
    ? new Date(basics.nextIssueDate)
    : null
  const daysToNext = nextIssueDate
    ? Math.ceil((nextIssueDate.getTime() - Date.now()) / 86400000)
    : null

  return (
    <div className={boxClass} style={{ borderRadius: 0 }}>
      <div
        className="bg-black text-white px-12 py-6 flex justify-between items-baseline uppercase text-[11px] tracking-widest"
      >
        <span>
          STATUS:{' '}
          <span className="font-bold text-[13px]">
            {status === 'STEADY_STATE' ? 'STEADY STATE' : 'ON STRENGTH'}
          </span>
        </span>
        {basics?.upgradedAt && (
          <span className="opacity-60">
            SINCE {new Date(basics.upgradedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
          </span>
        )}
      </div>

      {roster && (
        <div className="px-12 py-8 grid gap-4">
          <div className="text-[11px] uppercase tracking-widest opacity-50 mb-4">ROSTER</div>
          <div className="grid" style={{ gridTemplateColumns: '120px 1fr' }}>
            <span className={T.label}>NAME</span>
            <span className="text-[12px] uppercase">{roster.firstName} {roster.lastName}</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '120px 1fr' }}>
            <span className={T.label}>SHIP TO</span>
            <span className="text-[12px] uppercase">
              {roster.address}{roster.address2 ? `, ${roster.address2}` : ''},{' '}
              {roster.city}, {roster.state} {roster.zip}, {roster.country}
            </span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '120px 1fr' }}>
            <span className={T.label}>SIZE</span>
            <span className="text-[12px] uppercase">{roster.size}</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '120px 1fr' }}>
            <span className={T.label}>CADENCE</span>
            <span className="text-[12px] uppercase">
              1ST OF EACH MONTH (START {new Date(roster.cadenceStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()})
            </span>
          </div>
        </div>
      )}

      {nextIssueDate && (
        <div className="border-t-2 border-black px-12 py-6 flex justify-between items-baseline">
          <span className="text-[11px] uppercase tracking-widest opacity-60">
            NEXT ISSUE
          </span>
          <span className="text-[13px] font-bold uppercase tracking-widest">
            {MONTH_NAMES[nextIssueDate.getMonth()]} {nextIssueDate.getFullYear()}
          </span>
          {daysToNext !== null && (
            <span className="text-[11px] uppercase tracking-widest opacity-60">
              T-MINUS {daysToNext} DAYS
            </span>
          )}
        </div>
      )}

      {/* Stand Down */}
      <div className="border-t-2 border-black px-12 py-8">
        {!showStandDownConfirm ? (
          <button
            onClick={() => setShowStandDownConfirm(true)}
            className={cn(btnBase, 'bg-white text-black hover:bg-black/10 opacity-40 hover:opacity-100')}
            style={{ borderRadius: 0 }}
          >
            STAND DOWN
          </button>
        ) : (
          <div className="grid gap-8">
            <div className="text-[11px] uppercase tracking-widest opacity-60">
              TYPE "STAND DOWN" TO CONFIRM CANCELLATION. AI PLAN RETAINED.
            </div>
            <div className="flex gap-8">
              <input
                className={cn(
                  'border-2 border-black px-8 py-4 font-mono text-[12px] uppercase tracking-wide bg-white text-black',
                  'focus:outline-none focus:bg-black focus:text-white'
                )}
                style={{ borderRadius: 0, minWidth: 200 }}
                placeholder="STAND DOWN"
                value={standDownInput}
                onChange={(e) => setStandDownInput(e.target.value.toUpperCase())}
              />
              <button
                onClick={handleStandDown}
                disabled={standDownInput.trim() !== 'STAND DOWN' || standDownLoading}
                className={cn(btnBase, 'bg-black text-white hover:bg-black/80')}
                style={{ borderRadius: 0 }}
              >
                {standDownLoading ? 'PROCESSING...' : 'CONFIRM'}
              </button>
              <button
                onClick={() => { setShowStandDownConfirm(false); setStandDownInput('') }}
                className={cn(btnBase, 'bg-white text-black hover:bg-black/10')}
                style={{ borderRadius: 0 }}
              >
                ABORT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MONTH 3: ISSUE LOG ───────────────────────────────────────────────────────

function IssueLog({
  issues,
  nextIssue,
  cadenceStart,
}: {
  issues: BasicsIssue[]
  nextIssue: {
    issueNumber: number
    month: number
    year: number
    monthName: string
    date: string
    itemIds: number[]
    itemCount: number
  } | null
  cadenceStart?: string
}) {
  const [expanded, setExpanded] = React.useState<number | null>(null)

  const sorted = [...issues].sort((a, b) => b.issueNumber - a.issueNumber)

  return (
    <div className="border-2 border-black border-t-0" style={{ borderRadius: 0 }}>
      <div className="bg-black text-white px-12 py-6 uppercase text-[11px] tracking-widest">
        ISSUE LOG
      </div>

      {/* Next issue preview */}
      {nextIssue && (
        <div className="border-b-2 border-black px-12 py-8">
          <div className="flex justify-between items-baseline mb-6">
            <span className="text-[11px] uppercase tracking-widest opacity-60">NEXT ISSUE</span>
            <span className="text-[13px] font-bold uppercase tracking-widest">
              {String(nextIssue.issueNumber).padStart(3, '0')}{' '}
              {nextIssue.monthName} {nextIssue.year}
            </span>
            <span className="text-[11px] uppercase tracking-widest opacity-60">
              {nextIssue.itemCount} ITEMS
            </span>
          </div>
          <div className="flex flex-wrap gap-6">
            {nextIssue.itemIds.map((id) => {
              const item = RATION_MANIFEST.find((i) => i.id === id)!
              return (
                <span
                  key={id}
                  className="border border-black px-4 py-1 text-[10px] uppercase tracking-wide opacity-60"
                  style={{ borderRadius: 0 }}
                >
                  {item.nomenclature.split(',')[0]}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* History */}
      {sorted.length === 0 ? (
        <div className="px-12 py-8 text-[11px] uppercase tracking-widest opacity-40">
          NO ISSUES ON RECORD. FIRST ISSUE PENDING.
        </div>
      ) : (
        <>
          {/* Table header */}
          <div
            className="grid border-b-2 border-black px-12 py-4"
            style={{ gridTemplateColumns: '60px 1fr 100px 80px' }}
          >
            <span className={T.label}>ISSUE</span>
            <span className={T.label}>PERIOD</span>
            <span className={T.label}>STATUS</span>
            <span className={T.label}>ITEMS</span>
          </div>

          {sorted.map((issue) => (
            <div key={issue.issueNumber}>
              <div
                className={cn(
                  'grid border-b border-black/20 px-12 py-6 cursor-pointer hover:bg-black/5'
                )}
                style={{ gridTemplateColumns: '60px 1fr 100px 80px' }}
                onClick={() => setExpanded(expanded === issue.issueNumber ? null : issue.issueNumber)}
              >
                <span className="text-[12px] font-bold tabular-nums">
                  {String(issue.issueNumber).padStart(3, '0')}
                </span>
                <span className="text-[12px] uppercase">
                  {MONTH_NAMES[issue.month - 1]} {issue.year}
                </span>
                <span className={cn(
                  'text-[11px] uppercase tracking-widest',
                  issue.deliveredAt ? 'font-bold' : 'opacity-60'
                )}>
                  {issue.deliveredAt
                    ? 'DELIVERED'
                    : issue.shippedAt
                    ? 'DISPATCHED'
                    : 'PENDING'}
                </span>
                <span className="text-[12px] opacity-60 tabular-nums">
                  {issue.itemIds.length}
                </span>
              </div>

              {/* Expanded issue detail */}
              {expanded === issue.issueNumber && (
                <div className="border-b-2 border-black/20 px-12 py-8 bg-black/5">
                  <div className="text-[11px] uppercase tracking-widest opacity-60 mb-8">
                    ISSUE {String(issue.issueNumber).padStart(3,'0')} — MANIFEST
                  </div>
                  <div className="flex flex-wrap gap-6">
                    {issue.itemIds.map((id) => {
                      const item = RATION_MANIFEST.find((i) => i.id === id)!
                      return (
                        <span
                          key={id}
                          className="border border-black px-4 py-1 text-[10px] uppercase tracking-wide"
                          style={{ borderRadius: 0 }}
                        >
                          {item.nomenclature}
                        </span>
                      )
                    })}
                  </div>
                  {issue.shippedAt && (
                    <div className="mt-8 text-[11px] uppercase tracking-widest opacity-40">
                      DISPATCHED {new Date(issue.shippedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      }).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────

function getDefaultCadenceStart(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const me = useStore(stores.me)
  const isUsership = React.useMemo(
    () => (me?.tags || []).some((t) => t.toLowerCase() === UserTag.Usership.toLowerCase()),
    [me]
  )

  const { data: strengthData } = useBasicsStrength()
  const { data: statusData, refetch: refetchStatus } = useBasicsStatus()
  const { data: issuesData, refetch: refetchIssues } = useBasicsIssues()

  const { mutate: doUpgrade, isLoading: upgradeLoading } = useBasicsUpgrade({
    onSuccess: () => { refetchStatus() },
  })
  const { mutate: doRoster, isLoading: rosterLoading } = useBasicsRoster({
    onSuccess: () => { refetchStatus(); refetchIssues() },
  })
  const { mutate: doStandDown, isLoading: standDownLoading } = useBasicsStandDown({
    onSuccess: () => { refetchStatus() },
  })

  const basics: BasicsMetadata | null = statusData?.basics ?? null
  const strengthCount = strengthData?.count ?? 0
  const isOnStrength = basics?.status === 'ON_STRENGTH' || basics?.status === 'STEADY_STATE'

  return (
    <div
      className="font-mono p-16 phone:p-24"
      style={{ backgroundColor: '#fff', color: '#000', minHeight: '100%' }}
    >
      <div className="max-w-[720px]">
        {/* MONTH 1: OPEN TAB LEDGER */}
        <ManifestLedger strengthCount={strengthCount} />

        {/* MONTH 2: UPGRADE STATE MACHINE */}
        <div className="mt-0">
          <UpgradeSection
            basics={basics}
            isUsership={isUsership}
            onUpgrade={() => doUpgrade()}
            onRosterSubmit={(r) => doRoster(r)}
            onStandDown={() => doStandDown()}
            upgradeLoading={upgradeLoading}
            rosterLoading={rosterLoading}
            standDownLoading={standDownLoading}
          />
        </div>

        {/* MONTH 3: ISSUE LOG */}
        {isOnStrength && (
          <div className="mt-0">
            <IssueLog
              issues={issuesData?.issues ?? []}
              nextIssue={issuesData?.nextIssue ?? null}
              cadenceStart={basics?.roster?.cadenceStart}
            />
          </div>
        )}

        {/* Footer */}
        <div className="border-2 border-black border-t-0 px-12 py-6 flex justify-between"
          style={{ borderRadius: 0 }}>
          <span className="text-[10px] uppercase tracking-widest opacity-30">
            LOT-FM-001 / BASIC RATION MODULE
          </span>
          <span className="text-[10px] uppercase tracking-widest opacity-30">
            LOT SYSTEMS CORP
          </span>
        </div>
      </div>
    </div>
  )
}
