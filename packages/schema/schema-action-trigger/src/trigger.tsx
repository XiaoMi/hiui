import React from 'react'
import { Button } from '@hi-ui/button'
import { getBoolGetterValue } from '@hi-ui/schema-utils'
import type { ActionFnParams, ActionConfigType } from '@hi-ui/schema-core'

export type { ActionFnParams, ActionConfigType }

export type WithActionCtx<
  T,
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
> = T & {
  /** 数据 */
  data: TData
  /** 上下文 */
  ctx: TCtx
}

/** 【操作按钮】组件的配置选项类型 */
export type ActionTriggerProps<
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
> = WithActionCtx<ActionConfigType<TData, TCtx>, TData, TCtx>

export function ActionTrigger<
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
>(props: ActionTriggerProps<TData, TCtx>) {
  const { text, onClick, disabled, visible, type } = props

  const { data, ctx } = props

  // 检查按钮是否可见
  const isVisible = getBoolGetterValue(visible, true, [data, ctx])
  if (!isVisible) return null

  // 检查按钮是否禁用
  const isDisabled = getBoolGetterValue(disabled, false, [data, ctx])

  return (
    <Button
      key={text}
      icon={props.icon}
      appearance={props.appearance}
      disabled={isDisabled}
      type={type || 'primary'}
      onClick={() => onClick(data, ctx)}
    >
      {text}
    </Button>
  )
}
