/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC (RATION) — MONTH 1: LEDGER & DOCTRINE
 * OPEN TAB — PUBLIC SURFACE — READ-ONLY
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'

// ─── Terminal identity tokens — LOT-FM-001 ───────────────────────────────────
const FM = {
  bg: '#ffffff',
  ink: '#000000',
  rule: '2px solid #000000',
  ruleLight: '1px solid #000000',
  font: '"Liberation Mono", "Courier New", Courier, monospace',
  fw: 700,
  fwNormal: 400,
} as const

// ─── Inline style map ────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: FM.font,
    fontWeight: FM.fw,
    backgroundColor: FM.bg,
    color: FM.ink,
    border: FM.rule,
    fontSize: '13px',
    lineHeight: '1.5',
    letterSpacing: '0',
  },
  header: {
    backgroundColor: FM.ink,
    color: FM.bg,
    padding: '10px 14px',
    borderBottom: FM.rule,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '16px',
    lineHeight: '1.6',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 14px',
    borderBottom: FM.rule,
    fontSize: '11px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontWeight: FM.fw,
  },
  section: {
    padding: '10px 14px',
    borderBottom: FM.rule,
  },
  sectionLabel: {
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    opacity: 0.45,
    marginBottom: '5px',
    fontWeight: FM.fw,
  },
  sectionBody: {
    fontWeight: FM.fwNormal,
    lineHeight: '1.65',
  },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '38px 1fr 90px',
    padding: '5px 14px',
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    borderBottom: FM.rule,
    backgroundColor: '#000',
    color: '#fff',
  },
  tableRowEven: {
    display: 'grid',
    gridTemplateColumns: '38px 1fr 90px',
    padding: '5px 14px',
    borderBottom: FM.ruleLight,
    fontWeight: FM.fwNormal,
    fontSize: '12px',
    backgroundColor: '#fafafa',
  },
  tableRowOdd: {
    display: 'grid',
    gridTemplateColumns: '38px 1fr 90px',
    padding: '5px 14px',
    borderBottom: FM.ruleLight,
    fontWeight: FM.fwNormal,
    fontSize: '12px',
    backgroundColor: FM.bg,
  },
  seqCell: {
    opacity: 0.35,
    fontFamily: FM.font,
    fontSize: '11px',
  },
  nomenclatureCell: {
    fontFamily: FM.font,
    paddingRight: '8px',
  },
  cadenceMonthly: {
    fontFamily: FM.font,
    fontSize: '11px',
    letterSpacing: '0.04em',
  },
  cadenceQuarterly: {
    fontFamily: FM.font,
    fontSize: '11px',
    letterSpacing: '0.04em',
    opacity: 0.5,
  },
  upgradeSection: {
    padding: '10px 14px',
  },
  upgradeLine: {
    fontWeight: FM.fwNormal,
    lineHeight: '1.65',
    opacity: 0.55,
  },
  upgradeEnrollLine: {
    fontWeight: FM.fwNormal,
    fontSize: '11px',
    letterSpacing: '0.04em',
    marginTop: '6px',
    opacity: 0.35,
    textTransform: 'uppercase' as const,
  },
}

