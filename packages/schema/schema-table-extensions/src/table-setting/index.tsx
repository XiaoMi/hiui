import React from 'react'
import { Drawer } from '@hi-ui/drawer'
import { SettingOutlined } from '@hi-ui/icons'
import { SettingProvider } from './ctx'
import { SettingContent } from './content'
import { cls } from './utils'
import type { ColumnSetting, TableColumn } from './type'
import './index.scss'

export type TableColumnSettings = Record<string, ColumnSetting>

export type TableSettingChangeResult = {
  keys: string[]
  settings: TableColumnSettings
  grouped: {
    visibility: Record<string, boolean>
    fixed: {
      left: string[]
      right: string[]
    }
  }
}

export type TableSettingProps = {
  columns: TableColumn[]
  onChange?: (result: TableSettingChangeResult) => void
  storageKey?: string
  trigger?: React.ReactNode
}

export function TableSetting(props: TableSettingProps) {
  const [visible, setVisible] = React.useState(false)

  const handleOpen = () => setVisible(true)
  const handleCancel = () => setVisible(false)

  return (
    <>
      {React.cloneElement((props.trigger as React.ReactElement) ?? <SettingOutlined />, {
        onClick: handleOpen,
        className: cls('drawer-trigger'),
      })}

      <SettingProvider
        columns={props.columns}
        onChange={props.onChange}
        storageKey={props.storageKey}
      >
        <Drawer
          visible={visible}
          title="表格字段设置"
          className={cls('drawer')}
          placement="right"
          width={400}
          onClose={handleCancel}
        >
          <SettingContent columns={props.columns} onCancel={handleCancel} />
        </Drawer>
      </SettingProvider>
    </>
  )
}

export type { ColumnFixedType, ColumnSetting, TableColumn } from './type'
