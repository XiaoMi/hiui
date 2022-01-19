import React, { ReactText } from 'react'

export declare type HiBaseHTMLProps<T extends React.ElementType = any, P = {}> = Omit<
  React.ComponentPropsWithoutRef<T>,
  // 剔除组件内使用的关键字属性，不允许继承（原生自带）
  | 'type'
  | 'defaultValue'
  | 'onChange'
  | 'value'
  | 'onSelect'
  | 'title'
  | 'size'
  | 'prefix'
  | keyof P
> & {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
} & P

export declare type HiBaseDataItem = {
  id: ReactText
  title: React.ReactNode
}

export declare type HiBaseData = HiBaseDataItem[]

export declare type HiBaseHTMLFieldProps<
  T extends React.ElementType = any,
  P = {}
> = HiBaseHTMLProps<T, P> & {
  /**
   * 开启表单控件组件输入无效态
   */
  invalid?: boolean
}

export declare type ValueOf<T> = T[keyof T]

/**
 * 设置模型数据读取映射
 */
export type HiBaseFieldNames = {
  id?: string
  title?: string
  disabled?: string
  children?: string
}

export type HiBaseFieldNameKeys = keyof HiBaseFieldNames

export const HiBaseAppearanceEnum = {
  LINE: 'line',
  FILLED: 'filled',
  UNSET: 'unset',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type HiBaseAppearanceEnum = ValueOf<typeof HiBaseAppearanceEnum>

export const HiBaseSizeEnum = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type HiBaseSizeEnum = ValueOf<typeof HiBaseSizeEnum>
