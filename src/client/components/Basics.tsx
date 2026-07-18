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
  BIOSTATION_SEQUENCE,
  PLANS,
  getBasicsPreviewPool,
  getRationCadenceCounts,
} from '#shared/constants/rations'

/**
 * LOT-FM-001 / BASICS — OPEN TAB, month 1 build.
 * Public read-only ledger: doctrine, plan tiers, surprise-box contents
 * pool, BioStation™ constructor sequence. Fixed white-ground/black-ink
 * register regardless of app theme — a printed manifest card, not a
 * themed widget. No fetch, no auth gate beyond the app shell itself.
 */
export function Basics() {
  useDocumentTitle('Basics')
  const cadenceCounts = getRationCadenceCounts()
  const previewPool = getBasicsPreviewPool()
  const basicsPlan = PLANS.find(p => p.id === 'BASICS')!
  const aiPlan = PLANS.find(p => p.id === 'AI')!
  const modulePlans = PLANS.filter(p => p.kind === 'MODULE-UPGRADE')

  return (
    <div className="flex flex-col gap-y-16">
      <div className="bg-white text-black border-2 border-black font-mono">
        <div className="flex items-center justify-between gap-16 bg-black text-white px-16 py-8">
          <span className="font-bold tracking-wide">LOT® BASICS</span>
          <span className="text-[13px]">OPEN TAB</span>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-3 border-b-2 border-black text-[13px]">
          <div className="p-16 border-b-2 tablet:border-b-0 tablet:border-r-2 border-black">
            <div className="opacity-60">DOCUMENT</div>
            <div className="font-bold">LOT-FM-001</div>
          </div>
          <div className="p-16 border-b-2 tablet:border-b-0 tablet:border-r-2 border-black">
            <div className="opacity-60">MODULE</div>
            <div className="font-bold">BASICS (SURPRISE BOX)</div>
          </div>
          <div className="p-16">
            <div className="opacity-60">CLASSIFICATION</div>
            <div className="font-bold">FIRST PHYSICAL SUBSCRIPTION</div>
          </div>
        </div>

        <div className="p-16 border-b-2 border-black">
          <StatusLine label="Status" value="Open Tab — Read-Only — Live" state="live" />
        </div>

        <div className="p-16 border-b-2 border-black flex flex-col gap-y-12 text-[14px] leading-[1.5]">
          <p>
            LOT issues. LOT does not sell. BASICS is the first physical module — the
            step up from AI-only. The System smart-curates one box per operator per
            month. Contents are not disclosed in advance.
          </p>
          <p>
            Expect wardrobe every issue — socks, a fresh t-shirt, underwear — plus a
            preview sample of modules not yet subscribed to: Self-care items like a
            toothbrush, Home items like a candle, and the LOT® BioStation™ weather
            station, built part by part across 12 months.
          </p>
          <p className="opacity-60">
            Module UPGRADE (+$99/mo each) trades a module's Basics preview for its
            full, dedicated, more granular stream. Self-care is live. Home and Kids
            are not yet open for enrollment — their preview items still ship inside
            Basics ahead of launch.
          </p>
        </div>

        <div className="flex items-center justify-between gap-16 bg-black text-white px-16 py-12">
          <span className="font-bold tracking-wide">{basicsPlan.name}</span>
          <span className="font-bold">${basicsPlan.priceUsd.toFixed(2)} / MONTH — AI INCLUDED</span>
        </div>

        <div className="p-16 border-b-2 border-black text-[13px] flex flex-col gap-y-8">
          <div className="flex justify-between opacity-60">
            <span>{aiPlan.name} (digital only, standalone)</span>
            <span>${aiPlan.priceUsd.toFixed(2)} / MONTH</span>
          </div>
          {modulePlans.map(plan => (
            <div key={plan.id} className="flex items-center justify-between gap-16">
              <StatusLine
                label={plan.name}
                value={plan.status === 'LIVE' ? 'Upgrade Open' : 'Coming'}
                state={plan.status === 'LIVE' ? 'live' : 'pending'}
                className="text-[12px]"
              />
              <span className="opacity-60 flex-shrink-0">+${plan.priceUsd.toFixed(2)} / MONTH</span>
            </div>
          ))}
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
                <th className="text-left font-bold px-16 py-8 w-[120px]">MODULE</th>
                <th className="text-left font-bold px-16 py-8 w-[110px]">CADENCE</th>
              </tr>
            </thead>
            <tbody>
              {previewPool.map(item => (
                <tr key={item.no} className="border-t-2 border-black">
                  <td className="px-16 py-8 opacity-60">{String(item.no).padStart(2, '0')}</td>
                  <td className="px-16 py-8">{item.nomenclature}</td>
                  <td className="px-16 py-8 opacity-60">{item.module}</td>
                  <td className="px-16 py-8 opacity-60">{item.cadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-16 border-t-2 border-black text-[12px] opacity-60 flex flex-col gap-y-4">
          <div>CONTENTS POOL. SMART-CURATED. NOT GUARANTEED EACH MONTH.</div>
          <div>ISSUED BY LOT SYSTEMS CORPORATION. NOT FOR RESALE.</div>
        </div>
      </div>

      <div className="bg-white text-black border-2 border-black font-mono">
        <div className="bg-black text-white px-16 py-8">
          <span className="font-bold tracking-wide">LOT® BIOSTATION™ — CONSTRUCTOR SEQUENCE</span>
        </div>
        <div className="p-16 border-b-2 border-black text-[14px] leading-[1.5]">
          <p>
            A 12-month build-it-yourself weather station, shipping part by part inside
            the Basics box. Dependency-ordered: the compute core ships first so the
            dashboard and API are live from month one; sensors follow in ascending
            complexity; the year closes with a fully assembled, calibrated station.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-black text-white">
                <th className="text-left font-bold px-16 py-8 w-[100px]">MONTH</th>
                <th className="text-left font-bold px-16 py-8">NOMENCLATURE</th>
              </tr>
            </thead>
            <tbody>
              {BIOSTATION_SEQUENCE.map(part => (
                <tr key={part.month} className="border-t-2 border-black">
                  <td className="px-16 py-8 opacity-60">{String(part.month).padStart(2, '0')}</td>
                  <td className="px-16 py-8">{part.nomenclature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-16 border-t-2 border-black text-[12px] opacity-60">
          DASHBOARD + ENTERPRISE-GRADE API AVAILABLE ON CONNECT. SEQUENCE PROVISIONAL.
        </div>
      </div>

      <div className="bg-white text-black border-2 border-black font-mono">
        <div className="bg-black text-white px-16 py-8">
          <span className="font-bold tracking-wide">ROADMAP — LOT-FM-001</span>
        </div>
        <div className="p-16 flex flex-col gap-y-12 text-[13px]">
          <div className="flex flex-col gap-y-2">
            <StatusLine label="Month 1" value="Ledger & Doctrine — Live" state="closed" />
            <div className="pl-16 opacity-60">Open tab, contents pool, BioStation sequence, plan tiers. Read-only.</div>
          </div>
          <div className="flex flex-col gap-y-2">
            <StatusLine label="Month 2" value="Upgrade & Roster — Pending" state="pending" />
            <div className="pl-16 opacity-60">
              UPGRADE control per plan/module, roster intake, additive billing, STAND DOWN downgrade.
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <StatusLine label="Month 3" value="Issue & Fulfillment — Pending" state="pending" />
            <div className="pl-16 opacity-60">
              Smart box-curation engine, supplier quotes, printed manifest card, first issue.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
