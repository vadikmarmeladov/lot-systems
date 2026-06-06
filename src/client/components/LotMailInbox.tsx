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
import { GhostButton, Tag } from '#client/components/ui'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'
import { useLotMail, useMarkLotMailRead } from '#client/queries'
import { sync } from '../sync'
import { PublicLotMail } from '#shared/types'

type Props = {
  onUnreadChange?: (count: number) => void
}

export const LotMailInbox: React.FC<Props> = ({ onUnreadChange }) => {
  const me = useStore(stores.me)
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const queryClient = useQueryClient()

  const [tab, setTab] = React.useState<'inbox' | 'sent'>('inbox')
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const [inbox, setInbox] = React.useState<PublicLotMail[]>([])
  const [sent, setSent] = React.useState<PublicLotMail[]>([])

  const { data, refetch } = useLotMail()
  const { mutate: markRead } = useMarkLotMailRead()

  React.useEffect(() => {
    if (!data) return
    setInbox(data.inbox)
    setSent(data.sent)
    onUnreadChange?.(data.unreadCount)
  }, [data])

  // Real-time: receive new mail via SSE
  React.useEffect(() => {
    const { dispose } = sync.listen('lotMail', (mail) => {
      setInbox((prev) => {
        if (prev.some((m) => m.id === mail.id)) return prev
        return [mail, ...prev]
      })
      onUnreadChange?.((inbox.filter((m) => !m.isRead).length) + 1)
    })
    return dispose
  }, [inbox])

  const onExpand = React.useCallback(
    (id: string) => {
      setExpanded((prev) => (prev === id ? null : id))
      const mail = inbox.find((m) => m.id === id)
      if (mail && !mail.isRead) {
        markRead(
          { id },
          {
            onSuccess: () => {
              setInbox((prev) =>
                prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
              )
              const newUnread = inbox.filter(
                (m) => !m.isRead && m.id !== id
              ).length
              onUnreadChange?.(newUnread)
            },
          }
        )
      }
    },
    [inbox, markRead]
  )

  const activeList = tab === 'inbox' ? inbox : sent
  const unreadCount = inbox.filter((m) => !m.isRead).length

  return (
    <div className="mt-48">
      <div className="flex items-center gap-x-8 mb-16">
        <GhostButton
          className={cn(tab === 'inbox' ? 'opacity-100' : 'opacity-40')}
          onClick={() => setTab('inbox')}
        >
          Mail
          {unreadCount > 0 && (
            <Tag className="ml-4 text-acc/60 border-acc/40" fill={false}>
              {unreadCount}
            </Tag>
          )}
        </GhostButton>
        <GhostButton
          className={cn('opacity-40', tab === 'sent' && 'opacity-100')}
          onClick={() => setTab('sent')}
        >
          Sent
        </GhostButton>
      </div>

      {activeList.length === 0 ? (
        <div className="text-acc/30 text-sm">
          {tab === 'inbox' ? 'No mail yet.' : 'Nothing sent yet.'}
        </div>
      ) : (
        <div className="space-y-0">
          {activeList.map((mail) => (
            <MailRow
              key={mail.id}
              mail={mail}
              tab={tab}
              isExpanded={expanded === mail.id}
              isTimeFormat12h={isTimeFormat12h}
              onExpand={onExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type MailRowProps = {
  mail: PublicLotMail
  tab: 'inbox' | 'sent'
  isExpanded: boolean
  isTimeFormat12h: boolean
  onExpand: (id: string) => void
}

const MailRow: React.FC<MailRowProps> = ({
  mail,
  tab,
  isExpanded,
  isTimeFormat12h,
  onExpand,
}) => {
  const date = dayjs(mail.createdAt)
  const now = dayjs()
  const timeFormat = isTimeFormat12h ? 'hh:mm A' : 'HH:mm'
  const label =
    now.diff(date, 'day') >= 1
      ? date.format('MMM D')
      : date.format(timeFormat)

  return (
    <div
      className={cn(
        'group -mx-4 px-4 py-2 rounded cursor-pointer grid-fill-hover',
        !mail.isRead && tab === 'inbox' && 'font-medium'
      )}
      onClick={() => onExpand(mail.id)}
    >
      <div className="flex items-start gap-x-8">
        <span className="whitespace-nowrap text-acc/50 w-[70px] shrink-0 text-right select-none">
          {label}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-x-8">
            <span className="text-acc/60 shrink-0">
              {tab === 'inbox' ? mail.senderName : `→ ${mail.recipientName}`}
            </span>
            {mail.subject && (
              <span className="truncate text-acc/40 text-sm">{mail.subject}</span>
            )}
            {!mail.isRead && tab === 'inbox' && (
              <span className="shrink-0 w-[6px] h-[6px] rounded-full bg-acc/60 mt-[2px]" />
            )}
          </div>
          {isExpanded && (
            <div className="mt-4 mb-4 text-acc/80 whitespace-pre-wrap leading-relaxed">
              {mail.body}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
