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
 * Military-grade Terminal Grid notification for time-tracked Calendar
 * entries. Watches Log for `calendar_entry` rows and fires one alert per
 * entry per threshold — T-MINUS 15, EXECUTE, OVERDUE — each written back
 * into Log as `calendar_alert_fired` so the alert trail is reliable and
 * auditable, not just a client-side toast.
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useCreateLog, useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import {
  getCalendarEntries,
  getEntryMoment,
  OVERDUE_GRACE_MINUTES,
  DUE_SOON_MINUTES,
} from '#client/utils/calendarEntries'
import { recordCalendarAlertSignal } from '#client/stores/intentionEngine'

type AlertKind = 't_minus_15' | 'execute' | 'overdue'

const ALERT_LABEL: Record<AlertKind, string> = {
  t_minus_15: 'T-MINUS 15',
  execute: 'EXECUTE',
  overdue: 'OVERDUE',
}

const STORAGE_KEY = 'calendar_alerts_fired'
const CHECK_INTERVAL_MS = 20000
const AUTO_HIDE_MS = 9000

function loadFired(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveFired(fired: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(fired)))
  } catch {
    // localStorage unavailable — alerts still fire this session, just may repeat next load
  }
}

type ActiveAlert = {
  kind: AlertKind
  entryType: string
  text: string
  date: string
  time?: string
}

export function CalendarAlertToast() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  const [activeAlert, setActiveAlert] = React.useState<ActiveAlert | null>(null)
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => {
    const check = () => {
      const now = dayjs()
      const entries = getCalendarEntries(logs).filter(e => !e.completed)
      const fired = loadFired()
      let dirty = false
      let toSurface: ActiveAlert | null = null

      for (const entry of entries) {
        const moment = getEntryMoment(entry)
        const diffMin = moment.diff(now, 'minute')
        const entryKey = `${entry.date}|${entry.time || ''}|${entry.text}`

        let kind: AlertKind | null = null
        if (diffMin <= 0 && diffMin > -OVERDUE_GRACE_MINUTES && !fired.has(`${entryKey}|execute`)) {
          kind = 'execute'
        } else if (diffMin > 0 && diffMin <= DUE_SOON_MINUTES && !fired.has(`${entryKey}|t_minus_15`)) {
          kind = 't_minus_15'
        } else if (diffMin <= -OVERDUE_GRACE_MINUTES && !fired.has(`${entryKey}|overdue`)) {
          kind = 'overdue'
        }

        if (!kind) continue

        fired.add(`${entryKey}|${kind}`)
        dirty = true

        if (!toSurface) {
          toSurface = { kind, entryType: entry.type, text: entry.text, date: entry.date, time: entry.time }
        }

        createLog({
          text: `[CAL-ALERT] ${ALERT_LABEL[kind]}: ${entry.type}: ${entry.text}`,
          event: 'calendar_alert_fired',
          metadata: {
            alertType: kind,
            date: entry.date,
            time: entry.time,
            entryType: entry.type,
            text: entry.text,
          },
        }, {
          onSuccess: () => queryClient.refetchQueries(['/api/logs']),
        })
        try { recordCalendarAlertSignal(kind, entry.type) } catch (_) {}
      }

      if (dirty) saveFired(fired)

      if (toSurface) {
        setActiveAlert(toSurface)
        if (hideTimer.current) clearTimeout(hideTimer.current)
        hideTimer.current = setTimeout(() => setActiveAlert(null), AUTO_HIDE_MS)
      }
    }

    check()
    const id = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [logs, createLog, queryClient])

  React.useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  if (!activeAlert) return null

  const isOverdue = activeAlert.kind === 'overdue'

  return (
    <div
      className="fixed top-16 right-16 z-50 max-w-[320px] px-16 py-8 border border-acc/30 bg-[var(--base-color)] grid-fill-light"
      style={{ animation: 'calAlertIn 0.3s ease-out' }}
    >
      <div className="flex items-center gap-8 mb-4">
        <span className={cn('inline-block w-[6px] h-[6px] bg-acc', isOverdue ? 'animate-pulse' : 'opacity-60')} />
        <span className="uppercase tracking-widest text-acc/80 evolved-glow whitespace-nowrap">
          [ CAL-ALERT // {ALERT_LABEL[activeAlert.kind]} ]
        </span>
      </div>
      <div className="uppercase tracking-widest text-acc/40 mb-4">{activeAlert.entryType}</div>
      <div className="text-acc/70">{activeAlert.text}</div>
      <div className="text-acc/30 tabular-nums">
        {activeAlert.date}{activeAlert.time ? ` · ${activeAlert.time}` : ''}
      </div>
    </div>
  )
}

// Toast entrance animation — mirrors EvolutionMilestoneToast's injection pattern
const style = document.createElement('style')
style.textContent = `
  @keyframes calAlertIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
