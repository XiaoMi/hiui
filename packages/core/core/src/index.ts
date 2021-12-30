import React, { ReactText } from 'react'

export declare type HiBaseHTMLProps<T extends React.ElementType = any, P = {}> = Omit<
  React.ComponentPropsWithoutRef<T>,
  // 剔除组件内使用的关键字属性，不允许继承（原生自带）
  'defaultValue' | 'onChange' | 'value' | 'onSelect' | 'title' | 'size' | 'prefix' | keyof P
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
   * 表单控件组件输入是否无效
   */
  invalid?: boolean
}

export declare type ValueOf<T> = T[keyof T]
