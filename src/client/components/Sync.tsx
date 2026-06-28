/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { useQueryClient } from 'react-query'
import * as stores from '#client/stores'
import { $featureUnlocks } from '#client/stores/evolution'
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
  useDirectMessagesInbox,
  type DirectMessageInboxItem,
} from '#client/queries'
import { sync } from '../sync'
import { PublicChatMessage, UserTag } from '#shared/types'
import {
  SYNC_CHAT_MESSAGES_TO_SHOW,
  MAX_SYNC_CHAT_MESSAGE_LENGTH,
} from '#shared/constants'

export const Sync = React.memo(function SyncInner() {
  const formRef = React.useRef<HTMLFormElement>(null)
  const me = useStore(stores.me)
  const isTouchDevice = useStore(stores.isTouchDevice)
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const featureUnlocks = useStore($featureUnlocks)
  const queryClient = useQueryClient()

  const [message, setMessage] = React.useState('')
  // SSE-received messages not yet reflected in the API response
  const [sseMessages, setSseMessages] = React.useState<PublicChatMessage[]>([])
  // Real-time incoming DMs via SSE
  const [sseDms, setSseDms] = React.useState<DirectMessageInboxItem[]>([])

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
  const { data: fetchedInbox = [] } = useDirectMessagesInbox()
  const { mutate: createChatMessage } = useCreateChatMessage({
    onSuccess: () => setMessage(''),
  })
  const { mutate: likeChatMessage } = useLikeChatMessage({
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/chat-messages'])
    }
  })

  // Ensure fresh data on mount (filters suspended users)
  React.useEffect(() => {
    queryClient.invalidateQueries(['/api/chat-messages'])
  }, [])

  // Merge: SSE-only messages (not yet in API response) prepended to API list
  const messages = React.useMemo(() => {
    const fetched = fetchedMessages || []
    const fetchedIds = new Set(fetched.map((m) => m.id))
    const fresh = sseMessages.filter((m) => !fetchedIds.has(m.id))
    const combined = [...fresh, ...fetched]
    return canAccessUserProfiles ? combined : combined.slice(0, SYNC_CHAT_MESSAGES_TO_SHOW)
  }, [fetchedMessages, sseMessages, canAccessUserProfiles])

  React.useEffect(() => {
    const { dispose: disposeChatMessageListener } = sync.listen(
      'chat_message',
      (data) => {
        setSseMessages((prev) => {
          if (prev.some((x) => x.id === data.id)) return prev
          return [data, ...prev]
        })
      }
    )
    const { dispose: disposeChatMessageLikeListener } = sync.listen(
      'chat_message_like',
      (data) => {
        setSseMessages((prev) =>
          prev.map((x) => {
            if (x.id !== data.messageId) return x
            if (data.userId === me?.id) return { ...x, likes: data.likes, isLiked: data.isLiked }
            return { ...x, likes: data.likes }
          })
        )
        queryClient.invalidateQueries(['/api/chat-messages'])
      }
    )
    const { dispose: disposeDirectMessageListener } = sync.listen(
      'direct_message',
      (data) => {
        if (data.receiverId !== me?.id) return
        setSseDms((prev) => {
          if (prev.some((x) => x.id === data.id)) return prev
          return [{
            id: data.id,
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.message,
            createdAt: data.createdAt,
            updatedAt: data.createdAt,
            sender: { id: data.senderId, firstName: data.senderName, lastName: null },
          }, ...prev]
        })
      }
    )
    return () => {
      disposeChatMessageListener()
      disposeChatMessageLikeListener()
      disposeDirectMessageListener()
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

  // Merge fetched inbox with SSE-received DMs (deduplicated)
  const inbox = React.useMemo(() => {
    const fetchedIds = new Set(fetchedInbox.map((m) => m.id))
    const fresh = sseDms.filter((m) => !fetchedIds.has(m.id))
    return [...fresh, ...fetchedInbox].slice(0, 20)
  }, [fetchedInbox, sseDms])

  return (
    <div className="max-w-[700px]">
      {/* DM Inbox — new messages from other LOT members */}
      {inbox.length > 0 && (
        <div className="mb-40">
          <div className="text-acc/30 uppercase tracking-widest mb-8" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
            Messages
          </div>
          {inbox.map((dm) => {
            const senderName = dm.sender
              ? `${dm.sender.firstName || ''} ${dm.sender.lastName || ''}`.trim() || 'Unknown'
              : 'Unknown'
            return (
              <div
                key={dm.id}
                className="flex items-start gap-x-8 border-l-2 border-acc/20 pl-12 -ml-12 py-2 rounded-r mb-2"
              >
                <span className="whitespace-nowrap text-acc/60 shrink-0">{senderName}</span>
                <div className="text-acc/80 break-words min-w-0 flex-1">{dm.message}</div>
                <div className="text-acc/30 whitespace-nowrap shrink-0 select-none">
                  <MessageTimeLabel dateString={dm.createdAt} isTimeFormat12h={isTimeFormat12h} />
                </div>
              </div>
            )
          })}
        </div>
      )}

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
            onChange={setMessage}
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
        {messages.map((x, i) => {
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
              onClick={featureUnlocks?.communityRich ? onToggleLike(x.id) : undefined}
            >
              {authorId && (featureUnlocks?.socialMentions || canAccessUserProfiles) ? (
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

              {!!x.likes && featureUnlocks?.communityRich && (
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
                  <MessageTimeLabel dateString={x.createdAt} isTimeFormat12h={isTimeFormat12h} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})

const MessageTimeLabel: React.FC<{ dateString: string | Date; isTimeFormat12h: boolean }> = ({ dateString, isTimeFormat12h }) => {
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
