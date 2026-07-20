/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import { useStore } from '@nanostores/react'
import { Block, Button, Textarea } from '#client/components/ui'
import { useAskLotAI } from '#client/queries'
import * as stores from '#client/stores'
import { UserTag } from '#shared/types'

/**
 * LOT® AI — standalone AI engine, surfaced throughout the platform.
 * Free: general, non-personalized self-care voice.
 * Usership ($99/month): personalized voice, calibrated on the subscriber's own LOT® history.
 * The provider behind the engine is never named — LOT® owns the surface.
 */
export function LotAIWidget() {
  const me = useStore(stores.me)
  const [prompt, setPrompt] = React.useState('')
  const { mutate, data, isLoading, error } = useAskLotAI()

  if (!me) return null

  const hasUsership = me.tags.some(
    (tag) => tag.toLowerCase() === UserTag.Usership.toLowerCase()
  )

  const handleAsk = () => {
    if (!prompt.trim() || isLoading) return
    mutate({ prompt: prompt.trim() })
  }

  return (
    <Block label="LOT® AI:" blockView>
      <div>
        <div className="mb-8">
          {hasUsership
            ? 'Personalized — calibrated on your LOT® history.'
            : 'General self-care guidance. Subscribe to Usership ($99/month) for personalization.'}
        </div>

        <div className="mb-8">
          <Textarea
            value={prompt}
            onChange={setPrompt}
            placeholder="What does your body need right now?"
            rows={2}
          />
        </div>

        <div className="mb-8">
          <Button onClick={handleAsk} disabled={isLoading || !prompt.trim()}>
            {isLoading ? 'Calibrating...' : 'Ask'}
          </Button>
        </div>

        {error && (
          <div className="opacity-30">LOT® AI is recalibrating. Try again in a moment.</div>
        )}

        {data && (
          <div className="whitespace-pre-wrap">{data.response}</div>
        )}
      </div>
    </Block>
  )
}
