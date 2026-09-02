/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Calendar Ops Toast
 *
 * Terse, military-grade notification for Calendar widget events — timer
 * engaged/secured, entries filed, day-of SITREPs. Mirrors the corner-toast
 * mechanics of EvolutionMilestoneToast but reads like an ops log line
 * rather than a celebration.
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { $calendarOpsEvent } from '#client/stores/calendarOps'

function formatZuluTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`
}

export function CalendarOpsToast() {
  const event = useStore($calendarOpsEvent)
  const [visible, setVisible] = React.useState(false)
  const lastShownTs = React.useRef<number>(0)
  const hideTimer = React.useRef<ReturnType<typeof setTimeout>>()

  React.useEffect(() => {
    if (!event || event.ts === lastShownTs.current) return
    lastShownTs.current = event.ts
    setVisible(true)

    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 5000)

    return () => clearTimeout(hideTimer.current)
  }, [event])

  if (!visible || !event) return null

  return (
    <div
      className="fixed bottom-16 right-16 z-50 max-w-[280px]
                 px-16 py-8 border border-[rgb(var(--acc-color-default)/0.2)]
                 bg-[var(--base-color)] grid-fill-light"
      style={{ animation: 'calendarOpsIn 0.35s ease-out, calendarOpsOut 0.4s ease-in 4.6s forwards' }}
    >
      <div className="text-acc/40 uppercase tracking-wide text-[11px] mb-2">
        [OPS // {event.code}] {formatZuluTime(event.ts)}
      </div>
      <div className="text-acc">
        {event.message}
      </div>
    </div>
  )
}

const style = document.createElement('style')
style.textContent = `
  @keyframes calendarOpsIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes calendarOpsOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
