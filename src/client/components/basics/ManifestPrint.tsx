/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * LOT-FM-001 / BASIC RATION MODULE — PRINTED MANIFEST CARD (Month 3)
 *
 * No PDF dependency. The card renders hidden in the DOM and is exposed
 * only under `@media print` via a body class toggle, so the operator's
 * own browser print pipeline produces the physical/PDF card. Zero new
 * runtime dependencies, consistent with the OPERATING RULES doctrine.
 */

import * as React from 'react'
import { RATION_MANIFEST, MANUAL_REF, type RationItem } from '#shared/constants/basics'
import dayjs from '#client/utils/dayjs'

export function printManifest() {
  document.body.classList.add('lot-basics-printing')
  const cleanup = () => document.body.classList.remove('lot-basics-printing')
  window.addEventListener('afterprint', cleanup, { once: true })
  window.print()
  // Safety net in case afterprint doesn't fire (some mobile browsers)
  setTimeout(cleanup, 5000)
}

type Props = {
  operatorName: string
  issueNumber: number
  scheduledAt: string
  itemLines: string[]
}

export const ManifestPrint: React.FC<Props> = ({
  operatorName,
  issueNumber,
  scheduledAt,
  itemLines,
}) => {
  const items = RATION_MANIFEST.filter((i) => itemLines.includes(i.line))
  const byLine = (a: RationItem, b: RationItem) => a.line.localeCompare(b.line)

  return (
    <div className="lot-basics-manifest-print lot-basics-terminal p-32 text-[12px] leading-snug">
      <div className="flex items-baseline justify-between border-b-2 border-black pb-8 mb-16">
        <span className="uppercase tracking-widest">MANIFEST CARD — {MANUAL_REF}</span>
        <span>ISSUE {String(issueNumber).padStart(3, '0')}</span>
      </div>
      <div className="mb-16">
        <div>OPERATOR: {operatorName || 'UNASSIGNED'}</div>
        <div>SCHEDULED: {dayjs(scheduledAt).format('YYYY-MM-DD')}</div>
        <div>ITEMS: {items.length}</div>
      </div>
      <div className="border-t border-b border-black py-8">
        {items.sort(byLine).map((item) => (
          <div key={item.line} className="flex gap-x-16 py-2">
            <span className="w-[28px]">{item.line}</span>
            <span className="flex-1 uppercase">{item.nomenclature}</span>
            <span className="text-right">{item.spec}</span>
          </div>
        ))}
      </div>
      <div className="mt-16 text-[10px] uppercase tracking-widest">
        Issued. Not sold. LOT SYSTEMS CORPORATION — {MANUAL_REF}
      </div>
    </div>
  )
}
