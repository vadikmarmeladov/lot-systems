/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Calendar Alert Toast
 *
 * Watches timed Calendar entries and fires a military-grade notification
 * — toast + tactical chime + a "calendar_alert" Log entry — as each one
 * crosses into its T-15 / T-0 / overdue window. Fired alerts are logged
 * so the Log becomes the durable record of what was actually surfaced,
 * not just what was scheduled.
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useCreateLog, useLogs } from '#client/queries'
import { isRouteActive } from '#client/stores/router'
import dayjs from '#client/utils/dayjs'
import { playTacticalAlertChime } from '#client/utils/sovietKeyboard'
import { recordCalendarAlertSignal } from '#client/stores/intentionEngine'

type AlertWindow = 'T-15' | 'T-0' | 'OVERDUE'

type ActiveAlert = {
  key: string
  date: string
  time: string
  text: string
  entryType: string
  window: AlertWindow
}

const FIRED_KEY = 'calendar_alerts_fired'
const MAX_FIRED_KEYS = 200
const CHECK_INTERVAL_MS = 20000
const AUTO_HIDE_MS = 8000
const OVERDUE_GRACE_MIN = 30 // stop alerting once an entry is this far past its time

function loadFired(): Set<string> {
  try {
    const raw = localStorage.getItem(FIRED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch (_) {
    return new Set()
  }
}

function saveFired(fired: Set<string>) {
  try {
    const arr = Array.from(fired).slice(-MAX_FIRED_KEYS)
    localStorage.setItem(FIRED_KEY, JSON.stringify(arr))
  } catch (_) {}
}

function classifyWindow(minutesUntil: number): AlertWindow | null {
  if (minutesUntil <= -OVERDUE_GRACE_MIN) return null
  if (minutesUntil < 0) return 'OVERDUE'
  if (minutesUntil <= 1) return 'T-0'
  if (minutesUntil <= 15) return 'T-15'
  return null
}

export function CalendarAlertToast() {
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const queryClient = useQueryClient()

  const [activeAlert, setActiveAlert] = React.useState<ActiveAlert | null>(null)
  const firedRef = React.useRef<Set<string>>(loadFired())
  const hideTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    const scan = () => {
      if (document.hidden || !isRouteActive('system')) return

      const now = dayjs()
      const today = now.format('YYYY-MM-DD')

      const timedEntries = logs
        .filter(log => log.event === 'calendar_entry' && log.metadata?.date === today && log.metadata?.time)
        .map(log => ({
          date: log.metadata!.date as string,
          time: log.metadata!.time as string,
          text: (log.metadata!.text as string) || log.text || '',
          entryType: (log.metadata!.entryType as string) || 'note',
        }))

      for (const entry of timedEntries) {
        const target = dayjs(`${entry.date}T${entry.time}`)
        const minutesUntil = target.diff(now, 'minute')
        const win = classifyWindow(minutesUntil)
        if (!win) continue

        const dedupeKey = `${entry.date}|${entry.time}|${entry.text}|${win}`
        if (firedRef.current.has(dedupeKey)) continue

        firedRef.current.add(dedupeKey)
        saveFired(firedRef.current)

        setActiveAlert({ key: dedupeKey, date: entry.date, time: entry.time, text: entry.text, entryType: entry.entryType, window: win })

        try { playTacticalAlertChime() } catch (_) {}

        const dateLabel = target.format('dddd, MMMM D')
        createLog({
          text: `[ALERT] ${win} — ${entry.entryType}: ${entry.text} (${dateLabel} ${entry.time})`,
          event: 'calendar_alert',
          metadata: {
            date: entry.date,
            time: entry.time,
            text: entry.text,
            entryType: entry.entryType,
            window: win,
          },
        }, {
          onSuccess: () => {
            queryClient.refetchQueries(['/api/logs'])
            try { recordCalendarAlertSignal(entry.entryType, win) } catch (_) {}
          },
        })

        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        hideTimerRef.current = setTimeout(() => setActiveAlert(null), AUTO_HIDE_MS)

        break // surface one alert at a time; the rest pick up on the next scan
      }
    }

    scan()
    const interval = setInterval(scan, CHECK_INTERVAL_MS)
    return () => {
      clearInterval(interval)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [logs, createLog, queryClient])

  if (!activeAlert) return null

  return (
    <div
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50
                 px-16 py-8 border border-acc/30
                 bg-[var(--base-color)] grid-fill-light
                 uppercase tracking-widest"
      style={{
        animation: 'calendarAlertFadeInUp 0.3s ease-out, calendarAlertFadeOut 0.4s ease-in 7.5s forwards'
      }}
    >
      <div className="text-center">
        <div className="text-acc/40 mb-4">
          ALERT [{activeAlert.window}]
        </div>
        <div className="text-acc mb-4">
          {activeAlert.entryType}: {activeAlert.text}
        </div>
        <div className="text-acc/40 tabular-nums normal-case">
          ETA {activeAlert.time} · {dayjs(activeAlert.date).format('MMM D')}
        </div>
      </div>
    </div>
  )
}

// CSS animations — self-contained so this component doesn't depend on
// another widget having injected the same keyframes first.
const style = document.createElement('style')
style.textContent = `
  @keyframes calendarAlertFadeInUp {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  @keyframes calendarAlertFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
