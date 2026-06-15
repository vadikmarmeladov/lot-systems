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

const TYPE_CODE: Record<EntryType, string> = {
  note: 'MEMO',
  task: 'OBJ',
  call: 'COMM',
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

  const [now, setNow] = React.useState(() => dayjs())
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const briefSentRef = React.useRef(false)

  // Live clock — ticks every second
  React.useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(id)
  }, [])

  const todayStr = now.format('YYYY-MM-DD')

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

  const todayEntries = React.useMemo(
    () => entries.filter(e => e.date === todayStr),
    [entries, todayStr]
  )

  const upcomingEntries = React.useMemo(
    () => entries.filter(e => e.date > todayStr).slice(0, 10),
    [entries, todayStr]
  )

  const overdueEntries = React.useMemo(
    () => entries.filter(e => e.date < todayStr),
    [entries, todayStr]
  )

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  // Daily brief — fires once per calendar day when today has events
  React.useEffect(() => {
    if (briefSentRef.current) return
    if (!todayEntries.length) return
    const stored = localStorage.getItem('cal_brief_date')
    if (stored === todayStr) return
    briefSentRef.current = true
    const summary = todayEntries.map(e => `${TYPE_CODE[e.type]}: ${e.text}`).join(' · ')
    createLog(
      {
        text: `[STAND-TO] ${todayEntries.length} event${todayEntries.length !== 1 ? 's' : ''} today — ${summary}`,
        event: 'calendar_notification',
        metadata: {
          date: todayStr,
          count: todayEntries.length,
          entries: todayEntries.map(e => ({ type: e.type, text: e.text })),
        },
      },
      {
        onSuccess: () => {
          localStorage.setItem('cal_brief_date', todayStr)
          queryClient.invalidateQueries(['/api/logs'])
        },
      }
    )
  }, [todayEntries, todayStr]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(key === selectedDate ? null : key)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return
    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    createLog(
      {
        text: `[SCHEDULE] ${TYPE_CODE[entryType]}: ${entryText.trim()} · ${dateLabel}`,
        event: 'calendar_entry',
        metadata: {
          date: selectedDate,
          text: entryText.trim(),
          entryType,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['/api/logs'])
          try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
        },
      }
    )
    setEntryText('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(!isCalendarOpen)
  }

  const isEmpty = todayEntries.length === 0 && upcomingEntries.length === 0 && overdueEntries.length === 0

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        {/* Header row: button + live clock */}
        <div className="flex items-center gap-16 mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
          <span className="text-acc/30 tabular-nums tracking-widest">
            {now.format('HH:mm:ss')}
          </span>
        </div>

        {/* Calendar grid */}
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
                    const isToday = key === todayStr
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

            {/* Entry form */}
            {isAddingEntry && selectedDate && (
              <div className="mt-8">
                <div className="flex gap-8 mb-8">
                  {(['note', 'task', 'call'] as EntryType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setEntryType(t)}
                      className={cn(
                        'transition-opacity uppercase tracking-widest',
                        entryType === t ? 'text-acc' : 'text-acc/40 hover:text-acc/60'
                      )}
                    >
                      {TYPE_CODE[t]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-8 items-center">
                  <input
                    type="text"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    placeholder={
                      entryType === 'note'
                        ? 'MEMO: write note...'
                        : entryType === 'task'
                        ? 'OBJ: define objective...'
                        : 'COMM: schedule call...'
                    }
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {/* Selected date entries */}
            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/30 uppercase tracking-widest mb-4">
                  {dayjs(selectedDate).format('ddd MMM D')}
                  {selectedDate === todayStr && ' · TODAY'}
                  {selectedDate < todayStr && ' · OVERDUE'}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="flex gap-8 mb-1">
                    <span className="text-acc/40 uppercase tracking-widest w-12 flex-shrink-0">
                      {TYPE_CODE[e.type]}
                    </span>
                    <span className="text-acc/80">{e.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STAND-TO — today's events */}
        {todayEntries.length > 0 && (
          <div className="mb-12">
            <div className="text-acc/30 uppercase tracking-widest mb-6">STAND-TO</div>
            {todayEntries.map((e, i) => (
              <div key={i} className="flex gap-8 mb-2">
                <span className="text-acc/50 uppercase tracking-widest w-12 flex-shrink-0">
                  {TYPE_CODE[e.type]}
                </span>
                <span className="text-acc">{e.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming — T+Nd countdown */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const days = dayjs(entry.date).diff(dayjs(todayStr), 'day')
              const countdown = days === 1 ? 'T+1d' : `T+${days}d`
              return (
                <div key={i} className="flex gap-8 items-baseline">
                  <span className="text-acc/30 tabular-nums tracking-widest w-12 flex-shrink-0">
                    {countdown}
                  </span>
                  <span className="text-acc/40 uppercase tracking-widest w-12 flex-shrink-0">
                    {TYPE_CODE[entry.type]}
                  </span>
                  <span className="text-acc/70">{entry.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Overdue — T-Nd with strikethrough */}
        {overdueEntries.length > 0 && (
          <div className={cn('space-y-1', upcomingEntries.length > 0 && 'mt-8')}>
            {overdueEntries.slice(0, 3).map((entry, i) => {
              const days = dayjs(todayStr).diff(dayjs(entry.date), 'day')
              return (
                <div key={i} className="flex gap-8 items-baseline">
                  <span className="text-acc/20 tabular-nums tracking-widest w-12 flex-shrink-0">
                    T-{days}d
                  </span>
                  <span className="text-acc/20 uppercase tracking-widest w-12 flex-shrink-0">
                    {TYPE_CODE[entry.type]}
                  </span>
                  <span className="text-acc/20 line-through">{entry.text}</span>
                </div>
              )
            })}
            {overdueEntries.length > 3 && (
              <div className="text-acc/20 tracking-widest">
                +{overdueEntries.length - 3} more overdue
              </div>
            )}
          </div>
        )}

        {isEmpty && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
