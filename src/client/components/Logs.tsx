import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Block, ResizibleGhostInput, Unknown } from '#client/components/ui'
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

  const { data: loadedLogs = [] } = useLogs()
  const { mutate: updateLog } = useUpdateLog({
    onSuccess: (log) => {
      localStore.logById.set({
        ...logById,
        [log.id]: log,
      })
    },
  })

  React.useEffect(() => {
    if (!loadedLogs.length) return
    localStore.logById.set(loadedLogs.reduce(fp.by('id'), {}))
    localStore.logIds.set(loadedLogs.map(fp.prop('id')))
  }, [loadedLogs])

  const onChangeLog = React.useCallback(
    (id: string) => (text: string) => {
      updateLog({ id, text })
    },
    [logById]
  )

  const [recentLogId, pastLogIds] = React.useMemo(() => {
    return [logIds[0], logIds.slice(1)]
  }, [logIds])

  const dateFormat = React.useMemo(() => {
    return isTimeFormat12h ? 'h:mm:ss A (M/D/YY)' : 'H:mm:ss (D/M/YY)'
  }, [isTimeFormat12h])

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
      className="flex flex-col gap-y-[1.5rem] leading-[1.5rem]"
    >
      <div ref={inputContainerRef} className="min-h-[200px]">
        <NoteEditor
          key={recentLogId}
          log={logById[recentLogId]}
          primary
          onChange={onChangeLog(recentLogId)}
          isMouseActive={isMouseActive}
          dateFormat={dateFormat}
        />
      </div>

      {pastLogIds.map((id) => {
        const log = logById[id]
        if (log.event === 'answer') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="Memory:" blockView>
                {log.metadata.question as string}
              </Block>
              <Block label="Me:" blockView>
                {log.metadata.answer as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'chat_message') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="Sync:" blockView>
                {log.metadata.message as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'chat_message_like') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="Sync:" blockView>
                Upvoted message:{'\n'}{log.metadata.message as string}
              </Block>
            </LogContainer>
          )
        } else if (log.event === 'settings_change') {
          return (
            <LogContainer key={id} log={log} dateFormat={dateFormat}>
              <Block label="Settings:" blockView>
                {/* TODO: refactor */}
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
                      {from || <Unknown>None</Unknown>} →{' '}
                      {to || <Unknown>None</Unknown>}
                    </div>
                  )
                })}
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
}: {
  log: Log
  primary?: boolean
  onChange: (text: string) => void
  isMouseActive: boolean
  dateFormat: string
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [isFocused, setIsFocused] = React.useState(false)
  const [value, setValue] = React.useState(log.text || '')
  const debouncedValue = useDebounce(value, 800)

  React.useEffect(() => {
    if (log.text === debouncedValue) return
    onChange(debouncedValue)
  }, [debouncedValue])

  // React.useEffect(() => {
  //   setValue(log.text || '')
  // }, [log])

  React.useEffect(() => {
    const textarea = containerRef.current?.querySelector('textarea')
    if (!textarea) return
    textarea.addEventListener('focus', () => setIsFocused(true))
    textarea.addEventListener('blur', () => setIsFocused(false))
  }, [])

  return (
    <div className="relative group">
      <div
        className={cn(
          'relative',
          'sm:absolute sm:top-0 sm:right-0 text-end select-none',
          'transition-opacity',
          primary
            ? cn(
                'hidden sm:block ___opacity-20 sm:opacity-100',
                !isMouseActive && 'sm:opacity-0'
              )
            : cn(
                'opacity-0',
                isFocused && 'opacity-20 sm:opacity-100',
                'sm:group-hover:opacity-100'
              )
        )}
      >
        {primary
          ? 'Just now'
          : !!log && dayjs(log.updatedAt).format(dateFormat)}
      </div>

      <div className="max-w-[700px]" ref={containerRef}>
        <ResizibleGhostInput
          // tabIndex={-1}
          direction="v"
          value={value}
          onChange={setValue}
          placeholder={
            !primary ? 'The log record will be deleted' : 'Type here...'
          }
          className={cn(
            'max-w-[700px] focus:opacity-100 group-hover:opacity-100',
            !primary && 'opacity-20'
            // 'opacity-20'
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
  return (
    <div className="relative group">
      <div
        className={cn(
          'relative',
          'sm:absolute sm:top-0 sm:right-0 text-end select-none',
          'transition-opacity opacity-0',
          'group-hover:opacity-100'
        )}
      >
        {dayjs(log.updatedAt).format(dateFormat)}
      </div>

      <div
        className={cn(
          'max-w-[500px] lg:max-w-[700px] whitespace-breakspaces',
          'transition-opacity opacity-20',
          'group-hover:opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  )
}
