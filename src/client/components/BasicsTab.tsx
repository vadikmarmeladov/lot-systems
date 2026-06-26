/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'

// ─── RATION MANIFEST ────────────────────────────────────────────────────────
// 23-item standard load. Cadence shown. COGS withheld.
// LOT-FM-001 / BASIC — civilian ration subscription, USD 100/30 days.

type RationItem = {
  index: string
  nomenclature: string
  cadence: 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL'
  category: 'NUTRITION' | 'SUPPLEMENT' | 'HYGIENE' | 'FIELD' | 'DOC'
}

const MANIFEST: RationItem[] = [
  // NUTRITION
  { index: '001', nomenclature: 'GRAIN RATION — ROLLED OATS, 1KG', cadence: 'MONTHLY', category: 'NUTRITION' },
  { index: '002', nomenclature: 'LEGUME RATION — RED LENTILS, 500G', cadence: 'MONTHLY', category: 'NUTRITION' },
  { index: '003', nomenclature: 'FAT RATION — GHEE, CLARIFIED BUTTER, 250G', cadence: 'MONTHLY', category: 'NUTRITION' },
  { index: '004', nomenclature: 'PROTEIN BAR, FIELD GRADE, 8X', cadence: 'MONTHLY', category: 'NUTRITION' },
  { index: '005', nomenclature: 'ELECTROLYTE SACHET, 30-DAY SUPPLY', cadence: 'MONTHLY', category: 'NUTRITION' },
  { index: '006', nomenclature: 'GREEN TEA, STANDARD ISSUE, 30X', cadence: 'MONTHLY', category: 'NUTRITION' },
  { index: '007', nomenclature: 'SPICE KIT — CUMIN / TURMERIC / SEA SALT', cadence: 'MONTHLY', category: 'NUTRITION' },
  // SUPPLEMENT
  { index: '008', nomenclature: 'MULTIVITAMIN, 30-DAY SUPPLY', cadence: 'MONTHLY', category: 'SUPPLEMENT' },
  { index: '009', nomenclature: 'VITAMIN D3 2000IU, 30-DAY SUPPLY', cadence: 'MONTHLY', category: 'SUPPLEMENT' },
  { index: '010', nomenclature: 'OMEGA-3 EPA/DHA, 30-DAY SUPPLY', cadence: 'MONTHLY', category: 'SUPPLEMENT' },
  { index: '011', nomenclature: 'MAGNESIUM GLYCINATE 400MG, 30-DAY SUPPLY', cadence: 'MONTHLY', category: 'SUPPLEMENT' },
  { index: '012', nomenclature: 'ZINC 15MG, 30-DAY SUPPLY', cadence: 'MONTHLY', category: 'SUPPLEMENT' },
  { index: '013', nomenclature: 'PROBIOTIC SACHET, 30-DAY SUPPLY', cadence: 'MONTHLY', category: 'SUPPLEMENT' },
  // HYGIENE
  { index: '014', nomenclature: 'SOAP BAR, UNSCENTED, 2X', cadence: 'MONTHLY', category: 'HYGIENE' },
  { index: '015', nomenclature: 'DENTAL TABS, FLUORIDE-FREE, 62X', cadence: 'MONTHLY', category: 'HYGIENE' },
  { index: '016', nomenclature: 'FLOSS PICKS, 30X', cadence: 'MONTHLY', category: 'HYGIENE' },
  { index: '017', nomenclature: 'RAZOR BLADES, STANDARD, 5X', cadence: 'MONTHLY', category: 'HYGIENE' },
  // FIELD
  { index: '018', nomenclature: 'FIELD NOTEBOOK, A6, 64 PAGES', cadence: 'MONTHLY', category: 'FIELD' },
  { index: '019', nomenclature: 'PENCIL, STANDARD ISSUE HB, 2X', cadence: 'MONTHLY', category: 'FIELD' },
  { index: '020', nomenclature: 'FIRST AID STRIP, ASSORTED, 10X', cadence: 'MONTHLY', category: 'FIELD' },
  { index: '021', nomenclature: 'SLEEP MASK, BLACKOUT', cadence: 'QUARTERLY', category: 'FIELD' },
  // DOC
  { index: '022', nomenclature: 'MANIFEST CARD, PRINTED, ISSUE-DATED', cadence: 'MONTHLY', category: 'DOC' },
  { index: '023', nomenclature: 'RETURN FORM', cadence: 'MONTHLY', category: 'DOC' },
]

