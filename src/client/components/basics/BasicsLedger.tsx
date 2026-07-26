/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import {
  RATION_ITEMS,
  RATION_ITEM_COUNT,
  RATION_PRICE_USD,
  RATION_DOCTRINE_LINES,
  RATION_STATUS_LINE,
  RATION_CADENCE_LABEL,
  RationCadence,
} from '#shared/constants/ration'

// LOT-FM-001 house style — fixed to this component tree only. Deliberately
// does not read the app's theme vars (--base-color / --acc-color): the BASIC
// ledger is a quartermaster register, not a themed surface. White ground,
// black ink, 2px rules, square corners, no color, no radius, no icons.
const TERMINAL_FONT = "'Liberation Mono', 'Courier New', monospace"

const CADENCE_ORDER: RationCadence[] = ['M', 'Q', 'A', 'ISSUE']

function groupByCadence() {
  return CADENCE_ORDER.map((cadence) => ({
    cadence,
    items: RATION_ITEMS.filter((item) => item.cadence === cadence),
  })).filter((group) => group.items.length > 0)
}

const Rule = () => <div style={{ borderTop: '2px solid #000' }} />

const InvertedBar = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: '#000',
      color: '#fff',
      padding: '8px 12px',
      fontWeight: 700,
      letterSpacing: '0.02em',
    }}
  >
    {children}
  </div>
)

export const BasicsLedger = () => {
  const groups = groupByCadence()

  return (
    <div
      style={{
        fontFamily: TERMINAL_FONT,
        background: '#fff',
        color: '#000',
        border: '2px solid #000',
      }}
      className="text-[13px] leading-[1.4]"
    >
      {/* HEADER */}
      <div style={{ padding: '12px' }}>
        <div className="flex justify-between flex-wrap gap-8">
          <div style={{ fontWeight: 700 }}>LOT SYSTEMS // BASIC</div>
          <div>DOCUMENT: LOT-FM-001</div>
        </div>
        <div style={{ marginTop: '4px' }}>
          OPEN TAB — CIVILIAN RATION SUBSCRIPTION, HARDWARE / PHYSICAL ISSUE LAYER
        </div>
      </div>

      <Rule />
      <InvertedBar>{RATION_STATUS_LINE}</InvertedBar>
      <Rule />

      {/* DOCTRINE */}
      <div style={{ padding: '12px' }}>
        <div style={{ fontWeight: 700, marginBottom: '8px' }}>DOCTRINE</div>
        <div className="flex flex-col gap-4">
          {RATION_DOCTRINE_LINES.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      <Rule />
      <InvertedBar>USD {RATION_PRICE_USD} / MONTH — ONE RATE. NO TIERS.</InvertedBar>
      <Rule />

      {/* LEDGER */}
      <div style={{ padding: '12px' }}>
        <div style={{ fontWeight: 700, marginBottom: '8px' }}>
          RATION LEDGER — {RATION_ITEM_COUNT} LINE ITEMS
        </div>

        {groups.map((group) => (
          <div key={group.cadence} style={{ marginBottom: '16px' }}>
            <div style={{ background: '#000', color: '#fff', padding: '4px 8px', fontWeight: 700 }}>
              {RATION_CADENCE_LABEL[group.cadence]}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px', width: '48px' }}>LINE</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px' }}>NOMENCLATURE</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px' }}>CATEGORY</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', width: '96px' }}>UNIT</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item) => (
                  <tr key={item.line} style={{ borderBottom: '1px solid #000' }}>
                    <td style={{ padding: '4px 8px' }}>{String(item.line).padStart(2, '0')}</td>
                    <td style={{ padding: '4px 8px' }}>{item.nomenclature.toUpperCase()}</td>
                    <td style={{ padding: '4px 8px' }}>{item.category}</td>
                    <td style={{ padding: '4px 8px' }}>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <Rule />

      {/* FOOTER */}
      <div style={{ padding: '12px' }}>
        <div>LANDED COST: WITHHELD. NOMENCLATURE AND CADENCE ARE THE PUBLIC RECORD.</div>
        <div style={{ marginTop: '4px' }}>
          ISSUE, NOT SALE. THE LEDGER IS THE MARKETING. THERE IS NO LAYER BETWEEN THIS PAGE
          AND THE MANIFEST.
        </div>
      </div>
    </div>
  )
}
