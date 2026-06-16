/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * LOT-FM-001 / BASIC (RATION) — MONTH 1: LEDGER & DOCTRINE
 * OPEN TAB public surface. 23-item manifest. Read-only. Live.
 *
 * Terminal tokens:
 *   --lot-basic-bg:     #ffffff
 *   --lot-basic-ink:    #000000
 *   --lot-basic-rule:   2px solid #000000
 *   --lot-basic-font:   'Liberation Mono', 'Courier New', Courier, monospace
 *   --lot-basic-weight: 700
 *   --lot-basic-col-w:  1ch  (character-grid unit)
 */

import * as React from 'react'

// ─── TERMINAL TOKENS ──────────────────────────────────────────────────────────

const LOT_BASIC_BG = '#ffffff'
const LOT_BASIC_INK = '#000000'
const LOT_BASIC_RULE = `2px solid ${LOT_BASIC_INK}`
const LOT_BASIC_FONT =
  "'Liberation Mono', 'Courier New', Courier, monospace"

const T: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: LOT_BASIC_FONT,
    fontWeight: 700,
    background: LOT_BASIC_BG,
    color: LOT_BASIC_INK,
    fontSize: '13px',
    lineHeight: '1.5',
    letterSpacing: '0',
    WebkitFontSmoothing: 'none',
    MozOsxFontSmoothing: 'unset',
  },
  invert: {
    background: LOT_BASIC_INK,
    color: LOT_BASIC_BG,
    padding: '6px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  invertLg: {
    background: LOT_BASIC_INK,
    color: LOT_BASIC_BG,
    padding: '10px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    fontSize: '15px',
  },
  rule: {
    borderBottom: LOT_BASIC_RULE,
    margin: '0',
  },
  ruleLight: {
    borderBottom: `1px solid ${LOT_BASIC_INK}`,
    opacity: 0.2,
    margin: '0',
  },
  section: {
    padding: '10px 12px 6px',
  },
  sectionLabel: {
    opacity: 0.5,
    fontSize: '11px',
    letterSpacing: '0.1em',
    marginBottom: '6px',
    display: 'block',
  },
  body: {
    padding: '0 12px 10px',
    lineHeight: '1.7',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '4ch 1fr 12ch',
    gap: '0 16px',
    padding: '4px 12px',
    alignItems: 'baseline',
  },
  tableRowHdr: {
    display: 'grid',
    gridTemplateColumns: '4ch 1fr 12ch',
    gap: '0 16px',
    padding: '6px 12px',
    alignItems: 'baseline',
    background: LOT_BASIC_INK,
    color: LOT_BASIC_BG,
    fontSize: '11px',
    letterSpacing: '0.1em',
  },
  cadenceMonthly: {
    color: LOT_BASIC_INK,
  },
  cadenceDim: {
    opacity: 0.55,
  },
  status: {
    display: 'flex',
    gap: '0 24px',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    padding: '8px 12px',
    background: LOT_BASIC_INK,
    color: LOT_BASIC_BG,
    fontSize: '11px',
    letterSpacing: '0.12em',
  },
  statusDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    background: LOT_BASIC_BG,
    marginRight: '6px',
    flexShrink: 0,
  },
  price: {
    padding: '14px 12px 12px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  priceFig: {
    fontSize: '28px',
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },
  priceSub: {
    fontSize: '12px',
    opacity: 0.6,
  },
  upgradeBar: {
    padding: '10px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: LOT_BASIC_RULE,
  },
  upgradeNote: {
    fontSize: '11px',
    opacity: 0.45,
    letterSpacing: '0.08em',
  },
}

// ─── MANIFEST ─────────────────────────────────────────────────────────────────

type Cadence = 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY'

interface RationItem {
  no: string
  nomenclature: string
  cadence: Cadence
}

