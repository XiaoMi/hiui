import React from 'react'

import { HiBaseHTMLProps } from '@hi-ui/core'

export type CarouselArrowSize = 'large' | 'middle' | 'small'

export type CarouselDotType = 'line' | 'slider' | 'dot'
export type CarouselDotPosition = 'left' | 'right' | 'top' | 'bottom' | 'outer'

export interface CarouselProps extends HiBaseHTMLProps<'div'> {
  /**
   * 自动切换间隔(0代表不用自动切换)
   * @default 0
   */
  duration?: number
  /**
   * 是否展示分页指示器
   * @default true
   */
  showDots?: boolean
  /**
   * 是否展示箭头指示器
   * @default true
   */
  showArrows?: boolean
  /**
   * 默认激活索引(从0开始计算索引)
   * @default 0
   */
  defaultActive?: number
  /**
   * 是否展示页码指示器
   * @default false
   */
  showPages?: boolean
  /**
   * 箭头指示器尺寸
   * @default 'middle'
   */
  arrowSize?: CarouselArrowSize
  /**
   * 分页指示器类型
   * @default 'slider'
   */
  dotType?: CarouselDotType
  /**
   * 分页指示器位置
   * @default 'bottom'
   */
  dotPosition?: CarouselDotPosition
}
