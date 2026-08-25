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
import { recordCalendarSignal, recordTimeTrackingSignal } from '#client/stores/intentionEngine'
import { isRouteActive } from '#client/stores/router'

type EntryType = 'note' | 'task' | 'call'

type CalendarEntry = {
  date: string
  time: string | null
  durationMinutes: number | null
  text: string
  type: EntryType
}

type EntryStatus = 'overdue' | 'imminent' | 'scheduled'

type ToastKind = 'logged' | 'failed' | 'imminent' | 'overdue'

type ToastState = {
  kind: ToastKind
  message: string
  detail: string
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const ALERT_WINDOW_MIN = 15

function entryStatus(date: string, time: string | null, now: Dayjs): EntryStatus | null {
  if (!time) return null
  const [hour, minute] = time.split(':').map(Number)
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null
  const target = dayjs(date).hour(hour).minute(minute).second(0).millisecond(0)
  const diffMin = target.diff(now, 'minute')
  if (diffMin < 0) return 'overdue'
  if (diffMin <= ALERT_WINDOW_MIN) return 'imminent'
  return 'scheduled'
}

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
  const [entryDuration, setEntryDuration] = React.useState('')
  const [toast, setToast] = React.useState<ToastState | null>(null)

  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const alertedRef = React.useRef<Set<string>>(new Set())

  React.useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
  }, [])

  const fireToast = React.useCallback((kind: ToastKind, entry: { type: EntryType; date: string; time: string | null }) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    const label = entry.type.toUpperCase()
    const when = entry.time
      ? `${dayjs(entry.date).format('MMM D').toUpperCase()} ${entry.time}`
      : dayjs(entry.date).format('MMM D').toUpperCase()
    const messages: Record<ToastKind, string> = {
      logged: `EVENT LOGGED — ${label}`,
      failed: `LOG FAILED — ${label}`,
      imminent: `INCOMING — ${label}`,
      overdue: `OVERDUE — ${label}`,
    }
    setToast({ kind, message: messages[kind], detail: when })
    const holdMs = kind === 'failed' ? 6000 : 4000
    toastTimerRef.current = setTimeout(() => setToast(null), holdMs)
  }, [])

  const entries = React.useMemo<CalendarEntry[]>(() => {
    return logs
      .filter(log => log.event === 'calendar_entry' && log.metadata)
      .map(log => ({
        date: log.metadata?.date as string,
        time: (log.metadata?.time as string) || null,
        durationMinutes: (log.metadata?.durationMinutes as number) || null,
        text: log.metadata?.text as string || log.text || '',
        type: (log.metadata?.entryType as EntryType) || 'note',
      }))
      .filter(e => e.date && e.text)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
  }, [logs])

  const upcomingEntries = React.useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    return entries
      .filter(e => e.date >= today)
      .slice(0, 10)
  }, [entries])

  React.useEffect(() => {
    const checkImminentEntries = () => {
      if (document.hidden || !isRouteActive('system')) return
      const now = dayjs()
      const todayKey = now.format('YYYY-MM-DD')
      for (const e of entries) {
        if (!e.time || e.date !== todayKey) continue
        const key = `${e.date}T${e.time}`
        if (alertedRef.current.has(key)) continue
        const status = entryStatus(e.date, e.time, now)
        if (status === 'imminent' || status === 'overdue') {
          alertedRef.current.add(key)
          fireToast(status, { type: e.type, date: e.date, time: e.time })
          break
        }
      }
    }

    checkImminentEntries()
    const interval = setInterval(checkImminentEntries, 60000)
    return () => clearInterval(interval)
  }, [entries, fireToast])

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

    const date = selectedDate
    const type = entryType
    const time = entryTime || null
    const durationMinutes = entryDuration ? Math.max(0, parseInt(entryDuration, 10)) || null : null

    const dateLabel = dayjs(date).format('dddd, MMMM D, YYYY')
    const timeSuffix = time ? ` @ ${time}` : ''
    const durationSuffix = durationMinutes ? ` (${durationMinutes}m)` : ''

    createLog({
      text: `[SCHEDULE] ${type}: ${entryText.trim()} (${dateLabel}${timeSuffix}${durationSuffix})`,
      event: 'calendar_entry',
      metadata: {
        date,
        text: entryText.trim(),
        entryType: type,
        time,
        durationMinutes,
      },
    }, {
      onSuccess: () => {
        queryClient.refetchQueries(['/api/logs'])
        try { recordCalendarSignal(type, date) } catch (_) {}
        if (durationMinutes) {
          try { recordTimeTrackingSignal(type, durationMinutes) } catch (_) {}
        }
        fireToast('logged', { type, date, time })
      },
      onError: () => {
        fireToast('failed', { type, date, time })
      },
    })

    setEntryText('')
    setEntryTime('')
    setEntryDuration('')
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
                  <input
                    type="time"
                    value={entryTime}
                    onChange={e => setEntryTime(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40 w-[7em]"
                  />
                  {entryType !== 'note' && (
                    <input
                      type="number"
                      min={0}
                      value={entryDuration}
                      onChange={e => setEntryDuration(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddEntry() }}
                      placeholder="min"
                      className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40 w-[4.5em]"
                    />
                  )}
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
                  <div key={i} className="text-acc/80 mb-1">
                    {e.time && <span className="text-acc/50">{e.time} — </span>}
                    {e.text}
                    {e.durationMinutes ? <span className="text-acc/40"> ({e.durationMinutes}m)</span> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map((entry, i) => {
              const status = entryStatus(entry.date, entry.time, dayjs())
              return (
                <div key={i} className="flex justify-between gap-16">
                  <span className="text-acc whitespace-nowrap">
                    {dayjs(entry.date).format('dddd, MMMM D, YYYY')}
                    {entry.time && <span className="text-acc/50"> · {entry.time}</span>}
                  </span>
                  <span className="text-acc text-right">
                    {status === 'overdue' && (
                      <span className="text-red mr-4 font-mono text-[10px] tracking-widest">[OVERDUE]</span>
                    )}
                    {status === 'imminent' && (
                      <span className="text-gold mr-4 font-mono text-[10px] tracking-widest">[T-MINUS]</span>
                    )}
                    {entry.text}
                    {entry.durationMinutes ? <span className="text-acc/40"> ({entry.durationMinutes}m)</span> : null}
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

      {toast && (
        <div
          className={cn(
            'fixed bottom-16 left-1/2 -translate-x-1/2 z-50',
            'px-16 py-8 border font-mono uppercase tracking-widest text-[11px]',
            'bg-[var(--base-color)] grid-fill-light whitespace-nowrap',
            toast.kind === 'failed' || toast.kind === 'overdue'
              ? 'border-red text-red'
              : toast.kind === 'imminent'
              ? 'border-gold text-gold'
              : 'border-[rgb(var(--acc-color-default)/0.4)] text-acc',
          )}
          style={{
            animation: `calToastIn 0.3s ease-out, calToastOut 0.3s ease-in ${toast.kind === 'failed' ? '5.7s' : '3.7s'} forwards`,
          }}
        >
          ▸ {toast.message} · {toast.detail}
        </div>
      )}
    </Block>
  )
}

const calendarToastStyle = document.createElement('style')
calendarToastStyle.textContent = `
  @keyframes calToastIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes calToastOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`

if (typeof document !== 'undefined') {
  document.head.appendChild(calendarToastStyle)
}
