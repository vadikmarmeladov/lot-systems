/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { StatusLine } from '#client/components/ui'
import { useDocumentTitle } from '#client/utils/hooks'
import {
  BASIC_RATION,
  BASIC_RATION_PRICE_USD,
  getRationCadenceCounts,
} from '#shared/constants/rations'

/**
 * LOT-FM-001 / BASIC (RATION) — OPEN TAB, month 1 build.
 * Public read-only ledger: doctrine, price, 23-item manifest. Fixed
 * white-ground/black-ink register regardless of app theme — a printed
 * manifest card, not a themed widget. No fetch, no auth gate: a
 * stranger can read what LOT issues and on what terms.
 */
export function Basics() {
  useDocumentTitle('Basics')
  const cadenceCounts = getRationCadenceCounts()

  return (
    <div className="flex flex-col gap-y-16">
      <div className="bg-white text-black border-2 border-black font-mono">
        <div className="flex items-center justify-between gap-16 bg-black text-white px-16 py-8">
          <span className="font-bold tracking-wide">LOT® BASIC RATION</span>
          <span className="text-[13px]">OPEN TAB</span>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-3 border-b-2 border-black text-[13px]">
          <div className="p-16 border-b-2 tablet:border-b-0 tablet:border-r-2 border-black">
            <div className="opacity-60">DOCUMENT</div>
            <div className="font-bold">LOT-FM-001</div>
          </div>
          <div className="p-16 border-b-2 tablet:border-b-0 tablet:border-r-2 border-black">
            <div className="opacity-60">MODULE</div>
            <div className="font-bold">BASIC (RATION)</div>
          </div>
          <div className="p-16">
            <div className="opacity-60">CLASSIFICATION</div>
            <div className="font-bold">CIVILIAN RATION SUBSCRIPTION</div>
          </div>
        </div>

        <div className="p-16 border-b-2 border-black">
          <StatusLine label="Status" value="Open Tab — Read-Only — Live" state="live" />
        </div>

        <div className="p-16 border-b-2 border-black flex flex-col gap-y-12 text-[14px] leading-[1.5]">
          <p>
            LOT issues. LOT does not sell. On enrollment the operator goes ON STRENGTH —
            the ration is issued against subscription, not purchased against price.
          </p>
          <p>
            This tab is the ledger. The ledger is the marketing. Below is the complete
            {' '}{BASIC_RATION.length}-item BASIC load — nomenclature and cadence, no layer
            between this page and the manifest.
          </p>
          <p className="opacity-60">
            Already ON STRENGTH under LOT Usership (AI)? UPGRADE adds the BASIC ration as
            an additive $100/mo charge on the same account. STAND DOWN drops the ration
            and retains AI access. Enrollment control ships month 2 — see ROADMAP below.
          </p>
        </div>

        <div className="flex items-center justify-between gap-16 bg-black text-white px-16 py-12">
          <span className="font-bold tracking-wide">BASIC RATION</span>
          <span className="font-bold">${BASIC_RATION_PRICE_USD.toFixed(2)} / MONTH</span>
        </div>

        <div className="p-16 border-b-2 border-black text-[13px] flex flex-wrap gap-x-24 gap-y-4 opacity-60">
          <span>{cadenceCounts.MONTHLY} MONTHLY</span>
          <span>{cadenceCounts.QUARTERLY} QUARTERLY</span>
          <span>{cadenceCounts.ISSUE} ISSUE (ONE-TIME)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-black text-white">
                <th className="text-left font-bold px-16 py-8 w-[48px]">NO.</th>
                <th className="text-left font-bold px-16 py-8">NOMENCLATURE</th>
                <th className="text-left font-bold px-16 py-8 w-[120px]">CATEGORY</th>
                <th className="text-left font-bold px-16 py-8 w-[110px]">CADENCE</th>
              </tr>
            </thead>
            <tbody>
              {BASIC_RATION.map(item => (
                <tr key={item.no} className="border-t-2 border-black">
                  <td className="px-16 py-8 opacity-60">{String(item.no).padStart(2, '0')}</td>
                  <td className="px-16 py-8">{item.nomenclature}</td>
                  <td className="px-16 py-8 opacity-60">{item.category}</td>
                  <td className="px-16 py-8 opacity-60">{item.cadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-16 border-t-2 border-black text-[12px] opacity-60 flex flex-col gap-y-4">
          <div>{BASIC_RATION.length}-ITEM LOAD. CADENCE PRINTED. COGS WITHHELD.</div>
          <div>ISSUED BY LOT SYSTEMS CORPORATION. NOT FOR RESALE.</div>
        </div>
      </div>

      <div className="bg-white text-black border-2 border-black font-mono">
        <div className="bg-black text-white px-16 py-8">
          <span className="font-bold tracking-wide">ROADMAP — LOT-FM-001</span>
        </div>
        <div className="p-16 flex flex-col gap-y-12 text-[13px]">
          <div className="flex flex-col gap-y-2">
            <StatusLine label="Month 1" value="Ledger & Doctrine — Live" state="closed" />
            <div className="pl-16 opacity-60">Open tab, 23-item manifest, doctrine, price line. Read-only.</div>
          </div>
          <div className="flex flex-col gap-y-2">
            <StatusLine label="Month 2" value="Upgrade & Roster — Pending" state="pending" />
            <div className="pl-16 opacity-60">
              UPGRADE control, roster intake, recurring billing, STAND DOWN downgrade.
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <StatusLine label="Month 3" value="Issue & Fulfillment — Pending" state="pending" />
            <div className="pl-16 opacity-60">
              Month-by-month load engine, supplier quotes, printed manifest card, first issue.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
