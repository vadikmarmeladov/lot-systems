/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { StatusLine } from '#client/components/ui'

/**
 * BASICS — the hardware/physical layer of the LOT System.
 *
 * MODULE: BASIC (RATION), per LOT-FM-001.
 * BUILD STATE: MONTH 1 — OPEN TAB. Public, read-only. Renders the doctrine,
 * the 23-item ration load (nomenclature + cadence; COGS withheld), and the
 * price line. No enrollment control exists yet — that is MONTH 2 (UPGRADE +
 * ROSTER). No fulfillment engine exists yet — that is MONTH 3 (ISSUE).
 *
 * House style is a deliberate break from the rest of the app: LiberationMono
 * (font-term, `tailwind.config.js`), white ground / black ink fixed
 * regardless of the operator's theme (`--lot-term-ink` / `--lot-term-ground`,
 * `index.css`), inversion-only hierarchy (no opacity, no color), 2px rules,
 * square corners, IBM 3270 register. This is a printed manifest, not a
 * themed surface.
 */

type RationItem = {
  no: number
  nomenclature: string
  cadence: 'MONTHLY' | 'QUARTERLY'
}

// The 23-item ration load. Grouped for readability; the group is not a
// billing unit — the ration ships as one consignment. COGS is withheld
// per doctrine: the ledger is the marketing, and cost is not the offer.
const RATION_GROUPS: { title: string; items: RationItem[] }[] = [
  {
    title: 'FIELD RECORD',
    items: [
      { no: 1, nomenclature: 'NOTEBOOK, FIELD, POCKET, 96-PAGE', cadence: 'MONTHLY' },
      { no: 2, nomenclature: 'PEN, BALLPOINT, BLACK, 3-PACK', cadence: 'MONTHLY' },
      { no: 3, nomenclature: 'PENCIL, NO. 2, 6-PACK', cadence: 'MONTHLY' },
      { no: 4, nomenclature: 'INDEX CARD, RULED, 50-CT', cadence: 'MONTHLY' },
      { no: 5, nomenclature: 'STICKER SHEET, LOT MARK, GRID', cadence: 'MONTHLY' },
    ],
  },
  {
    title: 'SYSTEM HARDWARE',
    items: [
      { no: 6, nomenclature: 'FLASH DRIVE, 32GB, LOT MARK', cadence: 'QUARTERLY' },
      { no: 7, nomenclature: 'CALIBRATION CARD, QIE REFERENCE', cadence: 'QUARTERLY' },
      { no: 8, nomenclature: 'BATTERY, AA, ALKALINE, 4-PACK', cadence: 'MONTHLY' },
      { no: 9, nomenclature: 'BATTERY, AAA, ALKALINE, 4-PACK', cadence: 'MONTHLY' },
      { no: 10, nomenclature: 'CABLE, USB-C TO USB-C, 1M', cadence: 'QUARTERLY' },
      { no: 11, nomenclature: 'CLOTH, CLEANING, MICROFIBER', cadence: 'QUARTERLY' },
    ],
  },
  {
    title: 'PERSONAL SUSTAINMENT',
    items: [
      { no: 12, nomenclature: 'TOOTHBRUSH, SOFT BRISTLE', cadence: 'MONTHLY' },
      { no: 13, nomenclature: 'TOOTHPASTE, TRAVEL, 1.5OZ', cadence: 'MONTHLY' },
      { no: 14, nomenclature: 'FLOSS, WAXED, 30M', cadence: 'MONTHLY' },
      { no: 15, nomenclature: 'SOAP, BAR, UNSCENTED', cadence: 'MONTHLY' },
      { no: 16, nomenclature: 'HYGIENE PAPER, 4-ROLL', cadence: 'MONTHLY' },
      { no: 17, nomenclature: 'RAZOR, DISPOSABLE, TWIN-BLADE', cadence: 'MONTHLY' },
      { no: 18, nomenclature: 'UNDERWEAR, COTTON, PAIR', cadence: 'MONTHLY' },
      { no: 19, nomenclature: 'BANDAGE, ADHESIVE, 10-CT', cadence: 'MONTHLY' },
    ],
  },
  {
    title: 'FIELD SUSTENANCE',
    items: [
      { no: 20, nomenclature: 'COFFEE, INSTANT, 10 PACKETS', cadence: 'MONTHLY' },
      { no: 21, nomenclature: 'TEA, BLACK, 10-CT', cadence: 'MONTHLY' },
      { no: 22, nomenclature: 'ELECTROLYTE, PACKET, 4-CT', cadence: 'MONTHLY' },
      { no: 23, nomenclature: 'PROTEIN BAR, 2-CT', cadence: 'MONTHLY' },
    ],
  },
]

const RATION_ITEMS = RATION_GROUPS.flatMap((g) => g.items)
const MONTHLY_COUNT = RATION_ITEMS.filter((i) => i.cadence === 'MONTHLY').length
const QUARTERLY_COUNT = RATION_ITEMS.filter((i) => i.cadence === 'QUARTERLY').length

