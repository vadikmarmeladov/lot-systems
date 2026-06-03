/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// LOT-FM-001 / BASIC RATION — CIVILIAN ISSUE
// Month 1: OPEN TAB — ledger, doctrine, price line, status.
// Month 2: UPGRADE — state machine USERSHIP/AI → PENDING → ON STRENGTH.
// Month 3: ISSUE LOG — load engine, next issue, manifest card.

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import * as basicStores from '#client/stores/basics'
import { RATION_MANIFEST, getRationItemsForMonth } from '#shared/constants'
import type {
  RationStatus,
  RationSize,
  RationIssue,
  RationRoster,
  BasicRationMetadata,
} from '#shared/types'
import { UserTag } from '#shared/types'

// ─── Terminal style constants ─────────────────────────────────────────────────

const T: React.CSSProperties = {
  fontFamily: '"Liberation Mono", "IBM Plex Mono", "Courier New", Courier, monospace',
  fontWeight: 700,
  background: '#fff',
  color: '#000',
}

const BORDER = '2px solid #000'

const rule: React.CSSProperties = {
  borderTop: BORDER,
  margin: 0,
}

const sectionHeader: React.CSSProperties = {
  background: '#000',
  color: '#fff',
  padding: '2px 8px',
  fontFamily: T.fontFamily,
  fontWeight: 700,
  fontSize: '0.75rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
}

const cell: React.CSSProperties = {
  fontFamily: T.fontFamily,
  fontWeight: 700,
  fontSize: '0.75rem',
  padding: '2px 8px',
  verticalAlign: 'top',
  borderRight: BORDER,
  textTransform: 'uppercase' as const,
}

const cellLast: React.CSSProperties = { ...cell, borderRight: 'none' }

const row: React.CSSProperties = { borderBottom: '1px solid #000' }

// ─── Status line (Month 1) ────────────────────────────────────────────────────

function StatusLine({
  status,
  issueCount,
  nextIssueDate,
}: {
  status: RationStatus | null
  issueCount: number
  nextIssueDate: string | null
}) {
  let statusLabel = 'NOT ON STRENGTH'
  if (status === 'pending') statusLabel = 'PENDING — BILLING INITIATED'
  if (status === 'on-strength') statusLabel = 'ON STRENGTH'
  if (status === 'steady-state') statusLabel = `STEADY STATE / ISSUE ${issueCount}`

  return (
    <div
      style={{
        ...T,
        border: BORDER,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0,
        fontSize: '0.75rem',
      }}
    >
      <span
        style={{
          ...sectionHeader,
          background: status ? '#000' : '#fff',
          color: status ? '#fff' : '#000',
          borderRight: BORDER,
          padding: '4px 12px',
          flex: '0 0 auto',
        }}
      >
        {statusLabel}
      </span>
      <span style={{ padding: '4px 12px', flex: '1 0 auto', fontFamily: T.fontFamily, fontWeight: 700 }}>
        PRICE: USD 100.00 / MO
      </span>
      {nextIssueDate && (
        <span
          style={{
            padding: '4px 12px',
            flex: '0 0 auto',
            fontFamily: T.fontFamily,
            fontWeight: 700,
            borderLeft: BORDER,
          }}
        >
          NEXT ISSUE: {nextIssueDate}
        </span>
      )}
    </div>
  )
}

// ─── Doctrine panel (Month 1) ─────────────────────────────────────────────────

function DoctrinePanel() {
  return (
    <div style={{ ...T, border: BORDER }}>
      <div style={sectionHeader}>LOT-FM-001 / DOCTRINE</div>
      <div style={{ padding: '8px 12px', fontSize: '0.8rem', fontFamily: T.fontFamily, fontWeight: 700, lineHeight: '1.6' }}>
        <p style={{ margin: 0 }}>
          LOT ISSUES TO MEMBERS ON STRENGTH. NOT SOLD. THE LEDGER IS THE MARKETING.
        </p>
        <p style={{ margin: '4px 0 0' }}>
          NO LAYER BETWEEN PUBLIC AND MANIFEST. ONE SYSTEM. 23 ITEMS. PHYSICAL
          NECESSITIES ONLY. ISSUED MONTHLY ON CADENCE. ON STRENGTH MEANS YOU RECEIVE.
          STAND DOWN MEANS YOU STOP.
        </p>
        <p style={{ margin: '4px 0 0' }}>
          USD 100.00 / MO. ≥60% MARGIN. ≤USD 40.00 LANDED. NEVER BREACH THE CEILING.
        </p>
      </div>
    </div>
  )
}

