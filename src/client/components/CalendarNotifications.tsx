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
 * Terminal-grid style event alerts for the Calendar widget: fires once per
 * entry per day when a scheduled item goes OVERDUE or comes DUE within the
 * next 15 minutes. Dedup state lives in localStorage so a page reload never
 * re-fires an alert already shown today.
 */

import * as React from 'react'
import { useLogs } from '#client/queries'
import { isRouteActive } from '#client/stores/router'
import dayjs from '#client/utils/dayjs'
import { CalendarEntry, isDueSoon, isOverdue, parseCalendarEntries } from '#client/utils/calendar'

const STORAGE_KEY = 'calendar_notified_v1'
const CHECK_INTERVAL_MS = 30_000
const VISIBLE_MS = 6_000

type Tier = 'DUE' | 'OVERDUE'

type QueuedAlert = {
  key: string
  tier: Tier
  entry: CalendarEntry
}

function readSeen(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch (_) {
    return {}
  }
}

function markSeen(key: string, day: string) {
  const seen = readSeen()
  seen[key] = day
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seen))
  } catch (_) {}
}

export function CalendarNotifications() {
  const { data: logs = [] } = useLogs()
  const [queue, setQueue] = React.useState<QueuedAlert[]>([])
  const [current, setCurrent] = React.useState<QueuedAlert | null>(null)

  React.useEffect(() => {
    const scan = () => {
      if (document.hidden || !isRouteActive('system')) return

      const now = dayjs()
      const today = now.format('YYYY-MM-DD')
      const seen = readSeen()
      const entries = parseCalendarEntries(logs)
      const fresh: QueuedAlert[] = []

      for (const entry of entries) {
        if (entry.done) continue
        const overdue = isOverdue(entry, now)
        const dueSoon = !overdue && isDueSoon(entry, now)
        if (!overdue && !dueSoon) continue

        const tier: Tier = overdue ? 'OVERDUE' : 'DUE'
        const key = `${entry.id}:${tier}`
        if (seen[key] === today) continue

        fresh.push({ key, tier, entry })
      }

      if (fresh.length) {
        fresh.forEach(a => markSeen(a.key, today))
        setQueue(q => [...q, ...fresh])
      }
    }

    scan()
    const interval = setInterval(scan, CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [logs])

  React.useEffect(() => {
    if (current || queue.length === 0) return
    const [next, ...rest] = queue
    setCurrent(next)
    setQueue(rest)
    const timeout = setTimeout(() => setCurrent(null), VISIBLE_MS)
    return () => clearTimeout(timeout)
  }, [queue, current])

  if (!current) return null

  const { tier, entry } = current
  const label = tier === 'OVERDUE' ? 'SCHEDULE // OVERDUE' : 'SCHEDULE // DUE'

  return (
    <div
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50
                 px-16 py-8 border border-acc/20 bg-[var(--base-color)]
                 max-w-[90vw]"
      style={{ animation: 'fadeInUp 0.3s ease-out, fadeOut 0.4s ease-in 5.6s forwards' }}
    >
      <div className="text-center">
        <div className="text-acc/40 uppercase tracking-wide mb-2 text-[0.85em]">
          [{label}]
        </div>
        <div className="text-acc capitalize">
          {entry.type}{entry.time ? ` ${entry.time}` : ''} — {entry.text}
        </div>
      </div>
    </div>
  )
}

// Shares keyframe names with EvolutionMilestoneToast; harmless if both inject them.
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
