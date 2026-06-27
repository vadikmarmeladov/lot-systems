/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { cn } from '#client/utils'
import { useLotMailUserSearch, useSendLotMail } from '#client/queries'

interface Props {
  toName: string
}

export const LotMailComposer: React.FC<Props> = ({ toName }) => {
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')
  const [sent, setSent] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<{
    id: string
    firstName: string | null
    lastName: string | null
  } | null>(null)

  const { data: searchData } = useLotMailUserSearch(toName)
  const users = searchData?.users ?? []

  // useSendLotMail is a hook factory — call it to get mutate
  const { mutate: sendMail, isLoading } = useSendLotMail()

  React.useEffect(() => {
    if (users.length === 1 && !selectedUser) {
      setSelectedUser(users[0])
    } else if (users.length > 1 && !selectedUser) {
      const match = users.find(
        (u) => (u.firstName || '').toLowerCase() === toName.toLowerCase()
      )
      if (match) setSelectedUser(match)
    }
  }, [users, toName, selectedUser])

  const recipientDisplay = selectedUser
    ? [selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(' ')
    : toName

  const onSend = React.useCallback(() => {
    if (!selectedUser || !body.trim() || isLoading || sent) return
    sendMail(
      { receiverId: selectedUser.id, subject: subject.trim() || undefined, body: body.trim() },
      { onSuccess: () => setSent(true) }
    )
  }, [selectedUser, subject, body, isLoading, sent, sendMail])

  if (sent) {
    return (
      <div className="mt-8 font-mono text-sm opacity-60 uppercase tracking-widest">
        ✉ SENT → {recipientDisplay.toUpperCase()}
      </div>
    )
  }

  return (
    <div className="mt-8 border-t border-current border-opacity-20 pt-8">
      <div className="font-mono text-xs opacity-40 uppercase tracking-widest mb-4">
        LOT® MAIL
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-8 items-baseline">
          <span className="font-mono text-xs opacity-40 uppercase tracking-widest w-16 shrink-0">
            TO
          </span>
          {!selectedUser && users.length === 0 && (
            <span className="opacity-40 text-sm">Searching {toName}...</span>
          )}
          {!selectedUser && users.length > 1 && (
            <div className="flex flex-col gap-y-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  className="text-left opacity-60 hover:opacity-100 text-sm"
                  onClick={() => setSelectedUser(u)}
                >
                  {[u.firstName, u.lastName].filter(Boolean).join(' ')}
                </button>
              ))}
            </div>
          )}
          {selectedUser && (
            <span className="text-sm opacity-80 uppercase tracking-widest">
              {recipientDisplay}
            </span>
          )}
        </div>

        <div className="flex gap-x-8 items-baseline">
          <span className="font-mono text-xs opacity-40 uppercase tracking-widest w-16 shrink-0">
            SUBJ
          </span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Optional subject"
            maxLength={255}
            className={cn(
              'bg-transparent border-none outline-none text-sm opacity-60',
              'placeholder:opacity-30 flex-1'
            )}
          />
        </div>

        <div className="flex gap-x-8 items-start">
          <span className="font-mono text-xs opacity-40 uppercase tracking-widest w-16 shrink-0 pt-1">
            MSG
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 5000))}
            placeholder="Write your message..."
            rows={4}
            className={cn(
              'bg-transparent border-none outline-none text-sm opacity-60 flex-1 resize-none',
              'placeholder:opacity-30'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onSend()
              }
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="font-mono text-xs opacity-20">
            {body.length}/5000 · Cmd+Enter to send
          </span>
          <button
            onClick={onSend}
            disabled={!selectedUser || !body.trim() || isLoading}
            className={cn(
              'font-mono text-xs uppercase tracking-widest',
              'opacity-60 hover:opacity-100 disabled:opacity-20',
              'transition-opacity'
            )}
          >
            {isLoading ? 'SENDING...' : 'SEND ✉'}
          </button>
        </div>
      </div>
    </div>
  )
}
