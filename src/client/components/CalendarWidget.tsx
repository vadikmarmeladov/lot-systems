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
const TYPE_SHORT: Record<EntryType, string> = { note: 'NOTE', task: 'TASK', call: 'CALL' }

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

function simpleHash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(36)
}

function getAlertKey(date: string, text: string, alertType: string): string {
  return `lot_cal_${date}_${simpleHash(text)}_${alertType}`
}

type TMinusResult = { label: string; urgency: string; daysUntil: number }

function getTMinus(dateStr: string, now: Dayjs): TMinusResult {
  const eventDay = dayjs(dateStr).startOf('day')
  const today = now.startOf('day')
  const daysUntil = eventDay.diff(today, 'day')

  if (daysUntil < 0) return { label: 'PAST', urgency: '', daysUntil }
  if (daysUntil === 0) return { label: 'T-0', urgency: '· TODAY', daysUntil: 0 }
  if (daysUntil === 1) return { label: 'T-1', urgency: '· TOMORROW', daysUntil: 1 }
  return { label: `T-${daysUntil}D`, urgency: '', daysUntil }
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
  const [now, setNow] = React.useState(() => dayjs())

  // Stable ref for createLog — safe to call inside intervals
  const createLogRef = React.useRef(createLog)
  React.useEffect(() => { createLogRef.current = createLog }, [createLog])

  // Live tick: recompute T-minus labels every minute
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
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [logs])

  // now-reactive so crossing midnight updates the list without reload
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

  // Alert engine: fire calendar_alert logs at T-0 and T-1 thresholds.
  // localStorage gates each alert to fire exactly once per entry per threshold.
  React.useEffect(() => {
    function checkAlerts() {
      const todayDjs = dayjs().startOf('day')

      upcomingEntries.forEach(entry => {
        const eventDay = dayjs(entry.date).startOf('day')
        const daysUntil = eventDay.diff(todayDjs, 'day')

        const fire = (alertType: string, label: string, dateLabel: string) => {
          const key = getAlertKey(entry.date, entry.text, alertType)
          if (localStorage.getItem(key)) return
          localStorage.setItem(key, '1')
          createLogRef.current({
            text: `[ALERT] ${label} · ${entry.type.toUpperCase()}: ${entry.text} — ${dateLabel}`,
            event: 'calendar_alert',
            metadata: {
              alertType,
              date: entry.date,
              entryType: entry.type,
              entryText: entry.text,
              daysUntil,
            },
          })
        }

        if (daysUntil === 0) fire('T-0', 'T-0', 'today')
        if (daysUntil === 1) fire('T-1', 'T-1', 'tomorrow')
      })
    }

    checkAlerts()
    const interval = setInterval(checkAlerts, 5 * 60_000)
    return () => clearInterval(interval)
  }, [upcomingEntries])

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
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    setEntryText('')
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
                  <div key={i} className="flex gap-8 items-baseline mb-1">
                    <span className="text-acc/30 uppercase text-xs min-w-[2.5em]">
                      {TYPE_SHORT[e.type]}
                    </span>
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
              const tm = getTMinus(entry.date, now)
              const isToday = tm.daysUntil === 0
              return (
                <div key={i} className="flex items-baseline gap-8">
                  <span className={cn(
                    'tabular-nums whitespace-nowrap min-w-[3em]',
                    isToday ? 'text-acc' : 'text-acc/40',
                  )}>
                    {tm.label}
                  </span>
                  {tm.urgency && (
                    <span className="text-acc/30 whitespace-nowrap text-xs">{tm.urgency}</span>
                  )}
                  <span className={cn(
                    'uppercase text-xs whitespace-nowrap min-w-[2.5em]',
                    entry.type === 'task' ? 'text-acc/60' :
                    entry.type === 'call' ? 'text-acc/50' :
                    'text-acc/30',
                  )}>
                    {TYPE_SHORT[entry.type]}
                  </span>
                  <span className={cn(
                    'flex-1',
                    isToday ? 'text-acc' : 'text-acc/80',
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
