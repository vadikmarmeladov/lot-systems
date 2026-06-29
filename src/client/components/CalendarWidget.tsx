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

const TYPE_CODE: Record<EntryType, string> = {
  note: 'NOTE',
  task: 'TASK',
  call: 'CALL',
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

function getRelativeLabel(dateStr: string, now: Dayjs): string {
  const diff = dayjs(dateStr).startOf('day').diff(now.startOf('day'), 'day')
  if (diff === 0) return 'TODAY'
  if (diff === 1) return 'TMR'
  if (diff <= 7) return `IN ${diff}D`
  if (diff <= 14) return 'IN 1W'
  if (diff <= 21) return 'IN 2W'
  if (diff <= 28) return 'IN 3W'
  return `IN ${Math.ceil(diff / 30)}M`
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  // Live clock — updates every minute for accurate relative labels
  const [now, setNow] = React.useState(() => dayjs())
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [entryTime, setEntryTime] = React.useState('')

  const alertFiredRef = React.useRef(false)

  React.useEffect(() => {
    const tick = setInterval(() => setNow(dayjs()), 60_000)
    return () => clearInterval(tick)
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
        if (a.time && b.time) return a.time.localeCompare(b.time)
        if (a.time) return -1
        if (b.time) return 1
        return 0
      })
  }, [logs])

  // Fire calendar_alert once per day when today or tomorrow has events
  React.useEffect(() => {
    if (alertFiredRef.current || !entries.length) return

    const todayKey = dayjs().format('YYYY-MM-DD')
    const tomorrowKey = dayjs().add(1, 'day').format('YYYY-MM-DD')
    const todayEvents = entries.filter(e => e.date === todayKey)
    const tomorrowEvents = entries.filter(e => e.date === tomorrowKey)

    if (!todayEvents.length && !tomorrowEvents.length) {
      alertFiredRef.current = true
      return
    }

    try {
      const storageKey = `lot_cal_alert_${todayKey}`
      if (localStorage.getItem(storageKey)) {
        alertFiredRef.current = true
        return
      }
      localStorage.setItem(storageKey, '1')
    } catch (_) {}

    alertFiredRef.current = true

    const period = todayEvents.length > 0 ? 'today' : 'tomorrow'
    const targetEvents = todayEvents.length > 0 ? todayEvents : tomorrowEvents
    const eventsPayload = targetEvents.map(e => ({
      text: e.text,
      type: e.type,
      ...(e.time ? { time: e.time } : {}),
    }))

    createLog({
      text: `[CAL ALERT] ${targetEvents.length} event${targetEvents.length > 1 ? 's' : ''} ${period}`,
      event: 'calendar_alert',
      metadata: {
        period,
        eventCount: targetEvents.length,
        events: eventsPayload,
      },
    }, {
      onSuccess: () => queryClient.refetchQueries(['/api/logs']),
    })
  }, [entries, createLog, queryClient])

  const todayStr = now.format('YYYY-MM-DD')

  const upcomingEntries = React.useMemo(() => {
    return entries.filter(e => e.date >= todayStr).slice(0, 10)
  }, [entries, todayStr])

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

  const todayUpcoming = upcomingEntries.filter(e => e.date === todayStr)
  const futureUpcoming = upcomingEntries.filter(e => e.date > todayStr)

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(selectedDate === key ? null : key)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeLabel = entryTime.trim() ? ` at ${entryTime.trim()}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType.toUpperCase()}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        ...(entryTime.trim() ? { time: entryTime.trim() } : {}),
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
            {/* Month navigation */}
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
                          + entry
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Entry creation form */}
            {isAddingEntry && selectedDate && (
              <div className="mt-8">
                <div className="flex gap-8 mb-8">
                  {(['note', 'task', 'call'] as EntryType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setEntryType(t)}
                      className={cn(
                        'transition-opacity',
                        entryType === t ? 'text-acc' : 'text-acc/40 hover:text-acc/60'
                      )}
                    >
                      {TYPE_CODE[t]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-8 items-center mb-4">
                  <input
                    type="text"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    placeholder={`${TYPE_CODE[entryType]} details...`}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 flex-1 outline-none focus:border-acc/40"
                    autoFocus
                  />
                </div>
                <div className="flex gap-8 items-center">
                  <input
                    type="text"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    placeholder="HH:MM (optional)"
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-2 w-32 outline-none focus:border-acc/40"
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                  <button
                    className="text-acc/30 hover:text-acc/60 transition-opacity"
                    onClick={() => { setIsAddingEntry(false); setEntryText(''); setEntryTime('') }}
                  >
                    cancel
                  </button>
                </div>
              </div>
            )}

            {/* Selected date entries */}
            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/30 uppercase tracking-widest text-xs mb-4">
                  {dayjs(selectedDate).format('ddd DD MMM')}
                  {selectedDate === todayStr ? ' · TODAY' : ''}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="flex gap-8 mb-1">
                    <span className="text-acc/30 uppercase text-xs w-8 flex-shrink-0">{TYPE_CODE[e.type]}</span>
                    <span className="text-acc/80">{e.text}</span>
                    {e.time && <span className="text-acc/40 tabular-nums ml-auto">{e.time}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Today's events — always visible when present */}
        {todayUpcoming.length > 0 && (
          <div className="mb-12">
            <div className="text-acc/30 uppercase tracking-widest text-xs mb-4">Today</div>
            {todayUpcoming.map((entry, i) => (
              <div key={i} className="flex gap-8 mb-1">
                <span className="text-acc/30 uppercase text-xs w-8 flex-shrink-0">{TYPE_CODE[entry.type]}</span>
                <span className="text-acc flex-1">{entry.text}</span>
                {entry.time && (
                  <span className="text-acc/60 tabular-nums whitespace-nowrap">{entry.time}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Future upcoming entries */}
        {futureUpcoming.length > 0 && (
          <div className="space-y-1">
            {futureUpcoming.map((entry, i) => {
              const label = getRelativeLabel(entry.date, now)
              return (
                <div key={i} className="flex justify-between gap-8">
                  <span className="text-acc/40 whitespace-nowrap tabular-nums w-12 flex-shrink-0">{label}</span>
                  <span className="text-acc/60 flex-1">
                    {entry.time && <span className="text-acc/30 mr-4">{entry.time}</span>}
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
