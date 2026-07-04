/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 *
 * LOT-FM-001 / BASIC RATION MODULE — MONTH 1
 * OPEN TAB — public surface. No login required. Read-only.
 * A stranger can read what LOT issues and on what terms.
 */

import * as React from 'react'
import { BasicsHeader, DoctrineBlock, RationLedger, ThinRule } from './basics/RationLedger'

export const OpenTab: React.FC = () => (
  <div className="min-h-[100dvh] flex flex-col px-16 phone:px-32 tablet:px-48 desktop:px-64 pt-24 phone:pt-32 pb-64 max-w-[720px] mx-auto">
    <BasicsHeader className="mb-16" />
    <DoctrineBlock className="mb-16" />
    <ThinRule className="mb-16" />
    <RationLedger />
    <ThinRule className="mt-8 mb-16" />
    <p className="font-mono text-[11px] text-acc/40 leading-snug">
      OPEN TAB — public ledger. No account required to read this page.
      Usership members may enroll for BASIC issue via the in-app Basics tab.
    </p>
  </div>
)