const CATEGORY_LABELS: Record<RationItem['category'], string> = {
  NUTRITION:  'NUTRITION',
  SUPPLEMENT: 'SUPPLEMENT',
  HYGIENE:    'HYGIENE',
  FIELD:      'FIELD EQUIPMENT',
  DOC:        'DOCUMENTATION',
}

// ─── STYLE TOKENS ────────────────────────────────────────────────────────────
// White ground / black ink. Inversion for hierarchy. 2px rules. No radius.
// LiberationMono-Bold → falls to Menlo / Courier / monospace on non-Linux.

const FONT = '"Liberation Mono", "Menlo", "Courier New", monospace'

const S = {
  root: {
    fontFamily: FONT,
    fontSize: '12px',
    lineHeight: '18px',
    letterSpacing: '0.04em',
    color: '#050505',
    background: '#ffffff',
    maxWidth: '780px',
    padding: '0 0 80px 0',
  } as React.CSSProperties,

  rule: {
    borderBottom: '2px solid #050505',
    margin: '0',
    height: '0',
  } as React.CSSProperties,

  ruleThin: {
    borderBottom: '1px solid #c0c0c0',
    margin: '0',
    height: '0',
  } as React.CSSProperties,

  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#050505',
    color: '#ffffff',
    padding: '6px 12px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    fontSize: '11px',
  } as React.CSSProperties,

  subHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 12px',
    background: '#f0f0f0',
    fontWeight: 700,
    letterSpacing: '0.06em',
    fontSize: '11px',
    borderBottom: '1px solid #c0c0c0',
  } as React.CSSProperties,

  infoRow: {
    display: 'flex',
    padding: '4px 12px',
    gap: '24px',
  } as React.CSSProperties,

  doctrineBlock: {
    padding: '8px 12px',
    borderLeft: '2px solid #050505',
    marginLeft: '12px',
    marginRight: '12px',
    marginTop: '6px',
    marginBottom: '6px',
  } as React.CSSProperties,

  doctrineClause: {
    margin: '0',
    padding: '0',
    lineHeight: '20px',
  } as React.CSSProperties,

  manifestRow: {
    display: 'grid',
    gridTemplateColumns: '32px 1fr 90px',
    padding: '3px 12px',
    alignItems: 'center',
    borderBottom: '1px solid #e8e8e8',
  } as React.CSSProperties,

  manifestRowCategory: {
    display: 'grid',
    gridTemplateColumns: '32px 1fr 90px',
    padding: '2px 12px',
    alignItems: 'center',
    background: '#f8f8f8',
    borderBottom: '1px solid #c0c0c0',
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.10em',
    color: '#555555',
  } as React.CSSProperties,

  indexCell: {
    color: '#aaaaaa',
    fontWeight: 400,
    flexShrink: 0,
  } as React.CSSProperties,

  cadenceCell: {
    textAlign: 'right' as const,
    color: '#555555',
    fontSize: '10px',
    letterSpacing: '0.06em',
  } as React.CSSProperties,

  cadenceCellQuarterly: {
    textAlign: 'right' as const,
    color: '#888888',
    fontSize: '10px',
    letterSpacing: '0.06em',
    fontStyle: 'italic',
  } as React.CSSProperties,

  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    background: '#050505',
    color: '#ffffff',
    letterSpacing: '0.06em',
    fontSize: '11px',
    marginTop: '2px',
  } as React.CSSProperties,

  statusDot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '0',
    background: '#ffffff',
    marginRight: '6px',
    verticalAlign: 'middle',
  } as React.CSSProperties,

  cogsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: '4px 12px',
    fontSize: '11px',
    letterSpacing: '0.06em',
  } as React.CSSProperties,

  sectionLabel: {
    padding: '10px 12px 2px 12px',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: '#888888',
    fontWeight: 700,
  } as React.CSSProperties,
}

// ─── SUBCOMPONENTS ───────────────────────────────────────────────────────────