const inkFrame = 'border-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)] rounded-none'

export function Basics() {
  return (
    <div
      className="flex flex-col gap-y-16 font-term font-bold bg-[color:var(--lot-term-ground)] text-[color:var(--lot-term-ink)] -m-16 phone:-m-32 tablet:-m-48 desktop:-m-64 p-16 phone:p-32 tablet:p-48 desktop:p-64"
    >
      {/* Header */}
      <div className={inkFrame}>
        <div className="px-12 phone:px-16 py-8 border-b-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)] flex items-baseline justify-between flex-wrap gap-x-16">
          <span className="text-[14px] phone:text-[16px] tracking-wide">LOT SYSTEMS / BASIC (RATION)</span>
          <span className="text-[11px] phone:text-[12px] tracking-wide">LOT-FM-001</span>
        </div>
        <div className="px-12 phone:px-16 py-8 text-[11px] phone:text-[12px] tracking-wide">
          MODULE: BASIC — HARDWARE / PHYSICAL LAYER · CLASS: OPEN TAB // PUBLIC
        </div>
      </div>

      <StatusLine
        segments={[
          { label: 'STATUS', value: 'OPEN TAB — READ ONLY' },
          { label: 'ISSUE', value: 'MONTHLY' },
          { label: 'BUILD', value: 'M1 // LEDGER & DOCTRINE' },
        ]}
      />

      {/* Doctrine */}
      <div className={inkFrame}>
        <div className="px-12 phone:px-16 py-6 border-b-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)] text-[11px] phone:text-[12px] tracking-wide">
          DOCTRINE
        </div>
        <div className="px-12 phone:px-16 py-12 flex flex-col gap-y-8 text-[13px] phone:text-[14px] leading-[1.5] normal-case">
          <p>LOT does not sell equipment. LOT issues it.</p>
          <p>
            Subscribe to BASIC and you are on strength. Every month a fixed ration ships — the
            matériel required to keep the System, and the operator, running.
          </p>
          <p>Same load. Same day. Same price. No upsell, no bundle games, no dark patterns.</p>
          <p>The ledger below is the entire offer.</p>
        </div>
      </div>

      {/* Price line */}
      <div className={`${inkFrame} bg-[color:var(--lot-term-ink)] text-[color:var(--lot-term-ground)] px-12 phone:px-16 py-12 flex items-baseline justify-between flex-wrap gap-x-16`}>
        <span className="text-[18px] phone:text-[22px] tracking-wide">USD 100.00 / MONTH</span>
        <span className="text-[11px] phone:text-[12px] tracking-wide">RECURRING · NO CONTRACT · STAND DOWN ANYTIME</span>
      </div>

      {/* Ration ledger */}
      <div className={inkFrame}>
        <div className="px-12 phone:px-16 py-6 border-b-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)] text-[11px] phone:text-[12px] tracking-wide">
          RATION LOAD — 23 LINE ITEMS
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px] phone:text-[12px] tracking-wide">
            <thead>
              <tr className="bg-[color:var(--lot-term-ink)] text-[color:var(--lot-term-ground)]">
                <th className="w-[4ch] text-left font-bold px-8 phone:px-12 py-6 border-b-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)]">NO.</th>
                <th className="text-left font-bold px-8 phone:px-12 py-6 border-b-[length:var(--lot-term-rule)] border-l-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ground)]">NOMENCLATURE</th>
                <th className="w-[13ch] text-left font-bold px-8 phone:px-12 py-6 border-b-[length:var(--lot-term-rule)] border-l-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ground)]">CADENCE</th>
              </tr>
            </thead>
            <tbody>
              {RATION_GROUPS.map((group) => (
                <React.Fragment key={group.title}>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-8 phone:px-12 py-4 border-t-[length:var(--lot-term-rule)] border-b-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)]"
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.items.map((item) => (
                    <tr key={item.no} className="border-b-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)]">
                      <td className="px-8 phone:px-12 py-6 align-top">{String(item.no).padStart(2, '0')}</td>
                      <td className="px-8 phone:px-12 py-6 align-top border-l-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)]">
                        {item.nomenclature}
                      </td>
                      <td className="px-8 phone:px-12 py-6 align-top border-l-[length:var(--lot-term-rule)] border-[color:var(--lot-term-ink)]">
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

      <StatusLine
        invert={false}
        segments={[
          { label: 'LINE ITEMS', value: '23' },
          { label: 'CADENCE MIX', value: `${MONTHLY_COUNT} MONTHLY / ${QUARTERLY_COUNT} QUARTERLY` },
          { label: 'COGS', value: 'WITHHELD' },
          { label: 'UPGRADE PATH', value: 'MONTH 2' },
        ]}
      />
    </div>
  )
}
