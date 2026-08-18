/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// Two-tone alert signal for scheduled Calendar event notifications.
// Sharper and more urgent than the hourly Soviet chime — reserved for time-critical alerts.

let sharedAudioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return sharedAudioContext
}

export async function playAlertKlaxon() {
  const audioContext = getAudioContext()

  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume()
    } catch (e) {
      console.warn('Calendar alert: AudioContext resume failed', e)
      return
    }
  }

  const tones = [880, 660, 880]
  const toneDuration = 0.14
  const gap = 0.06

  tones.forEach((freq, i) => {
    const startTime = audioContext.currentTime + i * (toneDuration + gap)
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, startTime)

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + toneDuration)

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.start(startTime)
    osc.stop(startTime + toneDuration)
  })
}
