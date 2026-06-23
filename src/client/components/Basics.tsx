/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'

// LOT-FM-001 / BASICS — MONTH 1: OPEN TAB
// Ledger + doctrine surface. Read-only. No upgrade path yet (Month 2).
// House style: LiberationMono-Bold, white/black, inversion hierarchy, 2px rules, square corners.

const FONT = '"Liberation Mono", "Courier New", Courier, monospace'

const RATION: Array<{
  no: string
  nomenclature: string
  unit: string
  cadence: 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL'
}> = [
  { no: '01', nomenclature: 'COFFEE, DARK ROAST',          unit: '250g',   cadence: 'MONTHLY'   },
  { no: '02', nomenclature: 'OATS, STEEL-CUT',             unit: '500g',   cadence: 'MONTHLY'   },
  { no: '03', nomenclature: 'HONEY, RAW',                  unit: '250g',   cadence: 'MONTHLY'   },
  { no: '04', nomenclature: 'OLIVE OIL, EXTRA VIRGIN',     unit: '250ml',  cadence: 'MONTHLY'   },
  { no: '05', nomenclature: 'ALMONDS, RAW',                unit: '150g',   cadence: 'MONTHLY'   },
  { no: '06', nomenclature: 'VITAMIN D3 + K2',             unit: '30ct',   cadence: 'MONTHLY'   },
  { no: '07', nomenclature: 'MAGNESIUM GLYCINATE',         unit: '30ct',   cadence: 'MONTHLY'   },
  { no: '08', nomenclature: 'SOAP, CASTILE BAR',           unit: 'x2',     cadence: 'MONTHLY'   },
  { no: '09', nomenclature: 'TOOTHPASTE, NATURAL',         unit: '100ml',  cadence: 'MONTHLY'   },
  { no: '10', nomenclature: 'DENTAL FLOSS',                unit: '30m',    cadence: 'MONTHLY'   },
  { no: '11', nomenclature: 'DEODORANT, NATURAL',          unit: '65g',    cadence: 'MONTHLY'   },
  { no: '12', nomenclature: 'DISH SOAP, CONCENTRATE',      unit: '100ml',  cadence: 'MONTHLY'   },
  { no: '13', nomenclature: 'LAUNDRY SOAP BAR',            unit: 'x2',     cadence: 'MONTHLY'   },
  { no: '14', nomenclature: 'BEESWAX CANDLE',              unit: '4oz',    cadence: 'MONTHLY'   },
  { no: '15', nomenclature: 'MATCHES, SAFETY',             unit: '1 box',  cadence: 'MONTHLY'   },
  { no: '16', nomenclature: 'BANDAGE STRIP, FABRIC',       unit: '10ct',   cadence: 'MONTHLY'   },
  { no: '17', nomenclature: 'TOOTHBRUSH',                  unit: 'x1',     cadence: 'QUARTERLY' },
  { no: '18', nomenclature: 'SHAMPOO BAR',                 unit: 'x1',     cadence: 'QUARTERLY' },
  { no: '19', nomenclature: 'COTTON CLOTH, 12"x12"',       unit: 'x2',     cadence: 'QUARTERLY' },
  { no: '20', nomenclature: 'NOTEBOOK, FIELD',             unit: 'x1',     cadence: 'QUARTERLY' },
  { no: '21', nomenclature: 'PEN, BALLPOINT',              unit: 'x2',     cadence: 'QUARTERLY' },
  { no: '22', nomenclature: 'COTTON SOCKS, HEAVY',         unit: '2 pr',   cadence: 'QUARTERLY' },
  { no: '23', nomenclature: 'COTTON T-SHIRT, HEAVYWEIGHT', unit: 'x1',     cadence: 'BIANNUAL'  },
]

const DOCTRINE = [
  'Issue, do not sell. The operator is ON STRENGTH.',
  'The ledger is the marketing. No layer between public and manifest.',
  'USD 100/mo. Margin certified ≥60%. COGS ceiling USD 40 landed.',
  'The Memory Engine knows what the operator uses. Supply aligns with profile.',
]

