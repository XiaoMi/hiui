import React from 'react'
import { SchemaDescriptions, type SchemaDescriptionsProps } from '@hi-ui/schema-descriptions'
import { useGroupFieldData } from '../data'
import type { GroupBridgeProps } from './index'

export function SchemaDescriptionsBridge(props: GroupBridgeProps<SchemaDescriptionsProps>) {
  const { dataIndex, ...rest } = props
  const dataSource = useGroupFieldData(dataIndex, { dataSource: props.dataSource })

  return <SchemaDescriptions {...rest} dataSource={dataSource} />
}
