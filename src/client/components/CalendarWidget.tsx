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
import type { Log } from '#shared/types'
import { recordCalendarSignal } from '#client/stores/intentionEngine'

export type EntryType = 'note' | 'task' | 'call'

export type CalendarEntry = {
  date: string
  text: string
  type: EntryType
  time?: string
  reminderMinutes?: number
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const REMINDER_OPTIONS = [5, 15, 30, 60]

export function entryKey(e: { date: string; type: string; text: string }): string {
  return `${e.date}|${e.type}|${e.text}`
}

export function parseCalendarEntries(logs: Log[]): CalendarEntry[] {
  return logs
    .filter(log => log.event === 'calendar_entry' && log.metadata)
    .map(log => ({
      date: log.metadata?.date as string,
      text: log.metadata?.text as string || log.text || '',
      type: (log.metadata?.entryType as EntryType) || 'note',
      time: log.metadata?.time as string | undefined,
      reminderMinutes: log.metadata?.reminderMinutes as number | undefined,
    }))
    .filter(e => e.date && e.text)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getCompletedEntryKeys(logs: Log[]): Set<string> {
  const set = new Set<string>()
  logs
    .filter(log => log.event === 'calendar_entry_complete' && log.metadata?.entryKey)
    .forEach(log => set.add(log.metadata!.entryKey as string))
  return set
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

function formatCountdown(ms: number): string {
  const sign = ms < 0 ? '+' : '-'
  const abs = Math.abs(ms)
  const totalSeconds = Math.floor(abs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => `${n}`.padStart(2, '0')
  return `T${sign}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
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
  const [reminderMinutes, setReminderMinutes] = React.useState(15)
  const [now, setNow] = React.useState(() => dayjs())

  React.useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(interval)
  }, [])

  const entries = React.useMemo<CalendarEntry[]>(() => parseCalendarEntries(logs), [logs])

  const completedKeys = React.useMemo(() => getCompletedEntryKeys(logs), [logs])

  const upcomingEntries = React.useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    return entries
      .filter(e => e.date >= today)
      .slice(0, 10)
  }, [entries])

  const nextTimedEntry = React.useMemo(() => {
    return entries
      .filter(e => e.time && !completedKeys.has(entryKey(e)))
      .map(e => ({ entry: e, at: dayjs(`${e.date} ${e.time}`) }))
      .filter(x => x.at.isValid())
      .sort((a, b) => a.at.valueOf() - b.at.valueOf())
      .find(x => x.at.isAfter(now)) || null
  }, [entries, completedKeys, now])

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
    const trimmedText = entryText.trim()
    const time = entryTime || undefined

    createLog({
      text: `[SCHEDULE] ${entryType}: ${trimmedText} (${dateLabel}${time ? ` ${time}` : ''})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: trimmedText,
        entryType,
        time,
        reminderMinutes: time ? reminderMinutes : undefined,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    setEntryText('')
    setEntryTime('')
    setReminderMinutes(15)
    setIsAddingEntry(false)
  }

  const handleCompleteEntry = (entry: CalendarEntry) => {
    const key = entryKey(entry)
    if (completedKeys.has(key)) return

    const dateLabel = dayjs(entry.date).format('dddd, MMMM D, YYYY')
    let varianceMinutes: number | undefined
    if (entry.time) {
      const scheduled = dayjs(`${entry.date} ${entry.time}`)
      if (scheduled.isValid()) {
        varianceMinutes = now.diff(scheduled, 'minute')
      }
    }

    createLog({
      text: `[COMPLETE] ${entry.type}: ${entry.text} (${dateLabel})`,
      event: 'calendar_entry_complete',
      metadata: {
        date: entry.date,
        text: entry.text,
        entryType: entry.type,
        entryKey: key,
        scheduledTime: entry.time,
        completedAt: now.toISOString(),
        varianceMinutes,
      },
    }, {
      onSuccess: () => queryClient.refetchQueries(['/api/logs']),
    })
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setViewMonth(dayjs())
    }
    setIsCalendarOpen(!isCalendarOpen)
  }

  const renderEntryStatus = (entry: CalendarEntry) => {
    const key = entryKey(entry)
    const isDone = completedKeys.has(key)

    if (isDone) {
      return <span className="text-acc/30 tabular-nums">DONE</span>
    }

    if (entry.time) {
      const at = dayjs(`${entry.date} ${entry.time}`)
      if (at.isValid()) {
        const overdue = at.isBefore(now)
        return (
          <span className={cn('tabular-nums', overdue ? 'text-acc/50' : 'text-acc/30')}>
            {overdue ? 'OVERDUE' : formatCountdown(at.diff(now))}
          </span>
        )
      }
    }

    return null
  }

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        <div className="mb-16 flex items-center gap-16">
          <Button onClick={handleToggleCalendar}>
            Add date
          </Button>
          {nextTimedEntry && (
            <div className="text-acc/40 tabular-nums whitespace-nowrap">
              {formatCountdown(nextTimedEntry.at.diff(now))} · {nextTimedEntry.entry.text}
            </div>
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
                <div className="flex gap-8 items-center mb-8">
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
                  />
                  {entryTime && (
                    <select
                      value={reminderMinutes}
                      onChange={e => setReminderMinutes(Number(e.target.value))}
                      className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
                    >
                      {REMINDER_OPTIONS.map(m => (
                        <option key={m} value={m} className="bg-bac text-acc">
                          Remind {m}m before
                        </option>
                      ))}
                    </select>
                  )}
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
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => {
                  const key = entryKey(e)
                  const isDone = completedKeys.has(key)
                  return (
                    <div key={i} className="flex justify-between items-baseline gap-16 mb-1">
                      <span className={cn('text-acc/80', isDone && 'line-through text-acc/30')}>
                        {e.time && <span className="text-acc/40 tabular-nums mr-8">{e.time}</span>}
                        {e.text}
                      </span>
                      <div className="flex items-center gap-8 whitespace-nowrap">
                        {renderEntryStatus(e)}
                        {!isDone && (
                          <button
                            className="text-acc/30 hover:text-acc/60 transition-opacity"
                            onClick={() => handleCompleteEntry(e)}
                          >
                            ✓
                          </button>
                        )}
                      </div>
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
              const key = entryKey(entry)
              const isDone = completedKeys.has(key)
              return (
                <div key={i} className="flex justify-between gap-16">
                  <span className="text-acc whitespace-nowrap">
                    {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                    {entry.time && <span className="text-acc/40 tabular-nums ml-8">{entry.time}</span>}
                  </span>
                  <span className={cn('text-acc text-right', isDone && 'line-through text-acc/30')}>
                    {entry.text}
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
