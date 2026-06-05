/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { Button, GhostButton, ResizibleGhostInput } from '#client/components/ui'
import { useSendEmail, useSearchUsers } from '#client/queries'
import { MAX_EMAIL_SUBJECT_LENGTH, MAX_EMAIL_BODY_LENGTH } from '#shared/constants'
import { cn } from '#client/utils'

interface Props {
  recipientName: string
  onClose: () => void
  onSent: () => void
}

export const EmailComposePanel: React.FC<Props> = ({ recipientName, onClose, onSent }) => {
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')
  const [resolvedId, setResolvedId] = React.useState<string | null>(null)
  const [resolvedName, setResolvedName] = React.useState<string>('')
  const [lookupError, setLookupError] = React.useState<string | null>(null)
  const subjectRef = React.useRef<HTMLInputElement>(null)

  const { mutate: searchUsers, isLoading: isSearching } = useSearchUsers({
    onSuccess: (data: any) => {
      if (data?.users?.length) {
        setResolvedId(data.users[0].id)
        setResolvedName(`${data.users[0].firstName || ''} ${data.users[0].lastName || ''}`.trim())
        setLookupError(null)
      } else {
        setLookupError(`No user found named "${recipientName}"`)
      }
    },
    onError: () => {
      setLookupError('Could not reach server')
    },
  })

  const { mutate: sendEmail, isLoading: isSending } = useSendEmail({
    onSuccess: () => {
      onSent()
    },
  })

  React.useEffect(() => {
    if (recipientName) {
      searchUsers({ query: recipientName })
    }
  }, [recipientName])

  React.useEffect(() => {
    subjectRef.current?.focus()
  }, [])

  const canSend = !!resolvedId && !!body.trim() && !isSending

  const onSubmit = React.useCallback(
    (ev?: React.FormEvent) => {
      ev?.preventDefault()
      if (!canSend || !resolvedId) return
      sendEmail({
        receiverId: resolvedId,
        subject: subject.trim().slice(0, MAX_EMAIL_SUBJECT_LENGTH),
        body: body.trim().slice(0, MAX_EMAIL_BODY_LENGTH),
      })
    },
    [canSend, resolvedId, subject, body, sendEmail]
  )

  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent) => {
      if (ev.key === 'Escape') onClose()
    },
    [onClose]
  )

  return (
    <form
      className="mt-16 border-t border-acc/20 pt-16"
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
    >
      <div className="text-acc/40 text-sm mb-8 uppercase tracking-widest">
        LOT® Mail
      </div>

      <div className="flex items-baseline gap-x-8 mb-8">
        <span className="text-acc/40 whitespace-nowrap select-none">TO:</span>
        <span className={cn(lookupError ? 'text-red-400/60' : '')}>
          {isSearching ? (
            <span className="text-acc/30 animate-pulse">{recipientName}</span>
          ) : lookupError ? (
            <span className="text-acc/40">{lookupError}</span>
          ) : (
            <span>{resolvedName || recipientName}</span>
          )}
        </span>
      </div>

      <div className="flex items-baseline gap-x-8 mb-8">
        <span className="text-acc/40 whitespace-nowrap select-none">RE:</span>
        <input
          ref={subjectRef}
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value.slice(0, MAX_EMAIL_SUBJECT_LENGTH))}
          placeholder="Subject"
          className="bg-transparent border-none outline-none flex-1 placeholder:text-acc/20 leading-normal"
          maxLength={MAX_EMAIL_SUBJECT_LENGTH}
        />
      </div>

      <div className="flex items-start gap-x-8 mb-16">
        <span className="text-acc/40 whitespace-nowrap select-none pt-[2px]">MSG:</span>
        <ResizibleGhostInput
          direction="vh"
          value={body}
          onChange={(v) => setBody(v.length <= MAX_EMAIL_BODY_LENGTH ? v : v.slice(0, MAX_EMAIL_BODY_LENGTH))}
          placeholder="Write your message..."
          containerClassName="flex-1 leading-normal"
          className="leading-normal"
        />
      </div>

      <div className="flex items-center gap-x-8">
        <Button
          type="submit"
          kind="secondary"
          size="small"
          disabled={!canSend}
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
        <GhostButton onClick={onClose} className="text-acc/40">
          Cancel
        </GhostButton>
        {body.length > MAX_EMAIL_BODY_LENGTH * 0.9 && (
          <span className="text-acc/30 text-sm tabular-nums ml-auto">
            {body.length}/{MAX_EMAIL_BODY_LENGTH}
          </span>
        )}
      </div>
    </form>
  )
}
