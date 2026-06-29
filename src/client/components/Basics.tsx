/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'

// ─── LOT TERMINAL TOKENS ────────────────────────────────────────────────────
// Visual spec: LiberationMono-Bold · white ground / black ink
// 2px rules · square corners · fixed character grid · IBM 3270 register
// Voice: quartermaster, imperative, terse.
// No marketing. No color. No radius. No icons.

const T = {
  mono: "'Liberation Mono', 'Courier New', Courier, monospace" as const,
  ground: '#ffffff' as const,
  ink: '#050505' as const,
  rule: '2px solid #050505' as const,
  ruleLight: '1px solid rgba(5,5,5,0.12)' as const,
  dim: 'rgba(5,5,5,0.38)' as const,
  faint: 'rgba(5,5,5,0.15)' as const,
  trackingWide: '0.09em' as const,
  trackingNormal: '0.04em' as const,
  sz: {
    header: '18px' as const,
    body: '12px' as const,
    label: '10px' as const,
  },
} as const

// ─── 23-ITEM RATION MANIFEST ─────────────────────────────────────────────────
// Nomenclature + cadence only. COGS withheld per doctrine.

const MANIFEST = [
  { n: '01', item: 'WATER PURIFICATION TABLETS (30CT)',    cadence: 'MONTHLY'    },
  { n: '02', item: 'HIGH-CALORIE MEAL BARS (12CT)',        cadence: 'MONTHLY'    },
  { n: '03', item: 'ROLLED OATS (1KG)',                    cadence: 'MONTHLY'    },
  { n: '04', item: 'LONG-GRAIN WHITE RICE (500G)',         cadence: 'MONTHLY'    },
  { n: '05', item: 'SEA SALT (100G)',                      cadence: 'MONTHLY'    },
  { n: '06', item: 'OLIVE OIL SACHETS (6×25ML)',           cadence: 'MONTHLY'    },
  { n: '07', item: 'ELECTROLYTE POWDER (30 SACHETS)',      cadence: 'MONTHLY'    },
  { n: '08', item: 'VITAMIN C 1000MG (90CT)',              cadence: 'QUARTERLY'  },
  { n: '09', item: 'MULTIVITAMIN (30CT)',                  cadence: 'MONTHLY'    },
  { n: '10', item: 'MAGNESIUM GLYCINATE 400MG (90CT)',     cadence: 'QUARTERLY'  },
  { n: '11', item: 'ZINC 15MG (60CT)',                     cadence: 'BI-MONTHLY' },
  { n: '12', item: 'OMEGA-3 FISH OIL 1200MG (60CT)',       cadence: 'BI-MONTHLY' },
  { n: '13', item: 'PSYLLIUM HUSK FIBER (300G)',           cadence: 'MONTHLY'    },
  { n: '14', item: 'PROBIOTIC 10B CFU (30CT)',             cadence: 'MONTHLY'    },
  { n: '15', item: 'MELATONIN 0.5MG (30CT)',               cadence: 'MONTHLY'    },
  { n: '16', item: 'CAFFEINE 100MG TABLETS (30CT)',        cadence: 'MONTHLY'    },
  { n: '17', item: 'EMERGENCY GLUCOSE TABLETS (6CT)',      cadence: 'MONTHLY'    },
  { n: '18', item: 'ADHESIVE BANDAGES (10CT)',             cadence: 'MONTHLY'    },
  { n: '19', item: 'ANTISEPTIC WIPES (10CT)',              cadence: 'MONTHLY'    },
  { n: '20', item: 'N95 RESPIRATOR MASKS (5CT)',           cadence: 'MONTHLY'    },
  { n: '21', item: 'EMERGENCY THERMAL BLANKET',            cadence: 'ANNUAL'     },
  { n: '22', item: 'WATERPROOF FIRE STARTER',              cadence: 'ANNUAL'     },
  { n: '23', item: 'LOT® MANIFEST CARD (PRINTED)',         cadence: 'MONTHLY'    },
] as const

// ─── STATUS LINE ─────────────────────────────────────────────────────────────

type BasicsStatus = 'OPEN TAB' | 'PENDING' | 'ON STRENGTH' | 'STEADY STATE'

type StatusLineProps = {
  status: BasicsStatus
  build: string
}

const StatusLine: React.FC<StatusLineProps> = ({ status, build }) => (
  <div
    style={{
      fontFamily: T.mono,
      fontWeight: 700,
      backgroundColor: T.ink,
      color: T.ground,
      padding: '10px 24px',
      fontSize: T.sz.label,
      letterSpacing: T.trackingWide,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0 24px',
    }}
  >
    <span>STATUS: {status}</span>
    <span style={{ color: 'rgba(255,255,255,0.45)' }}>·</span>
    <span>PRICE: USD 100 / MO</span>
    <span style={{ color: 'rgba(255,255,255,0.45)' }}>·</span>
    <span>BUILD: {build}</span>
    <span style={{ color: 'rgba(255,255,255,0.45)' }}>·</span>
    <span>UPGRADE: M2</span>
  </div>
)

