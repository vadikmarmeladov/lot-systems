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
import { useLotMailInbox, useMarkLotMailRead, useUnreadLotMailCount } from '#client/queries'
import { sync } from '../sync'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import { LotMailNotification } from '#shared/types'

export const LotMail: React.FC = () => {
  const me = useStore(stores.me)
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const queryClient = useQueryClient()

  const { data: inbox = [], isLoading } = useLotMailInbox()
  const { data: unreadData } = useUnreadLotMailCount()
  const { mutate: markRead } = useMarkLotMailRead({
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/lot-mail/inbox'])
      queryClient.invalidateQueries(['/api/lot-mail/unread-count'])
    },
  })

  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const dateFormat = isTimeFormat12h ? 'h:mm A (M/D/YY)' : 'HH:mm[Z] DD/MM/YY'

  React.useEffect(() => {
    const { dispose } = sync.listen('lot_mail', (data: LotMailNotification) => {
      queryClient.invalidateQueries(['/api/lot-mail/inbox'])
      queryClient.invalidateQueries(['/api/lot-mail/unread-count'])
    })
    return dispose
  }, [])

  const onOpen = (id: string, readAt: string | null) => {
    setSelectedId(selectedId === id ? null : id)
    if (!readAt) markRead({ id })
  }

  const selected = inbox.find((m) => m.id === selectedId)

  if (isLoading) {
    return (
      <div className="px-4 sm:px-0 opacity-40 uppercase tracking-widest">
        Loading...
      </div>
    )
  }

  return (
    <div className="max-w-[700px] px-4 sm:px-0">
      <div className="mb-16 opacity-60 uppercase tracking-widest text-sm">
        Inbox{unreadData?.count ? ` · ${unreadData.count} unread` : ''}
      </div>

      {inbox.length === 0 && (
        <div className="opacity-30 uppercase tracking-widest">
          No mail. Use /email to Hitomi in Log to send a message.
        </div>
      )}

      <div className="flex flex-col gap-y-8">
        {inbox.map((mail) => {
          const isOpen = selectedId === mail.id
          const isUnread = !mail.readAt

          return (
            <div key={mail.id}>
              <div
                className={cn(
                  'cursor-pointer grid-fill-hover -mx-4 px-4 py-2 rounded',
                  isUnread && 'opacity-100',
                  !isUnread && 'opacity-60'
                )}
                onClick={() => onOpen(mail.id, mail.readAt)}
              >
                <div className="flex items-baseline justify-between gap-x-8">
                  <span className="uppercase tracking-widest">
                    {mail.senderName || 'Unknown'}
                    {isUnread && <span className="ml-8 opacity-60">·</span>}
                  </span>
                  <span className="opacity-40 text-sm whitespace-nowrap">
                    {dayjs(mail.createdAt).format(dateFormat)}
                  </span>
                </div>
                {!isOpen && (
                  <div className="opacity-40 mt-2 truncate">
                    {mail.body.slice(0, 80)}
                  </div>
                )}
              </div>

              {isOpen && (
                <Block label="MAIL:" blockView>
                  <div className="mb-8 uppercase tracking-widest opacity-60">
                    FROM: {mail.senderName || 'Unknown'}
                  </div>
                  <div className="opacity-90 whitespace-pre-wrap leading-relaxed">
                    {mail.body}
                  </div>
                  <div className="mt-16 opacity-30 text-sm">
                    {dayjs(mail.createdAt).format(dateFormat)}
                  </div>
                </Block>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-24 opacity-30 uppercase tracking-widest text-sm">
        To send: /email to [name] [message] in Log
      </div>
    </div>
  )
}