const MANIFEST: RationItem[] = [
  { no: '001', nomenclature: 'WHOLE BEAN COFFEE',        cadence: 'MONTHLY'   },
  { no: '002', nomenclature: 'ROLLED OATS',              cadence: 'MONTHLY'   },
  { no: '003', nomenclature: 'RAW HONEY',                cadence: 'BIMONTHLY' },
  { no: '004', nomenclature: 'EXTRA VIRGIN OLIVE OIL',   cadence: 'MONTHLY'   },
  { no: '005', nomenclature: 'SEA SALT',                 cadence: 'QUARTERLY' },
  { no: '006', nomenclature: 'ALMONDS RAW UNSALTED',     cadence: 'MONTHLY'   },
  { no: '007', nomenclature: 'GREEN TEA LOOSE LEAF',     cadence: 'MONTHLY'   },
  { no: '008', nomenclature: 'DARK CHOCOLATE 90%',       cadence: 'MONTHLY'   },
  { no: '009', nomenclature: 'WHEY PROTEIN CONCENTRATE', cadence: 'MONTHLY'   },
  { no: '010', nomenclature: 'VITAMIN D3 + K2',          cadence: 'MONTHLY'   },
  { no: '011', nomenclature: 'MAGNESIUM GLYCINATE',      cadence: 'MONTHLY'   },
  { no: '012', nomenclature: 'OMEGA-3 FISH OIL',         cadence: 'MONTHLY'   },
  { no: '013', nomenclature: 'MULTIVITAMIN',             cadence: 'MONTHLY'   },
  { no: '014', nomenclature: 'RED LENTILS',              cadence: 'MONTHLY'   },
  { no: '015', nomenclature: 'QUINOA WHITE',             cadence: 'BIMONTHLY' },
  { no: '016', nomenclature: 'REFINED COCONUT OIL',      cadence: 'BIMONTHLY' },
  { no: '017', nomenclature: 'BLACK PEPPER WHOLE',       cadence: 'QUARTERLY' },
  { no: '018', nomenclature: 'APPLE CIDER VINEGAR',      cadence: 'QUARTERLY' },
  { no: '019', nomenclature: 'LAUNDRY DETERGENT STRIPS', cadence: 'MONTHLY'   },
  { no: '020', nomenclature: 'DISH SOAP CONCENTRATE',    cadence: 'BIMONTHLY' },
  { no: '021', nomenclature: 'MINERAL TOOTHPASTE',       cadence: 'MONTHLY'   },
  { no: '022', nomenclature: 'CASTILE BAR SOAP',         cadence: 'MONTHLY'   },
  { no: '023', nomenclature: 'BEESWAX LIP BALM',         cadence: 'QUARTERLY' },
]

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

const Rule: React.FC = () => <div style={T.rule} />

const StatusLine: React.FC = () => {
  const ts = React.useMemo(() => {
    const d = new Date()
    return (
      d.getFullYear() +
      '.' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '.' +
      String(d.getDate()).padStart(2, '0')
    )
  }, [])

  return (
    <div style={T.status}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <span style={T.statusDot} />
        OPEN TAB
      </span>
      <span>USD 100 / MONTH</span>
      <span>NOT SUBSCRIBED</span>
      <span style={{ marginLeft: 'auto', opacity: 0.55 }}>{ts}</span>
    </div>
  )
}

const ManifestTable: React.FC = () => (
  <div>
    <div style={T.tableRowHdr}>
      <span>NO.</span>
      <span>NOMENCLATURE</span>
      <span>CADENCE</span>
    </div>
    {MANIFEST.map((item, i) => (
      <div key={item.no}>
        <div style={T.tableRow}>
          <span style={{ opacity: 0.45 }}>{item.no}</span>
          <span>{item.nomenclature}</span>
          <span
            style={
              item.cadence === 'MONTHLY' ? T.cadenceMonthly : T.cadenceDim
            }
          >
            {item.cadence}
          </span>
        </div>
        {i < MANIFEST.length - 1 && <div style={T.ruleLight} />}
      </div>
    ))}
  </div>
)

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export const Basics: React.FC = () => (
  <div style={T.root}>
    {/* ── HEADER ── */}
    <div style={T.invertLg}>
      <span>LOT® BASIC RATION</span>
      <span style={{ fontSize: '11px', letterSpacing: '0.15em', opacity: 0.8 }}>
        OPEN TAB
      </span>
    </div>

    {/* ── PRICE LINE ── */}
    <div style={T.price}>
      <span style={T.priceFig}>USD 100.00</span>
      <span style={T.priceSub}>/ MONTH</span>
    </div>
    <Rule />

    {/* ── DOCTRINE ── */}
    <div style={T.section}>
      <span style={T.sectionLabel}>DOCTRINE / LOT-FM-001</span>
    </div>
    <div style={T.body}>
      LOT issues. Not sells. You are ON STRENGTH or you are not.
      <br />
      The ledger is the marketing. No layer between public and manifest.
      <br />
      &ge;60% margin. &le;USD&nbsp;40 landed. One box. Thirty days.
    </div>
    <Rule />

    {/* ── MANIFEST ── */}
    <div style={T.section}>
      <span style={T.sectionLabel}>
        MANIFEST — 23&nbsp;ITEMS / LOT-FM-001 §2
      </span>
    </div>
    <ManifestTable />
    <Rule />

    {/* ── UPGRADE PLACEHOLDER (Month 2) ── */}
    <div style={T.upgradeBar}>
      <span style={T.upgradeNote}>
        UPGRADE: USERSHIP/AI → ON STRENGTH
      </span>
      <span style={{ ...T.upgradeNote, opacity: 0.3 }}>
        AVAILABLE — MONTH 2
      </span>
    </div>
    <Rule />

    {/* ── STATUS LINE ── */}
    <StatusLine />
  </div>
)
