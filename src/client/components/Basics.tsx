/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | brand.lot-systems.com
 *
 * BASICS TAB — LOT-FM-001 / OPEN TAB / CIVILIAN RATION SUBSCRIPTION
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Block, Button, GhostButton, Tag } from '#client/components/ui'
import { UserTag, RationTier, IssueLogEntry } from '#shared/types'
import { goTo } from '#client/stores/router'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'

// ─── RATION LOAD (LOT-FM-001 §2.1) ──────────────────────────────────────────

const RATION_ITEMS = [
  { id: '001', name: 'SOCK, COTTON, CREW, 2 PAIR',   cls: 'CONSUMABLE', cadence: 'MONTHLY' },
  { id: '002', name: 'BRIEF, COTTON',                 cls: 'CONSUMABLE', cadence: 'MO 1,3,5,7,9,11' },
  { id: '003', name: 'SHIRT, TEE, COTTON, BLACK',     cls: 'DURABLE',    cadence: 'MO 2,6,10' },
  { id: '004', name: 'BRUSH, TOOTH',                  cls: 'DURABLE',    cadence: 'MO 1,4,7,10' },
  { id: '005', name: 'PASTE, TOOTH, TUBE',            cls: 'CONSUMABLE', cadence: 'MO 1,3,5,7,9,11' },
  { id: '006', name: 'FLOSS, DENTAL',                 cls: 'CONSUMABLE', cadence: 'MO 2,5,8,11' },
  { id: '007', name: 'SOAP, BAR',                     cls: 'CONSUMABLE', cadence: 'MONTHLY' },
  { id: '008', name: 'DEODORANT, STICK',              cls: 'CONSUMABLE', cadence: 'MO 1,3,5,7,9,11' },
  { id: '009', name: 'PAD, COTTON, PACK',             cls: 'CONSUMABLE', cadence: 'MO 2,4,6,8,10,12' },
  { id: '010', name: 'SWAB, COTTON, BOX',             cls: 'CONSUMABLE', cadence: 'MO 3,9' },
  { id: '011', name: 'BLADE, RAZOR, HEAD, 4-PACK',   cls: 'CONSUMABLE', cadence: 'MO 2,5,8,11' },
  { id: '012', name: 'HANDLE, RAZOR',                 cls: 'DURABLE',    cadence: 'MO 1 ONLY' },
  { id: '013', name: 'SOAP, SHAVE',                   cls: 'CONSUMABLE', cadence: 'MO 4,10' },
  { id: '014', name: 'BAR, SHAMPOO',                  cls: 'CONSUMABLE', cadence: 'MO 2,6,10' },
  { id: '015', name: 'CLIPPER, NAIL',                 cls: 'DURABLE',    cadence: 'MO 3 ONLY' },
  { id: '016', name: 'HANDKERCHIEF, COTTON, BLACK',  cls: 'DURABLE',    cadence: 'MO 4,8,12' },
  { id: '017', name: 'BALM, LIP',                     cls: 'CONSUMABLE', cadence: 'MO 1,7' },
  { id: '018', name: 'CREAM, HAND/FACE, TUBE',       cls: 'CONSUMABLE', cadence: 'MO 5,11' },
  { id: '019', name: 'STICK, SUN, SPF',              cls: 'CONSUMABLE', cadence: 'MO 6 (SEASONAL)' },
  { id: '020', name: 'TOWEL, COTTON/MICROFIBER',     cls: 'DURABLE',    cadence: 'MO 7 ONLY' },
  { id: '021', name: 'CAP, COTTON / BEANIE',         cls: 'DURABLE',    cadence: 'MO 9 (SEASONAL)' },
  { id: '022', name: 'BAG, COTTON, REUSABLE',        cls: 'DURABLE',    cadence: 'MO 1,12' },
  { id: '023', name: 'CARD, MANIFEST, PRINTED',      cls: 'BRAND',      cadence: 'MONTHLY' },
] as const

