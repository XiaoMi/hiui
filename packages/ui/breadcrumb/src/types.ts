import React from 'react'

export interface BreadcrumbDataItem {
  /**
   * 面包屑的标题
   */
  title?: React.ReactNode
  /**
   * 设置按钮链接，设置后将用 a 标签渲染按钮
   */
  href?: string
  /**
   * 同 a 标签的 target 属性，仅在设置 href 后有效
   */
  target?: BreadcrumbDataItemTargetEnum
  /**
   * 自定义 icon，详见 `@hi-ui/icons`
   */
  icon?: React.ReactNode
}

export type BreadcrumbSizeEnum = 'sm' | 'md'

export type BreadcrumbDataItemTargetEnum = '_self' | '_blank' | '_parent' | '_top'
