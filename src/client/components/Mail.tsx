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
import { Block } from '#client/components/ui'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import { useLotInbox, useLotSent, useMarkLotEmailRead } from '#client/queries'
import { sync } from '../sync'
import { LotEmailRecord, LotEmailSSEPayload } from '#shared/types'

type Tab = 'inbox' | 'sent'

export const Mail: React.FC = () => {
  const me = useStore(stores.me)
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const queryClient = useQueryClient()

  const [tab, setTab] = React.useState<Tab>('inbox')
  const [selected, setSelected] = React.useState<LotEmailRecord | null>(null)

  const { data: inbox = [], refetch: refetchInbox } = useLotInbox()
  const { data: sent = [] } = useLotSent()
  const { mutate: markRead } = useMarkLotEmailRead({
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/lot-emails/inbox'])
    },
  })

  // Clear unread count on mount and when inbox loads
  React.useEffect(() => {
    stores.unreadMailCount.set(0)
  }, [])

  // Listen for incoming mail via SSE and refresh inbox
  React.useEffect(() => {
    const { dispose } = sync.listen('lot_email', (data: LotEmailSSEPayload) => {
      if (data.receiverId === me?.id) {
        queryClient.invalidateQueries(['/api/lot-emails/inbox'])
      }
    })
    return dispose
  }, [me?.id])

  const onSelectEmail = React.useCallback(
    (email: LotEmailRecord) => {
      setSelected(email)
      if (!email.readAt && email.receiverId === me?.id) {
        markRead({ id: email.id })
      }
    },
    [me?.id, markRead]
  )

  const list = tab === 'inbox' ? inbox : sent
  const timeFormat = isTimeFormat12h ? 'h:mm A' : 'HH:mm'

  return (
    <div className="max-w-[700px]">
      {/* Tab bar */}
      <div className="flex gap-x-8 mb-48">
        <button
          className={cn(
            'text-sm leading-normal',
            tab === 'inbox' ? 'opacity-100' : 'opacity-30'
          )}
          onClick={() => { setTab('inbox'); setSelected(null) }}
        >
          Inbox
          {inbox.filter(e => !e.readAt).length > 0 && (
            <span className="ml-4 opacity-60">
              {inbox.filter(e => !e.readAt).length}
            </span>
          )}
        </button>
        <button
          className={cn(
            'text-sm leading-normal',
            tab === 'sent' ? 'opacity-100' : 'opacity-30'
          )}
          onClick={() => { setTab('sent'); setSelected(null) }}
        >
          Sent
        </button>
      </div>

      {/* Selected email view */}
      {selected ? (
        <div>
          <button
            className="opacity-40 text-sm mb-24 leading-normal"
            onClick={() => setSelected(null)}
          >
            ← Back
          </button>
          <div className="mb-16 leading-normal">
            <span className="opacity-40 mr-8">
              {tab === 'inbox' ? 'From' : 'To'}
            </span>
            <span>
              {tab === 'inbox' ? selected.senderName : selected.receiverName}
            </span>
          </div>
          {selected.subject && (
            <div className="mb-16 leading-normal">
              <span className="opacity-40 mr-8">Subject</span>
              <span>{selected.subject}</span>
            </div>
          )}
          <div className="mb-16 opacity-40 text-sm leading-normal">
            {dayjs(selected.createdAt).format(
              `${timeFormat}, MMM D YYYY`
            )}
          </div>
          <div className="leading-[1.5rem] whitespace-pre-wrap">
            {selected.body}
          </div>
        </div>
      ) : (
        /* Email list */
        <div>
          {list.length === 0 ? (
            <div className="opacity-30 leading-normal">
              {tab === 'inbox' ? 'No messages.' : 'Nothing sent yet.'}
            </div>
          ) : (
            list.map((email) => {
              const isUnread = tab === 'inbox' && !email.readAt
              const counterpart =
                tab === 'inbox' ? email.senderName : email.receiverName
              return (
                <div
                  key={email.id}
                  className={cn(
                    'group flex items-start gap-x-8 cursor-pointer grid-fill-hover -mx-4 px-4 py-2 rounded leading-normal',
                    isUnread && 'font-medium'
                  )}
                  onClick={() => onSelectEmail(email)}
                >
                  <span className="whitespace-nowrap opacity-60 flex-shrink-0">
                    {counterpart || '—'}
                  </span>
                  <span
                    className="flex-1 truncate"
                    style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {email.subject ? `${email.subject} — ` : ''}
                    {email.body}
                  </span>
                  <span className="opacity-30 text-xs whitespace-nowrap flex-shrink-0 self-center">
                    {dayjs(email.createdAt).format(timeFormat)}
                  </span>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
