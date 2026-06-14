/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'

// LOT-FM-001 / RATION PLAN — 23-item civilian ration manifest
// COGS withheld. Cadence from Section 2. Nomenclature only.
const RATION_MANIFEST = [
  { id: '01', nomenclature: 'ROLLED OATS',            unit: '1KG',   cadence: 'MONTHLY'    },
  { id: '02', nomenclature: 'LONG-GRAIN WHITE RICE',  unit: '1KG',   cadence: 'MONTHLY'    },
  { id: '03', nomenclature: 'RED LENTILS',             unit: '500G',  cadence: 'MONTHLY'    },
  { id: '04', nomenclature: 'MIXED NUTS UNSALTED',    unit: '300G',  cadence: 'MONTHLY'    },
  { id: '05', nomenclature: 'EXTRA VIRGIN OLIVE OIL', unit: '500ML', cadence: 'MONTHLY'    },
  { id: '06', nomenclature: 'APPLE CIDER VINEGAR',    unit: '500ML', cadence: 'MONTHLY'    },
  { id: '07', nomenclature: 'SEA SALT FINE',          unit: '400G',  cadence: 'MONTHLY'    },
  { id: '08', nomenclature: 'BLACK PEPPER GROUND',    unit: '100G',  cadence: 'MONTHLY'    },
  { id: '09', nomenclature: 'MULTIVITAMIN',           unit: '30CT',  cadence: 'MONTHLY'    },
  { id: '10', nomenclature: 'VITAMIN D3 2000IU',      unit: '60CT',  cadence: 'BIMONTHLY'  },
  { id: '11', nomenclature: 'MAGNESIUM GLYCINATE',    unit: '60CT',  cadence: 'BIMONTHLY'  },
  { id: '12', nomenclature: 'OMEGA-3 FISH OIL',       unit: '60CT',  cadence: 'BIMONTHLY'  },
  { id: '13', nomenclature: 'PREBIOTIC FIBER',        unit: '200G',  cadence: 'MONTHLY'    },
  { id: '14', nomenclature: 'ELECTROLYTE SACHETS',    unit: '10CT',  cadence: 'MONTHLY'    },
  { id: '15', nomenclature: 'BAR SOAP UNSCENTED',     unit: '2CT',   cadence: 'MONTHLY'    },
  { id: '16', nomenclature: 'FLUORIDE TOOTHPASTE',    unit: '75ML',  cadence: 'MONTHLY'    },
  { id: '17', nomenclature: 'DENTAL FLOSS',           unit: '50M',   cadence: 'MONTHLY'    },
  { id: '18', nomenclature: 'DISPOSABLE RAZOR',       unit: '4CT',   cadence: 'MONTHLY'    },
  { id: '19', nomenclature: 'ISOPROPYL ALCOHOL 70%',  unit: '250ML', cadence: 'MONTHLY'    },
  { id: '20', nomenclature: 'COTTON SWABS',           unit: '100CT', cadence: 'MONTHLY'    },
  { id: '21', nomenclature: 'A4 NOTEPAD 50SH',        unit: '1CT',   cadence: 'MONTHLY'    },
  { id: '22', nomenclature: 'BALLPOINT PEN BLACK',    unit: '2CT',   cadence: 'MONTHLY'    },
  { id: '23', nomenclature: 'PRINTED MANIFEST CARD',  unit: '1CT',   cadence: 'MONTHLY'    },
] as const

// LOT-FM-001 house style: LiberationMono-Bold, white ground/black ink,
// inversion-only hierarchy, 2px rules, square corners, IBM 3270 register.
// These styles are non-negotiable and override the app theme entirely.
const FONT = "'Liberation Mono', 'Courier New', 'Courier', monospace"
const BOLD = 700

