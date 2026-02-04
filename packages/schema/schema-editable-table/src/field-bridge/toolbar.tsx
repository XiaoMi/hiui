import React from 'react'
import { useSchemaFormCtx } from '@hi-ui/schema-form'
import { TableToolbar } from '@hi-ui/action-trigger'
import { NOOP_SUBSCRIPTION } from '@hi-ui/use-subscription'
import { useSubscribeTickState } from '@hi-ui/schema-hooks'
import { getGetterValue } from '@hi-ui/schema-utils'
import type {
  ActionConfigType,
  TableToolbarCtxType,
  TableToolbarProps,
} from '@hi-ui/action-trigger'

export type FormEditTableToolbarCtxType = TableToolbarCtxType & {
  readonly?: boolean
}

type ToolbarProps = Omit<TableToolbarProps, 'className'> & {
  ctx: FormEditTableToolbarCtxType
}

export function Toolbar(props: ToolbarProps) {
  const { tableCtxRef } = props.ctx

  // 此处用来触发工具栏按钮的更新
  // 严格比较时，使用 tickState 订阅，否则使用 NOOP_SUBSCRIPTION
  const { propsRef, tickState } = useSchemaFormCtx()
  const subscription = propsRef.current.strictValueCompare ? tickState : NOOP_SUBSCRIPTION
  useSubscribeTickState(subscription)

  const dftRight: ActionConfigType[] = props.ctx.readonly
    ? []
    : [
        {
          text: '增行',
          onClick: () => {
            tableCtxRef.current?.rowActions.addRow({})
          },
        },
      ]

  const { right: getRight } = props
  const right = getGetterValue(getRight, dftRight, [props.ctx])

  return (
    <TableToolbar
      ctx={props.ctx}
      left={props.left}
      right={right}
      className="pro-edit-table__toolbar"
    />
  )
}
