// import React from 'react'
import { omit } from 'lodash-es'
import { matchFieldClass, useFieldMap } from '@hi-ui/schema-fields'
import { mergeProps } from '@hi-ui/schema-utils'
import type { TableColumnItem } from '@hi-ui/table'
import type { FieldConfigType, ProFieldRenderCellCtx } from '@hi-ui/schema-core'
import type { SchemaTableProps } from './table'
import type { ProFieldMapType } from '@hi-ui/schema-fields'

export type TableColumnMapperOpts = Pick<SchemaTableProps, 'fields' | 'fieldMap'>

export function TableColumnMapper(props: TableColumnMapperOpts) {
  function mapFieldToColumn(
    field: FieldConfigType<AnyObject, Partial<TableColumnItem>>,
    fieldMap: ProFieldMapType
  ): TableColumnItem {
    const baseProps: TableColumnItem = {
      title: field.title,
      dataKey: field.dataIndex,
      render(text, rowItem, rowIndex, dataKey) {
        const ctx = {
          field,
          rowData: rowItem,
          rawData: rowItem,
          rowIndex,
          dataKey,
        } as ProFieldRenderCellCtx

        // 优先使用 renderCell
        if (field.renderer?.renderCell) {
          return field.renderer.renderCell(text, ctx)
        }
        // 其次使用 render，与 ProField 的渲染逻辑一致
        if (field.renderer?.render) {
          return field.renderer.render(text, ctx)
        }

        const FieldClass = matchFieldClass({ name: 'SchemaTable', field, fieldMap })
        const fieldRenderer = new FieldClass()
        return fieldRenderer.renderCell(text, ctx)
      },
    }

    // 存在嵌套字段时递归处理
    if (field.children?.length) {
      baseProps.children = field.children.map((child) => mapFieldToColumn(child, fieldMap))
    }

    const wrapperProps = omit(field.wrapperProps || {}, [
      'title',
      'dataKey',
      'children',
    ]) as TableColumnItem
    return mergeProps(baseProps, wrapperProps)
  }

  const fieldMap = useFieldMap(props)
  return props.fields.map((field) => mapFieldToColumn(field, fieldMap))
}
