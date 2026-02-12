import React from 'react'
import { cx } from '@hi-ui/classname'
import { getGetterValue } from '@hi-ui/schema-utils'
import type { SchemaFormProps } from '@hi-ui/schema-core'
import { ActionsBar } from '../bar'
import { Setting, Fullscreen } from '../builtin'
import type { ActionsProps } from '../actions'
import type * as BuiltinActionsType from '../builtin'

const BuiltinActions = {
  Setting,
  Fullscreen,
}

type ToolbarActionsType = ActionsProps<AnyObject[], TableToolbarCtxType>['actions']

export type ToolbarConfigType = {
  left?: AnyGetter<CustomLeftActionRenderType>
  right?: AnyGetter<CustomRightActionRenderType>
}

type BuiltinLeftActionType = {
  setting: React.ReactElement
  fullscreen: React.ReactElement
}

type CustomLeftActionRenderType = (
  ctx: TableToolbarCtxType &
    AnyObject & {
      builtin: BuiltinLeftActionType
    }
) => ToolbarActionsType

type CustomRightActionRenderType = (ctx: TableToolbarCtxType & AnyObject) => ToolbarActionsType

export type TableToolbarCtxType = {
  tableFields: BuiltinActionsType.SettingProps['fields']
  tableCtxRef: BuiltinActionsType.SettingProps['tableRef']
  fullscreenElRef: BuiltinActionsType.FullscreenProps['elRef']
  // @ts-ignore 构建工具不识别此处的类型
  formRef?: SchemaFormProps['formRef']
}

export type TableToolbarProps = ToolbarConfigType & {
  className?: string
  ctx: TableToolbarCtxType
}

export function TableToolbar(props: TableToolbarProps) {
  const { ctx, left: getLeft, right: getRight, ...restProps } = props

  const builtin: BuiltinLeftActionType = {
    setting: (
      <BuiltinActions.Setting
        // Setting
        key="setting"
        fields={ctx.tableFields}
        tableRef={ctx.tableCtxRef}
      />
    ),
    fullscreen: (
      <BuiltinActions.Fullscreen
        // Fullscreen
        key="fullscreen"
        elRef={ctx.fullscreenElRef}
      />
    ),
  }
  const dftLeft = [
    // left
    builtin.setting,
    builtin.fullscreen,
  ]
  const left = getGetterValue(getLeft, dftLeft, [{ ...ctx, builtin }])
  const right = getGetterValue(getRight, [], [ctx])

  const className = cx('table-toolbar', props.className)
  return (
    <ActionsBar
      left={left}
      right={right}
      {...restProps}
      className={className}
      // 此处 data 的空数组是为了避开必填检验
      // 详细原因是：类型标注为表格的行数据
      // 但若从 tabCtx 上获取，会丢失实时性
      // 因此如需行数据信息，需自行从 ctx 上获取
      data={[]}
      ctx={ctx}
    />
  )
}
