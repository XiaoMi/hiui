import React from 'react'
import type { ButtonProps } from '@hi-ui/button'

/** 按钮相关函数的参数类型 */
export type ActionFnParams<
  // 数据类型
  TData extends AnyObject = AnyObject,
  // 上下文类型
  Ctx extends AnyObject = AnyObject
> = [data: TData, ctx: Ctx]

/** 配置式按钮的配置选项类型 */
export type ActionConfigType<
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
> = {
  /** 按钮文本 */
  text: string
  /** 按钮类型 */
  type?: ButtonProps['type']
  /** 按钮外观 */
  appearance?: ButtonProps['appearance']
  /** 按钮图标 */
  icon?: React.ReactNode
  /** 点击事件 */
  onClick: (...args: ActionFnParams<TData, TCtx>) => void
  /** 是否禁用 */
  disabled?: BoolGetter<(...args: ActionFnParams<TData, TCtx>) => boolean>
  /** 是否显示 */
  visible?: BoolGetter<(...args: ActionFnParams<TData, TCtx>) => boolean>
}
