/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Calendar Event Notification
 *
 * Terminal-grid style toast stack for Calendar widget events (entry logged,
 * time tracking engaged/logged). DTG-stamped, all-caps, stacks multiple
 * notices — distinct from EvolutionMilestoneToast (single-slot, bottom-center).
 */

import React from 'react'

export type CalendarNotice = {
  id: string
  code: string
  title: string
  detail?: string
  dtg: string
}

type Props = {
  notices: CalendarNotice[]
  onDismiss: (id: string) => void
}

export function CalendarEventNotifications({ notices, onDismiss }: Props) {
  if (notices.length === 0) return null

  return (
    <div className="fixed bottom-16 right-16 z-50 flex flex-col items-end gap-8 pointer-events-none">
      {notices.map(n => (
        <div
          key={n.id}
          onClick={() => onDismiss(n.id)}
          className="cal-notice pointer-events-auto font-mono text-[11px] leading-tight
                     border border-acc/30 bg-[var(--base-color)] grid-fill-light
                     px-12 py-8 min-w-[220px] max-w-[320px] cursor-pointer select-none"
        >
          <div className="flex items-center justify-between gap-8 text-acc/50 uppercase tracking-widest">
            <span>[{n.code}]</span>
            <span className="tabular-nums">{n.dtg}</span>
          </div>
          <div className="text-acc mt-2 uppercase tracking-widest">{n.title}</div>
          {n.detail && (
            <div className="text-acc/50 mt-1 tabular-nums">{n.detail}</div>
          )}
        </div>
      ))}
    </div>
  )
}

const style = document.createElement('style')
style.textContent = `
  .cal-notice {
    animation: calNoticeIn 0.25s ease-out;
  }

  @keyframes calNoticeIn {
    from {
      opacity: 0;
      transform: translateX(12px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
