import React from 'react'

import { ValueOf } from '@hi-ui/core'

export interface CheckboxDataItem extends Record<string, any> {
  /**
   * 选项唯一标识 id
   */
  id: React.ReactText
  /**
   * 选项显示内容
   */
  title?: React.ReactNode
  /**
   * 是否禁用该选项
   */
  disabled?: boolean
}

export const CheckboxPlacementEnum = {
  VERTICAL: 'vertical',
  horizontal: 'horizontal',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type CheckboxPlacementEnum = ValueOf<typeof CheckboxPlacementEnum>
