import React from 'react'
import { cx } from '@hi-ui/classname'
import { Table } from '@hi-ui/table'
import { mergeProps } from '@hi-ui/schema-utils'
import { Empty } from '@hi-ui/table-extensions'
import type { TableProps, TableColumnItem } from '@hi-ui/table'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { UseFieldMapOpts } from '@hi-ui/schema-fields'
import { TableColumnMapper } from './mapper'
import './index.scss'

// @doc-comment-start code-block
// ---
// title: SchemaTableProps
// api:
//   for: table.basic
//   order: 10
// ---
export type SchemaTableProps = UseFieldMapOpts & {
  fields: FieldConfigType<AnyObject, Partial<TableColumnItem>>[]
  dataSource: AnyObject[]
  className?: string
  tableProps?: DeepPartial<Omit<TableProps, 'className'>>
}
// @doc-comment-end code-block

export function SchemaTable(props: SchemaTableProps) {
  const dftProps: TableProps = {
    size: 'sm',
    emptyContent: <Empty />,
    bordered: true,
    fieldKey: 'id',
  }
  const finalProps = mergeProps(dftProps, props.tableProps as TableProps, {
    className: cx('schema-table', props?.className),
    data: props.dataSource || [],
    columns: TableColumnMapper({ ...props }),
  })

  return <Table {...finalProps}></Table>
}
