import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import {
  LockOutlined,
  DownOutlined,
  ColumnHeightOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'
import Popper from '@hi-ui/popper'
import { useToggle } from '@hi-ui/use-toggle'
import { useTableContext } from './context'
import { FlattedTableColumnItemData } from './types'

const _prefix = getPrefixCls('table-column-menu')

/**
 * 表头每列下拉式菜单，包含冻结、高亮、递增、递减操作
 */
export const TableColumnMenu = forwardRef<HTMLDivElement | null, TableColumnMenuProps>(
  ({ prefixCls = _prefix, column }, ref) => {
    const {
      activeSorterType,
      activeSorterColumn,
      setActiveSorterType,
      setActiveSorterColumn,
      leftFreezeColumn,
      setLeftFreezeColumn,
      isHighlightedCol,
      onHighlightedColChange,
    } = useTableContext()

    const { id: dataKey, raw: columnRaw } = column
    const canSort = !!columnRaw.sorter

    const [menuVisible, menuVisibleAction] = useToggle()
    const [menuTrigger, setMenuTrigger] = React.useState<HTMLButtonElement | null>(null)

    return (
      <>
        <IconButton
          className={`${prefixCls}__trigger`}
          ref={setMenuTrigger}
          onClick={menuVisibleAction.not}
          icon={<DownOutlined />}
        />

        <Popper
          className={`${prefixCls}__popper`}
          visible={menuVisible}
          attachEl={menuTrigger}
          onClose={menuVisibleAction.off}
          // @DesignToken zIndex: `overlay`
          zIndex={1050}
        >
          <div className={`${prefixCls}__content`}>
            {canSort ? (
              <TableColumnMenuItem
                prefixCls={prefixCls}
                active={activeSorterType === 'ascend' && activeSorterColumn === dataKey}
                // {/* TODO: 国际化 */}
                // {/* {localeDatas.table.ascend} */}
                content={'递增'}
                icon={<SortAscendingOutlined />}
                onSwitch={(shouldActive) => {
                  if (shouldActive) {
                    setActiveSorterType('ascend')
                    setActiveSorterColumn(dataKey)
                  } else {
                    setActiveSorterType(null)
                    setActiveSorterColumn(null)
                  }

                  menuVisibleAction.off()
                }}
              />
            ) : null}

            {canSort ? (
              <TableColumnMenuItem
                prefixCls={prefixCls}
                active={activeSorterType === 'descend' && activeSorterColumn === dataKey}
                // {/* TODO: 国际化 */}
                // {/* {localeDatas.table.descend} */}
                content={'递减'}
                icon={<SortDescendingOutlined />}
                onSwitch={(shouldActive) => {
                  if (shouldActive) {
                    setActiveSorterType('descend')
                    setActiveSorterColumn(dataKey)
                  } else {
                    setActiveSorterType(null)
                    setActiveSorterColumn(null)
                  }

                  menuVisibleAction.off()
                }}
              />
            ) : null}

            <TableColumnMenuItem
              prefixCls={prefixCls}
              active={isHighlightedCol(dataKey)}
              // {/* TODO: 国际化 */}
              // {/* {localeDatas.table.highlight} */}
              content={'高亮'}
              icon={<ColumnHeightOutlined />}
              onSwitch={(shouldActive) => {
                onHighlightedColChange(column, shouldActive)

                menuVisibleAction.off()
              }}
            />

            <TableColumnMenuItem
              prefixCls={prefixCls}
              active={leftFreezeColumn === dataKey}
              // {/* TODO: 国际化 */}
              // {/* {localeDatas.table.freeze} */}
              content={'冻结'}
              icon={<LockOutlined />}
              onSwitch={(shouldActive) => {
                if (shouldActive) {
                  setLeftFreezeColumn(dataKey)
                } else {
                  setLeftFreezeColumn('')
                }

                menuVisibleAction.off()
              }}
            />
          </div>
        </Popper>
      </>
    )
  }
)

export interface TableColumnMenuProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 表格当前列配置信息
   */
  column: FlattedTableColumnItemData
}

if (__DEV__) {
  TableColumnMenu.displayName = 'TableColumnMenu'
}

export const TableColumnMenuItem = ({
  prefixCls,
  active,
  onSwitch,
  content,
  icon,
}: {
  prefixCls?: string
  active: boolean
  onSwitch: (shouldActive: boolean) => void
  icon?: React.ReactNode
  content?: React.ReactNode
}) => {
  return (
    <div
      className={cx(`${prefixCls}__item`, active && `${prefixCls}__item--active`)}
      onClick={() => onSwitch(!active)}
    >
      <span>{content}</span>
      {icon}
    </div>
  )
}
