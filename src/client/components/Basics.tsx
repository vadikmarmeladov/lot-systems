/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useDocumentTitle } from '#client/utils/hooks'

// LOT-FM-001 / BASIC (RATION) MODULE — MONTH 1 OF 3: OPEN TAB
//
// This tab is deliberately NOT themed through the app's acc/bac tokens.
// House style for a field manual is fixed, not adaptive: white ground,
// black ink, square corners, 2px rule weight, monospace register — the
// same page whether the rest of the app is running dark, light, or mirror.
//
// Cadence codes: M = every issue. Q = every 3rd issue. S = every 6th issue.
type Cadence = 'M' | 'Q' | 'S'

const CADENCE_LABEL: Record<Cadence, string> = {
  M: 'MONTHLY',
  Q: 'QUARTERLY',
  S: 'SEMI-ANNUAL',
}

const MANIFEST: { no: number; nomenclature: string; cadence: Cadence }[] = [
  { no: 1, nomenclature: 'NOTEBOOK, FIELD, POCKET, ISSUE', cadence: 'M' },
  { no: 2, nomenclature: 'PEN, BALLPOINT, BLACK, ISSUE', cadence: 'M' },
  { no: 3, nomenclature: 'NOTEBOOK REFILL, POCKET', cadence: 'M' },
  { no: 4, nomenclature: 'CARD, MANIFEST, PRINTED, ISSUE', cadence: 'M' },
  { no: 5, nomenclature: 'SEAL, TAMPER-EVIDENT, ISSUE BOX', cadence: 'M' },
  { no: 6, nomenclature: 'STICKER SHEET, LOT MARKINGS', cadence: 'M' },
  { no: 7, nomenclature: 'CLOTH, MICROFIBER, LENS/SCREEN', cadence: 'M' },
  { no: 8, nomenclature: 'WIPES, ISOPROPYL, INDIVIDUAL, PACK OF 10', cadence: 'M' },
  { no: 9, nomenclature: 'CABLE, USB-C TO USB-C, 1M', cadence: 'Q' },
  { no: 10, nomenclature: 'CABLE, USB-C TO LIGHTNING, 1M', cadence: 'Q' },
  { no: 11, nomenclature: 'ADAPTER, USB-C TO USB-A', cadence: 'Q' },
  { no: 12, nomenclature: 'BATTERY, CR2032, PACK OF 2', cadence: 'Q' },
  { no: 13, nomenclature: 'BATTERY, AA, PACK OF 4', cadence: 'Q' },
  { no: 14, nomenclature: 'POUCH, EDC, CANVAS, BLACK', cadence: 'Q' },
  { no: 15, nomenclature: 'PATCH, LOT INSIGNIA, WOVEN', cadence: 'Q' },
  { no: 16, nomenclature: 'TAPE, ELECTRICAL, BLACK', cadence: 'Q' },
  { no: 17, nomenclature: 'ZIP TIES, BLACK, PACK OF 10', cadence: 'Q' },
  { no: 18, nomenclature: 'LABEL SET, CABLE ID', cadence: 'Q' },
  { no: 19, nomenclature: 'BAND, WATCH, SILICONE, BLACK', cadence: 'S' },
  { no: 20, nomenclature: 'POWER BANK, 5000MAH', cadence: 'S' },
  { no: 21, nomenclature: 'CASE, SD / MICRO-SD, HARD', cadence: 'S' },
  { no: 22, nomenclature: 'LANYARD, LOT ISSUE, BLACK', cadence: 'S' },
  { no: 23, nomenclature: 'PENCIL, MECHANICAL, 0.5MM, ISSUE', cadence: 'S' },
]

function Rule() {
  return <div className="border-t-2 border-black-total" />
}

