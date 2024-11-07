import type PerfectScrollbar from 'perfect-scrollbar'

export type ScrollbarInstance = PerfectScrollbar

export interface ScrollbarHelpers {
  /**
   * 三方库[perfect-scrollbar](https://perfectscrollbar.com/) 实例对象
   */
  instance?: ScrollbarInstance
  /**
   * 容器dom实例
   */
  container?: HTMLDivElement
  /**
   * 更新滚动条
   */
  update?: () => void
}

export type ScrollbarAxesEnum = 'both' | 'x' | 'y' | 'none'

export type ScrollbarEventProps = {
  /**
   * y轴滚动
   */
  onScrollY?: (e: Event) => void
  /**
   * x轴滚动
   */
  onScrollX?: (e: Event) => void
  /**
   * 向上滚动
   */
  onScrollUp?: (e: Event) => void
  /**
   * 向下滚动
   */
  onScrollDown?: (e: Event) => void
  /**
   * 向左滚动
   */
  onScrollLeft?: (e: Event) => void
  /**
   * 向右滚动
   */
  onScrollRight?: (e: Event) => void
  /**
   * y轴抵达最开始
   */
  onYReachStart?: (e: Event) => void
  /**
   * y轴抵达最后
   */
  onYReachEnd?: (e: Event) => void
  /**
   * x轴抵达最开始
   */
  onXReachStart?: (e: Event) => void
  /**
   * x轴抵达最后
   */
  onXReachEnd?: (e: Event) => void
}

export type ScrollbarPositionEnum =
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

/**
 * 更多配置请参考：https://github.com/mdbootstrap/perfect-scrollbar/blob/main/types/perfect-scrollbar.d.ts
 */
export type Settings = PerfectScrollbar.Options & {
  /**
   * 开启横向滚动条吸底
   */
  scrollbarXStickToBottom?: boolean
  /**
   * 横向滚动条吸底间隙
   */
  scrollbarXStickToBottomGap?: number
}
