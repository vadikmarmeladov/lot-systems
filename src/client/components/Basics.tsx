/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT® Founded 7 April 2016 | brand.lot-systems.com
 *
 * BASICS TAB — LOT-FM-001 / OPEN TAB / CIVILIAN RATION SUBSCRIPTION
 * Three-month phased delivery:
 *   M1 — Doctrine, manifest, price, product gallery
 *   M2 — Auth tiers, upgrade control, status line, stand-down
 *   M3 — Issue log, next-issue cadence, shipping roster
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { UserTag, RationTier, IssueLogEntry } from '#shared/types'
import dayjs from 'dayjs'

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

// Monthly load map (LOT-FM-001 §2.3)
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

// ─── PRODUCT GALLERY (5 reference slots, images drop into /public/basics/) ──

const GALLERY_SLOTS = [
  {
    code: 'LOT 0006',
    label: 'FLOSS, DENTAL',
    item: '006',
    imgPath: '/basics/lot-floss.png',
    bg: '#f0f0ec',  // translucent/natural
    style: 'natural',
  },
  {
    code: 'LOT 0003',
    label: 'SHIRT, TEE, COTTON',
    item: '003',
    imgPath: '/basics/lot-tee.png',
    bg: '#000000',
    style: 'black',
  },
  {
    code: 'LOT 0018',
    label: 'CREAM, HAND/FACE',
    item: '018',
    imgPath: '/basics/lot-cream.png',
    bg: '#000000',
    style: 'black',
  },
  {
    code: 'LOT 0015',
    label: 'CLIPPER, NAIL',
    item: '015',
    imgPath: '/basics/lot-clipper.png',
    bg: '#000000',
    style: 'black',
  },
  {
    code: 'LOT 0022',
    label: 'BAG, COTTON, REUSABLE',
    item: '022',
    imgPath: '/basics/lot-bag.png',
    bg: '#111111',
    style: 'black',
  },
] as const

// ─── MOCK ISSUE LOG (M3 — replace with API data) ─────────────────────────────

const DEMO_ISSUE_LOG: IssueLogEntry[] = [
  {
    id: 'ISS-2026-05',
    issueDate: '01-05-2026',
    month: 5,
    year: 2026,
    items: MONTHLY_LOADS[5],
    status: 'DELIVERED',
    trackingCode: 'LT0050012260US',
  },
  {
    id: 'ISS-2026-06',
    issueDate: '01-06-2026',
    month: 6,
    year: 2026,
    items: MONTHLY_LOADS[6],
    status: 'IN TRANSIT',
    trackingCode: 'LT0060012260US',
  },
  {
    id: 'ISS-2026-07',
    issueDate: '01-07-2026',
    month: 7,
    year: 2026,
    items: MONTHLY_LOADS[7],
    status: 'SCHEDULED',
  },
]

// ─── LOT TERMINAL DESIGN TOKENS ──────────────────────────────────────────────

const T = {
  font:        'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  fontWeight:  700 as const,
  fontSize:    '13px',
  bg:          '#ffffff',
  ink:         '#000000',
  invertBg:    '#000000',
  invertFg:    '#ffffff',
  pad:         '6px',
  padX:        '16px',
  rule:        '2px solid #000000',
  ruleLight:   '1px solid #000000',
  radius:      '0px',
  letterSpacing: '0.04em',
  lineHeight:  '1.6',
}

// ─── UTILITY COMPONENTS ──────────────────────────────────────────────────────

const LotRule: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div style={{ borderTop: T.rule, opacity, margin: 0 }} />
)

const LotCell: React.FC<{
  children: React.ReactNode
  inverted?: boolean
  style?: React.CSSProperties
}> = ({ children, inverted = false, style }) => (
  <div style={{
    fontFamily: T.font,
    fontWeight: T.fontWeight,
    fontSize:   T.fontSize,
    background: inverted ? T.invertBg : T.bg,
    color:      inverted ? T.invertFg : T.ink,
    padding:    `${T.pad} ${T.padX}`,
    letterSpacing: T.letterSpacing,
    textTransform: 'uppercase' as const,
    border:     `2px solid ${T.ink}`,
    borderRadius: T.radius,
    cursor:     'default',
    ...style,
  }}>
    {children}
  </div>
)

