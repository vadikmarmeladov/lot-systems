/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// OPEN TAB — public BASIC ration ledger.
// LOT-FM-001, Month 1: read-only. A stranger can read what LOT issues and on
// what terms. House style is deliberately NOT the app's rounded/colored
// chrome: fixed character grid, inversion-only hierarchy, 2px rules, square
// corners, LiberationMono, IBM 3270 register. Quartermaster voice — no
// marketing, no color, no icons.

import * as React from 'react'
import { useDocumentTitle } from '#client/utils/hooks'

interface RationLine {
  code: string
  category: string
  nomenclature: string
  cadence: 'MONTHLY' | 'QUARTERLY' | 'SEMI-ANNUAL'
}

interface BasicsManifest {
  module: string
  name: string
  price: { amountUsd: number; cadence: string }
  doctrine: string[]
  manifest: RationLine[]
  itemCount: number
}

const FONT_STACK = "'Liberation Mono', 'Courier New', ui-monospace, monospace"

const groupByCategory = (lines: RationLine[]) => {
  const order: string[] = []
  const groups = new Map<string, RationLine[]>()
  for (const line of lines) {
    if (!groups.has(line.category)) {
      groups.set(line.category, [])
      order.push(line.category)
    }
    groups.get(line.category)!.push(line)
  }
  return order.map((category) => ({ category, lines: groups.get(category)! }))
}

export const BasicsPage = () => {
  const [data, setData] = React.useState<BasicsManifest | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  useDocumentTitle('BASIC — LOT-FM-001')

  React.useEffect(() => {
    let cancelled = false
    fetch('/api/public/basics-manifest')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'MANIFEST UNAVAILABLE')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const grouped = React.useMemo(
    () => (data ? groupByCategory(data.manifest) : []),
    [data]
  )

  return (
    <div
      style={{
        fontFamily: FONT_STACK,
        fontWeight: 700,
        background: '#fff',
        color: '#000',
        minHeight: '100vh',
        letterSpacing: '0.02em',
      }}
    >
      <style>{`
        .lotfm { max-width: 720px; margin: 0 auto; padding: 32px 16px 64px; }
        .lotfm * { border-radius: 0 !important; box-sizing: border-box; }
        .lotfm .rule { border: none; border-top: 2px solid #000; margin: 16px 0; }
        .lotfm .rule-thin { border: none; border-top: 2px solid #000; margin: 8px 0; }
        .lotfm .inv { background: #000; color: #fff; padding: 4px 8px; }
        .lotfm table { width: 100%; border-collapse: collapse; }
        .lotfm th, .lotfm td { border: 2px solid #000; padding: 6px 8px; text-align: left; vertical-align: top; }
        .lotfm th { background: #000; color: #fff; font-weight: 700; }
        .lotfm .status-line { display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; }
        .lotfm .status-line span::before { content: '\\2588  '; }
        .lotfm a { color: #000; text-decoration: underline; }
        .lotfm .cadence-M { }
        .lotfm .cadence-Q { }
        .lotfm .cat-head td { background: #000; color: #fff; }
      `}</style>

      <div className="lotfm">
        <div className="status-line">
          <span>LOT SYSTEMS CORPORATION</span>
          <span>MODULE: BASIC (RATION)</span>
          <span>LOT-FM-001</span>
        </div>

        <hr className="rule" />

        <div style={{ fontSize: 28, lineHeight: 1.2, marginBottom: 4 }}>OPEN TAB</div>
        <div className="status-line" style={{ marginBottom: 16 }}>
          <span>ACCESS: PUBLIC</span>
          <span>MODE: READ-ONLY</span>
          <span>STATUS: {loading ? 'LOADING' : error ? 'DEGRADED' : 'LIVE'}</span>
        </div>

        <hr className="rule-thin" />

        {loading && <div style={{ padding: '16px 0' }}>READING MANIFEST...</div>}

        {error && (
          <div style={{ padding: '16px 0' }}>
            MANIFEST UNAVAILABLE — {error}
          </div>
        )}

        {data && (
          <>
            <div style={{ padding: '16px 0' }}>
              {data.doctrine.map((line, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  {String(i + 1).padStart(2, '0')}. {line}
                </div>
              ))}
            </div>

            <hr className="rule" />

            <div style={{ padding: '16px 0', fontSize: 22 }}>
              <span className="inv">
                ${data.price.amountUsd.toFixed(2).replace('.00', '')}.00 / {data.price.cadence}
              </span>
            </div>
            <div style={{ marginBottom: 16, fontSize: 13 }}>
              ISSUED, NOT SOLD. THE OPERATOR IS ON STRENGTH. THIS PAGE HOLDS NO PRICE
              PER ITEM — THE LEDGER IS THE MANIFEST, NOT A CATALOG.
            </div>

            <hr className="rule" />

            <div style={{ padding: '16px 0 8px', fontSize: 13 }}>
              MANIFEST — {data.itemCount} ITEMS ON ISSUE
            </div>

            {grouped.map(({ category, lines }) => (
              <table key={category} style={{ marginBottom: 16 }}>
                <thead>
                  <tr className="cat-head">
                    <td colSpan={3}>{category}</td>
                  </tr>
                  <tr>
                    <th style={{ width: 72 }}>CODE</th>
                    <th>NOMENCLATURE</th>
                    <th style={{ width: 130 }}>CADENCE</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.code}>
                      <td>{line.code}</td>
                      <td>{line.nomenclature}</td>
                      <td>{line.cadence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}

            <hr className="rule" />

            <div style={{ padding: '16px 0', fontSize: 13 }}>
              <div style={{ marginBottom: 8 }}>
                UPGRADE — USERSHIP (AI) → BASIC (RATION): NOT YET LIVE. LOT-FM-001,
                MONTH 2.
              </div>
              <div>ROSTER, BILLING, AND FULFILLMENT ARE NOT PART OF THIS BUILD.</div>
            </div>

            <hr className="rule-thin" />

            <div className="status-line" style={{ marginTop: 16 }}>
              <span>{data.module}</span>
              <span>BUILD: MONTH 1 OF 3</span>
              <span>
                <a href="/">HOME</a>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
