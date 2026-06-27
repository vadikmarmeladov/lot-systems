/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// Calendar Notification Toast — military-grade schedule alerts with Log integration

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useCreateLog, useLogs } from '#client/queries'
import dayjs from '#client/utils/dayjs'
import type { CalendarEntry } from './CalendarWidget'

type EntryType = 'note' | 'task' | 'call'

type QueuedAlert = {
  entry: CalendarEntry
  alertKey: string
  countdown: string
}

const FIRED_STORAGE_KEY = 'lot_calendar_alerts_fired'
const VISIBLE_MS = 9000

function getFiredAlerts(): Set<string> {
  try {
    const raw = localStorage.getItem(FIRED_STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function markAlertFired(key: string): void {
  try {
    const fired = getFiredAlerts()
    fired.add(key)
    const arr = [...fired].slice(-2000)
    localStorage.setItem(FIRED_STORAGE_KEY, JSON.stringify(arr))
  } catch {}
}

function buildAlerts(entries: CalendarEntry[]): QueuedAlert[] {
  const now = dayjs()
  const today = now.format('YYYY-MM-DD')
  const fired = getFiredAlerts()
  const alerts: QueuedAlert[] = []

  for (const entry of entries) {
    if (entry.date < today) continue

    if (entry.time) {
      const eventTime = dayjs(`${entry.date} ${entry.time}`)
      const diff = eventTime.diff(now, 'minute')

      const windows: Array<[number, number, string]> = [
        [55, 65, 'T-60'],
        [25, 35, 'T-30'],
        [-2, 8, 'T-0'],
      ]
      for (const [lo, hi, label] of windows) {
        if (diff >= lo && diff <= hi) {
          const key = `${entry.id}:${label}`
          if (!fired.has(key)) alerts.push({ entry, alertKey: key, countdown: label === 'T-0' ? 'NOW' : label + 'MIN' })
        }
      }
    } else if (entry.date === today) {
      const key = `${entry.id}:today`
      if (!fired.has(key)) alerts.push({ entry, alertKey: key, countdown: 'TODAY' })
    }
  }

  return alerts
}

const TYPE_LABEL: Record<EntryType, string> = {
  note: 'NOTE',
  task: 'TASK',
  call: 'CALL',
}

export function CalendarNotificationToast() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata?.date)
      .map(log => ({
        id: log.id,
        date: log.metadata!.date as string,
        text: (log.metadata!.text as string) || log.text || '',
        type: ((log.metadata!.entryType as EntryType) || 'note') as EntryType,
        time: log.metadata!.time as string | undefined,
      }))
  }, [logs])

  const [queue, setQueue] = React.useState<QueuedAlert[]>([])
  const [current, setCurrent] = React.useState<QueuedAlert | null>(null)
  const [visible, setVisible] = React.useState(false)
  const dismissTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Polling check every 60s
  React.useEffect(() => {
    const check = () => {
      const alerts = buildAlerts(entries)
      if (alerts.length > 0) {
        setQueue(prev => [...prev, ...alerts])
      }
    }
    check()
    const interval = setInterval(check, 60 * 1000)
    return () => clearInterval(interval)
  }, [entries])

  // Drain queue
  React.useEffect(() => {
    if (queue.length > 0 && !visible) {
      const next = queue[0]
      setQueue(prev => prev.slice(1))
      setCurrent(next)
      setVisible(true)
      markAlertFired(next.alertKey)

      const typeLabel = TYPE_LABEL[next.entry.type as EntryType] || 'NOTE'
      const timeStr = next.entry.time ? ` @ ${next.entry.time}` : ''
      const dateLabel = dayjs(next.entry.date).format('ddd, MMM D, YYYY').toUpperCase()

      createLog({
        text: `[SCHEDULE ALERT] [${typeLabel}] ${next.entry.text}${timeStr} — ${next.countdown} — ${dateLabel}`,
        event: 'calendar_alert',
        metadata: {
          entryId: next.entry.id,
          date: next.entry.date,
          entryType: next.entry.type,
          countdown: next.countdown,
        },
      }, {
        onSuccess: () => queryClient.refetchQueries(['/api/logs']),
      })

      dismissTimer.current = setTimeout(() => {
        setVisible(false)
        setCurrent(null)
      }, VISIBLE_MS)
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [queue, visible])

  if (!visible || !current) return null

  const typeLabel = TYPE_LABEL[current.entry.type as EntryType] || 'NOTE'
  const timeStr = current.entry.time ? ` — ${current.entry.time}` : ''
  const dateStr = dayjs(current.entry.date).format('ddd, MMMM D, YYYY').toUpperCase()

  return (
    <div
      className="fixed top-16 right-16 z-[9999] border border-acc/30 bg-base"
      style={{ minWidth: '260px', maxWidth: '340px', padding: '12px 16px' }}
    >
      <div
        className="text-acc/30 mb-8"
        style={{ fontSize: '10px', letterSpacing: '0.25em' }}
      >
        ◈ SCHEDULE ALERT ◈
      </div>
      <div
        className="text-acc/50 mb-4"
        style={{ fontSize: '11px', letterSpacing: '0.15em' }}
      >
        [{typeLabel}]
      </div>
      <div className="text-acc mb-8 leading-snug">
        {current.entry.text}{timeStr}
      </div>
      <div
        className="text-acc/40"
        style={{ fontSize: '10px', letterSpacing: '0.15em' }}
      >
        {dateStr}
      </div>
      <div
        className="text-acc/70 mt-8"
        style={{ fontSize: '11px', letterSpacing: '0.3em' }}
      >
        {current.countdown}
      </div>
    </div>
  )
}
