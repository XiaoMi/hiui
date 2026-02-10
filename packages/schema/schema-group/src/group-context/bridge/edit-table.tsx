import React, { useEffect, useRef } from 'react'
import { EditTable } from '@hi-ui/schema-editable-table'
import type { TableCtxRefType, EditTableProps } from '@hi-ui/schema-editable-table'
import { useGroupFieldData } from '../data'
import type { GroupBridgeProps } from './index'

export function SchemaEditTableBridge(props: GroupBridgeProps<EditTableProps>) {
  const { dataIndex, ...rest } = props
  const dataSource = useGroupFieldData(dataIndex, { dataSource: props.defaultValue })

  const tableCtxRef = useRef<TableCtxRefType>(null)
  useEffect(() => {
    if (dataSource && Array.isArray(dataSource)) {
      tableCtxRef.current?.setDataSource(dataSource)
    }
  }, [dataSource])

  return <EditTable {...rest} innerCtxRef={tableCtxRef} defaultValue={[]} />
}
