import * as React from 'react'
import { Button, GhostButton } from '#client/components/ui'
import { useSendEmail } from '#client/queries'

interface EmailComposeProps {
  to: string
  body: string
  onSent: (receiverName: string | null) => void
  onCancel: () => void
}

export const EmailCompose: React.FC<EmailComposeProps> = ({
  to,
  body,
  onSent,
  onCancel,
}) => {
  const [editTo, setEditTo] = React.useState(to)
  const [editBody, setEditBody] = React.useState(body)
  const [error, setError] = React.useState<string | null>(null)

  const { mutate: sendEmail, isLoading } = useSendEmail({
    onSuccess: (data) => {
      onSent(data?.receiverName ?? null)
    },
    onError: (err: any) => {
      setError(
        err?.response?.data?.message || err?.message || 'Send failed'
      )
    },
  })

  const handleSend = React.useCallback(() => {
    if (!editTo.trim() || !editBody.trim()) return
    setError(null)
    sendEmail({ to: editTo.trim(), body: editBody.trim() })
  }, [editTo, editBody, sendEmail])

  return (
    <div className="mt-8 border border-acc/20 p-12 rounded-sm bg-base">
      <div className="text-acc/40 text-xs uppercase tracking-widest mb-12">
        MAIL — COMPOSE
      </div>

      {/* TO: */}
      <div className="flex items-center gap-x-8 mb-8">
        <span className="text-acc/40 text-xs w-[40px] shrink-0">TO:</span>
        <input
          className="bg-transparent text-acc border-b border-acc/20 focus:border-acc/60 outline-none flex-1 py-1 text-sm"
          value={editTo}
          onChange={(e) => setEditTo(e.target.value)}
          placeholder="member name"
          autoFocus
        />
      </div>

      {/* BODY: */}
      <div className="mb-12">
        <span className="text-acc/40 text-xs block mb-4">BODY:</span>
        <textarea
          className="bg-transparent text-acc w-full outline-none text-sm resize-none leading-normal border-l border-acc/20 pl-8"
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          rows={5}
          placeholder="Your message..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-xs text-red-400 mb-8">
          ERROR: {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-x-12">
        <Button
          size="small"
          kind="secondary"
          onClick={handleSend}
          disabled={isLoading || !editTo.trim() || !editBody.trim()}
        >
          {isLoading ? 'Transmitting...' : 'Send'}
        </Button>
        <GhostButton onClick={onCancel}>Cancel</GhostButton>
      </div>
    </div>
  )
}
