import * as React from 'react'
import { Block, Button } from '#client/components/ui'
import { recordSignal } from '#client/stores/intentionEngine'

export const QuantumEngineWidgets: React.FC = () => {
  const [carConnected, setCarConnected] = React.useState(false)
  const [homeConnected, setHomeConnected] = React.useState(false)

  const handleCarConnect = () => {
    setCarConnected((prev) => {
      const next = !prev
      recordSignal('intentions', next ? 'car_connected' : 'car_disconnected', {
        timestamp: Date.now(),
      })
      return next
    })
  }

  const handleHomeConnect = () => {
    setHomeConnected((prev) => {
      const next = !prev
      recordSignal('intentions', next ? 'home_connected' : 'home_disconnected', {
        timestamp: Date.now(),
      })
      return next
    })
  }

  return (
    <>
      <Block label="Car:" containsSmallButton>
        <Button size="small" onClick={handleCarConnect}>
          {carConnected ? 'disconnect' : 'connect'}
        </Button>
      </Block>
      <Block label="Home:" containsSmallButton>
        <Button size="small" onClick={handleHomeConnect}>
          {homeConnected ? 'disconnect' : 'connect'}
        </Button>
      </Block>
    </>
  )
}
