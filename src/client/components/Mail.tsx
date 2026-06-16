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
import { Block, Button } from '#client/components/ui'
import { useLotEmails, useMarkEmailRead, type LotEmailRecord } from '#client/queries'
import { sync } from '../sync'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'
import { LotEmailEvent } from '#shared/types'

export const Mail: React.FC = () => {
  const me = useStore(stores.me)
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const queryClient = useQueryClient()
  const { data, isLoading, refetch } = useLotEmails()
  const { mutate: markRead } = useMarkEmailRead({
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/lot-emails'])
    },
  })
  const [tab, setTab] = React.useState<'inbox' | 'sent'>('inbox')
  const [openEmailId, setOpenEmailId] = React.useState<string | null>(null)

  // Listen for new emails via SSE — update inbox in real-time
  React.useEffect(() => {
    const { dispose } = sync.listen('lot_email', (email: LotEmailEvent) => {
      if (email.receiverId === me?.id) {
        queryClient.invalidateQueries(['/api/lot-emails'])
      }
    })
    return dispose
  }, [me?.id])

  const dateFormat = isTimeFormat12h ? 'h:mm A (M/D/YY)' : 'HH:mm DD/MM/YY'

  const inbox = data?.inbox ?? []
  const sent = data?.sent ?? []
  const unreadCount = data?.unreadCount ?? 0

  const currentList = tab === 'inbox' ? inbox : sent

  const openEmail = currentList.find((e) => e.id === openEmailId) ?? null

  const handleOpenEmail = (email: LotEmailRecord) => {
    setOpenEmailId(email.id)
    if (!email.isRead && email.receiverId === me?.id) {
      markRead({ id: email.id })
    }
  }

  const handleBack = () => setOpenEmailId(null)

  if (isLoading) {
    return (
      <div className="px-4 sm:px-0 leading-[1.5rem]">
        <Block label="Mail:" blockView>
          <div className="opacity-40 uppercase tracking-widest">Loading...</div>
        </Block>
      </div>
    )
  }

  // Email thread view
  if (openEmail) {
    return (
      <div className="max-w-[700px] px-4 sm:px-0 leading-[1.5rem]">
        <div className="mb-24">
          <button
            onClick={handleBack}
            className="opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest"
          >
            ← Mail
          </button>
        </div>

        <Block label="From:" blockView>
          <div>{openEmail.senderName}</div>
        </Block>

        <div className="mt-16">
          <Block label="To:" blockView>
            <div>{openEmail.recipientName}</div>
          </Block>
        </div>

        <div className="mt-16">
          <Block label="Date:" blockView>
            <div className="opacity-60">{dayjs(openEmail.createdAt).format(dateFormat)}</div>
          </Block>
        </div>

        {openEmail.subject && (
          <div className="mt-16">
            <Block label="Subj:" blockView>
              <div>{openEmail.subject}</div>
            </Block>
          </div>
        )}

        <div className="mt-24">
          <Block label="Body:" blockView>
            <div className="whitespace-pre-wrap leading-[1.5rem]">
              {openEmail.body}
            </div>
          </Block>
        </div>

        {/* Reply via DM */}
        {!openEmail.isMine && (
          <div className="mt-24">
            <Block label="Reply:" blockView>
              <div className="flex gap-8 items-center">
                <button
                  onClick={() => stores.goTo('dm', { userId: openEmail.senderId })}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  Open DM thread →
                </button>
                <span className="opacity-30">or type /email to {openEmail.senderName.split(' ')[0]} in Log</span>
              </div>
            </Block>
          </div>
        )}
      </div>
    )
  }

  // Inbox / Sent list
  return (
    <div className="max-w-[700px] px-4 sm:px-0 leading-[1.5rem]">
      {/* Header */}
      <div className="mb-24">
        <Block label="Mail:" blockView>
          <div className="flex gap-16 items-center">
            <button
              onClick={() => { setTab('inbox'); setOpenEmailId(null) }}
              className={cn(
                'transition-opacity',
                tab === 'inbox' ? 'opacity-100' : 'opacity-40 hover:opacity-60'
              )}
            >
              Inbox{unreadCount > 0 ? ` [${unreadCount}]` : ''}
            </button>
            <button
              onClick={() => { setTab('sent'); setOpenEmailId(null) }}
              className={cn(
                'transition-opacity',
                tab === 'sent' ? 'opacity-100' : 'opacity-40 hover:opacity-60'
              )}
            >
              Sent
            </button>
            <span className="opacity-20 ml-auto">
              /email to [name] [msg] in Log to compose
            </span>
          </div>
        </Block>
      </div>

      {/* Email list */}
      {currentList.length === 0 ? (
        <Block label={tab === 'inbox' ? 'Inbox:' : 'Sent:'} blockView>
          <div className="opacity-30 uppercase tracking-widest">
            {tab === 'inbox'
              ? 'No messages received. Cohort members can reach you here.'
              : 'No messages sent. Type /email to [name] [message] in Log.'}
          </div>
        </Block>
      ) : (
        <div className="flex flex-col gap-y-[1px]">
          {currentList.map((email) => (
            <div
              key={email.id}
              className={cn(
                'group cursor-pointer grid-fill-hover -mx-4 px-4 py-8 rounded',
                !email.isRead && tab === 'inbox' && 'font-medium'
              )}
              onClick={() => handleOpenEmail(email)}
            >
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'uppercase tracking-widest mb-4',
                    !email.isRead && tab === 'inbox' ? 'opacity-100' : 'opacity-60'
                  )}>
                    {tab === 'inbox'
                      ? email.senderName
                      : `→ ${email.recipientName}`
                    }
                  </div>
                  <div className="opacity-40 truncate">
                    {email.subject || email.body.slice(0, 60)}
                  </div>
                </div>
                <div className="opacity-30 whitespace-nowrap text-right shrink-0">
                  {dayjs(email.createdAt).format('M/D')}
                  {!email.isRead && tab === 'inbox' && (
                    <span className="ml-4 opacity-80">●</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compose hint */}
      <div className="mt-24 opacity-20 uppercase tracking-widest">
        LOT® Mail · /email to [name] [msg]
      </div>
    </div>
  )
}
