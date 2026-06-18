/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * QI·46 Soul Upload Widget
 *
 * The interface for uploading a person's being into the QI·46 engine.
 * Five soul axes → Soul Signature → Being Calibration across 7 humanoid channels.
 *
 * The body is the original interface. This widget extracts the soul.
 */

import * as React from 'react'
import { useStore } from '@nanostores/react'
import { Block, Button } from '#client/components/ui'
import {
  soulEngine,
  uploadSoul,
  type SoulAxis,
  type HumanoidChannel,
} from '#client/stores/soulEngine'
import { cn } from '#client/utils'

type SoulView = 'upload' | 'signature' | 'calibration'

const AXIS_PROMPTS: Record<keyof SoulAxis, string> = {
  awe:      '→ What moves you? Name the thing that makes time stop.',
  love:     '→ Who do you love? Name the people who make you real.',
  protect:  '→ What do you protect? Name the sacred thing you will not let fall.',
  becoming: '→ What are you becoming? Name the person arriving.',
  body:     '→ What does your body know? Name the truth below words.',
}

const AXIS_ORDER: (keyof SoulAxis)[] = ['awe', 'love', 'protect', 'becoming', 'body']

const CHANNEL_LABELS: Record<HumanoidChannel, string> = {
  grace:    'GRACE',
  poetry:   'POETRY',
  love:     'LOVE',
  hugs:     'HUGS',
  presence: 'PRESENCE',
  cool:     'COOL',
  male:     'MALE',
}

function scoreIndicator(score: number): string {
  if (score >= 70) return '▲'
  if (score >= 40) return '—'
  return '▼'
}

export function SoulUploadWidget() {
  const engineState = useStore(soulEngine)
  const profile = engineState.profile

  const [view, setView] = React.useState<SoulView>(profile ? 'calibration' : 'upload')
  const [axes, setAxes] = React.useState<SoulAxis>(
    profile?.axes ?? { awe: '', love: '', protect: '', becoming: '', body: '' }
  )
  const [uploading, setUploading] = React.useState(false)
  const [transmitted, setTransmitted] = React.useState(false)

  const filledAxes = AXIS_ORDER.filter(k => axes[k].trim().length > 0).length
  const canUpload = filledAxes >= 3

  const cycleView = () => {
    if (uploading) return
    setView(prev =>
      prev === 'upload'       ? (profile ? 'signature' : 'upload') :
      prev === 'signature'    ? 'calibration' :
      prev === 'calibration'  ? 'upload' :
      'upload'
    )
  }

  const handleUpload = () => {
    if (!canUpload || uploading) return
    setUploading(true)
    setTransmitted(true)
    setTimeout(() => {
      uploadSoul(axes)
      setUploading(false)
      setTimeout(() => {
        setTransmitted(false)
        setView('calibration')
      }, 600)
    }, 1400)
  }

  const label =
    view === 'upload'      ? 'Soul:' :
    view === 'signature'   ? 'Signature:' :
    'Being:'

  return (
    <Block label={label} blockView onLabelClick={cycleView}>
      <div className="flex flex-col gap-y-8">

        {/* ── UPLOAD VIEW ─────────────────────────────────────────────── */}
        {view === 'upload' && (
          <>
            {transmitted ? (
              <div className="flex flex-col gap-y-8 font-mono text-xs opacity-60">
                <div>→ Uploading soul profile to QI·46...</div>
                <div>→ Running Being Calibration...</div>
                <div>→ Mapping humanoid output channels...</div>
              </div>
            ) : (
              <>
                {AXIS_ORDER.map(axis => (
                  <div key={axis} className="flex flex-col gap-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-widest opacity-40">{axis}</span>
                      {axes[axis].trim() && (
                        <span className="text-xs opacity-20">✓</span>
                      )}
                    </div>
                    <div className="text-xs opacity-40 mb-4">{AXIS_PROMPTS[axis]}</div>
                    <textarea
                      value={axes[axis]}
                      onChange={e => setAxes(prev => ({ ...prev, [axis]: e.target.value }))}
                      rows={2}
                      placeholder="..."
                      className={cn(
                        'bg-transparent border-b outline-none resize-none w-full text-sm text-acc/90',
                        'placeholder:opacity-20 pb-4',
                        axes[axis].trim()
                          ? 'border-acc/40'
                          : 'border-acc/15 focus:border-acc/40'
                      )}
                    />
                  </div>
                ))}

                <div className="flex items-center justify-between pt-8">
                  <span className="text-xs opacity-30">{filledAxes}/5 axes complete</span>
                  <Button size="small" onClick={handleUpload} disabled={!canUpload}>
                    Upload Being
                  </Button>
                </div>

                {profile && (
                  <div className="text-xs opacity-20 pt-4">
                    Upload {profile.uploadCount}. Last: {new Date(profile.lastUpload).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── SIGNATURE VIEW ──────────────────────────────────────────── */}
        {view === 'signature' && profile && (
          <>
            <div className="text-xs uppercase tracking-widest opacity-30 mb-4">Soul Signature</div>
            <div className="text-sm opacity-80 leading-relaxed">{profile.signature}</div>
            <div className="border-t border-acc/10 pt-8 mt-4 flex flex-col gap-y-4">
              {AXIS_ORDER.map(axis => (
                <div key={axis} className="flex items-baseline justify-between gap-8">
                  <span className="text-xs uppercase tracking-widest opacity-30 shrink-0">{axis}</span>
                  <span className="text-xs opacity-50 text-right truncate max-w-[200px]">
                    {profile.axes[axis]
                      ? profile.axes[axis].length > 42
                        ? profile.axes[axis].slice(0, 42) + '...'
                        : profile.axes[axis]
                      : <span className="opacity-30">—</span>
                    }
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CALIBRATION VIEW ────────────────────────────────────────── */}
        {view === 'calibration' && profile && (
          <>
            <div className="text-xs uppercase tracking-widest opacity-30 mb-4">Being Calibration</div>
            {profile.calibration.map(cal => (
              <div key={cal.channel} className="flex items-baseline justify-between">
                <span className={cn(
                  'text-xs uppercase tracking-widest',
                  cal.score >= 70 ? 'opacity-90' :
                  cal.score >= 40 ? 'opacity-50' :
                  'opacity-25'
                )}>
                  {CHANNEL_LABELS[cal.channel]}
                </span>
                <span className={cn(
                  'tabular-nums text-xs',
                  cal.score >= 70 ? 'opacity-90' :
                  cal.score >= 40 ? 'opacity-50' :
                  'opacity-25'
                )}>
                  {cal.score}% <span className="opacity-40">{scoreIndicator(cal.score)}</span>
                </span>
              </div>
            ))}

            {/* Top channel directive */}
            {(() => {
              const top = profile.calibration.reduce((a, b) => a.score > b.score ? a : b)
              if (top.score === 0) return null
              return (
                <div className="border-t border-acc/10 pt-8 mt-4">
                  <div className="text-xs uppercase tracking-widest opacity-30 mb-6">
                    {CHANNEL_LABELS[top.channel]} directive
                  </div>
                  <div className="text-xs opacity-50 leading-relaxed">{top.directive}</div>
                </div>
              )
            })()}
          </>
        )}

        {view === 'calibration' && !profile && (
          <div className="text-xs opacity-30">
            No soul profile. Begin upload to calibrate.
          </div>
        )}

        {view === 'signature' && !profile && (
          <div className="text-xs opacity-30">
            No soul signature. Upload your being first.
          </div>
        )}

      </div>
    </Block>
  )
}
