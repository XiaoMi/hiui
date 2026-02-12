import React from 'react'
import { groupBy } from 'lodash-es'
import { Input } from '@hi-ui/input'
import { Button } from '@hi-ui/button'
import { Checkbox } from '@hi-ui/checkbox'
import { SearchOutlined } from '@hi-ui/icons'
import { useSetting } from './ctx'
import { SettingList } from './list'
import { cls } from './utils'
import type { TableColumn } from './type'

export type SettingContentProps = {
  columns: TableColumn[]
  onCancel: () => void
}

export function SettingContent(props: SettingContentProps) {
  const {
    // settings
    settings,
    searchKey,
    setSearchKey,
    updateSetting,
    resetSettings,
    applySettings,
  } = useSetting()

  // 根据固定状态分组
  const { leftColumns, centerColumns, rightColumns } = React.useMemo(() => {
    const grouped = groupBy(props.columns, (col) => {
      return settings[col.id]?.fixed || 'center' // 没有 fixed 值时归类到 center
    })

    return {
      leftColumns: grouped.left || [],
      centerColumns: grouped.center || [],
      rightColumns: grouped.right || [],
    }
  }, [props.columns, settings])

  // 搜索过滤
  const filterColumns = (cols: TableColumn[]) => {
    if (!searchKey) return cols
    return cols.filter((col) => col.title.toLowerCase().includes(searchKey.toLowerCase()))
  }

  // 全选状态
  const allSelected = React.useMemo(() => {
    return Object.values(settings).every((s) => s.visible)
  }, [settings])

  const indeterminate = React.useMemo(() => {
    const values = Object.values(settings)
    return values.some((s) => s.visible) && !values.every((s) => s.visible)
  }, [settings])

  // 处理确认，需要组合多个操作
  const handleConfirm = () => {
    applySettings()
    props.onCancel()
  }

  // 简单的事件处理函数，直接内联
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value)
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    Object.keys(settings).forEach((id) => {
      updateSetting(id, { visible: e.target.checked })
    })
  }

  return (
    <div className={cls('container')}>
      <div className={cls('search')}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索字段"
          value={searchKey}
          onChange={handleSearch}
        />
      </div>

      {leftColumns.length > 0 && (
        <SettingList title="固定在左侧" columns={filterColumns(leftColumns)} />
      )}

      <SettingList title="不固定" columns={filterColumns(centerColumns)} />

      {rightColumns.length > 0 && (
        <SettingList title="固定在右侧" columns={filterColumns(rightColumns)} />
      )}

      <div className={cls('footer')}>
        <Checkbox checked={allSelected} indeterminate={indeterminate} onChange={handleSelectAll}>
          全选
        </Checkbox>

        <div>
          <Button onClick={resetSettings}>重置</Button>
          <Button type="primary" onClick={handleConfirm}>
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}
