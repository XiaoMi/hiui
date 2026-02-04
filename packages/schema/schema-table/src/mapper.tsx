// import React from 'react'
import { omit } from 'lodash-es'
import { matchFieldClass, useFieldMap } from '@hi-ui/schema-fields'
import { mergeProps } from '@hi-ui/schema-utils'
import type { TableColumnItem } from '@hi-ui/table'
import type { ProFieldRenderCellCtx } from '@hi-ui/schema-core'
import type { SchemaTableProps } from './table'

export type TableColumnMapperOpts = Pick<SchemaTableProps, 'fields' | 'fieldMap'>

export function TableColumnMapper(props: TableColumnMapperOpts) {
  const fieldMap = useFieldMap(props)

  return props.fields.map((field) => {
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

    const wrapperProps = omit(field.wrapperProps || {}, ['title', 'dataKey']) as TableColumnItem
    return mergeProps(baseProps, wrapperProps)
  })
}
