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
import { Button } from '#client/components/ui'
import { cn } from '#client/utils'
import { UserTag } from '#shared/types'

// ─── MANIFEST ────────────────────────────────────────────────────────────────
// LOT-FM-001 / SECTION 2 — 23-ITEM RATION LOAD
// CADENCE: MONTHLY UNLESS NOTED. COGS WITHHELD.

type Cadence = 'MONTHLY' | 'QUARTERLY'

type ManifestItem = {
  line: number
  nomenclature: string
  unit: string
  cadence: Cadence
  section: 'FOOD' | 'SUPPLEMENTS' | 'PERSONAL CARE' | 'FIELD MATERIAL'
}

const MANIFEST: ManifestItem[] = [
  // SECTION A — FOOD STAPLES
  { line: 1,  nomenclature: 'OATS, ROLLED',                         unit: '500G',   cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 2,  nomenclature: 'COFFEE, GROUND, MEDIUM ROAST',         unit: '250G',   cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 3,  nomenclature: 'HONEY, RAW WILDFLOWER',                unit: '250G',   cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 4,  nomenclature: 'ALMONDS, RAW WHOLE',                   unit: '200G',   cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 5,  nomenclature: 'LENTILS, GREEN, DRY',                  unit: '500G',   cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 6,  nomenclature: 'SARDINES, WILD-CAUGHT, OIL-PACKED',    unit: '4-TIN',  cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 7,  nomenclature: 'BLACK BEANS, DRY',                     unit: '500G',   cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 8,  nomenclature: 'BROWN RICE, LONG GRAIN',               unit: '500G',   cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 9,  nomenclature: 'OLIVE OIL, COLD-PRESSED, EVOO',        unit: '250ML',  cadence: 'MONTHLY',   section: 'FOOD' },
  { line: 10, nomenclature: 'GREEN TEA, LOOSE LEAF',                unit: '100G',   cadence: 'MONTHLY',   section: 'FOOD' },
  // SECTION B — SUPPLEMENTS
  { line: 11, nomenclature: 'VITAMIN D3, 2000IU',                   unit: '30-CT',  cadence: 'MONTHLY',   section: 'SUPPLEMENTS' },
  { line: 12, nomenclature: 'MAGNESIUM GLYCINATE, 400MG',           unit: '30-CT',  cadence: 'MONTHLY',   section: 'SUPPLEMENTS' },
  { line: 13, nomenclature: 'OMEGA-3, EPA/DHA, 1000MG',             unit: '30-CT',  cadence: 'MONTHLY',   section: 'SUPPLEMENTS' },
  { line: 14, nomenclature: 'ZINC, PICOLINATE, 25MG',               unit: '30-CT',  cadence: 'MONTHLY',   section: 'SUPPLEMENTS' },
  { line: 15, nomenclature: 'VITAMIN C, BUFFERED, 500MG',           unit: '30-CT',  cadence: 'MONTHLY',   section: 'SUPPLEMENTS' },
  { line: 16, nomenclature: 'PROBIOTIC, 10B CFU, SHELF-STABLE',     unit: '30-CT',  cadence: 'MONTHLY',   section: 'SUPPLEMENTS' },
  { line: 17, nomenclature: 'ASHWAGANDHA ROOT, KSM-66, 300MG',      unit: '30-CT',  cadence: 'MONTHLY',   section: 'SUPPLEMENTS' },
  // SECTION C — PERSONAL CARE
  { line: 18, nomenclature: 'SOAP, BAR, CASTILE, UNSCENTED',        unit: '2-CT',   cadence: 'MONTHLY',   section: 'PERSONAL CARE' },
  { line: 19, nomenclature: 'TOOTHPASTE, FLUORIDE',                 unit: '1-CT',   cadence: 'MONTHLY',   section: 'PERSONAL CARE' },
  { line: 20, nomenclature: 'DENTAL FLOSS, WAXED, 50M',             unit: '1-CT',   cadence: 'MONTHLY',   section: 'PERSONAL CARE' },
  { line: 21, nomenclature: 'HAND LOTION, UNSCENTED',               unit: '100ML',  cadence: 'MONTHLY',   section: 'PERSONAL CARE' },
  // SECTION D — FIELD MATERIAL
  { line: 22, nomenclature: 'MANIFEST CARD, LAMINATED',             unit: '1-CT',   cadence: 'MONTHLY',   section: 'FIELD MATERIAL' },
  { line: 23, nomenclature: 'ARCHIVE BAG, RESEALABLE, HEAVY DUTY',  unit: '1-CT',   cadence: 'MONTHLY',   section: 'FIELD MATERIAL' },
]

