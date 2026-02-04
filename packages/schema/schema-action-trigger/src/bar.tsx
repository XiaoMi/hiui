import React from 'react'
import { cx } from '@hi-ui/classname'
import { Actions } from './actions'
import { actionBarClsPrefix as clsPrefix, actionBarCls as cls } from './_utils'
import type { ActionsProps } from './actions'
import type { WithActionCtx } from './trigger'
import './index.scss'

export type ActionsBarProps<
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
> = WithActionCtx<
  {
    left?: ActionsProps<TData, TCtx>['actions']
    right?: ActionsProps<TData, TCtx>['actions']
    className?: string
    leftClassName?: string
    rightClassName?: string
  },
  TData,
  TCtx
>

export function ActionsBar<
  // ActionsBar
  TData extends AnyObject = AnyObject,
  TCtx extends AnyObject = AnyObject
>(props: ActionsBarProps<TData, TCtx>) {
  const { data, ctx } = props

  return (
    <div className={cx(clsPrefix, props.className)}>
      <div className={cls('left')}>
        {props.left ? (
          <Actions actions={props.left} className={props.leftClassName} data={data} ctx={ctx} />
        ) : null}
      </div>
      <div className={cls('right')}>
        {props.right ? (
          <Actions actions={props.right} className={props.rightClassName} data={data} ctx={ctx} />
        ) : null}
      </div>
    </div>
  )
}
