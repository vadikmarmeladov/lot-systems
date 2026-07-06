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
 * Military-grade notification for the Calendar widget: surfaces OVERDUE and
 * TODAY schedule entries without polling a server — reads the same /api/logs
 * cache the widget itself uses. Dedupes per entry-set signature in
 * localStorage so a dismissed alert does not reappear until the underlying
 * set of due entries actually changes.
 */

import * as React from 'react'
import { useLogs } from '#client/queries'
import { getActiveCalendarEntries } from '#client/components/CalendarWidget'
import dayjs from '#client/utils/dayjs'

const SEEN_KEY = 'calendar_alert_seen'
const CHECK_INTERVAL_MS = 60 * 1000
const AUTO_HIDE_MS = 12 * 1000

export function CalendarAlertToast() {
  const { data: logs = [] } = useLogs()
  const [visible, setVisible] = React.useState(false)
  const [signature, setSignature] = React.useState('')
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const { overdue, today } = React.useMemo(() => {
    const todayKey = dayjs().format('YYYY-MM-DD')
    const active = getActiveCalendarEntries(logs)
    return {
      overdue: active.filter(e => e.date < todayKey),
      today: active.filter(e => e.date === todayKey),
    }
  }, [logs])

  const items = React.useMemo(() => [...overdue, ...today], [overdue, today])

  React.useEffect(() => {
    const sig = items.map(e => e.id).sort().join(',')
    setSignature(sig)

    const check = () => {
      if (!sig) return
      const seen = window.localStorage.getItem(SEEN_KEY)
      if (seen === sig) return

      setVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS)
    }

    check()
    const interval = setInterval(check, CHECK_INTERVAL_MS)
    return () => {
      clearInterval(interval)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [items])

  const dismiss = () => {
    if (signature) window.localStorage.setItem(SEEN_KEY, signature)
    setVisible(false)
  }

  if (!visible || items.length === 0) return null

  return (
    <div
      className="fixed bottom-16 right-16 z-50 max-w-[320px] border border-acc/20
                 bg-[var(--base-color)] px-16 py-12"
    >
      <div className="flex items-center justify-between mb-8">
        <span className="text-acc uppercase tracking-widest">CAL: ALERT</span>
        <button
          onClick={dismiss}
          className="text-acc/30 hover:text-acc/60 transition-opacity"
        >
          ×
        </button>
      </div>

      {overdue.length > 0 && (
        <div className="text-acc/80 tabular-nums tracking-widest mb-4">
          OVERDUE: {overdue.length}
        </div>
      )}
      {today.length > 0 && (
        <div className="text-acc/80 tabular-nums tracking-widest mb-4">
          TODAY: {today.length}
        </div>
      )}

      <div className="space-y-1 mt-8">
        {items.slice(0, 4).map(entry => (
          <div key={entry.id} className="text-acc/60 truncate">
            <span className="uppercase tracking-widest opacity-60">{entry.type}</span>
            {' · '}
            {entry.text}
          </div>
        ))}
        {items.length > 4 && (
          <div className="text-acc/30 tabular-nums">+{items.length - 4} more</div>
        )}
      </div>
    </div>
  )
}