const s = {
  root: {
    fontFamily: FONT,
    fontWeight: BOLD,
    background: '#FFFFFF',
    color: '#000000',
    minHeight: '100dvh',
    colorScheme: 'light',
    // Escape Page wrapper padding by pulling to edges
    margin: '-16px',
  } as React.CSSProperties,
  // IBM 3270 OIA — operator information area, top status bar
  oia: {
    fontFamily: FONT,
    fontWeight: BOLD,
    background: '#000000',
    color: '#FFFFFF',
    fontSize: '10px',
    letterSpacing: '0.12em',
    padding: '5px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    userSelect: 'none' as const,
  } as React.CSSProperties,
  rule: {
    borderBottom: '2px solid #000000',
    margin: 0,
  } as React.CSSProperties,
  section: {
    padding: '14px 20px',
    borderBottom: '2px solid #000000',
  } as React.CSSProperties,
  sectionLabel: {
    fontSize: '9px',
    letterSpacing: '0.22em',
    opacity: 0.45,
    marginBottom: '8px',
  } as React.CSSProperties,
  title: {
    fontSize: '22px',
    letterSpacing: '0.06em',
    lineHeight: 1.2,
  } as React.CSSProperties,
  subtitle: {
    fontSize: '11px',
    letterSpacing: '0.14em',
    opacity: 0.55,
    marginTop: '3px',
  } as React.CSSProperties,
  doctrine: {
    fontSize: '12px',
    lineHeight: '1.9',
    letterSpacing: '0.04em',
  } as React.CSSProperties,
  rateRow: {
    padding: '10px 20px',
    borderBottom: '2px solid #000000',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  } as React.CSSProperties,
  rateLabel: {
    fontSize: '9px',
    letterSpacing: '0.22em',
    opacity: 0.45,
  } as React.CSSProperties,
  rateValue: {
    fontSize: '20px',
    letterSpacing: '0.06em',
  } as React.CSSProperties,
  // Manifest table
  manifestSection: {
    padding: '0 20px 20px',
  } as React.CSSProperties,
  manifestHeader: {
    fontSize: '9px',
    letterSpacing: '0.22em',
    opacity: 0.45,
    padding: '12px 0 8px',
  } as React.CSSProperties,
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '30px 1fr 70px 100px',
    gap: '0 12px',
    padding: '6px 8px',
    background: '#000000',
    color: '#FFFFFF',
    fontSize: '9px',
    letterSpacing: '0.18em',
  } as React.CSSProperties,
  tableHeadCell: (align: 'left' | 'right') =>
    ({ textAlign: align } as React.CSSProperties),
  tableRow: (i: number) =>
    ({
      display: 'grid',
      gridTemplateColumns: '30px 1fr 70px 100px',
      gap: '0 12px',
      padding: '5px 8px',
      fontSize: '11px',
      letterSpacing: '0.04em',
      borderBottom: '1px solid rgba(0,0,0,0.12)',
      background: i % 2 === 1 ? 'rgba(0,0,0,0.03)' : 'transparent',
    } as React.CSSProperties),
  tableRowId: {
    opacity: 0.35,
    fontSize: '10px',
  } as React.CSSProperties,
  tableRowUnit: {
    textAlign: 'right' as const,
    opacity: 0.55,
    fontSize: '10px',
  } as React.CSSProperties,
  tableRowCadence: {
    textAlign: 'right' as const,
    opacity: 0.55,
    fontSize: '10px',
  } as React.CSSProperties,
  tableFooter: {
    padding: '7px 8px',
    fontSize: '9px',
    letterSpacing: '0.12em',
    opacity: 0.38,
    borderTop: '2px solid #000000',
  } as React.CSSProperties,
  // Upgrade path block
  upgradeBox: {
    margin: '0 20px 20px',
    border: '2px solid #000000',
    padding: '14px 16px',
  } as React.CSSProperties,
  upgradeLabel: {
    fontSize: '9px',
    letterSpacing: '0.22em',
    opacity: 0.45,
    marginBottom: '8px',
  } as React.CSSProperties,
  upgradeText: {
    fontSize: '12px',
    lineHeight: '1.9',
    letterSpacing: '0.04em',
    marginBottom: '14px',
  } as React.CSSProperties,
  upgradeBtn: {
    fontFamily: FONT,
    fontWeight: BOLD,
    fontSize: '11px',
    letterSpacing: '0.18em',
    background: '#000000',
    color: '#FFFFFF',
    border: '2px solid #000000',
    borderRadius: 0,
    padding: '7px 18px',
    cursor: 'not-allowed',
    opacity: 0.38,
    display: 'inline-block',
  } as React.CSSProperties,
  // M1 build notice
  buildNotice: {
    padding: '10px 20px 8px',
    fontSize: '9px',
    letterSpacing: '0.14em',
    opacity: 0.35,
    borderTop: '1px solid rgba(0,0,0,0.15)',
  } as React.CSSProperties,
} as const