// ─── Manifest ledger (Month 1) ────────────────────────────────────────────────

const SECTIONS = ['WARDROBE', 'PERSONAL CARE', 'HOUSEHOLD', 'TOOLS'] as const

function ManifestLedger() {
  const sections = SECTIONS.map((s) => ({
    name: s,
    items: RATION_MANIFEST.filter((i) => i.section === s),
  }))

  return (
    <div style={{ ...T, border: BORDER }}>
      <div style={sectionHeader}>RATION MANIFEST — LOT-FM-001 / {RATION_MANIFEST.length} ITEMS</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.fontFamily, fontWeight: 700, fontSize: '0.75rem' }}>
        <thead>
          <tr style={{ borderBottom: BORDER }}>
            <th style={{ ...cell, width: '70px', textAlign: 'left' }}>REF</th>
            <th style={{ ...cell, textAlign: 'left' }}>NOMENCLATURE</th>
            <th style={{ ...cellLast, width: '110px', textAlign: 'left' }}>CADENCE</th>
          </tr>
        </thead>
        <tbody>
          {sections.map(({ name, items }) => (
            <React.Fragment key={name}>
              <tr>
                <td colSpan={3} style={{ ...cell, borderRight: 'none', background: '#f4f4f4', padding: '2px 8px' }}>
                  — {name} —
                </td>
              </tr>
              {items.map((item) => (
                <tr key={item.id} style={row}>
                  <td style={cell}>{item.id}</td>
                  <td style={cell}>{item.nomenclature}</td>
                  <td style={cellLast}>{item.cadence}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Upgrade control (Month 2) ────────────────────────────────────────────────

function UpgradeControl({
  status,
  onUpgrade,
  onStandDown,
  loading,
}: {
  status: RationStatus | null
  onUpgrade: () => void
  onStandDown: () => void
  loading: boolean
}) {
  return (
    <div style={{ ...T, border: BORDER }}>
      <div style={sectionHeader}>UPGRADE — USERSHIP/AI → BASIC RATION</div>
      <div style={{ padding: '12px', fontFamily: T.fontFamily, fontWeight: 700, fontSize: '0.8rem' }}>
        {!status && (
          <>
            <div style={{ marginBottom: '8px', lineHeight: 1.6 }}>
              <span>RATION STATUS:&nbsp;</span>
              <span style={{ ...sectionHeader, background: '#fff', color: '#000', border: BORDER, display: 'inline', padding: '1px 6px' }}>
                NOT ON STRENGTH
              </span>
            </div>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '0.75rem', lineHeight: 1.6 }}>
              ADDS RATION TO EXISTING USERSHIP PLAN. AI RETAINED.
              BILLED SEPARATELY AT USD 100.00/MO. CANCEL AT ANY TIME WITH STAND DOWN.
            </div>
            <button
              onClick={onUpgrade}
              disabled={loading}
              style={{
                ...T,
                border: BORDER,
                padding: '8px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.08em',
                fontSize: '0.8rem',
                background: '#000',
                color: '#fff',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'PROCESSING...' : 'UPGRADE TO BASIC — USD 100.00/MO'}
            </button>
          </>
        )}

        {status === 'pending' && (
          <>
            <div style={{ marginBottom: '8px' }}>
              <span>RATION STATUS:&nbsp;</span>
              <span style={{ ...sectionHeader, display: 'inline', padding: '1px 8px' }}>
                PENDING — BILLING INITIATED
              </span>
            </div>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '0.75rem', lineHeight: 1.6 }}>
              RATION WILL ACTIVATE ON PAYMENT CONFIRMATION.
              COMPLETE ROSTER BELOW TO CONFIRM SHIPPING DETAILS.
            </div>
            <button
              onClick={onStandDown}
              disabled={loading}
              style={{
                ...T,
                border: BORDER,
                padding: '6px 18px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.75rem',
                opacity: loading ? 0.5 : 1,
              }}
            >
              CANCEL
            </button>
          </>
        )}

        {(status === 'on-strength' || status === 'steady-state') && (
          <>
            <div style={{ marginBottom: '8px' }}>
              <span>RATION STATUS:&nbsp;</span>
              <span style={{ ...sectionHeader, display: 'inline', padding: '1px 8px' }}>
                {status === 'steady-state' ? 'STEADY STATE' : 'ON STRENGTH'}
              </span>
            </div>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '0.75rem', lineHeight: 1.6 }}>
              MONTHLY RATION ACTIVE. STAND DOWN TO STOP RATION.
              AI PLAN RETAINED AFTER STAND DOWN.
            </div>
            <button
              onClick={onStandDown}
              disabled={loading}
              style={{
                ...T,
                border: BORDER,
                padding: '6px 18px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.75rem',
                opacity: loading ? 0.5 : 1,
              }}
            >
              STAND DOWN
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Roster intake (Month 2) ─────────────────────────────────────────────────

const SIZES: RationSize[] = ['XS', 'S', 'M', 'L', 'XL']

function RosterIntake({
  roster,
  onSave,
  loading,
}: {
  roster: RationRoster | null
  onSave: (r: RationRoster) => void
  loading: boolean
}) {
  const me = useStore(stores.me)
  const [size, setSize] = React.useState<RationSize>(roster?.size || 'M')
  const [address, setAddress] = React.useState(roster?.address || me?.address || '')
  const [city, setCity] = React.useState(roster?.city || me?.city || '')
  const [country, setCountry] = React.useState(roster?.country || me?.country || '')
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    onSave({ size, address, city, country, cadenceStart: null })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: T.fontFamily,
    fontWeight: 700,
    fontSize: '0.75rem',
    border: BORDER,
    padding: '4px 8px',
    background: '#fff',
    color: '#000',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    borderRadius: 0,
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: T.fontFamily,
    fontWeight: 700,
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: '2px',
  }

  return (
    <div style={{ ...T, border: BORDER }}>
      <div style={sectionHeader}>ROSTER — SIZING + SHIPPING</div>
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={labelStyle}>SIZING</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  ...T,
                  border: BORDER,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  background: size === s ? '#000' : '#fff',
                  color: size === s ? '#fff' : '#000',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>SHIP TO — ADDRESS</label>
          <input
            style={inputStyle}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="STREET ADDRESS"
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>CITY</label>
            <input
              style={inputStyle}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="CITY"
            />
          </div>
          <div style={{ flex: '0 0 120px' }}>
            <label style={labelStyle}>COUNTRY</label>
            <input
              style={inputStyle}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="US"
              maxLength={3}
            />
          </div>
        </div>
        <div>
          <button
            onClick={handleSave}
            disabled={loading || !address || !city || !country}
            style={{
              ...T,
              border: BORDER,
              padding: '6px 20px',
              cursor: loading || !address || !city || !country ? 'not-allowed' : 'pointer',
              fontSize: '0.75rem',
              background: saved ? '#000' : '#fff',
              color: saved ? '#fff' : '#000',
              opacity: loading || !address || !city || !country ? 0.4 : 1,
            }}
          >
            {saved ? 'ROSTER CONFIRMED' : loading ? 'SAVING...' : 'CONFIRM ROSTER'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Issue log (Month 3) ─────────────────────────────────────────────────────

function IssueLog({
  issues,
  nextIssueDate,
  issueCount,
}: {
  issues: RationIssue[]
  nextIssueDate: string | null
  issueCount: number
}) {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const nextIssueNumber = issueCount + 1
  const nextItems = getRationItemsForMonth(nextIssueNumber)

  return (
    <div style={{ ...T, border: BORDER }}>
      <div style={sectionHeader}>ISSUE LOG — {issueCount} ISSUED</div>

      {issues.length === 0 && (
        <div style={{ padding: '12px', fontSize: '0.75rem', fontFamily: T.fontFamily, fontWeight: 700, color: '#555' }}>
          NO ISSUES RECORDED. FIRST ISSUE PENDING.
        </div>
      )}

      {issues.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.fontFamily, fontWeight: 700, fontSize: '0.75rem' }}>
          <thead>
            <tr style={{ borderBottom: BORDER }}>
              <th style={{ ...cell, width: '80px', textAlign: 'left' }}>ISSUE</th>
              <th style={{ ...cell, width: '110px', textAlign: 'left' }}>DATE</th>
              <th style={{ ...cell, textAlign: 'left' }}>STATUS</th>
              <th style={{ ...cellLast, width: '90px', textAlign: 'left' }}>TRACKING</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <React.Fragment key={issue.id}>
                <tr
                  style={{ ...row, cursor: 'pointer' }}
                  onClick={() => setExpanded(expanded === issue.id ? null : issue.id)}
                >
                  <td style={cell}>ISS-{String(issue.issueNumber).padStart(3, '0')}</td>
                  <td style={cell}>{issue.shippedAt ? issue.shippedAt.slice(0, 10) : `${issue.year}-${String(issue.month).padStart(2, '0')}-01`}</td>
                  <td style={cell}>{issue.status.toUpperCase()}</td>
                  <td style={cellLast}>{issue.trackingNumber || '—'}</td>
                </tr>
                {expanded === issue.id && (
                  <tr>
                    <td colSpan={4} style={{ ...cell, borderRight: 'none', background: '#f8f8f8', lineHeight: 1.8 }}>
                      {issue.items.join(' · ')}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {/* Next issue preview */}
      <div style={{ borderTop: BORDER }}>
        <div style={{ ...sectionHeader, background: '#333' }}>
          NEXT ISSUE: ISS-{String(nextIssueNumber).padStart(3, '0')}
          {nextIssueDate ? ` / ${nextIssueDate}` : ''}
        </div>
        <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontFamily: T.fontFamily, fontWeight: 700, lineHeight: 1.8 }}>
          {nextItems.map((i) => i.id).join(' · ')}
          <span style={{ color: '#888', marginLeft: '8px' }}>
            ({nextItems.length} ITEMS)
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Manifest card (Month 3) — printable single-page manifest ─────────────────

function ManifestCard({ issue, roster }: { issue: RationIssue; roster: RationRoster | null }) {
  const items = RATION_MANIFEST.filter((i) => issue.items.includes(i.id))
  const lines = [
    `LOT® BASIC RATION — ISSUE ${String(issue.issueNumber).padStart(3, '0')}`,
    `LOT-FM-001 / ${issue.year}-${String(issue.month).padStart(2, '0')}`,
    '─'.repeat(48),
    ...items.map((i) => `${i.id.padEnd(6)} ${i.nomenclature}`),
    '─'.repeat(48),
    `SHIP TO: ${roster?.address || '—'}, ${roster?.city || '—'}, ${roster?.country || '—'}`,
    `SIZE: ${roster?.size || '—'}`,
    `ISSUED BY LOT SYSTEMS CORPORATION`,
  ]
  return (
    <div style={{ ...T, border: BORDER }}>
      <div style={sectionHeader}>MANIFEST CARD — ISS-{String(issue.issueNumber).padStart(3, '0')}</div>
      <pre
        style={{
          fontFamily: T.fontFamily,
          fontWeight: 700,
          fontSize: '0.7rem',
          padding: '10px 12px',
          margin: 0,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
        }}
      >
        {lines.join('\n')}
      </pre>
    </div>
  )
}

// ─── Main BasicsTab component ─────────────────────────────────────────────────

export const BasicsTab: React.FC = () => {
  const me = useStore(stores.me)
  const status = useStore(basicStores.rationStatus)
  const roster = useStore(basicStores.rationRoster)
  const issueCount = useStore(basicStores.rationIssueCount)
  const nextIssueDate = useStore(basicStores.rationNextIssueDate)
  const issues = useStore(basicStores.rationIssues)
  const loading = useStore(basicStores.rationLoading)

  const isAuthenticated = !!me
  const isUsership = me?.tags?.includes(UserTag.Usership) || me?.tags?.includes(UserTag.Basic)
  const isOnStrength = status === 'on-strength' || status === 'steady-state'

  // Load ration status on mount
  React.useEffect(() => {
    if (!isAuthenticated) return
    basicStores.rationLoading.set(true)
    fetch('/api/basics/status')
      .then((r) => r.json())
      .then((data: BasicRationMetadata & { issues?: RationIssue[] }) => {
        basicStores.rationStatus.set(data.status)
        basicStores.rationRoster.set(data.roster)
        basicStores.rationIssueCount.set(data.issueCount)
        basicStores.rationNextIssueDate.set(data.nextIssueDate)
        if (data.issues) basicStores.rationIssues.set(data.issues)
      })
      .catch(() => basicStores.rationError.set('LOAD FAILED'))
      .finally(() => basicStores.rationLoading.set(false))
  }, [isAuthenticated])

  const handleUpgrade = () => {
    basicStores.rationLoading.set(true)
    fetch('/api/basics/upgrade', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        basicStores.rationStatus.set(data.status)
      })
      .catch(() => basicStores.rationError.set('UPGRADE FAILED'))
      .finally(() => basicStores.rationLoading.set(false))
  }

  const handleStandDown = () => {
    basicStores.rationLoading.set(true)
    fetch('/api/basics/stand-down', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        basicStores.rationStatus.set(data.status)
        basicStores.rationIssues.set([])
        basicStores.rationIssueCount.set(0)
        basicStores.rationNextIssueDate.set(null)
      })
      .catch(() => basicStores.rationError.set('STAND DOWN FAILED'))
      .finally(() => basicStores.rationLoading.set(false))
  }

  const handleRosterSave = (r: RationRoster) => {
    basicStores.rationLoading.set(true)
    fetch('/api/basics/roster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    })
      .then((res) => res.json())
      .then((data) => {
        basicStores.rationRoster.set(data.roster)
        if (data.status) basicStores.rationStatus.set(data.status)
        if (data.nextIssueDate) basicStores.rationNextIssueDate.set(data.nextIssueDate)
      })
      .catch(() => basicStores.rationError.set('ROSTER SAVE FAILED'))
      .finally(() => basicStores.rationLoading.set(false))
  }

  // Most recent shipped issue for manifest card preview
  const latestShippedIssue = issues.find((i) => i.status === 'shipped' || i.status === 'delivered')

  return (
    <div
      style={{
        ...T,
        minHeight: '100vh',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>

        {/* ── Month 1: Doctrine ───────────────────────────────────────────────── */}
        <DoctrinePanel />
        <div style={{ height: '2px', background: '#fff' }} />

        {/* ── Month 1: Status line ────────────────────────────────────────────── */}
        <StatusLine status={status} issueCount={issueCount} nextIssueDate={nextIssueDate} />
        <div style={{ height: '2px', background: '#fff' }} />

        {/* ── Month 1: Manifest ledger ────────────────────────────────────────── */}
        <ManifestLedger />

        {/* ── Month 2: Upgrade control (authenticated users only) ─────────────── */}
        {isAuthenticated && isUsership && (
          <>
            <div style={{ height: '2px', background: '#fff' }} />
            <UpgradeControl
              status={status}
              onUpgrade={handleUpgrade}
              onStandDown={handleStandDown}
              loading={loading}
            />
          </>
        )}

        {/* ── Month 2: Roster intake (shown when pending or on-strength) ─────── */}
        {isAuthenticated && (status === 'pending' || isOnStrength) && (
          <>
            <div style={{ height: '2px', background: '#fff' }} />
            <RosterIntake roster={roster} onSave={handleRosterSave} loading={loading} />
          </>
        )}

        {/* ── Month 3: Issue log (on-strength members) ────────────────────────── */}
        {isAuthenticated && isOnStrength && (
          <>
            <div style={{ height: '2px', background: '#fff' }} />
            <IssueLog issues={issues} nextIssueDate={nextIssueDate} issueCount={issueCount} />
          </>
        )}

        {/* ── Month 3: Latest manifest card ──────────────────────────────────── */}
        {isAuthenticated && latestShippedIssue && (
          <>
            <div style={{ height: '2px', background: '#fff' }} />
            <ManifestCard issue={latestShippedIssue} roster={roster} />
          </>
        )}

        {/* ── Open tab notice for non-authenticated visitors ─────────────────── */}
        {!isAuthenticated && (
          <>
            <div style={{ height: '2px', background: '#fff' }} />
            <div
              style={{
                ...T,
                border: BORDER,
                padding: '10px 12px',
                fontSize: '0.75rem',
                lineHeight: 1.6,
              }}
            >
              <span style={{ ...sectionHeader, display: 'inline', padding: '1px 6px', marginRight: '8px' }}>
                OPEN TAB
              </span>
              LEDGER IS PUBLIC. UPGRADE REQUIRES USERSHIP. SIGN IN TO GO ON STRENGTH.
            </div>
          </>
        )}

      </div>
    </div>
  )
}
