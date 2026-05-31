/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { Block } from '#client/components/ui'
import { useLotEmailInbox, useLotEmailSent, useMarkLotEmailRead, LotEmailRecord } from '#client/queries'
import { useQueryClient } from 'react-query'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'

export const LotEmailInbox: React.FC = () => {
  const [tab, setTab] = React.useState<'inbox' | 'sent'>('inbox')
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: inbox = [], isLoading: inboxLoading } = useLotEmailInbox()
  const { data: sent = [], isLoading: sentLoading } = useLotEmailSent()
  const { mutate: markRead } = useMarkLotEmailRead()

  const emails = tab === 'inbox' ? inbox : sent
  const isLoading = tab === 'inbox' ? inboxLoading : sentLoading

  const unread = inbox.filter((e) => !e.readAt).length

  const handleExpand = (email: LotEmailRecord) => {
    const isOpening = expanded !== email.id
    setExpanded(isOpening ? email.id : null)
    if (isOpening && !email.readAt && !email.isMine) {
      markRead({ id: email.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(['/api/lot-emails/inbox'])
        }
      })
    }
  }

  if (isLoading) return null

  return (
    <Block label="LOT® Mail:" blockView>
      {/* Tabs */}
      <div className="flex gap-16 mb-16">
        <button
          className={cn('transition-opacity', tab === 'inbox' ? 'opacity-100' : 'opacity-30 hover:opacity-60')}
          onClick={() => setTab('inbox')}
        >
          Inbox {unread > 0 && <span className="ml-4 text-xs">[{unread}]</span>}
        </button>
        <button
          className={cn('transition-opacity', tab === 'sent' ? 'opacity-100' : 'opacity-30 hover:opacity-60')}
          onClick={() => setTab('sent')}
        >
          Sent
        </button>
      </div>

      {emails.length === 0 ? (
        <div className="opacity-30">{tab === 'inbox' ? 'No messages.' : 'No sent mail.'}</div>
      ) : (
        <div className="space-y-2">
          {emails.map((email) => {
            const isOpen = expanded === email.id
            const from = email.sender
              ? `${email.sender.firstName || ''} ${email.sender.lastName || ''}`.trim()
              : '—'
            const to = email.receiver
              ? `${email.receiver.firstName || ''} ${email.receiver.lastName || ''}`.trim()
              : '—'
            const isUnread = !email.readAt && !email.isMine

            return (
              <div
                key={email.id}
                className="border-t border-acc/10 pt-8 first:border-t-0 first:pt-0"
              >
                <div
                  className="cursor-pointer grid-fill-hover -mx-4 px-4 py-2 rounded"
                  onClick={() => handleExpand(email)}
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 min-w-0">
                      <div className={cn('mb-2', isUnread && 'font-medium')}>
                        {tab === 'inbox' ? from : `→ ${to}`}
                      </div>
                      {email.subject && (
                        <div className="opacity-60 text-sm truncate">{email.subject}</div>
                      )}
                      {!isOpen && (
                        <div className="opacity-30 text-sm truncate">{email.body}</div>
                      )}
                    </div>
                    <div className="opacity-30 text-xs whitespace-nowrap flex-shrink-0">
                      {dayjs(email.createdAt).fromNow()}
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-8 ml-4 pb-8">
                    <div className="opacity-40 text-xs mb-8 uppercase tracking-widest">
                      {dayjs(email.createdAt).format('D MMM YYYY, HH:mm')}
                      {email.cohortContext && ' · via Cohort Dating'}
                    </div>
                    <div className="whitespace-pre-wrap">{email.body}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Block>
  )
}
