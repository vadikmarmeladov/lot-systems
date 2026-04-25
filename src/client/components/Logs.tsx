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
          const physiologicalReadiness = log.metadata?.physiologicalReadiness as number | undefined
          const readinessDirective = log.metadata?.readinessDirective as string | undefined

          const sector =
            checkInType === 'morning' ? '0600' :
            checkInType === 'evening' ? '1800' :
            'SPOT'

          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label={`BIO [${sector}]:`} blockView>
                <div className="mb-8 uppercase tracking-widest">{emotionalState}</div>
                {physiologicalReadiness !== undefined && (
                  <div className="flex justify-between mb-8">
                    <span className="opacity-40">READINESS</span>
                    <span className="tabular-nums">{physiologicalReadiness}%</span>
                  </div>
                )}
                {readinessDirective && (
                  <div className="mb-8 opacity-40 uppercase tracking-widest text-xs">{readinessDirective}</div>
                )}
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
        } else if (log.event === 'goal_journey') {
          const title = log.metadata?.title as string | undefined
          const stage = log.metadata?.stage as string | undefined
          const progress = log.metadata?.progress as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="GOAL:" blockView>
                {title && <div className="uppercase tracking-widest mb-4">{title}</div>}
                {stage && <div className="opacity-60">STG: {stage}</div>}
                {progress !== undefined && (
                  <div className="opacity-40">PROG: {progress}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'evolution_update' || log.event === 'evolution') {
          const dimension = log.metadata?.dimension as string | undefined
          const level = log.metadata?.level as string | number | undefined
          const delta = log.metadata?.delta as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="EVO:" blockView>
                {dimension && <div className="uppercase tracking-widest mb-4">{dimension}</div>}
                {level !== undefined && <div className="opacity-60">LVL: {level}</div>}
                {delta !== undefined && (
                  <div className={delta >= 0 ? 'opacity-60' : 'opacity-40'}>
                    {delta >= 0 ? `+${delta}` : delta}
                  </div>
                )}
                {!dimension && log.text && <div>{log.text}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'narrative_progression' || log.event === 'narrative') {
          const chapter = log.metadata?.chapter as string | undefined
          const arc = log.metadata?.arc as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="NARR:" blockView>
                {arc && <div className="uppercase tracking-widest mb-4 opacity-60">ARC: {arc}</div>}
                {chapter && <div>{chapter}</div>}
                {!chapter && log.text && <div>{log.text}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'quantum_random') {
          const value = log.metadata?.value as number | undefined
          const range = log.metadata?.range as string | undefined
          const context = log.metadata?.context as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="QRNG:" blockView>
                {value !== undefined && (
                  <div className="tabular-nums text-lg mb-4">{value}</div>
                )}
                {range && <div className="opacity-40">RANGE: {range}</div>}
                {context && <div className="opacity-60">{context}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'assessment') {
          const category = log.metadata?.category as string | undefined
          const score = log.metadata?.score as number | undefined
          const verdict = log.metadata?.verdict as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="ASSESS:" blockView>
                {category && <div className="uppercase tracking-widest mb-4">{category}</div>}
                {score !== undefined && <div className="opacity-60">SCORE: {score}</div>}
                {verdict && <div className="opacity-40">{verdict}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'intervention') {
          const trigger = log.metadata?.trigger as string | undefined
          const action = log.metadata?.action as string | undefined
          const outcome = log.metadata?.outcome as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="INT:" blockView>
                {trigger && (
                  <div className="uppercase tracking-widest mb-4 opacity-60">
                    TRIG: {trigger.replace(/-/g, ' ')}
                  </div>
                )}
                {action && <div>{action}</div>}
                {outcome && <div className="opacity-40 mt-4">→ {outcome}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'os_version' || log.event === 'os_upgrade') {
          const version = log.metadata?.version as string | undefined
          const state = log.metadata?.state as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="OS:" blockView>
                {version && <div className="tabular-nums mb-4">{version}</div>}
                {state && <div className="uppercase tracking-widest opacity-60">{state}</div>}
                {!version && log.text && <div>{log.text}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'user_index_update') {
          const overall = log.metadata?.overall as number | undefined
          const trend = log.metadata?.trend as string | undefined
          const dimensions = log.metadata?.dimensions as Record<string, number> | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="IDX:" blockView>
                {overall !== undefined && (
                  <div className="tabular-nums mb-4">
                    {overall}
                    {trend && <span className="opacity-40 ml-8">{trend}</span>}
                  </div>
                )}
                {dimensions && (
                  <div className="flex flex-col gap-y-2 opacity-40">
                    {Object.entries(dimensions).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="uppercase">{k.slice(0, 4)}</span>
                        <span className="tabular-nums">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'recipe_viewed' || log.event === 'recipe_suggestion') {
          const meal = log.metadata?.meal as string | undefined
          const mealTime = log.metadata?.mealTime as string | undefined
          const recipe = log.metadata?.recipe as string | undefined
          const sector =
            mealTime === 'breakfast' ? '0700' :
            mealTime === 'lunch' ? '1200' :
            mealTime === 'dinner' ? '1800' :
            mealTime === 'snack' ? '1500' : 'FIELD'
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label={`REC [${sector}]:`} blockView>
                {meal && <div className="uppercase tracking-widest mb-4">{meal}</div>}
                {recipe && <div className="opacity-60">{recipe}</div>}
                {!meal && log.text && <div>{log.text}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'badge_unlock' || log.event === 'badge_awarded') {
          const badge = log.metadata?.badge as string | undefined
          const tier = log.metadata?.tier as string | undefined
          const category = log.metadata?.category as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="BADGE:" blockView>
                {badge && <div className="uppercase tracking-widest mb-4">{badge}</div>}
                {tier && <div className="opacity-60">TIER: {tier}</div>}
                {category && <div className="opacity-40">{category}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'cohort_determined' || log.event === 'cohort_match') {
          const archetype = log.metadata?.archetype as string | undefined
          const behavioralCohort = log.metadata?.behavioralCohort as string | undefined
          const confidence = log.metadata?.confidence as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="COHORT:" blockView>
                {archetype && <div className="uppercase tracking-widest mb-4">{archetype}</div>}
                {behavioralCohort && <div className="opacity-60">GRP: {behavioralCohort}</div>}
                {confidence !== undefined && (
                  <div className="opacity-40">CONF: {Math.round(confidence * 100)}%</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'os_vitals_snapshot') {
          const streak = log.metadata?.streak as number | undefined
          const activityDensity = log.metadata?.activityDensity as number | undefined
          const cohortState = log.metadata?.cohortState as string | undefined
          const health = log.metadata?.health as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="VITALS:" blockView>
                {streak !== undefined && (
                  <div className="flex justify-between mb-4">
                    <span className="opacity-40">STREAK</span>
                    <span className="tabular-nums">{streak}d</span>
                  </div>
                )}
                {activityDensity !== undefined && (
                  <div className="flex justify-between mb-4">
                    <span className="opacity-40">DENSITY</span>
                    <span className="tabular-nums">{activityDensity}</span>
                  </div>
                )}
                {health !== undefined && (
                  <div className="flex justify-between mb-4">
                    <span className="opacity-40">SYS HEALTH</span>
                    <span className="tabular-nums">{health}%</span>
                  </div>
                )}
                {cohortState && <div className="opacity-40 uppercase">{cohortState}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'signal_sync' || log.event === 'intention_sync') {
          const synced = log.metadata?.synced as number | undefined
          const sources = log.metadata?.sources as string[] | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="SYNC:" blockView>
                {synced !== undefined && (
                  <div className="tabular-nums mb-4">{synced} signals</div>
                )}
                {sources && sources.length > 0 && (
                  <div className="opacity-40 uppercase tracking-widest">
                    {sources.join(' · ')}
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'os_signal_report') {
          const sourceCount = log.metadata?.sourceCount as number | undefined
          const topSource = log.metadata?.topSource as string | undefined
          const diversityScore = log.metadata?.diversityScore as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="SIG-RPT:" blockView>
                {sourceCount !== undefined && (
                  <div className="flex justify-between mb-4">
                    <span className="opacity-40">SOURCES</span>
                    <span className="tabular-nums">{sourceCount}</span>
                  </div>
                )}
                {topSource && (
                  <div className="flex justify-between mb-4">
                    <span className="opacity-40">DOMINANT</span>
                    <span className="uppercase">{topSource}</span>
                  </div>
                )}
                {diversityScore !== undefined && (
                  <div className="flex justify-between">
                    <span className="opacity-40">DIVERSITY</span>
                    <span className="tabular-nums">{diversityScore}%</span>
                  </div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'chakra_update' || log.event === 'chakra_ergonomics') {
          const chakra = log.metadata?.chakra as string | undefined
          const score = log.metadata?.score as number | undefined
          const status = log.metadata?.status as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="CHAKRA:" blockView>
                {chakra && (
                  <div className="uppercase tracking-widest mb-4">{chakra}</div>
                )}
                {score !== undefined && (
                  <div className="flex justify-between mb-4">
                    <span className="opacity-40">SCORE</span>
                    <span className="tabular-nums">{score}</span>
                  </div>
                )}
                {status && (
                  <div className="opacity-40 uppercase tracking-widest">{status}</div>
                )}
                {!chakra && log.text && <div>{log.text}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'goal_complete' || log.event === 'goal_achieved') {
          const title = log.metadata?.title as string | undefined
          const duration = log.metadata?.duration as string | undefined
          const milestone = log.metadata?.milestone as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="GOAL-X:" blockView>
                {title && (
                  <div className="uppercase tracking-widest mb-4">{title}</div>
                )}
                {duration && (
                  <div className="opacity-60">DUR: {duration}</div>
                )}
                {milestone && (
                  <div className="opacity-40 mt-4">→ {milestone}</div>
                )}
                {!title && log.text && <div>{log.text}</div>}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'biofield_peak' || log.event === 'biofield_coherence') {
          const energy = log.metadata?.energy as string | undefined
          const clarity = log.metadata?.clarity as string | undefined
          const alignment = log.metadata?.alignment as string | undefined
          const readiness = log.metadata?.readiness as number | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="PEAK:" blockView>
                <div className="uppercase tracking-widest mb-8">Biofield coherence</div>
                <div className="flex flex-col gap-y-2">
                  {energy && (
                    <div className="flex justify-between">
                      <span className="opacity-40">ENERGY</span>
                      <span className="uppercase">{energy}</span>
                    </div>
                  )}
                  {clarity && (
                    <div className="flex justify-between">
                      <span className="opacity-40">CLARITY</span>
                      <span className="uppercase">{clarity}</span>
                    </div>
                  )}
                  {alignment && (
                    <div className="flex justify-between">
                      <span className="opacity-40">ALIGN</span>
                      <span className="uppercase">{alignment}</span>
                    </div>
                  )}
                  {readiness !== undefined && (
                    <div className="flex justify-between">
                      <span className="opacity-40">READINESS</span>
                      <span className="tabular-nums">{readiness}%</span>
                    </div>
                  )}
                </div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'energy_update' || log.event === 'energy_snapshot') {
          const level = log.metadata?.level as number | undefined
          const trajectory = log.metadata?.trajectory as string | undefined
          const status = log.metadata?.status as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="ATP:" blockView>
                {level !== undefined && (
                  <div className="tabular-nums mb-4">
                    {level}%
                    {trajectory && (
                      <span className="ml-8 opacity-60 uppercase tracking-widest">{trajectory}</span>
                    )}
                  </div>
                )}
                {status && (
                  <div className="opacity-40 uppercase tracking-widest">{status}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'cohort_signal') {
          const archetype = log.metadata?.archetype as string | undefined
          const behavioralCohort = log.metadata?.behavioralCohort as string | undefined
          if (!archetype && !behavioralCohort) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="PHY:" blockView>
                {archetype && (
                  <div className="uppercase tracking-widest mb-4">{archetype}</div>
                )}
                {behavioralCohort && (
                  <div className="opacity-60">{behavioralCohort}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'pattern_detected') {
          const pattern = log.metadata?.pattern as string | undefined
          const confidence = log.metadata?.confidence as number | undefined
          const action = log.metadata?.action as string | undefined
          if (!pattern) return null
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="PAT:" blockView>
                <div className="uppercase tracking-widest mb-4">
                  {pattern.replace(/-/g, ' ')}
                </div>
                {confidence !== undefined && (
                  <div className="opacity-50 mb-4">
                    CONF: {Math.round(confidence * 100)}%
                  </div>
                )}
                {action && (
                  <div className="opacity-40">ACT: {action}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'journal_entry') {
          const wordCount = log.metadata?.wordCount as number | undefined
          const depth = log.metadata?.depth as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="JRN:" blockView>
                {log.text && <div className="mb-8">{log.text}</div>}
                <div className="flex gap-x-16 opacity-40">
                  {wordCount !== undefined && <span>WC: {wordCount}</span>}
                  {depth && <span className="uppercase tracking-widest">DEPTH: {depth}</span>}
                </div>
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'ecosystem_update') {
          const nodes = log.metadata?.nodes as { car?: boolean; home?: boolean; computer?: boolean } | undefined
          const coherence = log.metadata?.coherence as string | undefined
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="ECO:" blockView>
                {nodes && (
                  <div className="flex gap-x-16 mb-4">
                    <span className={nodes.car ? '' : 'opacity-20'}>CAR</span>
                    <span className={nodes.home ? '' : 'opacity-20'}>HOME</span>
                    <span className={nodes.computer ? '' : 'opacity-20'}>CPU</span>
                  </div>
                )}
                {coherence && (
                  <div className="opacity-40 uppercase tracking-widest">{coherence}</div>
                )}
              </Block>
            </LogContainer>
          )
        } else if (log.event !== 'note') {
          if (!log.text) return null
          // Derive a terse military label from the event name prefix
          const evtLabel = log.event
            .toUpperCase()
            .replace(/_/g, '-')
            .slice(0, 8)
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label={`${evtLabel}:`} blockView>
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
