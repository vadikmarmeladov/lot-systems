/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { Button, GhostButton, ResizibleGhostInput } from '#client/components/ui'
import { useSendLotEmail } from '#client/queries'
import { cn } from '#client/utils'

interface Props {
  initialRecipient: string
  onClose: () => void
  onSent?: (recipientName: string | null) => void
}

export const LotEmailCompose: React.FC<Props> = ({ initialRecipient, onClose, onSent }) => {
  const [to, setTo] = React.useState(initialRecipient)
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = React.useState('')
  const bodyContainerRef = React.useRef<HTMLDivElement>(null)

  const { mutate: sendEmail } = useSendLotEmail({
    onSuccess: (res) => {
      setStatus('sent')
      onSent?.(res.recipientName)
      setTimeout(onClose, 1400)
    },
    onError: (err: any) => {
      setStatus('error')
      setErrorMsg(err?.response?.data?.error || 'Failed to send')
    },
  })

  React.useEffect(() => {
    bodyContainerRef.current?.querySelector('textarea')?.focus()
  }, [])

  const onSubmit = React.useCallback(
    (ev?: React.FormEvent) => {
      ev?.preventDefault()
      if (!to.trim() || !body.trim() || status === 'sending') return
      setStatus('sending')
      setErrorMsg('')
      sendEmail({ toHandle: to.trim(), subject: subject.trim() || undefined, body: body.trim() })
    },
    [to, subject, body, status, sendEmail]
  )

  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault()
        onSubmit()
      }
      if (ev.key === 'Escape') {
        onClose()
      }
    },
    [onSubmit, onClose]
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={cn(
          'bg-base border border-acc/20 rounded w-full max-w-lg mx-4 p-6',
          'shadow-2xl'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-acc/60 text-sm tracking-widest uppercase select-none">
            LOT® Mail
          </span>
          <GhostButton onClick={onClose} className="text-acc/40 hover:text-acc/80">
            ×
          </GhostButton>
        </div>

        {status === 'sent' ? (
          <div className="text-acc/60 py-8 text-center">
            Sent.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
            {/* To */}
            <div className="flex items-baseline gap-x-3 border-b border-acc/10 pb-3">
              <span className="text-acc/40 text-sm w-14 shrink-0 select-none">To</span>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Name"
                className={cn(
                  'flex-1 bg-transparent outline-none text-acc placeholder:text-acc/30',
                  'text-sm'
                )}
                autoComplete="off"
              />
            </div>

            {/* Subject */}
            <div className="flex items-baseline gap-x-3 border-b border-acc/10 pb-3">
              <span className="text-acc/40 text-sm w-14 shrink-0 select-none">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value.slice(0, 200))}
                placeholder="Optional"
                className={cn(
                  'flex-1 bg-transparent outline-none text-acc placeholder:text-acc/30',
                  'text-sm'
                )}
                autoComplete="off"
              />
            </div>

            {/* Body */}
            <div ref={bodyContainerRef}>
              <ResizibleGhostInput
                direction="vh"
                value={body}
                onChange={(v) => setBody(v.slice(0, 5000))}
                onKeyDown={onKeyDown}
                placeholder="Write your message..."
                containerClassName="min-h-[120px]"
                className="text-sm leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div className="text-red-400/80 text-sm">{errorMsg}</div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-acc/30 text-xs select-none">
                ⌘↵ to send
              </span>
              <div className="flex gap-x-3">
                <GhostButton type="button" onClick={onClose} className="text-acc/40">
                  Cancel
                </GhostButton>
                <Button
                  type="submit"
                  kind="secondary"
                  size="small"
                  disabled={!to.trim() || !body.trim() || status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
