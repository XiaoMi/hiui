import * as React from 'react'

export interface DescriptionsItemProps {
  /**
   * 	 包含列的数量
   */
  span?: number
  /**
   * 	 内容标题
   */
  label?: React.ReactNode
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export const DescriptionsItem: React.FC<DescriptionsItemProps> = ({ children }) =>
  // eslint-disable-next-line no-undef
  children as JSX.Element
