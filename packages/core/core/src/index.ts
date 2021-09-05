import React, { ReactText } from 'react'

export declare type HiBaseHTMLProps<T extends React.ElementType = any, P = any> = Omit<
  React.ComponentPropsWithoutRef<T>,
  keyof P
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
