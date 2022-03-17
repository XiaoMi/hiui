import React from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'

export const DescriptionsItem: React.FC<DescriptionsItemProps> = ({ children }) =>
  children as React.ReactElement

export interface DescriptionsItemProps extends HiBaseHTMLProps<'div'> {
  /**
   * 	 包含列的数量
   */
  span?: number
  /**
   * 	 内容标题
   */
  label?: React.ReactNode
}
