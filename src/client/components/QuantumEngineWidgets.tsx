import * as React from 'react'
import { Block, Button } from '#client/components/ui'
import { recordSignal } from '#client/stores/intentionEngine'
import { getEcosystemNarrative } from '#client/utils/narrative'

function usePersistedState(key: string): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [value, setValue] = React.useState(() => {
    try { return localStorage.getItem(key) === 'true' } catch { return false }
  })
  const setPersistedValue: React.Dispatch<React.SetStateAction<boolean>> = React.useCallback((action) => {
    setValue(prev => {
      const next = typeof action === 'function' ? action(prev) : action
      try { localStorage.setItem(key, String(next)) } catch {}
      return next
    })
  }, [key])
  return [value, setPersistedValue]
}

const TOTAL_DEVICES = 3

export const QuantumEngineWidgets: React.FC = () => {
  const [carConnected, setCarConnected] = usePersistedState('qe-car-connected')
  const [homeConnected, setHomeConnected] = usePersistedState('qe-home-connected')
  const [computerConnected, setComputerConnected] = usePersistedState('qe-computer-connected')

  const connectedCount = [carConnected, homeConnected, computerConnected].filter(Boolean).length
  const ecosystemNarrative = React.useMemo(
    () => getEcosystemNarrative(connectedCount, TOTAL_DEVICES),
    [connectedCount]
  )

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

  const handleComputerConnect = () => {
    setComputerConnected((prev) => {
      const next = !prev
      recordSignal('intentions', next ? 'computer_connected' : 'computer_disconnected', {
        timestamp: Date.now(),
      })
      return next
    })
  }

  // Record ecosystem coherence when all devices connected
  React.useEffect(() => {
    if (connectedCount === TOTAL_DEVICES) {
      recordSignal('intentions', 'ecosystem_full_coherence', {
        timestamp: Date.now(),
        devices: { car: carConnected, home: homeConnected, computer: computerConnected },
      })
    }
  }, [connectedCount])

  return (
    <>
      {/* Ecosystem status — visible when at least one device connected */}
      {connectedCount > 0 && (
        <Block label="Ecosystem:" blockView>
          <div className="flex flex-col gap-y-8">
            <div className="flex justify-between items-baseline">
              <span className="opacity-30">Nodes</span>
              <span className="tabular-nums">{connectedCount}/{TOTAL_DEVICES}</span>
            </div>
            <div className="opacity-30">{ecosystemNarrative}</div>
          </div>
        </Block>
      )}
      <Block label="Car:" containsSmallButton inProgress>
        <Button size="small" onClick={handleCarConnect}>
          {carConnected ? 'disconnect' : 'connect'}
        </Button>
      </Block>
      <Block label="Home:" containsSmallButton inProgress>
        <Button size="small" onClick={handleHomeConnect}>
          {homeConnected ? 'disconnect' : 'connect'}
        </Button>
      </Block>
      <Block label="Computer:" containsSmallButton inProgress>
        <Button size="small" onClick={handleComputerConnect}>
          {computerConnected ? 'disconnect' : 'connect'}
        </Button>
      </Block>
    </>
  )
}
