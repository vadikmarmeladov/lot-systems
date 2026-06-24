/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * BASICS TAB — LOT-FM-001 / MONTH 1
 * OPEN TAB: 23-item ration ledger, doctrine, status line.
 * READ ONLY. A stranger can read what LOT issues and on what terms.
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'

// ─── MANIFEST ────────────────────────────────────────────────────────────────
// 23-item civilian ration load. Cadence: MONTHLY / BI-MONTHLY / QUARTERLY.
// COGS withheld. The ledger is the contract.

type RationItem = {
  no: string
  nomenclature: string
  cadence: 'MONTHLY' | 'BI-MONTHLY' | 'QUARTERLY'
}

const RATION_MANIFEST: RationItem[] = [
  { no: '01', nomenclature: 'COFFEE, GROUND DARK ROAST 12OZ',       cadence: 'MONTHLY'    },
  { no: '02', nomenclature: 'OATS, ROLLED WHOLE GRAIN 2LB',         cadence: 'MONTHLY'    },
  { no: '03', nomenclature: 'RICE, LONG GRAIN WHITE 5LB',           cadence: 'MONTHLY'    },
  { no: '04', nomenclature: 'LENTILS, GREEN DRY 1LB',               cadence: 'MONTHLY'    },
  { no: '05', nomenclature: 'TUNA, CHUNK LIGHT CANNED 5OZ×6',       cadence: 'MONTHLY'    },
  { no: '06', nomenclature: 'PASTA, SEMOLINA 1LB',                  cadence: 'MONTHLY'    },
  { no: '07', nomenclature: 'TOMATOES, CRUSHED CANNED 28OZ×2',      cadence: 'MONTHLY'    },
  { no: '08', nomenclature: 'OLIVE OIL, EXTRA VIRGIN 16FLOZ',       cadence: 'MONTHLY'    },
  { no: '09', nomenclature: 'NUTS, MIXED UNSALTED 1LB',             cadence: 'MONTHLY'    },
  { no: '10', nomenclature: 'DRIED FRUIT, MIXED 8OZ',               cadence: 'MONTHLY'    },
  { no: '11', nomenclature: 'DARK CHOCOLATE, 85% CACAO 3.5OZ×3',    cadence: 'MONTHLY'    },
  { no: '12', nomenclature: 'PROTEIN BAR, MIXED 12CT',              cadence: 'MONTHLY'    },
  { no: '13', nomenclature: 'WHEY PROTEIN ISOLATE 2LB',             cadence: 'MONTHLY'    },
  { no: '14', nomenclature: 'ELECTROLYTE SACHETS 30CT',             cadence: 'MONTHLY'    },
  { no: '15', nomenclature: 'GREEN TEA, WHOLE LEAF 2OZ',            cadence: 'MONTHLY'    },
  { no: '16', nomenclature: 'HONEY, RAW UNFILTERED 12OZ',           cadence: 'BI-MONTHLY' },
  { no: '17', nomenclature: 'COCONUT OIL, REFINED 14FLOZ',          cadence: 'BI-MONTHLY' },
  { no: '18', nomenclature: 'SALT, IODIZED 26OZ',                   cadence: 'QUARTERLY'  },
  { no: '19', nomenclature: 'BLACK PEPPER, GROUND 4OZ',             cadence: 'QUARTERLY'  },
  { no: '20', nomenclature: 'MULTIVITAMIN, DAILY 90CT',             cadence: 'QUARTERLY'  },
  { no: '21', nomenclature: 'VITAMIN D3, 2000IU 90CT',              cadence: 'QUARTERLY'  },
  { no: '22', nomenclature: 'MAGNESIUM GLYCINATE, 400MG 90CT',      cadence: 'QUARTERLY'  },
  { no: '23', nomenclature: 'OMEGA-3, FISH OIL 1000MG 90CT',        cadence: 'QUARTERLY'  },
]

const DOCTRINE_LINES = [
  'LOT ISSUES. YOU RECEIVE.',
  'THIS IS NOT A STORE. THIS IS A LOAD.',
  'ONE PLAN. ONE PRICE. NO SUBSTITUTIONS.',
  'THE LEDGER IS THE CONTRACT.',
  'SUBSCRIBE AND BE ON STRENGTH.',
]

const TERMS_ROWS = [
  { label: 'RATE',      value: '$100.00/MONTH'       },
  { label: 'BILLING',   value: 'RECURRING, ADDITIVE'  },
  { label: 'CADENCE',   value: 'MONTHLY DISPATCH'     },
  { label: 'COGS',      value: 'WITHHELD'             },
  { label: 'MARGIN',    value: 'WITHHELD'             },
]

