/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * BASICS TAB — LOT-FM-001
 * MONTH 1: OPEN TAB. 23-item ration ledger, doctrine, status line. Read-only.
 * A stranger can read what LOT issues and on what terms.
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import dayjs from '#client/utils/dayjs'

// ─── RATION MANIFEST ─────────────────────────────────────────────────────────
// 23-ITEM LOAD. COGS WITHHELD. NOMENCLATURE + CADENCE ONLY.

type RationItem = {
  id: string
  section: string
  nomenclature: string
  spec: string
  cadence: 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL'
}

const RATION_MANIFEST: RationItem[] = [
  // SUSTENANCE
  { id: '01', section: 'SUSTENANCE', nomenclature: 'OATMEAL — QUICK COOK', spec: '7 × 50G PACKET / PLAIN', cadence: 'MONTHLY' },
  { id: '02', section: 'SUSTENANCE', nomenclature: 'TRAIL MIX — NUTS + SEEDS', spec: '200G BULK / NO ADDED SUGAR', cadence: 'MONTHLY' },
  { id: '03', section: 'SUSTENANCE', nomenclature: 'PROTEIN — MEAT JERKY', spec: '7 × 30G PACKET / BEEF OR POULTRY', cadence: 'MONTHLY' },
  { id: '04', section: 'SUSTENANCE', nomenclature: 'COFFEE — GROUND MEDIUM ROAST', spec: '250G BAG / SINGLE ORIGIN', cadence: 'MONTHLY' },
  { id: '05', section: 'SUSTENANCE', nomenclature: 'TEA — GREEN SACHETS', spec: '20-UNIT BOX / UNFLAVORED', cadence: 'MONTHLY' },
  { id: '06', section: 'SUSTENANCE', nomenclature: 'ELECTROLYTE SACHETS', spec: '30 × 5G SACHET / NO ARTIFICIAL COLOR', cadence: 'MONTHLY' },
  { id: '07', section: 'SUSTENANCE', nomenclature: 'NUTRITION BAR — WHOLE FOOD', spec: '12-UNIT PACK / ≥15G PROTEIN EACH', cadence: 'MONTHLY' },
  { id: '08', section: 'SUSTENANCE', nomenclature: 'OLIVE OIL — EXTRA VIRGIN', spec: '250ML BOTTLE / COLD PRESS', cadence: 'MONTHLY' },
  { id: '09', section: 'SUSTENANCE', nomenclature: 'SALT — SEA UNREFINED', spec: '200G POUCH / MINERAL COMPLETE', cadence: 'MONTHLY' },
  // HYGIENE
  { id: '10', section: 'HYGIENE', nomenclature: 'SOAP — UNSCENTED BAR', spec: '4 × 100G / NO SYNTHETIC FRAGRANCE', cadence: 'MONTHLY' },
  { id: '11', section: 'HYGIENE', nomenclature: 'TOOTHPASTE — FLUORIDE', spec: '1 × 100ML TUBE / NO MICROBEADS', cadence: 'MONTHLY' },
  { id: '12', section: 'HYGIENE', nomenclature: 'DENTAL FLOSS', spec: '1 × 50M SPOOL / WAX', cadence: 'MONTHLY' },
  { id: '13', section: 'HYGIENE', nomenclature: 'RAZOR BLADES — TWIN CARTRIDGE', spec: '4-UNIT PACK / REFILLABLE HANDLE', cadence: 'MONTHLY' },
  { id: '14', section: 'HYGIENE', nomenclature: 'HAND SANITIZER', spec: '1 × 60ML BOTTLE / ≥70% ETHANOL', cadence: 'MONTHLY' },
  { id: '15', section: 'HYGIENE', nomenclature: 'LAUNDRY SHEETS', spec: '16-UNIT PACK / FRAGRANCE-FREE', cadence: 'MONTHLY' },
  // HEALTH
  { id: '16', section: 'HEALTH', nomenclature: 'VITAMIN D3', spec: '30 × 2000IU SOFTGEL / WITH K2', cadence: 'MONTHLY' },
  { id: '17', section: 'HEALTH', nomenclature: 'MAGNESIUM GLYCINATE', spec: '30 × 200MG CAPSULE / CHELATED', cadence: 'MONTHLY' },
  { id: '18', section: 'HEALTH', nomenclature: 'OMEGA-3 FISH OIL', spec: '30 × 1000MG CAPSULE / MOLECULAR DISTILLED', cadence: 'MONTHLY' },
  { id: '19', section: 'HEALTH', nomenclature: 'ANALGESIC — IBUPROFEN', spec: '24 × 200MG TABLET / FIELD PACK', cadence: 'MONTHLY' },
  { id: '20', section: 'HEALTH', nomenclature: 'BANDAGE ASSORTMENT', spec: '10-UNIT PACK / FABRIC ADHESIVE', cadence: 'MONTHLY' },
  // COGNITIVE
  { id: '21', section: 'COGNITIVE', nomenclature: 'ASHWAGANDHA — KSM-66', spec: '30 × 300MG CAPSULE / STANDARDIZED EXTRACT', cadence: 'MONTHLY' },
  // FIELD TOOLS
  { id: '22', section: 'FIELD TOOLS', nomenclature: 'FIELD NOTEBOOK — A6 RULED', spec: '1 UNIT / 120 PAGES / ACID-FREE', cadence: 'MONTHLY' },
  // MANIFEST
  { id: '23', section: 'MANIFEST', nomenclature: 'ISSUE MANIFEST — PRINTED CARD', spec: '1 CARD / THIS LOAD + NEXT ISSUE DATE', cadence: 'MONTHLY' },
]

