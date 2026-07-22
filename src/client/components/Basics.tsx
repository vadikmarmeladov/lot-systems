/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { GhostButton, Page } from '#client/components/ui'
import { cn } from '#client/utils'
import { useDocumentTitle } from '#client/utils/hooks'

/**
 * LOT-FM-001 / BASIC RATION — MONTH 1: LEDGER & DOCTRINE
 * Public OPEN TAB. Read-only. No auth required, no billing wired.
 * Renders the 23-item ration manifest (nomenclature + cadence; COGS
 * withheld per doctrine) and the doctrine/price/status lines that
 * accompany it. UPGRADE (M2) and ISSUE/FULFILLMENT (M3) land later.
 */

type RationItem = {
  no: number
  nomenclature: string
  cadence: 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY'
}

type RationCategory = {
  label: string
  items: RationItem[]
}

const RATION_LOAD: RationCategory[] = [
  {
    label: 'HYGIENE',
    items: [
      { no: 1, nomenclature: 'TOOTHPASTE, TRAVEL, 50ML', cadence: 'MONTHLY' },
      { no: 2, nomenclature: 'TOOTHBRUSH, SOFT, REPLACEMENT', cadence: 'MONTHLY' },
      { no: 3, nomenclature: 'SOAP BAR, UNSCENTED, 100G', cadence: 'MONTHLY' },
      { no: 4, nomenclature: 'DEODORANT, STICK, UNSCENTED', cadence: 'MONTHLY' },
      { no: 5, nomenclature: 'RAZOR, DISPOSABLE, 3-PACK', cadence: 'MONTHLY' },
      { no: 6, nomenclature: 'FLOSS, WAXED, 50M', cadence: 'BIMONTHLY' },
    ],
  },
  {
    label: 'APPAREL / SOFT GOODS',
    items: [
      { no: 7, nomenclature: 'SOCKS, CREW, BLACK, PAIR', cadence: 'MONTHLY' },
      { no: 8, nomenclature: 'UNDERSHIRT, COTTON, WHITE', cadence: 'QUARTERLY' },
      { no: 9, nomenclature: 'HANDKERCHIEF, COTTON, SET OF 2', cadence: 'QUARTERLY' },
      { no: 10, nomenclature: 'TOWEL, MICROFIBER, COMPACT', cadence: 'QUARTERLY' },
    ],
  },
  {
    label: 'FIELD STATIONERY',
    items: [
      { no: 11, nomenclature: 'NOTEBOOK, POCKET, GRID, 96PP', cadence: 'MONTHLY' },
      { no: 12, nomenclature: 'PEN, GEL, BLACK, 2-PACK', cadence: 'MONTHLY' },
      { no: 13, nomenclature: 'PENCIL, MECHANICAL, 0.5MM', cadence: 'QUARTERLY' },
      { no: 14, nomenclature: 'ENVELOPE, MANILA, SET OF 5', cadence: 'QUARTERLY' },
    ],
  },
  {
    label: 'POWER & MAINTENANCE',
    items: [
      { no: 15, nomenclature: 'BATTERIES, AA, 4-PACK', cadence: 'MONTHLY' },
      { no: 16, nomenclature: 'BATTERIES, AAA, 4-PACK', cadence: 'MONTHLY' },
      { no: 17, nomenclature: 'CABLE, USB-C, 1M', cadence: 'QUARTERLY' },
      { no: 18, nomenclature: 'LIGHTER, REFILLABLE', cadence: 'QUARTERLY' },
    ],
  },
  {
    label: 'SUSTENANCE',
    items: [
      { no: 19, nomenclature: 'COFFEE, INSTANT, SINGLE-SERVE, 10CT', cadence: 'MONTHLY' },
      { no: 20, nomenclature: 'TEA, BLACK, LOOSE, 50G', cadence: 'MONTHLY' },
      { no: 21, nomenclature: 'ELECTROLYTE, POWDER, 10-PACK', cadence: 'MONTHLY' },
    ],
  },
  {
    label: 'RECOVERY',
    items: [
      { no: 22, nomenclature: 'BANDAGE, ADHESIVE, ASSORTED, 20CT', cadence: 'QUARTERLY' },
      { no: 23, nomenclature: 'PAIN RELIEVER, GENERIC, 24CT', cadence: 'QUARTERLY' },
    ],
  },
]

const ITEM_COUNT = RATION_LOAD.reduce((n, cat) => n + cat.items.length, 0)

const StatusLine: React.FC<{
  label: string
  value: React.ReactNode
  muted?: boolean
}> = ({ label, value, muted }) => (
  <div className="flex items-baseline justify-between gap-x-16 border-b-2 border-acc/10 py-6 font-mono text-xs uppercase tracking-wider">
    <span className="opacity-60">{label}</span>
    <span className={cn('text-right font-bold', muted && 'opacity-40 font-normal')}>
      {value}
    </span>
  </div>
)

