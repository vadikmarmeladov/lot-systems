import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Block, Button, ResizibleGhostInput, Unknown } from '#client/components/ui'
import { useLogs, useUpdateLog } from '#client/queries'
import { useDebounce, useMouseInactivity } from '#client/utils/hooks'
import dayjs from '#client/utils/dayjs'
import * as fp from '#shared/utils/fp'
import { Log, LogSettingsChangeMetadata } from '#shared/types'
import { cn } from '#client/utils'
import { atom, map } from 'nanostores'
import {
  COUNTRY_BY_ALPHA3,
  USER_SETTING_NAMES,
  USER_SETTING_NAME_BY_ID,
} from '#shared/constants'
import { toCelsius } from '#shared/utils'
import {
  playKeyClick,
  playSynthActivationChime,
  playSynthDeactivationChime,
} from '#client/utils/sovietKeyboard'
import { detectNewTriggers, type LogTrigger } from '#client/utils/logTriggers'

const localStore = {
  logById: map<Record<string, Log>>({}),
  logIds: atom<string[]>([]),
}

export const Logs: React.FC = () => {
  const inputContainerRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const isTouchDevice = useStore(stores.isTouchDevice)
  const logById = useStore(localStore.logById)
  const logIds = useStore(localStore.logIds)

  const [isMouseActive, setIsMouseActive] = React.useState(true)
  const pendingPushRef = React.useRef<NodeJS.Timeout | null>(null)

  const { data: loadedLogs = [], refetch: refetchLogs } = useLogs()

  const { mutate: updateLog } = useUpdateLog({
    onSuccess: (log: any) => {
      // Skip if server deleted the log (user backspaced all content)
      if (log.deleted) {
        // Remove from store — read fresh store to avoid stale closure
        const current = localStore.logById.get()
        const { [log.id]: _, ...rest } = current
        localStore.logById.set(rest as Record<string, Log>)
        localStore.logIds.set(localStore.logIds.get().filter((id: string) => id !== log.id))
        return
      }
      // Read fresh store value to avoid stale closure overwriting recent data
      const current = localStore.logById.get()
      localStore.logById.set({
        ...current,
        [log.id]: log as Log,
      })
      // Only refetch (push down) if this is the primary/most recent log
      // Past logs don't need to trigger push-down
      if (log.id === recentLogId) {
        // Refetch logs to push down saved entry and create new empty log
        // Wait 7 seconds: 3s pause (read saved entry) + 4s gentle blink = 7s total
        // Push happens when blink completes at opacity 0.2 (matching saved logs)
        pendingPushRef.current = setTimeout(async () => {
          try {
            await refetchLogs()
            pendingPushRef.current = null
          } catch (error) {
            console.error('[Logs] Refetch failed:', error)
            pendingPushRef.current = null
          }
        }, 7000)
      }
    },
  })

  React.useEffect(() => {
    if (!loadedLogs.length) return

    // Update both stores atomically to prevent race condition
    const newLogById = loadedLogs.reduce(fp.by('id'), {})
    const newLogIds = loadedLogs.map(fp.prop('id'))

    // Update in a single batch to avoid intermediate renders
    localStore.logById.set(newLogById)
    localStore.logIds.set(newLogIds)
  }, [loadedLogs])

  // Cleanup pending push timeout on unmount
  React.useEffect(() => {
    return () => {
      if (pendingPushRef.current) {
        clearTimeout(pendingPushRef.current)
        pendingPushRef.current = null
      }
    }
  }, [])

  const onChangeLog = React.useCallback(
    (id: string) => (text: string) => {
      updateLog({ id, text })
    },
    [updateLog]
  )

  const [recentLogId, pastLogIds] = React.useMemo(() => {
    return [logIds[0], logIds.slice(1)]
  }, [logIds])

  const dateFormat = React.useMemo(() => {
    return isTimeFormat12h ? 'h:mm:ss A (M/D/YY)' : 'HH:mm:ss[Z] DD/MM/YY'
  }, [isTimeFormat12h])

  // Memoize onChange for primary log to prevent excessive re-renders
  const onChangePrimaryLog = React.useMemo(
    () => onChangeLog(recentLogId),
    [onChangeLog, recentLogId]
  )

  React.useEffect(() => {
    setTimeout(() => {
      const textarea = inputContainerRef?.current?.querySelector('textarea')
      if (!textarea) return
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = 9e6
    }, 300)
  }, [])

  const onMouseActivityChange = React.useCallback(
    (isMoving: boolean) => {
      if (isTouchDevice) return
      const nav = document.querySelector('#nav')
      if (!nav) return
      if (isMoving) {
        setIsMouseActive(true)
        nav.classList.remove('opacity-0', 'pointer-events-none')
      } else {
        setIsMouseActive(false)
        nav.classList.add('opacity-0', 'pointer-events-none')
      }
    },
    [isTouchDevice]
  )

  useMouseInactivity(2000, onMouseActivityChange)

  React.useEffect(() => {
    if (isTouchDevice) return
    let container = containerRef.current
    setTimeout(() => {
      container = containerRef.current // 🩼
    }, 600)
    const page = document.querySelector('#page')
    const onClick = (ev: Event) => {
      const target = ev.target as HTMLDivElement
      if (target === container || container?.contains(target)) return
      ev.preventDefault()
      stores.goTo('system')
    }
    page?.addEventListener('click', onClick)
    return () => {
      page?.removeEventListener('click', onClick)
    }
  }, [containerRef, isTouchDevice])

  if (!logIds.length) return <>Loading...</>

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-y-[1.5rem] leading-[1.5rem] px-4 sm:px-0"
    >
      <div ref={inputContainerRef} className="min-h-[200px]">
        {logById[recentLogId] ? (
          <NoteEditor
            key={recentLogId}
            log={logById[recentLogId]}
            primary
            onChange={onChangePrimaryLog}
            isMouseActive={isMouseActive}
            dateFormat={dateFormat}
            pendingPushRef={pendingPushRef}
          />
        ) : null}
      </div>

      {pastLogIds.map((id) => {
        const log = logById[id]
        if (!log) return null  // Skip if log doesn't exist yet
        if (log.event === 'answer') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="MEM:" blockView>
                {log.metadata.question as string}
              </Block>
              <Block label="OUT:" blockView>
                {log.metadata.answer as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'chat_message') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="COMM:" blockView>
                {log.metadata.message as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'chat_message_like') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="COMM:" blockView>
                ACK{'\n'}{log.metadata.message as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'emotional_checkin') {
          const emotionalState = log.metadata?.emotionalState as string
          const checkInType = log.metadata?.checkInType as string
          const note = log.metadata?.note as string
          const insights = log.metadata?.insights as string[] | undefined

          const sector =
            checkInType === 'morning' ? '0600' :
            checkInType === 'evening' ? '1800' :
            'SPOT'

          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label={`BIO [${sector}]:`} blockView>
                <div className="mb-8 uppercase tracking-widest">{emotionalState}</div>
                {note && <div className="mb-8">{note}</div>}
                {insights && insights.length > 0 && (
                  <div>
                    {insights.map((insight, idx) => (
                      <div key={idx}>· {insight}</div>
                    ))}
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'self_care_complete' || log.event === 'self_care_completed') {
          const action = log.metadata?.action as string | undefined
          const practice = log.metadata?.practice as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CARE:" blockView>
                <div className="uppercase tracking-widest">{action || practice || '— protocol executed'}</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'plan_set') {
          const intent = log.metadata?.intent as string | undefined
          const today = log.metadata?.today as string | undefined
          const how = log.metadata?.how as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="PLAN:" blockView>
                {intent && <div>&gt; {intent}</div>}
                {today && <div className="opacity-60">{today}</div>}
                {how && <div className="opacity-40">{how}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'intention') {
          const intention = log.metadata?.intention as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="INTENT:" blockView>
                <div className="uppercase tracking-widest">{intention || log.text || '—'}</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'settings_change') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CFG:" blockView>
                {USER_SETTING_NAMES.map((x) => {
                  const change = (log.metadata as LogSettingsChangeMetadata)
                    .changes[x]
                  if (!change) return null
                  let from: string | null = change[0]
                  let to: string | null = change[1]
                  if (x === 'country') {
                    from = from ? COUNTRY_BY_ALPHA3[from]?.name : null
                    to = to ? COUNTRY_BY_ALPHA3[to]?.name : null
                  } else if (x === 'hideActivityLogs') {
                    from = from ? 'Off' : 'On'
                    to = to ? 'Off' : 'On'
                  }
                  return (
                    <div key={x}>
                      {USER_SETTING_NAME_BY_ID[x]}:{' '}
                      {from || <Unknown>—</Unknown>} →{' '}
                      {to || <Unknown>—</Unknown>}
                    </div>
                  )
                })}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'system_snapshot') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="SYS:" blockView>
                {log.context?.city && (
                  <div>
                    POS: {log.context.city}
                    {log.context.country && `, ${log.context.country}`}
                  </div>
                )}
                {log.context?.temperature && (
                  <div>TMP: {Math.round(toCelsius(log.context.temperature))}°C</div>
                )}
                {log.context?.humidity && (
                  <div>HUM: {log.context.humidity}%</div>
                )}
                {log.metadata?.sound && (
                  <div>SND: {log.metadata.sound}</div>
                )}
                {log.metadata?.theme?.theme && (
                  <div>THM: {log.metadata.theme.theme}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'badge_unlock') {
          const badge = log.metadata?.badge as string | undefined
          const level = log.metadata?.level as string | undefined
          const milestone = log.metadata?.milestone as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="BADGE:" blockView>
                <div className="uppercase tracking-widest">{badge || level || milestone || '— unlocked'}</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'weekly_summary') {
          const period = log.metadata?.period as string | undefined
          const insights = log.metadata?.insights as string[] | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="SUM:" blockView>
                {period && <div className="opacity-60 mb-4 uppercase tracking-widest">{period}</div>}
                {insights && insights.slice(0, 2).map((insight, idx) => (
                  <div key={idx}>· {insight}</div>
                ))}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'scheduled_job') {
          const jobName = log.metadata?.jobName as string | undefined
          const sent = log.metadata?.sent as number | undefined
          const processed = log.metadata?.processed as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="JOB:" blockView>
                <div className="uppercase tracking-widest mb-4">{jobName ? jobName.replace(/-/g, ' ') : '—'}</div>
                {sent !== undefined && <div className="opacity-60">SND {sent}</div>}
                {processed !== undefined && <div className="opacity-60">PROC {processed}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'goal_set' || log.event === 'goal_update') {
          const goal = log.metadata?.goal as string | undefined
          const action = log.metadata?.action as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="GOAL:" blockView>
                <div className="uppercase tracking-widest">{goal || action || log.text || '—'}</div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'quantum_intent_signal') {
          const pattern = log.metadata?.pattern as string | undefined
          const source = log.metadata?.source as string | undefined
          const confidence = log.metadata?.confidence as number | undefined
          if (!pattern && !log.text) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="QIE:" blockView>
                {pattern && (
                  <div className="uppercase tracking-widest mb-4">
                    {pattern.replace(/-/g, ' ')}
                  </div>
                )}
                {source && <div className="opacity-60">SRC: {source}</div>}
                {confidence !== undefined && (
                  <div className="opacity-40">
                    CONF: {Math.round(confidence * 100)}%
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event !== 'note') {
          if (!log.text) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="LOG:" blockView>
                {log.text}
              </Block>
            </LogContainer>
          )
        }
        return (
          <NoteEditor
            key={id}
            log={log}
            onChange={onChangeLog(id)}
            isMouseActive={isMouseActive}
            dateFormat={dateFormat}
          />
        )
      })}
    </div>
  )
}

const NoteEditor = ({
  log,
  primary,
  onChange,
  isMouseActive,
  dateFormat,
  pendingPushRef,
}: {
  log: Log
  primary?: boolean
  onChange: (text: string) => void
  isMouseActive: boolean
  dateFormat: string
  pendingPushRef?: React.MutableRefObject<NodeJS.Timeout | null>
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const valueRef = React.useRef(log.text || '')
  const logTextRef = React.useRef(log.text || '')
  const onChangeRef = React.useRef(onChange)

  const [isFocused, setIsFocused] = React.useState(false)
  const [value, setValue] = React.useState(log.text || '')
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null)
  const [isSaved, setIsSaved] = React.useState(true) // Track if current content is saved
  const debounceTime = 7000  // 7s for all logs
  const debouncedValue = useDebounce(value, debounceTime)

  // Keep refs in sync
  React.useEffect(() => {
    valueRef.current = value
    // Mark as unsaved when user types
    if (value !== log.text) {
      setIsSaved(false)
      // Don't cancel pending push - let the save complete and push down
      // The sync effect has protection to not overwrite unsaved changes
    }
  }, [value, log.text, primary])

  React.useEffect(() => {
    logTextRef.current = log.text
  }, [log.text])

  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Note: No blur save handler - saves happen via unmount and debounced autosave
  // This keeps scrolling behavior simple (no blur = no issues)

  // Autosave for all logs (7s debounce)
  // Timeline: finish typing > wait 7s > save > opacity fades to 20% > push
  React.useEffect(() => {
    if (log.text === debouncedValue) return

    // Save the log
    onChange(debouncedValue)

    // Update timestamp
    setLastSavedAt(new Date())

    // IMPORTANT: Only mark as saved if current value matches what we're saving
    // This prevents race condition where user types more while save is in progress
    if (valueRef.current === debouncedValue) {
      setIsSaved(true)
    }
  }, [debouncedValue, onChange, log.text, primary])

  // Sync local state when log updates from server
  // BUT: Don't overwrite if user is actively typing (focused)
  // ALSO: Don't clear non-empty user input to empty server value (prevents race condition)
  // ALSO: Don't sync if there are unsaved changes
  // NOTE: isFocused and value are NOT in deps - only sync when log.text changes from server
  React.useEffect(() => {
    if (isFocused) return  // Skip sync while user is typing
    if (!isSaved) return  // Skip sync if there are unsaved changes
    // Defensive: Don't clear user's typed text if server hasn't saved yet
    // This prevents race condition on mobile where blur saves but mutation hasn't completed
    if (value && !log.text) return
    // Additional safety: Don't overwrite if current value is different from server value
    // This prevents race condition where user typed more while autosave was in progress
    if (valueRef.current !== log.text && valueRef.current.length > log.text.length) return
    setValue(log.text || '')
  }, [log.text, isFocused, isSaved])  // eslint-disable-line react-hooks/exhaustive-deps

  // Track focus state for sync effect (prevent overwriting while typing)
  React.useEffect(() => {
    const textarea = containerRef.current?.querySelector('textarea')
    if (!textarea) return

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    textarea.addEventListener('focus', handleFocus)
    textarea.addEventListener('blur', handleBlur)

    return () => {
      textarea.removeEventListener('focus', handleFocus)
      textarea.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Save when user switches tabs (Page Visibility API)
  // Using refs to avoid re-subscribing on every log.text/onChange change
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && valueRef.current !== logTextRef.current) {
        onChangeRef.current(valueRef.current)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])  // Empty deps - only subscribe once, use refs for latest values

  // Save on unmount (when navigating to different tab within app)
  React.useEffect(() => {
    return () => {
      // Save on unmount if there are unsaved changes
      if (valueRef.current !== logTextRef.current) {
        onChangeRef.current(valueRef.current)
      }
    }
  }, [])

  // Handle Enter key - allow newlines, Cmd/Ctrl+Enter to save
  // Also plays the Soviet synth keyboard click on every keystroke
  // when enabled via Settings or the 🎹 / /synth triggers.
  // Using refs to avoid recreating callback
  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Fire the keyboard click for printable keys, space, Enter, Backspace.
      // We skip modifier-only presses and navigation keys so the sound
      // never feels like a machine gun (Arrow keys during scrolling).
      if (stores.isKeyboardSoundOn.get()) {
        const k = ev.key
        const isPrintable =
          k.length === 1 || k === 'Enter' || k === 'Backspace' || k === 'Tab' || k === ' '
        if (isPrintable && !ev.metaKey && !ev.ctrlKey) {
          try { playKeyClick(k) } catch {}
        }
      }

      if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault()
        if (valueRef.current !== logTextRef.current) {
          onChangeRef.current(valueRef.current) // Immediate save
          setLastSavedAt(new Date())
          setIsSaved(true)
        }
        // Optionally blur to show save happened
        ;(ev.target as HTMLTextAreaElement).blur()
      }
      // Regular Enter key creates newline (default behavior)
    },
    [primary]
  )

  // --------------------------------------------------------------------
  // Inline trigger detection: 🎹 emoji or /synth keyword toggles the
  // Soviet keyboard sound; other triggers (listed in logTriggers.ts)
  // are detected here so future modes can hook in without touching
  // the editor. We compare against the previous value via ref so
  // editing around an existing trigger doesn't re-fire it.
  // --------------------------------------------------------------------
  const lastTriggerScanRef = React.useRef('')
  React.useEffect(() => {
    const fresh = detectNewTriggers(value, lastTriggerScanRef.current)
    lastTriggerScanRef.current = value
    if (fresh.length === 0) return

    for (const trigger of fresh as LogTrigger[]) {
      if (trigger === 'toggle-synth') {
        const next = !stores.isKeyboardSoundOn.get()
        stores.isKeyboardSoundOn.set(next)
        try {
          if (next) playSynthActivationChime()
          else playSynthDeactivationChime()
        } catch {}
      }
      // Other triggers are detected but intentionally a no-op here —
      // the brainstorm list above will wire them in as dedicated PRs.
    }
  }, [value])

  const contextText = React.useMemo(() => {
    if (!log?.context) return ''
    const weatherParts: string[] = []
    if (log.context?.temperature) {
      const celsius = toCelsius(log.context.temperature)
      weatherParts.push(`${Math.round(celsius)}°C`)
    }
    if (log.context?.humidity) {
      weatherParts.push(`${Math.round(log.context.humidity)}%`)
    }
    const weatherText = weatherParts.join(', ')
    if (log.context?.city) {
      return `${weatherText} – ${log.context.city}`
    }
    return weatherText
  }, [log?.context])

  return (
    <div className="relative group">
      <div
        className={cn(
          'relative mb-4 sm:mb-0',
          'sm:absolute sm:top-0 sm:right-0 text-end select-none',
          'transition-opacity',
          primary
            ? cn(
                'hidden sm:block ___opacity-30 sm:opacity-100',
                !isMouseActive && 'sm:opacity-0'
              )
            : cn(
                'opacity-30',
                isFocused && 'sm:opacity-100',
                'sm:group-hover:opacity-100'
              )
        )}
      >
        {!primary && contextText ? (
          <div className="relative">
            <div
              className={cn(
                'transition-opacity duration-500',
                'sm:group-hover:opacity-0'
              )}
            >
              {!!log && dayjs(log.updatedAt).format(dateFormat)}
            </div>
            <div
              className={cn(
                'hidden sm:block',
                'absolute top-0 right-0 text-acc/60 transition-opacity duration-500',
                'opacity-0 group-hover:opacity-100 whitespace-nowrap'
              )}
            >
              {contextText}
            </div>
          </div>
        ) : (
          <div>
            {primary
              ? lastSavedAt
                ? dayjs(lastSavedAt).format(dateFormat)
                : 'Just now'
              : !!log && dayjs(log.updatedAt).format(dateFormat)}
          </div>
        )}
      </div>

      <div className="max-w-[700px]" ref={containerRef}>
        <ResizibleGhostInput
          direction="v"
          value={value}
          onChange={setValue}
          onKeyDown={onKeyDown}
          placeholder={
            !primary ? '[ record cleared on empty ]' : '[ FIELD ENTRY ]'
          }
          className={cn(
            'max-w-[700px] focus:opacity-100 group-hover:opacity-100',
            'placeholder:opacity-100',
            !primary && 'opacity-30',
            primary && isSaved && 'opacity-30',
            primary && !isSaved && 'opacity-100'
          )}
          rows={primary ? 10 : 1}
        />
      </div>
    </div>
  )
}

const LogContainer: React.FC<{
  children: React.ReactNode
  log: Log
  dateFormat: string
}> = ({ log, dateFormat, children }) => {
  const contextText = React.useMemo(() => {
    const weatherParts: string[] = []
    if (log.context?.temperature) {
      const celsius = toCelsius(log.context.temperature)
      weatherParts.push(`${Math.round(celsius)}°C`)
    }
    if (log.context?.humidity) {
      weatherParts.push(`${Math.round(log.context.humidity)}%`)
    }
    const weatherText = weatherParts.join(', ')
    if (log.context?.city) {
      return `${weatherText} – ${log.context.city}`
    }
    return weatherText
  }, [log.context])

  return (
    <div className="relative group">
      <div
        className={cn(
          'relative mb-4 sm:mb-0',
          'sm:absolute sm:top-0 sm:right-0 text-end select-none',
          'transition-opacity',
          'opacity-30',
          'group-hover:opacity-100'
        )}
      >
        {contextText ? (
          <div className="relative">
            <div
              className={cn(
                'transition-opacity duration-500',
                'sm:group-hover:opacity-0'
              )}
            >
              {dayjs(log.updatedAt).format(dateFormat)}
            </div>
            <div
              className={cn(
                'hidden sm:block',
                'absolute top-0 right-0 text-acc/60 transition-opacity duration-500',
                'opacity-0 group-hover:opacity-100 whitespace-nowrap'
              )}
            >
              {contextText}
            </div>
          </div>
        ) : (
          <div>{dayjs(log.updatedAt).format(dateFormat)}</div>
        )}
      </div>

      <div
        className={cn(
          'max-w-[500px] lg:max-w-[700px] whitespace-breakspaces',
          'opacity-30 transition-opacity',
          'group-hover:opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  )
}
