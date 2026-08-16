/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { Block, Button } from '#client/components/ui'
import { useCreateLog, useLogs } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import { recordCalendarSignal } from '#client/stores/intentionEngine'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  id: string
  date: string
  time: string | null
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const NOTIFIED_KEY = 'calendar_notified_ids_v1'
// Don't fire alerts for entries scheduled more than this long ago — avoids a
// backlog dump when the widget first sees old entries or after a long time away.
const ALERT_GRACE_MS = 12 * 60 * 60 * 1000
const ALERT_POLL_MS = 20 * 1000
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/

function loadNotifiedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw))
  } catch (_) {
    return new Set()
  }
}

function saveNotifiedIds(ids: Set<string>) {
  try {
    // Cap stored history so this doesn't grow unbounded over long-lived sessions.
    const arr = Array.from(ids).slice(-500)
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(arr))
  } catch (_) {}
}

function entryDateTime(entry: CalendarEntry): Dayjs | null {
  if (!entry.time) return null
  return dayjs(`${entry.date}T${entry.time}`)
}

function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000))
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return `${days}D ${String(hours).padStart(2, '0')}H`
  return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`
}

function getMonthWeeks(year: number, month: number): Dayjs[][] {
  const first = dayjs().year(year).month(month).startOf('month')
  const last = dayjs().year(year).month(month).endOf('month')

  let isoDay = first.day() === 0 ? 6 : first.day() - 1
  const start = first.subtract(isoDay, 'day')

  const weeks: Dayjs[][] = []
  let current = start

  while (current.isBefore(last) || current.isSame(last, 'day') || weeks.length < 5) {
    const week: Dayjs[] = []
    for (let i = 0; i < 7; i++) {
      week.push(current)
      current = current.add(1, 'day')
    }
    weeks.push(week)
    if (weeks.length >= 6) break
  }

  return weeks
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [entryTime, setEntryTime] = React.useState('')
  const [alertQueue, setAlertQueue] = React.useState<CalendarEntry[]>([])
  const [activeAlert, setActiveAlert] = React.useState<CalendarEntry | null>(null)
  const [now, setNow] = React.useState(() => dayjs())
  const notifiedIdsRef = React.useRef<Set<string>>(loadNotifiedIds())

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        time: TIME_RE.test(log.metadata?.time) ? (log.metadata?.time as string) : null,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
  }, [logs])

  const upcomingEntries = React.useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    return entries
      .filter(e => e.date >= today)
      .slice(0, 10)
  }, [entries])

  // Next scheduled entry with a time, still ahead of now — drives the T-MINUS readout.
  const nextTimedEntry = React.useMemo(() => {
    return entries.find(e => {
      const dt = entryDateTime(e)
      return dt && dt.isAfter(now)
    }) || null
  }, [entries, now])

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  const today = dayjs().format('YYYY-MM-DD')
  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  // Live clock for the T-MINUS countdown — ticks once a minute, paused on hidden tabs.
  React.useEffect(() => {
    const tick = () => { if (!document.hidden) setNow(dayjs()) }
    const interval = setInterval(tick, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Reliability engine: polls scheduled entries against the clock and fires a
  // military-grade alert the first time each entry's time arrives. Alerts are
  // logged back into Log (event: calendar_alert) and deduped via localStorage
  // so a reload never re-fires the same event.
  React.useEffect(() => {
    const checkDue = () => {
      if (document.hidden) return
      const nowTs = dayjs()
      const due = entries.filter(e => {
        if (!e.time || notifiedIdsRef.current.has(e.id)) return false
        const dt = entryDateTime(e)
        if (!dt) return false
        const diff = nowTs.diff(dt)
        return diff >= 0 && diff <= ALERT_GRACE_MS
      })
      if (due.length === 0) return

      due.forEach(e => notifiedIdsRef.current.add(e.id))
      saveNotifiedIds(notifiedIdsRef.current)
      setAlertQueue(q => [...q, ...due])

      due.forEach(e => {
        const label = `[ALERT] ${e.type}: ${e.text} (${e.date} ${e.time})`
        createLog({
          text: label,
          event: 'calendar_alert',
          metadata: { date: e.date, time: e.time, text: e.text, entryType: e.type, sourceLogId: e.id },
        }, {
          onSuccess: () => queryClient.refetchQueries(['/api/logs']),
        })

        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try {
            new Notification(`LOT SYSTEMS · ${e.type.toUpperCase()} DUE`, {
              body: e.text,
              tag: `calendar-${e.id}`,
            })
          } catch (_) {}
        }
      })
    }

    checkDue()
    const interval = setInterval(checkDue, ALERT_POLL_MS)
    return () => clearInterval(interval)
  }, [entries, createLog, queryClient])

  // Drain the alert queue one toast at a time.
  React.useEffect(() => {
    if (activeAlert || alertQueue.length === 0) return
    const [next, ...rest] = alertQueue
    setActiveAlert(next)
    setAlertQueue(rest)
    const timeout = setTimeout(() => setActiveAlert(null), 8000)
    return () => clearTimeout(timeout)
  }, [activeAlert, alertQueue])

  const handleEnableAlerts = () => {
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'default') Notification.requestPermission()
  }

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    if (selectedDate === key) {
      setSelectedDate(null)
    } else {
      setSelectedDate(key)
    }
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const validTime = TIME_RE.test(entryTime) ? entryTime : null
    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const whenLabel = validTime ? `${dateLabel} ${validTime}` : dateLabel

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${whenLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        time: validTime,
        text: entryText.trim(),
        entryType,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    if (validTime) handleEnableAlerts()

    setEntryText('')
    setEntryTime('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setViewMonth(dayjs())
    }
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        <div className="mb-16 flex items-center gap-16">
          <Button onClick={handleToggleCalendar}>
            Add date
          </Button>
          {nextTimedEntry && (
            <span className="font-mono text-xs uppercase tracking-widest text-acc/50">
              T-MINUS {formatCountdown(entryDateTime(nextTimedEntry)!.diff(now))} · {nextTimedEntry.text}
            </span>
          )}
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            <div className="flex items-center gap-8 mb-8">
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(viewMonth.subtract(1, 'month'))}
              >
                {'<—'}
              </button>
              <span className="text-acc">
                {viewMonth.format('MMMM, YYYY')}
              </span>
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(viewMonth.add(1, 'month'))}
              >
                {'—>'}
              </button>
            </div>

            <div className="space-y-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex gap-0">
                  {week.map((d, di) => {
                    const key = d.format('YYYY-MM-DD')
                    const isToday = key === today
                    const isCurrentMonth = d.month() === viewMonth.month()
                    const isSelected = key === selectedDate
                    const hasEntry = datesWithEntries.has(key)

                    return (
                      <button
                        key={key}
                        onClick={() => handleDateClick(d)}
                        className={cn(
                          'py-0.5 px-0.5 transition-opacity whitespace-nowrap',
                          'min-w-[2.5em] text-left',
                          isToday && 'font-bold',
                          isSelected && 'underline',
                          !isCurrentMonth && 'text-acc/20',
                          isCurrentMonth && !isToday && 'text-acc/40',
                          isToday && 'text-acc',
                          hasEntry && isCurrentMonth && !isToday && 'text-acc/60',
                        )}
                      >
                        {DAY_LETTERS[di]}{d.date()}
                      </button>
                    )
                  })}

                  {wi === 0 && (
                    <div className="text-acc/30 flex items-center ml-4 whitespace-nowrap">
                      {selectedDate && !isAddingEntry && (
                        <button
                          className="text-acc/30 hover:text-acc/60 transition-opacity"
                          onClick={() => setIsAddingEntry(true)}
                        >
                          Note / Task / Call
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isAddingEntry && selectedDate && (
              <div className="mt-8">
                <div className="flex gap-8 mb-8">
                  {(['note', 'task', 'call'] as EntryType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setEntryType(t)}
                      className={cn(
                        'transition-opacity capitalize',
                        entryType === t ? 'text-acc' : 'text-acc/40 hover:text-acc/60'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-8 items-center">
                  <input
                    type="text"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    placeholder={`Add ${entryType}...`}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40 font-mono text-sm"
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
                {entryTime && (
                  <div className="text-acc/30 text-xs uppercase tracking-widest mt-4">
                    Alert fires at scheduled time — Log entry + notification
                  </div>
                )}
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="text-acc/80 mb-1">
                    {e.time && <span className="text-acc/50 font-mono mr-8">{e.time}</span>}
                    {e.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => (
              <div key={i} className="flex justify-between gap-16">
                <span className="text-acc whitespace-nowrap">
                  {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                  {entry.time && <span className="text-acc/50 font-mono ml-8">{entry.time}</span>}
                </span>
                <span className="text-acc text-right">
                  {entry.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>

      {activeAlert && (
        <div
          className="fixed top-16 right-16 z-50 w-[280px] font-mono text-xs
                     bg-[var(--base-color)] border border-acc/40 text-acc
                     animate-fade-in-up"
          style={{ animation: 'fadeInUp 0.4s ease-out, fadeOut 0.4s ease-in 7.6s forwards' }}
        >
          <div className="border-b border-acc/20 px-8 py-4 flex justify-between items-center">
            <span className="uppercase tracking-widest text-acc/60">LOT · Calendar Alert</span>
            <button
              className="text-acc/40 hover:text-acc transition-opacity"
              onClick={() => setActiveAlert(null)}
            >
              ×
            </button>
          </div>
          <div className="px-8 py-8">
            <div className="uppercase tracking-widest text-acc/50 mb-4">
              {activeAlert.type} · {activeAlert.time} DUE
            </div>
            <div className="text-acc">{activeAlert.text}</div>
          </div>
        </div>
      )}
    </Block>
  )
}

// Shared with EvolutionMilestoneToast — defining locally too so this widget's
// alert animation doesn't depend on that module having been imported first.
if (typeof document !== 'undefined' && !document.getElementById('calendar-toast-keyframes')) {
  const style = document.createElement('style')
  style.id = 'calendar-toast-keyframes'
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `
  document.head.appendChild(style)
}
