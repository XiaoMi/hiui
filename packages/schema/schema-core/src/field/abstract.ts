import React from 'react'
import type { EllipsisTooltipProps } from '@hi-ui/ellipsis-tooltip'
import type { EnhancedFormRefType, FormBindingProps } from '../interface'
import type { FieldConfigType } from './type'

// 字段组件的通用props
export type ProFieldProps = UnknownObject & {
  tooltipClassName?: string
  numberOfLines?: EllipsisTooltipProps['numberOfLines']
}

export type ProFieldRenderCtx<FieldProps = AnyObject, WrapperProps = AnyObject> = {
  field: FieldConfigType<FieldProps, WrapperProps>
  /** description关联的数据对象 */
  rowData: AnyObject
  /** 原始数据 */
  rawData: AnyObject
}

export type ProFieldRenderCellCtx<FieldProps = AnyObject, WrapperProps = AnyObject> = {
  field: FieldConfigType<FieldProps, WrapperProps>
  /** 表格行数据 */
  rowData: AnyObject // 其实就是 rowItem
  /** 原始数据 */
  rawData: AnyObject
  // 这两个是表格特有的上下文
  // rowItem: AnyObject
  /** 行索引 */
  rowIndex: number
  /** 数据key */
  dataKey: string
}

export type ProFieldRenderFooterCellCtx<FieldProps = AnyObject, WrapperProps = AnyObject> = {
  field: FieldConfigType<FieldProps, WrapperProps>
  /** 全量表格数据 */
  tableData: AnyObject[]
  /** 当前字段全部行的数据 */
  fieldData: unknown[]
}

export type ProFieldRenderFormItemCtx<FieldProps = AnyObject, WrapperProps = AnyObject> = {
  field: FieldConfigType<FieldProps, WrapperProps>
  formBinding: FormBindingProps
  rawData: AnyObject
  formRef: EnhancedFormRefType
}

export type ProFieldRenderEditableCtx<FieldProps = AnyObject, WrapperProps = AnyObject> = {
  field: FieldConfigType<FieldProps, WrapperProps>
  rowData: AnyObject
  /** 原始数据 */
  rawData: AnyObject
  formBinding: FormBindingProps
  formRef: EnhancedFormRefType

  onActivate?: () => void
  onDeactivate?: () => void

  /** 行索引，表格必传 */
  rowIndex?: ProFieldRenderCellCtx['rowIndex']
  /** 数据key，表格必传 */
  dataKey?: ProFieldRenderCellCtx['dataKey']
}

export type ProFieldRenderEditCellCtx<
  FieldProps = AnyObject,
  WrapperProps = AnyObject
> = ProFieldRenderFormItemCtx<FieldProps, WrapperProps> & {
  /** 表格行数据 */
  rowData: AnyObject
  /** 原始数据 */
  rawData: AnyObject
  /** 行索引 */
  rowIndex: number
  /** 数据key */
  dataKey: string
}

export abstract class AbstractProField {
  /** 只读模式的渲染逻辑 */
  abstract render(data: unknown, ctx: ProFieldRenderCtx<AnyType>): React.ReactNode
  /** 表格单元格渲染逻辑 */
  abstract renderCell(data: unknown, ctx: ProFieldRenderCellCtx<AnyType>): React.ReactNode
  /** 表格 Footer 单元格渲染逻辑 */
  abstract renderFooterCell(ctx: ProFieldRenderFooterCellCtx<AnyType>): React.ReactNode
  /** 表单编辑模式的渲染逻辑，会自动注入value, onChange */
  abstract renderFormItem(data: null, ctx: ProFieldRenderFormItemCtx): React.ReactNode
  /** 只读组件的可编辑模式的渲染逻辑，渲染一个非激活状态的占位组件 */
  abstract renderEditable(data: unknown, ctx: ProFieldRenderEditableCtx): React.ReactNode
  /** 表格编辑模式的渲染逻辑，会自动注入value, onChange */
  // abstract renderEditCell(data: unknown, ctx: ProFieldRenderEditCellCtx): React.ReactNode
}

export type FieldRendererType = Partial<{
  [K in keyof AbstractProField as K extends 'constructor'
    ? never
    : K]: AbstractProField[K] extends AnyFn ? AbstractProField[K] : never
}>
