import React from 'react'
import { Block } from '#client/components/ui'
import { useStore } from '@nanostores/react'
import * as stores from '#client/stores'
import { useCosmicUpdate } from '#client/queries'

/**
 * Cosmic Update Widget — Together AI image generation token
 * Generates a sacred visual artifact via FLUX as a cosmic transmission.
 * Available to subscribed users (Usership / RnD / Legacy).
 */
export function CosmicUpdateWidget() {
  const me = useStore(stores.me)
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const cosmicUpdate = useCosmicUpdate()

  const hasAccess = me?.tags?.some(tag => {
    const t = tag.toLowerCase()
    return t === 'usership' || t === 'rnd' || t === 'legacy'
  })

  if (!hasAccess) return null

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      cosmicUpdate.mutate(
        {
          prompt:
            'Void black deep space, a single 15mm ceramic cube suspended in zero gravity, glowing acid yellow bioelectric field lines emanating outward, Orthodox cross faintly encoded in the geometry, Detroit techno grid overlay, minimal, sacred, cinematic',
        },
        {
          onSuccess: (data: any) => {
            setImageUrl(data.imageUrl)
            setLoading(false)
          },
          onError: () => {
            setError('Transmission interrupted. Try again.')
            setLoading(false)
          },
        }
      )
    } catch {
      setError('Transmission interrupted. Try again.')
      setLoading(false)
    }
  }

  return (
    <Block label="Cosmic Update:" blockView>
      <div>
        {!imageUrl && !loading && (
          <div>
            <div className="mb-8 opacity-30">
              Generate a sacred visual artifact — a quantum transmission from the void.
            </div>
            <div
              className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              onClick={handleGenerate}
            >
              Receive Transmission
            </div>
          </div>
        )}

        {loading && (
          <div className="opacity-30">
            Receiving cosmic transmission...
          </div>
        )}

        {error && (
          <div>
            <div className="mb-8 opacity-30">{error}</div>
            <div
              className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              onClick={handleGenerate}
            >
              Retry
            </div>
          </div>
        )}

        {imageUrl && !loading && (
          <div>
            <img
              src={imageUrl}
              alt="Cosmic Update — quantum transmission"
              className="w-full max-w-[512px]"
              style={{ imageRendering: 'auto' }}
            />
            <div className="mt-8 opacity-30">
              Cosmic Update received. A token from the void.
            </div>
            <div
              className="mt-8 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              onClick={handleGenerate}
            >
              New Transmission
            </div>
          </div>
        )}
      </div>
    </Block>
  )
}