const S: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: FONT,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    color: '#000',
    minHeight: '100%',
    fontSize: '13px',
    lineHeight: '1.6',
    letterSpacing: '0',
  },
  inner: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '0 16px 96px',
  },
  // Inverted block — black ground, white ink
  inverted: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '8px 12px',
    display: 'block',
  },
  invertedSmall: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '4px 8px',
    display: 'inline-block',
    fontSize: '11px',
    letterSpacing: '0.08em',
  },
  rule: {
    borderTop: '2px solid #000',
    margin: '0',
  },
  ruleLight: {
    borderTop: '1px solid #000',
    margin: '0',
    opacity: 0.15,
  },
  section: {
    borderLeft: '2px solid #000',
    borderRight: '2px solid #000',
    borderBottom: '2px solid #000',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '0',
    borderLeft: '2px solid #000',
    borderRight: '2px solid #000',
    borderBottom: '2px solid #000',
  },
  statusCell: {
    padding: '6px 12px',
    borderRight: '2px solid #000',
    flex: '0 0 auto',
    fontSize: '12px',
    letterSpacing: '0.04em',
  },
  statusCellLast: {
    padding: '6px 12px',
    flex: '1',
    fontSize: '12px',
    letterSpacing: '0.04em',
  },
  doctrineParagraph: {
    padding: '4px 12px',
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    display: 'flex',
    gap: '12px',
    alignItems: 'baseline',
  },
  doctrineIndex: {
    color: '#000',
    opacity: 0.35,
    flexShrink: 0,
    minWidth: '20px',
    fontSize: '11px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '28px 1fr 56px 88px',
    gap: '0 12px',
    padding: '5px 12px',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '11px',
    letterSpacing: '0.08em',
    borderBottom: '2px solid #000',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '28px 1fr 56px 88px',
    gap: '0 12px',
    padding: '4px 12px',
    borderBottom: '1px solid rgba(0,0,0,0.10)',
    fontSize: '12px',
  },
  tableRowQuarterly: {
    display: 'grid',
    gridTemplateColumns: '28px 1fr 56px 88px',
    gap: '0 12px',
    padding: '4px 12px',
    borderBottom: '1px solid rgba(0,0,0,0.10)',
    fontSize: '12px',
    opacity: 0.7,
  },
  tableRowBiannual: {
    display: 'grid',
    gridTemplateColumns: '28px 1fr 56px 88px',
    gap: '0 12px',
    padding: '4px 12px',
    borderBottom: '1px solid rgba(0,0,0,0.10)',
    fontSize: '12px',
    opacity: 0.5,
  },
  tableFooter: {
    padding: '6px 12px',
    fontSize: '11px',
    letterSpacing: '0.04em',
    opacity: 0.45,
    borderTop: '2px solid #000',
  },
  colNo: {
    textAlign: 'left' as const,
    opacity: 0.45,
  },
  colNomenclature: {
    textAlign: 'left' as const,
  },
  colUnit: {
    textAlign: 'right' as const,
  },
  colCadence: {
    textAlign: 'right' as const,
  },
  nextBlock: {
    padding: '8px 12px',
    fontSize: '12px',
    letterSpacing: '0.04em',
    opacity: 0.4,
    borderLeft: '2px solid #000',
    borderRight: '2px solid #000',
    borderBottom: '2px solid #000',
  },
}

function cadenceStyle(cadence: string): React.CSSProperties {
  if (cadence === 'QUARTERLY') return S.tableRowQuarterly
  if (cadence === 'BIANNUAL')  return S.tableRowBiannual
  return S.tableRow
}

