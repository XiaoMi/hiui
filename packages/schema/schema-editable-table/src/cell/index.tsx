import React from 'react'
import { isEqual } from 'lodash-es'
import type { CellContext } from '@tanstack/react-table'
import {
  useMatchFieldClass,
  runDynamicEditable,
  useReadonly,
  isSimpleCase,
  SimpleCase,
  ReadonlyCase,
  EditableCase,
} from '@hi-ui/schema-fields'
import { useSubscribeList, type ArrayPathInput } from '@hi-ui/use-subscription'
import type { FieldConfigType, ProFieldRenderEditCellCtx } from '@hi-ui/schema-core'
import type { ProFieldMapType, EditableCaseProps } from '@hi-ui/schema-fields'
import { SELECTED_OPTION_RAW } from '../const'
import { useEditableSchemaTableCtx } from '../ctx'
import { useRuntimeRowEditable } from '../features/row-edit'
import { useEditingCellFormBinding } from './editing'
import { execCellDepsProcess } from './dependency'

type EditCellProps<TData extends AnyObject> = CellContext<TData, unknown> &
  Pick<EditableCaseProps, 'FieldClass' | 'defaultActive'>

const EditableCell = React.memo(
  function EditableCellCore<TData extends AnyObject>(props: EditCellProps<TData>) {
    const field = props.column.columnDef.meta?.field as FieldConfigType

    const formBinding = useEditingCellFormBinding(props)

    const { subscription: tableValue, globalStaticRef } = useEditableSchemaTableCtx()
    const enableRowEdit = globalStaticRef.current.enableRowEdit

    const rowIndex = props.row.index
    const dataKey = props.column.id
    const rowData = tableValue.getValue()[rowIndex]

    const fieldDeps = (field?.dependency?.deps || []).map(
      (dep) => [rowIndex, dep] as [number, unknown]
    )

    const { fieldValue, changedDepValues, ...rest } = useSubscribeList(
      tableValue,
      [[rowIndex, dataKey], ...(fieldDeps as ArrayPathInput<AnyObject>[])],
      {
        // 此处单元格全部可编辑，全部创建监听
        skipSubscribe: false,
        // 行编辑模式下，从 draft 中获取值
        getFieldValueFromDraft: enableRowEdit,
      }
    )

    if (!field) return null
    formBinding.value = fieldValue
    const nextField = {
      ...field,
      payload: {
        ...field.payload,
        setSelectedRawOption: (values?: AnyObject) => {
          if (enableRowEdit) {
            // 行编辑模式：需要获取最新的 draft 数据
            const draftRowData = tableValue.getDraft()?.[rowIndex] || {}
            const currentData = draftRowData[SELECTED_OPTION_RAW] || {}
            const updatedData = { ...currentData, [dataKey]: values }

            tableValue.mergeDraft({
              [rowIndex]: { [SELECTED_OPTION_RAW]: updatedData },
            })
          } else {
            // 普通模式：从当前 rowData 获取数据
            const currentData = rowData[SELECTED_OPTION_RAW] || {}
            const updatedData = { ...currentData, [dataKey]: values }
            tableValue.mergeSilently({
              [rowIndex]: { [SELECTED_OPTION_RAW]: updatedData },
            })
          }
        },
      },
    }
    const fieldProps: EditableCaseProps = {
      value: fieldValue,
      field: nextField,
      FieldClass: props.FieldClass,
      ctx: {
        field: nextField,
        rowData,
        rawData: rowData,
        formBinding,
        rowIndex,
        dataKey,
        formRef: { current: null }, // TODO 待补充实现
      } as ProFieldRenderEditCellCtx,
      // 行编辑模式下，失焦时保持激活状态
      keepActiveOnBlur: enableRowEdit,
      defaultActive: props.defaultActive,
    }

    execCellDepsProcess({
      fieldProps,
      rowData,
      rowIndex,
      dataKey,
      changedDepValues,
      changedFieldNames: rest.changedFieldNames as string[],
      tableValue,
    })

    return <EditableCase {...fieldProps} />
  },
  (prev, next) => {
    // 如果 column 配置要求总是更新，则返回 false 触发重渲染
    if (prev.column.columnDef.meta?.shouldUpdate) return false

    // 如果 defaultActive 为 true，则直接重渲染
    // TODO 此处仍有BUG，会在行交换时触发
    // 暂时记录，待后续优化
    if (prev.defaultActive) return false

    // NOTE Cell 暂时始终打开值比较 待补充其他case
    // 其余时候比较关键数据是否相等
    return isEqual(prev.getValue(), next.getValue())
  }
) as <TData extends AnyObject>(props: EditCellProps<TData>) => React.ReactElement
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 关闭 displayName 检查
EditableCell.displayName = 'EditableCell'

