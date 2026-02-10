import React from 'react'
import { SchemaForm, type SchemaFormProps } from '@hi-ui/schema-form'
import { useGroupFieldData } from '../data'
import type { GroupBridgeProps } from './index'

export function SchemaFormBridge(props: GroupBridgeProps<SchemaFormProps>) {
  const { dataIndex, ...rest } = props
  const initialValues = useGroupFieldData(dataIndex, { dataSource: props.initialValues })

  return <SchemaForm {...rest} initialValues={initialValues} />
}
