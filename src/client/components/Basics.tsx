/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | brand.lot-systems.com
 *
 * BASICS TAB — LOT-FM-001 / OPEN TAB / CIVILIAN RATION SUBSCRIPTION
 * Visual ref: IBM 3270 terminal / dot-matrix / DD-form ledger
 *
 * M1 — Doctrine, manifest, price, product gallery
 * M2 — Auth tiers, upgrade control, status line, stand-down
 * M3 — Issue log, monthly cadence, next-issue date
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { UserTag, RationTier, IssueLogEntry } from '#shared/types'
import dayjs from 'dayjs'

// ─── RATION LOAD (LOT-FM-001 §2.1) ──────────────────────────────────────────

const RATION_ITEMS = [
  { id: '001', name: 'SOCK, COTTON, CREW, 2 PAIR',   cls: 'CONSUMABLE', cadence: 'MONTHLY',              cogs: '$3.00' },
  { id: '002', name: 'BRIEF, COTTON',                 cls: 'CONSUMABLE', cadence: 'MO 1,3,5,7,9,11',     cogs: '$3.50' },
  { id: '003', name: 'SHIRT, TEE, COTTON, BLACK',     cls: 'DURABLE',    cadence: 'MO 2,6,10',           cogs: '$5.00' },
  { id: '004', name: 'BRUSH, TOOTH',                  cls: 'DURABLE',    cadence: 'MO 1,4,7,10',         cogs: '$0.40' },
  { id: '005', name: 'PASTE, TOOTH, TUBE',            cls: 'CONSUMABLE', cadence: 'MO 1,3,5,7,9,11',     cogs: '$1.20' },
  { id: '006', name: 'FLOSS, DENTAL',                 cls: 'CONSUMABLE', cadence: 'MO 2,5,8,11',         cogs: '$0.50' },
  { id: '007', name: 'SOAP, BAR',                     cls: 'CONSUMABLE', cadence: 'MONTHLY',              cogs: '$0.70' },
  { id: '008', name: 'DEODORANT, STICK',              cls: 'CONSUMABLE', cadence: 'MO 1,3,5,7,9,11',     cogs: '$1.80' },
  { id: '009', name: 'PAD, COTTON, PACK',             cls: 'CONSUMABLE', cadence: 'MO 2,4,6,8,10,12',    cogs: '$0.90' },
  { id: '010', name: 'SWAB, COTTON, BOX',             cls: 'CONSUMABLE', cadence: 'MO 3,9',              cogs: '$0.80' },
  { id: '011', name: 'BLADE, RAZOR, HEAD, 4-PACK',   cls: 'CONSUMABLE', cadence: 'MO 2,5,8,11',         cogs: '$2.50' },
  { id: '012', name: 'HANDLE, RAZOR',                 cls: 'DURABLE',    cadence: 'MO 1 ONLY',           cogs: '$1.50' },
  { id: '013', name: 'SOAP, SHAVE',                   cls: 'CONSUMABLE', cadence: 'MO 4,10',             cogs: '$1.80' },
  { id: '014', name: 'BAR, SHAMPOO',                  cls: 'CONSUMABLE', cadence: 'MO 2,6,10',           cogs: '$1.50' },
  { id: '015', name: 'CLIPPER, NAIL',                 cls: 'DURABLE',    cadence: 'MO 3 ONLY',           cogs: '$0.90' },
  { id: '016', name: 'HANDKERCHIEF, COTTON, BLACK',  cls: 'DURABLE',    cadence: 'MO 4,8,12',           cogs: '$1.20' },
  { id: '017', name: 'BALM, LIP',                     cls: 'CONSUMABLE', cadence: 'MO 1,7',              cogs: '$0.70' },
  { id: '018', name: 'CREAM, HAND/FACE, TUBE',       cls: 'CONSUMABLE', cadence: 'MO 5,11',             cogs: '$1.80' },
  { id: '019', name: 'STICK, SUN, SPF',              cls: 'CONSUMABLE', cadence: 'MO 6 (SEASONAL)',     cogs: '$2.50' },
  { id: '020', name: 'TOWEL, COTTON/MICROFIBER',     cls: 'DURABLE',    cadence: 'MO 7 ONLY',           cogs: '$4.00' },
  { id: '021', name: 'CAP, COTTON / BEANIE',         cls: 'DURABLE',    cadence: 'MO 9 (SEASONAL)',     cogs: '$3.50' },
  { id: '022', name: 'BAG, COTTON, REUSABLE',        cls: 'DURABLE',    cadence: 'MO 1,12',             cogs: '$2.50' },
  { id: '023', name: 'CARD, MANIFEST, PRINTED',      cls: 'BRAND',      cadence: 'MONTHLY',              cogs: '$0.30' },
] as const

