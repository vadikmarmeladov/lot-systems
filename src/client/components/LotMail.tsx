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
import { Block } from '#client/components/ui'
import { useLotMailInbox, useSendLotMail } from '#client/queries'
import { sync } from '../sync'
import dayjs from '#client/utils/dayjs'
import { cn } from '#client/utils'
import type { LotMailMessage } from '#client/queries'

export const LotMail: React.FC = () => {
  const me = useStore(stores.me)
  const isTimeFormat12h = useStore(stores.isTimeFormat12h)
  const { data, refetch } = useLotMailInbox()
  const [messages, setMessages] = React.useState<LotMailMessage[]>([])
  const [composeMode, setComposeMode] = React.useState(false)
  const [composeTo, setComposeTo] = React.useState('')
  const [composeBody, setComposeBody] = React.useState('')
  const [sendResult, setSendResult] = React.useState<string | null>(null)

  const { mutate: sendMail, isLoading: isSending } = useSendLotMail({
    onSuccess: (res) => {
      setSendResult(`SENT → ${res.to.toUpperCase()}`)
      setComposeTo('')
      setComposeBody('')
      setComposeMode(false)
      refetch()
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || 'SEND FAILED'
      setSendResult(msg.toUpperCase())
    },
  })

  React.useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages)
    }
  }, [data])

  React.useEffect(() => {
    const { dispose } = sync.listen('lot_mail', (mail: any) => {
      if (mail.receiverId === me?.id) {
        setMessages(prev => [mail as LotMailMessage, ...prev])
      }
    })
    return dispose
  }, [me?.id])

  const timeFormat = isTimeFormat12h ? 'h:mm A (M/D/YY)' : 'HH:mm DD/MM/YY'

  const onSend = React.useCallback(() => {
    const to = composeTo.trim()
    const message = composeBody.trim()
    if (!to || !message) return
    setSendResult(null)
    sendMail({ to, message })
  }, [composeTo, composeBody, sendMail])

  const onKeyDownCompose = React.useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key === 'Enter' && !ev.shiftKey && !ev.metaKey) {
        ev.preventDefault()
        onSend()
      }
    },
    [onSend]
  )

  return (
    <div className="max-w-[700px]">
      <div className="flex items-center gap-x-16 mb-80">
        <span className="opacity-40 uppercase tracking-widest text-xs">LOT MAIL</span>
        <button
          className={cn(
            'text-acc/60 hover:text-acc transition-colors uppercase tracking-widest text-xs',
            composeMode && 'text-acc'
          )}
          onClick={() => { setComposeMode(v => !v); setSendResult(null) }}
        >
          {composeMode ? 'CANCEL' : 'COMPOSE'}
        </button>
      </div>

      {sendResult && (
        <div className="mb-16 opacity-60 uppercase tracking-widest text-xs">{sendResult}</div>
      )}

      {composeMode && (
        <div className="mb-32">
          <Block label="COMPOSE:" blockView>
            <div className="flex flex-col gap-y-8">
              <div className="flex items-baseline gap-x-8">
                <span className="opacity-40 uppercase tracking-widest text-xs w-[40px] shrink-0">TO</span>
                <input
                  type="text"
                  value={composeTo}
                  onChange={e => setComposeTo(e.target.value)}
                  placeholder="First name"
                  className="bg-transparent border-none outline-none flex-1 text-acc placeholder:opacity-30"
                  autoFocus
                />
              </div>
              <div className="flex items-start gap-x-8">
                <span className="opacity-40 uppercase tracking-widest text-xs w-[40px] shrink-0 mt-4">MSG</span>
                <textarea
                  value={composeBody}
                  onChange={e => setComposeBody(e.target.value)}
                  onKeyDown={onKeyDownCompose}
                  placeholder="Message..."
                  rows={3}
                  className="bg-transparent border-none outline-none flex-1 text-acc placeholder:opacity-30 resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={onSend}
                  disabled={isSending || !composeTo.trim() || !composeBody.trim()}
                  className="opacity-60 hover:opacity-100 uppercase tracking-widest text-xs disabled:opacity-20 transition-opacity"
                >
                  {isSending ? 'SENDING...' : 'SEND ✉️'}
                </button>
              </div>
            </div>
          </Block>
        </div>
      )}

      {messages.length === 0 && !composeMode && (
        <div className="opacity-20 uppercase tracking-widest text-xs">NO MAIL</div>
      )}

      <div className="flex flex-col gap-y-16">
        {messages.map(m => (
          <div key={m.id} className="group">
            <Block label="MAIL:" blockView>
              <div className="flex justify-between items-baseline mb-8">
                <span className="opacity-60 uppercase tracking-widest text-xs">FROM: {(m.senderName || '').toUpperCase()}</span>
                <span className="opacity-30 text-xs">{dayjs(m.createdAt).format(timeFormat)}</span>
              </div>
              <div className="whitespace-pre-wrap">{m.message}</div>
            </Block>
          </div>
        ))}
      </div>
    </div>
  )
}
