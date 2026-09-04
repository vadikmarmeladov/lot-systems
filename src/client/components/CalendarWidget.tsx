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
  time?: string
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

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
  const [entryTime, setEntryTime] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')

  const removedIds = React.useMemo(() => {
    const set = new Set<string>()
    logs
      .filter(log => log.event === 'calendar_entry_removed' && log.metadata?.removedLogId)
      .forEach(log => set.add(log.metadata!.removedLogId as string))
    return set
  }, [logs])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata && !removedIds.has(log.id))
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        time: log.metadata?.time as string | undefined,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
  }, [logs, removedIds])

  // Re-render every 60s so "in Xh Ym" countdowns stay accurate without a manual refresh
  const [, forceTick] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => forceTick(t => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const upcomingEntries = React.useMemo(() => {
    const now = dayjs()
    const today = now.format('YYYY-MM-DD')
    return entries
      .filter(e => e.date > today || (e.date === today && (!e.time || dayjs(`${e.date} ${e.time}`).isAfter(now.subtract(1, 'hour')))))
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
    const time = entryTime.trim() || undefined

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${time ? ` ${time}` : ''})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        time,
        text: entryText.trim(),
        entryType,
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

  const handleRemoveEntry = (entry: CalendarEntry) => {
    createLog({
      text: `[SCHEDULE] cancelled: ${entry.text}`,
      event: 'calendar_entry_removed',
      metadata: {
        removedLogId: entry.id,
        date: entry.date,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
      },
    })
  }

  const formatCountdown = (entry: CalendarEntry): string | null => {
    if (!entry.time) return null
    const target = dayjs(`${entry.date} ${entry.time}`)
    if (!target.isValid()) return null
    return target.isBefore(dayjs()) ? 'overdue' : target.fromNow()
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
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
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
                {entriesOnDate.map(e => (
                  <div key={e.id} className="flex justify-between items-baseline gap-8 mb-1">
                    <span className="text-acc/80">
                      {e.time && <span className="text-acc/40 mr-4 tabular-nums">{e.time}</span>}
                      {e.text}
                    </span>
                    <button
                      className="text-acc/20 hover:text-acc/60 transition-opacity shrink-0"
                      onClick={() => handleRemoveEntry(e)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map(entry => {
              const countdown = formatCountdown(entry)
              return (
                <div key={entry.id} className="flex justify-between items-baseline gap-16">
                  <span className="text-acc whitespace-nowrap">
                    {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                    {entry.time && <span className="text-acc/60 ml-4 tabular-nums">{entry.time}</span>}
                  </span>
                  <span className="text-acc text-right flex items-baseline gap-8">
                    {entry.text}
                    {countdown && (
                      <span className={cn('whitespace-nowrap', countdown === 'overdue' ? 'text-acc/80' : 'text-acc/40')}>
                        ({countdown})
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