// Monthly load map with goods COGS (LOT-FM-001 §2.3)
const MONTHLY_LOADS: Record<number, { items: string[]; cogs: string; note?: string }> = {
  1:  { items: ['001','002','004','005','007','008','012','017','022','023'], cogs: '~$15.30' },
  2:  { items: ['001','003','006','007','009','011','014','016','023'],       cogs: '~$15.40' },
  3:  { items: ['001','002','005','007','008','010','015','023'],             cogs: '~$12.30' },
  4:  { items: ['001','003','004','007','009','013','016','023'],             cogs: '~$17.40' },
  5:  { items: ['001','002','005','006','007','008','011','018','023'],       cogs: '~$15.80' },
  6:  { items: ['001','003','007','009','014','019','023'],                   cogs: '~$13.50' },
  7:  { items: ['001','002','004','005','007','008','017','020','023'],       cogs: '~$17.10' },
  8:  { items: ['001','003','006','007','009','011','016','023'],             cogs: '~$15.40' },
  9:  { items: ['001','002','005','007','008','010','021','023'],             cogs: '~$15.80' },
  10: { items: ['001','003','004','005','013','014','023'],                   cogs: '~$17.90', note: '+ 002,007,008 backfill' },
  11: { items: ['001','002','005','006','007','008','011','018','023'],       cogs: '~$15.80' },
  12: { items: ['001','007','009','016','022','023'],                         cogs: '~$11.70' },
}

// ─── PRODUCT GALLERY SLOTS ───────────────────────────────────────────────────

const GALLERY_SLOTS = [
  { code: 'LOT 0006', label: 'FLOSS, DENTAL',         imgPath: '/basics/lot-floss.png',   bg: '#f0f0ec', dark: false },
  { code: 'LOT 0003', label: 'SHIRT, TEE, COTTON',    imgPath: '/basics/lot-tee.png',     bg: '#111111', dark: true  },
  { code: 'LOT 0018', label: 'CREAM, HAND/FACE',      imgPath: '/basics/lot-cream.png',   bg: '#0a0a0a', dark: true  },
  { code: 'LOT 0015', label: 'CLIPPER, NAIL',         imgPath: '/basics/lot-clipper.png', bg: '#111111', dark: true  },
  { code: 'LOT 0022', label: 'BAG, COTTON, REUSABLE', imgPath: '/basics/lot-bag.png',     bg: '#111111', dark: true  },
] as const

// ─── DEMO ISSUE LOG (M3 — replace with /api/basics/issues) ──────────────────

const DEMO_ISSUE_LOG: IssueLogEntry[] = [
  {
    id:           'ISS-2026-05',
    issueDate:    '01-05-2026',
    month:        5,
    year:         2026,
    items:        MONTHLY_LOADS[5].items,
    status:       'DELIVERED',
    trackingCode: 'LT0050012260US',
  },
  {
    id:        'ISS-2026-06',
    issueDate: '01-06-2026',
    month:     6,
    year:      2026,
    items:     MONTHLY_LOADS[6].items,
    status:    'IN TRANSIT',
    trackingCode: 'LT0060012260US',
  },
  {
    id:        'ISS-2026-07',
    issueDate: '01-07-2026',
    month:     7,
    year:      2026,
    items:     MONTHLY_LOADS[7].items,
    status:    'SCHEDULED',
  },
]

// ─── LOT TERMINAL DESIGN TOKENS (IBM 3270 / dot-matrix) ─────────────────────

