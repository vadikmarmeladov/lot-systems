/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | Made in the USA
 *
 * BASICS — LOT-FM-001 / SELF-ASSEMBLY DIRECTIVE
 * MODULE: BASIC (RATION) — 90-DAY BUILD
 *
 * Month 1: LEDGER & DOCTRINE (read-only open tab)
 * Month 2: UPGRADE & ROSTER (USERSHIP/AI → ON STRENGTH)
 * Month 3: ISSUE & FULFILLMENT (monthly load engine, issue log)
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { cn } from '#client/utils'

// ─── MANIFEST ── LOT-FM-001 SECTION 2 — 23-ITEM RATION LOAD ─────────────────
const MANIFEST: { seq: string; nomenclature: string; cadence: 'MONTHLY' | 'QUARTERLY' }[] = [
  { seq: '001', nomenclature: 'NUTRITION BAR, 4-PACK', cadence: 'MONTHLY' },
  { seq: '002', nomenclature: 'ELECTROLYTE TABLET, 10-PACK', cadence: 'MONTHLY' },
  { seq: '003', nomenclature: 'INSTANT COFFEE, 8-PACK', cadence: 'MONTHLY' },
  { seq: '004', nomenclature: 'MULTIVITAMIN, 30-COUNT', cadence: 'MONTHLY' },
  { seq: '005', nomenclature: 'VITAMIN C (500MG), 30-COUNT', cadence: 'MONTHLY' },
  { seq: '006', nomenclature: 'FISH OIL (1000MG), 30-COUNT', cadence: 'MONTHLY' },
  { seq: '007', nomenclature: 'MAGNESIUM GLYCINATE (400MG), 30-COUNT', cadence: 'MONTHLY' },
  { seq: '008', nomenclature: 'ADHESIVE BANDAGE, ASSORTED, 20-COUNT', cadence: 'MONTHLY' },
  { seq: '009', nomenclature: 'ALCOHOL PREP PAD, 10-COUNT', cadence: 'MONTHLY' },
  { seq: '010', nomenclature: 'IBUPROFEN (200MG), 12-TABLET', cadence: 'MONTHLY' },
  { seq: '011', nomenclature: 'ANTACID TABLET, 12-COUNT', cadence: 'MONTHLY' },
  { seq: '012', nomenclature: 'HAND SANITIZER, 2OZ', cadence: 'MONTHLY' },
  { seq: '013', nomenclature: 'LIP BALM SPF 15', cadence: 'MONTHLY' },
  { seq: '014', nomenclature: 'SUNSCREEN SPF 50, 1OZ TRAVEL', cadence: 'MONTHLY' },
  { seq: '015', nomenclature: 'NITRILE GLOVE PAIR, 2-COUNT', cadence: 'MONTHLY' },
  { seq: '016', nomenclature: 'COMPRESSED PAPER TOWEL, 10-COUNT', cadence: 'MONTHLY' },
  { seq: '017', nomenclature: 'DENTAL FLOSS PICK, 30-COUNT', cadence: 'MONTHLY' },
  { seq: '018', nomenclature: 'ANTIHISTAMINE (CETIRIZINE 10MG), 6-TABLET', cadence: 'QUARTERLY' },
  { seq: '019', nomenclature: 'MELATONIN (3MG), 10-TABLET', cadence: 'QUARTERLY' },
  { seq: '020', nomenclature: 'MICROFIBER CLOTH, 2-PACK', cadence: 'QUARTERLY' },
  { seq: '021', nomenclature: 'CABLE TIE (ZIP), 25-COUNT', cadence: 'QUARTERLY' },
  { seq: '022', nomenclature: 'DUCT TAPE, MINI ROLL, 10FT', cadence: 'QUARTERLY' },
  { seq: '023', nomenclature: 'POCKET NOTEBOOK, FIELD GRADE', cadence: 'QUARTERLY' },
]

const MONTHLY_COUNT = MANIFEST.filter((i) => i.cadence === 'MONTHLY').length
const QUARTERLY_COUNT = MANIFEST.filter((i) => i.cadence === 'QUARTERLY').length

