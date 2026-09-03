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
 * Military-grade event notification for scheduled Calendar entries. Watches
 * timed calendar_entry logs and fires a terminal-style alert as each one's
 * scheduled time arrives — the visual counterpart to the CAL: entry Logs
 * writes and the T-MINUS readout in CalendarWidget.
 */

import * as React from 'react'
import { useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'

const FIRED_KEY = 'calendar_alerts_fired'
const LOOKAHEAD_MS = 15 * 60 * 1000 // arm up to 15 min ahead of the scheduled time
const GRACE_MS = 2 * 60 * 1000 // stay eligible up to 2 min after, in case of a missed tick
const VISIBLE_MS = 8000
const SECTOR: Record<string, string> = { note: 'NOTE', task: 'TASK', call: 'CALL' }

type ArmedEntry = {
  id: string
  entryType: string
  text: string
  date: string
  time: string
}

function readFired(): Set<string> {
  try {
    const raw = localStorage.getItem(FIRED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch (_) {
    return new Set()
  }
}

function markFired(id: string) {
  try {
    const fired = readFired()
    fired.add(id)
    // Cap the stored set — only the most recent 200 ids matter.
    const trimmed = Array.from(fired).slice(-200)
    localStorage.setItem(FIRED_KEY, JSON.stringify(trimmed))
  } catch (_) {}
}

export function CalendarAlertToast() {
  const { data: logs = [] } = useLogs()
  const [active, setActive] = React.useState<ArmedEntry | null>(null)
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const scan = () => {
      if (document.hidden) return
      if (active) return

      const nowMs = Date.now()
      const fired = readFired()

      const due = logs.find(log => {
        if (log.event !== 'calendar_entry') return false
        if (fired.has(log.id)) return false
        const date = log.metadata?.date as string | undefined
        const time = log.metadata?.time as string | undefined
        if (!date || !time) return false
        const target = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm')
        if (!target.isValid()) return false
        const deltaMs = target.valueOf() - nowMs
        return deltaMs <= LOOKAHEAD_MS && deltaMs >= -GRACE_MS
      })

      if (!due) return

      markFired(due.id)
      setActive({
        id: due.id,
        entryType: SECTOR[(due.metadata?.entryType as string) || 'note'] || 'EVENT',
        text: (due.metadata?.text as string) || due.text || '—',
        date: due.metadata?.date as string,
        time: due.metadata?.time as string,
      })

      hideTimerRef.current = setTimeout(() => setActive(null), VISIBLE_MS)
    }

    scan()
    const interval = setInterval(scan, 30000)
    return () => {
      clearInterval(interval)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [logs, active])

  if (!active) return null

  const target = dayjs(`${active.date} ${active.time}`, 'YYYY-MM-DD HH:mm')
  const status = target.isAfter(dayjs()) ? 'ARMED' : 'NOW'

  return (
    <div
      className={cn(
        'fixed bottom-16 left-1/2 -translate-x-1/2 z-50',
        'px-16 py-8 border border-acc/30 bg-[var(--base-color)]',
        'uppercase tracking-widest tabular-nums text-center',
      )}
      style={{ animation: 'fadeInUp 0.3s ease-out, fadeOut 0.4s ease-in 7.6s forwards' }}
      role="alert"
    >
      <div className="flex items-center justify-center gap-8 text-acc/50">
        <span className="blink">●</span>
        <span>// SCHEDULED EVENT — {status} //</span>
      </div>
      <div className="mt-4 text-acc">
        {active.entryType} · {active.time}
      </div>
      <div className="mt-4 text-acc/60 normal-case tracking-normal">
        {active.text}
      </div>
    </div>
  )
}

// fadeInUp/fadeOut are shared with EvolutionMilestoneToast; inject defensively
// so this component also works standalone if that one isn't mounted.
if (typeof document !== 'undefined' && !document.getElementById('calendar-alert-toast-keyframes')) {
  const style = document.createElement('style')
  style.id = 'calendar-alert-toast-keyframes'
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
  document.head.appendChild(style)
}
