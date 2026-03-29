import React from 'react'
import { Block } from '#client/components/ui'
import { recordSignal } from '#client/stores/intentionEngine'

/**
 * QuantumRandomWidget - Real-time quantum-random number generator.
 * Generates a random number on a random countdown interval.
 * Each cycle picks a new number (0-99) and a new countdown (1-72s).
 */

function quantumRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const COUNTDOWN_OPTIONS = [1, 2, 3, 5, 7, 10, 15, 20, 30, 45, 60, 72]

function pickCountdown(): number {
  return COUNTDOWN_OPTIONS[quantumRandom(0, COUNTDOWN_OPTIONS.length - 1)]
}

export function QuantumRandomWidget() {
  const [number, setNumber] = React.useState(() => quantumRandom(0, 99))
  const [countdown, setCountdown] = React.useState(() => pickCountdown())
  const [remaining, setRemaining] = React.useState(countdown)

  React.useEffect(() => {
    const iv = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          const next = quantumRandom(0, 99)
          const nextCountdown = pickCountdown()
          setNumber(next)
          setCountdown(nextCountdown)
          recordSignal('calculator', 'quantum_random', { value: next, interval: nextCountdown })
          return nextCountdown
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(iv)
  }, [])

  return (
    <Block label="Number:">
      {number} <span className="opacity-30">({remaining}s)</span>
    </Block>
  )
}
