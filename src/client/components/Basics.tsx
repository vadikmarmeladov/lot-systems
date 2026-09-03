/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useDocumentTitle } from '#client/utils/hooks'

// ==============================================================================
// LOT BASIC — OPEN TAB
// Public, read-only ledger of the LOT civilian ration subscription.
// House style per LOT-FM-001: LiberationMono-Bold, white ground / black ink,
// inversion-only hierarchy, 2px rules, square corners, fixed character grid,
// IBM 3270 register. This surface is deliberately NOT themed to the rest of
// the app (no acc/bac tokens, no dark mode, no rounded corners) — the ration
// module carries its own fixed visual identity, independent of user theme.
// ==============================================================================

const DOC_ID = 'LOT-FM-001'
const MODULE_ID = 'MOD-BASIC'
const RATION_PRICE_USD = 100
const COGS_CEILING_USD = 40
const MIN_MARGIN_PCT = 60

// DRAFT MANIFEST — nomenclature + cadence only. COGS withheld per doctrine:
// the ledger is the marketing, not the cost sheet. Pending final supplier
// confirmation against the COGS ceiling (see doctrine, Month 3 gate).
type RationItem = { no: number; nomenclature: string; cadence: string }

const RATION_MANIFEST: RationItem[] = [
  { no: 1, nomenclature: 'FIELD NOTEBOOK, POCKET, RULED', cadence: 'MONTHLY' },
  { no: 2, nomenclature: 'PEN, BALLPOINT, BLACK', cadence: 'MONTHLY' },
  { no: 3, nomenclature: 'MANIFEST CARD, PRINTED, CURRENT ISSUE', cadence: 'MONTHLY' },
  { no: 4, nomenclature: 'SCREEN CLOTH, MICROFIBER', cadence: 'MONTHLY' },
  { no: 5, nomenclature: 'LABEL STICKERS, BLANK, SHEET OF 24', cadence: 'QUARTERLY' },
  { no: 6, nomenclature: 'USB-C CABLE, 1M', cadence: 'QUARTERLY' },
  { no: 7, nomenclature: 'CABLE TIES, PACK OF 10', cadence: 'QUARTERLY' },
  { no: 8, nomenclature: 'BATTERY, AA, PACK OF 4', cadence: 'QUARTERLY' },
  { no: 9, nomenclature: 'BATTERY, AAA, PACK OF 4', cadence: 'QUARTERLY' },
  { no: 10, nomenclature: 'EARPLUGS, FOAM, PACK OF 6 PAIR', cadence: 'QUARTERLY' },
  { no: 11, nomenclature: 'USB-C CABLE, 2M', cadence: 'SEMIANNUAL' },
  { no: 12, nomenclature: 'ADHESIVE CABLE CLIPS, PACK OF 6', cadence: 'SEMIANNUAL' },
  { no: 13, nomenclature: 'SLEEP MASK', cadence: 'SEMIANNUAL' },
  { no: 14, nomenclature: 'FIRST-AID KIT, POCKET', cadence: 'SEMIANNUAL' },
  { no: 15, nomenclature: 'DUCT TAPE, MINI ROLL', cadence: 'SEMIANNUAL' },
  { no: 16, nomenclature: 'ZIP POUCH, WATER-RESISTANT', cadence: 'SEMIANNUAL' },
  { no: 17, nomenclature: 'FLASH DRIVE, 32GB, LOT OS', cadence: 'ANNUAL' },
  { no: 18, nomenclature: 'LAPTOP STAND, FOLDING', cadence: 'ANNUAL' },
  { no: 19, nomenclature: 'PHONE MOUNT, DESK', cadence: 'ANNUAL' },
  { no: 20, nomenclature: 'WATER BOTTLE, 750ML, STEEL', cadence: 'ANNUAL' },
  { no: 21, nomenclature: 'MULTI-TOOL, POCKET', cadence: 'ANNUAL' },
  { no: 22, nomenclature: 'HEADLAMP, LED', cadence: 'ANNUAL' },
  { no: 23, nomenclature: 'SIM EJECT TOOL + SPARE SCREWS', cadence: 'ANNUAL' },
]

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0')
}

function StatusLine() {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const stamp = now.toISOString().replace('T', ' ').slice(0, 19) + 'Z'

  const fields: Array<[string, string]> = [
    ['SYSTEM', 'LOT® BASIC'],
    ['DOCUMENT', DOC_ID],
    ['MODULE', MODULE_ID],
    ['STATUS', 'OPEN TAB — LEDGER LIVE'],
    ['STAMP', stamp],
  ]

  return (
    <div className="ration-status" role="status" aria-live="off">
      {fields.map(([label, value]) => (
        <span className="ration-status-field" key={label}>
          <span className="ration-status-label">{label}</span>
          <span className="ration-status-value">{value}</span>
        </span>
      ))}
    </div>
  )
}

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="ration-section-head">
      <span>{n}</span>
      <span>{title}</span>
    </div>
  )
}