// ─── DOCTRINE ─────────────────────────────────────────────────────────────────

const DOCTRINE_LINES = [
  'LOT ISSUES. IT DOES NOT SELL.',
  'THE OPERATOR IS ON STRENGTH. THE RATION SUPPORTS THE MISSION.',
  'PRICE: USD 100.00 / MONTH. MARGIN ≥ 60%. COGS ≤ USD 40.00 LANDED.',
  'THE LEDGER IS THE MARKETING. NO LAYER BETWEEN PUBLIC AND MANIFEST.',
  'EVERY ITEM SELECTED ON FUNCTION. NONE ON BRAND. NONE ON DECORATION.',
  'STAND DOWN AT ANY TIME. RATION STOPS. AI PLAN RETAINED.',
]

// ─── TERMINAL PRIMITIVES ──────────────────────────────────────────────────────

const T: React.CSSProperties = {
  fontFamily: '"Courier New", "Liberation Mono", "IBM Plex Mono", Courier, monospace',
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.04em',
}

const RULE: React.CSSProperties = {
  borderTop: '2px solid #000',
  margin: 0,
}

const SECTION_HEADER: React.CSSProperties = {
  ...T,
  background: '#000',
  color: '#fff',
  padding: '2px 8px',
  display: 'block',
}

const CELL: React.CSSProperties = {
  ...T,
  padding: '2px 8px',
  verticalAlign: 'top',
  border: 'none',
  borderBottom: '1px solid #000',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '220px',
}

const CELL_SPEC: React.CSSProperties = {
  ...CELL,
  opacity: 0.5,
  maxWidth: '260px',
}

const CELL_CADENCE: React.CSSProperties = {
  ...CELL,
  textAlign: 'right',
  maxWidth: 'none',
  width: '90px',
}

// ─── STATUS LINE ──────────────────────────────────────────────────────────────