const MONTHLY_LOADS: Record<number, string[]> = {
  1:  ['001','002','004','005','007','008','012','017','022','023'],
  2:  ['001','003','006','007','009','011','014','016','023'],
  3:  ['001','002','005','007','008','010','015','023'],
  4:  ['001','003','004','007','009','013','016','023'],
  5:  ['001','002','005','006','007','008','011','018','023'],
  6:  ['001','003','007','009','014','019','023'],
  7:  ['001','002','004','005','007','008','017','020','023'],
  8:  ['001','003','006','007','009','011','016','023'],
  9:  ['001','002','005','007','008','010','021','023'],
  10: ['001','003','004','005','013','014','023'],
  11: ['001','002','005','006','007','008','011','018','023'],
  12: ['001','007','009','016','022','023'],
}

// ─── DEMO ISSUE LOG (M3 — replace with /api/basics/issues) ──────────────────

const DEMO_ISSUE_LOG: IssueLogEntry[] = [
  {
    id:           'ISS-2026-05',
    issueDate:    '01-05-2026',
    month:        5,
    year:         2026,
    items:        MONTHLY_LOADS[5],
    status:       'DELIVERED',
    trackingCode: 'LT0050012260US',
  },
  {
    id:        'ISS-2026-06',
    issueDate: '01-06-2026',
    month:     6,
    year:      2026,
    items:     MONTHLY_LOADS[6],
    status:    'IN TRANSIT',
    trackingCode: 'LT0060012260US',
  },
  {
    id:        'ISS-2026-07',
    issueDate: '01-07-2026',
    month:     7,
    year:      2026,
    items:     MONTHLY_LOADS[7],
    status:    'SCHEDULED',
  },
]

// ─── MANIFEST TABLE ───────────────────────────────────────────────────────────

const ManifestTable: React.FC = () => {
  const currentMonth = dayjs().month() + 1
  const thisMonthItems = MONTHLY_LOADS[currentMonth] ?? []

  return (
    <div className="flex flex-col">
      {/* Column headers */}
      <div className="flex gap-x-8 py-4 border-b border-acc/20 text-acc/40 select-none">
        <span className="w-[40px] flex-shrink-0">NO.</span>
        <span className="flex-1">NOMENCLATURE</span>
        <span className="hidden phone:block w-[100px] flex-shrink-0">CLASS</span>
        <span className="hidden tablet:block w-[180px] flex-shrink-0">CADENCE</span>
      </div>

      {RATION_ITEMS.map((item, idx) => {
        const inThisMonth = thisMonthItems.includes(item.id)
        return (
          <div
            key={item.id}
            className={cn(
              'flex gap-x-8 py-4 border-b border-acc/10',
              inThisMonth && 'bg-acc/5'
            )}
          >
            <span className="w-[40px] flex-shrink-0 text-acc/30">{item.id}</span>
            <span className={cn('flex-1', inThisMonth ? 'text-acc' : 'text-acc/70')}>
              {item.name}
            </span>
            <span className="hidden phone:block w-[100px] flex-shrink-0 text-acc/40">
              {item.cls}
            </span>
            <span className="hidden tablet:block w-[180px] flex-shrink-0 text-acc/40">
              {item.cadence}
            </span>
          </div>
        )
      })}

      <div className="flex gap-x-16 pt-8 text-acc/30">
        <span>23 items</span>
        <span>14 consumable</span>
        <span>8 durable</span>
        <span>1 brand</span>
      </div>
    </div>
  )
}

// ─── ISSUE LOG (M3) ──────────────────────────────────────────────────────────

