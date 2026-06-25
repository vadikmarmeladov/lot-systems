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
  time?: string
  text: string
  type: EntryType
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const TYPE_LABEL: Record<EntryType, string> = {
  note: 'NOTE',
  task: 'TASK',
  call: 'COMM',
}

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

function formatCountdown(date: string, time: string | undefined, now: Dayjs): string {
  if (!time) {
    const diffDays = dayjs(date).diff(now.startOf('day'), 'day')
    if (diffDays === 0) return 'TODAY'
    if (diffDays === 1) return 'T-1d'
    return `T-${diffDays}d`
  }

  const target = dayjs(`${date}T${time}:00`)
  const diffMin = target.diff(now, 'minute')

  if (diffMin < -30) return 'PAST'
  if (diffMin <= 1) return 'NOW'
  if (diffMin < 60) return `T-${diffMin}m`
  const hours = Math.floor(diffMin / 60)
  const mins = diffMin % 60
  if (diffMin < 60 * 24) return mins > 0 ? `T-${hours}h${mins}m` : `T-${hours}h`
  const days = Math.floor(hours / 24)
  const remH = hours % 24
  return remH > 0 ? `T-${days}d${remH}h` : `T-${days}d`
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

  // Live ticker — updates countdown every 30 seconds
  const [now, setNow] = React.useState(() => dayjs())
  React.useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 30_000)
    return () => clearInterval(id)
  }, [])

  // Session guard — prevents double-firing alerts for the same entry
  const alertedRef = React.useRef(new Set<string>())

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        time: log.metadata?.time as string | undefined,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => {
        const aKey = a.time ? `${a.date}T${a.time}` : `${a.date}T23:59`
        const bKey = b.time ? `${b.date}T${b.time}` : `${b.date}T23:59`
        return aKey.localeCompare(bKey)
      })
  }, [logs])

  // Auto-alert: fire calendar_alert log for today's entries not yet alerted
  React.useEffect(() => {
    if (entries.length === 0) return

    const todayStr = now.format('YYYY-MM-DD')
    const nowMinutes = now.hour() * 60 + now.minute()

    const existingAlerts = new Set(
      logs
        .filter(l => l.event === 'calendar_alert' && l.metadata?.date)
        .map(l => `${l.metadata.date}|${l.metadata.text}`)
    )

    entries.forEach(entry => {
      if (entry.date !== todayStr) return
      const alertKey = `${entry.date}|${entry.text}`
      if (existingAlerts.has(alertKey)) return
      if (alertedRef.current.has(alertKey)) return

      let status: 'TODAY' | 'IMMINENT' = 'TODAY'
      let minutesUntil = 0

      if (entry.time) {
        const [h, m] = entry.time.split(':').map(Number)
        minutesUntil = h * 60 + m - nowMinutes
        if (minutesUntil >= -30 && minutesUntil <= 60) {
          status = 'IMMINENT'
        }
      }

      alertedRef.current.add(alertKey)
      createLog(
        {
          text: `[CAL-ALERT] ${TYPE_LABEL[entry.type]}: ${entry.text} — ${entry.date}${entry.time ? ' ' + entry.time : ''}`,
          event: 'calendar_alert',
          metadata: {
            date: entry.date,
            time: entry.time,
            text: entry.text,
            entryType: entry.type,
            status,
            minutesUntil,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['/api/logs'])
          },
        }
      )
    })
  }, [entries, logs, now])

  const upcomingEntries = React.useMemo(() => {
    const today = now.format('YYYY-MM-DD')
    return entries.filter(e => e.date >= today).slice(0, 10)
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

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeLabel = entryTime ? ` ${entryTime}` : ''

    createLog(
      {
        text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
        event: 'calendar_entry',
        metadata: {
          date: selectedDate,
          time: entryTime || undefined,
          text: entryText.trim(),
          entryType,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['/api/logs'])
          try {
            recordCalendarSignal(entryType, selectedDate!)
          } catch (_) {}
        },
      }
    )

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
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
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
              <span className="text-acc">{viewMonth.format('MMMM, YYYY')}</span>
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
                        {DAY_LETTERS[di]}
                        {d.date()}
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
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-2 w-[7em] outline-none focus:border-acc/40 tabular-nums"
                  />
                  <input
                    type="text"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddEntry()
                    }}
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
                <div className="text-acc/40 mb-4">{dayjs(selectedDate).format('dddd, MMMM D')}</div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="flex items-baseline gap-8 mb-1">
                    <span className="text-acc/30 uppercase tracking-widest shrink-0">
                      {TYPE_LABEL[e.type]}
                    </span>
                    {e.time && (
                      <span className="tabular-nums text-acc/50 shrink-0">{e.time}</span>
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
              const countdown = formatCountdown(entry.date, entry.time, now)
              const isToday = entry.date === today
              const isNow = countdown === 'NOW'

              return (
                <div key={i} className="flex items-baseline gap-8">
                  <span
                    className={cn(
                      'tabular-nums whitespace-nowrap shrink-0',
                      isNow
                        ? 'text-acc'
                        : isToday
                          ? 'text-acc/60'
                          : 'text-acc/30'
                    )}
                  >
                    {countdown}
                  </span>
                  <span className="text-acc/40 tabular-nums whitespace-nowrap shrink-0">
                    {dayjs(entry.date).format('MMM D')}
                    {entry.time ? ` ${entry.time}` : ''}
                  </span>
                  <span className="text-acc/30 uppercase tracking-widest whitespace-nowrap shrink-0">
                    {TYPE_LABEL[entry.type]}
                  </span>
                  <span className={cn(isToday ? 'text-acc/80' : 'text-acc/50')}>
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