// ─── SECTION DIVIDER ─────────────────────────────────────────────────────────

const Rule: React.FC = () => (
  <div style={{ borderTop: T.rule }} />
)

// ─── BASICS TAB ──────────────────────────────────────────────────────────────

export const Basics: React.FC = () => {
  const build = 'M1 · 2026-06'

  return (
    <div
      style={{
        fontFamily: T.mono,
        fontWeight: 700,
        backgroundColor: T.ground,
        color: T.ink,
        border: T.rule,
        userSelect: 'none',
      }}
    >
      {/* ── OPEN TAB HEADER ─────────────────────────────────────────── */}
      <div style={{ padding: '20px 24px 16px', borderBottom: T.rule }}>
        <div
          style={{
            fontSize: T.sz.label,
            letterSpacing: T.trackingWide,
            color: T.dim,
            marginBottom: '6px',
          }}
        >
          LOT-FM-001 · BASIC MODULE · OPEN TAB
        </div>
        <div
          style={{
            fontSize: T.sz.header,
            letterSpacing: T.trackingNormal,
            lineHeight: 1.2,
          }}
        >
          LOT® BASIC
          <br />
          RATION SUBSCRIPTION
        </div>
      </div>

      {/* ── PRICE LINE ──────────────────────────────────────────────── */}
      <div
        style={{
          padding: '10px 24px',
          borderBottom: T.rule,
          fontSize: T.sz.body,
          letterSpacing: T.trackingWide,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 20px',
        }}
      >
        <span>USD 100 / MONTH</span>
        <span style={{ color: T.dim }}>·</span>
        <span>ISSUED ON CADENCE</span>
        <span style={{ color: T.dim }}>·</span>
        <span>≥60% MARGIN</span>
        <span style={{ color: T.dim }}>·</span>
        <span>≤USD 40 LANDED</span>
      </div>

      {/* ── DOCTRINE ────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 24px', borderBottom: T.rule }}>
        <div
          style={{
            fontSize: T.sz.label,
            letterSpacing: T.trackingWide,
            color: T.dim,
            marginBottom: '10px',
          }}
        >
          DOCTRINE
        </div>
        <div
          style={{
            fontSize: T.sz.body,
            lineHeight: 1.7,
            letterSpacing: T.trackingNormal,
            maxWidth: '580px',
          }}
        >
          LOT® issues physical rations to members on strength.
          This is sustenance — not a subscription box, not a lifestyle brand.
          Every item earns its place in the load. Margin is published, not hidden.
          The ledger is the marketing. No layer between public and manifest.
          No substitutions. No refunds. Stand down to exit.
        </div>
      </div>

      {/* ── 23-ITEM MANIFEST ────────────────────────────────────────── */}
      <div style={{ padding: '16px 24px', borderBottom: T.rule }}>
        {/* Manifest header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            fontSize: T.sz.label,
            letterSpacing: T.trackingWide,
            color: T.dim,
            paddingBottom: '8px',
            borderBottom: T.ruleLight,
            marginBottom: '4px',
          }}
        >
          <span>23-ITEM MANIFEST · NOMENCLATURE</span>
          <span>CADENCE</span>
        </div>

        {/* Manifest rows */}
        {MANIFEST.map((row) => (
          <div
            key={row.n}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontSize: T.sz.body,
              letterSpacing: T.trackingNormal,
              lineHeight: 1.85,
              borderBottom: T.ruleLight,
            }}
          >
            <span
              style={{
                color: T.faint,
                minWidth: '28px',
                flexShrink: 0,
                fontSize: '10px',
              }}
            >
              {row.n}
            </span>
            <span style={{ flex: 1 }}>{row.item}</span>
            <span
              style={{
                color: T.dim,
                minWidth: '96px',
                textAlign: 'right',
                flexShrink: 0,
                fontSize: '10px',
                letterSpacing: T.trackingWide,
              }}
            >
              {row.cadence}
            </span>
          </div>
        ))}

        {/* COGS notice */}
        <div
          style={{
            marginTop: '12px',
            fontSize: T.sz.label,
            letterSpacing: T.trackingWide,
            color: T.dim,
          }}
        >
          COGS WITHHELD PER DOCTRINE · MARGIN VERIFIED ≥60% INTERNALLY
        </div>
      </div>

      {/* ── STATUS LINE ─────────────────────────────────────────────── */}
      <StatusLine status="OPEN TAB" build={build} />
    </div>
  )
}