const IssueLogSection: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const statusColor = (s: IssueLogEntry['status']): 'blue' | undefined =>
    s === 'DELIVERED' ? 'blue' : undefined

  return (
    <div className="flex flex-col gap-y-4">
      {DEMO_ISSUE_LOG.map(entry => {
        const isExpanded = expanded === entry.id
        const itemNames = entry.items
          .map(id => RATION_ITEMS.find(r => r.id === id)?.name)
          .filter(Boolean)

        return (
          <div key={entry.id} className={cn('border-b border-acc/10', entry.status === 'SCHEDULED' && 'opacity-50')}>
            <GhostButton
              className="w-full flex items-center gap-x-8 py-4"
              onClick={() => setExpanded(isExpanded ? null : entry.id)}
            >
              <span className="text-acc/40 w-[100px] flex-shrink-0">{entry.issueDate}</span>
              <span className="text-acc/40 w-[48px] flex-shrink-0">
                MO {String(entry.month).padStart(2, '0')}
              </span>
              <span className="flex-1 text-acc/60">{entry.items.length} items</span>
              <Tag fill={entry.status === 'DELIVERED'} className="flex-shrink-0">
                {entry.status}
              </Tag>
            </GhostButton>

            {isExpanded && (
              <div className="pb-8 pl-[148px] flex flex-col gap-y-4">
                <div className="flex flex-wrap gap-4">
                  {itemNames.map(name => (
                    <span key={name} className="text-acc/50 border border-acc/20 px-4 py-1 rounded">
                      {name}
                    </span>
                  ))}
                </div>
                {entry.trackingCode && (
                  <span className="text-acc/30">
                    Tracking: {entry.trackingCode}
                  </span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export const BasicsPage: React.FC = () => {
  const me = useStore(stores.me)

  const tier = React.useMemo<RationTier>(() => {
    if (!me) return 'public'
    const tags = (me.tags || []).map(t => t.toLowerCase())
    if (tags.includes(UserTag.Basic.toLowerCase())) return 'basic'
    if (tags.includes(UserTag.Usership.toLowerCase())) return 'usership'
    return 'public'
  }, [me])

  const nextIssue = React.useMemo(() =>
    dayjs().add(1, 'month').startOf('month').format('D MMM'),
    []
  )

  return (
    <div className="flex flex-col gap-y-24 max-w-[700px]">

      {/* ── PLAN STATUS ── */}
      <div>
        <Block label="Plan:">
          {tier === 'basic'
            ? 'On strength.'
            : tier === 'usership'
            ? 'Not enrolled.'
            : '—'
          }
        </Block>
        {tier === 'basic' && (
          <Block label="Next issue:">
            {nextIssue}
          </Block>
        )}
        {tier === 'basic' && (
          <Block label="Manage:">
            <GhostButton onClick={() => goTo('settings')}>
              Settings →
            </GhostButton>
          </Block>
        )}
      </div>

      {/* ── DOCTRINE ── */}
      <div className="flex flex-col gap-y-8">
        <div>Eliminate one distraction.</div>
        <div className="text-acc/60 max-w-[520px] leading-relaxed">
          LOT issues, it does not sell. The subscriber is on strength —
          a person carried on the unit's roster and supplied accordingly.
          Daily-routine consumables are removed from the subscriber's
          cognitive load and delivered on a fixed cadence.
          The subscriber ceases to decide; the system decides.
        </div>
      </div>

      {/* ── PLAN DETAILS ── */}
      <div>
        <Block label="Items issued:">23</Block>
        <Block label="Tier:">Basic</Block>
        <Block label="Price:">USD 100.00 / month</Block>
        <Block label="Relation:">Add-on to Usership (AI) plan. AI plan persists beneath.</Block>
        <Block label="Terms:">Issued, not sold. Return when spent. This is between us.</Block>
      </div>

      {/* ── ITEM REGISTER ── */}
      <div className="flex flex-col gap-y-8">
        <div className="text-acc/40">
          Item register
          {tier === 'basic' && <span className="ml-8">— highlighted: this month's load</span>}
        </div>
        <ManifestTable />
      </div>

      {/* ── THIS MONTH'S LOAD (Basic tier) ── */}
      {tier === 'basic' && (
        <div className="flex flex-col gap-y-8">
          <div className="text-acc/40">Issue log</div>
          <IssueLogSection />
        </div>
      )}

      {/* ── CTA: Usership tier ── */}
      {tier === 'usership' && (
        <div className="flex flex-col gap-y-8">
          <div className="text-acc/60 max-w-[440px]">
            Enroll in the Basics plan from Settings.
            Shipping address and payment managed there.
          </div>
          <Button kind="primary" onClick={() => goTo('settings')}>
            Go to Settings →
          </Button>
        </div>
      )}

      {/* ── PUBLIC VIEW ── */}
      {tier === 'public' && (
        <div className="text-acc/40 max-w-[440px]">
          Usership subscription required to enroll.
        </div>
      )}

    </div>
  )
}
