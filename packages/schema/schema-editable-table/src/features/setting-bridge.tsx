import { useMemo } from 'react'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { TableColumn, TableSettingProps } from '@hi-ui/schema-table-extensions'
import type { TableCtxRefType } from '../table'

/**
 * 将字段配置转换为列设置需要的格式
 */
export function mapFieldsToColumns(fields: FieldConfigType[]) {
  return fields.map((field) => {
    return {
      id: field.dataIndex,
      title: (typeof field.title === 'string' ? field.title : field._titleText) || field.dataIndex,
      fixed: field.control?.fixed || false,
      hidden: field.control?.hidden,
    } as TableColumn
  })
}

export type UseTableSettingProps = {
  fields: FieldConfigType[]
  tableRef: React.RefObject<TableCtxRefType>
  storageKey?: string
  onChange?: TableSettingProps['onChange']
}

export function useTableSetting(props: UseTableSettingProps) {
  const columns = useMemo(() => mapFieldsToColumns(props.fields), [props.fields])

  // 处理列设置变更
  const handleSettingChange: TableSettingProps['onChange'] = (result) => {
    const table = props.tableRef.current?.table
    if (!table) return

    props.onChange?.(result)

    table.setState((state) => ({
      ...state,
      columnOrder: result.keys,
      columnPinning: result.grouped.fixed,
      columnVisibility: result.grouped.visibility,
    }))
  }

  return {
    columns,
    storageKey: props.storageKey,
    onChange: handleSettingChange,
  } as TableSettingProps
}
