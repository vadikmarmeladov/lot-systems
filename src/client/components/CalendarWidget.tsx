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
type Priority = 'P1' | 'P2' | 'P3'
type UrgencyZone = 'overdue' | 'today' | 'tomorrow' | 'thisWeek' | 'later'

type CalendarEntry = {
  date: string
  text: string
  type: EntryType
  time?: string
  priority?: Priority
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

function getUrgencyZone(date: string, today: string, tomorrow: string, weekEnd: string): UrgencyZone {
  if (date < today) return 'overdue'
  if (date === today) return 'today'
  if (date === tomorrow) return 'tomorrow'
  if (date <= weekEnd) return 'thisWeek'
  return 'later'
}

function getCountdown(date: string, time: string, now: Dayjs): string {
  const [h, m] = time.split(':').map(Number)
  const target = dayjs(date).hour(h).minute(m)
  const diff = target.diff(now, 'minute')
  if (diff <= 0) return 'NOW'
  const hours = Math.floor(diff / 60)
  const mins = diff % 60
  if (hours > 0) return `T-${hours}h${mins > 0 ? `${String(mins).padStart(2, '0')}m` : ''}`
  return `T-${mins}m`
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
  const [entryPriority, setEntryPriority] = React.useState<Priority | null>(null)
  const [now, setNow] = React.useState(() => dayjs())

  React.useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 60_000)
    return () => clearInterval(timer)
  }, [])

  const todayStr = now.format('YYYY-MM-DD')
  const tomorrowStr = now.add(1, 'day').format('YYYY-MM-DD')
  const weekEndStr = now.add(7, 'day').format('YYYY-MM-DD')

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
        time: log.metadata?.time as string | undefined,
        priority: log.metadata?.priority as Priority | undefined,
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date)
        if (dateCmp !== 0) return dateCmp
        if (a.time && b.time) return a.time.localeCompare(b.time)
        if (a.time) return -1
        if (b.time) return 1
        return 0
      })
  }, [logs])

  const groupedEntries = React.useMemo(() => {
    const groups: Record<UrgencyZone, CalendarEntry[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
    }
    entries.forEach(e => {
      const zone = getUrgencyZone(e.date, todayStr, tomorrowStr, weekEndStr)
      groups[zone].push(e)
    })
    return groups
  }, [entries, todayStr, tomorrowStr, weekEndStr])

  const datesWithEntries = React.useMemo(() => {
    const set = new Set<string>()
    entries.forEach(e => set.add(e.date))
    return set
  }, [entries])

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  const weeks = React.useMemo(
    () => getMonthWeeks(viewMonth.year(), viewMonth.month()),
    [viewMonth]
  )

  const hasAnyEntries = Object.values(groupedEntries).some(g => g.length > 0)

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(prev => prev === key ? null : key)
  }

  const handleFireAlert = React.useCallback((entry: CalendarEntry) => {
    const zone = getUrgencyZone(entry.date, todayStr, tomorrowStr, weekEndStr)
    const urgency = zone === 'overdue' ? 'OVERDUE' : zone === 'today' ? 'TODAY' : 'STANDBY'
    const dateLabel = dayjs(entry.date).format('dddd, MMMM D, YYYY')
    const timeLabel = entry.time ? ` · ${entry.time}` : ''
    createLog({
      text: `[CAL ALERT] ${entry.type.toUpperCase()}: ${entry.text} — ${dateLabel}${timeLabel}`,
      event: 'calendar_notification',
      metadata: {
        date: entry.date,
        time: entry.time,
        text: entry.text,
        entryType: entry.type,
        priority: entry.priority,
        urgency,
      },
    }, {
      onSuccess: () => queryClient.invalidateQueries(['/api/logs']),
    })
  }, [todayStr, tomorrowStr, weekEndStr, createLog, queryClient])

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const isToday = selectedDate === todayStr
    const timeVal = entryTime.trim() || undefined
    const priorityVal = entryPriority || undefined
    const textVal = entryText.trim()
    const typeVal = entryType

    createLog({
      text: `[SCHEDULE] ${typeVal}: ${textVal} (${dateLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: textVal,
        entryType: typeVal,
        ...(timeVal ? { time: timeVal } : {}),
        ...(priorityVal ? { priority: priorityVal } : {}),
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['/api/logs'])
        try { recordCalendarSignal(typeVal, selectedDate!) } catch (_) {}
        if (isToday) {
          const timeLabel = timeVal ? ` · ${timeVal}` : ''
          setTimeout(() => {
            createLog({
              text: `[CAL ALERT] ${typeVal.toUpperCase()}: ${textVal} — TODAY${timeLabel}`,
              event: 'calendar_notification',
              metadata: {
                date: selectedDate,
                text: textVal,
                entryType: typeVal,
                priority: priorityVal,
                urgency: 'TODAY',
                ...(timeVal ? { time: timeVal } : {}),
              },
            }, {
              onSuccess: () => queryClient.invalidateQueries(['/api/logs']),
            })
          }, 500)
        }
      },
    })

    setEntryText('')
    setEntryTime('')
    setEntryPriority(null)
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
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

            {isAddingEntry && selectedDate && (
              <div className="mt-8">
                <div className="flex gap-8 mb-8 flex-wrap items-center">
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
                  <span className="text-acc/20">·</span>
                  {(['P1', 'P2', 'P3'] as Priority[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setEntryPriority(prev => prev === p ? null : p)}
                      className={cn(
                        'transition-opacity',
                        entryPriority === p ? 'text-acc' : 'text-acc/30 hover:text-acc/50'
                      )}
                    >
                      {p}
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
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-2 w-[90px] outline-none focus:border-acc/40 tabular-nums"
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
                  <div key={i} className="flex items-baseline gap-8 mb-1">
                    <span className="text-acc/30 uppercase text-xs">{e.type}</span>
                    {e.time && <span className="text-acc/40 tabular-nums text-xs">{e.time}</span>}
                    {e.priority && <span className="text-acc/30 text-xs">{e.priority}</span>}
                    <span className="text-acc/80">{e.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {hasAnyEntries && (
          <div className="space-y-12">
            {groupedEntries.overdue.length > 0 && (
              <div>
                <div className="text-acc/30 uppercase tracking-widest text-xs mb-4">Overdue</div>
                {groupedEntries.overdue.map((entry, i) => (
                  <div key={i} className="flex justify-between gap-8 mb-1 group items-baseline">
                    <div className="flex gap-8 items-baseline min-w-0">
                      <span className="text-acc/20 whitespace-nowrap tabular-nums shrink-0 text-xs">
                        {dayjs(entry.date).format('MMM D')}
                      </span>
                      {entry.time && (
                        <span className="text-acc/20 tabular-nums text-xs shrink-0">{entry.time}</span>
                      )}
                      <span className="text-acc/30">{entry.text}</span>
                      {entry.priority && <span className="text-acc/20 text-xs">{entry.priority}</span>}
                    </div>
                    <button
                      className="text-acc/20 hover:text-acc/50 transition-opacity opacity-0 group-hover:opacity-100 shrink-0 text-xs"
                      onClick={() => handleFireAlert(entry)}
                    >
                      [!]
                    </button>
                  </div>
                ))}
              </div>
            )}

            {groupedEntries.today.length > 0 && (
              <div>
                <div className="text-acc uppercase tracking-widest text-xs mb-4">Today</div>
                {groupedEntries.today.map((entry, i) => {
                  const countdown = entry.time ? getCountdown(entry.date, entry.time, now) : null
                  return (
                    <div key={i} className="flex justify-between gap-8 mb-1 group items-baseline">
                      <div className="flex gap-8 items-baseline min-w-0">
                        {entry.time && (
                          <span className="text-acc/60 tabular-nums text-xs whitespace-nowrap shrink-0">{entry.time}</span>
                        )}
                        <span className="text-acc">{entry.text}</span>
                        {entry.priority && (
                          <span className="text-acc/40 text-xs">{entry.priority}</span>
                        )}
                      </div>
                      <div className="flex gap-8 items-center shrink-0">
                        {countdown && (
                          <span className="text-acc/50 tabular-nums text-xs whitespace-nowrap">{countdown}</span>
                        )}
                        <button
                          className="text-acc/30 hover:text-acc/80 transition-opacity opacity-0 group-hover:opacity-100 text-xs"
                          onClick={() => handleFireAlert(entry)}
                        >
                          [!]
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {groupedEntries.tomorrow.length > 0 && (
              <div>
                <div className="text-acc/40 uppercase tracking-widest text-xs mb-4">Tomorrow</div>
                {groupedEntries.tomorrow.map((entry, i) => (
                  <div key={i} className="flex justify-between gap-8 mb-1 items-baseline">
                    <div className="flex gap-8 items-baseline min-w-0">
                      {entry.time && (
                        <span className="text-acc/40 tabular-nums text-xs whitespace-nowrap shrink-0">{entry.time}</span>
                      )}
                      <span className="text-acc/60">{entry.text}</span>
                      {entry.priority && (
                        <span className="text-acc/30 text-xs">{entry.priority}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {groupedEntries.thisWeek.length > 0 && (
              <div>
                <div className="text-acc/30 uppercase tracking-widest text-xs mb-4">This week</div>
                {groupedEntries.thisWeek.map((entry, i) => (
                  <div key={i} className="flex justify-between gap-8 mb-1 items-baseline">
                    <span className="text-acc/30 whitespace-nowrap tabular-nums shrink-0 text-xs">
                      {dayjs(entry.date).format('ddd D')}
                      {entry.time ? ` · ${entry.time}` : ''}
                    </span>
                    <div className="flex gap-8 items-baseline min-w-0">
                      <span className="text-acc/40 text-right">{entry.text}</span>
                      {entry.priority && <span className="text-acc/20 text-xs">{entry.priority}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {groupedEntries.later.length > 0 && (
              <div>
                <div className="text-acc/20 uppercase tracking-widest text-xs mb-4">Later</div>
                {groupedEntries.later.slice(0, 5).map((entry, i) => (
                  <div key={i} className="flex justify-between gap-8 mb-1 items-baseline">
                    <span className="text-acc/20 whitespace-nowrap tabular-nums shrink-0 text-xs">
                      {dayjs(entry.date).format('MMM D')}
                    </span>
                    <div className="flex gap-8 items-baseline min-w-0">
                      <span className="text-acc/30 text-right">{entry.text}</span>
                      {entry.priority && <span className="text-acc/15 text-xs">{entry.priority}</span>}
                    </div>
                  </div>
                ))}
                {groupedEntries.later.length > 5 && (
                  <div className="text-acc/15 text-xs mt-4">+{groupedEntries.later.length - 5} more</div>
                )}
              </div>
            )}
          </div>
        )}

        {!hasAnyEntries && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
