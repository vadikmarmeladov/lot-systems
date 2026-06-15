/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useQueryClient } from 'react-query'
import { LotMailRecord, LotMailSyncEvent } from '#shared/types'
import { sync } from '../sync'
import { useLotMailInbox, useMarkLotMailRead } from '#client/queries'
import { Block } from '#client/components/ui'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'

export const MailWidget: React.FC = () => {
  const queryClient = useQueryClient()
  const { data: inbox = [] } = useLotMailInbox()
  const { mutate: markRead } = useMarkLotMailRead()
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const [localMails, setLocalMails] = React.useState<LotMailRecord[]>([])
  const hasInitialized = React.useRef(false)

  React.useEffect(() => {
    if (inbox.length && !hasInitialized.current) {
      setLocalMails(inbox)
      hasInitialized.current = true
    }
  }, [inbox])

  React.useEffect(() => {
    const { dispose } = sync.listen('lot_mail', (data: LotMailSyncEvent) => {
      const mail: LotMailRecord = {
        id: data.id,
        senderId: data.senderId,
        senderName: data.senderName,
        recipientId: data.recipientId,
        subject: data.subject,
        body: data.body,
        isRead: false,
        createdAt: data.createdAt,
        updatedAt: data.createdAt,
      }
      setLocalMails((prev) => {
        if (prev.some((m) => m.id === mail.id)) return prev
        return [mail, ...prev]
      })
    })
    return dispose
  }, [])

  const onExpand = React.useCallback(
    (id: string) => {
      setExpanded((prev) => (prev === id ? null : id))
      const mail = localMails.find((m) => m.id === id)
      if (mail && !mail.isRead) {
        markRead({ id }, {
          onSuccess: () => {
            setLocalMails((prev) =>
              prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
            )
            queryClient.invalidateQueries(['/api/lot-mail/inbox'])
          },
        })
      }
    },
    [localMails, markRead, queryClient]
  )

  const unread = localMails.filter((m) => !m.isRead).length

  if (localMails.length === 0) return null

  return (
    <div className="mb-40">
      <Block
        label={unread > 0 ? `MAIL [${unread} NEW]:` : 'MAIL:'}
        blockView
      >
        <div>
          {localMails.map((mail) => {
            const isOpen = expanded === mail.id
            const preview = mail.body.slice(0, 80) + (mail.body.length > 80 ? '…' : '')
            const date = dayjs(mail.createdAt)
            const timeLabel = date.fromNow()

            return (
              <div
                key={mail.id}
                className={cn(
                  'cursor-pointer -mx-4 px-4 py-2 rounded',
                  'grid-fill-hover',
                  !mail.isRead && 'font-medium'
                )}
                onClick={() => onExpand(mail.id)}
              >
                <div className="flex items-baseline gap-x-8">
                  <span className={cn('whitespace-nowrap', !mail.isRead ? 'opacity-100' : 'opacity-60')}>
                    {mail.senderName}
                  </span>
                  <span className="opacity-30 text-xs whitespace-nowrap">{timeLabel}</span>
                  {!mail.isRead && (
                    <span className="opacity-60 text-xs tracking-widest">NEW</span>
                  )}
                </div>

                {mail.subject && (
                  <div className="opacity-60 text-xs mt-1">{mail.subject}</div>
                )}

                {!isOpen && (
                  <div className="opacity-40 text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {preview}
                  </div>
                )}

                {isOpen && (
                  <div className="mt-4 opacity-80 whitespace-pre-wrap text-sm leading-relaxed">
                    {mail.body}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Block>
    </div>
  )
}
