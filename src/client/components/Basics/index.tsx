/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 — BASICS (RATION) MODULE
 *
 * MONTH 1: OPEN TAB — ledger + doctrine + price line (read-only, public)
 * MONTH 2: UPGRADE — state machine USERSHIP/AI → PENDING → ON STRENGTH → STEADY STATE
 * MONTH 3: ISSUE ENGINE — monthly load, next issue, issue log
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { UserTag } from '#shared/types'
import {
  MANIFEST,
  CADENCE_LABELS,
  DOCTRINE,
  PRICE_LINE,
  getMonthLoad,
  getMonthCogs,
  MONTHLY_COGS_PRORATED,
} from './manifest'
import { basicsState, nextFirstOfMonth, computeNextIssueDate } from './store'
import type { RationStatus, RosterRecord, IssueEntry } from './types'

// ── Terminal style tokens ──────────────────────────────────────────────────
const T = {
  font: "'Liberation Mono', 'Courier New', Courier, monospace",
  fontWeight: 700,
  color: '#000',
  bg: '#fff',
  inv: { color: '#fff', background: '#000' },
  border: '2px solid #000',
  borderThin: '1px solid #000',
  radius: 0,
  lineHeight: 1.4,
  letterSpacing: '0.04em',
} as const

const S: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: T.font,
    fontWeight: T.fontWeight,
    color: T.color,
    background: T.bg,
    minHeight: '100vh',
    padding: '32px 24px',
    maxWidth: 720,
    margin: '0 auto',
    lineHeight: T.lineHeight,
    letterSpacing: T.letterSpacing,
  },
  rule: {
    display: 'block',
    borderTop: T.border,
    margin: '0',
  },
  ruleThin: {
    display: 'block',
    borderTop: T.borderThin,
    margin: '0',
  },
  section: {
    marginBottom: 32,
  },
  headerInv: {
    ...T.inv,
    padding: '4px 8px',
    fontSize: 11,
    letterSpacing: '0.12em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    letterSpacing: '0.12em',
    opacity: 0.5,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    letterSpacing: '0.06em',
    padding: '12px 0',
  },
  doctrine: {
    fontSize: 12,
    lineHeight: 1.7,
    whiteSpace: 'pre-line' as const,
    padding: '16px 0',
    maxWidth: 520,
  },
  ledgerRow: {
    display: 'grid',
    gridTemplateColumns: '3ch 1fr auto',
    gap: '0 16px',
    padding: '6px 8px',
    fontSize: 12,
    alignItems: 'center',
    borderBottom: T.borderThin,
  },
  ledgerRowInv: {
    display: 'grid',
    gridTemplateColumns: '3ch 1fr auto',
    gap: '0 16px',
    padding: '6px 8px',
    fontSize: 12,
    alignItems: 'center',
    ...T.inv,
  },
  ledgerHead: {
    display: 'grid',
    gridTemplateColumns: '3ch 1fr auto',
    gap: '0 16px',
    padding: '4px 8px',
    fontSize: 10,
    letterSpacing: '0.12em',
    borderBottom: T.border,
  },
  statusLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 10,
    letterSpacing: '0.12em',
    padding: '6px 0',
    opacity: 0.6,
  },
  btn: {
    fontFamily: T.font,
    fontWeight: T.fontWeight,
    letterSpacing: T.letterSpacing,
    fontSize: 12,
    border: T.border,
    borderRadius: T.radius,
    padding: '8px 20px',
    cursor: 'pointer',
    background: T.bg,
    color: T.color,
    transition: 'background 80ms, color 80ms',
  },
  btnInv: {
    fontFamily: T.font,
    fontWeight: T.fontWeight,
    letterSpacing: T.letterSpacing,
    fontSize: 12,
    border: T.border,
    borderRadius: T.radius,
    padding: '8px 20px',
    cursor: 'pointer',
    background: '#000',
    color: '#fff',
  },
  btnDanger: {
    fontFamily: T.font,
    fontWeight: T.fontWeight,
    letterSpacing: T.letterSpacing,
    fontSize: 12,
    border: T.border,
    borderRadius: T.radius,
    padding: '8px 20px',
    cursor: 'pointer',
    background: T.bg,
    color: T.color,
  },
  input: {
    fontFamily: T.font,
    fontWeight: T.fontWeight,
    fontSize: 12,
    border: T.border,
    borderRadius: T.radius,
    padding: '6px 8px',
    background: T.bg,
    color: T.color,
    width: '100%',
    boxSizing: 'border-box' as const,
    letterSpacing: T.letterSpacing,
    outline: 'none',
  },
  fieldGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 12,
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  fieldFull: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
    gridColumn: '1 / -1',
  },
  chip: {
    fontSize: 10,
    letterSpacing: '0.12em',
    border: T.border,
    padding: '2px 8px',
    display: 'inline-block',
  },
  chipInv: {
    fontSize: 10,
    letterSpacing: '0.12em',
    border: T.border,
    padding: '2px 8px',
    display: 'inline-block',
    background: '#000',
    color: '#fff',
  },
  issueRow: {
    display: 'grid',
    gridTemplateColumns: '6ch 1fr auto auto',
    gap: '0 12px',
    padding: '6px 8px',
    fontSize: 12,
    borderBottom: T.borderThin,
    alignItems: 'center',
  },
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()
}

