/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { Button } from '#client/components/ui'
import { useComposeLotEmail } from '#client/queries'
import { cn } from '#client/utils'

export const EmailCompose: React.FC = () => {
  const target = useStore(stores.emailComposeTarget)

  const [to, setTo] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')
  const [sent, setSent] = React.useState(false)

  const { mutate: compose, isLoading } = useComposeLotEmail({
    onSuccess: () => {
      setSent(true)
      setTimeout(() => {
        stores.emailComposeTarget.set(null)
        setSent(false)
        setTo('')
        setSubject('')
        setBody('')
      }, 1400)
    },
  })

  React.useEffect(() => {
    if (target !== null) {
      setTo(target)
      setSent(false)
    }
  }, [target])

  const onClose = React.useCallback(() => {
    stores.emailComposeTarget.set(null)
    setSent(false)
    setTo('')
    setSubject('')
    setBody('')
  }, [])

  const onSend = React.useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault()
      if (!to.trim() || !body.trim()) return
      compose({
        recipientName: to.trim(),
        subject: subject.trim(),
        body: body.trim(),
      })
    },
    [to, subject, body, compose]
  )

  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent) => {
      if (ev.key === 'Escape') onClose()
    },
    [onClose]
  )

  if (target === null) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onKeyDown={onKeyDown}
    >
      <div
        className="relative w-full max-w-[520px] mx-16 border border-acc rounded bg-bac"
        style={{ boxShadow: '0 0 0 1px var(--acc-color)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-24 py-16 border-b border-acc/20">
          <span className="text-acc/60 text-sm uppercase tracking-wider select-none">
            LOT® Mail
          </span>
          <button
            className="text-acc/40 hover:text-acc transition-colors text-lg leading-none cursor-pointer"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>

        {sent ? (
          <div className="px-24 py-48 text-center">
            <div className="text-acc text-sm mb-8">Sent</div>
            <div className="text-acc/40 text-xs">Message delivered to {to}</div>
          </div>
        ) : (
          <form onSubmit={onSend} className="flex flex-col gap-y-0">
            {/* To */}
            <div className="flex items-center gap-x-16 px-24 py-14 border-b border-acc/10">
              <label className="text-acc/40 text-xs w-[48px] shrink-0 uppercase tracking-wider">
                To
              </label>
              <input
                autoFocus
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipient name"
                className={cn(
                  'flex-1 bg-transparent outline-none text-acc text-sm placeholder:text-acc/30',
                  'border-0 focus:ring-0'
                )}
              />
            </div>

            {/* Subject */}
            <div className="flex items-center gap-x-16 px-24 py-14 border-b border-acc/10">
              <label className="text-acc/40 text-xs w-[48px] shrink-0 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (optional)"
                className={cn(
                  'flex-1 bg-transparent outline-none text-acc text-sm placeholder:text-acc/30',
                  'border-0 focus:ring-0'
                )}
              />
            </div>

            {/* Body */}
            <div className="px-24 py-16">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message..."
                rows={6}
                maxLength={5000}
                className={cn(
                  'w-full bg-transparent outline-none text-acc text-sm placeholder:text-acc/30',
                  'resize-none border-0 focus:ring-0 leading-relaxed'
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-24 py-14 border-t border-acc/10">
              <span className="text-acc/20 text-xs select-none">
                {body.length > 0 ? `${body.length}/5000` : ''}
              </span>
              <Button
                type="submit"
                kind="secondary"
                size="small"
                disabled={!to.trim() || !body.trim() || isLoading}
              >
                {isLoading ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
