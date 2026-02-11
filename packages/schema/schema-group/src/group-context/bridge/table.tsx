import React from 'react'
import { SchemaTable, type SchemaTableProps } from '@hi-ui/schema-table'
import { useGroupFieldData } from '../data'
import type { GroupBridgeProps } from './index'

export function SchemaTableBridge(props: GroupBridgeProps<SchemaTableProps>) {
  const { dataIndex, ...rest } = props
  const dataSource = useGroupFieldData(dataIndex, { dataSource: props.dataSource })

  return <SchemaTable {...rest} dataSource={dataSource} />
}