const T = {
  font:          'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  fontWeight:    400 as const,
  fontWeightBold: 700 as const,
  fontSize:      '13px',
  fontSizeSm:    '11px',
  bg:            '#1a1a1a',        // terminal ground
  bgAlt:         '#1f1f1f',        // alternate row
  bgInset:       '#141414',        // inset / sub-panel
  ink:           '#888888',        // standard text (dim)
  inkMid:        '#aaaaaa',        // moderate emphasis
  inkBright:     '#e0e0e0',        // primary text (bright)
  inkInvert:     '#1a1a1a',        // text on inverted field
  invertBg:      '#c8c8c8',        // inverted field (light on dark)
  ruleMajor:     'rgba(200,200,200,0.35)', // === weight
  ruleMinor:     'rgba(200,200,200,0.10)', // --- weight
  pad:           '6px',
  padY:          '8px',
  padX:          '20px',
  radius:        '0px',
  letterSpacing: '0.05em',
}

const S: Record<string, React.CSSProperties> = {
  root: {
    fontFamily:    T.font,
    fontWeight:    T.fontWeight,
    fontSize:      T.fontSize,
    background:    T.bg,
    color:         T.ink,
    letterSpacing: T.letterSpacing,
    textTransform: 'uppercase',
    lineHeight:    '1.6',
    minHeight:     '100vh',
  },
}

// ─── UTILITY COMPONENTS ──────────────────────────────────────────────────────

/** Full-width ASCII rule using repeated characters — clips at container edge */
const AsciiRule: React.FC<{
  char?: '=' | '-'
  padded?: boolean
}> = ({ char = '=', padded = false }) => (
  <div
    aria-hidden
    style={{
      overflow:      'hidden',
      whiteSpace:    'nowrap',
      letterSpacing: '0',
      lineHeight:    '1',
      padding:       padded ? `0 ${T.padX}` : '0',
      color:         char === '=' ? T.ruleMajor : T.ruleMinor,
      userSelect:    'none',
    }}
  >
    {char.repeat(300)}
  </div>
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    color:         T.ink,
    fontSize:      T.fontSizeSm,
    padding:       `4px ${T.padX}`,
    letterSpacing: T.letterSpacing,
  }}>
    {children}
  </div>
)

// ─── FIELD MANUAL HEADER BLOCK ───────────────────────────────────────────────

const FmHeader: React.FC = () => {
  const now = dayjs()

  return (
    <div style={{ padding: `12px 0 0` }}>
      <AsciiRule char="=" />
      <div style={{
        padding:    `8px ${T.padX}`,
        color:      T.inkBright,
        lineHeight: '1.8',
      }}>
        <div>LOT SYSTEMS / FIELD MANUAL</div>
        <div>DOCUMENT: LOT-FM-001</div>
        <div>TITLE:    CIVILIAN RATION SUBSCRIPTION</div>
        <div>CLASS:    UNRESTRICTED // OPEN TAB</div>
        <div>REV:      A</div>
        <div style={{ color: T.inkMid }}>DATE:     {now.format('YYYY-MM-DD')}</div>
      </div>
      <AsciiRule char="=" />
    </div>
  )
}

// ─── STATUS LINE ─────────────────────────────────────────────────────────────

const StatusLine: React.FC<{ tier: RationTier }> = ({ tier }) => {
  const nextIssue = React.useMemo(() => {
    return dayjs().add(1, 'month').startOf('month').format('DD-MM')
  }, [])

  const cells =
    tier === 'basic'
      ? [
          { label: 'STATUS',     val: 'ON STRENGTH',    hi: true  },
          { label: 'NEXT ISSUE', val: nextIssue,         hi: false },
          { label: 'TIER',       val: 'BASIC',           hi: false },
        ]
      : tier === 'usership'
      ? [
          { label: 'STATUS', val: 'USERSHIP / AI',     hi: false },
          { label: 'BASIC',  val: 'NOT ENROLLED',      hi: false },
        ]
      : [
          { label: 'TAB',   val: 'OPEN',               hi: false },
          { label: 'CLASS', val: 'PUBLIC READ-ONLY',   hi: false },
        ]

  return (
    <div style={{
      display:       'flex',
      gap:           '0',
      borderBottom:  `1px solid ${T.ruleMajor}`,
    }}>
      {cells.map(({ label, val, hi }) => (
        <div key={label} style={{
          padding:      `${T.padY} ${T.padX}`,
          borderRight:  `1px solid ${T.ruleMinor}`,
          background:   hi ? T.invertBg : 'transparent',
          color:        hi ? T.inkInvert : T.inkMid,
          fontWeight:   hi ? T.fontWeightBold : T.fontWeight,
          minWidth:     '120px',
        }}>
          <div style={{ fontSize: T.fontSizeSm, opacity: 0.6, marginBottom: '2px' }}>{label}</div>
          <div style={{ color: hi ? T.inkInvert : T.inkBright }}>{val}</div>
        </div>
      ))}
    </div>
  )
}