function StatusLine() {
  const [now, setNow] = React.useState(() => dayjs())
  React.useEffect(() => {
    const t = setInterval(() => setNow(dayjs()), 60_000)
    return () => clearInterval(t)
  }, [])

  const nextIssue = now.date() <= 1
    ? now.date(1)
    : now.add(1, 'month').date(1)

  const daysUntil = nextIssue.startOf('day').diff(now.startOf('day'), 'day')

  return (
    <div style={{ ...T, background: '#000', color: '#fff', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
      <span>LOT® BASIC / OPEN TAB</span>
      <span>STATUS: OPEN — ACCEPTING SUBSCRIBERS</span>
      <span>NEXT ISSUE: {nextIssue.format('01 MMM YYYY').toUpperCase()} (T−{daysUntil}D)</span>
    </div>
  )
}

// ─── MANIFEST TABLE ───────────────────────────────────────────────────────────

function ManifestTable() {
  const sections = React.useMemo(() => {
    const map = new Map<string, RationItem[]>()
    for (const item of RATION_MANIFEST) {
      if (!map.has(item.section)) map.set(item.section, [])
      map.get(item.section)!.push(item)
    }
    return map
  }, [])

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ ...T, width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '32px' }} />
          <col style={{ width: '240px' }} />
          <col />
          <col style={{ width: '96px' }} />
        </colgroup>
        <thead>
          <tr style={{ background: '#000', color: '#fff' }}>
            <th style={{ ...T, padding: '4px 8px', textAlign: 'left', color: '#fff', fontWeight: 700, border: 'none' }}>#</th>
            <th style={{ ...T, padding: '4px 8px', textAlign: 'left', color: '#fff', fontWeight: 700, border: 'none' }}>NOMENCLATURE</th>
            <th style={{ ...T, padding: '4px 8px', textAlign: 'left', color: '#fff', fontWeight: 700, border: 'none' }}>SPECIFICATION</th>
            <th style={{ ...T, padding: '4px 8px', textAlign: 'right', color: '#fff', fontWeight: 700, border: 'none' }}>CADENCE</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(sections.entries()).map(([section, items]) => (
            <React.Fragment key={section}>
              <tr>
                <td colSpan={4} style={{ padding: 0 }}>
                  <span style={SECTION_HEADER}>{section}</span>
                </td>
              </tr>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #000' }}>
                  <td style={{ ...CELL, opacity: 0.4, minWidth: '32px' }}>{item.id}</td>
                  <td style={CELL}>{item.nomenclature}</td>
                  <td style={CELL_SPEC}>{item.spec}</td>
                  <td style={CELL_CADENCE}>{item.cadence}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── DOCTRINE BLOCK ───────────────────────────────────────────────────────────

function DoctrineBlock() {
  return (
    <div style={{ border: '2px solid #000', padding: '8px', borderRadius: 0 }}>
      <div style={{ ...SECTION_HEADER, marginBottom: '8px' }}>DOCTRINE</div>
      {DOCTRINE_LINES.map((line, i) => (
        <div key={i} style={{ ...T, padding: '1px 0', opacity: i === 0 ? 1 : 0.75 }}>
          {line}
        </div>
      ))}
    </div>
  )
}

// ─── PRICE LINE ───────────────────────────────────────────────────────────────

function PriceLine() {
  return (
    <div style={{ border: '2px solid #000', padding: '8px', borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
      <div>
        <div style={{ ...T, fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>ISSUE PRICE</div>
        <div style={{ ...T, fontSize: '20px', lineHeight: '24px', letterSpacing: '0.02em' }}>USD 100.00 / MONTH</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T, fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>ITEMS</div>
        <div style={{ ...T, fontSize: '20px', lineHeight: '24px' }}>23</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ ...T, fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>CADENCE</div>
        <div style={{ ...T, fontSize: '16px', lineHeight: '24px' }}>MONTHLY / 1ST</div>
      </div>
      <div style={{ ...T, fontSize: '10px', opacity: 0.5, textAlign: 'right', alignSelf: 'flex-end' }}>
        UPGRADE: USERSHIP AI → BASIC
        <br />
        AVAILABLE: SOON
      </div>
    </div>
  )
}

// ─── BASICS TAB ───────────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const me = useStore(stores.me)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* STATUS LINE */}
      <StatusLine />

      <div style={{ height: '16px' }} />

      {/* PRICE + IDENTITY */}
      <PriceLine />

      <div style={{ height: '16px' }} />

      {/* MANIFEST LEDGER */}
      <div style={{ border: '2px solid #000', borderRadius: 0 }}>
        <div style={{ ...SECTION_HEADER, fontSize: '13px', padding: '6px 8px' }}>
          LOT BASIC — 23-ITEM RATION MANIFEST / MONTHLY ISSUE
        </div>
        <hr style={RULE} />
        <ManifestTable />
      </div>

      <div style={{ height: '16px' }} />

      {/* DOCTRINE */}
      <DoctrineBlock />

      <div style={{ height: '16px' }} />

      {/* FOOTNOTE */}
      <div style={{ ...T, opacity: 0.4, fontSize: '10px', paddingBottom: '16px' }}>
        LOT-FM-001 / BASIC MODULE / M1 — OPEN TAB. COGS WITHHELD. UPGRADE PATH: MONTH 2.
        {me ? ` OPERATOR: ${(me.firstName || me.email || '').toUpperCase()}` : ''}
      </div>
    </div>
  )
}
