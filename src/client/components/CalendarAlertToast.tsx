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
 * Military-grade briefing notification for scheduled calendar entries.
 * Fires once an entry's reminder window opens, plays a tactical alert
 * tone, and logs the event to the Log field (CAL-RMD:).
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useCreateLog, useLogs } from '#client/queries'
import dayjs from '#client/utils/dayjs'
import { playTacticalAlert } from '#client/utils/tacticalAlert'
import { entryKey, parseCalendarEntries, getCompletedEntryKeys, type CalendarEntry } from './CalendarWidget'

const STORAGE_KEY = 'lot_calendar_reminders_fired'
const CHECK_INTERVAL_MS = 15000
const DISPLAY_MS = 9000

type Alert = {
  key: string
  entry: CalendarEntry
}

function loadFiredKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch (_) {
    return new Set()
  }
}

function saveFiredKeys(keys: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(keys).slice(-200)))
  } catch (_) {}
}

export function CalendarAlertToast() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  const [queue, setQueue] = React.useState<Alert[]>([])
  const [active, setActive] = React.useState<Alert | null>(null)
  const firedRef = React.useRef<Set<string>>(loadFiredKeys())

  const entries = React.useMemo(() => parseCalendarEntries(logs), [logs])
  const completedKeys = React.useMemo(() => getCompletedEntryKeys(logs), [logs])

  // Scan for entries entering their reminder window
  React.useEffect(() => {
    const check = () => {
      const now = dayjs()
      const due: Alert[] = []

      entries.forEach(entry => {
        if (!entry.time || !entry.reminderMinutes) return
        const key = entryKey(entry)
        if (completedKeys.has(key)) return
        if (firedRef.current.has(key)) return

        const at = dayjs(`${entry.date} ${entry.time}`)
        if (!at.isValid()) return

        const triggerAt = at.subtract(entry.reminderMinutes, 'minute')
        if (now.isAfter(triggerAt) && now.isBefore(at)) {
          due.push({ key, entry })
        }
      })

      if (due.length === 0) return

      due.forEach(d => firedRef.current.add(d.key))
      saveFiredKeys(firedRef.current)
      setQueue(prev => [...prev, ...due])

      due.forEach(d => {
        createLog({
          text: `[ALERT] ${d.entry.type}: ${d.entry.text} — T-${d.entry.reminderMinutes}M`,
          event: 'calendar_reminder_fired',
          metadata: {
            date: d.entry.date,
            text: d.entry.text,
            entryType: d.entry.type,
            entryKey: d.key,
            leadMinutes: d.entry.reminderMinutes,
            scheduledTime: d.entry.time,
          },
        }, {
          onSuccess: () => queryClient.refetchQueries(['/api/logs']),
        })
      })
    }

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [entries, completedKeys, createLog, queryClient])

  // Drain the queue one alert at a time
  React.useEffect(() => {
    if (active || queue.length === 0) return

    const [next, ...rest] = queue
    setActive(next)
    setQueue(rest)
    try {
      playTacticalAlert()
    } catch (_) {}

    const timeout = setTimeout(() => setActive(null), DISPLAY_MS)
    return () => clearTimeout(timeout)
  }, [active, queue])

  if (!active) return null

  const at = dayjs(`${active.entry.date} ${active.entry.time}`)

  return (
    <div
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50
                 px-16 py-12 border border-acc/40 bg-bac text-acc
                 font-mono tracking-widest text-sm"
      style={{ animation: 'tacticalFadeIn 0.3s ease-out, tacticalFadeOut 0.4s ease-in 8.6s forwards' }}
    >
      <div className="flex items-start gap-16">
        <div className="opacity-40 select-none">◤</div>
        <div>
          <div className="opacity-50 mb-4">INCOMING — {active.entry.type.toUpperCase()}</div>
          <div className="mb-4 tracking-normal">{active.entry.text}</div>
          <div className="opacity-40 tabular-nums">
            {at.format('HH:mm')} &middot; T-{active.entry.reminderMinutes}M
          </div>
        </div>
        <div className="opacity-40 select-none">◢</div>
        <button
          className="opacity-30 hover:opacity-70 transition-opacity ml-8"
          onClick={() => setActive(null)}
        >
          ×
        </button>
      </div>
    </div>
  )
}

// CSS animations for the tactical alert toast
const style = document.createElement('style')
style.textContent = `
  @keyframes tacticalFadeIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes tacticalFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