// ─── DOCTRINE ────────────────────────────────────────────────────────────────

const DoctrineSection: React.FC = () => (
  <div>
    <div style={{ padding: `16px ${T.padX} 8px` }}>
      <div style={{ color: T.inkBright, marginBottom: '12px' }}>
        ELIMINATE ONE DISTRACTION.
      </div>
      <div style={{ color: T.ink, maxWidth: '560px', lineHeight: '1.9', fontSize: T.fontSizeSm }}>
        LOT ISSUES, IT DOES NOT SELL. THE SUBSCRIBER IS ON STRENGTH —
        A PERSON CARRIED ON THE UNIT&apos;S ROSTER AND SUPPLIED ACCORDINGLY.
        DAILY-ROUTINE CONSUMABLES ARE REMOVED FROM THE SUBSCRIBER&apos;S
        COGNITIVE LOAD AND DELIVERED ON A FIXED CADENCE.
        THE SUBSCRIBER CEASES TO DECIDE; THE SYSTEM DECIDES.
      </div>
    </div>

    <AsciiRule char="-" />

    <div style={{ display: 'flex' }}>
      {[
        { k: 'ITEMS',  v: '23' },
        { k: 'TIER',   v: 'BASIC' },
        { k: 'PRICE',  v: 'USD 100.00 / MO' },
        { k: 'MARGIN', v: '≥ 60% GROSS' },
      ].map(({ k, v }) => (
        <div key={k} style={{
          padding:     `${T.padY} ${T.padX}`,
          borderRight: `1px solid ${T.ruleMinor}`,
          flex:        1,
        }}>
          <div style={{ fontSize: T.fontSizeSm, color: T.ink, marginBottom: '3px' }}>{k}</div>
          <div style={{ color: T.inkBright }}>{v}</div>
        </div>
      ))}
    </div>

    <AsciiRule char="=" />
  </div>
)

// ─── PRODUCT GALLERY ─────────────────────────────────────────────────────────