function issueMonthNumber(enrolledAt: string, issueDate: string): number {
  const start = new Date(enrolledAt)
  const issue = new Date(issueDate)
  const years = issue.getFullYear() - start.getFullYear()
  const months = issue.getMonth() - start.getMonth()
  return years * 12 + months + 1
}

function daysUntil(iso: string): number {
  const now = new Date()
  const target = new Date(iso)
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000))
}

// ── Month 1: Ledger + Doctrine ─────────────────────────────────────────────

function LedgerSection() {
  const [expanded, setExpanded] = React.useState(true)

  return (
    <section style={S.section}>
      <div style={S.rule} />
      <div style={S.headerInv}>
        <span>SECTION 1 — MANIFEST</span>
        <span style={{ opacity: 0.6, fontSize: 10 }}>23 ITEMS</span>
      </div>

      {expanded && (
        <>
          <div style={S.ledgerHead}>
            <span>#</span>
            <span>NOMENCLATURE</span>
            <span>CADENCE</span>
          </div>
          {MANIFEST.map((item, i) => {
            const isInv = i % 2 === 0
            const rowStyle = isInv ? S.ledgerRowInv : { ...S.ledgerRow, background: '#f8f8f8' }
            return (
              <div key={item.id} style={rowStyle}>
                <span style={{ opacity: 0.5 }}>{item.id}</span>
                <span>{item.nomenclature}</span>
                <span style={{ whiteSpace: 'nowrap', fontSize: 10, letterSpacing: '0.1em' }}>
                  {CADENCE_LABELS[item.cadence]}
                </span>
              </div>
            )
          })}
          <div style={S.rule} />
        </>
      )}
    </section>
  )
}

// ── Month 1: Doctrine + Price ──────────────────────────────────────────────

