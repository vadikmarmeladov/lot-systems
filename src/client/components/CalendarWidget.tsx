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
  id?: string
  date: string
  text: string
  type: EntryType
  time?: string // HH:MM optional
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

function padTwo(n: number): string {
  return String(n).padStart(2, '0')
}

function formatTMinus(now: Dayjs, dateStr: string, timeStr?: string): string {
  const today = now.format('YYYY-MM-DD')

  if (dateStr < today) return 'ELAPSED'

  if (dateStr === today) {
    if (timeStr) {
      const [h, m] = timeStr.split(':').map(Number)
      const target = now.startOf('day').add(h, 'hour').add(m, 'minute')
      const diffMs = target.diff(now)
      if (diffMs < -5 * 60_000) return 'ELAPSED'
      if (diffMs < 0) return 'NOW'
      const hh = Math.floor(diffMs / 3_600_000)
      const mm = Math.floor((diffMs % 3_600_000) / 60_000)
      const ss = Math.floor((diffMs % 60_000) / 1_000)
      if (hh > 0) return `T− ${padTwo(hh)}:${padTwo(mm)}:${padTwo(ss)}`
      return `T− ${padTwo(mm)}:${padTwo(ss)}`
    }
    return 'TODAY'
  }

  const days = dayjs(dateStr).diff(now.startOf('day'), 'day')
  return `+${days}D`
}

function tMinusUrgency(label: string): 'elapsed' | 'now' | 'soon' | 'normal' {
  if (label === 'ELAPSED') return 'elapsed'
  if (label === 'NOW') return 'now'
  if (label === 'TODAY' || label.startsWith('T−')) return 'soon'
  return 'normal'
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
  const [entryTime, setEntryTime] = React.useState('')

  // 1-second tick for T-minus countdowns
  React.useEffect(() => {
    const iv = setInterval(() => setNow(dayjs()), 1_000)
    return () => clearInterval(iv)
  }, [])

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
    const today = now.format('YYYY-MM-DD')
    return entries
      .filter(e => e.date >= today)
      .slice(0, 10)
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

  const today = now.format('YYYY-MM-DD')
  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(selectedDate === key ? null : key)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const timeLabel = entryTime ? ` @ ${entryTime}` : ''
    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        ...(entryTime ? { time: entryTime } : {}),
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
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        {/* Live clock line */}
        <div className="flex items-baseline justify-between mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
          <span className="tabular-nums text-acc/40 text-xs tracking-widest">
            {now.format('HH:mm:ss')}
          </span>
        </div>

        {isCalendarOpen && (
          <div className="mb-16">
            {/* Month nav */}
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

            {/* Add entry form */}
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
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
                <div className="flex items-center gap-8">
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-1 outline-none focus:border-acc/40 text-sm tabular-nums w-28"
                  />
                  <span className="text-acc/20 text-xs tracking-widest">TIME (OPTIONAL)</span>
                </div>
              </div>
            )}

            {/* Entries on selected date */}
            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4 tracking-widest text-xs uppercase">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => {
                  const tLabel = formatTMinus(now, e.date, e.time)
                  const urgency = tMinusUrgency(tLabel)
                  return (
                    <div key={i} className="mb-4">
                      <div className="flex items-baseline justify-between gap-8">
                        <span className="text-acc/80">{e.text}</span>
                        <span className={cn(
                          'text-xs tabular-nums tracking-widest whitespace-nowrap',
                          urgency === 'now' && 'text-acc',
                          urgency === 'soon' && 'text-acc/60',
                          urgency === 'elapsed' && 'text-acc/20',
                          urgency === 'normal' && 'text-acc/40',
                        )}>
                          {e.time && <span className="mr-4">{e.time}</span>}
                          {tLabel}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Upcoming entries */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-2">
            {upcomingEntries.map((entry, i) => {
              const tLabel = formatTMinus(now, entry.date, entry.time)
              const urgency = tMinusUrgency(tLabel)
              return (
                <div key={i} className="flex justify-between gap-16 items-baseline">
                  <div className="flex-1 min-w-0">
                    <div className="text-acc truncate">{entry.text}</div>
                    <div className="text-acc/30 text-xs tracking-wide">
                      {dayjs(entry.date).format('ddd D MMM')}
                      {entry.time && <span className="ml-4">{entry.time}</span>}
                    </div>
                  </div>
                  <span className={cn(
                    'text-xs tabular-nums tracking-widest whitespace-nowrap shrink-0',
                    urgency === 'now' && 'text-acc font-bold',
                    urgency === 'soon' && 'text-acc/70',
                    urgency === 'elapsed' && 'text-acc/20',
                    urgency === 'normal' && 'text-acc/40',
                  )}>
                    {tLabel}
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
