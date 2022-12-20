import React from 'react'

export interface EllipsisTooltipDataItem {
  /**
   * 子文本，待处理文本内容
   */
  children: React.ReactText
  /**
   * 超出行数显示省略号
   */
  numberOfLines?: number
  /**
   * 最大文字数量
   */
  maxTextCount?: number
}
