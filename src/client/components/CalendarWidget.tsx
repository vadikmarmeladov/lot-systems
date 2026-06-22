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
  date: string
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const TYPE_CODES: Record<EntryType, string> = {
  task: 'TASK',
  call: 'CALL',
  note: 'NOTE',
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

function daysUntilDate(date: string): number {
  return dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'day')
}

function relativeLabel(date: string): string {
  const d = daysUntilDate(date)
  if (d === 0) return 'TODAY'
  if (d === 1) return 'TOMRW'
  if (d < 0) return 'PAST'
  const dow = dayjs(date).format('ddd').toUpperCase()
  return `+${d} ${dow}`
}

function getAlertKey(alertType: string, targetDate: string): string {
  const today = dayjs().format('YYYY-MM-DD')
  return `lot_cal_alert_${alertType}_${targetDate}_${today}`
}

function hasAlerted(alertType: string, targetDate: string): boolean {
  try {
    return localStorage.getItem(getAlertKey(alertType, targetDate)) === '1'
  } catch {
    return false
  }
}

function markAlerted(alertType: string, targetDate: string): void {
  try {
    localStorage.setItem(getAlertKey(alertType, targetDate), '1')
  } catch {}
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
  const [clockStr, setClockStr] = React.useState(() => dayjs().format('HH:mm'))

  // Live clock — 60s tick
  React.useEffect(() => {
    const id = setInterval(() => setClockStr(dayjs().format('HH:mm')), 60_000)
    return () => clearInterval(id)
  }, [])

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

  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

  const upcomingEntries = React.useMemo(() => {
    return entries
      .filter(e => e.date >= today)
      .slice(0, 10)
  }, [entries, today])

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  // Alert system — fires batched calendar_alert entries once per day per target date
  React.useEffect(() => {
    if (entries.length === 0) return

    const checkAlerts = () => {
      const todayStr = dayjs().format('YYYY-MM-DD')
      const tomorrowStr = dayjs().add(1, 'day').format('YYYY-MM-DD')

      const todayEvts = entries.filter(e => e.date === todayStr)
      if (todayEvts.length > 0 && !hasAlerted('today', todayStr)) {
        markAlerted('today', todayStr)
        const summary = todayEvts.map(e => `${TYPE_CODES[e.type]} ${e.text}`).join(' · ')
        setTimeout(() => {
          createLog({
            text: `CAL-ALERT: TODAY | ${todayEvts.length} EVENT${todayEvts.length !== 1 ? 'S' : ''} | ${summary}`,
            event: 'calendar_alert',
            metadata: {
              alertType: 'today',
              date: todayStr,
              count: todayEvts.length,
              entries: todayEvts.map(e => ({ date: e.date, text: e.text, entryType: e.type })),
            },
          }, {
            onSuccess: () => queryClient.invalidateQueries(['/api/logs']),
          })
        }, 0)
      }

      const tomorrowEvts = entries.filter(e => e.date === tomorrowStr)
      if (tomorrowEvts.length > 0 && !hasAlerted('tomorrow', tomorrowStr)) {
        markAlerted('tomorrow', tomorrowStr)
        const summary = tomorrowEvts.map(e => `${TYPE_CODES[e.type]} ${e.text}`).join(' · ')
        setTimeout(() => {
          createLog({
            text: `CAL-ALERT: TOMORROW | ${tomorrowEvts.length} EVENT${tomorrowEvts.length !== 1 ? 'S' : ''} | ${summary}`,
            event: 'calendar_alert',
            metadata: {
              alertType: 'tomorrow',
              date: tomorrowStr,
              count: tomorrowEvts.length,
              entries: tomorrowEvts.map(e => ({ date: e.date, text: e.text, entryType: e.type })),
            },
          }, {
            onSuccess: () => queryClient.invalidateQueries(['/api/logs']),
          })
        }, 0)
      }
    }

    checkAlerts()
    const id = setInterval(checkAlerts, 60_000)
    return () => clearInterval(id)
  }, [entries, createLog, queryClient])

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(prev => prev === key ? null : key)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['/api/logs'])
        setTimeout(() => {
          try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
        }, 0)
      },
    })

    setEntryText('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(v => !v)
  }

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">

        {/* Clock + Add row */}
        <div className="flex items-center justify-between mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
          <span className="text-acc/30 tabular-nums text-sm">{clockStr}</span>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            {/* Month nav */}
            <div className="flex items-center gap-8 mb-8">
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(v => v.subtract(1, 'month'))}
              >
                {'<—'}
              </button>
              <span className="text-acc">
                {viewMonth.format('MMMM, YYYY')}
              </span>
              <button
                className="text-acc/40 hover:text-acc transition-opacity"
                onClick={() => setViewMonth(v => v.add(1, 'month'))}
              >
                {'—>'}
              </button>
            </div>

            {/* Calendar grid */}
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

            {/* Entry input */}
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
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {/* Entries on selected date */}
            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4 uppercase tracking-widest text-xs">
                  {dayjs(selectedDate).format('ddd DD MMM YYYY').toUpperCase()}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="flex gap-8 items-baseline mb-2">
                    <span className="text-acc/40 uppercase text-xs tracking-widest min-w-[2.5rem]">
                      {TYPE_CODES[e.type]}
                    </span>
                    <span className="text-acc/80">{e.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming events list */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-2">
            {upcomingEntries.map((entry, i) => {
              const label = relativeLabel(entry.date)
              const isToday = entry.date === today
              const isTomorrow = entry.date === tomorrow
              return (
                <div key={i} className="flex gap-8 items-baseline">
                  <span
                    className={cn(
                      'whitespace-nowrap tabular-nums min-w-[4.5rem] text-xs tracking-widest uppercase',
                      isToday ? 'text-acc font-bold' : isTomorrow ? 'text-acc/60' : 'text-acc/30'
                    )}
                  >
                    {label}
                  </span>
                  <span
                    className={cn(
                      'uppercase text-xs tracking-widest min-w-[2.5rem]',
                      isToday ? 'text-acc/60' : 'text-acc/30'
                    )}
                  >
                    {TYPE_CODES[entry.type]}
                  </span>
                  <span
                    className={cn(
                      'flex-1 truncate',
                      isToday ? 'text-acc' : isTomorrow ? 'text-acc/60' : 'text-acc/40'
                    )}
                  >
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
