import React from 'react'

export declare type ValueOf<T> = T[keyof T]
export declare type Dict<T = any> = Record<string, T>

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

export declare interface HiBaseDataItem extends Dict {}

export declare type HiBaseHTMLFieldProps<
  T extends React.ElementType = any,
  P = {}
> = HiBaseHTMLProps<T, P> & {
  /**
   * 开启表单控件组件输入无效态
   */
  invalid?: boolean
}

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

// 将 core 设为 peer，保证环境一致性：插件依赖和用户使用 provider 引用宿主环境统一安装的npm包
export { useLocaleContext, LocaleProvider } from '@hi-ui/locale-context'
export type { UseLocaleContext, LocaleProviderProps } from '@hi-ui/locale-context'
