/**
 * MailWidget — unread LOT® Email counter on the System dashboard.
 *
 * Stays invisible when inbox is empty. Shows ✉ MAIL [N] when there are
 * unread messages; clicking navigates directly to Sync.
 */
import * as React from 'react'
import * as stores from '#client/stores'
import { useEmailInbox } from '#client/queries'
import { sync } from '../sync'
import { LotEmailMessage } from '#shared/types'

export const MailWidget: React.FC = () => {
  const { data: inbox = [] } = useEmailInbox()
  const [unread, setUnread] = React.useState(0)

  // Sync unread count from query data
  React.useEffect(() => {
    setUnread(inbox.filter((e) => !e.readAt).length)
  }, [inbox])

  // Increment on live SSE delivery
  React.useEffect(() => {
    const { dispose } = sync.listen('lot_email', (_data: LotEmailMessage) => {
      setUnread((n) => n + 1)
    })
    return () => dispose()
  }, [])

  if (unread === 0) return null

  return (
    <div
      className="cursor-pointer select-none"
      onClick={() => stores.goTo('sync')}
      title="Open Mail in Sync"
    >
      <span className="text-acc/60 text-xs uppercase tracking-widest hover:text-acc transition-colors">
        ✉ MAIL [{unread}]
      </span>
    </div>
  )
}