const Ruled: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('border-2 border-acc', className)}>{children}</div>

interface BasicsProps {
  noWrapper?: boolean
}

export const Basics: React.FC<BasicsProps> = ({ noWrapper = false }) => {
  useDocumentTitle('Basics — Ration')

  const content = (
    <div className="flex flex-col gap-y-24 font-mono max-w-[720px]">
      <div className="flex items-center justify-between gap-x-16">
        <GhostButton href="/">← LOT</GhostButton>
        <span className="text-xs uppercase tracking-wider opacity-40">
          LOT-FM-001
        </span>
      </div>

      <div>
        <div className="flex items-center gap-x-8 mb-8">
          <span className="bg-acc text-bac px-8 py-2 text-xs uppercase tracking-wider font-bold">
            Open Tab
          </span>
          <span className="text-xs uppercase tracking-wider opacity-40">
            Public — Unauthenticated Read
          </span>
        </div>
        <div className="text-2xl phone:text-3xl font-bold uppercase tracking-tight">
          LOT Basic
        </div>
        <div className="text-xs uppercase tracking-wider opacity-60 mt-4">
          Ration Subscription — Hardware / Physical Layer
        </div>
      </div>

      <Ruled className="p-16 phone:p-24">
        <StatusLine label="Status" value="Open Tab — Doctrine Live" />
        <StatusLine label="Price" value="USD 100.00 / Month" />
        <StatusLine label="Manifest" value={`${ITEM_COUNT}-Item Ration`} />
        <StatusLine label="Cadence" value="Monthly Dispatch" />
        <StatusLine
          label="Upgrade"
          value="Not Yet Issued — Month 2"
          muted
        />
        <StatusLine
          label="Fulfillment"
          value="Not Yet Issued — Month 3"
          muted
        />
      </Ruled>

      <div className="flex flex-col gap-y-12 text-sm leading-1.5">
        <div className="text-xs uppercase tracking-wider font-bold border-b-2 border-acc pb-4">
          Doctrine
        </div>
        <p>
          LOT Basic is the hardware layer of the LOT System. Software runs
          the self; Basic keeps the body supplied. One ration, one price,
          one cadence. Selection is closed and substitution is not offered
          — that is what removes the decision.
        </p>
        <p>
          Issue, not sale. Once on strength, resupply is automatic: no
          reordering, no cart, no upsell. The relationship is a standing
          order, not a transaction.
        </p>
        <p className="opacity-60">
          The manifest below is published in full. Nomenclature and
          cadence are public record. Landed cost is withheld — margin
          funds the System, not the ration.
        </p>
      </div>

      <div className="flex flex-col gap-y-8">
        <div className="text-xs uppercase tracking-wider font-bold border-b-2 border-acc pb-4">
          Manifest — {ITEM_COUNT} Line Items
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-acc">
                <th className="text-left font-bold uppercase tracking-wider py-6 pr-8 w-[48px]">
                  No.
                </th>
                <th className="text-left font-bold uppercase tracking-wider py-6 pr-8">
                  Nomenclature
                </th>
                <th className="text-right font-bold uppercase tracking-wider py-6 w-[110px]">
                  Cadence
                </th>
              </tr>
            </thead>
            <tbody>
              {RATION_LOAD.map((category) => (
                <React.Fragment key={category.label}>
                  <tr>
                    <td
                      colSpan={3}
                      className="bg-acc text-bac uppercase tracking-wider font-bold py-4 px-8"
                    >
                      {category.label}
                    </td>
                  </tr>
                  {category.items.map((item) => (
                    <tr key={item.no} className="border-b border-acc/15">
                      <td className="py-6 pr-8 opacity-50 tabular-nums">
                        {String(item.no).padStart(2, '0')}
                      </td>
                      <td className="py-6 pr-8">{item.nomenclature}</td>
                      <td className="py-6 text-right opacity-70">
                        {item.cadence}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-acc text-bac px-16 py-12 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider">Issue Rate</span>
        <span className="text-sm font-bold uppercase tracking-wider">
          USD 100.00 / Month
        </span>
      </div>

      <div className="text-xs opacity-40 border-t-2 border-acc/10 pt-16">
        <div>CLASS: OPEN TAB // PUBLIC — S-2: VADIK MARMELADOV</div>
        <div className="mt-4">
          Build state: Month 1 of 3 — Ledger &amp; Doctrine. Read-only.
          Upgrade and fulfillment are not live.
        </div>
      </div>
    </div>
  )

  return noWrapper ? content : <Page>{content}</Page>
}