function DoctrineSection() {
  return (
    <section style={S.section}>
      <div style={S.rule} />
      <div style={S.headerInv}>
        <span>SECTION 2 — DOCTRINE</span>
      </div>
      <p style={S.doctrine}>{DOCTRINE}</p>
      <div style={S.rule} />
      <div style={{ ...S.price, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{PRICE_LINE}</span>
      </div>
      <div style={S.rule} />
    </section>
  )
}

// ── Month 2: Upgrade state machine ─────────────────────────────────────────

type RosterFormState = {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

const EMPTY_ROSTER: RosterFormState = {
  firstName: '', lastName: '', address: '',
  city: '', state: '', zip: '', country: 'US',
}

function UpgradeSection() {
  const me = useStore(stores.me)
  const state = useStore(basicsState)
  const [form, setForm] = React.useState<RosterFormState>(EMPTY_ROSTER)
  const [showRoster, setShowRoster] = React.useState(false)
  const [confirmStandDown, setConfirmStandDown] = React.useState(false)

  const hasUsership = me?.tags?.includes(UserTag.Usership) || me?.tags?.includes(UserTag.Admin)

  const set = (field: keyof RosterFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value.toUpperCase() }))

  const handleUpgrade = () => {
    if (!showRoster) { setShowRoster(true); return }
    // Validate required fields
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'country'] as const
    if (required.some((k) => !form[k].trim())) return

    const cadenceStart = nextFirstOfMonth()
    const roster: RosterRecord = { ...form, cadenceStart }
    const enrolledAt = new Date().toISOString()

    basicsState.set({
      ...state,
      status: 'PENDING',
      roster,
      enrolledAt,
      nextIssueDate: cadenceStart,
    })
    setShowRoster(false)
  }

  // Simulate billing confirmation (in production: webhook from Stripe)
  const handleConfirmBilling = () => {
    basicsState.set({ ...state, status: 'ON_STRENGTH' })
  }

  const handleStandDown = () => {
    if (!confirmStandDown) { setConfirmStandDown(true); return }
    basicsState.set({ ...DEFAULT_BASICS_STATE, status: 'OFF' })
    setConfirmStandDown(false)
  }

  const cancelStandDown = () => setConfirmStandDown(false)

  const STATUS_LABELS: Record<RationStatus, string> = {
    OFF:          'NOT ENROLLED',
    PENDING:      'PENDING — AWAITING BILLING CONFIRMATION',
    ON_STRENGTH:  'ON STRENGTH — FIRST ISSUE PENDING',
    STEADY_STATE: 'STEADY STATE — RATION ACTIVE',
  }

  return (
    <section style={S.section}>
      <div style={S.rule} />
      <div style={S.headerInv}>
        <span>SECTION 3 — STATUS &amp; UPGRADE</span>
        <span style={{ fontSize: 10, opacity: 0.8 }}>{STATUS_LABELS[state.status]}</span>
      </div>

      <div style={{ padding: '16px 0' }}>

        {/* Current status chip */}
        <div style={{ marginBottom: 16 }}>
          <span style={state.status === 'OFF' ? S.chip : S.chipInv}>
            {state.status}
          </span>
        </div>

        {/* OFF: show upgrade path */}
        {state.status === 'OFF' && (
          <>
            {!hasUsership && (
              <p style={{ fontSize: 11, marginBottom: 12, opacity: 0.7 }}>
                REQUIRES USERSHIP (AI) — $99/MO PREREQUISITE.
              </p>
            )}
            {!showRoster ? (
              <button
                style={hasUsership ? S.btnInv : { ...S.btn, opacity: 0.4, cursor: 'not-allowed' }}
                disabled={!hasUsership}
                onClick={handleUpgrade}
              >
                UPGRADE TO BASIC — +$100/MO
              </button>
            ) : (
              <RosterForm
                form={form}
                set={set}
                onSubmit={handleUpgrade}
                onCancel={() => setShowRoster(false)}
              />
            )}
          </>
        )}

        {/* PENDING: show confirmation */}
        {state.status === 'PENDING' && (
          <div>
            <p style={{ fontSize: 11, marginBottom: 12, opacity: 0.7 }}>
              BILLING INITIATED. FIRST ISSUE: {state.nextIssueDate ? formatDate(state.nextIssueDate) : '—'}.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
              <button style={S.btnInv} onClick={handleConfirmBilling}>
                CONFIRM BILLING CLEARED
              </button>
              <button style={S.btn} onClick={handleStandDown}>
                CANCEL
              </button>
            </div>
            <RosterSummary roster={state.roster} />
          </div>
        )}

        {/* ON_STRENGTH or STEADY_STATE */}
        {(state.status === 'ON_STRENGTH' || state.status === 'STEADY_STATE') && (
          <div>
            <RosterSummary roster={state.roster} />
            <div style={{ marginTop: 16 }}>
              {!confirmStandDown ? (
                <button style={S.btn} onClick={handleStandDown}>
                  STAND DOWN — CANCEL RATION
                </button>
              ) : (
                <div>
                  <p style={{ fontSize: 11, marginBottom: 10, letterSpacing: '0.08em' }}>
                    CONFIRM STAND DOWN. RATION DROPS. AI PLAN RETAINED.
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button style={S.btnDanger} onClick={handleStandDown}>
                      CONFIRM STAND DOWN
                    </button>
                    <button style={S.btnInv} onClick={cancelStandDown}>
                      HOLD POSITION
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={S.rule} />
    </section>
  )
}

const DEFAULT_BASICS_STATE = {
  status: 'OFF' as RationStatus,
  roster: null,
  issues: [],
  enrolledAt: null,
  nextIssueDate: null,
}

function RosterSummary({ roster }: { roster: RosterRecord | null }) {
  if (!roster) return null
  return (
    <div style={{ marginTop: 16, padding: '12px', border: '1px solid #000', fontSize: 11 }}>
      <div style={{ ...S.label, marginBottom: 8 }}>ROSTER ENTRY</div>
      <div>{roster.firstName} {roster.lastName}</div>
      <div>{roster.address}</div>
      <div>{roster.city}, {roster.state} {roster.zip}</div>
      <div>{roster.country}</div>
    </div>
  )
}

function RosterForm({
  form,
  set,
  onSubmit,
  onCancel,
}: {
  form: RosterFormState
  set: (field: keyof RosterFormState) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  onCancel: () => void
}) {
  return (
    <div style={{ border: '2px solid #000', padding: 16, marginBottom: 16 }}>
      <div style={{ ...S.headerInv, marginBottom: 16 }}>ROSTER INTAKE</div>
      <div style={S.fieldGroup}>
        <Field label="FIRST NAME" value={form.firstName} onChange={set('firstName')} />
        <Field label="LAST NAME" value={form.lastName} onChange={set('lastName')} />
        <Field label="ADDRESS" value={form.address} onChange={set('address')} full />
        <Field label="CITY" value={form.city} onChange={set('city')} />
        <Field label="STATE / PROVINCE" value={form.state} onChange={set('state')} />
        <Field label="ZIP / POSTAL" value={form.zip} onChange={set('zip')} />
        <Field label="COUNTRY" value={form.country} onChange={set('country')} />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button style={S.btnInv} onClick={onSubmit}>
          CONFIRM ROSTER — INITIATE $100/MO
        </button>
        <button style={S.btn} onClick={onCancel}>
          CANCEL
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  full,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  full?: boolean
}) {
  return (
    <div style={full ? S.fieldFull : S.field}>
      <span style={S.label}>{label}</span>
      <input style={S.input} value={value} onChange={onChange} />
    </div>
  )
}

// ── Month 3: Issue Engine ──────────────────────────────────────────────────

function IssueSection() {
  const state = useStore(basicsState)
  const me = useStore(stores.me)
  const isActive =
    state.status === 'ON_STRENGTH' || state.status === 'STEADY_STATE'

  // Advance to STEADY_STATE after first issue is dispatched
  const handleDispatch = (issueNumber: number) => {
    const updated = state.issues.map((e) =>
      e.issueNumber === issueNumber ? { ...e, status: 'DISPATCHED' as const } : e
    )
    basicsState.set({
      ...state,
      status: 'STEADY_STATE',
      issues: updated,
      nextIssueDate: state.enrolledAt
        ? computeNextIssueDate(
            new Date(
              new Date(state.nextIssueDate!).getTime() + 30 * 86400000
            ).toISOString()
          )
        : state.nextIssueDate,
    })
  }

  const handleSchedule = () => {
    if (!state.nextIssueDate || !state.enrolledAt) return
    const monthNum = issueMonthNumber(state.enrolledAt, state.nextIssueDate)
    const items = getMonthLoad(monthNum)
    const entry: IssueEntry = {
      issueNumber: (state.issues.length || 0) + 1,
      issuedAt: state.nextIssueDate,
      itemIds: items.map((i) => i.id),
      status: 'SCHEDULED',
    }
    basicsState.set({ ...state, issues: [...state.issues, entry] })
  }

  if (!isActive) {
    return (
      <section style={S.section}>
        <div style={S.rule} />
        <div style={S.headerInv}>
          <span>SECTION 4 — ISSUE LOG</span>
        </div>
        <p style={{ fontSize: 11, padding: '16px 0', opacity: 0.5 }}>
          NOT ENROLLED. NO ISSUES ON RECORD.
        </p>
        <div style={S.rule} />
      </section>
    )
  }

  const nextDate = state.nextIssueDate
  const days = nextDate ? daysUntil(nextDate) : null
  const nextMonthNum = state.enrolledAt && nextDate
    ? issueMonthNumber(state.enrolledAt, nextDate)
    : 1
  const nextLoad = getMonthLoad(nextMonthNum)
  const nextCogs = getMonthCogs(nextMonthNum)
  const nextMargin = ((100 - nextCogs) / 100 * 100).toFixed(1)
  const isAdmin = me?.isAdmin

  const scheduledEntry = state.issues.find((e) => e.status === 'SCHEDULED' && e.issueNumber === (state.issues.length || 1))
  const canSchedule = !scheduledEntry

  return (
    <section style={S.section}>
      <div style={S.rule} />
      <div style={S.headerInv}>
        <span>SECTION 4 — ISSUE ENGINE</span>
        <span style={{ fontSize: 10, opacity: 0.8 }}>
          {nextDate ? `NEXT ISSUE: ${formatDate(nextDate)} (T-${days}D)` : '—'}
        </span>
      </div>

      {/* Next issue load preview */}
      <div style={{ padding: '12px 0' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.12em', opacity: 0.5, marginBottom: 8 }}>
          ISSUE #{nextMonthNum} LOAD — {nextLoad.length} ITEMS
        </div>
        {nextLoad.map((item) => (
          <div
            key={item.id}
            style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #eee' }}
          >
            <span>{item.nomenclature}</span>
            <span style={{ opacity: 0.4, fontSize: 10 }}>{CADENCE_LABELS[item.cadence]}</span>
          </div>
        ))}

        {/* COGS line — admin only, never public */}
        {isAdmin && (
          <div style={{ marginTop: 12, padding: '8px', border: '1px solid #000', fontSize: 11 }}>
            <div style={S.label}>INTERNAL — COGS VERIFICATION</div>
            <div style={{ display: 'flex', gap: 32 }}>
              <div>COGS: ${nextCogs.toFixed(2)}</div>
              <div>MARGIN: {nextMargin}%</div>
              <div style={{ color: parseFloat(nextMargin) >= 60 ? '#000' : '#000', fontWeight: 700 }}>
                {parseFloat(nextMargin) >= 60 ? '✓ CEILING CLEAR' : '✗ BREACH — REBALANCE'}
              </div>
            </div>
          </div>
        )}

        {/* Schedule / dispatch controls */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' as const }}>
          {canSchedule && (
            <button style={S.btn} onClick={handleSchedule}>
              SCHEDULE ISSUE #{nextMonthNum}
            </button>
          )}
          {scheduledEntry && scheduledEntry.status === 'SCHEDULED' && (
            <button style={S.btnInv} onClick={() => handleDispatch(scheduledEntry.issueNumber)}>
              MARK DISPATCHED — ISSUE #{scheduledEntry.issueNumber}
            </button>
          )}
        </div>
      </div>

      {/* Issue log */}
      {state.issues.length > 0 && (
        <>
          <div style={{ ...S.headerInv, marginTop: 16 }}>
            <span>ISSUE LOG</span>
            <span style={{ fontSize: 10, opacity: 0.8 }}>{state.issues.length} ISSUED</span>
          </div>
          <div style={{ ...S.issueRow, fontSize: 10, letterSpacing: '0.1em', borderBottom: '2px solid #000' }}>
            <span>ISSUE #</span>
            <span>DATE</span>
            <span>ITEMS</span>
            <span>STATUS</span>
          </div>
          {state.issues.map((entry) => (
            <div key={entry.issueNumber} style={S.issueRow}>
              <span>#{entry.issueNumber}</span>
              <span>{formatDate(entry.issuedAt)}</span>
              <span>{entry.itemIds.length}</span>
              <span style={{ fontSize: 10, letterSpacing: '0.08em' }}>{entry.status}</span>
            </div>
          ))}
        </>
      )}

      <div style={{ ...S.rule, marginTop: 16 }} />
    </section>
  )
}

// ── Month 1: Status line ───────────────────────────────────────────────────

function StatusLine() {
  const state = useStore(basicsState)
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16)

  return (
    <div style={{ ...S.statusLine, borderTop: '1px solid #000', paddingTop: 8, marginTop: 8 }}>
      <span>LOT-FM-001 / BASIC RATION / REV 1</span>
      <span>STATUS: {state.status}</span>
      <span>{now} UTC</span>
    </div>
  )
}

// ── Root component ─────────────────────────────────────────────────────────

export function Basics() {
  return (
    <div style={S.page}>
      {/* Page header — inverted */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ ...T.inv, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
          <span style={{ fontSize: 14, letterSpacing: '0.1em' }}>LOT® BASIC</span>
          <span style={{ fontSize: 10, letterSpacing: '0.12em', opacity: 0.7 }}>CIVILIAN RATION SUBSCRIPTION</span>
        </div>
        <div style={{ borderBottom: '2px solid #000' }} />
      </div>

      <DoctrineSection />
      <LedgerSection />
      <UpgradeSection />
      <IssueSection />
      <StatusLine />
    </div>
  )
}