export function Basics() {
  useDocumentTitle('LOT Basic — Ration', true)

  return (
    <div className="lot-ration">
      <style dangerouslySetInnerHTML={{ __html: RATION_STYLE }} />

      <div className="ration-frame">
        <header className="ration-header">
          <div className="ration-title">LOT® BASIC</div>
          <div className="ration-subtitle">RATION SUBSCRIPTION — OPEN TAB</div>
        </header>

        <StatusLine />

        <SectionHead n="00" title="DOCTRINE" />
        <div className="ration-body">
          <p>
            LOT BASIC is issued, not sold. Enrollment places the member ON
            STRENGTH — carried on the roster, resupplied on a fixed cadence,
            accounted for in the open ledger below.
          </p>
          <p>
            The ledger is the marketing. There is no layer between what is
            public and what is manifest: this page lists every item LOT
            issues under BASIC and the cadence it ships on. Unit cost is
            withheld — nomenclature and cadence are not.
          </p>
          <p>
            BASIC is the hardware and physical layer of the LOT System. It
            equips the member carrying LOT into the field: notebook, cable,
            battery, light, water, tool. The System runs the mind. BASIC
            runs the body that carries it.
          </p>
        </div>

        <SectionHead n="01" title="PRICE LINE" />
        <div className="ration-price">
          <span className="ration-price-amount">
            USD {RATION_PRICE_USD}.00 / MONTH
          </span>
          <span className="ration-price-terms">
            BILLED MONTHLY — ISSUED MONTHLY — STAND DOWN ANY CYCLE
          </span>
        </div>

        <SectionHead n="02" title="MANIFEST — 23 ITEM LOAD" />
        <div className="ration-manifest-note">
          DRAFT MANIFEST. NOMENCLATURE AND CADENCE CONFIRMED. UNIT COST
          WITHHELD. PENDING FINAL SUPPLIER CONFIRMATION AGAINST CEILING.
        </div>
        <table className="ration-table">
          <thead>
            <tr>
              <th className="ration-col-no">NO</th>
              <th>NOMENCLATURE</th>
              <th className="ration-col-cadence">CADENCE</th>
            </tr>
          </thead>
          <tbody>
            {RATION_MANIFEST.map((item) => (
              <tr key={item.no}>
                <td className="ration-col-no">{pad(item.no, 2)}</td>
                <td>{item.nomenclature}</td>
                <td className="ration-col-cadence">{item.cadence}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <SectionHead n="03" title="MARGIN ENVELOPE" />
        <div className="ration-body">
          <p>
            LANDED COST CEILING: USD {COGS_CEILING_USD}.00 / ISSUE. MINIMUM
            MARGIN: {MIN_MARGIN_PCT}%. CEILING NEVER BREACHED. MARGIN
            VERIFIED AT FIRST ISSUE.
          </p>
        </div>

        <SectionHead n="04" title="TERMS" />
        <ul className="ration-terms">
          <li>USERSHIP (AI) MEMBERS MAY UPGRADE INTO BASIC. RATION ADDS TO EXISTING PLAN.</li>
          <li>STAND DOWN DROPS THE RATION AND RETAINS USERSHIP AI. NO PENALTY.</li>
          <li>ISSUE CADENCE FOLLOWS THE MANIFEST ABOVE. NO SUBSTITUTIONS WITHOUT NOTICE.</li>
          <li>THIS PAGE IS READ-ONLY. INTAKE IS NOT YET LIVE.</li>
        </ul>

        <footer className="ration-footer">
          <div>{DOC_ID} / {MODULE_ID} — MONTH 1 OF 3 — LEDGER &amp; DOCTRINE</div>
          <div>LOT SYSTEMS CORPORATION — MADE IN THE USA</div>
        </footer>
      </div>
    </div>
  )
}

const RATION_STYLE = `
.lot-ration {
  --ration-fg: #000;
  --ration-bg: #fff;
  --ration-rule: 2px;
  font-family: 'Liberation Mono', 'Courier New', Courier, monospace;
  font-weight: 700;
  color: var(--ration-fg);
  background: var(--ration-bg);
  min-height: 100dvh;
  line-height: 1.5;
  letter-spacing: 0;
}
.lot-ration, .lot-ration * {
  box-sizing: border-box;
  border-radius: 0 !important;
}
.ration-frame {
  max-width: 78ch;
  margin: 0 auto;
  padding: 16px;
}
.ration-header {
  border-bottom: var(--ration-rule) solid var(--ration-fg);
  padding-bottom: 12px;
  margin-bottom: 12px;
}
.ration-title {
  font-size: 28px;
  letter-spacing: 0.02em;
}
.ration-subtitle {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 4px;
}
.ration-status {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  background: var(--ration-fg);
  color: var(--ration-bg);
  margin-bottom: 16px;
  font-size: 12px;
}
.ration-status-field {
  display: flex;
  padding: 6px 10px;
  border-right: 1px solid var(--ration-bg);
  gap: 6px;
}
.ration-status-field:last-child { border-right: none; }
.ration-status-label { opacity: 0.6; }
.ration-status-value { font-weight: 700; }
.ration-section-head {
  display: flex;
  gap: 10px;
  background: var(--ration-fg);
  color: var(--ration-bg);
  padding: 6px 10px;
  margin: 20px 0 10px;
  font-size: 13px;
  letter-spacing: 0.04em;
}
.ration-body p {
  font-size: 13px;
  margin: 0 0 12px;
  max-width: 66ch;
}
.ration-price {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  border: var(--ration-rule) solid var(--ration-fg);
  margin-bottom: 4px;
}
.ration-price-amount { font-size: 20px; }
.ration-price-terms { font-size: 11px; opacity: 0.7; }
.ration-manifest-note {
  font-size: 11px;
  opacity: 0.7;
  margin-bottom: 10px;
}
.ration-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 4px;
}
.ration-table th, .ration-table td {
  border-top: 1px solid var(--ration-fg);
  padding: 5px 8px;
  text-align: left;
}
.ration-table thead th {
  border-top: none;
  border-bottom: var(--ration-rule) solid var(--ration-fg);
  font-weight: 700;
}
.ration-col-no { width: 6ch; }
.ration-col-cadence { width: 14ch; }
.ration-terms {
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
  font-size: 12px;
}
.ration-terms li {
  padding: 6px 0;
  border-top: 1px solid var(--ration-fg);
}
.ration-footer {
  border-top: var(--ration-rule) solid var(--ration-fg);
  margin-top: 24px;
  padding-top: 10px;
  font-size: 11px;
  opacity: 0.7;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;
}
`