// ─── TERMINAL DESIGN TOKENS ───────────────────────────────────────────────────
// IBM 3270 register. LiberationMono-Bold. 80-column cap. 2px rules.
// These constants are the established grid for Months 2 and 3.

const BASICS_STYLE = {
  fontFamily: 'ui-monospace, "Liberation Mono", Consolas, "Courier New", monospace',
  fontSize: '13px',
  lineHeight: '20px',
  letterSpacing: '0',
  '--basics-col-no': '3ch',
  '--basics-col-cadence': '12ch',
  '--basics-rule': '2px',
  '--basics-max-cols': '80ch',
} as React.CSSProperties

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-8 py-4 text-bac bg-acc font-bold uppercase tracking-widest"
      style={{ fontSize: '11px', letterSpacing: '0.12em' }}
    >
      {children}
    </div>
  )
}

function SectionBox({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border-2 border-acc mb-32 ${className}`}>
      {children}
    </div>
  )
}

function StatusLine() {
  return (
    <div
      className="flex items-center justify-between bg-acc text-bac border-b-2 border-acc px-8 py-6 font-bold uppercase"
      style={{ fontSize: '11px', letterSpacing: '0.12em' }}
    >
      <span>LOT® BASIC</span>
      <span>OPEN TAB</span>
      <span>$100.00/MO</span>
    </div>
  )
}

function ManifestLedger() {
  return (
    <SectionBox>
      <SectionHeader>
        <div className="flex justify-between">
          <span>LOT-FM-001 / MANIFEST — 23 ITEMS</span>
          <span>CADENCE</span>
        </div>
      </SectionHeader>
      <div className="border-t-2 border-acc">
        {RATION_MANIFEST.map((item, i) => (
          <div
            key={item.no}
            className={`flex items-baseline px-8 py-4 ${
              i < RATION_MANIFEST.length - 1
                ? 'border-b border-acc/20'
                : ''
            }`}
          >
            <span
              className="shrink-0 mr-16"
              style={{ width: '3ch', opacity: 0.4 }}
            >
              {item.no}
            </span>
            <span className="flex-1">{item.nomenclature}</span>
            <span
              className="shrink-0 ml-16"
              style={{
                width: '12ch',
                textAlign: 'right',
                opacity: item.cadence === 'MONTHLY' ? 0.7 : 1,
                fontWeight: item.cadence !== 'MONTHLY' ? 700 : 400,
              }}
            >
              {item.cadence}
            </span>
          </div>
        ))}
      </div>
    </SectionBox>
  )
}

function DoctrineBlock() {
  return (
    <SectionBox>
      <SectionHeader>LOT-FM-001 / DOCTRINE</SectionHeader>
      <div className="px-8 pt-8 pb-8">
        {DOCTRINE_LINES.map((line, i) => (
          <div key={i} className="py-2">
            {line}
          </div>
        ))}
      </div>
    </SectionBox>
  )
}

function TermsBlock() {
  return (
    <SectionBox>
      <SectionHeader>TERMS</SectionHeader>
      <div>
        {TERMS_ROWS.map((row, i) => (
          <div
            key={row.label}
            className={`flex justify-between px-8 py-4 ${
              i < TERMS_ROWS.length - 1 ? 'border-b border-acc/20' : ''
            }`}
          >
            <span style={{ opacity: 0.5 }}>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
    </SectionBox>
  )
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function Basics() {
  const isMirrorOn = useStore(stores.isMirrorOn)

  return (
    <div
      style={BASICS_STYLE}
      className={`pb-96 ${isMirrorOn ? 'text-white' : ''}`}
    >
      {/* Status line — inverted header */}
      <div
        className="-mx-16 phone:-mx-32 tablet:-mx-48 desktop:-mx-64 -mt-16 phone:-mt-32 tablet:-mt-48 desktop:-mt-64 mb-32"
      >
        <StatusLine />
      </div>

      {/* 80-column cap for terminal register feel */}
      <div style={{ maxWidth: '80ch' }}>
        <DoctrineBlock />
        <ManifestLedger />
        <TermsBlock />

        {/* Footer stamp */}
        <div
          className="border-t-2 border-acc pt-8"
          style={{ opacity: 0.4, fontSize: '11px', letterSpacing: '0.08em' }}
        >
          LOT-FM-001 REV A · BASICS M1 · OPEN TAB · READ ONLY · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}
