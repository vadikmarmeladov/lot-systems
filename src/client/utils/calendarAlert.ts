/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Calendar alert klaxon
 *
 * A short two-tone signal (descending fifth, square wave) played when a
 * scheduled Calendar entry's time arrives — reads as a terse console
 * alarm, not a jingle. Lazy AudioContext, same pattern as sovietKeyboard.ts:
 * created on first use, resumed if the browser suspended it.
 */

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx || ctx.state === 'closed') {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    return ctx
  } catch {
    return null
  }
}

function vol(v: number) { return Math.max(0.001, Math.min(v, 0.14)) }

export function playCalendarAlertKlaxon() {
  const ac = getCtx()
  if (!ac) return
  const t = ac.currentTime
  const notes = [880, 659] // A5 -> E5, descending fifth — terse, not melodic
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = 'square'
    const start = t + i * 0.14
    osc.frequency.setValueAtTime(freq, start)
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(vol(0.1), start + 0.008)
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.12)
    osc.connect(g).connect(ac.destination)
    osc.start(start)
    osc.stop(start + 0.13)
  })
}