// ─── STATE MACHINE ────────────────────────────────────────────────────────────
// UPGRADE: USERSHIP/AI → PENDING → ON_STRENGTH → STEADY_STATE
// STAND DOWN: ON_STRENGTH/STEADY_STATE → OPEN (retains AI plan)

type RationStatus = 'OPEN' | 'PENDING' | 'ON_STRENGTH' | 'STEADY_STATE'

const STORAGE_KEY_STATUS = 'lot-basics-status'
const STORAGE_KEY_ROSTER = 'lot-basics-roster'
const STORAGE_KEY_ISSUES = 'lot-basics-issues'
const STORAGE_KEY_START   = 'lot-basics-start-date'

type RosterData = {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL'
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  cadenceStart: 'IMMEDIATE' | 'NEXT_FIRST'
}

type IssueRecord = {
  issueNumber: number
  date: string
  items: number
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED'
}

function loadStatus(): RationStatus {
  try {
    return (localStorage.getItem(STORAGE_KEY_STATUS) as RationStatus) || 'OPEN'
  } catch {
    return 'OPEN'
  }
}

function saveStatus(s: RationStatus) {
  try { localStorage.setItem(STORAGE_KEY_STATUS, s) } catch {}
}

function loadRoster(): Partial<RosterData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROSTER)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveRoster(r: Partial<RosterData>) {
  try { localStorage.setItem(STORAGE_KEY_ROSTER, JSON.stringify(r)) } catch {}
}

function loadIssues(): IssueRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ISSUES)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadStartDate(): string | null {
  try { return localStorage.getItem(STORAGE_KEY_START) } catch { return null }
}

function saveStartDate(d: string) {
  try { localStorage.setItem(STORAGE_KEY_START, d) } catch {}
}

