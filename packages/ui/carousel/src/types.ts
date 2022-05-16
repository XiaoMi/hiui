import { HiBaseHTMLProps } from '@hi-ui/core'

export type CarouselArrowSizeEnum = 'lg' | 'md' | 'sm'

export type CarouselDotTypeEnum = 'line' | 'slider' | 'dot'
export type CarouselDotPlacementEnum = 'left' | 'right' | 'top' | 'bottom' | 'outer'

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
   * @default 'md'
   */
  arrowSize?: CarouselArrowSizeEnum
  /**
   * 分页指示器类型
   * @default 'slider'
   */
  dotType?: CarouselDotTypeEnum
  /**
   * 分页指示器位置
   * @default 'bottom'
   */
  dotPlacement?: CarouselDotPlacementEnum
}
