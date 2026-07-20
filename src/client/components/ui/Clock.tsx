/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

import React from 'react'
import dayjs from '#client/utils/dayjs'
import { useActiveViewport } from '#client/hooks/useInViewport'

type Props = {
  format: string
  interval?: number
}

export const Clock: React.FC<Props> = ({ format, interval }) => {
  const [state, setState] = React.useState(dayjs().format(format))
  const loop = React.useRef<number>()
  const containerRef = React.useRef<HTMLSpanElement>(null)
  // Clock is used at cadences from 60s down to 100ms (TimeWidget's stopwatch
  // display). Every caller sits on a permanently-mounted tab (display:none
  // when inactive) or can scroll off-screen on these long single-page tabs,
  // so gate the tick on viewport visibility — pauses off-tab AND off-screen,
  // resumes (and catches up immediately) the instant it's visible again.
  const active = useActiveViewport(containerRef)
  React.useEffect(() => {
    if (loop.current) {
      clearInterval(loop.current)
      loop.current = undefined
    }
    if (interval && active) {
      setState(dayjs().format(format))
      // @ts-ignore
      loop.current = setInterval(
        () => setState(dayjs().format(format)),
        interval
      )
    }
    return () => {
      if (loop.current) {
        clearInterval(loop.current)
      }
    }
  }, [format, interval, active])
  return <span ref={containerRef}>{state}</span>
}
