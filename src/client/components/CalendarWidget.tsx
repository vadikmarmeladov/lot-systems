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
import { recordCalendarSignal, recordCalendarDueSignal } from '#client/stores/intentionEngine'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  date: string
  time?: string
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const TIMED_TYPES: EntryType[] = ['task', 'call']
const DUE_FIRED_KEY = 'calendar_due_fired_v1'
const DUE_TOAST_KEY = 'calendar_due_events'

function pad2(n: number): string {
  return String(Math.abs(n)).padStart(2, '0')
}

// Military T-minus / T-plus countdown. Returns null outside the 24h operational window.
function getTimeStatus(date: string, time: string | undefined, now: Dayjs): { label: string; overdue: boolean; due: boolean } | null {
  if (!time) return null
  const scheduled = dayjs(`${date}T${time}`)
  if (!scheduled.isValid()) return null
  const diffMin = scheduled.diff(now, 'minute')

  if (diffMin <= 0 && diffMin > -60) return { label: 'NOW', overdue: false, due: true }
  if (diffMin <= -60) {
    const overdueMin = -diffMin
    return { label: `T+${pad2(Math.floor(overdueMin / 60))}:${pad2(overdueMin % 60)}`, overdue: true, due: false }
  }
  if (diffMin > 0 && diffMin < 24 * 60) {
    return { label: `T-${pad2(Math.floor(diffMin / 60))}:${pad2(diffMin % 60)}`, overdue: false, due: false }
  }
  return null
}

function readLocalSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch (_) {
    return new Set()
  }
}

function writeLocalSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set).slice(-200)))
  } catch (_) { /* storage unavailable — non-fatal, notification simply won't persist */ }
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
  const { mutate: createLog, isLoading: isSaving } = useCreateLog()

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryTime, setEntryTime] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [saveError, setSaveError] = React.useState(false)
  const [now, setNow] = React.useState(() => dayjs())

  // Re-derive T-minus/T-plus countdowns and sweep for newly-due events once a minute.
  React.useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        time: (log.metadata?.time as string) || undefined,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
  }, [logs])

  const upcomingEntries = React.useMemo(() => {
    const today = now.format('YYYY-MM-DD')
    return entries
      .filter(e => {
        if (e.date < today) return false
        if (e.date === today && e.time) {
          // Drop today's timed entries once >30min past — keeps the list reliable, not stale.
          const scheduled = dayjs(`${e.date}T${e.time}`)
          if (scheduled.isBefore(now.subtract(30, 'minute'))) return false
        }
        return true
      })
      .slice(0, 10)
  }, [entries, now])

  // Reliable time tracking: fire exactly one Log event per task/call once its scheduled
  // time has passed — checked against the fired-set so it still catches events that came
  // due while the app was closed, not just the ones caught live in the first hour.
  React.useEffect(() => {
    const dueEntries = entries.filter(e => {
      if (!TIMED_TYPES.includes(e.type) || !e.time) return false
      return dayjs(`${e.date}T${e.time}`).isBefore(now) || dayjs(`${e.date}T${e.time}`).isSame(now)
    })
    if (dueEntries.length === 0) return

    const fired = readLocalSet(DUE_FIRED_KEY)
    const newlyDue = dueEntries.filter(e => !fired.has(`${e.date}|${e.time}|${e.text}`))
    if (newlyDue.length === 0) return

    newlyDue.forEach(e => {
      fired.add(`${e.date}|${e.time}|${e.text}`)
      createLog({
        text: `[DUE] ${e.type}: ${e.text} (${e.date} ${e.time})`,
        event: 'calendar_event_due',
        metadata: { date: e.date, time: e.time, entryType: e.type, text: e.text },
      }, {
        onSuccess: () => queryClient.refetchQueries(['/api/logs']),
      })
      try { recordCalendarDueSignal(e.type, e.date, e.time!) } catch (_) {}
    })
    writeLocalSet(DUE_FIRED_KEY, fired)

    // Only surface a toast for events that came due within the last hour — a task that went
    // unfired for days (app was closed) still gets logged reliably above, but silently, in
    // keeping with "context over notification, no interruption."
    const freshlyDue = newlyDue.filter(e => getTimeStatus(e.date, e.time, now)?.due)
    if (freshlyDue.length > 0) {
      const toastQueue = (() => {
        try {
          const raw = localStorage.getItem(DUE_TOAST_KEY)
          return raw ? JSON.parse(raw) : []
        } catch (_) { return [] }
      })()
      const nextQueue = [
        ...freshlyDue.map(e => ({
          message: `[CAL // DUE] ${e.type.toUpperCase()} — ${e.text}`,
          timestamp: new Date().toISOString(),
        })),
        ...toastQueue,
      ].slice(0, 10)
      try { localStorage.setItem(DUE_TOAST_KEY, JSON.stringify(nextQueue)) } catch (_) { /* non-fatal */ }
    }
  }, [entries, now, createLog, queryClient])

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
    if (!selectedDate || !entryText.trim() || isSaving) return

    const trimmedText = entryText.trim()
    const time = entryTime || undefined
    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const whenLabel = time ? `${dateLabel} at ${time}` : dateLabel

    setSaveError(false)

    createLog({
      text: `[SCHEDULE] ${entryType}: ${trimmedText} (${whenLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        time,
        text: trimmedText,
        entryType,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!, time) } catch (_) {}
        setEntryText('')
        setEntryTime('')
        setIsAddingEntry(false)
      },
      onError: () => setSaveError(true),
    })
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
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>
            Add date
          </Button>
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
                  {TIMED_TYPES.includes(entryType) && (
                    <input
                      type="time"
                      value={entryTime}
                      onChange={e => setEntryTime(e.target.value)}
                      className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40 tabular-nums"
                      aria-label="Time"
                    />
                  )}
                  <input
                    type="text"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    placeholder={`Add ${entryType}...`}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                  <Button onClick={handleAddEntry} disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Add'}
                  </Button>
                </div>
                {saveError && (
                  <div className="text-acc/40 mt-4">Failed to save — try again.</div>
                )}
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => {
                  const status = getTimeStatus(e.date, e.time, now)
                  return (
                    <div key={i} className="flex justify-between gap-16 mb-1">
                      <span className="text-acc/80">
                        {e.time && <span className="tabular-nums text-acc/40 mr-8">{e.time}</span>}
                        {e.text}
                      </span>
                      {status && (
                        <span className={cn('tabular-nums whitespace-nowrap', status.overdue ? 'text-acc/60' : 'text-acc/30')}>
                          {status.label}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const status = getTimeStatus(entry.date, entry.time, now)
              return (
                <div key={i} className="flex justify-between gap-16">
                  <span className="text-acc whitespace-nowrap">
                    {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                    {entry.time && <span className="text-acc/40"> · {entry.time}</span>}
                  </span>
                  <span className="text-acc text-right flex items-center gap-8 justify-end">
                    {entry.text}
                    {status && (
                      <span className={cn('tabular-nums whitespace-nowrap', status.overdue ? 'text-acc/60' : 'text-acc/30')}>
                        {status.label}
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
