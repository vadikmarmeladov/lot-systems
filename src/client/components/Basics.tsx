/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'

/**
 * LOT-FM-001 / BASIC — OPEN TAB (Month 1: Ledger & Doctrine, read-only)
 *
 * Deliberate visual deviation from house style (docs/technical/LOT-STYLE-GUIDE.md,
 * Arial + opacity hierarchy). BASIC is the hardware/physical register of the LOT
 * System — issued the way a quartermaster issues, not styled the way the app
 * markets. LiberationMono-Bold (nearest available monospace as fallback), white
 * ground / black ink, inversion-only hierarchy (no color, no size steps — the
 * ONLY way to raise something is to invert its ground), 2px rules, square
 * corners, fixed character grid, IBM 3270 register. Scoped entirely to this
 * file's <style> block — no changes to tailwind.config.js or index.css. Do not
 * "fix" this back to house style; it is a second register by design.
 *
 * Month 2 (roster intake, UPGRADE control, recurring billing, STAND DOWN) and
 * Month 3 (load engine, supplier quotes, fulfillment) are not built here — they
 * require real billing/shipping decisions and stay out of an unattended build.
 * See docs/benchmark/LOT-MANIFEST.md for the 3-month roadmap.
 */

type Cadence = 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL'

type RationItem = {
  no: number
  nomenclature: string
  cadence: Cadence
}

// 23-item civilian ration load. Nomenclature + cadence only — COGS withheld
// from the open tab (internal manifest holds cost; public manifest does not).
const RATION_LOAD: RationItem[] = [
  { no: 1, nomenclature: 'LOT TERMINAL CARD, ISSUE-GRADE', cadence: 'MONTHLY' },
  { no: 2, nomenclature: 'FIELD NOTEBOOK, POCKET, 3×5', cadence: 'MONTHLY' },
  { no: 3, nomenclature: 'PEN, GEL, BLACK INK', cadence: 'MONTHLY' },
  { no: 4, nomenclature: 'MANIFEST CARD, CURRENT CYCLE', cadence: 'MONTHLY' },
  { no: 5, nomenclature: 'LOG STRIP, ADHESIVE, 50CT', cadence: 'MONTHLY' },
  { no: 6, nomenclature: 'INDEX CARD SET, RULED', cadence: 'MONTHLY' },
  { no: 7, nomenclature: 'STENCIL, GRID 2PX, STEEL', cadence: 'QUARTERLY' },
  { no: 8, nomenclature: 'INK CARTRIDGE, BLACK, REFILL', cadence: 'QUARTERLY' },
  { no: 9, nomenclature: 'BINDER CLIP SET, STEEL', cadence: 'QUARTERLY' },
  { no: 10, nomenclature: 'TERMINAL CLOTH, MICROFIBER', cadence: 'QUARTERLY' },
  { no: 11, nomenclature: 'USB DRIVE, 32GB, ISSUE', cadence: 'QUARTERLY' },
  { no: 12, nomenclature: 'BATTERY PACK, AA, 8CT', cadence: 'QUARTERLY' },
  { no: 13, nomenclature: 'CABLE, USB-C, 1M', cadence: 'QUARTERLY' },
  { no: 14, nomenclature: 'FIELD CASE, CANVAS', cadence: 'QUARTERLY' },
  { no: 15, nomenclature: 'PATCH, LOT INSIGNIA', cadence: 'QUARTERLY' },
  { no: 16, nomenclature: 'WRISTBAND, WOVEN, LOT', cadence: 'SEMIANNUAL' },
  { no: 17, nomenclature: 'STAMP, LOT SEAL, ISSUE', cadence: 'SEMIANNUAL' },
  { no: 18, nomenclature: 'NOTEBOOK, HARDBOUND, FULL-SIZE', cadence: 'SEMIANNUAL' },
  { no: 19, nomenclature: 'MULTITOOL, POCKET, 6-FUNCTION', cadence: 'SEMIANNUAL' },
  { no: 20, nomenclature: 'FLASHLIGHT, EDC, RECHARGEABLE', cadence: 'SEMIANNUAL' },
  { no: 21, nomenclature: 'FIELD MANUAL, PRINTED EDITION', cadence: 'ANNUAL' },
  { no: 22, nomenclature: 'COIN, CHALLENGE, ISSUE', cadence: 'ANNUAL' },
  { no: 23, nomenclature: 'UNIFORM PATCH SET, FULL', cadence: 'ANNUAL' },
]

// STATUS-LINE — Month 1 has no roster/billing state machine (that is Month 2
// scope), so every reader sees the same honest default: nobody is on strength
// yet. The four-state vocabulary (NOT ON STRENGTH / PENDING / ON STRENGTH /
// STAND DOWN) is fixed now so Month 2 wires a real value into the same slot
// without a UI rewrite.
type RosterStatus = 'NOT ON STRENGTH' | 'PENDING' | 'ON STRENGTH' | 'STAND DOWN'

function StatusLine({ status }: { status: RosterStatus }) {
  return (
    <div className="lot-basics__row lot-basics__row--status">
      <span className="lot-basics__label">STATUS</span>
      <span className="lot-basics__value lot-basics__value--invert">{status}</span>
    </div>
  )
}

