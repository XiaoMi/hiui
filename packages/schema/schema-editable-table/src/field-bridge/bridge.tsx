import React, { useEffect, useRef } from 'react'
import { omit } from 'lodash-es'
import { useControllableValue } from 'ahooks'
import { useSchemaFormCtx } from '@hi-ui/schema-form'
import { mergeProps } from '@hi-ui/schema-utils'
import type { ToolbarConfigType } from '@hi-ui/schema-action-trigger'
import { EditTable } from '../index'
import type { EditTableProps, TableCtxRefType } from '../index'
import { Toolbar } from './toolbar'

export type EditTableBridgeInnerCtxType = {
  tableCtx: TableCtxRefType | null
}

export type EditTableBridgeProps = EditTableProps & {
  toolbar?: false | ToolbarConfigType
  actions?: ToolbarConfigType['right']
  /** 捕获 innerCtxRef 引用 */
  catchInnerCtx?: (ctx: EditTableBridgeInnerCtxType) => void
  /**
   * 不要触发完全重渲染
   * - 默认情况时，表单绑定的数据变化时，会触发完全重渲染
   * - 本质是给 subscription.setValue 传入 complete: false
   */
  doNotCompleteRerender?: boolean // 其实只应该传入真值
}

export function EditTableBridge(props: EditTableBridgeProps) {
  const wrapperElRef = useRef<HTMLDivElement>(null)

  const { formRef } = useSchemaFormCtx()
  const tableCtxRef = useRef<TableCtxRefType>(null)

  const [values, setValues] = useControllableValue<AnyObject[]>(props)

  // value 变更时，需经过 subscription 主动设置，方可生效
  useEffect(() => {
    const complete = !props.doNotCompleteRerender
    tableCtxRef.current?.subscription.setValue(props.value || [], { complete })
  }, [props.value, tableCtxRef, props.doNotCompleteRerender])

  const handleValuesChange: EditTableProps['onValuesChange'] = (changed, allValues) => {
    // console.log('handleValuesChange',changed, allValues)
    props.onValuesChange?.(changed, allValues)
    setValues(allValues)
  }

  const finalProps = mergeProps(
    {
      fields: props.fields,
      sticky: true,
    },
    omit(props, [
      // 移除无关的属性
      'value',
      'defaultValue',
      'onChange',
      'innerCtxRef',
      'catchInnerCtx',
    ])
  )

  // 捕获内部引用
  props.catchInnerCtx?.({
    tableCtx: tableCtxRef.current,
  })

  return (
    <div className="pro-edit-table" ref={wrapperElRef}>
      {props.toolbar === false ? null : (
        <Toolbar
          ctx={{
            tableFields: finalProps.fields,
            tableCtxRef,
            fullscreenElRef: wrapperElRef,
            formRef,
            readonly: props.readonly,
          }}
          left={props.toolbar?.left}
          right={props.actions || props.toolbar?.right}
        />
      )}

      <EditTable
        {...finalProps}
        defaultValue={values} // NOTE 仅会在初次渲染时生效
        innerCtxRef={tableCtxRef}
        onValuesChange={handleValuesChange}
      />
    </div>
  )
}