function Rule({ thin }: { thin?: boolean }) {
  return <div style={thin ? S.ruleThin : S.rule} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={S.sectionLabel}>{children}</div>
}

function ManifestSection({
  category,
  items,
}: {
  category: RationItem['category']
  items: RationItem[]
}) {
  return (
    <>
      <div style={S.manifestRowCategory}>
        <span />
        <span>{CATEGORY_LABELS[category]}</span>
        <span />
      </div>
      {items.map((item) => (
        <div key={item.index} style={S.manifestRow}>
          <span style={S.indexCell}>{item.index}</span>
          <span>{item.nomenclature}</span>
          <span style={item.cadence === 'MONTHLY' ? S.cadenceCell : S.cadenceCellQuarterly}>
            {item.cadence}
          </span>
        </div>
      ))}
    </>
  )
}

function StatusLine() {
  return (
    <div style={S.statusBar}>
      <span>
        <span style={S.statusDot} />
        OPEN TAB — ACCEPTING ENROLLMENT
      </span>
      <span>USERSHIP REQUIRED</span>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function BasicsTab() {
  const categories = React.useMemo<RationItem['category'][]>(
    () => ['NUTRITION', 'SUPPLEMENT', 'HYGIENE', 'FIELD', 'DOC'],
    []
  )

  return (
    <div style={S.root}>
      {/* ── HEADER ── */}
      <div style={S.headerRow}>
        <span>LOT SYSTEMS / BASIC PLAN</span>
        <span>OPEN TAB</span>
      </div>

      {/* ── ISSUE TERMS ── */}
      <div style={S.infoRow}>
        <span><strong>ISSUE:</strong>&nbsp;&nbsp;USD 100 / 30 DAYS</span>
        <span><strong>CADENCE:</strong>&nbsp;&nbsp;MONTHLY</span>
        <span><strong>STATUS:</strong>&nbsp;&nbsp;ENROLLING</span>
      </div>

      <Rule />

      {/* ── DOCTRINE ── */}
      <SectionLabel>DOCTRINE</SectionLabel>
      <div style={S.doctrineBlock}>
        <p style={S.doctrineClause}>LOT issues. It does not sell.</p>
        <p style={S.doctrineClause}>The subscriber is ON STRENGTH.</p>
        <p style={S.doctrineClause}>USD 100 per 30-day period. No contracts. Cancel to STAND DOWN.</p>
        <p style={S.doctrineClause}>COGS ceiling: USD 40 landed. Margin floor: 60%. The ledger is the marketing.</p>
        <p style={S.doctrineClause}>No layer exists between this manifest and the public.</p>
      </div>

      <Rule />

      {/* ── MANIFEST HEADER ── */}
      <div style={S.subHeaderRow}>
        <span style={{ flex: 1 }}>RATION MANIFEST — 23 ITEMS</span>
        <span style={{ textAlign: 'right', fontSize: '10px', color: '#888888' }}>CADENCE</span>
      </div>

      {/* ── MANIFEST ROWS ── */}
      {categories.map((cat) => (
        <ManifestSection
          key={cat}
          category={cat}
          items={MANIFEST.filter((i) => i.category === cat)}
        />
      ))}

      <Rule />

      {/* ── COGS ROW ── */}
      <div style={S.cogsRow}>
        <span><strong>COGS</strong>&nbsp;&nbsp;WITHHELD</span>
        <span><strong>MARGIN</strong>&nbsp;&nbsp;≥ 60%</span>
        <span><strong>CEILING</strong>&nbsp;&nbsp;≤ USD 40 LANDED</span>
      </div>

      <Rule />

      {/* ── STATUS LINE ── */}
      <SectionLabel>STATUS</SectionLabel>
      <StatusLine />

      {/* ── UPGRADE PLACEHOLDER (Month 2) ── */}
      <div
        style={{
          padding: '8px 12px',
          fontSize: '11px',
          color: '#aaaaaa',
          letterSpacing: '0.06em',
          marginTop: '4px',
        }}
      >
        UPGRADE PATH: USERSHIP (AI) → BASIC (RATION) — AVAILABLE IN NEXT ISSUE
      </div>
    </div>
  )
}
