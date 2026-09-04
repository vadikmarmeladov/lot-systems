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
 * Fires a terse, military-format notification the moment a scheduled
 * CalendarWidget entry comes due, and writes a `calendar_alert` log entry
 * so the event is permanently visible in Log.
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useCreateLog, useLogs } from '#client/queries'
import dayjs from '#client/utils/dayjs'
import { isRouteActive } from '#client/stores/router'
import { recordCalendarSignal } from '#client/stores/intentionEngine'

const STORAGE_KEY = 'lot_calendar_alerted_ids'
const DUE_WINDOW_MINUTES = 30 // fire for anything that came due within the last 30 min
const CHECK_INTERVAL_MS = 30000
const VISIBLE_MS = 8000

type Alert = {
  logId: string
  entryType: string
  time: string
  text: string
}

function loadAlertedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveAlertedIds(ids: Set<string>) {
  try {
    // Cap stored history so this never grows unbounded across years of entries
    const arr = Array.from(ids).slice(-500)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  } catch {}
}

export function CalendarAlertToast() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  const [alert, setAlert] = React.useState<Alert | null>(null)
  const alertedIdsRef = React.useRef<Set<string>>(loadAlertedIds())
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout>>()

  React.useEffect(() => {
    const check = () => {
      if (document.hidden || !isRouteActive('system')) return

      const removedIds = new Set(
        logs
          .filter(l => l.event === 'calendar_entry_removed' && l.metadata?.removedLogId)
          .map(l => l.metadata!.removedLogId as string)
      )

      const now = dayjs()
      const due = logs.find(l => {
        if (l.event !== 'calendar_entry' || !l.metadata?.time) return false
        if (removedIds.has(l.id) || alertedIdsRef.current.has(l.id)) return false
        const target = dayjs(`${l.metadata.date} ${l.metadata.time}`)
        if (!target.isValid()) return false
        const minutesPast = now.diff(target, 'minute')
        return minutesPast >= 0 && minutesPast <= DUE_WINDOW_MINUTES
      })

      if (!due) return

      alertedIdsRef.current.add(due.id)
      saveAlertedIds(alertedIdsRef.current)

      const entryType = (due.metadata?.entryType as string) || 'note'
      const time = due.metadata?.time as string
      const text = (due.metadata?.text as string) || due.text || ''

      setAlert({ logId: due.id, entryType, time, text })
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(() => setAlert(null), VISIBLE_MS)

      createLog({
        text: `[ALERT] ${entryType} due ${time}: ${text}`,
        event: 'calendar_alert',
        metadata: { sourceLogId: due.id, entryType, time, date: due.metadata?.date },
      }, {
        onSuccess: () => queryClient.refetchQueries(['/api/logs']),
      })

      try { recordCalendarSignal('alert', due.metadata?.date as string) } catch {}
    }

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)
    return () => {
      clearInterval(interval)
      clearTimeout(hideTimerRef.current)
    }
  }, [logs, createLog, queryClient])

  if (!alert) return null

  return (
    <div
      className="fixed top-16 right-16 z-50 max-w-[320px]
                 px-16 py-8 border border-[rgb(var(--acc-color-default)/0.3)]
                 bg-[var(--base-color)] uppercase tracking-widest text-xs"
      style={{ animation: 'calendarAlertFadeIn 0.3s ease-out' }}
    >
      <div className="opacity-40 mb-4">SCHEDULE ALERT // {alert.time}</div>
      <div className="opacity-90">{alert.entryType}: {alert.text}</div>
    </div>
  )
}

const style = document.createElement('style')
style.textContent = `
  @keyframes calendarAlertFadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