export const Basics: React.FC = () => {
  const today = React.useMemo(() => {
    const d = new Date()
    return d.toISOString().slice(0, 10)
  }, [])

  return (
    <div style={S.root}>
      <div style={S.inner}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ borderLeft: '2px solid #000', borderRight: '2px solid #000', borderTop: '2px solid #000' }}>
          <span style={{ ...S.inverted, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>LOT® BASICS / FM-001 CIVILIAN RATION</span>
            <span style={{ fontSize: '11px', opacity: 0.6, letterSpacing: '0.06em' }}>OPEN TAB</span>
          </span>
        </div>

        {/* ── STATUS LINE ────────────────────────────────────────── */}
        <div style={S.statusBar}>
          <div style={S.statusCell}>
            STATUS: <span style={{ letterSpacing: '0.06em' }}>OPEN</span>
          </div>
          <div style={S.statusCell}>
            RATE: USD 100.00 / MO
          </div>
          <div style={S.statusCellLast}>
            AS OF: {today}
          </div>
        </div>

        {/* spacer */}
        <div style={{ height: '24px' }} />

        {/* ── DOCTRINE ───────────────────────────────────────────── */}
        <div style={{ border: '2px solid #000' }}>
          <span style={S.inverted}>DOCTRINE / LOT-FM-001</span>
          {DOCTRINE.map((clause, i) => (
            <div key={i} style={S.doctrineParagraph}>
              <span style={S.doctrineIndex}>{String(i + 1).padStart(2, '0')}</span>
              <span>{clause}</span>
            </div>
          ))}
        </div>

        {/* spacer */}
        <div style={{ height: '24px' }} />

        {/* ── ISSUE MANIFEST ─────────────────────────────────────── */}
        <div style={{ border: '2px solid #000' }}>
          <span style={S.inverted}>ISSUE MANIFEST — 23 ITEMS / LOT-FM-001 § 2</span>
          {/* table header */}
          <div style={S.tableHeader}>
            <span style={S.colNo}>#</span>
            <span style={S.colNomenclature}>NOMENCLATURE</span>
            <span style={S.colUnit}>UNIT</span>
            <span style={S.colCadence}>CADENCE</span>
          </div>
          {/* rows */}
          {RATION.map((item) => (
            <div key={item.no} style={cadenceStyle(item.cadence)}>
              <span style={S.colNo}>{item.no}</span>
              <span style={S.colNomenclature}>{item.nomenclature}</span>
              <span style={S.colUnit}>{item.unit}</span>
              <span style={S.colCadence}>{item.cadence}</span>
            </div>
          ))}
          {/* footer */}
          <div style={S.tableFooter}>
            COGS WITHHELD. MARGIN CERTIFIED ≥60%. LANDED CEILING USD 40. NOT A STORE — A RATION.
          </div>
        </div>

        {/* spacer */}
        <div style={{ height: '24px' }} />

        {/* ── CADENCE KEY ────────────────────────────────────────── */}
        <div style={{ border: '2px solid #000' }}>
          <span style={{ ...S.inverted, fontSize: '11px', letterSpacing: '0.08em' }}>CADENCE KEY</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid rgba(0,0,0,0.12)' }}>
            <div style={{ padding: '6px 12px', borderRight: '1px solid rgba(0,0,0,0.15)', fontSize: '12px' }}>
              <div style={{ letterSpacing: '0.04em' }}>MONTHLY</div>
              <div style={{ opacity: 0.45, fontSize: '11px' }}>Every issue</div>
            </div>
            <div style={{ padding: '6px 12px', borderRight: '1px solid rgba(0,0,0,0.15)', fontSize: '12px', opacity: 0.7 }}>
              <div style={{ letterSpacing: '0.04em' }}>QUARTERLY</div>
              <div style={{ opacity: 0.45, fontSize: '11px' }}>Every 3rd issue</div>
            </div>
            <div style={{ padding: '6px 12px', fontSize: '12px', opacity: 0.5 }}>
              <div style={{ letterSpacing: '0.04em' }}>BIANNUAL</div>
              <div style={{ opacity: 0.45, fontSize: '11px' }}>Every 6th issue</div>
            </div>
          </div>
        </div>

        {/* spacer */}
        <div style={{ height: '24px' }} />

        {/* ── UPGRADE PLACEHOLDER (Month 2) ──────────────────────── */}
        <div style={{ ...S.nextBlock, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>UPGRADE PATH: USERSHIP / AI → ON STRENGTH</span>
          <span style={{ letterSpacing: '0.06em' }}>M2 — PENDING</span>
        </div>

      </div>
    </div>
  )
}
