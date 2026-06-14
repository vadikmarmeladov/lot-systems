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
import { recordCalendarSignal, recordSignal } from '#client/stores/intentionEngine'

type EntryType = 'note' | 'task' | 'call'
type AlertLevel = 'critical' | 'high' | 'medium' | null

type CalendarEntry = {
  id: string
  date: string
  time?: string  // 'HH:MM'
  text: string
  type: EntryType
}

type EnrichedEntry = CalendarEntry & {
  minutesUntil: number | null
  alertLevel: AlertLevel
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

function computeMinutesUntil(date: string, time?: string): number | null {
  if (!time) return null
  return Math.round(dayjs(`${date}T${time}`).diff(dayjs()) / 60000)
}

function formatTminus(minutesUntil: number): string {
  const sign = minutesUntil < 0 ? '+' : '-'
  const abs = Math.abs(minutesUntil)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return `T${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function getAlertLevel(mu: number | null): AlertLevel {
  if (mu === null) return null
  if (mu <= 15) return 'critical'
  if (mu <= 60) return 'high'
  if (mu <= 1440) return 'medium'
  return null
}

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()

  // Keep createLog stable in ref so the alert effect never goes stale
  const createLogRef = React.useRef(createLog)
  React.useEffect(() => { createLogRef.current = createLog })

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [entryTime, setEntryTime] = React.useState('')

  // Tracks which alert thresholds have already fired this session
  const alertedRef = React.useRef(new Set<string>())

  // 1-second tick drives live T-minus countdowns and alert detection
  const [tick, setTick] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const today = dayjs().format('YYYY-MM-DD')

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata?.date)
      .map(log => ({
        id: log.id,
        date: log.metadata.date as string,
        time: log.metadata.time as string | undefined,
        text: (log.metadata.text as string) || log.text || '',
        type: (log.metadata.entryType as EntryType) || 'note',
      }))
      .filter(e => e.text)
      .sort((a, b) => {
        const dc = a.date.localeCompare(b.date)
        return dc !== 0 ? dc : (a.time || '23:59').localeCompare(b.time || '23:59')
      })
  }, [logs])

  // Today's events — recomputed every second via tick for live T-minus
  const todayEntries = React.useMemo<EnrichedEntry[]>(() => {
    return entries
      .filter(e => e.date === today)
      .map(e => {
        const mu = computeMinutesUntil(e.date, e.time)
        return { ...e, minutesUntil: mu, alertLevel: getAlertLevel(mu) }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, today, tick])

  const upcomingEntries = React.useMemo<EnrichedEntry[]>(() => {
    return entries
      .filter(e => e.date > today)
      .slice(0, 10)
      .map(e => ({ ...e, minutesUntil: null, alertLevel: null }))
  }, [entries, today])

  // Events firing within the next 60 minutes or just fired (up to 30 min ago)
  const imminentEntries = React.useMemo(() => {
    return todayEntries.filter(e =>
      e.minutesUntil !== null && e.minutesUntil >= -30 && e.minutesUntil <= 60
    )
  }, [todayEntries])

  // Alert detection — fires log entries once per threshold per session
  React.useEffect(() => {
    todayEntries.forEach(entry => {
      if (entry.minutesUntil === null) return
      const mu = entry.minutesUntil

      const thresholds: Array<{ key: string; trigger: boolean; label: string; level: string }> = [
        { key: `${entry.id}_now`, trigger: mu <= 0 && mu > -30,    label: '▲ NOW',        level: 'critical' },
        { key: `${entry.id}_15`,  trigger: mu > 0 && mu <= 15,     label: '▲ T-MINUS 15', level: 'critical' },
        { key: `${entry.id}_60`,  trigger: mu > 15 && mu <= 60,    label: '◈ T-MINUS 60', level: 'high'     },
      ]

      thresholds.forEach(({ key, trigger, label, level }) => {
        if (!trigger || alertedRef.current.has(key)) return
        alertedRef.current.add(key)

        const tminus = formatTminus(mu)
        const dateStr = dayjs(entry.date).format('ddd DD MMM').toUpperCase()
        const timeStr = entry.time ? ` @ ${entry.time}` : ''

        createLogRef.current(
          {
            text: `[${label}] ${tminus} | ${entry.type.toUpperCase()}: ${entry.text}${timeStr} — ${dateStr}`,
            event: 'calendar_alert',
            metadata: {
              entryType: entry.type,
              alertLevel: level,
              minutesUntil: mu,
              date: entry.date,
              time: entry.time || null,
              entryText: entry.text,
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['/api/logs'])
              try {
                recordSignal('log', 'calendar_alert', {
                  entryType: entry.type,
                  alertLevel: level,
                  minutesUntil: mu,
                  hour: new Date().getHours(),
                })
              } catch (_) {}
            },
          }
        )
      })
    })
  }, [todayEntries]) // runs every second via todayEntries recomputing

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

  const handleDateClick = (d: Dayjs) => {
    const key = d.format('YYYY-MM-DD')
    setSelectedDate(prev => prev === key ? null : key)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeStr = entryTime ? ` @ ${entryTime}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType.toUpperCase()}: ${entryText.trim()} (${dateLabel}${timeStr})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        time: entryTime || undefined,
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
    setEntryTime('')
    setIsAddingEntry(false)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(v => !v)
  }

  const hasAnyContent = todayEntries.length > 0 || upcomingEntries.length > 0

  return (
    <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
      <div className="w-full">

        {/* ALERT BAND — events within 60 min */}
        {imminentEntries.length > 0 && (
          <div className="border-l-2 border-acc pl-8 mb-16">
            <div className="text-acc/40 tracking-widest uppercase text-xs mb-4">
              ▲ ALERT — {imminentEntries.length} EVENT{imminentEntries.length !== 1 ? 'S' : ''} IMMINENT
            </div>
            {imminentEntries.map(e => (
              <div key={e.id} className="flex gap-8 items-baseline mb-2">
                <span className="tabular-nums text-acc font-mono text-xs min-w-[3.5em]">
                  {formatTminus(e.minutesUntil!)}
                </span>
                <span className="text-acc/40 uppercase text-xs w-8">{e.type[0]}</span>
                <span className="text-acc">{e.text}</span>
                {e.time && <span className="text-acc/30 tabular-nums text-xs">{e.time}</span>}
              </div>
            ))}
          </div>
        )}

        {/* ADD DATE BUTTON */}
        <div className="mb-16">
          <Button onClick={handleToggleCalendar}>Add date</Button>
        </div>

        {/* CALENDAR GRID */}
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
                          'py-0.5 px-0.5 transition-opacity whitespace-nowrap min-w-[2.5em] text-left',
                          !isCurrentMonth && 'text-acc/20',
                          isCurrentMonth && !isToday && 'text-acc/40',
                          hasEntry && isCurrentMonth && !isToday && 'text-acc/60',
                          isToday && 'text-acc font-bold',
                          isSelected && 'underline',
                        )}
                      >
                        {DAY_LETTERS[di]}{d.date()}
                      </button>
                    )
                  })}

                  {wi === 0 && selectedDate && !isAddingEntry && (
                    <div className="flex items-center ml-4">
                      <button
                        className="text-acc/30 hover:text-acc/60 transition-opacity whitespace-nowrap"
                        onClick={() => setIsAddingEntry(true)}
                      >
                        Note / Task / Call
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ENTRY FORM */}
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
                    className="bg-transparent border border-acc/20 text-acc/60 px-4 py-2 w-24 outline-none focus:border-acc/40 tabular-nums"
                  />
                  <Button onClick={handleAddEntry}>Add</Button>
                </div>
              </div>
            )}

            {/* ENTRIES ON SELECTED DATE */}
            {selectedDate && entriesOnDate.length > 0 && (
              <div className="mt-8">
                <div className="text-acc/40 mb-4 text-xs uppercase tracking-widest">
                  {dayjs(selectedDate).format('dddd, MMMM D')}
                </div>
                {entriesOnDate.map((e, i) => (
                  <div key={i} className="flex gap-8 items-baseline text-acc/80 mb-2">
                    {e.time && (
                      <span className="text-acc/40 tabular-nums text-xs">{e.time}</span>
                    )}
                    <span className="text-acc/40 uppercase text-xs">{e.type[0]}</span>
                    <span>{e.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TODAY PANEL */}
        {todayEntries.length > 0 && (
          <div className="mb-16">
            <div className="text-acc/40 tracking-widest uppercase text-xs mb-6">
              TODAY — {dayjs().format('ddd DD MMM').toUpperCase()}
            </div>
            {todayEntries.map(e => {
              const isPast = e.minutesUntil !== null && e.minutesUntil < -30
              const isCritical = e.alertLevel === 'critical'
              const isHigh = e.alertLevel === 'high'
              return (
                <div
                  key={e.id}
                  className={cn(
                    'flex gap-8 items-baseline mb-4',
                    isPast && 'opacity-25'
                  )}
                >
                  {e.minutesUntil !== null ? (
                    <span className={cn(
                      'tabular-nums font-mono text-xs min-w-[3.5em]',
                      isCritical && 'text-acc',
                      isHigh && 'text-acc/70',
                      !isCritical && !isHigh && 'text-acc/40',
                    )}>
                      {formatTminus(e.minutesUntil)}
                    </span>
                  ) : (
                    <span className="text-acc/20 text-xs min-w-[3.5em]">——</span>
                  )}
                  {e.time && (
                    <span className="text-acc/30 tabular-nums text-xs">{e.time}</span>
                  )}
                  <span className="text-acc/40 uppercase text-xs">{e.type[0]}</span>
                  <span className={isCritical ? 'text-acc' : 'text-acc/80'}>
                    {e.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* UPCOMING PANEL */}
        {upcomingEntries.length > 0 && (
          <div className="space-y-2">
            {upcomingEntries.map((entry, i) => {
              const daysUntil = dayjs(entry.date).diff(dayjs().startOf('day'), 'day')
              const dayLabel = daysUntil === 1 ? 'TMR' : `D-${daysUntil}`
              return (
                <div key={i} className="flex gap-12 items-baseline">
                  <span className="text-acc/30 whitespace-nowrap tabular-nums text-xs min-w-[2.5em]">
                    {dayLabel}
                  </span>
                  <span className="text-acc/50 whitespace-nowrap text-xs">
                    {dayjs(entry.date).format('ddd DD MMM').toUpperCase()}
                  </span>
                  {entry.time && (
                    <span className="text-acc/30 tabular-nums text-xs">{entry.time}</span>
                  )}
                  <span className="text-acc/30 uppercase text-xs">{entry.type[0]}</span>
                  <span className="text-acc">{entry.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {!hasAnyContent && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
