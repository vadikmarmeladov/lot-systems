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
  time?: string
  logId?: string
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function getMonthWeeks(year: number, month: number): Dayjs[][] {
  const first = dayjs().year(year).month(month).startOf('month')
  const last = dayjs().year(year).month(month).endOf('month')

  const isoDay = first.day() === 0 ? 6 : first.day() - 1
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

  const [clock, setClock] = React.useState(() => dayjs())
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [entryTime, setEntryTime] = React.useState('')
  const dueFiredRef = React.useRef(false)

  React.useEffect(() => {
    const id = setInterval(() => setClock(dayjs()), 1000)
    return () => clearInterval(id)
  }, [])

  const today = dayjs().format('YYYY-MM-DD')

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
        time: log.metadata?.time as string | undefined,
        logId: log.id,
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => {
        const dc = a.date.localeCompare(b.date)
        if (dc !== 0) return dc
        if (a.time && b.time) return a.time.localeCompare(b.time)
        if (a.time) return -1
        if (b.time) return 1
        return 0
      })
  }, [logs])

  const todayEntries = React.useMemo(
    () => entries.filter(e => e.date === today),
    [entries, today]
  )

  const upcomingEntries = React.useMemo(
    () => entries.filter(e => e.date >= today).slice(0, 10),
    [entries, today]
  )

  const entriesOnDate = React.useMemo(
    () => (selectedDate ? entries.filter(e => e.date === selectedDate) : []),
    [entries, selectedDate]
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

  // Fire calendar_due notification once per day when today has events
  React.useEffect(() => {
    if (dueFiredRef.current) return
    if (!logs.length || !todayEntries.length) return

    const storageKey = `cal_due_${today}`
    if (localStorage.getItem(storageKey)) return

    dueFiredRef.current = true
    localStorage.setItem(storageKey, '1')

    createLog(
      {
        text: `CALENDAR ACTIVE: ${todayEntries.map(e => e.text).join(' / ')}`,
        event: 'calendar_due',
        metadata: {
          date: today,
          count: todayEntries.length,
          events: todayEntries.map(e => ({ text: e.text, type: e.type, time: e.time })),
        },
      },
      { onSuccess: () => queryClient.invalidateQueries(['/api/logs']) }
    )
  }, [logs.length, todayEntries])

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(selectedDate === key ? null : key)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeVal = entryTime.trim() || undefined

    createLog(
      {
        text: `${entryType}: ${entryText.trim()} (${dateLabel}${timeVal ? ` ${timeVal}` : ''})`,
        event: 'calendar_entry',
        metadata: {
          date: selectedDate,
          text: entryText.trim(),
          entryType,
          ...(timeVal && { time: timeVal }),
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
    setEntryTime('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(!isCalendarOpen)
  }

  const clockStr = clock.format('HH:mm:ss')
  const dateStr = clock.format('ddd DD MMM').toUpperCase()

  const futureEntries = upcomingEntries.filter(e => e.date !== today)

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        <div className="flex items-center justify-between mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
          <div className="text-acc/30 text-xs tabular-nums text-right leading-tight">
            <span className="opacity-80">{dateStr}</span>
            <span className="ml-8">{clockStr}</span>
          </div>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            <div className="flex items-center gap-8 mb-8">
              <button
                className="text-acc/40 hover:text-acc text-sm transition-opacity"
                onClick={() => setViewMonth(viewMonth.subtract(1, 'month'))}
              >
                {'<—'}
              </button>
              <span className="text-acc text-sm">
                {viewMonth.format('MMMM, YYYY')}
              </span>
              <button
                className="text-acc/40 hover:text-acc text-sm transition-opacity"
                onClick={() => setViewMonth(viewMonth.add(1, 'month'))}
              >
                {'—>'}
              </button>
            </div>

            <div className="text-sm space-y-1">
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
                          'text-sm py-0.5 px-0.5 transition-opacity whitespace-nowrap',
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
                    <div className="text-acc/30 text-sm flex items-center ml-4 whitespace-nowrap">
                      {selectedDate && !isAddingEntry && (
                        <button
                          className="text-acc/30 hover:text-acc/60 transition-opacity"
                          onClick={() => setIsAddingEntry(true)}
                        >
                          + note / task / call
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
                        'text-xs transition-opacity capitalize',
                        entryType === t ? 'text-acc' : 'text-acc/40 hover:text-acc/60'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-8 items-center mb-6">
                  <input
                    type="text"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    placeholder={`Add ${entryType}...`}
                    className="bg-transparent border border-acc/20 text-acc text-sm px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
                <input
                  type="text"
                  value={entryTime}
                  onChange={e => setEntryTime(e.target.value)}
                  placeholder="time HH:MM (optional)"
                  className="bg-transparent text-acc/30 text-xs outline-none w-full"
                />
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 text-xs mb-4">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="flex items-baseline gap-8 text-sm mb-2">
                    <span className="text-acc/30 text-xs uppercase shrink-0">{e.type}</span>
                    <span className="text-acc/80 flex-1">{e.text}</span>
                    {e.time && (
                      <span className="text-acc/30 text-xs tabular-nums shrink-0">{e.time}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {todayEntries.length > 0 && (
          <div className="mb-12">
            <div className="text-acc/30 text-xs mb-4 uppercase tracking-widest">Active · T+0</div>
            {todayEntries.map((entry, i) => (
              <div key={i} className="flex items-baseline gap-8 text-sm mb-2">
                <span className="text-acc/30 text-xs uppercase shrink-0">{entry.type}</span>
                <span className="text-acc flex-1">{entry.text}</span>
                {entry.time && (
                  <span className="text-acc/30 text-xs tabular-nums shrink-0">{entry.time}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {futureEntries.length > 0 && (
          <div className="space-y-2">
            {futureEntries.map((entry, i) => {
              const daysUntil = dayjs(entry.date).startOf('day').diff(
                dayjs().startOf('day'), 'day'
              )
              const tLabel = `T-${daysUntil}`
              return (
                <div key={i} className="flex items-baseline gap-8 text-sm">
                  <span className="text-acc/25 text-xs tabular-nums shrink-0 w-10">{tLabel}</span>
                  <span className="text-acc/40 text-xs whitespace-nowrap shrink-0">
                    {dayjs(entry.date).format('MMM D')}
                  </span>
                  <span className="text-acc flex-1">{entry.text}</span>
                  {entry.time && (
                    <span className="text-acc/30 text-xs tabular-nums shrink-0">{entry.time}</span>
                  )}
                  {entry.type !== 'note' && (
                    <span className="text-acc/25 text-xs uppercase shrink-0">{entry.type}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40 text-sm">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