// ─── STATUS LINE (M2) ────────────────────────────────────────────────────────

const StatusLine: React.FC<{ tier: RationTier }> = ({ tier }) => {
  const nextIssue = React.useMemo(() => {
    const now = dayjs()
    const nextMonth = now.add(1, 'month').startOf('month')
    return nextMonth.format('DD-MM')
  }, [])

  if (tier === 'basic') {
    return (
      <div style={{
        fontFamily:    T.font,
        fontWeight:    T.fontWeight,
        fontSize:      T.fontSize,
        background:    T.invertBg,
        color:         T.invertFg,
        padding:       `${T.pad} ${T.padX}`,
        letterSpacing: T.letterSpacing,
        textTransform: 'uppercase',
        display:       'flex',
        gap:           '24px',
        flexWrap:      'wrap' as const,
      }}>
        <span>ON STRENGTH</span>
        <span>NEXT ISSUE: {nextIssue}</span>
        <span>TIER: BASIC</span>
      </div>
    )
  }

  if (tier === 'usership') {
    return (
      <div style={{
        fontFamily:    T.font,
        fontWeight:    T.fontWeight,
        fontSize:      T.fontSize,
        background:    T.bg,
        color:         T.ink,
        borderBottom:  T.rule,
        padding:       `${T.pad} ${T.padX}`,
        letterSpacing: T.letterSpacing,
        textTransform: 'uppercase',
        display:       'flex',
        gap:           '24px',
        flexWrap:      'wrap' as const,
        opacity:       0.5,
      }}>
        <span>USERSHIP / AI</span>
        <span>BASIC: NOT ENROLLED</span>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily:    T.font,
      fontWeight:    T.fontWeight,
      fontSize:      T.fontSize,
      color:         T.ink,
      borderBottom:  T.rule,
      padding:       `${T.pad} ${T.padX}`,
      letterSpacing: T.letterSpacing,
      textTransform: 'uppercase',
      opacity:       0.3,
    }}>
      TAB / OPEN — PUBLIC READ-ONLY
    </div>
  )
}

// ─── DOCTRINE SECTION (M1) ───────────────────────────────────────────────────

const DoctrineSection: React.FC = () => (
  <div style={{ padding: '0' }}>
    <div style={{
      fontFamily:    T.font,
      fontWeight:    T.fontWeight,
      background:    T.invertBg,
      color:         T.invertFg,
      padding:       `${T.pad} ${T.padX}`,
      letterSpacing: T.letterSpacing,
      fontSize:      T.fontSize,
      textTransform: 'uppercase',
    }}>
      LOT / BASIC — CIVILIAN RATION SUBSCRIPTION
    </div>

    <LotRule />

    <div style={{
      padding:    `32px ${T.padX}`,
      fontFamily: T.font,
      fontWeight: T.fontWeight,
      fontSize:   '11px',
      letterSpacing: T.letterSpacing,
      textTransform: 'uppercase',
      lineHeight: '2',
      color:      T.ink,
    }}>
      <div style={{ marginBottom: '16px', fontSize: '13px' }}>
        ELIMINATE ONE DISTRACTION.
      </div>
      <div style={{ opacity: 0.6, maxWidth: '480px' }}>
        LOT ISSUES, IT DOES NOT SELL. THE SUBSCRIBER IS ON STRENGTH —
        A PERSON CARRIED ON THE UNIT'S ROSTER AND SUPPLIED ACCORDINGLY.
        DAILY-ROUTINE CONSUMABLES ARE REMOVED FROM THE SUBSCRIBER'S
        COGNITIVE LOAD AND DELIVERED ON A FIXED CADENCE.
        THE SUBSCRIBER CEASES TO DECIDE; THE SYSTEM DECIDES.
      </div>
    </div>

    <LotRule />

    <div style={{
      display:       'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      fontFamily:    T.font,
      fontWeight:    T.fontWeight,
      fontSize:      T.fontSize,
      letterSpacing: T.letterSpacing,
      textTransform: 'uppercase',
    }}>
      {[
        { key: 'ITEMS ISSUED', val: '23' },
        { key: 'TIER', val: 'BASIC' },
        { key: 'PRICE', val: 'USD 100.00 / MO' },
      ].map(({ key, val }) => (
        <div key={key} style={{
          padding:     `10px ${T.padX}`,
          borderRight: T.ruleLight,
        }}>
          <div style={{ opacity: 0.4, marginBottom: '4px', fontSize: '11px' }}>{key}</div>
          <div>{val}</div>
        </div>
      ))}
    </div>

    <LotRule />
  </div>
)

