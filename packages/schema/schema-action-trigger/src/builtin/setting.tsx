import React from 'react'
import { SettingOutlined } from '@hi-ui/icons'
import { TableSetting, type TableSettingProps } from '@hi-ui/schema-table-extensions'
import type { FieldConfigType } from '@hi-ui/schema-core'
// import { useTableSetting } from '@mi/schema-components/renderers/editable-table/features/setting-bridge'
// import type {
//   EditTableProps,
//   UseTableSettingProps,
// } from '@mi/schema-components/renderers/editable-table'

export type SettingProps = {
  fields: FieldConfigType[] // TODO EditTableProps['fields']
  tableRef: React.RefObject<AnyObject> // TODO NonNullable<EditTableProps['innerCtxRef']>
  storageKey?: string // TODO UseTableSettingProps['storageKey']
}

// TODO 待实现
const useTableSetting = (args: AnyObject): TableSettingProps => {
  return { columns: args ? [] : [] }
}

export function Setting(props: SettingProps) {
  const settingProps = useTableSetting({
    fields: props.fields,
    tableRef: props.tableRef,
    storageKey: props.storageKey,
  })

  return <TableSetting {...settingProps} trigger={<SettingOutlined />} />
}