const ProductGallery: React.FC = () => {
  const [imgErrors, setImgErrors] = React.useState<Record<string, boolean>>({})

  return (
    <div>
      <SectionLabel>EQUIPMENT REFERENCE // 5 ITEMS SHOWN</SectionLabel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {GALLERY_SLOTS.map((slot, i) => {
          const hasImage = !imgErrors[slot.code]
          const isLast = i === GALLERY_SLOTS.length - 1
          return (
            <div
              key={slot.code}
              style={{
                position:    'relative',
                aspectRatio: '4/5',
                overflow:    'hidden',
                background:  slot.bg,
                borderRight: isLast ? 'none' : `1px solid ${T.ruleMinor}`,
              }}
            >
              {hasImage ? (
                <img
                  src={slot.imgPath}
                  alt={slot.label}
                  onError={() => setImgErrors(p => ({ ...p, [slot.code]: true }))}
                  style={{
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'contain',
                    display:    'block',
                  }}
                />
              ) : (
                /* CSS placeholder — LOT object silhouette */
                <div style={{
                  width:          '100%',
                  height:         '100%',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width:   '35%',
                    height:  '55%',
                    border:  `1px solid ${slot.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  }} />
                </div>
              )}

              {/* Dot-matrix issue stamp */}
              <div style={{
                position:      'absolute',
                bottom:        '6px',
                right:         '8px',
                fontFamily:    T.font,
                fontSize:      '9px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color:         slot.dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
                textAlign:     'right',
                lineHeight:    '1.4',
              }}>
                <div>{slot.code}</div>
                <div style={{ fontSize: '8px' }}>{slot.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      <AsciiRule char="=" />
    </div>
  )
}

// ─── ITEM REGISTER (MANIFEST TABLE) ──────────────────────────────────────────

const ManifestSection: React.FC<{ showCogs: boolean }> = ({ showCogs }) => {
  const cols = showCogs
    ? { item: '52px', name: '1fr', cls: '130px', cadence: '200px', cogs: '90px' }
    : { item: '52px', name: '1fr', cls: '130px', cadence: '200px' }

  const gridCols = showCogs
    ? `${cols.item} ${cols.name} ${cols.cls} ${cols.cadence} ${cols.cogs}`
    : `${cols.item} ${cols.name} ${cols.cls} ${cols.cadence}`

  const headers = ['ITEM', 'NOMENCLATURE', 'CLASS', 'ISSUE CADENCE', ...(showCogs ? ['EST COGS'] : [])]

  return (
    <div>
      <SectionLabel>ITEM REGISTER // {RATION_ITEMS.length} ITEMS</SectionLabel>
      <AsciiRule char="-" />

      {/* Column headers */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: gridCols,
        color:               T.inkMid,
        fontSize:            T.fontSizeSm,
      }}>
        {headers.map((h, i) => (
          <div key={h} style={{
            padding:   `${T.pad} ${T.padX}`,
            textAlign: i === headers.length - 1 && showCogs ? 'right' : 'left',
          }}>
            {h}
          </div>
        ))}
      </div>

      <AsciiRule char="-" />

      {/* Item rows */}
      {RATION_ITEMS.map((item, idx) => (
        <div
          key={item.id}
          style={{
            display:             'grid',
            gridTemplateColumns: gridCols,
            background:          idx % 2 === 1 ? T.bgAlt : 'transparent',
          }}
        >
          <div style={{ padding: `${T.pad} ${T.padX}`, color: T.ink }}>{item.id}</div>
          <div style={{ padding: `${T.pad} ${T.padX}`, color: T.inkBright }}>{item.name}</div>
          <div style={{ padding: `${T.pad} ${T.padX}`, color: T.inkMid }}>{item.cls}</div>
          <div style={{ padding: `${T.pad} ${T.padX}`, color: T.ink }}>{item.cadence}</div>
          {showCogs && (
            <div style={{ padding: `${T.pad} ${T.padX}`, color: T.inkMid, textAlign: 'right' }}>
              {item.cogs}
            </div>
          )}
        </div>
      ))}

      <AsciiRule char="-" />

      {/* Footer */}
      <div style={{
        padding:  `${T.pad} ${T.padX}`,
        color:    T.ink,
        fontSize: T.fontSizeSm,
        display:  'flex',
        gap:      '32px',
      }}>
        <span>{RATION_ITEMS.length} ITEMS TOTAL</span>
        <span>CONSUMABLE: 14</span>
        <span>DURABLE: 8</span>
        <span>BRAND: 1</span>
        {showCogs && <span style={{ marginLeft: 'auto' }}>AVG GOODS: ~$15.00 / MO</span>}
      </div>

      <AsciiRule char="=" />
    </div>
  )
}

// ─── MONTHLY LOAD CHECK (M3 — Basic tier + admin) ────────────────────────────

const MonthlyLoadTable: React.FC<{ showCogs: boolean }> = ({ showCogs }) => {
  const currentMonth = dayjs().month() + 1

  return (
    <div>
      <SectionLabel>MONTHLY LOAD CHECK</SectionLabel>
      <AsciiRule char="-" />

      {/* Header */}
      <div style={{ display: 'flex', color: T.inkMid, fontSize: T.fontSizeSm }}>
        <div style={{ width: '40px', padding: `${T.pad} ${T.padX}` }}>MO</div>
        <div style={{ flex: 1,       padding: `${T.pad} ${T.padX}` }}>CONTENTS</div>
        {showCogs && <div style={{ width: '100px', padding: `${T.pad} ${T.padX}`, textAlign: 'right' }}>GOODS COGS</div>}
      </div>

      <AsciiRule char="-" />

      {Object.entries(MONTHLY_LOADS).map(([mo, load]) => {
        const moNum = Number(mo)
        const isCurrent = moNum === currentMonth
        return (
          <div
            key={mo}
            style={{
              display:    'flex',
              background: isCurrent ? 'rgba(200,200,200,0.07)' : 'transparent',
              borderLeft: isCurrent ? `2px solid ${T.ruleMajor}` : '2px solid transparent',
            }}
          >
            <div style={{
              width:   '40px',
              padding: `${T.pad} ${T.padX}`,
              color:   isCurrent ? T.inkBright : T.ink,
            }}>
              {String(moNum).padStart(2, '0')}
            </div>
            <div style={{ flex: 1, padding: `${T.pad} ${T.padX}`, color: T.inkMid }}>
              {load.items.join(' ')}
              {load.note && (
                <span style={{ color: T.ink, marginLeft: '8px' }}>+ {load.note}</span>
              )}
            </div>
            {showCogs && (
              <div style={{ width: '100px', padding: `${T.pad} ${T.padX}`, textAlign: 'right', color: T.inkMid }}>
                {load.cogs}
              </div>
            )}
          </div>
        )
      })}

      <AsciiRule char="-" />

      {showCogs && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: `${T.pad} ${T.padX}` }}>
          <span style={{ color: T.ink, fontSize: T.fontSizeSm }}>GOODS AVERAGE</span>
          <span style={{ color: T.inkBright, marginLeft: '16px', fontSize: T.fontSizeSm }}>~$15.00 / MO</span>
        </div>
      )}

      <AsciiRule char="=" />
    </div>
  )
}

// ─── PRICE & TERMS ───────────────────────────────────────────────────────────

const PriceTerms: React.FC = () => (
  <div>
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: `16px ${T.padX}`, borderRight: `1px solid ${T.ruleMinor}` }}>
        <div style={{ color: T.ink, fontSize: T.fontSizeSm, marginBottom: '6px' }}>PLAN</div>
        <div style={{ color: T.inkBright, marginBottom: '4px' }}>BASIC — USD 100.00 / MONTH</div>
        <div style={{ color: T.ink, fontSize: T.fontSizeSm, lineHeight: '1.8' }}>
          ADD-ON TO USERSHIP (AI) PLAN.<br />
          AI PLAN PERSISTS BENEATH.
        </div>
      </div>
      <div style={{ flex: 1, padding: `16px ${T.padX}` }}>
        <div style={{ color: T.ink, fontSize: T.fontSizeSm, marginBottom: '6px' }}>TERMS</div>
        <div style={{ color: T.inkMid, fontSize: T.fontSizeSm, lineHeight: '2' }}>
          ISSUED, NOT SOLD.<br />
          RETURN WHEN SPENT.<br />
          THIS IS BETWEEN US.
        </div>
      </div>
    </div>
    <AsciiRule char="=" />
  </div>
)

// ─── UPGRADE CONTROL (M2 — Usership tier) ────────────────────────────────────

type UpgradeState = 'idle' | 'pending' | 'done'

const UpgradeControl: React.FC<{ onUpgrade: () => void }> = ({ onUpgrade }) => {
  const [state, setState] = React.useState<UpgradeState>('idle')

  const handleClick = () => {
    if (state !== 'idle') return
    setState('pending')
    // M3: wire to POST /api/basics/upgrade + Stripe recurring charge
    setTimeout(() => {
      setState('done')
      onUpgrade()
    }, 1600)
  }

  const label =
    state === 'idle'    ? 'UPGRADE → BASIC' :
    state === 'pending' ? 'GOING ON STRENGTH…' :
                          'ON STRENGTH.'

  return (
    <div style={{ padding: `20px ${T.padX}` }}>
      <div style={{ color: T.ink, fontSize: T.fontSizeSm, marginBottom: '12px' }}>PLAN TRANSITION</div>

      <button
        onClick={handleClick}
        disabled={state !== 'idle'}
        style={{
          fontFamily:    T.font,
          fontWeight:    T.fontWeightBold,
          fontSize:      T.fontSize,
          letterSpacing: T.letterSpacing,
          textTransform: 'uppercase',
          background:    state === 'idle' ? 'transparent' : T.invertBg,
          color:         state === 'idle' ? T.inkBright    : T.inkInvert,
          border:        `2px solid ${state === 'idle' ? T.ruleMajor : T.invertBg}`,
          borderRadius:  T.radius,
          padding:       `${T.pad} 24px`,
          cursor:        state === 'idle' ? 'pointer' : 'default',
          minWidth:      '220px',
          transition:    'background 120ms, color 120ms, border-color 120ms',
        }}
      >
        {label}
      </button>

      <div style={{ color: T.ink, fontSize: T.fontSizeSm, marginTop: '8px', opacity: 0.6 }}>
        USD 100.00 / MO ADDED TO USERSHIP PLAN. FIRST ISSUE NEXT MONTH.
      </div>
    </div>
  )
}

// ─── STAND-DOWN CONTROL (M2 — Basic tier) ────────────────────────────────────

const StandDownControl: React.FC<{ onStandDown: () => void }> = ({ onStandDown }) => {
  const [confirming, setConfirming] = React.useState(false)

  const btnBase: React.CSSProperties = {
    fontFamily:    T.font,
    fontWeight:    T.fontWeight,
    fontSize:      T.fontSizeSm,
    letterSpacing: T.letterSpacing,
    textTransform: 'uppercase',
    borderRadius:  T.radius,
    cursor:        'pointer',
    padding:       `4px 12px`,
  }

  return (
    <div style={{ padding: `12px ${T.padX}`, borderTop: `1px solid ${T.ruleMinor}` }}>
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          style={{ ...btnBase, background: 'transparent', color: T.ink, border: 'none', opacity: 0.35 }}
        >
          STAND DOWN
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: T.ink, fontSize: T.fontSizeSm }}>REMOVE FROM RATION ROSTER?</span>
          <button
            onClick={onStandDown}
            style={{ ...btnBase, background: T.invertBg, color: T.inkInvert, border: `2px solid ${T.invertBg}` }}
          >
            CONFIRM
          </button>
          <button
            onClick={() => setConfirming(false)}
            style={{ ...btnBase, background: 'transparent', color: T.inkMid, border: `1px solid ${T.ruleMinor}` }}
          >
            CANCEL
          </button>
        </div>
      )}
    </div>
  )
}

// ─── ISSUE LOG (M3) ──────────────────────────────────────────────────────────

const IssueLog: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const statusStyle = (s: IssueLogEntry['status']): React.CSSProperties => ({
    fontSize:      T.fontSizeSm,
    padding:       '1px 8px',
    border:        s === 'DELIVERED' ? 'none' : `1px solid ${T.ruleMinor}`,
    background:    s === 'DELIVERED' ? T.invertBg : 'transparent',
    color:         s === 'DELIVERED' ? T.inkInvert : T.ink,
    display:       'inline-block',
  })

  return (
    <div>
      <SectionLabel>ISSUE LOG</SectionLabel>
      <AsciiRule char="-" />

      {/* Column headers */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: '110px 70px 1fr 130px',
        color:               T.ink,
        fontSize:            T.fontSizeSm,
      }}>
        {['DATE', 'MO', 'CONTENTS', 'STATUS'].map(h => (
          <div key={h} style={{ padding: `${T.pad} ${T.padX}` }}>{h}</div>
        ))}
      </div>

      <AsciiRule char="-" />

      {DEMO_ISSUE_LOG.map(entry => {
        const isExpanded = expanded === entry.id
        return (
          <div key={entry.id} style={{ borderBottom: `1px solid ${T.ruleMinor}` }}>
            <div
              onClick={() => setExpanded(isExpanded ? null : entry.id)}
              style={{
                display:             'grid',
                gridTemplateColumns: '110px 70px 1fr 130px',
                cursor:              'pointer',
                background:          isExpanded ? T.bgAlt : 'transparent',
                opacity:             entry.status === 'SCHEDULED' ? 0.55 : 1,
              }}
            >
              <div style={{ padding: `${T.pad} ${T.padX}`, color: T.inkMid }}>{entry.issueDate}</div>
              <div style={{ padding: `${T.pad} ${T.padX}`, color: T.ink }}>
                MO {String(entry.month).padStart(2, '0')}
              </div>
              <div style={{ padding: `${T.pad} ${T.padX}`, color: T.inkMid }}>
                {entry.items.length} ITEMS
              </div>
              <div style={{ padding: `${T.pad} ${T.padX}` }}>
                <span style={statusStyle(entry.status)}>{entry.status}</span>
              </div>
            </div>

            {isExpanded && (
              <div style={{
                padding:    `8px ${T.padX} 12px`,
                background: T.bgInset,
                borderTop:  `1px solid ${T.ruleMinor}`,
              }}>
                <div style={{
                  display:   'flex',
                  flexWrap:  'wrap',
                  gap:       '6px',
                  marginBottom: entry.trackingCode ? '8px' : 0,
                }}>
                  {entry.items.map(id => {
                    const item = RATION_ITEMS.find(r => r.id === id)
                    return item ? (
                      <span key={id} style={{
                        border:  `1px solid ${T.ruleMinor}`,
                        padding: '1px 6px',
                        color:   T.ink,
                        fontSize: T.fontSizeSm,
                      }}>
                        {id} — {item.name}
                      </span>
                    ) : null
                  })}
                </div>
                {entry.trackingCode && (
                  <div style={{ color: T.ink, fontSize: T.fontSizeSm, marginTop: '6px', opacity: 0.5 }}>
                    TRACKING: {entry.trackingCode}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      <AsciiRule char="=" />
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export const BasicsPage: React.FC = () => {
  const me = useStore(stores.me)
  const [localTier, setLocalTier] = React.useState<RationTier | null>(null)

  const tier = React.useMemo<RationTier>(() => {
    if (localTier) return localTier
    if (!me) return 'public'
    if (me.tags?.includes(UserTag.Basic)) return 'basic'
    if (me.tags?.includes(UserTag.Usership)) return 'usership'
    return 'public'
  }, [me, localTier])

  const isAdmin = Boolean(me?.tags?.includes(UserTag.Admin))
  // COGS visible only to admin + basic subscribers (withheld from public per LOT-FM-001 §5.3)
  const showCogs = isAdmin

  const handleUpgrade = React.useCallback(() => {
    setTimeout(() => setLocalTier('basic'), 300)
  }, [])

  const handleStandDown = React.useCallback(() => {
    setLocalTier('usership')
  }, [])

  return (
    <div style={S.root}>

      {/* ── FIELD MANUAL HEADER ── */}
      <FmHeader />

      {/* ── M2: STATUS LINE ── */}
      <StatusLine tier={tier} />

      {/* ── M1: DOCTRINE + STATS ── */}
      <DoctrineSection />

      {/* ── M1: PRODUCT GALLERY ── */}
      <ProductGallery />

      {/* ── M1: ITEM REGISTER ── */}
      <ManifestSection showCogs={showCogs} />

      {/* ── M3: MONTHLY LOAD CHECK (Basic + admin) ── */}
      {(tier === 'basic' || isAdmin) && (
        <MonthlyLoadTable showCogs={showCogs} />
      )}

      {/* ── M1: PRICE & TERMS ── */}
      <PriceTerms />

      {/* ── M2: UPGRADE CONTROL ── */}
      {tier === 'usership' && (
        <UpgradeControl onUpgrade={handleUpgrade} />
      )}

      {/* ── M3: ISSUE LOG + STAND DOWN ── */}
      {tier === 'basic' && (
        <>
          <IssueLog />
          <StandDownControl onStandDown={handleStandDown} />
        </>
      )}

      {/* ── FOOTER ── */}
      <div style={{
        display:    'flex',
        gap:        '24px',
        padding:    `12px ${T.padX} 48px`,
        color:      T.ink,
        fontSize:   T.fontSizeSm,
        opacity:    0.3,
        flexWrap:   'wrap',
      }}>
        <span>LOT SYSTEMS</span>
        <span>LOT-FM-001 REV A</span>
        <span>FOUNDED 07-04-2016</span>
        <span>BRAND.LOT-SYSTEMS.COM</span>
      </div>

    </div>
  )
}
