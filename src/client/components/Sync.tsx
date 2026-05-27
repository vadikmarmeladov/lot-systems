import * as React from 'react'
import { useStore } from '@nanostores/react'
import { useQueryClient } from 'react-query'
import * as stores from '#client/stores'
import {
  Button,
  Clock,
  GhostButton,
  ResizibleGhostInput,
  Tag,
} from '#client/components/ui'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'
import {
  useCreateChatMessage,
  useChatMessages,
  useLikeChatMessage,
} from '#client/queries'
import { sync } from '../sync'
import { PublicChatMessage, PublicEmailMessage, UserTag } from '#shared/types'
import {
  SYNC_CHAT_MESSAGES_TO_SHOW,
  MAX_SYNC_CHAT_MESSAGE_LENGTH,
} from '#shared/constants'

// Union type for the Sync feed
type SyncFeedItem =
  | ({ kind: 'chat' } & PublicChatMessage)
  | ({ kind: 'email' } & PublicEmailMessage)

export const Sync = () => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const me = useStore(stores.me)
  const isTouchDevice = useStore(stores.isTouchDevice)
  const queryClient = useQueryClient()

  const [message, setMessage] = React.useState('')
  const [messages, setMessages] = React.useState<PublicChatMessage[]>([])
  const [feedItems, setFeedItems] = React.useState<SyncFeedItem[]>([])
  const hasInitiallyLoaded = React.useRef(false)

  // Check if current user can access /us section (admin-level access)
  const canAccessUserProfiles = React.useMemo(() => {
    if (!me) return false
    if (me.isAdmin) return true
    return me.tags.some((tag) =>
      tag.toLowerCase() === UserTag.Usership.toLowerCase() ||
      tag.toLowerCase() === UserTag.RND.toLowerCase()
    )
  }, [me])

  const { data: fetchedMessages } = useChatMessages()
  const { mutate: createChatMessage } = useCreateChatMessage({
    onSuccess: () => setMessage(''),
  })
  const { mutate: likeChatMessage } = useLikeChatMessage({
    onSuccess: () => {
      // Invalidate chat messages cache to ensure likes persist across tab switches
      queryClient.invalidateQueries(['/api/chat-messages'])
    }
  })

  const onChangeMessage = React.useCallback((value: string) => {
    setMessage(
      value.length <= MAX_SYNC_CHAT_MESSAGE_LENGTH
        ? value
        : value.slice(0, MAX_SYNC_CHAT_MESSAGE_LENGTH)
    )
  }, [])

  // Only load messages from API on initial mount, not on refetches
  // SSE events will handle updates after initial load
  React.useEffect(() => {
    if (fetchedMessages?.length && !hasInitiallyLoaded.current) {
      setMessages(fetchedMessages)
      // Seed feedItems from initial chat messages
      setFeedItems(fetchedMessages.map((m) => ({ kind: 'chat' as const, ...m })))
      hasInitiallyLoaded.current = true
    }
  }, [fetchedMessages])

  // Invalidate cache on mount to ensure fresh data (filters suspended users)
  // Reset hasInitiallyLoaded when component unmounts so data reloads on return
  React.useEffect(() => {
    queryClient.invalidateQueries(['/api/chat-messages'])
    return () => {
      hasInitiallyLoaded.current = false
    }
  }, [])

  React.useEffect(() => {
    const { dispose: disposeChatMessageListener } = sync.listen(
      'chat_message',
      (data: PublicChatMessage) => {
        setMessages((prev) => {
          if (prev.some((x) => x.id === data.id)) return prev
          const newValue = [data, ...prev]
          return canAccessUserProfiles
            ? newValue
            : newValue.slice(0, SYNC_CHAT_MESSAGES_TO_SHOW)
        })
        setFeedItems((prev) => {
          if (prev.some((x) => x.id === data.id)) return prev
          return [{ kind: 'chat', ...data }, ...prev].slice(0, SYNC_CHAT_MESSAGES_TO_SHOW + 20)
        })
      }
    )
    const { dispose: disposeChatMessageLikeListener } = sync.listen(
      'chat_message_like',
      (data) => {
        setMessages((prev) => {
          return prev.map((x) => {
            if (x.id === data.messageId) {
              // Update likes count for all users
              // Update isLiked only if this user performed the action
              if (data.userId === me?.id) {
                return { ...x, likes: data.likes, isLiked: data.isLiked }
              }
              return { ...x, likes: data.likes }
            }
            return x
          })
        })
        // Also update feedItems
        setFeedItems((prev) =>
          prev.map((x) => {
            if (x.kind === 'chat' && x.id === data.messageId) {
              if (data.userId === me?.id) {
                return { ...x, likes: data.likes, isLiked: data.isLiked }
              }
              return { ...x, likes: data.likes }
            }
            return x
          })
        )
      }
    )
    const { dispose: disposeEmailListener } = sync.listen(
      'email_message',
      (data: PublicEmailMessage) => {
        setFeedItems((prev) => {
          if (prev.some((x) => x.id === data.id)) return prev
          return [{ kind: 'email', ...data }, ...prev].slice(0, SYNC_CHAT_MESSAGES_TO_SHOW + 20)
        })
      }
    )
    return () => {
      disposeChatMessageListener()
      disposeChatMessageLikeListener()
      disposeEmailListener()
    }
  }, [me?.id])

  const onSubmitMessage = React.useCallback(
    (ev?: React.FormEvent) => {
      ev?.preventDefault()
      createChatMessage({ message })
    },
    [message]
  )

  const onToggleLike = React.useCallback(
    (messageId: string) => (ev: React.MouseEvent) => {
      ev?.preventDefault()
      ev?.stopPropagation()

      // Optimistically update isLiked state for current user
      setMessages((prev) => {
        return prev.map((x) => {
          if (x.id === messageId) {
            const newIsLiked = !x.isLiked
            const newLikes = newIsLiked ? (x.likes || 0) + 1 : Math.max(0, (x.likes || 0) - 1)
            return { ...x, likes: newLikes, isLiked: newIsLiked }
          }
          return x
        })
      })

      likeChatMessage({ messageId })
    },
    [likeChatMessage]
  )

  const onNavigateToUserProfile = React.useCallback(
    (userId: string) => (ev: React.MouseEvent | React.TouchEvent) => {
      ev?.preventDefault()
      ev?.stopPropagation()
      // Usership users go to /us/u (internal profile within /us context)
      // Regular users go to /u (public profile for sharing)
      window.location.href = canAccessUserProfiles ? `/us/u/${userId}` : `/u/${userId}`
    },
    [canAccessUserProfiles]
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
    <div className="max-w-[700px]">
      <div className="flex items-center mb-80">
        <span className="mr-8 whitespace-nowrap leading-normal">
          {me!.firstName}
        </span>
        <form
          onSubmit={onSubmitMessage}
          className="flex items-center gap-x-8 flex-1"
          ref={formRef}
        >
          <ResizibleGhostInput
            direction="vh"
            value={message}
            onChange={onChangeMessage}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            containerClassName="flex-grow leading-normal"
            className="leading-normal"
          />
          <div className="flex items-center gap-x-8">
            <span className="text-acc/40 pointer-events-none select-none whitespace-nowrap leading-normal">
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
        {feedItems.map((item, i) => {
          if (item.kind === 'email') {
            // LOT Email message row
            return (
              <div
                key={item.id}
                className={cn(
                  'group flex items-start gap-x-8 -mx-4 px-4 py-2 rounded',
                  i >= SYNC_CHAT_MESSAGES_TO_SHOW && 'text-acc/20'
                )}
              >
                <span className="whitespace-nowrap text-acc/40 select-none text-xs uppercase tracking-widest leading-normal mt-[3px] shrink-0">
                  ✉
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-x-6 flex-wrap">
                    <span className="text-acc/70 leading-normal">{item.senderName}</span>
                    <span className="text-acc/30 leading-normal select-none">→</span>
                    <span className="text-acc/50 leading-normal">{item.receiverName}</span>
                    {item.isCohortMessage && (
                      <span className="text-acc/25 text-xs uppercase tracking-widest select-none">◈ cohort</span>
                    )}
                  </div>
                  <div
                    className="text-acc/50 mt-2 leading-normal"
                    style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
                  >
                    {item.body}
                  </div>
                </div>
                {!isTouchDevice && (
                  <div className="text-acc/0 transition-opacity select-none pointer-events-none whitespace-nowrap group-hover:text-acc/40 shrink-0">
                    <MessageTimeLabel dateString={item.createdAt} />
                  </div>
                )}
              </div>
            )
          }

          // Regular chat message row
          const x = item as SyncFeedItem & { kind: 'chat' }
          const authorObj = typeof x.author === 'object' ? x.author : null
          const authorName = typeof x.author === 'string'
            ? x.author
            : authorObj
              ? `${authorObj.firstName || ''} ${authorObj.lastName || ''}`.trim() || 'Unknown'
              : 'Unknown'
          const authorId = authorObj?.id || x.authorUserId

          return (
            <div
              key={x.id}
              className={cn(
                'group flex items-start gap-x-8 cursor-pointer grid-fill-hover -mx-4 px-4 py-2 rounded',
                i >= SYNC_CHAT_MESSAGES_TO_SHOW && 'text-acc/20'
              )}
              onClick={onToggleLike(x.id)}
            >
              {authorId ? (
                <GhostButton
                  className="whitespace-nowrap pr-4"
                  onClick={onNavigateToUserProfile(authorId)}
                  onTouchEnd={onNavigateToUserProfile(authorId)}
                >
                  {authorName}
                </GhostButton>
              ) : (
                <span className="whitespace-nowrap -ml-4 px-4 pr-8">{authorName}</span>
              )}
              <div
                className="whitespace-breakspaces"
                style={{
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                }}
              >
                {x.message}
              </div>

              {!!x.likes && (
                <Tag
                  className={cn(
                    'text-acc/40 select-none -mt-[2px]',
                    x.isLiked ? 'border-acc/40' : 'border-transparent'
                  )}
                  title="Click message to like/unlike"
                  key={`${x.id}_${x.isLiked}`}
                  fill={false}
                >
                  {x.likes}
                </Tag>
              )}

              {!isTouchDevice && (
                <div className="text-acc/0 transition-opacity select-none pointer-events-none whitespace-nowrap group-hover:text-acc/40">
                  <MessageTimeLabel dateString={x.createdAt} />
                </div>
              )}
            </div>
          )
        })}
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
