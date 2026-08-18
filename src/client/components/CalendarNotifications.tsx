/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Calendar Notifications
 *
 * Watches Calendar entries carrying a scheduled time and fires a
 * military-grade "SCHEDULE ALERT" toast + klaxon when their reminder
 * window arrives. Every fired alert is logged back into the Log system
 * (event: calendar_notification) so the notification itself is tracked.
 */

import * as React from 'react'
import { useCreateLog, useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import { playAlertKlaxon } from '#client/utils/alertKlaxon'

type PendingAlert = {
  key: string
  time: string
  text: string
  type: string
}

const STORAGE_KEY = 'calendar_notified_v1'
const CHECK_INTERVAL_MS = 20000
// Grace window after the fire time during which a missed tick still notifies
const FIRE_WINDOW_MIN = 3
const TOAST_MS = 8000
const MAX_STORED_KEYS = 500

function readNotified(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch (_) {
    return new Set()
  }
}

function writeNotified(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set).slice(-MAX_STORED_KEYS)))
  } catch (_) {}
}

export function CalendarNotifications() {
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const [queue, setQueue] = React.useState<PendingAlert[]>([])
  const [active, setActive] = React.useState<PendingAlert | null>(null)
  const notifiedRef = React.useRef<Set<string> | null>(null)
  if (notifiedRef.current === null) notifiedRef.current = readNotified()

  const entries = React.useMemo(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata?.date && log.metadata?.time)
      .map(log => ({
        date: log.metadata?.date as string,
        time: log.metadata?.time as string,
        text: (log.metadata?.text as string) || log.text || '',
        type: (log.metadata?.entryType as string) || 'note',
        reminderMinutes:
          typeof log.metadata?.reminderMinutes === 'number' ? log.metadata.reminderMinutes : 0,
      }))
  }, [logs])

  React.useEffect(() => {
    const check = () => {
      if (document.hidden) return
      const now = dayjs()
      const notified = notifiedRef.current!

      entries.forEach(entry => {
        const key = `${entry.date}T${entry.time}:${entry.text}`
        if (notified.has(key)) return

        const eventAt = dayjs(`${entry.date}T${entry.time}`)
        const fireAt = eventAt.subtract(entry.reminderMinutes, 'minute')
        const minutesSinceFire = now.diff(fireAt, 'minute')

        if (minutesSinceFire >= 0 && minutesSinceFire <= FIRE_WINDOW_MIN) {
          notified.add(key)
          writeNotified(notified)
          setQueue(q => [...q, { key, time: eventAt.format('HH:mm'), text: entry.text, type: entry.type }])
          createLog({
            text: `[ALERT] ${entry.type}: ${entry.text} (${eventAt.format('HH:mm')})`,
            event: 'calendar_notification',
            metadata: { date: entry.date, time: entry.time, text: entry.text, entryType: entry.type },
          })
        }
      })
    }

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', check)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', check)
    }
  }, [entries, createLog])

  React.useEffect(() => {
    if (active || queue.length === 0) return

    const [next, ...rest] = queue
    setActive(next)
    setQueue(rest)
    try { playAlertKlaxon() } catch (_) {}

    const timeout = setTimeout(() => setActive(null), TOAST_MS)
    return () => clearTimeout(timeout)
  }, [active, queue])

  if (!active) return null

  return (
    <div
      className={cn(
        'fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50',
        'px-16 py-12 border border-acc bg-[var(--base-color)] grid-fill-light'
      )}
      style={{ animation: 'calendarAlertIn 0.3s ease-out, calendarAlertOut 0.3s ease-in 7.5s forwards' }}
    >
      <div className="flex items-center gap-8">
        <span className="calendar-alert-blink text-acc">◆</span>
        <div className="text-left">
          <div className="text-acc/50 tracking-widest uppercase">
            [ SCHEDULE ALERT // {active.time} ]
          </div>
          <div className="text-acc uppercase">
            {active.type}: {active.text}
          </div>
        </div>
        <span className="calendar-alert-blink text-acc">◆</span>
      </div>
    </div>
  )
}

const style = document.createElement('style')
style.textContent = `
  @keyframes calendarAlertIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes calendarAlertOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes calendarAlertBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.15; }
  }
  .calendar-alert-blink {
    animation: calendarAlertBlink 1s step-start infinite;
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
