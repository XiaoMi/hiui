import React from 'react'
import type { Row } from '@tanstack/react-table'
import { NOOP_SUBSCRIPTION, useSubscribe } from '@hi-ui/use-subscription'
import { Actions } from '@hi-ui/schema-action-trigger'
import type { ActionFnParams, ActionConfigType } from '@hi-ui/schema-core'
import type { ActionsProps } from '@hi-ui/schema-action-trigger'
import { useEditableSchemaTableCtx } from '../../ctx'
import { createEditButtons } from '../row-edit/actions'
import type { TableCtxRefType } from '../../table'

/** 按钮相关函数的参数类型 */
type OpFnParams<TData extends AnyObject> = ActionFnParams<TData, OpButtonRenderCtx<TData>>

/** 配置式按钮的配置选项类型 */
export type OpButtonConfigType<TData extends AnyObject = AnyObject> = ActionConfigType<
  TData,
  OpButtonRenderCtx<TData>
>

/** 自定义渲染按钮函数的上下文类型 */
export type OpButtonRenderCtx<TData extends AnyObject> = TableCtxRefType<TData> & {
  row: Row<TData>
  rowIndex: number
  /**
   * 行编辑相关
   * @desc 未开启行编辑时会有默认的空值
   */
  rowEdit: {
    /** 是否处于编辑状态 */
    isEditing: boolean
    /** 编辑按钮对象 */
    buttons: ReturnType<typeof createEditButtons>
  }
}

/** 【操作按钮组】组件的配置选项类型 */
export type OpButtonsProps<TData extends AnyObject = AnyObject> = {
  /** 行实例 */
  row: Row<TData>
  /** 操作按钮配置 */
  buttons?: ActionsProps<TData, OpButtonRenderCtx<TData>>['actions']
  /** 自定义渲染函数 */
  render?: (...args: OpFnParams<TData>) => React.ReactElement[]
  /** 是否启用行编辑 */
  rowEdit?: boolean
  /** 最大显示数量，超出后显示更多按钮 */
  maxCount?: ActionsProps['maxCount']
}

/** 【操作按钮组】组件 */
export function OpButtons<TData extends AnyObject = AnyObject>(props: OpButtonsProps<TData>) {
  const { subscription, rowActions, ...restCxt } = useEditableSchemaTableCtx<TData>()
  const { row, rowEdit } = props

  // 订阅行编辑状态
  useSubscribe(rowActions.editingSubscription || NOOP_SUBSCRIPTION, [row.index.toString()])
  const rowData = subscription.getValue()[row.index]
  const isEditing = rowActions.isRowEditing(row.index)

  // 获取编辑按钮 - 现在在组件内部调用，符合Hook规则
  const editButtons = rowEdit ? createEditButtons(rowActions, row.index) : null

  // 扩展ctx，添加行编辑相关功能
  const ctx: OpButtonRenderCtx<TData> = {
    ...restCxt.exposeCtxValueRef.current(),
    row,
    rowIndex: row.index,
    rowEdit: {
      isEditing: false,
      buttons: { edit: <></>, save: <></>, cancel: <></> },
    },
  }
  // 如果启用了行编辑，添加行编辑相关上下文
  if (rowEdit && editButtons) {
    ctx.rowEdit = { isEditing, buttons: editButtons }
  }

  // 优先使用自定义渲染
  if (props.render) {
    return <>{props.render(rowData, ctx)}</>
  }

  // 默认渲染逻辑
  if (rowEdit && editButtons) {
    // 如果行处于编辑状态，显示保存和取消按钮
    if (isEditing) {
      return (
        <>
          {editButtons.save}
          {editButtons.cancel}
        </>
      )
    }
    // 否则显示编辑按钮
    else {
      return <>{editButtons?.edit}</>
    }
  }

  // 否则显示普通操作按钮
  if (!props.buttons?.length) {
    // 如果没有按钮，则不显示任何内容
    return null
  }

  return <Actions actions={props.buttons} data={rowData} ctx={ctx} maxCount={props.maxCount} />
}
