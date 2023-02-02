import React from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { DescriptionsLabelPlacementEnum } from './types'

export const DescriptionsItem: React.FC<DescriptionsItemProps> = ({ children }) =>
  children as React.ReactElement

export interface DescriptionsItemProps extends HiBaseHTMLProps<'div'> {
  /**
   * 包含列的数量
   */
  colSpan?: number
  /**
   * @deprecated 请使用 colSpan 替代
   */
  span?: number
  /**
   * 包含行的数量 @private
   */
  rowSpan?: number
  /**
   * 内容标题
   */
  label?: React.ReactNode
  /**
   * label宽度
   */
  labelWidth?: React.ReactText
  /**
   * label 对齐方式
   */
  labelPlacement?: DescriptionsLabelPlacementEnum
  /**
   * 每一项的内容
   */
  value?: React.ReactNode
}
