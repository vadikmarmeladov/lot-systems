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
import { recordCalendarSignal, recordCalendarUpdateSignal } from '#client/stores/intentionEngine'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  date: string
  text: string
  type: EntryType
  time: string | null
  createdAt: string | null
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Alerts fired are recorded here so a reload never re-fires a notification
// already sent. Capped to the most recent 200 keys to avoid unbounded growth.
const ALERT_STORAGE_KEY = 'lot_calendar_alerts_notified'

function getNotifiedKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(ALERT_STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch (_) {
    return new Set()
  }
}

function markNotified(key: string) {
  try {
    const keys = getNotifiedKeys()
    keys.add(key)
    const trimmed = Array.from(keys).slice(-200)
    localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(trimmed))
  } catch (_) {}
}

function alertKey(entry: CalendarEntry): string {
  return `${entry.date}|${entry.time || 'allday'}|${entry.text}`
}

// Timed entries fire at that clock time; all-day entries fire at local midnight.
function getEntryTarget(entry: CalendarEntry): Dayjs {
  return entry.time ? dayjs(`${entry.date}T${entry.time}`) : dayjs(entry.date).startOf('day')
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
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
  const [now, setNow] = React.useState(() => dayjs())

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
        time: (log.metadata?.time as string) || null,
        createdAt: (log.metadata?.createdAt as string) || null,
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  // Tracking window: due within the last 5 minutes (still worth alerting on)
  // through the next 24 hours (worth showing a T-minus countdown for).
  const trackedEntries = React.useMemo(() => {
    return entries.filter(e => {
      const diffMs = getEntryTarget(e).diff(now)
      return diffMs > -5 * 60 * 1000 && diffMs < 24 * 60 * 60 * 1000
    })
  }, [entries, now])

  const activeAlerts = React.useMemo(
    () => trackedEntries.filter(e => !getEntryTarget(e).isAfter(now)),
    [trackedEntries, now]
  )

  const nearestUpcoming = React.useMemo(() => {
    return trackedEntries
      .filter(e => getEntryTarget(e).isAfter(now))
      .sort((a, b) => getEntryTarget(a).valueOf() - getEntryTarget(b).valueOf())[0] || null
  }, [trackedEntries, now])

  const todaysEntries = React.useMemo(
    () => entries.filter(e => e.date === dayjs().format('YYYY-MM-DD')),
    [entries]
  )

  // Tick every second while something is in the tracking window (live T-minus
  // + prompt alert firing); otherwise fall back to a light 60s pulse so the
  // "today" panel and gate checks still stay current at low cost.
  React.useEffect(() => {
    const tickMs = trackedEntries.length > 0 ? 1000 : 60000
    const id = setInterval(() => {
      if (document.hidden) return
      setNow(dayjs())
    }, tickMs)
    return () => clearInterval(id)
  }, [trackedEntries.length])

  // Fire a stylish, once-only military-grade alert log the moment a scheduled
  // entry's target time is reached.
  const firingRef = React.useRef<Set<string>>(new Set())
  React.useEffect(() => {
    if (!activeAlerts.length) return
    const notified = getNotifiedKeys()
    activeAlerts.forEach(entry => {
      const key = alertKey(entry)
      if (notified.has(key) || firingRef.current.has(key)) return
      firingRef.current.add(key)
      markNotified(key)

      const target = getEntryTarget(entry)
      const dateLabel = target.format(
        entry.time ? 'dddd, MMMM D, YYYY [at] HH:mm' : 'dddd, MMMM D, YYYY'
      )

      createLog({
        text: `[ALERT] ${entry.type.toUpperCase()}: ${entry.text} — EVENT DUE (${dateLabel})`,
        event: 'calendar_alert',
        metadata: {
          date: entry.date,
          time: entry.time,
          text: entry.text,
          entryType: entry.type,
        },
      }, {
        onSuccess: () => {
          queryClient.refetchQueries(['/api/logs'])
          try { recordCalendarUpdateSignal(entry.type, entry.date) } catch (_) {}
        },
      })
    })
  }, [activeAlerts, createLog, queryClient])

  // Today's entries live in the Today: panel above — upcoming excludes today
  // so nothing is shown twice.
  const upcomingEntries = React.useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    return entries
      .filter(e => e.date > today)
      .slice(0, 10)
  }, [entries])

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

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')

    const timeLabel = entryTime ? ` at ${entryTime}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        time: entryTime || null,
        createdAt: new Date().toISOString(),
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

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
        {activeAlerts.length > 0 && (
          <div className="mb-16">
            <Block label="ALERT:" blockView>
              {activeAlerts.map((e, i) => (
                <div key={i} className="uppercase tracking-widest mb-4 last:mb-0">
                  {e.type}: {e.text}
                  <span className="opacity-40 ml-8">
                    DUE {e.time ? `${e.date} ${e.time}` : e.date}
                  </span>
                </div>
              ))}
            </Block>
          </div>
        )}

        {todaysEntries.length > 0 && (
          <div className="mb-16">
            <Block label="Today:" blockView>
              {todaysEntries.map((e, i) => (
                <div key={i} className="text-acc/80 mb-1 last:mb-0">
                  {e.time && <span className="text-acc/40 tabular-nums mr-8">{e.time}</span>}
                  {e.text}
                </div>
              ))}
            </Block>
          </div>
        )}

        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>
            Add date
          </Button>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-8">
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
              <div className="flex items-center gap-16 whitespace-nowrap">
                <span className="text-acc/40 tabular-nums">{now.format('HH:mm:ss')}</span>
                {nearestUpcoming && (
                  <span className="text-acc/40 tabular-nums">
                    T-MINUS {formatCountdown(getEntryTarget(nearestUpcoming).diff(now))}
                  </span>
                )}
              </div>
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
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40 tabular-nums"
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="text-acc/80 mb-1">
                    {e.time && <span className="text-acc/40 tabular-nums mr-8">{e.time}</span>}
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
                  {entry.time && <span className="text-acc/60 tabular-nums ml-8">{entry.time}</span>}
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
    </Block>
  )
}
