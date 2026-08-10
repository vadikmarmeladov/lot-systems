/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// BASIC — Month 1 (LEDGER & DOCTRINE). OPEN TAB: public, read-only manifest.
// Spec: docs/corporate/LOT-FM-001.md. White ground / black ink is fixed —
// this surface deliberately ignores the app theme, the way a printed
// manifest card reads the same regardless of device settings.

import * as React from 'react'
import { cn } from '#client/utils'
import { RATION_ITEMS, BASIC_PRICE_USD, BASIC_DOCTRINE, BASIC_TERMS } from '#client/utils/basics'

const MONO = "'Liberation Mono', ui-monospace, SFMono-Regular, 'Courier New', monospace"

const pad2 = (n: number) => String(n).padStart(2, '0')

const StatusLine: React.FC<{ fields: Array<[string, string]> }> = ({ fields }) => (
  <div className="flex flex-wrap gap-x-24 gap-y-4 text-xs font-bold uppercase tracking-wide">
    {fields.map(([label, value]) => (
      <div key={label}>
        <span>{label}:</span> <span>{value}</span>
      </div>
    ))}
  </div>
)

export const Basics: React.FC = () => {
  return (
    <div className="flex justify-center" style={{ fontFamily: MONO }}>
      <div className="w-full max-w-[720px] bg-[#fff] text-[#000] border-2 border-[#000]">
        {/* register header + status line */}
        <div className="border-b-2 border-[#000] p-16 flex flex-col gap-12">
          <div className="flex items-baseline justify-between flex-wrap gap-8">
            <span className="font-bold text-sm uppercase tracking-wide">
              LOT-FM-001 // BASIC
            </span>
            <span className="text-xs uppercase">RATION SUBSCRIPTION</span>
          </div>
          <StatusLine
            fields={[
              ['TAB', 'OPEN'],
              ['LINES', String(RATION_ITEMS.length)],
              ['RATE', `$${BASIC_PRICE_USD.toFixed(2)}/MO`],
              ['PHASE', 'M1/3 — LEDGER LIVE'],
            ]}
          />
        </div>

        {/* doctrine */}
        <div className="border-b-2 border-[#000] p-16 flex flex-col gap-12">
          <div className="text-xs font-bold uppercase tracking-wide">DOCTRINE</div>
          {BASIC_DOCTRINE.map((line, i) => (
            <p key={i} className="text-sm leading-1.5">
              {line}
            </p>
          ))}
        </div>

        {/* 23-line manifest */}
        <div className="border-b-2 border-[#000] overflow-x-auto">
          <table className="w-full border-collapse text-sm" cellSpacing={0} cellPadding={0}>
            <thead>
              <tr className="border-b-2 border-[#000]">
                <Th className="w-[3.5ch]">LN</Th>
                <Th>NOMENCLATURE</Th>
                <Th className="w-[11ch]">CADENCE</Th>
              </tr>
            </thead>
            <tbody>
              {RATION_ITEMS.map((item) => (
                <tr key={item.line} className="border-b border-[#000]/30">
                  <Td className="tabular-nums">{pad2(item.line)}</Td>
                  <Td>{item.nomenclature}</Td>
                  <Td>{item.cadence}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* price line / terms */}
        <div className="p-16 flex flex-col gap-4">
          {BASIC_TERMS.map((line, i) => (
            <div key={i} className={cn('text-xs uppercase tracking-wide', i === 0 && 'font-bold')}>
              {line}
            </div>
          ))}
          <div className="text-xs uppercase tracking-wide opacity-60 mt-8">
            ENROLLMENT: MONTH 2
          </div>
        </div>
      </div>
    </div>
  )
}

const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <th className={cn('text-left font-bold uppercase p-8 whitespace-nowrap', className)}>{children}</th>
)

const Td: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <td className={cn('p-8 align-top', className)}>{children}</td>
)
