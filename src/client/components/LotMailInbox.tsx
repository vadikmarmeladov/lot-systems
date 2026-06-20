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
import { Clock } from '#client/components/ui'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'
import { useLotMailInbox, useMarkMailRead, LotMailRecord } from '#client/queries'
import { sync } from '../sync'

export const LotMailInbox: React.FC = () => {
  const me = useStore(stores.me)
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const queryClient = useQueryClient()
  const [mails, setMails] = React.useState<LotMailRecord[]>([])
  const hasLoaded = React.useRef(false)

  const { data: fetchedMails } = useLotMailInbox()
  const { mutate: markRead } = useMarkMailRead({
    onSuccess: (_, vars) => {
      setMails((prev) =>
        prev.map((m) => (m.id === vars.id ? { ...m, isRead: true } : m))
      )
    },
  })

  React.useEffect(() => {
    if (fetchedMails && !hasLoaded.current) {
      setMails(fetchedMails)
      hasLoaded.current = true
    }
  }, [fetchedMails])

  React.useEffect(() => {
    return () => {
      hasLoaded.current = false
    }
  }, [])

  // Listen for incoming mail via SSE
  React.useEffect(() => {
    const { dispose } = sync.listen('lot_mail', (data: any) => {
      if (data.receiverId !== me?.id) return
      setMails((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev
        return [data, ...prev]
      })
      queryClient.invalidateQueries(['/api/lot-mail/inbox'])
    })
    return dispose
  }, [me?.id])

  const unreadCount = mails.filter((m) => !m.isRead).length

  if (mails.length === 0) return null

  return (
    <div className="mb-80">
      <div className="opacity-30 mb-16 text-xs uppercase tracking-widest">
        Mail{unreadCount > 0 ? ` · ${unreadCount} new` : ''}
      </div>
      <div>
        {mails.map((mail) => {
          const date = dayjs(mail.createdAt)
          const timeFormat = isTimeFormat12h ? 'hh:mm A' : 'HH:mm'
          const isPast = dayjs().diff(date, 'day') >= 1

          return (
            <div
              key={mail.id}
              className={cn(
                'group flex items-start gap-x-8 -mx-4 px-4 py-2 rounded cursor-pointer grid-fill-hover',
                mail.isRead ? 'opacity-30' : 'opacity-100'
              )}
              onClick={() => {
                if (!mail.isRead) markRead({ id: mail.id })
              }}
            >
              <span className="whitespace-nowrap pr-4 shrink-0">{mail.senderName}</span>
              <div
                className="flex-1 min-w-0"
                style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              >
                {mail.body}
              </div>
              <div className="text-acc/0 transition-opacity select-none pointer-events-none whitespace-nowrap group-hover:text-acc/40 shrink-0">
                {date.format(timeFormat)}{isPast ? `, ${date.fromNow()}` : ''}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
