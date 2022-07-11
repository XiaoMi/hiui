import PerfectScrollbar from 'perfect-scrollbar'

export interface ScrollbarRef {
  ps?: PerfectScrollbar
  container?: HTMLDivElement
}

export type ScrollbarAxes = 'both' | 'x' | 'y' | 'none'

export enum ScrollbarPsToEventMatch {
  /**
   * This event fires when the y-axis is scrolled in either direction
   */
  'ps-scroll-y' = 'onScrollY',
  /**
   * This event fires when the x-axis is scrolled in either direction.
   */
  'ps-scroll-x' = 'onScrollX',
  /**
   * This event fires when scrolling upwards.
   */
  'ps-scroll-up' = 'onScrollUp',
  /**
   * This event fires when scrolling downwards.
   */
  'ps-scroll-down' = 'onScrollDown',
  /**
   * This event fires when scrolling to the left.
   */
  'ps-scroll-left' = 'onScrollLeft',
  /**
   * This event fires when scrolling to the right.
   */
  'ps-scroll-right' = 'onScrollRight',
  /**
   * This event fires when scrolling reaches the start of the y-axis.
   */
  'ps-y-reach-start' = 'onYReachStart',
  /**
   * This event fires when scrolling reaches the end of the y-axis (useful for infinite scroll).
   */
  'ps-y-reach-end' = 'onYReachEnd',
  /**
   * This event fires when scrolling reaches the start of the x-axis.
   */
  'ps-x-reach-start' = 'onXReachStart',
  /**
   * This event fires when scrolling reaches the end of the x-axis.
   */
  'ps-x-reach-end' = 'onXReachEnd',
}

export const ScrollbarEventToPsMap = {} as any

Object.keys(ScrollbarPsToEventMatch).forEach(ps => {
  const event = (ScrollbarPsToEventMatch as any)[ps]
  ScrollbarEventToPsMap[event] = ps
})

export type ScrollbarEventProps = {
  [key in ScrollbarPsToEventMatch]?: (e: CustomEvent) => void
}

export type ScrollbarPosition =
  | '-moz-initial'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'unset'
  | '-webkit-sticky'
  | 'absolute'
  | 'fixed'
  | 'relative'
  | 'sticky'
