/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { Block, Table } from '#client/components/ui'
import { useDocumentTitle } from '#client/utils/hooks'

/**
 * BASICS — LOT-FM-001 / BASIC ration module, Month 1 build (OPEN TAB).
 *
 * Scope for this increment is deliberately narrow: render the doctrine, the
 * price line, and the 23-item load as a read-only ledger. COGS is withheld
 * by design — the ledger states nomenclature and cadence, never landed cost.
 * Roster intake, billing, and fulfillment are later-month builds (see
 * docs/benchmark/LOT-FM-001-BASIC.md) and are not wired here.
 */

type Cadence = 'MONTHLY' | 'QUARTERLY' | 'SEMI-ANNUAL' | 'ANNUAL'

type RationItem = {
  no: number
  nomenclature: string
  category: string
  cadence: Cadence
}

const RATION_LOAD: RationItem[] = [
  { no: 1, nomenclature: 'Toothbrush', category: 'Hygiene', cadence: 'QUARTERLY' },
  { no: 2, nomenclature: 'Toothpaste, travel tube', category: 'Hygiene', cadence: 'MONTHLY' },
  { no: 3, nomenclature: 'Dental floss', category: 'Hygiene', cadence: 'MONTHLY' },
  { no: 4, nomenclature: 'Bar soap', category: 'Hygiene', cadence: 'MONTHLY' },
  { no: 5, nomenclature: 'Shampoo, travel bottle', category: 'Hygiene', cadence: 'MONTHLY' },
  { no: 6, nomenclature: 'Deodorant', category: 'Hygiene', cadence: 'MONTHLY' },
  { no: 7, nomenclature: 'Razor, disposable (3-pack)', category: 'Hygiene', cadence: 'MONTHLY' },
  { no: 8, nomenclature: 'Nail clipper', category: 'Hygiene', cadence: 'ANNUAL' },
  { no: 9, nomenclature: 'Cotton swabs, pack', category: 'Hygiene', cadence: 'QUARTERLY' },
  { no: 10, nomenclature: 'Crew socks, pair', category: 'Apparel', cadence: 'MONTHLY' },
  { no: 11, nomenclature: 'Underwear, pack', category: 'Apparel', cadence: 'MONTHLY' },
  { no: 12, nomenclature: 'T-shirt, white', category: 'Apparel', cadence: 'QUARTERLY' },
  { no: 13, nomenclature: 'Batteries, AA (4-pack)', category: 'Utility', cadence: 'QUARTERLY' },
  { no: 14, nomenclature: 'Batteries, AAA (4-pack)', category: 'Utility', cadence: 'QUARTERLY' },
  { no: 15, nomenclature: 'Notebook, pocket, ruled', category: 'Utility', cadence: 'QUARTERLY' },
  { no: 16, nomenclature: 'Pen, black ink', category: 'Utility', cadence: 'MONTHLY' },
  { no: 17, nomenclature: 'Duct tape, mini roll', category: 'Utility', cadence: 'SEMI-ANNUAL' },
  { no: 18, nomenclature: 'Adhesive bandages, box', category: 'First Aid', cadence: 'QUARTERLY' },
  { no: 19, nomenclature: 'Antiseptic wipes, pack', category: 'First Aid', cadence: 'QUARTERLY' },
  { no: 20, nomenclature: 'Pain reliever, travel pack', category: 'First Aid', cadence: 'QUARTERLY' },
  { no: 21, nomenclature: 'Multivitamin, 30-day supply', category: 'Sustainment', cadence: 'MONTHLY' },
  { no: 22, nomenclature: 'Instant coffee / tea, sachets', category: 'Sustainment', cadence: 'MONTHLY' },
  { no: 23, nomenclature: 'Emergency poncho', category: 'Field', cadence: 'ANNUAL' },
]

const StatusLine: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="font-mono text-[0.8em] uppercase tracking-wide border-t border-b border-acc/20 py-8 text-acc/60">
    {children}
  </div>
)

export function BasicsTab() {
  useDocumentTitle('Basics')

  return (
    <div className="flex flex-col gap-y-16">
      <StatusLine>
        OPEN TAB · BASIC RATION · LOT-FM-001 · STATUS: LIVE — READ ONLY
      </StatusLine>

      <Block label="Doctrine:" labelClassName="!pl-0" blockView>
        <div className="flex flex-col gap-y-8">
          <div>Issue, not sale. The operator is on strength, not a customer.</div>
          <div>
            The ledger is the manifest. There is no layer between what LOT
            issues and what the operator sees. Twenty-three items, one cadence
            schedule, no hidden line items.
          </div>
          <div>Read this list. It is the entire offer.</div>
        </div>
      </Block>

      <Block label="Price:" labelClassName="!pl-0">
        USD 100 / MO — recurring, additive to Usership. No annual lock.
      </Block>

      <div>
        <div className="mb-16">Ration load — 23 items:</div>
        <Table
          data={RATION_LOAD}
          columns={[
            {
              id: 'no',
              header: 'No.',
              accessor: (row) => String(row.no).padStart(2, '0'),
            },
            {
              id: 'nomenclature',
              header: 'Nomenclature',
              accessor: (row) => row.nomenclature,
            },
            {
              id: 'category',
              header: 'Category',
              accessor: (row) => <span className="text-acc/60">{row.category}</span>,
            },
            {
              id: 'cadence',
              header: 'Cadence',
              accessor: (row) => row.cadence,
            },
          ]}
        />
      </div>

      <div className="text-acc/40">
        Landed cost per item is withheld from this ledger by policy — nomenclature
        and cadence only. Roster intake, billing, and issue tracking are not yet
        live; this tab is read-only for the current build.
      </div>

      <StatusLine>
        NEXT BUILD: UPGRADE + ROSTER (USERSHIP/AI → ON STRENGTH) — LOT-FM-001 MONTH 2
      </StatusLine>
    </div>
  )
}
