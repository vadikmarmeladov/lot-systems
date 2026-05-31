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
  useLotEmailInbox,
  useMarkLotEmailRead,
  LotEmailRecord,
} from '#client/queries'
import { sync } from '../sync'
import { LotEmailComposer } from '#client/components/LotEmailComposer'
import { PublicChatMessage, LotEmailEventPayload, UserTag } from '#shared/types'
import {
  SYNC_CHAT_MESSAGES_TO_SHOW,
  MAX_SYNC_CHAT_MESSAGE_LENGTH,
} from '#shared/constants'

type SyncFeedItem =
  | { kind: 'chat'; data: PublicChatMessage }
  | { kind: 'email'; data: LotEmailRecord }

export const Sync = () => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const me = useStore(stores.me)
  const isTouchDevice = useStore(stores.isTouchDevice)
  const queryClient = useQueryClient()

  const [message, setMessage] = React.useState('')
  const [messages, setMessages] = React.useState<PublicChatMessage[]>([])
  const hasInitiallyLoaded = React.useRef(false)

  // LOT® Email state
  const [inboxEmails, setInboxEmails] = React.useState<LotEmailRecord[]>([])
  const [emailComposerOpen, setEmailComposerOpen] = React.useState(false)
  const [expandedEmailId, setExpandedEmailId] = React.useState<string | null>(null)
  const { data: fetchedInbox = [] } = useLotEmailInbox()
  const { mutate: markRead } = useMarkLotEmailRead()

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
      hasInitiallyLoaded.current = true
    }
  }, [fetchedMessages])

  // Load inbox emails on mount
  React.useEffect(() => {
    if (fetchedInbox.length) setInboxEmails(fetchedInbox)
  }, [fetchedInbox])

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
      (data) => {
        setMessages((prev) => {
          if (prev.some((x) => x.id === data.id)) return prev
          const newValue = [data, ...prev]
          return canAccessUserProfiles
            ? newValue
            : newValue.slice(0, SYNC_CHAT_MESSAGES_TO_SHOW)
        })
      }
    )
    const { dispose: disposeChatMessageLikeListener } = sync.listen(
      'chat_message_like',
      (data) => {
        setMessages((prev) => {
          return prev.map((x) => {
            if (x.id === data.messageId) {
              if (data.userId === me?.id) {
                return { ...x, likes: data.likes, isLiked: data.isLiked }
              }
              return { ...x, likes: data.likes }
            }
            return x
          })
        })
      }
    )
    // LOT® Email SSE listener — new email arrives for current user
    const { dispose: disposeLotEmailListener } = sync.listen(
      'lot_email',
      (data: LotEmailEventPayload) => {
        if (data.receiverId !== me?.id) return
        const emailRecord: LotEmailRecord = {
          id: data.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          subject: data.subject,
          body: data.body,
          readAt: null,
          cohortContext: data.cohortContext,
          createdAt: data.createdAt as any,
          updatedAt: data.createdAt as any,
          isMine: false,
          sender: { id: data.senderId, firstName: data.senderName.split(' ')[0] || null, lastName: data.senderName.split(' ').slice(1).join(' ') || null },
          receiver: { id: me?.id || '', firstName: null, lastName: null },
        }
        setInboxEmails((prev) => {
          if (prev.some((x) => x.id === data.id)) return prev
          return [emailRecord, ...prev]
        })
        queryClient.invalidateQueries(['/api/lot-emails/inbox'])
      }
    )
    return () => {
      disposeChatMessageListener()
      disposeChatMessageLikeListener()
      disposeLotEmailListener()
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

  const unreadEmailCount = inboxEmails.filter((e) => !e.readAt).length

  const handleEmailExpand = (email: LotEmailRecord) => {
    const isOpening = expandedEmailId !== email.id
    setExpandedEmailId(isOpening ? email.id : null)
    if (isOpening && !email.readAt) {
      markRead({ id: email.id }, {
        onSuccess: () => {
          setInboxEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, readAt: new Date().toISOString() as any } : e))
          queryClient.invalidateQueries(['/api/lot-emails/inbox'])
        },
      })
    }
  }

  return (
    <>
    {emailComposerOpen && (
      <LotEmailComposer
        onClose={() => setEmailComposerOpen(false)}
        onSent={() => {
          setEmailComposerOpen(false)
          queryClient.invalidateQueries(['/api/lot-emails/sent'])
        }}
      />
    )}
    <div className="max-w-[700px]">
      {/* Chat input */}
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

      {/* LOT® Mail inbox — new emails appear here */}
      {inboxEmails.length > 0 && (
        <div className="mb-48">
          <div className="opacity-30 text-xs uppercase tracking-widest mb-16 flex items-center justify-between">
            <span>
              LOT® Mail
              {unreadEmailCount > 0 && (
                <span className="ml-8">[{unreadEmailCount} new]</span>
              )}
            </span>
            <button
              className="hover:opacity-60 transition-opacity"
              onClick={() => setEmailComposerOpen(true)}
            >
              + Compose
            </button>
          </div>
          <div>
            {inboxEmails.slice(0, 10).map((email) => {
              const senderName = email.sender
                ? `${email.sender.firstName || ''} ${email.sender.lastName || ''}`.trim() || 'LOT® Member'
                : 'LOT® Member'
              const isOpen = expandedEmailId === email.id
              const isUnread = !email.readAt

              return (
                <div
                  key={email.id}
                  className={cn(
                    'group border-t border-acc/10 pt-8 first:border-t-0 first:pt-0',
                    'cursor-pointer grid-fill-hover -mx-4 px-4 py-2 rounded'
                  )}
                  onClick={() => handleEmailExpand(email)}
                >
                  <div className="flex items-start gap-x-8">
                    <span className={cn('whitespace-nowrap', isUnread && 'opacity-100', !isUnread && 'opacity-40')}>
                      {senderName}
                    </span>
                    <div className="flex-1 min-w-0">
                      {email.subject && (
                        <div className={cn('truncate', isUnread ? 'opacity-80' : 'opacity-40')}>
                          {email.subject}
                        </div>
                      )}
                      {!isOpen && (
                        <div className="opacity-20 truncate">{email.body}</div>
                      )}
                      {isOpen && (
                        <div className="mt-4 whitespace-pre-wrap opacity-80">
                          {email.body}
                          {email.cohortContext && (
                            <div className="mt-8 opacity-30 text-xs">via Cohort Dating</div>
                          )}
                        </div>
                      )}
                    </div>
                    {!isTouchDevice && (
                      <div className="text-acc/0 transition-opacity select-none pointer-events-none whitespace-nowrap group-hover:text-acc/40">
                        <MessageTimeLabel dateString={email.createdAt as any} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {inboxEmails.length === 0 && (
            <div className="opacity-20">No messages yet.</div>
          )}
        </div>
      )}

      {/* Compose button when no emails yet */}
      {inboxEmails.length === 0 && (
        <div className="mb-48">
          <div className="opacity-20 text-xs uppercase tracking-widest mb-8">LOT® Mail</div>
          <button
            className="opacity-30 hover:opacity-80 transition-opacity text-sm"
            onClick={() => setEmailComposerOpen(true)}
          >
            + Compose email
          </button>
        </div>
      )}

      {/* Community chat feed */}
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
    </>
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
