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
 * Watches scheduled calendar entries and fires a terminal-grid alert when
 * one comes due. Firing is idempotent and durable: every fire is written
 * back to the Log as a `calendar_event_fired` event keyed by entryId, so a
 * refresh, a tab switch, or a dropped connection never produces a repeat
 * alert for the same event.
 */

import * as React from 'react'
import { useLogs, useCreateLog } from '#client/queries'
import { useQueryClient } from 'react-query'
import dayjs from '#client/utils/dayjs'
import { isRouteActive } from '#client/stores/router'

const CHECK_INTERVAL_MS = 30000
const DUE_WINDOW_MINUTES = 15 // grace window after the scheduled time
const DEFAULT_HOUR = 9 // fallback local time for entries with no explicit time
const DISPLAY_MS = 12000

type DueEntry = {
  id: string
  type: string
  text: string
  date: string
  time: string | null
}

function targetMoment(date: string, time: string | null) {
  const [y, m, d] = date.split('-').map(Number)
  let target = dayjs().year(y).month(m - 1).date(d).second(0).millisecond(0)
  if (time) {
    const [hh, mm] = time.split(':').map(Number)
    return target.hour(hh).minute(mm)
  }
  return target.hour(DEFAULT_HOUR).minute(0)
}

export function CalendarEventNotification() {
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const queryClient = useQueryClient()
  const [active, setActive] = React.useState<DueEntry | null>(null)
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  // Ids fired this session but not yet reflected in a refetched log list —
  // prevents re-firing on the next tick while the mutation is in flight.
  const inFlightRef = React.useRef<Set<string>>(new Set())

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  React.useEffect(() => {
    const check = () => {
      if (document.hidden || !isRouteActive('system')) return

      const resolvedIds = new Set<string>()
      logs.forEach(log => {
        if (log.event !== 'calendar_event_fired' && log.event !== 'calendar_entry_status') return
        const id = (log.metadata?.entryId as string) || undefined
        if (id) resolvedIds.add(id)
      })

      const now = dayjs()
      let due: DueEntry | null = null

      for (const log of logs) {
        if (log.event !== 'calendar_entry' || !log.metadata) continue
        const id = log.metadata.id as string | undefined
        if (!id || resolvedIds.has(id) || inFlightRef.current.has(id)) continue

        const date = log.metadata.date as string | undefined
        if (!date) continue
        const time = (log.metadata.time as string) || null

        const minutesSince = now.diff(targetMoment(date, time), 'minute')
        if (minutesSince >= 0 && minutesSince <= DUE_WINDOW_MINUTES) {
          due = {
            id,
            type: (log.metadata.entryType as string) || 'note',
            text: (log.metadata.text as string) || log.text || '',
            date,
            time,
          }
          break
        }
      }

      if (!due) return

      inFlightRef.current.add(due.id)
      setActive(due)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(() => setActive(null), DISPLAY_MS)

      createLog({
        text: `[ALERT] Scheduled event fired: ${due.text}`,
        event: 'calendar_event_fired',
        metadata: { entryId: due.id, date: due.date, time: due.time },
      }, {
        onSuccess: () => queryClient.refetchQueries(['/api/logs']),
      })
    }

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [logs, createLog, queryClient])

  if (!active) return null

  return (
    <div
      className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50
                 px-16 py-8 border border-[rgb(var(--acc-color-default)/0.3)]
                 bg-[var(--base-color)] grid-fill-light font-mono"
      style={{ animation: 'calNotifyIn 0.3s ease-out, calNotifyOut 0.4s ease-in 11.5s forwards' }}
      role="alert"
    >
      <div className="flex items-center gap-8 whitespace-nowrap">
        <span className="uppercase tracking-widest opacity-40 text-xs">[ ALERT ]</span>
        <span className="uppercase tracking-widest opacity-70 text-xs">
          {active.time || 'SCHED'}
        </span>
        <span className="uppercase tracking-widest">
          {active.type}: {active.text}
        </span>
      </div>
    </div>
  )
}

const style = document.createElement('style')
style.textContent = `
  @keyframes calNotifyIn {
    from { opacity: 0; transform: translate(-50%, -8px); }
    to   { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes calNotifyOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