const CustomCell = React.memo(
  // CustomCell 中的 Custom 是指包含自定义渲染
  function CustomCellCore<TData extends AnyObject>(props: CellContext<TData, unknown>) {
    const field = props.column.columnDef.meta?.field as FieldConfigType
    const { subscription: tableValue, propsRef } = useEditableSchemaTableCtx()

    const FieldClass = useMatchFieldClass({
      name: 'TableCellWrapper',
      field,
      fieldMap: props.table.options.meta?.fieldMap as ProFieldMapType,
    })

    // 行编辑状态变更时会触发组件重渲染
    const runtimeEditable = useRuntimeRowEditable(props.row.index)
    const selfReadonly = useReadonly(field, runtimeEditable)

    const readonly = !runDynamicEditable(field, selfReadonly, () => ({
      type: 'edit-table',
      rowIndex: props.row.index,
      rowId: props.row.id,
      columnIndex: props.column.getIndex(),
      columnId: props.column.id,
      rawData: props.row.$getRealtimeRowData(),
    }))

    // 2. 只读状态使用 ReadonlyCase
    if (readonly) {
      const dataKey = props.column.id
      const { index: rowIndex } = props.row
      const rowData = tableValue.getValue()[rowIndex]
      const value = props.table.options.meta?.getCellValue(rowIndex, dataKey) ?? props.getValue()

      return (
        <ReadonlyCase
          usedBy="table"
          value={value}
          field={field}
          FieldClass={FieldClass}
          ctx={{ field, rowData, rawData: rowData, rowIndex, dataKey }}
        />
      )
    }

    // 3. 可编辑状态使用 MemoCell
    return (
      <EditableCell
        {...props}
        FieldClass={FieldClass}
        defaultActive={propsRef.current.defaultActive} // 用来在 propsAreEqual 中判断是否需要重渲染
      />
    )
  }
) as <TData extends AnyObject>(props: CellContext<TData, unknown>) => React.ReactElement
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 关闭 displayName 检查
CustomCell.displayName = 'CustomCell'

// NOTE 此处之所以要分为 DftCell -> CustomCell -> EditableCell 三层，是因为需要区分出【简单】【只读】【可编辑】的字段
// 【简单】字段：无自定义渲染，无依赖，无表单绑定，无监听，只有最单纯的 DOM 渲染
// 【只读】字段：有自定义渲染，无依赖，无表单绑定，无监听 // TODO 后续只读部分可能会需要支持deps
// 【可编辑】字段：有自定义渲染，有依赖，有控制，有表单绑定，有监听

export default function DftCell<TData extends AnyObject>(props: CellContext<TData, unknown>) {
  const field = props.column.columnDef.meta?.field as FieldConfigType

  if (!field) {
    // 此处拦截，必须有 field 配置，否则报错
    throw new Error('DftCell: field is required')
  }

  // 1. 简单字段且无自定义渲染，使用 SimpleCase
  if (isSimpleCase(field)) {
    return <SimpleCase value={props.getValue()} />
  }

  return <CustomCell {...props} />
}

export { default as HeaderCell } from './header'
export { default as FooterCell } from './footer'
export { default as AggregatedCell } from './aggregated'
export { type CustomCellType } from './custom'
