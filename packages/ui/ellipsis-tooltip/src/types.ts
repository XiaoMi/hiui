import { TooltipProps } from '@hi-ui/tooltip'

export interface EllipsisTooltipDataItem {
  /**
   * 超出行数显示省略号
   */
  numberOfLines?: number
  /**
   * 最大文字数量
   */
  maxTextCount?: number
  /**
   * tooltip 属性收敛
   */
  tooltipProps?: TooltipProps
}
