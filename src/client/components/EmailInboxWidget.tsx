/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { Block, GhostButton } from '#client/components/ui'
import { useEmailInbox, useEmailSent, useMarkEmailRead } from '#client/queries'
import { LotEmail } from '#shared/types'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'

type Tab = 'inbox' | 'sent'

export const EmailInboxWidget: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>('inbox')
  const [openId, setOpenId] = React.useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: inbox = [], isLoading: inboxLoading } = useEmailInbox()
  const { data: sent = [], isLoading: sentLoading } = useEmailSent()
  const { mutate: markRead } = useMarkEmailRead({
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/email/inbox'])
    },
  })

  const emails = tab === 'inbox' ? inbox : sent
  const isLoading = tab === 'inbox' ? inboxLoading : sentLoading
  const unreadCount = inbox.filter((e) => e.status === 'sent').length

  const onOpen = React.useCallback(
    (email: LotEmail) => {
      setOpenId((prev) => (prev === email.id ? null : email.id))
      if (tab === 'inbox' && email.status === 'sent') {
        markRead({ id: email.id })
      }
    },
    [tab, markRead]
  )

  return (
    <Block
      label={
        unreadCount > 0
          ? `EMAIL [${unreadCount}]:`
          : 'EMAIL:'
      }
      blockView
    >
      <div className="flex gap-x-12 mb-8">
        <GhostButton
          className={cn('uppercase tracking-widest text-xs', tab === 'inbox' && 'opacity-100')}
          onClick={() => setTab('inbox')}
        >
          INBOX
        </GhostButton>
        <GhostButton
          className={cn('uppercase tracking-widest text-xs', tab === 'sent' && 'opacity-100')}
          onClick={() => setTab('sent')}
        >
          SENT
        </GhostButton>
      </div>

      {isLoading && (
        <div className="opacity-40 uppercase tracking-widest text-xs">Loading...</div>
      )}

      {!isLoading && emails.length === 0 && (
        <div className="opacity-30 uppercase tracking-widest text-xs">
          {tab === 'inbox' ? 'No messages received.' : 'No messages sent.'}
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        {emails.map((email) => {
          const isOpen = openId === email.id
          const isUnread = tab === 'inbox' && email.status === 'sent'
          const counterpart = tab === 'inbox' ? email.fromName : email.toName
          const label = tab === 'inbox' ? 'from' : 'to'

          return (
            <div
              key={email.id}
              className={cn(
                'cursor-pointer -mx-4 px-4 py-2 rounded transition-opacity',
                isUnread ? 'opacity-100' : 'opacity-40',
                'hover:opacity-100'
              )}
              onClick={() => onOpen(email)}
            >
              <div className="flex items-baseline gap-x-8">
                <span className="uppercase tracking-widest text-xs opacity-60">
                  {label}
                </span>
                <span className={cn('font-medium', isUnread && 'font-bold')}>
                  {counterpart}
                </span>
                <span className="opacity-30 text-xs ml-auto whitespace-nowrap">
                  {dayjs(email.createdAt).fromNow()}
                </span>
              </div>

              {!isOpen && (
                <div className="opacity-40 text-xs mt-2 truncate">
                  {email.body.slice(0, 80)}
                  {email.body.length > 80 && '…'}
                </div>
              )}

              {isOpen && (
                <div className="mt-8">
                  {email.subject && (
                    <div className="uppercase tracking-widest text-xs opacity-60 mb-4">
                      {email.subject}
                    </div>
                  )}
                  <div className="opacity-80 whitespace-pre-wrap">{email.body}</div>
                  <div className="opacity-20 text-xs mt-8 uppercase tracking-widest">
                    {dayjs(email.createdAt).format('YYYY-MM-DD HH:mm')}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 opacity-20 text-xs uppercase tracking-widest">
        /email to [name] in Log to compose
      </div>
    </Block>
  )
}