// ─── PRODUCT GALLERY (M1 — images drop into /public/basics/) ─────────────────

const ProductGallery: React.FC = () => {
  const [imgErrors, setImgErrors] = React.useState<Record<string, boolean>>({})

  return (
    <div>
      <div style={{
        fontFamily:    T.font,
        fontWeight:    T.fontWeight,
        fontSize:      T.fontSize,
        letterSpacing: T.letterSpacing,
        textTransform: 'uppercase',
        padding:       `${T.pad} ${T.padX}`,
        opacity:       0.4,
      }}>
        EQUIPMENT REFERENCE
      </div>

      <div style={{
        display:   'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap:       '0',
      }}>
        {GALLERY_SLOTS.map((slot) => {
          const hasImage = !imgErrors[slot.code]
          return (
            <div key={slot.code} style={{
              borderRight: T.ruleLight,
              borderBottom: T.rule,
              position:    'relative',
              aspectRatio: '4/5',
              overflow:    'hidden',
              background:  slot.bg,
            }}>
              {hasImage && (
                <img
                  src={slot.imgPath}
                  alt={slot.label}
                  onError={() => setImgErrors(prev => ({ ...prev, [slot.code]: true }))}
                  style={{
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'contain',
                    display:    'block',
                    mixBlendMode: 'multiply',
                  }}
                />
              )}

              {/* Fallback: LOT-style geometric placeholder */}
              {!hasImage && (
                <div style={{
                  width:      '100%',
                  height:     '100%',
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: slot.bg,
                }}>
                  <div style={{
                    width:  '40%',
                    height: '55%',
                    background: slot.style === 'black' ? '#ffffff14' : '#00000014',
                    border: `1px solid ${slot.style === 'black' ? '#ffffff30' : '#00000030'}`,
                  }} />
                </div>
              )}

              {/* Dot-matrix issue stamp */}
              <div style={{
                position:      'absolute',
                bottom:        '6px',
                right:         '6px',
                fontFamily:    T.font,
                fontWeight:    T.fontWeight,
                fontSize:      '9px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color:         slot.style === 'black' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                lineHeight:    '1.4',
                textAlign:     'right',
              }}>
                <div>{slot.code}</div>
                <div>{slot.label}</div>
              </div>
            </div>
          )
        })}
      </div>
      <LotRule />
    </div>
  )
}

// ─── MANIFEST TABLE (M1) ─────────────────────────────────────────────────────

