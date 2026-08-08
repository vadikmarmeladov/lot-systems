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
 * Military-grade event notifications for scheduled Calendar entries.
 * Watches timed calendar_entry logs and fires a T-MINUS pre-alert as an
 * entry approaches, then a SITREP alert the moment it comes due. Alerts
 * are deduplicated per browser (localStorage) so a reload doesn't repeat
 * a notice already delivered.
 */

import * as React from 'react'
import { useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import { isRouteActive } from '#client/stores/router'

const PRE_ALERT_WINDOW_MIN = 15
const OVERDUE_WINDOW_MIN = 5
const SEEN_KEY = 'calendar_alerts_seen'
const CHECK_INTERVAL_MS = 30000
const AUTO_HIDE_MS = 8000

type Tier = 'PRE' | 'DUE'

type Alert = {
  key: string
  tier: Tier
  minutes: number
  entryType: string
  text: string
  date: string
  time: string
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
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen].slice(-200)))
  } catch (_) {
    // localStorage unavailable — alerts still fire, just may repeat next session
  }
}

export function CalendarAlertToast() {
  const { data: logs = [] } = useLogs()
  const [alert, setAlert] = React.useState<Alert | null>(null)
  const seenRef = React.useRef<Set<string>>(loadSeen())

  React.useEffect(() => {
    const check = () => {
      if (document.hidden || !isRouteActive('system')) return

      const now = dayjs()
      const candidates = logs
        .filter(log => log.event === 'calendar_entry' && log.metadata?.time)
        .map(log => {
          const date = log.metadata?.date as string
          const time = log.metadata?.time as string
          const scheduled = dayjs(`${date}T${time}`)
          return {
            date,
            time,
            scheduled,
            entryType: (log.metadata?.entryType as string) || 'note',
            text: (log.metadata?.text as string) || log.text || '',
          }
        })
        .filter(e => e.scheduled.isValid())

      for (const c of candidates) {
        const diffMin = c.scheduled.diff(now, 'minute')
        let tier: Tier | null = null
        if (diffMin <= 0 && diffMin >= -OVERDUE_WINDOW_MIN) tier = 'DUE'
        else if (diffMin > 0 && diffMin <= PRE_ALERT_WINDOW_MIN) tier = 'PRE'
        if (!tier) continue

        const dedupeKey = `${c.date}_${c.time}_${c.text}_${tier}`
        if (seenRef.current.has(dedupeKey)) continue

        seenRef.current.add(dedupeKey)
        saveSeen(seenRef.current)
        setAlert({
          key: dedupeKey,
          tier,
          minutes: Math.max(0, diffMin),
          entryType: c.entryType,
          text: c.text,
          date: c.date,
          time: c.time,
        })

        const hideTimer = setTimeout(() => setAlert(null), AUTO_HIDE_MS)
        return () => clearTimeout(hideTimer)
      }
    }

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [logs])

  if (!alert) return null

  const label = alert.tier === 'DUE'
    ? '[SITREP] EVENT DUE'
    : `[T-MINUS ${alert.minutes}M]`

  return (
    <div
      className="fixed top-16 right-16 z-50 max-w-[320px]
                 px-16 py-8 border border-acc/30
                 bg-[var(--base-color)]
                 animate-fade-in-up"
      style={{ animation: 'fadeInUp 0.3s ease-out, fadeOut 0.4s ease-in 7.6s forwards' }}
    >
      <div
        className={cn(
          'uppercase tracking-widest text-acc/70 mb-4',
          alert.tier === 'DUE' && 'blink'
        )}
      >
        {label}
      </div>
      <div className="uppercase tracking-widest text-acc mb-1">
        {alert.entryType}
      </div>
      <div className="text-acc/80">{alert.text}</div>
      <div className="text-acc/40 mt-4 tabular-nums">{alert.date} · {alert.time}</div>
    </div>
  )
}

const style = document.createElement('style')
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