function OIABar({ date }: { date: string }) {
  return (
    <div style={s.oia}>
      <span>LOT-FM-001 / RATION / BASIC</span>
      <span>M1 — LEDGER &amp; DOCTRINE</span>
      <span>OPEN TAB / READ-ONLY</span>
      <span>{date}</span>
    </div>
  )
}

function ManifestTable() {
  return (
    <div style={s.manifestSection}>
      <div style={s.manifestHeader}>RATION MANIFEST — {RATION_MANIFEST.length} LINE ITEMS</div>
      <div style={s.tableHead}>
        <div style={s.tableHeadCell('left')}>NO.</div>
        <div style={s.tableHeadCell('left')}>NOMENCLATURE</div>
        <div style={s.tableHeadCell('right')}>UNIT</div>
        <div style={s.tableHeadCell('right')}>CADENCE</div>
      </div>
      {RATION_MANIFEST.map((item, i) => (
        <div key={item.id} style={s.tableRow(i)}>
          <div style={s.tableRowId}>{item.id}</div>
          <div>{item.nomenclature}</div>
          <div style={s.tableRowUnit}>{item.unit}</div>
          <div style={s.tableRowCadence}>{item.cadence}</div>
        </div>
      ))}
      <div style={s.tableFooter}>
        COGS WITHHELD. MARGIN ≥60% GUARANTEED. CEILING USD 40 LANDED.
      </div>
    </div>
  )
}

export const Basics: React.FC = () => {
  const date = React.useMemo(() => new Date().toISOString().slice(0, 10), [])

  return (
    <div style={s.root}>
      <OIABar date={date} />

      {/* Title */}
      <div style={s.section}>
        <div style={s.sectionLabel}>LOT® SYSTEMS / SUBSCRIPTION PLAN</div>
        <div style={s.title}>LOT® BASIC</div>
        <div style={s.subtitle}>CIVILIAN RATION SUBSCRIPTION</div>
      </div>

      {/* Doctrine */}
      <div style={s.section}>
        <div style={s.sectionLabel}>DOCTRINE</div>
        <div style={s.doctrine}>
          ISSUE, DO NOT SELL. THE USER IS ON STRENGTH.<br />
          USD 100 PER MONTH. ≥60% MARGIN. ≤USD 40 LANDED. NEVER BREACH THE CEILING.<br />
          THE LEDGER IS THE MARKETING.<br />
          NO LAYER BETWEEN PUBLIC AND MANIFEST.<br />
          SHIP WORKING INCREMENTS MONTHLY.
        </div>
      </div>

      {/* Rate */}
      <div style={s.rateRow}>
        <span style={s.rateLabel}>MONTHLY RATE</span>
        <span style={s.rateValue}>USD 100 / MONTH</span>
      </div>

      {/* 23-item manifest */}
      <ManifestTable />

      {/* Upgrade path — Month 2 */}
      <div style={s.upgradeBox}>
        <div style={s.upgradeLabel}>UPGRADE PATH (OPENS M2)</div>
        <div style={s.upgradeText}>
          USERSHIP (AI) → PENDING → ON STRENGTH → STEADY STATE<br />
          ADDITIVE TO LOT USERSHIP. RETAIN AI PLAN ON STAND DOWN.<br />
          RECURRING USD 100/MO. CANCEL: DROPS RATION, KEEPS AI.
        </div>
        <button style={s.upgradeBtn} disabled aria-disabled="true">
          UPGRADE → OPENS M2
        </button>
      </div>

      {/* Build notice */}
      <div style={s.buildNotice}>
        LOT-FM-001 M1 / LEDGER &amp; DOCTRINE / BUILD DATE {date} / READ-ONLY
        — M2: UPGRADE &amp; ROSTER — M3: ISSUE &amp; FULFILLMENT
      </div>
    </div>
  )
}
