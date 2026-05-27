/**
 * LOT® Mail Widget
 *
 * Surfaces incoming LOT Mails in the Sync tab.
 * Messages are composed in the Log via:  /email to Hitomi. Message body.
 *
 * Design: minimalist LOT® style — label / value layout, no modals,
 * expand-in-place on click, real-time via SSE.
 */
import * as React from 'react'
import { useStore } from '@nanostores/react'
import { useQueryClient } from 'react-query'
import * as stores from '#client/stores'
import { Block } from '#client/components/ui'
import { cn } from '#client/utils'
import dayjs from '#client/utils/dayjs'
import {
  useLotMailInbox,
  useMarkLotMailRead,
  LotMailRecord,
} from '#client/queries'
import { sync } from '../sync'

const MAX_PREVIEW = 80

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

interface LotMailItemProps {
  mail: LotMailRecord
  onMarkRead: (id: string) => void
}

const LotMailItem: React.FC<LotMailItemProps> = ({ mail, onMarkRead }) => {
  const [expanded, setExpanded] = React.useState(false)
  const theme = useStore(stores.theme)

  const toggle = () => {
    setExpanded(v => !v)
    if (!mail.isRead) onMarkRead(mail.id)
  }

  const unreadDot = !mail.isRead && (
    <span
      className="inline-block w-[6px] h-[6px] rounded-full bg-acc mr-8 flex-shrink-0 mt-[7px]"
      title="Unread"
    />
  )

  return (
    <div
      className={cn(
        'mb-12 cursor-pointer',
        'transition-opacity',
        mail.isRead && 'opacity-60'
      )}
      onClick={toggle}
    >
      <div className="flex items-start gap-x-4">
        {!mail.isRead
          ? unreadDot
          : <span className="inline-block w-[6px] h-[6px] mr-8 flex-shrink-0" />
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-x-12 flex-wrap">
            <span className="font-medium leading-tight">{mail.senderName}</span>
            <span className="text-acc/40 text-sm leading-tight tabular-nums">
              {dayjs(mail.createdAt).format('MMM D, HH:mm')}
            </span>
          </div>
          <div className="mt-2 leading-snug break-words">
            {expanded ? mail.message : truncate(mail.message, MAX_PREVIEW)}
          </div>
        </div>
      </div>
    </div>
  )
}

interface LotMailWidgetProps {
  // Optionally pre-seed with a just-received real-time mail
  newMail?: LotMailRecord | null
}

export const LotMailWidget: React.FC<LotMailWidgetProps> = ({ newMail }) => {
  const me = useStore(stores.me)
  const queryClient = useQueryClient()

  const { data: fetchedMails = [] } = useLotMailInbox()
  const { mutate: markRead } = useMarkLotMailRead()

  const [mails, setMails] = React.useState<LotMailRecord[]>([])
  const hasLoaded = React.useRef(false)

  // Load from API once
  React.useEffect(() => {
    if (fetchedMails.length && !hasLoaded.current) {
      setMails(fetchedMails)
      hasLoaded.current = true
    } else if (!hasLoaded.current && fetchedMails !== undefined) {
      // Empty inbox — still mark as loaded
      setMails([])
      hasLoaded.current = true
    }
  }, [fetchedMails])

  // Merge in a freshly-received SSE mail (passed from parent)
  React.useEffect(() => {
    if (!newMail) return
    setMails(prev => {
      if (prev.some(m => m.id === newMail.id)) return prev
      return [newMail, ...prev]
    })
  }, [newMail])

  const handleMarkRead = React.useCallback((mailId: string) => {
    setMails(prev =>
      prev.map(m => m.id === mailId ? { ...m, isRead: true } : m)
    )
    markRead(
      { mailId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['/api/lot-mail'])
        },
      }
    )
  }, [markRead, queryClient])

  const unreadCount = mails.filter(m => !m.isRead).length

  if (mails.length === 0) return null

  return (
    <Block
      label="lot mail"
      blockView
      containsButton={false}
      labelClassName="opacity-60"
    >
      <div>
        {unreadCount > 0 && (
          <div className="text-acc/50 text-sm mb-12">
            {unreadCount} unread
          </div>
        )}
        {mails.map(mail => (
          <LotMailItem
            key={mail.id}
            mail={mail}
            onMarkRead={handleMarkRead}
          />
        ))}
      </div>
    </Block>
  )
}
