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
const ALERT_KEY = 'lot_cal_alerts'

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

// Returns [T-Xd] style countdown label for the upcoming entries list
function getCountdown(date: string): string {
  const today = dayjs().startOf('day')
  const target = dayjs(date).startOf('day')
  const days = target.diff(today, 'day')
  if (days === 0) return 'TODAY'
  if (days === 1) return 'T-1D'
  if (days < 7) return `T-${days}D`
  if (days < 14) return 'T-1W'
  if (days < 30) return `T-${Math.floor(days / 7)}W`
  return `T-${Math.ceil(days / 30)}M`
}

// Alert record is scoped to today; resets on midnight rollover
function readAlertRecord(): Record<string, true> {
  try {
    const raw = localStorage.getItem(ALERT_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as { date: string; fired: Record<string, true> }
    if (data.date !== dayjs().format('YYYY-MM-DD')) return {}
    return data.fired || {}
  } catch {
    return {}
  }
}

function markFired(key: string): void {
  const today = dayjs().format('YYYY-MM-DD')
  const fired = readAlertRecord()
  fired[key] = true
  localStorage.setItem(ALERT_KEY, JSON.stringify({ date: today, fired }))
}

function hasFired(key: string): boolean {
  return !!readAlertRecord()[key]
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
  // Minute-tick forces countdown labels and date comparisons to stay live
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000)
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

  // tick keeps today-relative filters accurate across midnight
  const today = React.useMemo(() => dayjs().format('YYYY-MM-DD'), [tick])

  const todayEntries = React.useMemo(() => {
    return entries.filter(e => e.date === today)
  }, [entries, today])

  const upcomingEntries = React.useMemo(() => {
    return entries.filter(e => e.date >= today).slice(0, 10)
  }, [entries, today])

  const entriesOnDate = React.useMemo(() => {
    if (!selectedDate) return []
    return entries.filter(e => e.date === selectedDate)
  }, [entries, selectedDate])

  const datesWithEntries = React.useMemo(() => {
    const s = new Set<string>()
    entries.forEach(e => s.add(e.date))
    return s
  }, [entries])

  // Military alert system — fires log notifications for today / tomorrow events.
  // Deduped via localStorage per calendar day; resets automatically at midnight.
  React.useEffect(() => {
    if (!entries.length) return

    const now = dayjs()
    const todayStr = now.format('YYYY-MM-DD')
    const tomorrowStr = now.add(1, 'day').format('YYYY-MM-DD')

    entries.forEach(entry => {
      if (!entry.date || !entry.text) return

      const typeCode = (entry.type || 'note').toUpperCase()
      const slug = entry.text.slice(0, 40).replace(/[^A-Z0-9]/gi, '_').toUpperCase()

      if (entry.date === todayStr) {
        const key = `today__${todayStr}__${slug}`
        if (!hasFired(key)) {
          createLog(
            {
              text: `[SCHEDULE][ACTIVE] OP TODAY — ${typeCode}: ${entry.text} | ${entry.date} | STATUS: EXECUTE`,
              event: 'calendar_alert',
              metadata: { alertType: 'today', date: entry.date, text: entry.text, type: entry.type },
            },
            { onSuccess: () => queryClient.refetchQueries(['/api/logs']) }
          )
          markFired(key)
        }
      } else if (entry.date === tomorrowStr) {
        const key = `tomorrow__${todayStr}__${slug}`
        if (!hasFired(key)) {
          createLog(
            {
              text: `[SCHEDULE][STANDBY] T-24H NOTICE — ${typeCode}: ${entry.text} | ${dayjs(entry.date).format('ddd, MMM D')} | STATUS: STANDBY`,
              event: 'calendar_alert',
              metadata: { alertType: 'tomorrow', date: entry.date, text: entry.text, type: entry.type },
            },
            { onSuccess: () => queryClient.refetchQueries(['/api/logs']) }
          )
          markFired(key)
        }
      }
    })
  }, [entries, tick]) // tick re-runs at midnight so T-0 alert fires at day boundary

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

    createLog(
      {
        text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dayjs(selectedDate).format('dddd, MMMM D, YYYY')})`,
        event: 'calendar_entry',
        metadata: { date: selectedDate, text: entryText.trim(), entryType },
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries(['/api/logs'])
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

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
        </div>

        {/* Active today — inline mission alert strip */}
        {todayEntries.length > 0 && (
          <div className="mb-12 space-y-1">
            {todayEntries.map((e, i) => (
              <div key={i} className="font-mono text-xs tracking-wide text-acc">
                [TODAY] {(e.type || 'NOTE').toUpperCase()}: {e.text}
              </div>
            ))}
          </div>
        )}

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
                          'py-0.5 px-0.5 transition-opacity whitespace-nowrap min-w-[2.5em] text-left',
                          !isCurrentMonth && 'text-acc/20',
                          isCurrentMonth && !isToday && 'text-acc/40',
                          isToday && 'text-acc font-bold',
                          isSelected && 'underline',
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
                  <div key={i} className="text-acc/80 mb-1">{e.text}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming entries with military countdown codes */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const countdown = getCountdown(entry.date)
              const isToday = entry.date === today
              return (
                <div key={i} className="flex gap-8 items-baseline">
                  <span className={cn(
                    'font-mono text-xs tracking-wider whitespace-nowrap flex-shrink-0 w-[4.5em]',
                    isToday ? 'text-acc' : 'text-acc/40'
                  )}>
                    [{countdown}]
                  </span>
                  <span className={cn(
                    'whitespace-nowrap flex-shrink-0',
                    isToday ? 'text-acc' : 'text-acc/60'
                  )}>
                    {dayjs(entry.date).format('ddd, MMM D')}
                  </span>
                  <span className="text-acc flex-1 text-right">{entry.text}</span>
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
