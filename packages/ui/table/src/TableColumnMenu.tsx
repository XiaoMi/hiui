// @ts-nocheck
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { UseTableProps } from './use-table'
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

const _role = 'TableColumnMenu'
const _prefix = getPrefixCls('table-column-menu')

/**
 * TODO: What is Table
 */
export const TableColumnMenu = forwardRef<HTMLDivElement | null, TableColumnMenuProps>(
  ({ prefixCls = _prefix, role = _role, className, columnKey, column, ...rest }, ref) => {
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

    const canSort = !!column.raw.sorter

    const [menuVisible, menuVisibleAction] = useToggle()
    const [menuTrigger, setMenuTrigger] = React.useState<HTMLDivElement | null>(null)

    // TODO：处理 column 模型支持 cellRender，一直出 checkbox、expandIcon 高级选项
    return (
      <>
        {/* @ts-ignore */}
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
                active={activeSorterType === 'ascend' && activeSorterColumn === columnKey}
                // {/* TODO: 国际化 */}
                // {/* {localeDatas.table.ascend} */}
                content={'递增'}
                icon={<SortAscendingOutlined />}
                onClick={() => {
                  if (activeSorterType === 'ascend' && activeSorterColumn === columnKey) {
                    setActiveSorterType(null)
                    setActiveSorterColumn(null)
                  } else {
                    setActiveSorterType('ascend')
                    setActiveSorterColumn(columnKey)
                  }
                  menuVisibleAction.off()
                }}
              />
            ) : null}

            {canSort ? (
              <TableColumnMenuItem
                prefixCls={prefixCls}
                active={activeSorterType === 'descend' && activeSorterColumn === columnKey}
                // {/* TODO: 国际化 */}
                // {/* {localeDatas.table.descend} */}
                content={'递减'}
                icon={<SortDescendingOutlined />}
                onClick={() => {
                  if (activeSorterType === 'descend' && activeSorterColumn === columnKey) {
                    setActiveSorterType(null)
                    setActiveSorterColumn(null)
                  } else {
                    setActiveSorterType('descend')
                    setActiveSorterColumn(columnKey)
                  }
                  menuVisibleAction.off()
                }}
              />
            ) : null}

            <TableColumnMenuItem
              prefixCls={prefixCls}
              active={isHighlightedCol(columnKey)}
              // {/* TODO: 国际化 */}
              // {/* {localeDatas.table.highlight} */}
              content={'高亮'}
              icon={<ColumnHeightOutlined />}
              onClick={() => {
                onHighlightedColChange(column, !isHighlightedCol(columnKey))
                menuVisibleAction.off()
              }}
            />

            <TableColumnMenuItem
              prefixCls={prefixCls}
              active={leftFreezeColumn === columnKey}
              // {/* TODO: 国际化 */}
              // {/* {localeDatas.table.freeze} */}
              content={'冻结'}
              icon={<LockOutlined />}
              onClick={() => {
                if (leftFreezeColumn === columnKey) {
                  setLeftFreezeColumn(null)
                } else {
                  setLeftFreezeColumn(columnKey)
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

export interface TableColumnMenuProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onDrop' | 'draggable' | 'onDragStart'>,
    UseTableProps {
  columnKey?: string
  column?: object
}

if (__DEV__) {
  TableColumnMenu.displayName = 'TableColumnMenu'
}

export const TableColumnMenuItem = ({ prefixCls, active, onClick, content, icon }: any) => {
  return (
    <div
      className={cx(`${prefixCls}__item`, active && `${prefixCls}__item--active`)}
      onClick={onClick}
    >
      <span>{content}</span>
      {icon}
    </div>
  )
}
