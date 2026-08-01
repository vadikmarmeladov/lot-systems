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
import { useCreateLog, useLogs, useUpdateLog } from '#client/queries'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import type { Dayjs } from '#client/utils/dayjs'
import { recordCalendarSignal } from '#client/stores/intentionEngine'
import {
  CalendarEntry,
  CalendarEntryType,
  formatElapsed,
  formatTrackedMinutes,
  isOverdue,
  parseCalendarEntries,
} from '#client/utils/calendar'

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

export function CalendarWidget() {
  const queryClient = useQueryClient()
  const { data: logs = [] } = useLogs()
  const { mutate: createLog } = useCreateLog()
  const { mutate: updateLog } = useUpdateLog()

  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState(() => dayjs())
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [isAddingEntry, setIsAddingEntry] = React.useState(false)
  const [entryText, setEntryText] = React.useState('')
  const [entryTime, setEntryTime] = React.useState('')
  const [entryType, setEntryType] = React.useState<CalendarEntryType>('note')
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editText, setEditText] = React.useState('')
  const [editTime, setEditTime] = React.useState('')

  const entries = React.useMemo(() => parseCalendarEntries(logs), [logs])

  const hasActiveTracking = entries.some(e => e.trackingStartedAt)
  const [, forceTick] = React.useReducer(x => x + 1, 0)
  React.useEffect(() => {
    if (!hasActiveTracking) return
    const interval = setInterval(forceTick, 1000)
    return () => clearInterval(interval)
  }, [hasActiveTracking])

  const now = dayjs()

  const invalidate = () => queryClient.refetchQueries(['/api/logs'])

  const upcomingEntries = React.useMemo(() => {
    const today = now.format('YYYY-MM-DD')
    return entries
      .filter(e => e.date >= today && !e.done)
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

  const today = now.format('YYYY-MM-DD')
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
    setEditingId(null)
  }

  const handleAddEntry = () => {
    if (!selectedDate || !entryText.trim()) return

    const dateLabel = dayjs(selectedDate).format('dddd, MMMM D, YYYY')
    const time = entryTime.trim() || null

    createLog({
      text: `[SCHEDULE] ${entryType}: ${entryText.trim()} (${dateLabel}${time ? ` ${time}` : ''})`,
      event: 'calendar_entry',
      metadata: {
        date: selectedDate,
        text: entryText.trim(),
        entryType,
        time,
        done: false,
        trackingStartedAt: null,
        totalTrackedMinutes: 0,
      },
    }, {
      onSuccess: () => {
        invalidate()
        try { recordCalendarSignal(entryType, selectedDate!) } catch (_) {}
      },
    })

    setEntryText('')
    setEntryTime('')
    setIsAddingEntry(false)
  }

  const startEdit = (entry: CalendarEntry) => {
    setEditingId(entry.id)
    setEditText(entry.text)
    setEditTime(entry.time || '')
  }

  const saveEdit = (entry: CalendarEntry) => {
    if (!editText.trim()) return
    updateLog({
      id: entry.id,
      metadata: { text: editText.trim(), time: editTime.trim() || null },
    }, { onSuccess: invalidate })
    setEditingId(null)
  }

  const deleteEntry = (entry: CalendarEntry) => {
    updateLog({ id: entry.id, metadata: { deleted: true } }, { onSuccess: invalidate })
    if (editingId === entry.id) setEditingId(null)
  }

  const toggleDone = (entry: CalendarEntry) => {
    updateLog({ id: entry.id, metadata: { done: !entry.done } }, { onSuccess: invalidate })
  }

  const startTracking = (entry: CalendarEntry) => {
    updateLog({ id: entry.id, metadata: { trackingStartedAt: now.toISOString() } }, { onSuccess: invalidate })
  }

  const stopTracking = (entry: CalendarEntry) => {
    if (!entry.trackingStartedAt) return
    const elapsedMinutes = Math.max(0, now.diff(dayjs(entry.trackingStartedAt), 'minute'))
    const total = entry.totalTrackedMinutes + elapsedMinutes
    updateLog({
      id: entry.id,
      metadata: { trackingStartedAt: null, totalTrackedMinutes: total },
    }, {
      onSuccess: () => {
        invalidate()
        if (elapsedMinutes > 0) {
          createLog({
            text: `[TIME] +${formatTrackedMinutes(elapsedMinutes)} tracked on ${entry.type}: ${entry.text} (total ${formatTrackedMinutes(total)})`,
            event: 'calendar_time_logged',
            metadata: { entryId: entry.id, date: entry.date, minutes: elapsedMinutes, totalMinutes: total },
          }, { onSuccess: invalidate })
        }
      },
    })
  }

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setViewMonth(dayjs())
    }
    setIsCalendarOpen(!isCalendarOpen)
  }

  const renderEntryRow = (entry: CalendarEntry, showDate: boolean) => {
    const overdue = isOverdue(entry, now)
    const isEditing = editingId === entry.id
    const canTrack = entry.type !== 'note'

    if (isEditing) {
      return (
        <div key={entry.id} className="flex gap-8 items-center mb-1">
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(entry) }}
            className="bg-transparent border border-acc/20 text-acc px-4 py-1 flex-1 outline-none focus:border-acc/40"
            autoFocus
          />
          <input
            type="time"
            value={editTime}
            onChange={e => setEditTime(e.target.value)}
            className="bg-transparent border border-acc/20 text-acc px-4 py-1 outline-none focus:border-acc/40"
          />
          <Button onClick={() => saveEdit(entry)}>Save</Button>
          <button className="text-acc/40 hover:text-acc/60 transition-opacity" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        </div>
      )
    }

    return (
      <div key={entry.id} className="flex justify-between items-center gap-16 mb-1 group">
        <span className="text-acc whitespace-nowrap">
          {showDate ? dayjs(entry.date).format('dddd, MMMM D, YYYY') : entry.type}
          {entry.time ? ` ${entry.time}` : ''}
        </span>
        <span className={cn('flex-1 text-right', entry.done ? 'text-acc/30 line-through' : overdue ? 'text-acc' : 'text-acc/80')}>
          {entry.text}
          {entry.totalTrackedMinutes > 0 && (
            <span className="text-acc/40"> · {formatTrackedMinutes(entry.totalTrackedMinutes)}</span>
          )}
          {entry.trackingStartedAt && (
            <span className="text-acc/60"> · {formatElapsed(entry.trackingStartedAt, now)}</span>
          )}
        </span>
        <span className="flex gap-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {canTrack && !entry.done && (
            entry.trackingStartedAt ? (
              <button className="text-acc/40 hover:text-acc/60" onClick={() => stopTracking(entry)}>Stop</button>
            ) : (
              <button className="text-acc/40 hover:text-acc/60" onClick={() => startTracking(entry)}>Track</button>
            )
          )}
          <button className="text-acc/40 hover:text-acc/60" onClick={() => toggleDone(entry)}>
            {entry.done ? 'Undo' : 'Done'}
          </button>
          <button className="text-acc/40 hover:text-acc/60" onClick={() => startEdit(entry)}>Edit</button>
          <button className="text-acc/40 hover:text-acc/60" onClick={() => deleteEntry(entry)}>Delete</button>
        </span>
      </div>
    )
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
                  {(['note', 'task', 'call'] as CalendarEntryType[]).map(t => (
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
                    className="bg-transparent border border-acc/20 text-acc px-4 py-2 outline-none focus:border-acc/40"
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
                {entriesOnDate.map(e => renderEntryRow(e, false))}
              </div>
            )}
          </div>
        )}

        {upcomingEntries.length > 0 && (
          <div className="space-y-1">
            {upcomingEntries.map(entry => renderEntryRow(entry, true))}
          </div>
        )}

        {upcomingEntries.length === 0 && !isCalendarOpen && (
          <div className="text-acc/40">No upcoming dates.</div>
        )}
      </div>
    </Block>
  )
}