const ManifestSection: React.FC = () => (
  <div>
    {/* Header */}
    <div style={{
      display:    'grid',
      gridTemplateColumns: '48px 1fr 120px 180px',
      fontFamily: T.font,
      fontWeight: T.fontWeight,
      fontSize:   T.fontSize,
      letterSpacing: T.letterSpacing,
      textTransform: 'uppercase',
      background: T.invertBg,
      color:      T.invertFg,
    }}>
      {['ITEM', 'NOMENCLATURE', 'CLASS', 'ISSUE CADENCE'].map(h => (
        <div key={h} style={{ padding: `${T.pad} ${T.padX}` }}>{h}</div>
      ))}
    </div>

    {/* Rows */}
    {RATION_ITEMS.map((item, idx) => (
      <div key={item.id} style={{
        display:     'grid',
        gridTemplateColumns: '48px 1fr 120px 180px',
        fontFamily:  T.font,
        fontWeight:  T.fontWeight,
        fontSize:    T.fontSize,
        letterSpacing: T.letterSpacing,
        textTransform: 'uppercase',
        background:  idx % 2 === 0 ? T.bg : '#f8f8f8',
        borderBottom: T.ruleLight,
      }}>
        <div style={{ padding: `${T.pad} ${T.padX}`, opacity: 0.4 }}>{item.id}</div>
        <div style={{ padding: `${T.pad} ${T.padX}` }}>{item.name}</div>
        <div style={{ padding: `${T.pad} ${T.padX}`, opacity: 0.6 }}>{item.cls}</div>
        <div style={{ padding: `${T.pad} ${T.padX}`, opacity: 0.6 }}>{item.cadence}</div>
      </div>
    ))}

    <LotRule />

    {/* Manifest footer */}
    <div style={{
      fontFamily:    T.font,
      fontWeight:    T.fontWeight,
      fontSize:      '11px',
      letterSpacing: T.letterSpacing,
      textTransform: 'uppercase',
      padding:       `${T.pad} ${T.padX}`,
      opacity:       0.4,
      display:       'flex',
      gap:           '24px',
    }}>
      <span>23 ITEMS TOTAL</span>
      <span>CONSUMABLE: 14</span>
      <span>DURABLE: 8</span>
      <span>BRAND: 1</span>
    </div>

    <LotRule />
  </div>
)

// ─── PRICE & TERMS (M1) ──────────────────────────────────────────────────────

const PriceTerms: React.FC = () => (
  <div>
    <div style={{
      display:    'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: T.font,
      fontWeight: T.fontWeight,
      fontSize:   T.fontSize,
      letterSpacing: T.letterSpacing,
      textTransform: 'uppercase',
    }}>
      <div style={{ padding: `20px ${T.padX}`, borderRight: T.rule }}>
        <div style={{ opacity: 0.4, fontSize: '11px', marginBottom: '8px' }}>PLAN</div>
        <div style={{ fontSize: '15px' }}>BASIC — USD 100.00 / MONTH</div>
        <div style={{ opacity: 0.4, fontSize: '11px', marginTop: '8px' }}>
          ADD-ON TO USERSHIP (AI) PLAN. AI PLAN PERSISTS BENEATH.
        </div>
      </div>
      <div style={{ padding: `20px ${T.padX}` }}>
        <div style={{ opacity: 0.4, fontSize: '11px', marginBottom: '8px' }}>TERMS</div>
        <div style={{ opacity: 0.7, fontSize: '11px', lineHeight: '1.8' }}>
          ISSUED, NOT SOLD.<br />
          RETURN WHEN SPENT.<br />
          THIS IS BETWEEN US.
        </div>
      </div>
    </div>
    <LotRule />
  </div>
)

// ─── UPGRADE CONTROL (M2 — Usership tier) ────────────────────────────────────

type UpgradeState = 'idle' | 'pending' | 'done'

const UpgradeControl: React.FC<{ onUpgrade: () => void }> = ({ onUpgrade }) => {
  const [state, setState] = React.useState<UpgradeState>('idle')

  const handleClick = () => {
    if (state !== 'idle') return
    setState('pending')
    // M3: connect to /api/basics/upgrade — for now simulate transition
    setTimeout(() => {
      setState('done')
      onUpgrade()
    }, 1800)
  }

  return (
    <div style={{ padding: `24px ${T.padX}` }}>
      <div style={{
        fontFamily:    T.font,
        fontWeight:    T.fontWeight,
        fontSize:      '11px',
        letterSpacing: T.letterSpacing,
        textTransform: 'uppercase',
        opacity:       0.4,
        marginBottom:  '12px',
      }}>
        PLAN TRANSITION
      </div>

      <button
        onClick={handleClick}
        disabled={state !== 'idle'}
        style={{
          fontFamily:    T.font,
          fontWeight:    T.fontWeight,
          fontSize:      T.fontSize,
          letterSpacing: T.letterSpacing,
          textTransform: 'uppercase',
          background:    state === 'idle' ? T.bg : T.invertBg,
          color:         state === 'idle' ? T.ink : T.invertFg,
          border:        T.rule,
          borderRadius:  T.radius,
          padding:       `${T.pad} 24px`,
          cursor:        state === 'idle' ? 'pointer' : 'default',
          display:       'inline-block',
          transition:    'background 120ms, color 120ms',
          minWidth:      '220px',
        }}
      >
        {state === 'idle'   && 'UPGRADE → BASIC'}
        {state === 'pending' && 'GOING ON STRENGTH…'}
        {state === 'done'   && 'ON STRENGTH.'}
      </button>

      <div style={{
        fontFamily:    T.font,
        fontWeight:    T.fontWeight,
        fontSize:      '11px',
        letterSpacing: T.letterSpacing,
        textTransform: 'uppercase',
        opacity:       0.3,
        marginTop:     '10px',
      }}>
        USD 100.00 / MO ADDED TO USERSHIP PLAN. FIRST ISSUE NEXT MONTH.
      </div>
    </div>
  )
}