// ─── 23-item civilian ration load — LOT-FM-001 §2 ───────────────────────────
const MANIFEST: Array<{
  seq: string
  nomenclature: string
  cadence: 'MONTHLY' | 'QUARTERLY'
}> = [
  { seq: '001', nomenclature: 'SOAP, BAR — castile, unscented, 4oz × 2', cadence: 'MONTHLY' },
  { seq: '002', nomenclature: 'SHAMPOO, SOLID — sulfate-free, 2oz bar', cadence: 'MONTHLY' },
  { seq: '003', nomenclature: 'CONDITIONER, LEAVE-IN — lightweight, 1oz sachet', cadence: 'MONTHLY' },
  { seq: '004', nomenclature: 'TOOTHPASTE — fluoride, 2.5oz tube', cadence: 'MONTHLY' },
  { seq: '005', nomenclature: 'DENTAL FLOSS — PTFE, 30yd spool', cadence: 'MONTHLY' },
  { seq: '006', nomenclature: 'RAZOR, SAFETY — single-blade + 4 replacement blades', cadence: 'MONTHLY' },
  { seq: '007', nomenclature: 'DEODORANT — mineral crystal stick, 2.6oz', cadence: 'MONTHLY' },
  { seq: '008', nomenclature: 'LIP BALM — unflavored, SPF 15', cadence: 'MONTHLY' },
  { seq: '009', nomenclature: 'MOISTURIZER — fragrance-free, 1.5oz', cadence: 'MONTHLY' },
  { seq: '010', nomenclature: 'VITAMIN D3 — 2000IU softgel, 30-ct', cadence: 'MONTHLY' },
  { seq: '011', nomenclature: 'OMEGA-3 — EPA+DHA 1000mg softgel, 30-ct', cadence: 'MONTHLY' },
  { seq: '012', nomenclature: 'MAGNESIUM, GLYCINATE — 200mg capsule, 30-ct', cadence: 'MONTHLY' },
  { seq: '013', nomenclature: 'ELECTROLYTE PACKET — no-sugar, 5-ct', cadence: 'MONTHLY' },
  { seq: '014', nomenclature: 'TEA, BLACK — loose brick, 20-brew yield', cadence: 'MONTHLY' },
  { seq: '015', nomenclature: 'COFFEE, GROUND — single-origin, 2oz', cadence: 'MONTHLY' },
  { seq: '016', nomenclature: 'PROTEIN BAR — 20g standard, 1-ct', cadence: 'MONTHLY' },
  { seq: '017', nomenclature: 'NUTS, MIXED — unsalted, 1oz foil pack', cadence: 'MONTHLY' },
  { seq: '018', nomenclature: 'SPONGE, CELLULOSE — kitchen use, 2-ct', cadence: 'MONTHLY' },
  { seq: '019', nomenclature: 'WIPE, ANTIBACTERIAL — pocket pack, 10-ct', cadence: 'MONTHLY' },
  { seq: '020', nomenclature: 'BAG, PRODUCE — reusable mesh, 3-ct', cadence: 'MONTHLY' },
  { seq: '021', nomenclature: 'MANIFEST CARD — printed issue record', cadence: 'MONTHLY' },
  { seq: '022', nomenclature: 'FIELD NOTES — 3.5×5.5in, 48pg staple-bound', cadence: 'QUARTERLY' },
  { seq: '023', nomenclature: 'PENCIL, HEX — #2 graphite, 2-ct', cadence: 'QUARTERLY' },
]

// ─── Status derived from user tags ───────────────────────────────────────────
function getMemberStatus(tags: string[]): string {
  if (tags.includes('Basic')) return 'ON STRENGTH'
  if (tags.includes('Usership')) return 'ELIGIBLE — UPGRADE MTH 2'
  return 'OPEN — USERSHIP REQUIRED'
}

// ─── Component ───────────────────────────────────────────────────────────────
export function BasicsPage() {
  const me = useStore(stores.me)
  const tags: string[] = me?.tags ?? []
  const memberStatus = getMemberStatus(tags)

  return (
    <div style={S.root}>

      {/* ── HEADER (inverted) ── */}
      <div style={S.header}>
        <div style={S.headerRow}>
          <span>LOT® BASIC — RATION MANIFEST</span>
          <span>LOT-FM-001</span>
        </div>
        <div style={S.headerRow}>
          <span>23-ITEM CIVILIAN RATION LOAD</span>
          <span>USD 100.00 / MO</span>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div style={S.statusBar}>
        <span>STATUS: OPEN TAB</span>
        <span>{memberStatus}</span>
      </div>

      {/* ── DOCTRINE ── */}
      <div style={S.section}>
        <div style={S.sectionLabel}>Doctrine</div>
        <div style={S.sectionBody}>
          <div>LOT issues. You receive. No negotiation. No substitution. No selection.</div>
          <div>The load is the load. The ledger is the marketing.</div>
          <div>Cost ceiling: USD 40.00 landed. Margin floor: 60%.</div>
          <div>The ceiling is inviolable.</div>
        </div>
      </div>

      {/* ── LEDGER ── */}
      <div>
        <div style={S.tableHead}>
          <span>#</span>
          <span>Nomenclature</span>
          <span>Cadence</span>
        </div>
        {MANIFEST.map((item, i) => (
          <div key={item.seq} style={i % 2 === 0 ? S.tableRowEven : S.tableRowOdd}>
            <span style={S.seqCell}>{item.seq}</span>
            <span style={S.nomenclatureCell}>{item.nomenclature}</span>
            <span style={item.cadence === 'QUARTERLY' ? S.cadenceQuarterly : S.cadenceMonthly}>
              {item.cadence}
            </span>
          </div>
        ))}
      </div>

      {/* ── UPGRADE PATH ── */}
      <div style={S.upgradeSection}>
        <div style={S.sectionLabel}>Upgrade path</div>
        <div style={S.upgradeLine}>USERSHIP (AI) → BASIC (RATION) — additive USD 100.00/mo</div>
        <div style={S.upgradeLine}>STAND DOWN: drops ration, retains AI plan. No penalty.</div>
        <div style={S.upgradeEnrollLine}>Enrollment control active: Month 2</div>
      </div>

    </div>
  )
}