function StatusLine() {
  // IBM 3270 register: fixed-width label:value pairs, one row, no wrap.
  const fields: [string, string][] = [
    ['MODULE', 'BASIC (RATION)'],
    ['BUILD', 'MONTH 1 / 3'],
    ['STATUS', 'LEDGER LIVE'],
    ['INTAKE', 'CLOSED'],
    ['ON STRENGTH', '000'],
  ]
  return (
    <div className="border-2 border-black-total overflow-x-auto">
      <div className="flex divide-x-2 divide-black-total min-w-max">
        {fields.map(([label, value]) => (
          <div key={label} className="px-12 py-8 whitespace-nowrap">
            <span className="text-[11px] opacity-60">{label}:</span>{' '}
            <span className="font-bold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Basics() {
  useDocumentTitle('LOT — BASIC')

  return (
    <div className="font-mono font-bold bg-white text-black-total -mx-16 -mt-16 phone:-mx-32 phone:-mt-32 tablet:-mx-48 tablet:-mt-48 desktop:-mx-64 desktop:-mt-64 px-16 py-16 phone:px-32 phone:py-32 tablet:px-48 tablet:py-48 desktop:px-64 desktop:py-64 pb-[140px]">
      <div className="max-w-[720px] mx-auto flex flex-col gap-y-24">
        <div>
          <div className="text-[11px] opacity-60 mb-4">LOT-FM-001 · BASIC (RATION) MODULE</div>
          <h1 className="text-2xl tracking-tight">OPEN TAB</h1>
        </div>

        <StatusLine />

        {/* DOCTRINE */}
        <section className="flex flex-col gap-y-8">
          <div className="text-[11px] opacity-60">DOCTRINE</div>
          <Rule />
          <p className="text-sm leading-relaxed">
            BASIC is not a box. It is a ration — a fixed physical load, issued
            monthly, engineered to keep the operator equipped. There is no
            tier, no bundle, no upsell inside the load. What is issued is
            what is listed below. Nothing more is implied and nothing less
            is shipped.
          </p>
          <p className="text-sm leading-relaxed">
            The user is not a customer. The user is ON STRENGTH. LOT issues;
            it does not sell. The ledger below is the complete public
            manifest — nomenclature and cadence, in full. Landed cost is
            withheld; margin is LOT's business, not the operator's.
          </p>
        </section>

        {/* PRICE LINE */}
        <section className="border-2 border-black-total px-16 py-12 flex items-baseline justify-between flex-wrap gap-8">
          <span className="text-lg">$100 / MO</span>
          <span className="text-[11px] opacity-60">
            BILLED MONTHLY · ADDITIVE TO USERSHIP (AI) · STAND DOWN ANY CYCLE
          </span>
        </section>

        {/* MANIFEST */}
        <section className="flex flex-col gap-y-8">
          <div className="text-[11px] opacity-60">MANIFEST — 23 ITEMS / ISSUE CYCLE</div>
          <Rule />
          <div className="border-2 border-black-total overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b-2 border-black-total text-left">
                  <th className="px-8 py-6 w-[48px] font-bold">NO.</th>
                  <th className="px-8 py-6 font-bold">NOMENCLATURE</th>
                  <th className="px-8 py-6 w-[140px] font-bold">CADENCE</th>
                </tr>
              </thead>
              <tbody>
                {MANIFEST.map((item) => (
                  <tr key={item.no} className="border-b border-black-total/20 last:border-b-0">
                    <td className="px-8 py-6 opacity-60">{String(item.no).padStart(2, '0')}</td>
                    <td className="px-8 py-6">{item.nomenclature}</td>
                    <td className="px-8 py-6 opacity-60">{CADENCE_LABEL[item.cadence]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] opacity-60">
            M = every issue · Q = every 3rd issue · S = every 6th issue.
            Load composition may be substituted item-for-item at LOT's
            discretion to hold the manifest within cost ceiling; cadence and
            item count do not change.
          </p>
        </section>

        {/* UPGRADE PATH — STATE MACHINE PREVIEW, NOT YET LIVE */}
        <section className="flex flex-col gap-y-8">
          <div className="text-[11px] opacity-60">UPGRADE — USERSHIP (AI) → BASIC</div>
          <Rule />
          <div className="border-2 border-black-total overflow-x-auto">
            <div className="flex divide-x-2 divide-black-total min-w-max text-[11px]">
              {['USERSHIP / AI', 'PENDING', 'ON STRENGTH', 'STEADY STATE'].map(
                (stage, i) => (
                  <div
                    key={stage}
                    className={
                      'px-12 py-8 whitespace-nowrap ' +
                      (i === 0 ? 'bg-black-total text-white' : 'opacity-40')
                    }
                  >
                    {stage}
                  </div>
                )
              )}
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            Roster intake, recurring billing, and STAND DOWN (drop ration,
            retain AI) are not yet open. This tab is read-only for Month 1 of
            the build. Intake opens Month 2.
          </p>
          <button
            disabled
            className="border-2 border-black-total px-16 py-10 text-sm self-start opacity-40 cursor-not-allowed"
          >
            UPGRADE — INTAKE NOT YET OPEN
          </button>
        </section>
      </div>
    </div>
  )
}
