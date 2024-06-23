import dayjs from 'dayjs'
import dayjsRelativeTime from 'dayjs/plugin/relativeTime'
import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Button, Clock, ResizibleGhostInput } from '#client/components/ui'
import { cn } from '#client/utils'
import { useCreateChatMessage, useChatMessages } from '#client/queries'
import { sync } from '../sync'
import { PublicChatMessage, UserTag } from '#shared/types'
import {
  SYNC_CHAT_MESSAGES_TO_SHOW,
  MAX_SYNC_CHAT_MESSAGE_LENGTH,
} from '#shared/constants'

dayjs.extend(dayjsRelativeTime)

export const Sync = () => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const me = useStore(stores.me)
  const isTouchDevice = useStore(stores.isTouchDevice)

  const [message, setMessage] = React.useState('')
  const [messages, setMessages] = React.useState<PublicChatMessage[]>([])

  const { data: fetchedMessages } = useChatMessages()
  const { mutate: createChatMessage } = useCreateChatMessage({
    onSuccess: () => setMessage(''),
  })

  const onChangeMessage = React.useCallback((value: string) => {
    setMessage(
      value.length <= MAX_SYNC_CHAT_MESSAGE_LENGTH
        ? value
        : value.slice(0, MAX_SYNC_CHAT_MESSAGE_LENGTH)
    )
  }, [])

  React.useEffect(() => {
    if (fetchedMessages?.length) {
      setMessages(fetchedMessages)
    }
  }, [fetchedMessages])

  React.useEffect(() => {
    const { dispose: disposeUsersTotal } = sync.listen(
      'chat_message',
      (data) => {
        setMessages((prev) => {
          if (prev.some((x) => x.id === data.id)) return prev
          const newValue = [data, ...prev]
          return me?.isAdmin || me?.tags.includes(UserTag.Admin)
            ? newValue
            : newValue.slice(0, SYNC_CHAT_MESSAGES_TO_SHOW)
        })
      }
    )
    return () => {
      disposeUsersTotal()
    }
  }, [])

  const onSubmitMessage = React.useCallback(
    (ev?: React.FormEvent) => {
      ev?.preventDefault()
      createChatMessage({ message })
    },
    [message]
  )

  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key === 'Enter') {
        if (isTouchDevice) return
        if (!ev.metaKey && !ev.shiftKey) {
          onSubmitMessage()
          ev.preventDefault()
        }
      }
    },
    [onSubmitMessage]
  )

  React.useEffect(() => {
    formRef.current?.querySelector('textarea')?.focus()
  }, [])

  return (
    <div className="max-w-[500px] lg:max-w-[700px]">
      <div className="flex items-start mb-80">
        <span className="mr-16 whitespace-nowrap py-2 leading-normal border border-transparent">
          {me!.firstName}
        </span>
        <form
          onSubmit={onSubmitMessage}
          className="flex items-start gap-x-8"
          ref={formRef}
        >
          <ResizibleGhostInput
            direction="vh"
            value={message}
            onChange={onChangeMessage}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            containerClassName="translate-y-[5px]"
          />
          <div className="flex items-center gap-x-16">
            <span className="opacity-40 pointer-events-none select-none whitespace-nowrap">
              <Clock format="hh:mm A" interval={5e3} />
            </span>
            <Button
              type="submit"
              kind="secondary"
              size="small"
              disabled={!message.trim()}
            >
              Send
            </Button>
          </div>
        </form>
      </div>

      <div>
        {messages.map((x, i) => (
          <div
            key={x.id}
            className={cn(
              'group flex items-start gap-x-16 mb-8',
              i >= SYNC_CHAT_MESSAGES_TO_SHOW && 'opacity-20'
            )}
          >
            <div className="whitespace-nowrap">{x.author}</div>
            <div
              className="whitespace-breakspaces"
              style={{
                wordWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {x.message}
            </div>
            {!isTouchDevice && (
              <div className="opacity-0 transition-opacity select-none pointer-events-none whitespace-nowrap group-hover:opacity-40">
                <MessageTimeLabel dateString={x.createdAt} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const MessageTimeLabel: React.FC<{ dateString: string }> = ({ dateString }) => {
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const date = dayjs(dateString)
  const now = dayjs()
  const isPast = now.diff(date, 'day') >= 1
  const timeFormat = isTimeFormat12h ? 'hh:mm A' : 'HH:mm'
  const fromNow = date.fromNow()
  return (
    <span>
      {date.format(timeFormat)}
      {isPast && `, ${fromNow}`}
    </span>
  )
}