// ─── STAND-DOWN CONTROL (M2 — Basic tier) ────────────────────────────────────

const StandDownControl: React.FC<{ onStandDown: () => void }> = ({ onStandDown }) => {
  const [confirming, setConfirming] = React.useState(false)

  return (
    <div style={{ padding: `16px ${T.padX}`, borderTop: T.ruleLight }}>
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          style={{
            fontFamily:    T.font,
            fontWeight:    T.fontWeight,
            fontSize:      '11px',
            letterSpacing: T.letterSpacing,
            textTransform: 'uppercase',
            background:    'transparent',
            color:         T.ink,
            border:        'none',
            padding:       '0',
            cursor:        'pointer',
            opacity:       0.3,
            textDecoration: 'underline',
          }}
        >
          STAND DOWN
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{
            fontFamily:    T.font,
            fontWeight:    T.fontWeight,
            fontSize:      '11px',
            letterSpacing: T.letterSpacing,
            textTransform: 'uppercase',
            opacity:       0.5,
          }}>
            REMOVE FROM RATION ROSTER?
          </span>
          <button
            onClick={onStandDown}
            style={{
              fontFamily:    T.font,
              fontWeight:    T.fontWeight,
              fontSize:      '11px',
              letterSpacing: T.letterSpacing,
              textTransform: 'uppercase',
              background:    T.invertBg,
              color:         T.invertFg,
              border:        T.rule,
              borderRadius:  T.radius,
              padding:       `4px 12px`,
              cursor:        'pointer',
            }}
          >
            CONFIRM
          </button>
          <button
            onClick={() => setConfirming(false)}
            style={{
              fontFamily:    T.font,
              fontWeight:    T.fontWeight,
              fontSize:      '11px',
              letterSpacing: T.letterSpacing,
              textTransform: 'uppercase',
              background:    'transparent',
              color:         T.ink,
              border:        T.rule,
              borderRadius:  T.radius,
              padding:       `4px 12px`,
              cursor:        'pointer',
            }}
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

  return (
    <div>
      {/* Header */}
      <div style={{
        fontFamily:    T.font,
        fontWeight:    T.fontWeight,
        fontSize:      T.fontSize,
        letterSpacing: T.letterSpacing,
        textTransform: 'uppercase',
        background:    T.invertBg,
        color:         T.invertFg,
        padding:       `${T.pad} ${T.padX}`,
      }}>
        ISSUE LOG
      </div>

      {DEMO_ISSUE_LOG.map((entry) => {
        const isExpanded = expanded === entry.id
        const isScheduled = entry.status === 'SCHEDULED'

        return (
          <div key={entry.id} style={{ borderBottom: T.ruleLight }}>
            <div
              onClick={() => setExpanded(isExpanded ? null : entry.id)}
              style={{
                display:       'grid',
                gridTemplateColumns: '100px 80px 1fr 120px',
                fontFamily:    T.font,
                fontWeight:    T.fontWeight,
                fontSize:      T.fontSize,
                letterSpacing: T.letterSpacing,
                textTransform: 'uppercase',
                padding:       `${T.pad} ${T.padX}`,
                cursor:        'pointer',
                opacity:       isScheduled ? 0.5 : 1,
                background:    isExpanded ? '#f4f4f4' : T.bg,
              }}
            >
              <span>{entry.issueDate}</span>
              <span style={{ opacity: 0.4 }}>MO {String(entry.month).padStart(2, '0')}</span>
              <span style={{ opacity: 0.6 }}>{entry.items.length} ITEMS ISSUED</span>
              <span style={{
                background:    entry.status === 'DELIVERED' ? T.invertBg : 'transparent',
                color:         entry.status === 'DELIVERED' ? T.invertFg : T.ink,
                border:        entry.status !== 'DELIVERED' ? T.ruleLight : 'none',
                padding:       '1px 6px',
                fontSize:      '11px',
                textAlign:     'center' as const,
                justifySelf:   'start',
              }}>
                {entry.status}
              </span>
            </div>

            {isExpanded && (
              <div style={{
                padding:    `8px ${T.padX} 12px`,
                background: '#f4f4f4',
                borderTop:  T.ruleLight,
              }}>
                <div style={{
                  fontFamily:    T.font,
                  fontWeight:    T.fontWeight,
                  fontSize:      '11px',
                  letterSpacing: T.letterSpacing,
                  textTransform: 'uppercase',
                  display:       'flex',
                  flexWrap:      'wrap' as const,
                  gap:           '8px',
                  marginBottom:  entry.trackingCode ? '8px' : '0',
                }}>
                  {entry.items.map(id => {
                    const item = RATION_ITEMS.find(r => r.id === id)
                    return item ? (
                      <span key={id} style={{
                        border:  T.ruleLight,
                        padding: '2px 6px',
                        opacity: 0.7,
                      }}>
                        {id} — {item.name}
                      </span>
                    ) : null
                  })}
                </div>
                {entry.trackingCode && (
                  <div style={{
                    fontFamily:    T.font,
                    fontWeight:    T.fontWeight,
                    fontSize:      '11px',
                    letterSpacing: T.letterSpacing,
                    textTransform: 'uppercase',
                    opacity:       0.4,
                    marginTop:     '6px',
                  }}>
                    TRACKING: {entry.trackingCode}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      <LotRule />
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

  const handleUpgrade = React.useCallback(() => {
    // M3: persist to server via /api/basics/upgrade
    setTimeout(() => setLocalTier('basic'), 300)
  }, [])

  const handleStandDown = React.useCallback(() => {
    // M3: persist to server via /api/basics/stand-down
    setLocalTier('usership')
  }, [])

  return (
    <div style={{
      background:  T.bg,
      color:       T.ink,
      minHeight:   '100vh',
      fontFamily:  T.font,
      lineHeight:  T.lineHeight,
    }}>
      {/* ── M2: STATUS LINE ── */}
      <StatusLine tier={tier} />

      {/* ── M1: DOCTRINE ── */}
      <DoctrineSection />

      {/* ── M1: PRODUCT GALLERY ── */}
      <ProductGallery />

      {/* ── M1: MANIFEST ── */}
      <ManifestSection />

      {/* ── M1: PRICE & TERMS ── */}
      <PriceTerms />

      {/* ── M2: UPGRADE CONTROL (Usership only) ── */}
      {tier === 'usership' && (
        <UpgradeControl onUpgrade={handleUpgrade} />
      )}

      {/* ── M3: ISSUE LOG + STAND DOWN (Basic only) ── */}
      {tier === 'basic' && (
        <>
          <IssueLog />
          <StandDownControl onStandDown={handleStandDown} />
        </>
      )}

      {/* ── FOOTER ── */}
      <div style={{
        fontFamily:    T.font,
        fontWeight:    T.fontWeight,
        fontSize:      '11px',
        letterSpacing: T.letterSpacing,
        textTransform: 'uppercase',
        padding:       `16px ${T.padX} 48px`,
        opacity:       0.25,
        display:       'flex',
        gap:           '24px',
        flexWrap:      'wrap' as const,
      }}>
        <span>LOT SYSTEMS</span>
        <span>LOT-FM-001 REV A</span>
        <span>FOUNDED 07-04-2016</span>
        <span>BRAND.LOT-SYSTEMS.COM</span>
      </div>
    </div>
  )
}
