import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UseTableProps } from './use-table'
import { EllipsisVerticalOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'
import { useToggle } from '@hi-ui/use-toggle'
import { TableSettingMenuDrawer } from './TableSettingMenuDrawer'

const _prefix = getPrefixCls('table-setting')

/**
 * 表头右侧高级设置菜单（抽屉式）
 */
export const TableSettingMenu = forwardRef<HTMLDivElement | null, TableColumnMenuProps>(
  (
    {
      prefixCls = _prefix,
      uniqueId,
      columns,
      hiddenColKeys,
      onHiddenColKeysChange,
      sortedColKeys,
      onSortedColKeysChange,
      onSetColKeysChange,
      checkDisabledColKeys = [],
    },
    ref
  ) => {
    const [menuVisible, menuVisibleAction] = useToggle()

    const cls = cx(prefixCls)

    return (
      <div ref={ref} className={cls}>
        <IconButton icon={<EllipsisVerticalOutlined />} onClick={menuVisibleAction.not} />

        <TableSettingMenuDrawer
          visible={menuVisible}
          onClose={menuVisibleAction.off}
          uniqueId={uniqueId}
          columns={columns}
          hiddenColKeys={hiddenColKeys}
          onHiddenColKeysChange={onHiddenColKeysChange}
          sortedColKeys={sortedColKeys}
          onSortedColKeysChange={onSortedColKeysChange}
          onSetColKeysChange={onSetColKeysChange}
          checkDisabledColKeys={checkDisabledColKeys}
        />
      </div>
    )
  }
)

export interface TableColumnMenuProps extends UseTableProps {
  prefixCls?: string
  checkDisabledColKeys?: string[]
  onSetColKeysChange?: (sortedColKeys: string[], hiddenColKeys: string[]) => void
  hiddenColKeys?: string[]
  onHiddenColKeysChange?: (hiddenColKeys: string[]) => void
  sortedColKeys?: string[]
  onSortedColKeysChange?: (sortedColKeys: string[]) => void
}

if (__DEV__) {
  TableSettingMenu.displayName = 'TableSettingMenu'
}
