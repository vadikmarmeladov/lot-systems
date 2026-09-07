/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useDocumentTitle } from '#client/utils/hooks'

/**
 * BASIC — the hardware/physical ration tier of the LOT system, issued on
 * top of LOT Usership (the AI plan). This is the "OPEN TAB": a read-only
 * public ledger of what LOT issues and on what terms, per LOT-FM-001.
 *
 * House style is scoped to this surface only and deliberately breaks from
 * the rest of the app's rounded, --acc-themed design system: monospace,
 * white ground / black ink, inversion-only hierarchy, 2px rules, square
 * corners, fixed character grid. See docs/corporate/LOT-FM-001-BASIC-RATION.md.
 */

const MONO = 'font-[Liberation_Mono,Courier_New,Consolas,monospace] font-bold'

type LoadItem = {
  no: string
  nomenclature: string
  cadence: string
}

// Nomenclature + cadence only. Landed cost is S-2-restricted — see
// LOT-FM-001 §2. Never render COGS on this surface, public or in-app.
const LOAD: LoadItem[] = [
  { no: '01', nomenclature: 'Ration manifest card, printed', cadence: 'MONTHLY' },
  { no: '02', nomenclature: 'Toothbrush, compact, replaceable head', cadence: 'QUARTERLY' },
  { no: '03', nomenclature: 'Toothpaste, travel tube', cadence: 'MONTHLY' },
  { no: '04', nomenclature: 'Soap, bar, unscented', cadence: 'MONTHLY' },
  { no: '05', nomenclature: 'Razor cartridge, single-blade', cadence: 'MONTHLY' },
  { no: '06', nomenclature: 'Deodorant, stick, travel', cadence: 'BI-MONTHLY' },
  { no: '07', nomenclature: 'Nail clipper', cadence: 'ANNUAL' },
  { no: '08', nomenclature: 'Cotton swabs, 50ct', cadence: 'QUARTERLY' },
  { no: '09', nomenclature: 'Dental floss, spool', cadence: 'BI-MONTHLY' },
  { no: '10', nomenclature: 'Hand sanitizer, travel', cadence: 'MONTHLY' },
  { no: '11', nomenclature: 'Adhesive bandages, 10ct', cadence: 'QUARTERLY' },
  { no: '12', nomenclature: 'Vitamin D3, 30ct blister', cadence: 'MONTHLY' },
  { no: '13', nomenclature: 'Electrolyte packets, 10ct', cadence: 'MONTHLY' },
  { no: '14', nomenclature: 'Socks, 1 pair, LOT-marked', cadence: 'QUARTERLY' },
  { no: '15', nomenclature: 'Badge pin, enamel, seasonal', cadence: 'QUARTERLY' },
  { no: '16', nomenclature: 'Notebook, pocket, grid-ruled', cadence: 'SEMIANNUAL' },
  { no: '17', nomenclature: 'Pen, LOT-marked, black ink', cadence: 'SEMIANNUAL' },
  { no: '18', nomenclature: 'Earplugs, foam, 3 sets', cadence: 'MONTHLY' },
  { no: '19', nomenclature: 'Sleep mask', cadence: 'ANNUAL' },
  { no: '20', nomenclature: 'Multi-tool, card-sized', cadence: 'ANNUAL' },
  { no: '21', nomenclature: 'USB-C cable, charge/data', cadence: 'ANNUAL' },
  { no: '22', nomenclature: 'Coffee, instant, 10 sachets', cadence: 'MONTHLY' },
  { no: '23', nomenclature: 'Fulfillment: mailer, void-fill, label, freight', cadence: 'MONTHLY' },
]

const Rule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`h-[2px] bg-[#000] ${className || ''}`} />
)

const StatusLine: React.FC = () => (
  <div className={`${MONO} flex flex-wrap justify-between gap-x-16 gap-y-4 text-[13px] uppercase tracking-wide py-8`}>
    <span>DOC: LOT-FM-001</span>
    <span>TAB: BASIC / OPEN</span>
    <span>MODE: READ-ONLY</span>
    <span>REV: A</span>
  </div>
)

