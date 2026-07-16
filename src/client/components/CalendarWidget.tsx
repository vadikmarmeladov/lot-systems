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
type AlertLevel = 'EXECUTE' | 'ALERT' | 'BRAVO' | 'ALPHA' | 'NOTICE' | 'CLEARED'
type TimedStatus = 'EXECUTE' | 'ALERT' | 'STANDBY'

type CalendarEntry = {
  id: string
  date: string
  time?: string
  text: string
  type: EntryType
}

type ActiveAlert = {
  entry: CalendarEntry
  level: AlertLevel
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const CLEARED_KEY = 'lot_calendar_cleared_v1'

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

function getEventDayjs(entry: CalendarEntry): Dayjs {
  return entry.time
    ? dayjs(`${entry.date} ${entry.time}`, 'YYYY-MM-DD HH:mm')
    : dayjs(entry.date).endOf('day')
}

// Fine-grained countdown status for entries carrying a clock time — the
// "live tracking" layer sitting on top of the coarser day-level grouping.
function timedStatus(entry: CalendarEntry, now: Dayjs): TimedStatus | null {
  if (!entry.time) return null
  const diffMin = getEventDayjs(entry).diff(now, 'minute')
  if (diffMin < -120) return null
  if (diffMin <= 15) return 'EXECUTE'
  if (diffMin <= 60) return 'ALERT'
  if (diffMin <= 1440) return 'STANDBY'
  return null
}

function formatCountdown(entry: CalendarEntry, now: Dayjs): string {
  const diffSec = getEventDayjs(entry).diff(now, 'second')
  const sign = diffSec < 0 ? '+' : '-'
  const abs = Math.abs(diffSec)
  const h = Math.floor(abs / 3600)
  const m = Math.floor((abs % 3600) / 60)
  const s = abs % 60
  return `T${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function levelClass(level: AlertLevel | TimedStatus | null): string {
  if (level === 'EXECUTE') return 'text-acc'
  if (level === 'ALERT' || level === 'ALPHA') return 'text-acc/70'
  if (level === 'BRAVO') return 'text-acc/60'
  if (level === 'STANDBY' || level === 'NOTICE') return 'text-acc/50'
  if (level === 'CLEARED') return 'text-acc/25'
  return 'text-acc/40'
}

// Bracket-tagged, uppercase, T-minus notation — the "military-grade" register
// this codebase already uses for [SCHEDULE] entries, extended to alerts.
function buildAlertText(level: AlertLevel, entry: CalendarEntry, now: Dayjs): string {
  const type = entry.type.toUpperCase()
  const dateLabel = dayjs(entry.date).format('DD MMM YYYY').toUpperCase()
  const timeLabel = entry.time ? ` ${entry.time}` : ''

  switch (level) {
    case 'EXECUTE':
    case 'ALERT': {
      const min = Math.max(0, getEventDayjs(entry).diff(now, 'minute'))
      return `[${level}] ${type}: ${entry.text} — ${dateLabel}${timeLabel} — T-MINUS ${min}MIN`
    }
    case 'BRAVO': {
      const over = now.diff(dayjs(entry.date), 'day')
      return `[BRAVO] OVERDUE +${over}D — ${type}: ${entry.text} — ${dateLabel}`
    }
    case 'ALPHA':
      return `[ALPHA] ${type}: ${entry.text} — ${dateLabel}${timeLabel}`
    case 'CLEARED':
      return `[CLEARED] ${type}: ${entry.text} — ${dateLabel} — COMPLETE`
    default: {
      const until = dayjs(entry.date).diff(now, 'day')
      return `[NOTICE] T-MINUS ${until}D — ${type}: ${entry.text} — ${dateLabel}`
    }
  }
}

// One fire per entry+level+day — durable across intervals, resets each session
// so a standing reminder still surfaces again tomorrow.
function alertStorageKey(entryId: string, level: AlertLevel): string {
  return `lot_cal_${dayjs().format('YYYY-MM-DD')}_${entryId}_${level}`
}

function wasAlerted(key: string): boolean {
  try { return !!sessionStorage.getItem(key) } catch { return false }
}

function markAlerted(key: string): void {
  try { sessionStorage.setItem(key, '1') } catch {}
}

function loadClearedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(CLEARED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveClearedIds(ids: Set<string>): void {
  try { localStorage.setItem(CLEARED_KEY, JSON.stringify(Array.from(ids))) } catch {}
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
  const [entryTime, setEntryTime] = React.useState('')
  const [entryType, setEntryType] = React.useState<EntryType>('note')
  const [activeAlert, setActiveAlert] = React.useState<ActiveAlert | null>(null)
  const [clearedIds, setClearedIds] = React.useState<Set<string>>(loadClearedIds)

  // Live clock — the reliability layer: the widget always knows exactly
  // how much time stands between "now" and the next scheduled entry.
  React.useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-dismiss the alert overlay; the event itself stays logged in Log.
  React.useEffect(() => {
    if (!activeAlert) return
    const timer = setTimeout(() => setActiveAlert(null), 30000)
    return () => clearTimeout(timer)
  }, [activeAlert])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        id: log.id,
        date: log.metadata?.date as string,
        time: log.metadata?.time as string | undefined,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => {
        const aKey = `${a.date}${a.time ?? '23:59'}`
        const bKey = `${b.date}${b.time ?? '23:59'}`
        return aKey.localeCompare(bKey)
      })
  }, [logs])

  const activeEntries = React.useMemo(
    () => entries.filter(e => !clearedIds.has(e.id)),
    [entries, clearedIds]
  )

  const todayStr = now.format('YYYY-MM-DD')
  const tomorrowStr = now.add(1, 'day').format('YYYY-MM-DD')

  // Military alert engine — evaluates every active entry against the clock
  // and, on each new threshold crossed, both logs a [LEVEL] event into Log
  // (the durable record) and raises the overlay (the in-the-moment ping).
  React.useEffect(() => {
    if (activeEntries.length === 0) return

    function fireAlerts() {
      const n = dayjs()
      const today = n.format('YYYY-MM-DD')
      const tomorrow = n.add(1, 'day').format('YYYY-MM-DD')

      for (const entry of activeEntries) {
        let level: AlertLevel | null = null

        if (entry.time && entry.date === today) {
          const status = timedStatus(entry, n)
          if (status === 'EXECUTE' || status === 'ALERT') level = status
        } else if (entry.date < today) {
          level = 'BRAVO'
        } else if (entry.date === today) {
          level = 'ALPHA'
        } else if (entry.date === tomorrow) {
          level = 'NOTICE'
        }

        if (!level) continue
        const key = alertStorageKey(entry.id, level)
        if (wasAlerted(key)) continue
        markAlerted(key)

        createLog({
          text: buildAlertText(level, entry, n),
          event: 'calendar_alert',
          metadata: { level, date: entry.date, time: entry.time, entryType: entry.type, text: entry.text, entryId: entry.id },
        })
        setActiveAlert({ entry, level })
        break
      }
    }

    fireAlerts()
    const hasTimed = activeEntries.some(e => e.time)
    const timer = setInterval(fireAlerts, hasTimed ? 15000 : 60000)
    return () => clearInterval(timer)
  }, [activeEntries, createLog])

  const overdueEntries = React.useMemo(
    () => activeEntries.filter(e => e.date < todayStr),
    [activeEntries, todayStr]
  )
  const todayEntries = React.useMemo(
    () => activeEntries.filter(e => e.date === todayStr),
    [activeEntries, todayStr]
  )
  const standbyEntries = React.useMemo(
    () => activeEntries.filter(e => e.date > todayStr && dayjs(e.date).diff(now, 'day') <= 3),
    [activeEntries, todayStr, now]
  )
  const upcomingEntries = React.useMemo(
    () => activeEntries.filter(e => e.date > todayStr).slice(0, 10),
    [activeEntries, todayStr]
  )

  const hasCommandBoard = overdueEntries.length > 0 || todayEntries.length > 0 || standbyEntries.length > 0

  const nextTimedEvent = activeEntries.find(
    e => e.time && getEventDayjs(e).isAfter(now)
  ) ?? null

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
    setIsAddingEntry(false)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const timeLabel = entryTime ? ` at ${entryTime}` : ''

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${timeLabel})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        ...(entryTime ? { time: entryTime } : {}),
        text: entryText.trim(),
        entryType,
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

  const handleClearEntry = (entry: CalendarEntry) => {
    setClearedIds(prev => {
      const next = new Set(prev)
      next.add(entry.id)
      saveClearedIds(next)
      return next
    })
    createLog({
      text: buildAlertText('CLEARED', entry, dayjs()),
      event: 'calendar_alert',
      metadata: { level: 'CLEARED', date: entry.date, time: entry.time, entryType: entry.type, text: entry.text, entryId: entry.id },
    })
    if (activeAlert?.entry.id === entry.id) setActiveAlert(null)
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) setViewMonth(dayjs())
    setIsCalendarOpen(open => !open)
  }

  return (
    <>
      <Block label="Calendar:" blockView onLabelClick={handleToggleCalendar}>
        <div className="w-full">

          {/* Live clock + next timed event countdown */}
          <div className="flex justify-between items-baseline mb-16 font-mono text-sm">
            <span className="text-acc/50 tabular-nums tracking-widest">
              {now.format('HH:mm:ss')}
            </span>
            {nextTimedEvent && (
              <span className={cn('tabular-nums text-xs', levelClass(timedStatus(nextTimedEvent, now)))}>
                {formatCountdown(nextTimedEvent, now)}
              </span>
            )}
          </div>

          {/* Command board — overdue / today / standby, at a glance */}
          {hasCommandBoard && (
            <div className="mb-16 space-y-8">
              {overdueEntries.length > 0 && (
                <div>
                  <div className="text-acc/30 text-xs tracking-widest mb-4">
                    {'// OVERDUE [' + overdueEntries.length + ']'}
                  </div>
                  <div className="space-y-2">
                    {overdueEntries.map(entry => (
                      <div key={entry.id} className="flex items-start justify-between gap-8">
                        <span className={cn('text-sm', levelClass('BRAVO'))}>
                          <span className="text-acc/30 mr-4 text-xs uppercase tracking-widest">BRAVO</span>
                          {entry.type.toUpperCase()}: {entry.text}
                          <span className="text-acc/30 ml-4 text-xs">
                            +{now.diff(dayjs(entry.date), 'day')}D
                          </span>
                        </span>
                        <button
                          onClick={() => handleClearEntry(entry)}
                          className="text-acc/20 hover:text-acc/60 transition-opacity shrink-0 leading-none"
                          title="Clear"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {todayEntries.length > 0 && (
                <div>
                  <div className="text-acc/30 text-xs tracking-widest mb-4">{'// TODAY'}</div>
                  <div className="space-y-2">
                    {todayEntries.map(entry => {
                      const status = timedStatus(entry, now)
                      return (
                        <div key={entry.id} className="flex items-start justify-between gap-8">
                          <span className={cn('text-sm', levelClass(status ?? 'ALPHA'))}>
                            {entry.time
                              ? <span className="text-acc/40 mr-4 tabular-nums">{entry.time}</span>
                              : <span className="text-acc/40 mr-4 text-xs uppercase tracking-widest">ALPHA</span>
                            }
                            {entry.type.toUpperCase()}: {entry.text}
                          </span>
                          <div className="flex items-baseline gap-8 shrink-0">
                            {(status === 'EXECUTE' || status === 'ALERT') && (
                              <span className={cn(
                                'text-xs tabular-nums',
                                levelClass(status),
                                status === 'EXECUTE' && 'blink'
                              )}>
                                {formatCountdown(entry, now)}
                              </span>
                            )}
                            <button
                              onClick={() => handleClearEntry(entry)}
                              className="text-acc/20 hover:text-acc/60 transition-opacity leading-none"
                              title="Clear"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {standbyEntries.length > 0 && (
                <div>
                  <div className="text-acc/30 text-xs tracking-widest mb-4">{'// STANDBY'}</div>
                  <div className="space-y-2">
                    {standbyEntries.map(entry => (
                      <div key={entry.id} className="flex items-start justify-between gap-8">
                        <span className={cn('text-sm', levelClass('STANDBY'))}>
                          <span className="text-acc/30 mr-4 text-xs">
                            T-{dayjs(entry.date).diff(now, 'day')}D
                          </span>
                          {entry.type.toUpperCase()}: {entry.text}
                        </span>
                        <button
                          onClick={() => handleClearEntry(entry)}
                          className="text-acc/20 hover:text-acc/60 transition-opacity shrink-0 leading-none"
                          title="Clear"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-16">
            <Button onClick={handleToggleCalendar}>
              {isCalendarOpen ? 'Close calendar' : 'Add date'}
            </Button>
          </div>

          {isCalendarOpen && (
            <div className="mb-16">
              <div className="flex items-center gap-8 mb-8">
                <button
                  className="text-acc/40 hover:text-acc transition-opacity"
                  onClick={() => setViewMonth(v => v.subtract(1, 'month'))}
                >
                  {'<—'}
                </button>
                <span className="text-acc">
                  {viewMonth.format('MMMM, YYYY')}
                </span>
                <button
                  className="text-acc/40 hover:text-acc transition-opacity"
                  onClick={() => setViewMonth(v => v.add(1, 'month'))}
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
                  <div className="flex gap-8 items-center mb-4">
                    <input
                      type="time"
                      value={entryTime}
                      onChange={e => setEntryTime(e.target.value)}
                      className="bg-transparent border border-acc/20 text-acc/60 text-sm px-4 py-1 outline-none focus:border-acc/40 tabular-nums"
                    />
                    <span className="text-acc/20 text-xs">time optional</span>
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
                  {entriesOnDate.map((e) => (
                    <div key={e.id} className={cn('mb-1', clearedIds.has(e.id) ? 'text-acc/25 line-through' : 'text-acc/80')}>
                      {e.time && <span className="text-acc/40 mr-4 tabular-nums">{e.time}</span>}
                      {e.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {upcomingEntries.length > 0 && (
            <div>
              <div className="text-acc/30 text-xs tracking-widest mb-4">{'// UPCOMING'}</div>
              <div className="space-y-1">
                {upcomingEntries.map((entry) => (
                  <div key={entry.id} className="flex justify-between gap-16">
                    <span className="text-acc whitespace-nowrap">
                      {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                      {entry.time && ` ${entry.time}`}
                    </span>
                    <span className="text-acc text-right">
                      {entry.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upcomingEntries.length === 0 && !hasCommandBoard && !isCalendarOpen && (
            <div className="text-acc/40">No upcoming dates.</div>
          )}
        </div>
      </Block>

      {/* Military-grade event alert overlay — logged into Log, mirrored here */}
      {activeAlert && (
        <div className="fixed bottom-32 right-16 z-50">
          <div className="border border-acc/40 bg-bac grid-fill p-16 max-w-64">
            <div className="flex justify-between items-baseline mb-8">
              <span className={cn(
                'text-xs uppercase tracking-widest font-bold',
                levelClass(activeAlert.level),
                activeAlert.level === 'EXECUTE' && 'blink'
              )}>
                CAL [{activeAlert.level}]
              </span>
              <button
                className="text-acc/30 hover:text-acc/70 text-xs ml-16 uppercase tracking-widest transition-opacity"
                onClick={() => setActiveAlert(null)}
              >
                ACK
              </button>
            </div>
            <div className="text-acc text-sm uppercase tracking-widest mb-4 leading-tight">
              {activeAlert.entry.type}: {activeAlert.entry.text}
            </div>
            <div className="text-acc/40 text-xs uppercase tracking-widest">
              {dayjs(activeAlert.entry.date).format('ddd D MMM').toUpperCase()}
              {activeAlert.entry.time && ` · ${activeAlert.entry.time}`}
            </div>
            {activeAlert.entry.time && (
              <div className={cn('tabular-nums font-mono mt-4 text-sm', levelClass(activeAlert.level))}>
                {formatCountdown(activeAlert.entry, now)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