export function Basics() {
  const status: RosterStatus = 'NOT ON STRENGTH'

  return (
    <div className="lot-basics">
      <style>{BASICS_CSS}</style>
      <div className="lot-basics__frame">
        <header className="lot-basics__masthead">
          <span className="lot-basics__masthead-mark">LOT BASIC</span>
          <span className="lot-basics__masthead-tag">OPEN TAB</span>
        </header>

        <StatusLine status={status} />

        <div className="lot-basics__row">
          <span className="lot-basics__label">RATE</span>
          <span className="lot-basics__value">USD 100 / MONTH</span>
        </div>

        <div className="lot-basics__row">
          <span className="lot-basics__label">LOAD</span>
          <span className="lot-basics__value">23 ITEMS ON MANIFEST</span>
        </div>

        <div className="lot-basics__rule" />

        <section className="lot-basics__doctrine">
          <p>ISSUE, NOT SOLD.</p>
          <p>YOU ARE ON STRENGTH OR YOU ARE NOT. NO TIER BETWEEN.</p>
          <p>THE LOAD IS FIXED. THE CADENCE IS FIXED. THE RATE IS FIXED.</p>
          <p>THIS TAB IS THE LEDGER. THE LEDGER IS THE MARKETING.</p>
        </section>

        <div className="lot-basics__rule" />

        <section className="lot-basics__manifest">
          <div className="lot-basics__manifest-title">RATION MANIFEST — 23 ITEMS</div>
          <div className="lot-basics__manifest-head">
            <span className="lot-basics__col-no">NO</span>
            <span className="lot-basics__col-name">NOMENCLATURE</span>
            <span className="lot-basics__col-cadence">CADENCE</span>
          </div>
          {RATION_LOAD.map((item) => (
            <div className="lot-basics__manifest-row" key={item.no}>
              <span className="lot-basics__col-no">{String(item.no).padStart(2, '0')}</span>
              <span className="lot-basics__col-name">{item.nomenclature}</span>
              <span className="lot-basics__col-cadence">{item.cadence}</span>
            </div>
          ))}
        </section>

        <div className="lot-basics__rule" />

        <footer className="lot-basics__footer">
          <p>COST DATA WITHHELD FROM OPEN TAB. MANIFEST IS INTERNAL.</p>
          <p>ENLISTMENT OPENS MONTH 2. FIRST ISSUE SHIPS MONTH 3.</p>
        </footer>
      </div>
    </div>
  )
}

const BASICS_CSS = `
.lot-basics, .lot-basics * {
  box-sizing: border-box;
  border-radius: 0 !important;
}
.lot-basics {
  --lb-fg: #000;
  --lb-bg: #fff;
  font-family: 'Liberation Mono', 'DejaVu Sans Mono', 'Courier New', monospace;
  font-weight: 700;
  background: var(--lb-bg);
  color: var(--lb-fg);
  letter-spacing: 0;
  line-height: 1.5;
}
.lot-basics__frame {
  max-width: 720px;
  margin: 0 auto;
  border: 2px solid var(--lb-fg);
}
.lot-basics__masthead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--lb-fg);
  color: var(--lb-bg);
  border-bottom: 2px solid var(--lb-fg);
}
.lot-basics__masthead-mark {
  font-size: 1.1em;
}
.lot-basics__masthead-tag {
  font-size: 0.85em;
}
.lot-basics__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 2px solid var(--lb-fg);
}
.lot-basics__label {
  opacity: 1;
}
.lot-basics__value--invert {
  background: var(--lb-fg);
  color: var(--lb-bg);
  padding: 2px 8px;
}
.lot-basics__rule {
  border-top: 2px solid var(--lb-fg);
}
.lot-basics__doctrine {
  padding: 16px;
}
.lot-basics__doctrine p {
  margin: 0 0 8px 0;
}
.lot-basics__doctrine p:last-child {
  margin-bottom: 0;
}
.lot-basics__manifest {
  padding: 16px;
}
.lot-basics__manifest-title {
  margin-bottom: 12px;
}
.lot-basics__manifest-head,
.lot-basics__manifest-row {
  display: grid;
  grid-template-columns: 3ch 1fr 11ch;
  gap: 8px;
  padding: 4px 0;
}
.lot-basics__manifest-head {
  border-bottom: 2px solid var(--lb-fg);
  padding-bottom: 8px;
  margin-bottom: 4px;
}
.lot-basics__manifest-row {
  border-bottom: 1px solid var(--lb-fg);
}
.lot-basics__manifest-row:last-child {
  border-bottom: none;
}
.lot-basics__col-cadence {
  text-align: right;
}
.lot-basics__footer {
  padding: 16px;
}
.lot-basics__footer p {
  margin: 0 0 4px 0;
  opacity: 1;
}
.lot-basics__footer p:last-child {
  margin-bottom: 0;
}
@media (max-width: 480px) {
  .lot-basics__manifest-head,
  .lot-basics__manifest-row {
    grid-template-columns: 3ch 1fr;
  }
  .lot-basics__col-cadence {
    grid-column: 2;
    text-align: left;
    opacity: 1;
  }
}
`