function nextIssueDate(startDateStr: string | null): string {
  const now = new Date()
  if (!startDateStr) {
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return next.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  }
  const start = new Date(startDateStr)
  const nextIssue = new Date(start.getFullYear(), start.getMonth() + 1, 1)
  if (nextIssue <= now) {
    const adjusted = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return adjusted.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  }
  return nextIssue.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const RULE = 'border-acc'

function Rule({ className }: { className?: string }) {
  return <div className={cn('border-t-2', RULE, className)} />
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-16 py-4 border-b border-acc/30 text-xs tracking-widest opacity-40">
      {children}
    </div>
  )
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const me = useStore(stores.me)

  const hasUsership = React.useMemo(() => {
    if (!me) return false
    const tags: string[] = (me as any).tags || []
    return tags.includes(UserTag.Usership) || tags.includes(UserTag.Admin)
  }, [me])

  // ── STATE ──
  const [status, setStatus] = React.useState<RationStatus>(loadStatus)
  const [roster, setRoster] = React.useState<Partial<RosterData>>(loadRoster)
  const [issues] = React.useState<IssueRecord[]>(loadIssues)
  const [startDate] = React.useState<string | null>(loadStartDate)
  const [showPrintView, setShowPrintView] = React.useState(false)

  // Roster form state
  const [rosterDraft, setRosterDraft] = React.useState<Partial<RosterData>>({
    size: 'M',
    name: me ? `${(me as any).firstName || ''} ${(me as any).lastName || ''}`.trim() : '',
    address: (me as any)?.address || '',
    city: (me as any)?.city || '',
    country: (me as any)?.country || '',
    state: '',
    zip: '',
    cadenceStart: 'NEXT_FIRST',
  })

  function commitStatus(next: RationStatus) {
    setStatus(next)
    saveStatus(next)
  }

  function handleUpgrade() {
    commitStatus('PENDING')
  }

  function handleRosterConfirm() {
    saveRoster(rosterDraft)
    setRoster(rosterDraft)
    const today = new Date().toISOString().split('T')[0]
    saveStartDate(today)
    commitStatus('ON_STRENGTH')
  }

  function handleStandDown() {
    if (window.confirm('STAND DOWN: This will terminate your ration subscription. LOT Usership (AI plan) is retained. Confirm?')) {
      commitStatus('OPEN')
    }
  }

  function handlePrint() {
    setShowPrintView(true)
    setTimeout(() => {
      window.print()
      setShowPrintView(false)
    }, 100)
  }

  const nextIssue = nextIssueDate(startDate)
  const isActive = status === 'ON_STRENGTH' || status === 'STEADY_STATE'

  // ── PRINT VIEW ──
  if (showPrintView) {
    return (
      <div className="font-mono p-32 text-black bg-white print:block">
        <div className="text-xs mb-8">LOT-FM-001 / BASIC RATION / MANIFEST CARD</div>
        <div className="text-xl font-bold mb-16 border-b-2 border-black pb-8">BASICS — MONTHLY ISSUE</div>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-4 pr-16">LINE</th>
              <th className="text-left py-4 pr-16">NOMENCLATURE</th>
              <th className="text-left py-4 pr-16">UNIT</th>
              <th className="text-left py-4">CADENCE</th>
            </tr>
          </thead>
          <tbody>
            {MANIFEST.map((item) => (
              <tr key={item.line} className="border-b border-black/20">
                <td className="py-2 pr-16 opacity-50">{String(item.line).padStart(2, '0')}</td>
                <td className="py-2 pr-16">{item.nomenclature}</td>
                <td className="py-2 pr-16 opacity-70">{item.unit}</td>
                <td className="py-2 opacity-50">{item.cadence}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-16 text-xs border-t-2 border-black pt-8 flex justify-between">
          <div>TOTAL ITEMS: 23 / USD 100 / MONTH</div>
          <div>NEXT ISSUE: {nextIssue}</div>
        </div>
      </div>
    )
  }

  // ── MAIN VIEW ──
  return (
    <div className="font-mono flex flex-col gap-y-0">

      {/* ── HEADER ── */}
      <div className="flex items-end justify-between mb-16">
        <div>
          <div className="text-xs tracking-widest opacity-40 mb-4">LOT-FM-001 / BASIC RATION</div>
          <div className="text-2xl font-bold tracking-tight uppercase">BASICS</div>
        </div>
        <div className="text-right">
          <div className="text-xs tracking-widest opacity-40 mb-4">STATUS</div>
          <div className={cn(
            'text-xs tracking-widest px-8 py-4',
            isActive ? 'bg-acc text-bac' : 'border border-acc opacity-60'
          )}>
            {status === 'OPEN' && 'OPEN — NOT SUBSCRIBED'}
            {status === 'PENDING' && 'PENDING ENROLLMENT'}
            {status === 'ON_STRENGTH' && 'ON STRENGTH'}
            {status === 'STEADY_STATE' && 'STEADY STATE'}
          </div>
        </div>
      </div>

      <Rule />

      {/* ── DOCTRINE ── */}
      <div className="border-2 border-acc mt-16 mb-16">
        <div className="px-16 py-8 border-b-2 border-acc text-xs tracking-widest opacity-40">
          DOCTRINE
        </div>
        <div className="px-16 py-16 text-sm leading-loose uppercase tracking-wide">
          THE LOT BASIC RATION IS A MONTHLY PHYSICAL ISSUE TO SUBSCRIBERS ON STRENGTH.
          THE LEDGER IS PUBLIC. COGS IS NOT. ISSUE, DO NOT SELL.
          ONCE ON STRENGTH, THE BOX SHIPS ON CADENCE. NO MARKETING. NO UPSELL.
          THE MANIFEST IS THE CONTRACT.
        </div>
      </div>

      {/* ── PRICE LINE ── */}
      <div className="border-2 border-acc mb-16 flex items-stretch">
        <div className="px-16 py-16 border-r-2 border-acc flex-1">
          <div className="text-xs tracking-widest opacity-40 mb-4">PRICE</div>
          <div className="text-xl font-bold">USD 100 / MONTH</div>
          <div className="text-xs opacity-40 mt-4">ADDITIVE TO LOT USERSHIP (AI PLAN)</div>
        </div>
        <div className="px-16 py-16 flex flex-col justify-center items-end text-right">
          <div className="text-xs tracking-widest opacity-40 mb-4">MARGIN</div>
          <div className="text-sm font-bold">≥ 60%</div>
          <div className="text-xs opacity-40 mt-4">COGS CEILING: USD 40</div>
        </div>
      </div>

      {/* ── MANIFEST LEDGER ── */}
      <div className="border-2 border-acc mb-16">
        {/* Ledger title bar */}
        <div className="px-16 py-8 border-b-2 border-acc flex items-center justify-between">
          <span className="text-xs tracking-widest opacity-40">MANIFEST — 23-ITEM RATION LOAD</span>
          <span className="text-xs tracking-widest opacity-40">SECTION 2 / LOT-FM-001</span>
        </div>

        {/* Column headers */}
        <div className="px-16 py-8 border-b-2 border-acc grid grid-cols-[32px_1fr_64px_80px] gap-x-16 text-xs tracking-widest opacity-40">
          <div>LINE</div>
          <div>NOMENCLATURE</div>
          <div className="text-right">UNIT</div>
          <div className="text-right">CADENCE</div>
        </div>

        {/* Items */}
        {(['FOOD', 'SUPPLEMENTS', 'PERSONAL CARE', 'FIELD MATERIAL'] as const).map((section) => {
          const items = MANIFEST.filter((i) => i.section === section)
          return (
            <React.Fragment key={section}>
              <SectionHeader>
                {section === 'FOOD' && 'A — FOOD STAPLES'}
                {section === 'SUPPLEMENTS' && 'B — SUPPLEMENTS'}
                {section === 'PERSONAL CARE' && 'C — PERSONAL CARE'}
                {section === 'FIELD MATERIAL' && 'D — FIELD MATERIAL'}
              </SectionHeader>
              {items.map((item, idx) => (
                <div
                  key={item.line}
                  className={cn(
                    'px-16 py-8 grid grid-cols-[32px_1fr_64px_80px] gap-x-16 text-sm',
                    idx < items.length - 1 && 'border-b border-acc/20'
                  )}
                >
                  <div className="text-xs opacity-30">{String(item.line).padStart(2, '0')}</div>
                  <div className="uppercase">{item.nomenclature}</div>
                  <div className="text-right opacity-60 text-xs">{item.unit}</div>
                  <div className="text-right opacity-40 text-xs">{item.cadence}</div>
                </div>
              ))}
            </React.Fragment>
          )
        })}

        {/* Footer */}
        <div className="border-t-2 border-acc px-16 py-8 flex justify-between text-xs tracking-widest">
          <div className="font-bold">TOTAL: 23 ITEMS</div>
          <div className="opacity-40">COGS: WITHHELD</div>
        </div>
      </div>

      {/* ── UPGRADE SECTION (Month 2) ── */}
      <div className="border-2 border-acc mb-16">
        <div className="px-16 py-8 border-b-2 border-acc text-xs tracking-widest opacity-40">
          UPGRADE / ENROLLMENT
        </div>

        {/* OPEN — show upgrade CTA */}
        {status === 'OPEN' && (
          <div className="px-16 py-16">
            {hasUsership ? (
              <div className="flex flex-col gap-y-16">
                <div className="text-sm uppercase tracking-wide">
                  USERSHIP (AI) CONFIRMED. PROCEED TO ENROLL IN BASIC RATION.
                  BILLING ADDITIVE: USD 100 / MONTH.
                </div>
                <div>
                  <Button
                    kind="primary"
                    className="font-mono uppercase tracking-widest"
                    onClick={handleUpgrade}
                  >
                    UPGRADE TO BASICS — USD 100 / MONTH
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm uppercase tracking-wide opacity-60">
                BASIC RATION REQUIRES LOT USERSHIP (AI PLAN).
                ENROLL IN USERSHIP FIRST, THEN RETURN HERE TO ADD RATION.
              </div>
            )}
          </div>
        )}

        {/* PENDING — roster intake form */}
        {status === 'PENDING' && (
          <div className="px-16 py-16 flex flex-col gap-y-16">
            <div className="text-xs tracking-widest opacity-40 uppercase">ROSTER INTAKE — COMPLETE ALL FIELDS</div>

            {/* Size */}
            <div className="flex flex-col gap-y-4">
              <label className="text-xs tracking-widest opacity-40 uppercase">CLOTHING SIZE</label>
              <div className="flex gap-8 flex-wrap">
                {(['XS','S','M','L','XL','2XL','3XL'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setRosterDraft((d) => ({ ...d, size: sz }))}
                    className={cn(
                      'font-mono text-xs px-12 py-8 border-2 uppercase tracking-widest cursor-pointer',
                      rosterDraft.size === sz
                        ? 'bg-acc text-bac border-acc'
                        : 'border-acc/40 hover:border-acc'
                    )}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-y-4">
              <label className="text-xs tracking-widest opacity-40 uppercase">FULL NAME (SHIPPING)</label>
              <input
                type="text"
                value={rosterDraft.name || ''}
                onChange={(e) => setRosterDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="FIRST LAST"
                className="font-mono text-sm uppercase bg-transparent border-b-2 border-acc py-4 px-0 outline-none tracking-wide placeholder:opacity-30 w-full"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-y-4">
              <label className="text-xs tracking-widest opacity-40 uppercase">STREET ADDRESS</label>
              <input
                type="text"
                value={rosterDraft.address || ''}
                onChange={(e) => setRosterDraft((d) => ({ ...d, address: e.target.value }))}
                placeholder="123 MAIN ST"
                className="font-mono text-sm uppercase bg-transparent border-b-2 border-acc py-4 px-0 outline-none tracking-wide placeholder:opacity-30 w-full"
              />
            </div>

            {/* City / State / ZIP */}
            <div className="grid grid-cols-3 gap-16">
              <div className="flex flex-col gap-y-4">
                <label className="text-xs tracking-widest opacity-40 uppercase">CITY</label>
                <input
                  type="text"
                  value={rosterDraft.city || ''}
                  onChange={(e) => setRosterDraft((d) => ({ ...d, city: e.target.value }))}
                  placeholder="CITY"
                  className="font-mono text-sm uppercase bg-transparent border-b-2 border-acc py-4 px-0 outline-none tracking-wide placeholder:opacity-30 w-full"
                />
              </div>
              <div className="flex flex-col gap-y-4">
                <label className="text-xs tracking-widest opacity-40 uppercase">STATE</label>
                <input
                  type="text"
                  value={rosterDraft.state || ''}
                  onChange={(e) => setRosterDraft((d) => ({ ...d, state: e.target.value }))}
                  placeholder="CA"
                  className="font-mono text-sm uppercase bg-transparent border-b-2 border-acc py-4 px-0 outline-none tracking-wide placeholder:opacity-30 w-full"
                />
              </div>
              <div className="flex flex-col gap-y-4">
                <label className="text-xs tracking-widest opacity-40 uppercase">ZIP</label>
                <input
                  type="text"
                  value={rosterDraft.zip || ''}
                  onChange={(e) => setRosterDraft((d) => ({ ...d, zip: e.target.value }))}
                  placeholder="90210"
                  className="font-mono text-sm uppercase bg-transparent border-b-2 border-acc py-4 px-0 outline-none tracking-wide placeholder:opacity-30 w-full"
                />
              </div>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-y-4">
              <label className="text-xs tracking-widest opacity-40 uppercase">COUNTRY</label>
              <input
                type="text"
                value={rosterDraft.country || ''}
                onChange={(e) => setRosterDraft((d) => ({ ...d, country: e.target.value }))}
                placeholder="UNITED STATES"
                className="font-mono text-sm uppercase bg-transparent border-b-2 border-acc py-4 px-0 outline-none tracking-wide placeholder:opacity-30 w-full"
              />
            </div>

            {/* Cadence start */}
            <div className="flex flex-col gap-y-8">
              <label className="text-xs tracking-widest opacity-40 uppercase">CADENCE START</label>
              <div className="flex flex-col gap-y-8">
                {([
                  { val: 'NEXT_FIRST', label: 'FIRST OF NEXT MONTH (STANDARD)' },
                  { val: 'IMMEDIATE', label: 'IMMEDIATE — NEXT AVAILABLE DISPATCH' },
                ] as const).map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setRosterDraft((d) => ({ ...d, cadenceStart: val }))}
                    className={cn(
                      'font-mono text-xs px-12 py-8 border-2 uppercase tracking-widest cursor-pointer text-left',
                      rosterDraft.cadenceStart === val
                        ? 'bg-acc text-bac border-acc'
                        : 'border-acc/40 hover:border-acc'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-16 pt-8">
              <Button
                kind="primary"
                className="font-mono uppercase tracking-widest"
                onClick={handleRosterConfirm}
                disabled={!rosterDraft.name || !rosterDraft.address || !rosterDraft.city || !rosterDraft.zip}
              >
                CONFIRM ENROLLMENT
              </Button>
              <Button
                kind="secondary"
                className="font-mono uppercase tracking-widest"
                onClick={() => commitStatus('OPEN')}
              >
                CANCEL
              </Button>
            </div>
          </div>
        )}

        {/* ON_STRENGTH / STEADY_STATE */}
        {(status === 'ON_STRENGTH' || status === 'STEADY_STATE') && (
          <div className="px-16 py-16 flex flex-col gap-y-16">
            <div className="text-sm uppercase tracking-wide">
              <span className="font-bold">ON STRENGTH.</span>{' '}
              RATION SUBSCRIPTION ACTIVE. NEXT ISSUE: {nextIssue}.
            </div>
            {roster.name && (
              <div className="text-xs opacity-40 uppercase tracking-wide">
                ISSUED TO: {roster.name} / {roster.address}, {roster.city}, {roster.state} {roster.zip}, {roster.country} / SIZE: {roster.size}
              </div>
            )}
            <div className="flex gap-16">
              <Button
                kind="secondary"
                className="font-mono uppercase tracking-widest text-xs"
                onClick={handlePrint}
              >
                PRINT MANIFEST CARD
              </Button>
              <Button
                kind="secondary"
                className="font-mono uppercase tracking-widest text-xs opacity-60"
                onClick={handleStandDown}
              >
                STAND DOWN
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── ISSUE LOG (Month 3) ── */}
      <div className="border-2 border-acc mb-16">
        <div className="px-16 py-8 border-b-2 border-acc flex items-center justify-between">
          <span className="text-xs tracking-widest opacity-40">ISSUE LOG</span>
          {isActive && (
            <span className="text-xs tracking-widest opacity-40">NEXT ISSUE: {nextIssue}</span>
          )}
        </div>
        {issues.length === 0 ? (
          <div className="px-16 py-16 text-xs uppercase tracking-widest opacity-40">
            {isActive
              ? 'NO ISSUES DISPATCHED YET. FIRST ISSUE PENDING.'
              : 'SUBSCRIBE TO BEGIN ACCRUING ISSUE LOG.'}
          </div>
        ) : (
          <>
            <div className="px-16 py-8 border-b border-acc/30 grid grid-cols-[48px_1fr_64px_100px] gap-x-16 text-xs tracking-widest opacity-40">
              <div>ISSUE</div>
              <div>DATE</div>
              <div>ITEMS</div>
              <div className="text-right">STATUS</div>
            </div>
            {issues.map((record) => (
              <div
                key={record.issueNumber}
                className="px-16 py-8 border-b border-acc/20 grid grid-cols-[48px_1fr_64px_100px] gap-x-16 text-sm"
              >
                <div className="opacity-40">#{String(record.issueNumber).padStart(3, '0')}</div>
                <div className="uppercase">{record.date}</div>
                <div className="opacity-60">{record.items}</div>
                <div className={cn(
                  'text-right text-xs tracking-widest',
                  record.status === 'DELIVERED' ? 'opacity-40' : 'font-bold'
                )}>
                  {record.status}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── STATUS LINE ── */}
      <Rule />
      <div className="pt-16 flex flex-wrap items-center justify-between gap-16 text-xs tracking-widest opacity-40 uppercase">
        <div>LOT-FM-001 / 90-DAY BUILD</div>
        <div className="flex gap-24">
          <span className="font-bold opacity-100">MONTH 1: LEDGER ✓</span>
          <span className={cn(isActive || status === 'PENDING' ? 'font-bold opacity-100' : '')}>
            MONTH 2: UPGRADE {isActive ? '✓' : status === 'PENDING' ? '…' : '—'}
          </span>
          <span className={cn(issues.length > 0 ? 'font-bold opacity-100' : '')}>
            MONTH 3: ISSUE {issues.length > 0 ? '✓' : '—'}
          </span>
        </div>
      </div>

    </div>
  )
}