export function Basics({ standalone = false }: { standalone?: boolean }) {
  useDocumentTitle('Basics')

  return (
    <div
      className={`${MONO} bg-[#fff] text-[#000] ${standalone ? 'min-h-[100dvh] px-16 py-24 phone:px-32 phone:py-32' : ''}`}
    >
      <div className="max-w-[720px] mx-auto">
        <Rule />
        <StatusLine />
        <Rule className="mb-16" />

        <h1 className="text-[22px] uppercase tracking-wide mb-8">
          BASIC RATION
        </h1>
        <div className="text-[13px] uppercase tracking-wide opacity-60 mb-24">
          Hardware issue for LOT Usership members
        </div>

        <div className="text-[14px] leading-[1.6] mb-24">
          LOT issues. LOT does not sell. USERSHIP carries the mind — the AI
          plan. BASIC carries the kit — the recurring physical load that
          keeps a member equipped. A subscriber is not a customer; a
          subscriber is ON STRENGTH, carried on a roster, issued a standing
          load against a fixed monthly cadence.
        </div>

        <Rule />
        <div className="flex justify-between items-baseline py-12">
          <span className="uppercase text-[13px] tracking-wide">Issue rate</span>
          <span className="text-[20px]">USD 100.00 / MO</span>
        </div>
        <Rule />
        <div className="grid grid-cols-2 phone:grid-cols-4 gap-y-8 text-[12px] uppercase tracking-wide py-12">
          <div>
            <div className="opacity-50">Billing</div>
            <div>Monthly, additive</div>
          </div>
          <div>
            <div className="opacity-50">Minimum term</div>
            <div>None</div>
          </div>
          <div>
            <div className="opacity-50">Eligibility</div>
            <div>Usership (AI)</div>
          </div>
          <div>
            <div className="opacity-50">Downgrade</div>
            <div>Stand down, any time</div>
          </div>
        </div>
        <Rule className="mb-24" />

        <h2 className="text-[15px] uppercase tracking-wide mb-4">
          The load — 23 items
        </h2>
        <div className="text-[12px] uppercase tracking-wide opacity-50 mb-12">
          Nomenclature and cadence. Landed cost withheld — see doctrine.
        </div>

        <div className="border-2 border-[#000]">
          <div className="grid grid-cols-[40px_1fr_110px] bg-[#000] text-[#fff] text-[12px] uppercase tracking-wide">
            <div className="p-8 border-r-2 border-[#fff]">No.</div>
            <div className="p-8 border-r-2 border-[#fff]">Nomenclature</div>
            <div className="p-8">Cadence</div>
          </div>
          {LOAD.map((item, i) => (
            <div
              key={item.no}
              className={`grid grid-cols-[40px_1fr_110px] text-[13px] ${
                i !== LOAD.length - 1 ? 'border-b-2 border-[#000]' : ''
              }`}
            >
              <div className="p-8 border-r-2 border-[#000] opacity-60">{item.no}</div>
              <div className="p-8 border-r-2 border-[#000]">{item.nomenclature}</div>
              <div className="p-8 uppercase">{item.cadence}</div>
            </div>
          ))}
        </div>

        <div className="text-[12px] uppercase tracking-wide opacity-50 mt-8 mb-24">
          Load rotates monthly — quarterly/semiannual/annual items cycle in
          on schedule. The box is not identical two months running.
        </div>

        <Rule />
        <div className="py-16 text-[13px] leading-[1.6]">
          <div className="uppercase tracking-wide mb-4">Status</div>
          <div className="opacity-70">
            OPEN TAB is live and read-only. UPGRADE (roster intake, billing,
            STAND DOWN) and ISSUE (first box shipped, issue log) are staged
            for the next two build cycles under this same designation —
            see LOT-FM-001.
          </div>
        </div>
        <Rule className="mb-24" />

        <div className="text-[11px] uppercase tracking-wide opacity-40 pb-24">
          LOT Systems Corporation · brand.lot-systems.com
        </div>
      </div>
    </div>
  )
}
