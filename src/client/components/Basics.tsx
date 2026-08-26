/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { Page, StatusLine } from '#client/components/ui'
import { cn } from '#client/utils'
import { useDocumentTitle } from '#client/utils/hooks'

/**
 * MODULE: BASIC (RATION) — OPEN TAB
 * LOT-FM-001 / SELF-ASSEMBLY DIRECTIVE — MONTH 1: LEDGER & DOCTRINE
 *
 * Public read-only surface. No login required, no purchase flow, no
 * upgrade control — those are Month 2 (roster/billing) and Month 3
 * (fulfillment) scope. This tab is the manifest. The ledger is the
 * marketing: no layer between what a stranger reads and what LOT issues.
 */

type Cadence = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY'

type RationItem = {
  nomenclature: string
  cadence: Cadence
}

// 23-item ration load. Nomenclature + cadence only — COGS withheld.
// Margin data does not belong on a public surface.
const RATION_MANIFEST: RationItem[] = [
  { nomenclature: 'RAZOR, DISPOSABLE, 3-BLADE', cadence: 'WEEKLY' },
  { nomenclature: 'FLOSS, WAXED, MINT', cadence: 'WEEKLY' },
  { nomenclature: 'SOAP BAR, UNSCENTED', cadence: 'WEEKLY' },
  { nomenclature: 'NOTEPAD, POCKET, 3X5', cadence: 'WEEKLY' },
  { nomenclature: 'GUM, SUGAR-FREE, 12-PACK', cadence: 'WEEKLY' },
  { nomenclature: 'TOOTHBRUSH, SOFT BRISTLE', cadence: 'MONTHLY' },
  { nomenclature: 'TOOTHPASTE, FLUORIDE, TRAVEL', cadence: 'MONTHLY' },
  { nomenclature: 'DEODORANT, UNSCENTED, STICK', cadence: 'MONTHLY' },
  { nomenclature: 'UNDERWEAR, COTTON, 3-PACK', cadence: 'MONTHLY' },
  { nomenclature: 'SOCKS, CREW, 3-PACK', cadence: 'MONTHLY' },
  { nomenclature: 'LAUNDRY DETERGENT, POD, 20-CT', cadence: 'MONTHLY' },
  { nomenclature: 'DISH SOAP, CONCENTRATE', cadence: 'MONTHLY' },
  { nomenclature: 'PAPER TOWEL, 2-ROLL', cadence: 'MONTHLY' },
  { nomenclature: 'TOILET PAPER, 4-ROLL', cadence: 'MONTHLY' },
  { nomenclature: 'HAND SANITIZER, 2OZ', cadence: 'MONTHLY' },
  { nomenclature: 'BATTERIES, AA, 4-PACK', cadence: 'MONTHLY' },
  { nomenclature: 'LIGHTER, DISPOSABLE', cadence: 'MONTHLY' },
  { nomenclature: 'NAIL CLIPPER SET', cadence: 'QUARTERLY' },
  { nomenclature: 'SEWING KIT, TRAVEL', cadence: 'QUARTERLY' },
  { nomenclature: 'FIRST-AID KIT, COMPACT', cadence: 'QUARTERLY' },
  { nomenclature: 'FLASHLIGHT, LED, HANDHELD', cadence: 'QUARTERLY' },
  { nomenclature: 'MULTI-TOOL, FOLDING', cadence: 'QUARTERLY' },
  { nomenclature: 'NOTEBOOK, HARDBOUND, RULED', cadence: 'QUARTERLY' },
]

const CADENCE_ORDER: Cadence[] = ['WEEKLY', 'MONTHLY', 'QUARTERLY']

const RULE = 'border-acc'

const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('border-2', RULE, 'p-16 phone:p-24', className)}>
    {children}
  </div>
)

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-acc text-bac font-mono font-bold uppercase tracking-wide text-[12px] px-8 py-4 -mt-16 phone:-mt-24 -ml-16 phone:-ml-24 mb-16 inline-block">
    {children}
  </div>
)

const CadenceBand: React.FC<{ cadence: Cadence; items: RationItem[] }> = ({
  cadence,
  items,
}) => (
  <div className="border-2 border-acc border-t-0 first:border-t-2">
    <div className="bg-acc text-bac font-mono font-bold uppercase tracking-wide text-[12px] px-8 py-4">
      CAD: {cadence} — {items.length} ITEM{items.length === 1 ? '' : 'S'}
    </div>
    <table className="w-full font-mono text-[13px] leading-[1.5] border-collapse">
      <tbody>
        {items.map((item, i) => (
          <tr key={item.nomenclature} className={cn(i > 0 && 'border-t-2', RULE)}>
            <td className="px-8 py-6 border-r-2 border-acc w-[52px] text-right tabular-nums opacity-60">
              {String(i + 1).padStart(2, '0')}
            </td>
            <td className="px-8 py-6 uppercase">{item.nomenclature}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const Basics: React.FC = () => {
  useDocumentTitle('Basics')

  return (
    <Page className="font-mono">
      <div className="flex flex-col gap-y-24 max-w-[720px]">
        <StatusLine
          fields={['STATUS: OPEN TAB', 'CADENCE: WEEKLY/MONTHLY/QUARTERLY', 'RATE: $100/MO']}
        />

        <Section>
          <SectionLabel>DOCTRINE</SectionLabel>
          <div className="flex flex-col gap-y-8 uppercase text-[13px] leading-[1.5] tracking-wide">
            <div>LOT ISSUES A PHYSICAL RATION TO EVERY SUBSCRIBER ON STRENGTH.</div>
            <div>ISSUE, NOT SALE. THE OPERATOR IS ON STRENGTH — NOT A CUSTOMER.</div>
            <div>TWENTY-THREE ITEMS. FIXED NOMENCLATURE. FIXED CADENCE.</div>
            <div>THIS TAB IS THE MANIFEST. NOTHING IS ISSUED THAT IS NOT LISTED BELOW.</div>
          </div>
        </Section>

        <Section>
          <SectionLabel>ISSUE RATE</SectionLabel>
          <div className="font-mono font-bold text-[20px] tracking-wide">
            $100.00 / MONTH
          </div>
          <div className="mt-8 text-[13px] opacity-60 uppercase tracking-wide">
            RECURRING. NO TIER. NO DISCOUNT SCHEDULE.
          </div>
        </Section>

        <div>
          <SectionLabel>RATION MANIFEST — 23 ITEMS</SectionLabel>
          <div className="flex flex-col">
            {CADENCE_ORDER.map((cadence) => (
              <CadenceBand
                key={cadence}
                cadence={cadence}
                items={RATION_MANIFEST.filter((item) => item.cadence === cadence)}
              />
            ))}
          </div>
        </div>

        <div className="text-[12px] opacity-40 uppercase tracking-wide pt-8">
          COST OF GOODS WITHHELD FROM PUBLIC MANIFEST. UPGRADE + FULFILLMENT
          CONTROLS NOT YET ISSUED — READ-ONLY, THIS TAB, THIS PHASE.
        </div>
      </div>
    </Page>
  )
}
