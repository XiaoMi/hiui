import * as React from 'react'
import Button from '@hi-ui/button'
import Tooltip from '@hi-ui/tooltip'
import { PlusOutlined, CloseCircleFilled } from '@hi-ui/icons'
import type { FormListChildrenAction } from '@hi-ui/form'
import { Actions, type ActionsProps } from '@hi-ui/action-trigger'
import { getGetterValue } from '@hi-ui/schema-utils'
import { cls } from '../_utils'
import type { FormListConfigType } from './list'

type ListFieldActionsType<TCtx extends AnyObject> = ActionsProps<AnyArray, TCtx>['actions']

export type ListActionCtxType = {
  /** 字段值 */
  fieldValue: unknown[]
  /** FormList 组件的内部操作按钮 */
  innerActions: FormListChildrenAction
  /** 单个数据项的默认值 */
  itemDftValue?: unknown
  /** 嵌套层级 */
  nestLevel: number
}

type BuiltinListActionType = {
  addEl: React.ReactElement
}

export type CustomListActionRenderType = (
  ctx: ListActionCtxType &
    AnyObject & {
      builtin: BuiltinListActionType
    }
) => ListFieldActionsType<ListActionCtxType>

type ListActionsProps = {
  title: string
  config: FormListConfigType
  values: unknown[]
  ctx: ListActionCtxType
}

export function ListActions(props: ListActionsProps) {
  const { config, values, ctx } = props
  const { listActions: getActions } = config

  const addEl = (
    <Button
      key="add"
      type="primary"
      appearance="link"
      icon={<PlusOutlined size={16} />}
      onClick={() => {
        // 如果列表为空，则先添加一个默认值
        if (values.length === 0) ctx.innerActions.add(ctx.itemDftValue)
        ctx.innerActions.add(ctx.itemDftValue)
      }}
    >
      添加{props.title}
    </Button>
  )

  const dftActions = [addEl]
  const builtin = { addEl }
  const actions = getGetterValue(getActions, dftActions, [{ ...ctx, builtin }])
  return (
    <Actions
      className={cls('list-field__field-actions')}
      actions={actions}
      data={values}
      ctx={ctx}
    />
  )
}

export type ListItemActionCtxType = ListActionCtxType & {
  /** 触发元素的索引 */
  index: number
  /** 触发元素的值 */
  itemValue: unknown
}

type BuiltinListItemActionType = {
  addEl: React.ReactElement
  removeEl: React.ReactElement
}

export type CustomListItemActionRenderType = (
  ctx: ListItemActionCtxType &
    AnyObject & {
      builtin: BuiltinListItemActionType
    }
) => ListFieldActionsType<ListItemActionCtxType>

type ItemActionsProps = {
  config: FormListConfigType
  values: unknown[]
  ctx: ListItemActionCtxType
}

export function ItemActions(props: ItemActionsProps) {
  const { config, values, ctx } = props
  const { itemActions: getActions, itemActionDirection } = config

  const addEl = (
    <Tooltip title="添加" key="add">
      <Button
        icon={<PlusOutlined size={16} />}
        onClick={() => {
          // 如果列表为空，则先添加一个默认值
          if (values.length === 0) ctx.innerActions.add(ctx.itemDftValue)
          ctx.innerActions.add(ctx.itemDftValue)
        }}
      />
    </Tooltip>
  )

  const removeEl = (
    <Tooltip title="删除" key="remove">
      <Button
        icon={<CloseCircleFilled size={16} />}
        onClick={() => {
          ctx.innerActions.remove(ctx.index)
        }}
      />
    </Tooltip>
  )

  const dftActions = ctx.index === 0 ? [addEl] : [removeEl]
  const builtin = { addEl, removeEl }
  const actions = getGetterValue(getActions, dftActions, [{ ...ctx, builtin }])
  return (
    <Actions
      className={cls('list-field__item-actions')}
      direction={itemActionDirection || 'column'}
      actions={actions}
      data={values}
      ctx={ctx}
    />
  )
}
