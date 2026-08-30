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
import { recordCalendarSignal, recordCalendarTimerSignal } from '#client/stores/intentionEngine'
import { pushCalendarAlert } from '#client/stores/calendarAlerts'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  date: string
  text: string
  type: EntryType
}

type ActiveTimer = {
  date: string
  text: string
  type: EntryType
  startedAt: number
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function entryKey(date: string, text: string): string {
  return `${date}::${text}`
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

function formatTrackedTotal(ms: number): string {
  const totalMinutes = Math.round(ms / 60000)
  if (totalMinutes < 1) return '<1m'
  if (totalMinutes < 60) return `${totalMinutes}m`
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
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
  const { mutate: createLog, isLoading: isSavingEntry } = useCreateLog()
  const { mutate: createTimeLog } = useCreateLog()

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [addError, setAddError] = React.useState<string | null>(null)
  const [activeTimer, setActiveTimer] = React.useState<ActiveTimer | null>(null)
  const [, setTimerTick] = React.useState(0)

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  const upcomingEntries = React.useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    return entries
      .filter(e => e.date >= today)
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

  const trackedMsByEntry = React.useMemo(() => {
    const map = new Map<string, number>()
    logs
      .filter(log => log.event === 'calendar_time_logged' && log.metadata)
      .forEach(log => {
        const date = log.metadata?.date as string
        const text = log.metadata?.text as string
        const durationMs = Number(log.metadata?.durationMs) || 0
        if (!date || !text || durationMs <= 0) return
        const key = entryKey(date, text)
        map.set(key, (map.get(key) || 0) + durationMs)
      })
    return map
  }, [logs])

  // Live tick while a timer runs, so elapsed time stays current without polling logs.
  React.useEffect(() => {
    if (!activeTimer) return
    const interval = setInterval(() => setTimerTick(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [activeTimer])

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

    const date = selectedDate
    const text = entryText.trim()
    const dateLabel = dayjs(date).format('dddd, MMMM D, YYYY')

    setAddError(null)

    createLog({
      text: `[SCHEDULE] ${entryType}: ${text} (${dateLabel})`,
      event: 'calendar_entry',
      metadata: { date, text, entryType },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, date) } catch (_) {}
        setEntryText('')
        setIsAddingEntry(false)
      },
      onError: () => {
        setAddError('Failed to save — try again.')
      },
    })
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setViewMonth(dayjs())
    }
    setIsCalendarOpen(!isCalendarOpen)
  }

  const startTimer = (entry: CalendarEntry) => {
    if (activeTimer) return
    setActiveTimer({ date: entry.date, text: entry.text, type: entry.type, startedAt: Date.now() })
  }

  const stopTimer = () => {
    if (!activeTimer) return
    const durationMs = Date.now() - activeTimer.startedAt
    const { date, text, type } = activeTimer
    setActiveTimer(null)

    if (durationMs < 1000) return // discard accidental taps

    createTimeLog({
      text: `[TIME] ${type}: ${formatElapsed(durationMs)} — ${text}`,
      event: 'calendar_time_logged',
      metadata: { date, text, entryType: type, durationMs },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarTimerSignal(type, date, durationMs) } catch (_) {}
        pushCalendarAlert({
          kind: 'logged',
          label: 'CAL [TIME]:',
          title: `${formatElapsed(durationMs)} LOGGED`,
          detail: text,
        })
      },
    })
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
                  <input
                    type="text"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    placeholder={`Add ${entryType}...`}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                  <Button onClick={handleAddEntry} disabled={isSavingEntry}>
                    {isSavingEntry ? 'Adding…' : 'Add'}
                  </Button>
                </div>
                {addError && (
                  <div className="text-red mt-4">{addError}</div>
                )}
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => {
                  const key = entryKey(e.date, e.text)
                  const isTracking = activeTimer && entryKey(activeTimer.date, activeTimer.text) === key
                  const trackedMs = trackedMsByEntry.get(key) || 0

                  return (
                    <div key={i} className="flex justify-between items-baseline gap-8 mb-4">
                      <span className="text-acc/80">{e.text}</span>
                      <span className="flex items-center gap-8 whitespace-nowrap">
                        {isTracking ? (
                          <>
                            <span className="text-acc tabular-nums">
                              {formatElapsed(Date.now() - activeTimer!.startedAt)}
                            </span>
                            <button
                              className="text-acc/40 hover:text-acc transition-opacity uppercase tracking-widest"
                              onClick={stopTimer}
                            >
                              Stop
                            </button>
                          </>
                        ) : (
                          <>
                            {trackedMs > 0 && (
                              <span className="text-acc/30 tabular-nums">
                                {formatTrackedTotal(trackedMs)}
                              </span>
                            )}
                            {!activeTimer && (
                              <button
                                className="text-acc/30 hover:text-acc/60 transition-opacity uppercase tracking-widest"
                                onClick={() => startTimer(e)}
                              >
                                Track
                              </button>
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  )
                })}
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
