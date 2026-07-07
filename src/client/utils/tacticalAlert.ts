/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

// Tactical alert tone — three sharp square-wave beeps.
// Distinct cadence from the Soviet chime: used for calendar reminder briefings.

let sharedAudioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return sharedAudioContext
}

export async function playTacticalAlert() {
  const audioContext = getAudioContext()

  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume()
    } catch (e) {
      return
    }
  }

  const beep = (startTime: number) => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(880, startTime)

    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.09, startTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12)

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.start(startTime)
    osc.stop(startTime + 0.13)
  }

  const now = audioContext.currentTime
  beep(now)
  beep(now + 0.18)
  beep(now + 0.36)
}
