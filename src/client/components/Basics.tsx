/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useDocumentTitle } from '#client/utils/hooks'
import { BasicsLedger } from '#client/components/basics/BasicsLedger'

// BASIC — the hardware / physical issue layer of the LOT System.
// MONTH 1 (LOT-FM-001): OPEN TAB only — read-only ledger, doctrine, price
// line. UPGRADE (Usership AI -> ON STRENGTH) and issue/fulfillment land in
// later months; see docs/corporate/LOT-BASIC-RATION-ROADMAP.md.
export const Basics = () => {
  useDocumentTitle('Basics')

  return (
    <div className="flex flex-col gap-y-16">
      <BasicsLedger />
    </div>
  )
}
