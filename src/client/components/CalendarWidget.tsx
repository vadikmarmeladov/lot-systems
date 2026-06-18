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
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const ALERT_STORAGE_KEY = 'cal_alert_last_date'

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

function getStatusLabel(date: string): string {
  const d = dayjs(date).startOf('day')
  const today = dayjs().startOf('day')
  const diff = d.diff(today, 'day')
  if (diff === 0) return 'TODAY'
  if (diff === 1) return 'TOMORROW'
  if (diff > 1) return `T-${diff}D`
  return `T+${Math.abs(diff)}D`
}

function useClock(): string {
  const [tick, setTick] = React.useState(() => dayjs().format('HH:mm:ss'))
  React.useEffect(() => {
    const id = setInterval(() => setTick(dayjs().format('HH:mm:ss')), 1000)
    return () => clearInterval(id)
  }, [])
  return tick
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const clock = useClock()

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [entryTime, setEntryTime] = React.useState('')

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
        time: log.metadata?.time as string | undefined,
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date)
        if (dateCmp !== 0) return dateCmp
        return (a.time || '').localeCompare(b.time || '')
      })
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

  const today = dayjs().format('YYYY-MM-DD')
  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  // Fire daily alert once per day if today has calendar events
  React.useEffect(() => {
    if (!entries.length) return
    const lastAlertDate = localStorage.getItem(ALERT_STORAGE_KEY)
    if (lastAlertDate === today) return

    const todayEntries = entries.filter(e => e.date === today)
    if (!todayEntries.length) return

    localStorage.setItem(ALERT_STORAGE_KEY, today)

    const lines = todayEntries.map(e => {
      const prefix = `[${e.type.toUpperCase()}]`
      const timeStr = e.time ? ` @ ${e.time}` : ''
      return `${prefix} ${e.text}${timeStr}`
    })

    createLog({
      text: `[CAL-ALERT] ${todayEntries.length} event(s) today — ${dayjs().format('DD MMM YYYY').toUpperCase()}`,
      event: 'calendar_alert',
      metadata: {
        date: today,
        count: todayEntries.length,
        entries: todayEntries.map(e => ({ type: e.type, text: e.text, time: e.time })),
        lines,
      },
    }, {
      onSuccess: () => queryClient.invalidateQueries(['/api/logs']),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries])

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
    const timeStr = entryTime.trim() || undefined

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()}${timeStr ? ` @ ${timeStr}` : ''} (${dateLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        ...(timeStr ? { time: timeStr } : {}),
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['/api/logs'])
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
        <div className="mb-16 flex items-center gap-16">
          <Button onClick={handleToggleCalendar}>
            Add date
          </Button>
          <span className="text-acc/30 tabular-nums font-mono text-sm tracking-widest">
            {clock}
          </span>
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
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-2 outline-none focus:border-acc/40 w-28 tabular-nums"
                    title="Optional time"
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4 uppercase tracking-widest text-sm">
                  {dayjs(selectedDate).format('DD MMM YYYY')}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="flex gap-8 items-baseline mb-2">
                    <span className="text-acc/30 uppercase text-sm tracking-widest whitespace-nowrap">
                      [{e.type}]
                    </span>
                    {e.time && (
                      <span className="text-acc/40 tabular-nums text-sm whitespace-nowrap">
                        {e.time}
                      </span>
                    )}
                    <span className="text-acc/80">{e.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-2">
            {upcomingEntries.map((entry, i) => {
              const status = getStatusLabel(entry.date)
              const isToday = status === 'TODAY'
              const isTomorrow = status === 'TOMORROW'
              return (
                <div key={i} className="flex items-baseline gap-8">
                  <span className={cn(
                    'tabular-nums uppercase text-sm tracking-widest whitespace-nowrap w-20',
                    isToday ? 'text-acc' : isTomorrow ? 'text-acc/60' : 'text-acc/30'
                  )}>
                    {status}
                  </span>
                  <span className="text-acc/30 uppercase text-sm tracking-widest whitespace-nowrap">
                    [{entry.type}]
                  </span>
                  {entry.time && (
                    <span className="text-acc/40 tabular-nums text-sm whitespace-nowrap">
                      {entry.time}
                    </span>
                  )}
                  <span className={cn(
                    'text-right flex-1',
                    isToday ? 'text-acc' : 'text-acc/60'
                  )}>
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
