/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * BASICS MODULE — FM-001
 * Month 1 of 3: OPEN TAB — Ledger & Doctrine
 * Status: READ-ONLY. Public surface.
 */

import * as React from 'react'

// ─── TERMINAL TOKENS ────────────────────────────────────────────────────────
const T = {
  bg: '#ffffff',
  ink: '#000000',
  rule: '2px solid #000000',
  font: "'Courier New', 'Liberation Mono', 'IBM Plex Mono', monospace",
  weight: '700',
  size: '13px',
  lineHeight: '1.6',
  letterSpacing: '0.02em',
} as const

const s: Record<string, React.CSSProperties> = {
  root: {
    background: T.bg,
    color: T.ink,
    fontFamily: T.font,
    fontWeight: T.weight,
    fontSize: T.size,
    lineHeight: T.lineHeight,
    letterSpacing: T.letterSpacing,
    minHeight: '100dvh',
    padding: '32px 24px',
    boxSizing: 'border-box',
  },
  wrap: {
    maxWidth: '720px',
    margin: '0 auto',
  },
  // Inverted header block — inversion-only hierarchy
  headerBlock: {
    background: T.ink,
    color: T.bg,
    padding: '12px 16px',
    marginBottom: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '16px',
  },
  headerTitle: {
    fontFamily: T.font,
    fontWeight: T.weight,
    fontSize: '14px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    margin: 0,
  },
  headerSub: {
    fontFamily: T.font,
    fontSize: T.size,
    opacity: 0.7,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  border: {
    borderTop: T.rule,
    borderLeft: T.rule,
    borderRight: T.rule,
    borderBottom: T.rule,
  },
  rule: {
    border: 'none',
    borderTop: T.rule,
    margin: '0',
  },
  section: {
    borderLeft: T.rule,
    borderRight: T.rule,
    padding: '16px 16px',
  },
  sectionLabel: {
    fontFamily: T.font,
    fontWeight: T.weight,
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    opacity: 0.45,
    marginBottom: '8px',
    display: 'block',
  },
  doctrineText: {
    margin: 0,
    paddingLeft: '0',
  },
  doctrineLine: {
    display: 'block',
    lineHeight: '1.9',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  priceLine: {
    fontFamily: T.font,
    fontWeight: T.weight,
    fontSize: '22px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  },
  priceNote: {
    fontFamily: T.font,
    fontSize: T.size,
    opacity: 0.5,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    marginLeft: '10px',
  },
  // Ledger table
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontFamily: T.font,
    fontWeight: T.weight,
    fontSize: T.size,
    letterSpacing: '0.02em',
  },
  th: {
    textAlign: 'left' as const,
    fontFamily: T.font,
    fontWeight: T.weight,
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    opacity: 0.45,
    padding: '4px 8px 8px 0',
    borderBottom: '1px solid rgba(0,0,0,0.25)',
    whiteSpace: 'nowrap' as const,
  },
  thRight: {
    textAlign: 'right' as const,
    fontFamily: T.font,
    fontWeight: T.weight,
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    opacity: 0.45,
    padding: '4px 0 8px 8px',
    borderBottom: '1px solid rgba(0,0,0,0.25)',
    whiteSpace: 'nowrap' as const,
  },
  td: {
    padding: '5px 8px 5px 0',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    verticalAlign: 'top' as const,
    textTransform: 'uppercase' as const,
  },
  tdRight: {
    padding: '5px 0 5px 8px',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    verticalAlign: 'top' as const,
    textAlign: 'right' as const,
    textTransform: 'uppercase' as const,
  },
  tdLine: {
    padding: '5px 8px 5px 0',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    verticalAlign: 'top' as const,
    opacity: 0.4,
    fontVariantNumeric: 'tabular-nums',
  },
  // Cadence badges
  cadenceMonthly: {
    display: 'inline-block',
    fontSize: '9px',
    letterSpacing: '0.12em',
    padding: '1px 5px',
    border: '1px solid #000',
    textTransform: 'uppercase' as const,
  },
  cadenceBimonthly: {
    display: 'inline-block',
    fontSize: '9px',
    letterSpacing: '0.12em',
    padding: '1px 5px',
    border: '1px solid #000',
    opacity: 0.6,
    textTransform: 'uppercase' as const,
  },
  cadenceQuarterly: {
    display: 'inline-block',
    fontSize: '9px',
    letterSpacing: '0.12em',
    padding: '1px 5px',
    border: '1px solid rgba(0,0,0,0.35)',
    opacity: 0.45,
    textTransform: 'uppercase' as const,
  },
  // Status line — inverted
  statusBlock: {
    background: T.ink,
    color: T.bg,
    borderLeft: T.rule,
    borderRight: T.rule,
    borderBottom: T.rule,
    padding: '12px 16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '8px 24px',
  },
  statusField: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  statusKey: {
    fontSize: '9px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    opacity: 0.5,
    fontFamily: T.font,
  },
  statusVal: {
    fontSize: T.size,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    fontFamily: T.font,
    fontWeight: T.weight,
  },
  footer: {
    borderLeft: T.rule,
    borderRight: T.rule,
    borderBottom: T.rule,
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    opacity: 0.35,
    fontSize: '9px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
}

// ─── FM-001 MANIFEST — 23 ITEMS ─────────────────────────────────────────────

type Cadence = 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY'
type Category = 'PERSONAL CARE' | 'APPAREL' | 'HOUSEHOLD' | 'PROVISIONS'

type ManifestItem = {
  line: string
  nomenclature: string
  cadence: Cadence
  qty: string
  unit: string
  category: Category
}

const MANIFEST: ManifestItem[] = [
  // PERSONAL CARE
  { line: '001', nomenclature: 'TOOTHBRUSH, SOFT BRISTLE', cadence: 'MONTHLY', qty: '1', unit: 'EA', category: 'PERSONAL CARE' },
  { line: '002', nomenclature: 'TOOTHPASTE, FLUORIDE 4OZ', cadence: 'MONTHLY', qty: '1', unit: 'EA', category: 'PERSONAL CARE' },
  { line: '003', nomenclature: 'DENTAL FLOSS, 50M', cadence: 'MONTHLY', qty: '1', unit: 'ROLL', category: 'PERSONAL CARE' },
  { line: '004', nomenclature: 'BAR SOAP, UNSCENTED (2-PK)', cadence: 'MONTHLY', qty: '1', unit: 'PK', category: 'PERSONAL CARE' },
  { line: '005', nomenclature: 'DEODORANT, UNSCENTED STICK', cadence: 'MONTHLY', qty: '1', unit: 'EA', category: 'PERSONAL CARE' },
  { line: '006', nomenclature: 'SHAMPOO, UNSCENTED 8OZ', cadence: 'MONTHLY', qty: '1', unit: 'EA', category: 'PERSONAL CARE' },
  { line: '007', nomenclature: 'RAZOR, CARTRIDGE (4-PK)', cadence: 'MONTHLY', qty: '1', unit: 'PK', category: 'PERSONAL CARE' },
  { line: '008', nomenclature: 'LIP BALM, SPF 15', cadence: 'MONTHLY', qty: '1', unit: 'EA', category: 'PERSONAL CARE' },
  // APPAREL
  { line: '009', nomenclature: 'UNDERWEAR, COTTON (3-PK)', cadence: 'QUARTERLY', qty: '1', unit: 'PK', category: 'APPAREL' },
  { line: '010', nomenclature: 'SOCKS, CREW (3-PAIR)', cadence: 'QUARTERLY', qty: '1', unit: 'PK', category: 'APPAREL' },
  { line: '011', nomenclature: 'T-SHIRT, HEAVYWEIGHT COTTON', cadence: 'QUARTERLY', qty: '1', unit: 'EA', category: 'APPAREL' },
  { line: '012', nomenclature: 'LAUNDRY PODS (20-CT)', cadence: 'MONTHLY', qty: '1', unit: 'PK', category: 'APPAREL' },
  // HOUSEHOLD
  { line: '013', nomenclature: 'PAPER TOWELS (2-ROLL)', cadence: 'MONTHLY', qty: '1', unit: 'PK', category: 'HOUSEHOLD' },
  { line: '014', nomenclature: 'TOILET PAPER (6-ROLL)', cadence: 'MONTHLY', qty: '1', unit: 'PK', category: 'HOUSEHOLD' },
  { line: '015', nomenclature: 'DISH SOAP, CONCENTRATE 16OZ', cadence: 'BIMONTHLY', qty: '1', unit: 'EA', category: 'HOUSEHOLD' },
  { line: '016', nomenclature: 'MULTI-SURFACE CLEANER 32OZ', cadence: 'BIMONTHLY', qty: '1', unit: 'EA', category: 'HOUSEHOLD' },
  { line: '017', nomenclature: 'TRASH BAGS, 13-GAL (20-CT)', cadence: 'MONTHLY', qty: '1', unit: 'PK', category: 'HOUSEHOLD' },
  // PROVISIONS
  { line: '018', nomenclature: 'OATMEAL, ROLLED 500G', cadence: 'MONTHLY', qty: '1', unit: 'BAG', category: 'PROVISIONS' },
  { line: '019', nomenclature: 'COFFEE, GROUND 250G', cadence: 'MONTHLY', qty: '1', unit: 'BAG', category: 'PROVISIONS' },
  { line: '020', nomenclature: 'PROTEIN BAR (4-PK)', cadence: 'MONTHLY', qty: '2', unit: 'PK', category: 'PROVISIONS' },
  { line: '021', nomenclature: 'ELECTROLYTE PACKETS (10-CT)', cadence: 'MONTHLY', qty: '1', unit: 'PK', category: 'PROVISIONS' },
  { line: '022', nomenclature: 'VITAMINS, DAILY MULTI (30-CT)', cadence: 'MONTHLY', qty: '1', unit: 'BTL', category: 'PROVISIONS' },
  { line: '023', nomenclature: 'NAIL CLIPPERS, STAINLESS STEEL', cadence: 'QUARTERLY', qty: '1', unit: 'EA', category: 'PERSONAL CARE' },
]

// ─── SUBCOMPONENTS ──────────────────────────────────────────────────────────

function CadenceBadge({ cadence }: { cadence: Cadence }) {
  const style =
    cadence === 'MONTHLY'
      ? s.cadenceMonthly
      : cadence === 'BIMONTHLY'
      ? s.cadenceBimonthly
      : s.cadenceQuarterly
  return <span style={style}>{cadence}</span>
}

function StatusField({ label, value }: { label: string; value: string }) {
  return (
    <div style={s.statusField}>
      <span style={s.statusKey}>{label}</span>
      <span style={s.statusVal}>{value}</span>
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function Basics() {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '.')

  return (
    <div style={s.root}>
      <div style={s.wrap}>

        {/* HEADER — inverted */}
        <div style={s.headerBlock}>
          <h1 style={s.headerTitle}>LOT® Ration System — FM-001 / Basics</h1>
          <span style={s.headerSub}>Open Tab</span>
        </div>

        <hr style={s.rule} />

        {/* DOCTRINE */}
        <div style={s.section}>
          <span style={s.sectionLabel}>Doctrine</span>
          <p style={s.doctrineText}>
            <span style={s.doctrineLine}>Issue, not sell. The operator is on strength.</span>
            <span style={s.doctrineLine}>No intermediary. No upsell. No margin obscured.</span>
            <span style={s.doctrineLine}>The ledger is the marketing. No layer between public and manifest.</span>
          </p>
        </div>

        <hr style={s.rule} />

        {/* PRICE LINE */}
        <div style={s.section}>
          <span style={s.sectionLabel}>Rate</span>
          <div>
            <span style={s.priceLine}>USD 100.00 / Month</span>
            <span style={s.priceNote}>≥ 60% margin · ≤ USD 40 landed</span>
          </div>
        </div>

        <hr style={s.rule} />

        {/* MANIFEST LEDGER */}
        <div style={s.section}>
          <span style={s.sectionLabel}>Manifest — 23 Items / Cycle</span>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: '36px' }}>Line</th>
                <th style={s.th}>Nomenclature</th>
                <th style={{ ...s.th, width: '100px' }}>Cadence</th>
                <th style={{ ...s.thRight, width: '32px' }}>Qty</th>
                <th style={{ ...s.thRight, width: '40px' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {MANIFEST.map((item, i) => {
                const prevCategory = i > 0 ? MANIFEST[i - 1].category : null
                const showCategoryRow = item.category !== prevCategory
                return (
                  <React.Fragment key={item.line}>
                    {showCategoryRow && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            ...s.td,
                            paddingTop: i === 0 ? '8px' : '16px',
                            paddingBottom: '4px',
                            fontSize: '9px',
                            letterSpacing: '0.16em',
                            opacity: 0.35,
                            borderBottom: 'none',
                          }}
                        >
                          — {item.category}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td style={s.tdLine}>{item.line}</td>
                      <td style={s.td}>{item.nomenclature}</td>
                      <td style={s.td}>
                        <CadenceBadge cadence={item.cadence} />
                      </td>
                      <td style={s.tdRight}>{item.qty}</td>
                      <td style={s.tdRight}>{item.unit}</td>
                    </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <hr style={s.rule} />

        {/* STATUS LINE — inverted */}
        <div style={s.statusBlock}>
          <StatusField label="Tab" value="Open" />
          <StatusField label="Upgrade" value="Not Active" />
          <StatusField label="Next Issue" value="—" />
          <StatusField label="Billing" value="Inactive" />
          <StatusField label="Module" value="FM-001 / M1" />
          <StatusField label="Build" value="Month 1 of 3" />
        </div>

        {/* FOOTER */}
        <div style={s.footer}>
          <span>LOT Systems Corp · lot-systems.com</span>
          <span>{dateStr}</span>
        </div>

      </div>
    </div>
  )
}
