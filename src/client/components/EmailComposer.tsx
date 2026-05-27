/**
 * LOT® Email Composer
 *
 * Triggered by typing `/email to [Name]` in Log.
 * Appears as an inline panel below the log entry.
 * Sent messages appear in Sync for the community.
 *
 * Integration points:
 *  - Log: trigger detection via logTriggers.ts
 *  - Sync: SSE email_message event
 *  - Cohort Dating: isCohortMessage flag + cohort match suggestions
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { atom } from 'nanostores'
import { cn } from '#client/utils'
import { Button, ResizibleGhostInput } from '#client/components/ui'
import { useCreateEmail } from '#client/queries'
import { MAX_EMAIL_BODY_LENGTH } from '#shared/constants'
import * as stores from '#client/stores'

// ── Global compose state ────────────────────────────────────────────────────
// Set to a recipient name to open the composer; null to close.
export const emailComposeStore = atom<{
  recipient: string
  receiverUserId?: string
  isCohortMessage?: boolean
} | null>(null)

export function openEmailCompose(
  recipient: string,
  receiverUserId?: string,
  isCohortMessage?: boolean
) {
  emailComposeStore.set({ recipient, receiverUserId, isCohortMessage })
}

export function closeEmailCompose() {
  emailComposeStore.set(null)
}

// ── Component ────────────────────────────────────────────────────────────────

interface EmailComposerProps {
  /** Called after successful send */
  onSent?: () => void
  /** Called when user dismisses the composer */
  onClose?: () => void
}

export const EmailComposer: React.FC<EmailComposerProps> = ({ onSent, onClose }) => {
  const compose = useStore(emailComposeStore)
  const me = useStore(stores.me)
  const isTouchDevice = useStore(stores.isTouchDevice)
  const formRef = React.useRef<HTMLFormElement>(null)

  const [body, setBody] = React.useState('')
  const [recipient, setRecipient] = React.useState('')
  const [sent, setSent] = React.useState(false)

  const { mutate: createEmail, isLoading } = useCreateEmail({
    onSuccess: () => {
      setSent(true)
      setTimeout(() => {
        setSent(false)
        setBody('')
        closeEmailCompose()
        onSent?.()
      }, 2200)
    },
    onError: () => {
      // silently fail — the composer stays open
    },
  })

  // Sync recipient from store whenever compose target changes
  React.useEffect(() => {
    if (!compose) return
    setRecipient(compose.recipient)
    setSent(false)
    setBody('')
    // Focus body textarea after mount
    setTimeout(() => {
      formRef.current?.querySelector('textarea')?.focus()
    }, 80)
  }, [compose?.recipient])

  const onChangeBody = React.useCallback((value: string) => {
    setBody(
      value.length <= MAX_EMAIL_BODY_LENGTH
        ? value
        : value.slice(0, MAX_EMAIL_BODY_LENGTH)
    )
  }, [])

  const onSubmit = React.useCallback(
    (ev?: React.FormEvent) => {
      ev?.preventDefault()
      if (!body.trim() || !recipient.trim() || isLoading || sent) return
      createEmail({
        receiverName: recipient.trim(),
        body: body.trim(),
        receiverUserId: compose?.receiverUserId,
        isCohortMessage: compose?.isCohortMessage ?? false,
      })
    },
    [body, recipient, isLoading, sent, compose]
  )

  const onKeyDown = React.useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key === 'Enter') {
        if (isTouchDevice) return
        if (!ev.metaKey && !ev.shiftKey) {
          onSubmit()
          ev.preventDefault()
        }
      }
      if (ev.key === 'Escape') {
        closeEmailCompose()
        onClose?.()
      }
    },
    [onSubmit, onClose, isTouchDevice]
  )

  const onDismiss = React.useCallback(() => {
    closeEmailCompose()
    onClose?.()
  }, [onClose])

  if (!compose) return null

  return (
    <div
      className={cn(
        'border-t border-acc/10 mt-24 pt-24',
        'transition-opacity duration-300',
        sent ? 'opacity-40' : 'opacity-100'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-x-8 mb-16 select-none">
        <span className="text-acc/40 text-xs tracking-widest uppercase">MSG:</span>
        <span className="text-acc/60 text-xs">
          {me?.firstName} → {recipient}
        </span>
        {compose.isCohortMessage && (
          <span className="text-acc/30 text-xs tracking-widest uppercase ml-4">
            ◈ cohort
          </span>
        )}
        <button
          onClick={onDismiss}
          className="ml-auto text-acc/20 hover:text-acc/60 transition-colors text-xs leading-normal"
          type="button"
        >
          esc
        </button>
      </div>

      {sent ? (
        // Confirmation state
        <div className="text-acc/40 text-sm tracking-widest uppercase py-8">
          ✓ transmitted
        </div>
      ) : (
        <form onSubmit={onSubmit} ref={formRef}>
          <div className="flex items-start gap-x-8">
            <div className="text-acc/20 select-none text-sm pt-1 leading-normal shrink-0">
              &gt;
            </div>
            <ResizibleGhostInput
              direction="v"
              value={body}
              onChange={onChangeBody}
              onKeyDown={onKeyDown}
              placeholder="Write your message..."
              containerClassName="flex-1 leading-normal"
              className="leading-normal opacity-100"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between mt-16">
            <span className="text-acc/20 text-xs select-none tabular-nums">
              {body.length}/{MAX_EMAIL_BODY_LENGTH}
            </span>
            <Button
              type="submit"
              kind="secondary"
              size="small"
              disabled={!body.trim() || isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

// ── Inline trigger label (shown inside NoteEditor when /email to X is typed) ─

export const EmailTriggerLabel: React.FC<{ recipient: string }> = ({
  recipient,
}) => (
  <div className="text-acc/30 text-xs mt-4 select-none tracking-widest uppercase">
    ✉ to {recipient} — press Enter to compose
  </div>
)
