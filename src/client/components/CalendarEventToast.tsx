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
 * Terminal Grid readout that fires when a timed Calendar entry comes due.
 * Polls the Log feed for `calendar_entry` rows scheduled for today with a
 * `time`, and surfaces the first one whose window has opened. Dedupes via
 * localStorage so a reminder never fires twice.
 */

import * as React from 'react'
import { useLogs } from '#client/queries'
import dayjs from '#client/utils/dayjs'
import { isRouteActive } from '#client/stores/router'

const SEEN_KEY = 'calendar_notified_v1'
const DUE_WINDOW_MIN = 10
const POLL_MS = 30_000
const AUTO_DISMISS_MS = 9_000

type DueEntry = {
  key: string
  date: string
  time: string
  entryType: string
  text: string
}

function loadSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch (_) {
    return new Set()
  }
}

function saveSeen(seen: Set<string>) {
  try {
    // Cap at the 200 most recent acknowledgements — this is a dedupe guard, not an archive.
    const trimmed = Array.from(seen).slice(-200)
    localStorage.setItem(SEEN_KEY, JSON.stringify(trimmed))
  } catch (_) {}
}

export function CalendarEventToast() {
  const { data: logs = [] } = useLogs()
  const [dueEntry, setDueEntry] = React.useState<DueEntry | null>(null)
  const dismissTimerRef = React.useRef<ReturnType<typeof setTimeout>>()

  React.useEffect(() => {
    const checkDue = () => {
      if (document.hidden || !isRouteActive('system')) return

      const now = dayjs()
      const today = now.format('YYYY-MM-DD')
      const seen = loadSeen()

      const candidates = logs
        .filter(log => log.event === 'calendar_entry' && log.metadata?.date === today && log.metadata?.time)
        .map(log => {
          const date = log.metadata!.date as string
          const time = log.metadata!.time as string
          const entryType = (log.metadata!.entryType as string) || 'note'
          const text = (log.metadata!.text as string) || log.text || ''
          return { key: `${date}|${time}|${text}`, date, time, entryType, text }
        })
        .filter(e => e.text && !seen.has(e.key))
        .filter(e => {
          const due = dayjs(`${e.date}T${e.time}`)
          const diffMin = now.diff(due, 'minute')
          return diffMin >= 0 && diffMin <= DUE_WINDOW_MIN
        })
        .sort((a, b) => a.time.localeCompare(b.time))

      if (candidates.length === 0) return

      const next = candidates[0]
      seen.add(next.key)
      saveSeen(seen)
      setDueEntry(next)

      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = setTimeout(() => setDueEntry(null), AUTO_DISMISS_MS)
    }

    checkDue()
    const interval = setInterval(checkDue, POLL_MS)
    return () => clearInterval(interval)
  }, [logs])

  React.useEffect(() => {
    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    }
  }, [])

  if (!dueEntry) return null

  return (
    <div
      className="fixed top-16 right-16 z-50 w-[min(320px,calc(100vw-32px))]
                 border border-acc/20 bg-[var(--base-color)] px-16 py-12
                 font-mono text-xs"
      style={{ animation: 'calendarToastIn 0.3s ease-out, calendarToastOut 0.4s ease-in 8.6s forwards' }}
      role="alert"
    >
      <div className="flex items-center justify-between mb-8">
        <span className="opacity-30 uppercase tracking-widest">CAL: EVENT DUE</span>
        <button
          className="opacity-30 hover:opacity-70 transition-opacity"
          onClick={() => setDueEntry(null)}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="uppercase tracking-widest opacity-60 mb-4">{dueEntry.entryType}</div>
      <div className="opacity-90 mb-8">{dueEntry.text}</div>
      <div className="opacity-40 tabular-nums">{dueEntry.date} {dueEntry.time}</div>
    </div>
  )
}

// CSS animations — module-scoped so this toast never depends on another
// component having mounted first to inject its keyframes.
if (typeof document !== 'undefined' && !document.getElementById('calendar-toast-keyframes')) {
  const style = document.createElement('style')
  style.id = 'calendar-toast-keyframes'
  style.textContent = `
    @keyframes calendarToastIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes calendarToastOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `
  document.head.appendChild(style)
}