// ─── DOCTRINE ─────────────────────────────────────────────────────────────────
const DOCTRINE_LINES = [
  'LOT ISSUES. YOU MAINTAIN STRENGTH.',
  'THE LEDGER IS THE MARKETING.',
  'NO LAYER BETWEEN OPERATOR AND MANIFEST.',
  'MARGIN ≥ 60%. COST CEILING USD 40 LANDED.',
  'USD 100/MO. ADDITIVE. CANCELS TO AI USERSHIP.',
]

// ─── TYPES ────────────────────────────────────────────────────────────────────
type StrengthStatus = 'USERSHIP' | 'PENDING' | 'ON_STRENGTH' | 'STAND_DOWN'

type Roster = {
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  cadenceStart: string // ISO month string e.g. "2026-07"
}

type IssueEntry = {
  seq: string          // e.g. "001"
  isoMonth: string     // "YYYY-MM"
  label: string        // "JUL 2026"
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'NEXT' | 'SCHEDULED'
  isQuarter: boolean   // true = quarterly items included
}

const STRENGTH_KEY = 'lot_basics_strength'
const ROSTER_KEY   = 'lot_basics_roster'

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

function isoMonthLabel(isoMonth: string): string {
  const [y, m] = isoMonth.split('-')
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`
}

function addMonths(isoMonth: string, n: number): string {
  const [y, m] = isoMonth.split('-').map(Number)
  const d = new Date(y, m - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function currentIsoMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function buildIssueLog(cadenceStart: string): IssueEntry[] {
  const now = currentIsoMonth()
  const entries: IssueEntry[] = []

  for (let i = 0; i < 6; i++) {
    const month = addMonths(cadenceStart, i)
    const isQuarter = i % 3 === 0
    let status: IssueEntry['status']

    if (month < now) {
      status = i === 0 ? 'DELIVERED' : 'DISPATCHED'
    } else if (month === now) {
      status = 'NEXT'
    } else {
      status = 'SCHEDULED'
    }

    entries.push({
      seq: String(i + 1).padStart(3, '0'),
      isoMonth: month,
      label: isoMonthLabel(month),
      status,
      isQuarter,
    })
  }

  return entries
}

// ─── LOT-QM STYLE PRIMITIVES ──────────────────────────────────────────────────
// All styles are scoped inside .lot-qm — white ground, black ink,
// Liberation Mono Bold, 2px rules, square corners.

const QM = 'font-mono font-bold uppercase tracking-wide'
const QM_RULE = 'border-0 border-t-2 border-solid border-current'
const QM_RULE_BOTTOM = 'border-0 border-b-2 border-solid border-current'
const QM_BOX = 'border-2 border-solid border-current'
const QM_INVERTED = 'bg-acc text-bac'
const QM_LABEL = cn(QM, 'text-xs opacity-60')

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const Rule: React.FC<{ className?: string }> = ({ className }) => (
  <hr className={cn(QM_RULE, 'my-0 border-current', className)} />
)

const SectionHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(QM_INVERTED, 'px-8 py-4 text-xs', QM, className)}>
    {children}
  </div>
)

// ─── MONTH 1: LEDGER & DOCTRINE ───────────────────────────────────────────────

const OpenTab: React.FC = () => (
  <div className={cn(QM_BOX, 'mb-0')}>
    {/* Header */}
    <div className={cn(QM_INVERTED, 'px-12 py-8 flex items-baseline justify-between')}>
      <span className={cn(QM, 'text-sm tracking-widest')}>BASICS</span>
      <span className={cn(QM, 'text-xs opacity-70')}>LOT-FM-001</span>
    </div>

    <Rule />

    {/* Price + status */}
    <div className="px-12 py-8 grid grid-cols-2 gap-0">
      <div>
        <div className={cn(QM_LABEL, 'mb-2')}>RATE</div>
        <div className={cn(QM, 'text-sm')}>USD 100/MO</div>
      </div>
      <div>
        <div className={cn(QM_LABEL, 'mb-2')}>STATUS</div>
        <div className={cn(QM, 'text-sm')}>OPEN TAB</div>
      </div>
    </div>

    <Rule />

    {/* Doctrine */}
    <div className="px-12 py-8">
      <div className={cn(QM_LABEL, 'mb-6')}>DOCTRINE</div>
      <div className="space-y-4">
        {DOCTRINE_LINES.map((line, i) => (
          <div key={i} className={cn(QM, 'text-xs leading-snug')}>
            {`${String(i + 1).padStart(2, '0')}  ${line}`}
          </div>
        ))}
      </div>
    </div>
  </div>
)

const ManifestLedger: React.FC = () => (
  <div className={cn(QM_BOX, 'mb-0')}>
    <SectionHeader>
      MANIFEST — 23-ITEM RATION LOAD
    </SectionHeader>

    {/* Column headers */}
    <div className={cn('px-12 py-6 flex text-xs border-b-2 border-solid border-current', QM)}>
      <span className="w-10 flex-shrink-0 opacity-40">SEQ</span>
      <span className="flex-1 opacity-40">NOMENCLATURE</span>
      <span className="w-24 flex-shrink-0 text-right opacity-40">CADENCE</span>
    </div>

    {/* Items */}
    {MANIFEST.map((item, idx) => (
      <div key={item.seq}>
        {/* Section break between monthly and quarterly */}
        {idx === MONTHLY_COUNT && (
          <div className={cn('px-12 py-4 text-xs opacity-40 border-t-2 border-b-0 border-solid border-current', QM)}>
            ── QUARTERLY SUPPLEMENT ──
          </div>
        )}
        <div
          className={cn(
            'px-12 py-5 flex items-baseline text-xs',
            idx < MANIFEST.length - 1 && 'border-b border-solid border-current border-opacity-20',
          )}
          style={{ borderBottomColor: 'rgba(0,0,0,0.1)' }}
        >
          <span className={cn(QM, 'w-10 flex-shrink-0 opacity-40')}>{item.seq}</span>
          <span className={cn(QM, 'flex-1 tracking-wide')}>{item.nomenclature}</span>
          <span
            className={cn(
              QM, 'w-24 flex-shrink-0 text-right text-xs',
              item.cadence === 'QUARTERLY' ? 'opacity-50' : '',
            )}
          >
            {item.cadence}
          </span>
        </div>
      </div>
    ))}

    {/* Footer count */}
    <div className={cn('px-12 py-6 flex justify-between text-xs border-t-2 border-solid border-current', QM)}>
      <span className="opacity-40">TOTAL ITEMS: 23</span>
      <span className="opacity-40">
        {MONTHLY_COUNT}M / {QUARTERLY_COUNT}Q
      </span>
    </div>
  </div>
)

// ─── MONTH 2: UPGRADE & ROSTER ─────────────────────────────────────────────

type UpgradeProps = {
  status: StrengthStatus
  onGoOnStrength: () => void
  onStandDown: () => void
}

const StrengthGauge: React.FC<{ status: StrengthStatus }> = ({ status }) => {
  const filled = status === 'ON_STRENGTH' || status === 'STAND_DOWN'
  const pending = status === 'PENDING'

  return (
    <div className="px-12 py-8">
      <div className={cn(QM_LABEL, 'mb-6')}>STRENGTH STATUS</div>
      <div className="space-y-6">
        {/* USERSHIP bar */}
        <div className="flex items-center gap-12">
          <div
            className={cn(QM, 'w-36 text-xs flex-shrink-0', !filled && !pending ? '' : 'opacity-30')}
          >
            USERSHIP / AI
          </div>
          <div className="flex-1 h-5 border-2 border-solid border-current relative">
            <div
              className="absolute inset-0 bg-current"
              style={{ opacity: filled || pending ? 0 : 1, transition: 'opacity 300ms' }}
            />
          </div>
        </div>

        {/* ON STRENGTH bar */}
        <div className="flex items-center gap-12">
          <div
            className={cn(QM, 'w-36 text-xs flex-shrink-0', filled ? '' : 'opacity-30')}
          >
            ON STRENGTH
          </div>
          <div className="flex-1 h-5 border-2 border-solid border-current relative">
            <div
              className="absolute inset-0 bg-current"
              style={{
                opacity: filled ? 1 : 0,
                transition: 'opacity 600ms',
              }}
            />
            {pending && (
              <div
                className="absolute inset-0 bg-current animate-pulse"
                style={{ opacity: 0.35 }}
              />
            )}
          </div>
        </div>

        {/* Status label */}
        <div className={cn(QM, 'text-xs opacity-50')}>
          {status === 'USERSHIP'    && 'AI PLAN ACTIVE — RATION NOT ISSUED'}
          {status === 'PENDING'     && 'ACTIVATION IN PROGRESS — STAND BY'}
          {status === 'ON_STRENGTH' && 'RATION ACTIVE — NEXT ISSUE SCHEDULED'}
          {status === 'STAND_DOWN'  && 'STANDING DOWN — REVERTS TO AI USERSHIP'}
        </div>
      </div>
    </div>
  )
}

const UpgradeControl: React.FC<UpgradeProps> = ({ status, onGoOnStrength, onStandDown }) => (
  <div className={cn(QM_BOX)}>
    <SectionHeader>UPGRADE PATH — USERSHIP / AI → BASIC RATION</SectionHeader>

    <StrengthGauge status={status} />

    <Rule />

    <div className="px-12 py-8 flex flex-wrap gap-8">
      {(status === 'USERSHIP') && (
        <button
          onClick={onGoOnStrength}
          className={cn(
            QM_BOX, QM_INVERTED, QM,
            'px-16 py-8 text-xs cursor-pointer transition-opacity hover:opacity-80',
            'border-2 border-solid',
          )}
          style={{ borderRadius: 0 }}
        >
          GO ON STRENGTH ▸
        </button>
      )}

      {status === 'PENDING' && (
        <div className={cn(QM, 'text-xs opacity-60')}>
          PROCESSING ACTIVATION — ROSTER REQUIRED BELOW ↓
        </div>
      )}

      {status === 'ON_STRENGTH' && (
        <>
          <div className={cn(QM, 'text-xs opacity-60 flex-1')}>
            RATION ACTIVE. USD 100/MO ADDITIVE TO AI PLAN.
          </div>
          <button
            onClick={onStandDown}
            className={cn(
              QM_BOX, QM,
              'px-16 py-8 text-xs cursor-pointer transition-opacity hover:opacity-60',
              'border-2 border-solid border-current',
            )}
            style={{ borderRadius: 0 }}
          >
            STAND DOWN ▾
          </button>
        </>
      )}

      {status === 'STAND_DOWN' && (
        <div className={cn(QM, 'text-xs opacity-60')}>
          STANDING DOWN. RATION CANCELLED. AI PLAN RETAINED.
        </div>
      )}
    </div>
  </div>
)

type RosterProps = {
  roster: Roster
  onChange: (r: Roster) => void
  onConfirm: () => void
  status: StrengthStatus
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const RosterIntake: React.FC<RosterProps> = ({ roster, onChange, onConfirm, status }) => {
  const isEditable = status === 'PENDING'
  const isLocked   = status === 'ON_STRENGTH'

  const field = (
    label: string,
    key: keyof Roster,
    span?: 'full' | 'half',
  ) => (
    <div className={span === 'full' ? 'col-span-2' : ''}>
      <div className={cn(QM_LABEL, 'mb-3')}>{label}</div>
      {isEditable ? (
        <input
          value={roster[key]}
          onChange={(e) => onChange({ ...roster, [key]: e.target.value })}
          className={cn(
            QM, 'text-xs w-full',
            'border-b-2 border-solid border-current',
            'bg-transparent py-4 px-0',
            'focus:outline-none',
          )}
          style={{ borderRadius: 0 }}
          placeholder={`ENTER ${label}`}
        />
      ) : (
        <div className={cn(QM, 'text-xs', !roster[key] && 'opacity-30')}>
          {roster[key] || '—'}
        </div>
      )}
    </div>
  )

  return (
    <div className={cn(QM_BOX)}>
      <SectionHeader>
        ROSTER INTAKE — SHIPPING &amp; CADENCE
        {isLocked && ' — CONFIRMED'}
      </SectionHeader>

      <div className="px-12 py-8 grid grid-cols-2 gap-x-24 gap-y-12">
        {field('DELIVERY ADDRESS LINE 1', 'address1', 'full')}
        {field('DELIVERY ADDRESS LINE 2', 'address2', 'full')}
        {field('CITY', 'city')}
        {field('STATE / PROVINCE', 'state')}
        {field('ZIP / POSTAL CODE', 'zip')}
        {field('COUNTRY', 'country')}
        {field('CONTACT PHONE', 'phone')}
        <div>
          <div className={cn(QM_LABEL, 'mb-3')}>CADENCE START</div>
          {isEditable ? (
            <input
              type="month"
              value={roster.cadenceStart}
              onChange={(e) => onChange({ ...roster, cadenceStart: e.target.value })}
              className={cn(
                QM, 'text-xs w-full',
                'border-b-2 border-solid border-current',
                'bg-transparent py-4 px-0',
                'focus:outline-none',
              )}
              style={{ borderRadius: 0 }}
            />
          ) : (
            <div className={cn(QM, 'text-xs', !roster.cadenceStart && 'opacity-30')}>
              {roster.cadenceStart ? isoMonthLabel(roster.cadenceStart) : '—'}
            </div>
          )}
        </div>
      </div>

      {isEditable && (
        <>
          <Rule />
          <div className="px-12 py-8 flex items-center justify-between">
            <div className={cn(QM, 'text-xs opacity-50')}>
              BILLING: USD 100/MO ADDITIVE — RECURRING
            </div>
            <button
              onClick={onConfirm}
              disabled={
                !roster.address1 ||
                !roster.city ||
                !roster.zip ||
                !roster.country ||
                !roster.cadenceStart
              }
              className={cn(
                QM_BOX, QM_INVERTED, QM,
                'px-16 py-8 text-xs cursor-pointer transition-opacity',
                'border-2 border-solid',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'enabled:hover:opacity-80',
              )}
              style={{ borderRadius: 0 }}
            >
              CONFIRM ROSTER ▸
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── MONTH 3: ISSUE LOG & LOAD ENGINE ─────────────────────────────────────────

const STATUS_LABEL: Record<IssueEntry['status'], string> = {
  DELIVERED:  'DELIVERED',
  DISPATCHED: 'DISPATCHED',
  IN_TRANSIT: 'IN TRANSIT',
  NEXT:       '▸ NEXT ISSUE',
  SCHEDULED:  'SCHEDULED',
}

const IssueLog: React.FC<{ entries: IssueEntry[] }> = ({ entries }) => (
  <div className={cn(QM_BOX)}>
    <SectionHeader>ISSUE LOG — MONTHLY LOAD ENGINE</SectionHeader>

    {/* Header row */}
    <div
      className={cn(
        'px-12 py-6 grid text-xs border-b-2 border-solid border-current',
        QM,
      )}
      style={{ gridTemplateColumns: '4rem 1fr 7rem 6rem' }}
    >
      <span className="opacity-40">ISSUE</span>
      <span className="opacity-40">PERIOD</span>
      <span className="opacity-40">LOAD</span>
      <span className="opacity-40 text-right">STATUS</span>
    </div>

    {entries.map((entry) => {
      const isNext = entry.status === 'NEXT'
      return (
        <div
          key={entry.seq}
          className={cn(
            'px-12 py-6 grid text-xs items-center',
            'border-b border-solid',
            isNext ? cn(QM_INVERTED, 'border-current') : 'border-current border-opacity-15',
          )}
          style={{
            gridTemplateColumns: '4rem 1fr 7rem 6rem',
            borderBottomColor: isNext ? undefined : 'rgba(0,0,0,0.12)',
          }}
        >
          <span className={cn(QM, isNext ? '' : 'opacity-50')}>{entry.seq}</span>
          <span className={cn(QM, isNext ? '' : '')}>{entry.label}</span>
          <span className={cn(QM, 'text-xs', isNext ? '' : 'opacity-50')}>
            {entry.isQuarter ? '17M + 6Q' : '17M'}
          </span>
          <span className={cn(QM, 'text-right text-xs', isNext ? 'font-bold' : 'opacity-50')}>
            {STATUS_LABEL[entry.status]}
          </span>
        </div>
      )
    })}

    <div
      className={cn(
        'px-12 py-6 flex justify-between text-xs border-t-2 border-solid border-current',
        QM,
      )}
    >
      <span className="opacity-40">USD 100/ISSUE</span>
      <span className="opacity-40">MARGIN ≥ 60%</span>
    </div>
  </div>
)

// ─── LOAD MANIFEST CARD ────────────────────────────────────────────────────────
// Printable/displayable card for the current or next issue

const ManifestCard: React.FC<{ entry: IssueEntry; userName: string }> = ({ entry, userName }) => {
  const items = entry.isQuarter
    ? MANIFEST
    : MANIFEST.filter((i) => i.cadence === 'MONTHLY')

  return (
    <div className={cn(QM_BOX)} id="lot-manifest-card">
      <div className={cn(QM_INVERTED, 'px-12 py-8 flex justify-between items-center')}>
        <span className={cn(QM, 'text-xs tracking-widest')}>LOT RATION — MANIFEST CARD</span>
        <span className={cn(QM, 'text-xs opacity-70')}>{entry.label}</span>
      </div>
      <Rule />

      <div className="px-12 py-6 grid grid-cols-2 gap-x-24">
        <div>
          <div className={cn(QM_LABEL, 'mb-2')}>ISSUE NO.</div>
          <div className={cn(QM, 'text-xs')}>{entry.seq}</div>
        </div>
        <div>
          <div className={cn(QM_LABEL, 'mb-2')}>OPERATOR</div>
          <div className={cn(QM, 'text-xs')}>{userName || '—'}</div>
        </div>
      </div>

      <Rule />

      {items.map((item, idx) => (
        <div
          key={item.seq}
          className="px-12 py-4 flex items-baseline text-xs"
          style={{
            borderBottom: idx < items.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <span className={cn(QM, 'w-10 flex-shrink-0 opacity-40')}>{item.seq}</span>
          <span className={cn(QM, 'flex-1 tracking-wide')}>{item.nomenclature}</span>
          <span className={cn(QM, 'w-4 flex-shrink-0 text-right')}>☐</span>
        </div>
      ))}

      <Rule />
      <div className={cn('px-12 py-4 flex justify-between text-xs', QM)}>
        <span className="opacity-40">ISSUED BY LOT SYSTEMS CORPORATION</span>
        <span className="opacity-40">LOT-FM-001</span>
      </div>
    </div>
  )
}

// ─── ROOT COMPONENT ────────────────────────────────────────────────────────────

const DEFAULT_ROSTER: Roster = {
  address1:     '',
  address2:     '',
  city:         '',
  state:        '',
  zip:          '',
  country:      'USA',
  phone:        '',
  cadenceStart: currentIsoMonth(),
}

export const Basics: React.FC = () => {
  const user = useStore(stores.me)

  // ── Strength state machine ─────────────────────────────────────────────────
  const [status, setStatus] = React.useState<StrengthStatus>(() => {
    try {
      const stored = localStorage.getItem(STRENGTH_KEY)
      if (stored) return stored as StrengthStatus
    } catch {}
    return 'USERSHIP'
  })

  const [roster, setRoster] = React.useState<Roster>(() => {
    try {
      const stored = localStorage.getItem(ROSTER_KEY)
      if (stored) return JSON.parse(stored)
    } catch {}
    return DEFAULT_ROSTER
  })

  const [showCard, setShowCard] = React.useState(false)

  const persist = React.useCallback((s: StrengthStatus, r: Roster) => {
    try {
      localStorage.setItem(STRENGTH_KEY, s)
      localStorage.setItem(ROSTER_KEY, JSON.stringify(r))
    } catch {}
  }, [])

  const handleGoOnStrength = React.useCallback(() => {
    setStatus('PENDING')
    persist('PENDING', roster)
  }, [persist, roster])

  const handleConfirmRoster = React.useCallback(() => {
    setStatus('ON_STRENGTH')
    persist('ON_STRENGTH', roster)
  }, [persist, roster])

  const handleStandDown = React.useCallback(() => {
    setStatus('STAND_DOWN')
    persist('STAND_DOWN', roster)
    setTimeout(() => {
      setStatus('USERSHIP')
      persist('USERSHIP', roster)
    }, 2000)
  }, [persist, roster])

  const handleRosterChange = React.useCallback((r: Roster) => {
    setRoster(r)
  }, [])

  // ── Issue log ──────────────────────────────────────────────────────────────
  const issueEntries = React.useMemo<IssueEntry[]>(() => {
    if (status !== 'ON_STRENGTH') return []
    return buildIssueLog(roster.cadenceStart || currentIsoMonth())
  }, [status, roster.cadenceStart])

  const nextIssue = issueEntries.find((e) => e.status === 'NEXT')

  // ── Display name ───────────────────────────────────────────────────────────
  const userName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim().toUpperCase() || user.email.toUpperCase()
    : ''

  return (
    <div className="px-16 phone:px-32 tablet:px-48 desktop:px-64 py-32 phone:py-48">
      {/* LOT-QM root: force monospace, square corners, system resets */}
      <div
        className="max-w-2xl space-y-0"
        style={{
          fontFamily: "'Liberation Mono', 'Courier New', 'Lucida Console', monospace",
        }}
      >
        {/* ── MONTH 1: OPEN TAB ─────────────────────────────────────────── */}
        <OpenTab />

        <div className="h-24" />

        <ManifestLedger />

        {/* ── MONTH 2: UPGRADE & ROSTER ─────────────────────────────────── */}
        <div className="h-24" />

        <UpgradeControl
          status={status}
          onGoOnStrength={handleGoOnStrength}
          onStandDown={handleStandDown}
        />

        {(status === 'PENDING' || status === 'ON_STRENGTH') && (
          <>
            <div className="h-24" />
            <RosterIntake
              roster={roster}
              onChange={handleRosterChange}
              onConfirm={handleConfirmRoster}
              status={status}
            />
          </>
        )}

        {/* ── MONTH 3: ISSUE LOG & FULFILLMENT ─────────────────────────── */}
        {status === 'ON_STRENGTH' && issueEntries.length > 0 && (
          <>
            <div className="h-24" />
            <IssueLog entries={issueEntries} />

            {nextIssue && (
              <>
                <div className="h-24" />
                <div className={cn(QM_BOX)}>
                  <SectionHeader>NEXT ISSUE — MANIFEST CARD</SectionHeader>
                  <div className="px-12 py-8 flex items-center justify-between">
                    <div>
                      <div className={cn(QM_LABEL, 'mb-2')}>ISSUE NO.</div>
                      <div className={cn(QM, 'text-xs')}>
                        {nextIssue.seq} — {nextIssue.label}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCard((v) => !v)}
                      className={cn(
                        QM_BOX, QM, 'px-12 py-6 text-xs cursor-pointer',
                        'border-2 border-solid border-current',
                        'hover:opacity-70 transition-opacity',
                        showCard ? cn(QM_INVERTED) : '',
                      )}
                      style={{ borderRadius: 0 }}
                    >
                      {showCard ? 'CLOSE CARD ▾' : 'OPEN CARD ▸'}
                    </button>
                  </div>

                  {showCard && nextIssue && (
                    <>
                      <Rule />
                      <div className="p-12">
                        <ManifestCard entry={nextIssue} userName={userName} />
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Footer */}
        <div className="h-48" />
        <div
          className={cn(QM, 'text-xs opacity-30 leading-relaxed')}
          style={{ fontFamily: "'Liberation Mono', 'Courier New', monospace" }}
        >
          LOT SYSTEMS CORPORATION — LOT-FM-001<br />
          THE LEDGER IS THE MARKETING.<br />
          ELIMINATE ONE DISTRACTION.
        </div>
        <div className="h-64" />
      </div>
    </div>
  )
}
