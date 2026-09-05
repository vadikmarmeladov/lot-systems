/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Calendar Event Toast
 *
 * Military-grade terminal notification for the Calendar widget:
 * - CAL-ALERT fires once per scheduled entry on the day it's due
 * - TIME-LOG fires when a tracked time entry is saved to the Log
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { useLogs } from '#client/queries'
import dayjs from '#client/utils/dayjs'
import { isRouteActive } from '#client/stores/router'
import { $calendarNotification, type CalendarNotification } from '#client/stores/calendarNotifications'

const ALERTED_KEY = 'lot_calendar_alerted_entries'

function loadAlerted(): Set<string> {
  try {
    const raw = localStorage.getItem(ALERTED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch (_) {
    return new Set()
  }
}

function saveAlerted(set: Set<string>) {
  try {
    localStorage.setItem(ALERTED_KEY, JSON.stringify(Array.from(set).slice(-200)))
  } catch (_) {}
}

export function CalendarEventToast() {
  const { data: logs = [] } = useLogs()
  const pushed = useStore($calendarNotification)
  const [visible, setVisible] = React.useState<CalendarNotification | null>(null)

  // CAL-ALERT: a scheduled entry comes due today — fires once per entry per day
  React.useEffect(() => {
    const checkToday = () => {
      if (document.hidden || !isRouteActive('system')) return

      const today = dayjs().format('YYYY-MM-DD')
      const alerted = loadAlerted()

      const dueLog = logs.find(log => {
        if (log.event !== 'calendar_entry' || !log.metadata) return false
        const date = log.metadata.date as string | undefined
        const text = log.metadata.text as string | undefined
        return date === today && !!text && !alerted.has(`${date}::${text}`)
      })
      if (!dueLog || !dueLog.metadata) return

      const date = dueLog.metadata.date as string
      const text = dueLog.metadata.text as string
      const entryType = (dueLog.metadata.entryType as string) || 'note'

      alerted.add(`${date}::${text}`)
      saveAlerted(alerted)

      setVisible({
        id: `alert-${date}-${text}`,
        code: 'CAL-ALERT',
        title: entryType.toUpperCase(),
        lines: [text, 'SCHEDULED TODAY'],
      })
      setTimeout(() => setVisible(null), 8000)
    }

    checkToday()
    const interval = setInterval(checkToday, 60000)
    return () => clearInterval(interval)
  }, [logs])

  // TIME-LOG and any other ad-hoc notification pushed by CalendarWidget
  React.useEffect(() => {
    if (!pushed) return
    setVisible(pushed)
    const timeout = setTimeout(() => setVisible(null), 6000)
    return () => clearTimeout(timeout)
  }, [pushed])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50
                 px-16 py-8 border border-[rgb(var(--acc-color-default)/0.2)]
                 bg-[var(--base-color)] grid-fill-light font-mono"
      style={{ animation: 'calNotifyIn 0.4s ease-out, calNotifyOut 0.4s ease-in 5.6s forwards' }}
    >
      <div className="text-center">
        <div className="uppercase tracking-widest opacity-40 mb-4">[{visible.code}]</div>
        <div className="uppercase tracking-widest">{visible.title}</div>
        {visible.lines.map((line, i) => (
          <div key={i} className="opacity-60 mt-4 uppercase tracking-widest">{line}</div>
        ))}
      </div>
    </div>
  )
}

// CSS animations — self-contained keyframes, isolated names to avoid collisions with other toasts
const style = document.createElement('style')
style.textContent = `
  @keyframes calNotifyIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  @keyframes calNotifyOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
