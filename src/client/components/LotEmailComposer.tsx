/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import * as React from 'react'
import { Button, ResizibleGhostInput } from '#client/components/ui'
import { useSearchLotEmailUsers, useSendLotEmail, LotEmailUser } from '#client/queries'
import { cn } from '#client/utils'

interface LotEmailComposerProps {
  initialRecipientName?: string
  initialRecipient?: LotEmailUser | null
  cohortContext?: Record<string, any>
  onClose: () => void
  onSent?: () => void
}

export const LotEmailComposer: React.FC<LotEmailComposerProps> = ({
  initialRecipientName = '',
  initialRecipient = null,
  cohortContext,
  onClose,
  onSent,
}) => {
  const [recipientQuery, setRecipientQuery] = React.useState(
    initialRecipient
      ? `${initialRecipient.firstName || ''} ${initialRecipient.lastName || ''}`.trim()
      : initialRecipientName
  )
  const [selectedRecipient, setSelectedRecipient] = React.useState<LotEmailUser | null>(initialRecipient)
  const [subject, setSubject] = React.useState('')
  const [body, setBody] = React.useState('')
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const bodyRef = React.useRef<HTMLTextAreaElement>(null)

  const searchQ = selectedRecipient ? '' : recipientQuery
  const { data: searchResults = [] } = useSearchLotEmailUsers(searchQ)

  const { mutate: sendEmail, isLoading } = useSendLotEmail({
    onSuccess: () => {
      setSent(true)
      onSent?.()
      setTimeout(onClose, 1800)
    },
  })

  React.useEffect(() => {
    if (!selectedRecipient && searchResults.length > 0 && recipientQuery.length >= 2) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [searchResults, recipientQuery, selectedRecipient])

  // Auto-focus body when recipient is pre-selected
  React.useEffect(() => {
    if (initialRecipient) {
      setTimeout(() => bodyRef.current?.focus(), 100)
    }
  }, [])

  const handleSelectRecipient = (user: LotEmailUser) => {
    setSelectedRecipient(user)
    setRecipientQuery(`${user.firstName || ''} ${user.lastName || ''}`.trim())
    setShowDropdown(false)
    setTimeout(() => bodyRef.current?.focus(), 50)
  }

  const handleClearRecipient = () => {
    setSelectedRecipient(null)
    setRecipientQuery('')
  }

  const handleSend = () => {
    if (!selectedRecipient || !body.trim()) return
    sendEmail({
      receiverId: selectedRecipient.id,
      subject: subject.trim() || undefined,
      body: body.trim(),
      cohortContext,
    })
  }

  const recipientName = selectedRecipient
    ? `${selectedRecipient.firstName || ''} ${selectedRecipient.lastName || ''}`.trim()
    : null

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
        <div className="max-w-[500px] w-full mx-4 p-24 font-mono">
          <div className="opacity-60 uppercase tracking-widest mb-8">LOT® MAIL</div>
          <div className="mb-4">SENT →</div>
          <div className="opacity-40">{recipientName}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
      <div
        className="max-w-[560px] w-full mx-4 p-24 bg-bg border border-acc/10 font-mono relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-24">
          <div className="opacity-60 uppercase tracking-widest text-xs">LOT® MAIL</div>
          <button
            className="opacity-30 hover:opacity-80 transition-opacity text-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* To field */}
        <div className="mb-16 relative">
          <div className="opacity-30 text-xs uppercase tracking-widest mb-4">TO:</div>
          {selectedRecipient ? (
            <div className="flex items-center gap-8">
              <span>{recipientName}</span>
              {selectedRecipient.city && (
                <span className="opacity-30 text-xs">{selectedRecipient.city}</span>
              )}
              <button
                className="opacity-30 hover:opacity-80 transition-opacity ml-8"
                onClick={handleClearRecipient}
              >
                ×
              </button>
            </div>
          ) : (
            <input
              autoFocus
              className={cn(
                'w-full bg-transparent border-none outline-none font-mono',
                'placeholder:opacity-30'
              )}
              placeholder="Name..."
              value={recipientQuery}
              onChange={(e) => setRecipientQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose()
              }}
            />
          )}

          {/* Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-bg border border-acc/10 z-10">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="px-8 py-6 cursor-pointer hover:opacity-60 transition-opacity flex items-center justify-between"
                  onClick={() => handleSelectRecipient(user)}
                >
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  {user.city && (
                    <span className="opacity-30 text-xs">{user.city}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subject field */}
        <div className="mb-16">
          <div className="opacity-30 text-xs uppercase tracking-widest mb-4">RE:</div>
          <input
            className="w-full bg-transparent border-none outline-none font-mono placeholder:opacity-30"
            placeholder="Subject (optional)"
            value={subject}
            maxLength={500}
            onChange={(e) => setSubject(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-acc/10 mb-16" />

        {/* Body */}
        <div className="mb-24">
          <textarea
            ref={bodyRef}
            className={cn(
              'w-full bg-transparent border-none outline-none font-mono resize-none',
              'placeholder:opacity-30 min-h-[120px]'
            )}
            placeholder="Message..."
            value={body}
            maxLength={5000}
            rows={6}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend()
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="opacity-20 text-xs">
            {cohortContext ? 'via Cohort Dating' : 'LOT® Community'}
          </div>
          <div className="flex gap-8">
            <Button
              kind="secondary"
              size="small"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="small"
              disabled={!selectedRecipient || !body.trim() || isLoading}
              onClick={handleSend}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
